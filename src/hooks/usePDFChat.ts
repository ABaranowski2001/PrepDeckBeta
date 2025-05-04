import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFileState } from "@/contexts/ModuleContext";
import { debugLog } from '@/utils/debugUtils';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatResult {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
}

const WEBHOOK_URL = 'https://hook.eu2.make.com/n5m4r8u4olptw6eyegfilwfijeqaukgu';

/**
 * Hook: Handles PDF chat functionality using webhook
 */
export const usePDFChat = (): ChatResult => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user?.id || !currentFile?.name) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create new user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);

    try {
      // Prepare request payload
      const payload = {
        user_id: user.id,
        file_name: currentFile.name,
        question: content,
        timestamp: new Date().toISOString()
      };

      debugLog('info', 'usePDFChat', 'Sending question to webhook', payload);

      // Send request to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      // First try to get text response
      const responseText = await response.text();
      debugLog('info', 'usePDFChat', 'Received text response from webhook', { responseText });
      
      // Create assistant message from response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: responseText || 'Sorry, I couldn\'t find an answer to your question.',
        role: 'assistant',
        timestamp: new Date()
      };

      // Add assistant message to chat
      setMessages(prev => [...prev, assistantMessage]);
      
      debugLog('info', 'usePDFChat', 'Processed answer from webhook', { answer: assistantMessage.content });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      debugLog('error', 'usePDFChat', 'Error in chat', { error: errorMessage });
      setError(`Error: ${errorMessage}`);
      
      // Create error message
      const errorResponseMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        content: 'Sorry, there was an error processing your question. Please try again later.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentFile?.name]);

  return { messages, isLoading, error, sendMessage };
}; 