import { useState, useEffect, useCallback } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';
import { ChatMessage } from '@/hooks/usePDFChat';
import { useAuth } from '@/contexts/AuthContext';
import { useFileState } from '@/contexts/ModuleContext';

// Chat module state interface
export interface ChatModuleState extends BaseModuleState {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  updateUserData: (user: {id: string} | null) => void;
  updateFileData: (file: {name: string} | null) => void;
}

// Webhook URL for PDF chat
const WEBHOOK_URL = 'https://hook.eu2.make.com/n5m4r8u4olptw6eyegfilwfijeqaukgu';

// Create chat module state
export const createChatModule = (): ChatModuleState => {
  const baseState = createBaseModuleState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // We'll store the current user and file info in state
  const [userData, setUserData] = useState<{id: string | null}>({ id: null });
  const [fileData, setFileData] = useState<{name: string | null}>({ name: null });
  
  // Subscribe to auth and file state changes
  useEffect(() => {
    // This is a placeholder - we'll get real values when components use this context
    const unsubscribeAuth = subscribeToAuthChanges((user: {id: string} | null) => {
      setUserData({ id: user?.id || null });
    });
    
    const unsubscribeFile = subscribeToFileChanges((file: {name: string} | null) => {
      setFileData({ name: file?.name || null });
    });
    
    // Cleanup
    return () => {
      unsubscribeAuth();
      unsubscribeFile();
    };
  }, []);
  
  // These are dummy functions since we'll get the real auth and file data from the components
  const subscribeToAuthChanges = (callback: (user: any) => void) => {
    // In a real implementation, this would hook into auth state
    return () => {};
  };
  
  const subscribeToFileChanges = (callback: (file: any) => void) => {
    // In a real implementation, this would hook into file state
    return () => {};
  };
  
  // Send message to webhook
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    baseState.setError(null);

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get user and file info from component props instead
      const userId = userData.id;
      const fileName = fileData.name;
      
      if (!userId || !fileName) {
        console.log("Missing user or file data in chat module");
      }

      // Prepare payload
      const payload = {
        user_id: userId || 'unknown',
        file_name: fileName || 'unknown',
        question: content,
        timestamp: new Date().toISOString()
      };

      // Send to webhook
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

      // Get text response instead of JSON
      const responseText = await response.text();
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: responseText || 'Sorry, I couldn\'t find an answer to your question.',
        role: 'assistant',
        timestamp: new Date()
      };

      // Add assistant message
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      baseState.setError(`Error: ${errorMessage}`);
      
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
  }, [userData.id, fileData.name, baseState]);
  
  return {
    ...baseState,
    messages,
    setMessages,
    isLoading,
    addMessage: (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    },
    sendMessage,
    reset: () => {
      baseState.reset();
      setMessages([]);
    },
    // Method for components to update user data
    updateUserData: (user: {id: string} | null) => {
      setUserData({ id: user?.id || null });
    },
    // Method for components to update file data
    updateFileData: (file: {name: string} | null) => {
      setFileData({ name: file?.name || null });
    }
  };
};
