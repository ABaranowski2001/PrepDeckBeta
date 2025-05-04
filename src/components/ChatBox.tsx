
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, SmilePlus, Paperclip } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Message } from '@/types/common';
import { handleGenericError } from '@/utils/errorHandling';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatBoxProps {
  title?: string;
  documentTitle?: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBox = ({ 
  title = "Chat Assistant", 
  documentTitle = "your documents", 
  messages, 
  setMessages 
}: ChatBoxProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentFile } = useContent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const fullFileName = currentFile ? currentFile.name : documentTitle;
      
      // Get content from the file for context
      const fileContext = currentFile ? 
        `The question is about a file named ${fullFileName}.` : 
        `The question is about ${documentTitle}.`;
      
      // Simulate AI response generation with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate an AI response based on user's query
      let responseContent = '';
      const query = inputValue.toLowerCase();
      
      if (query.includes('summary') || query.includes('summarize')) {
        responseContent = `Here's a summary of ${fullFileName}: This document contains information that would need to be processed for analysis. I've extracted key points and concepts for your review.`;
      } else if (query.includes('example') || query.includes('explain')) {
        responseContent = `Let me explain with an example from ${fullFileName}: The content demonstrates concepts that relate to your question. I'd need to analyze the specific details to provide more precise information.`;
      } else if (query.includes('compare') || query.includes('difference')) {
        responseContent = `When comparing concepts in ${fullFileName}, I notice several distinctions worth highlighting. The document covers multiple perspectives that show both similarities and differences on this topic.`;
      } else {
        responseContent = `Based on ${fullFileName}, I can tell you that the document contains information relevant to your query. The content discusses various aspects that would help answer your specific question after detailed analysis.`;
      }
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      handleGenericError(error, "Failed to send message");
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm sorry, there was a problem processing your request. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    setInputValue(target.value);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white overflow-hidden">
      {messages.length === 0 && (
        <div className="flex-shrink-0 pb-3 text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">Ask anything about {documentTitle}.</p>
        </div>
      )}
      
      <div className="flex-grow p-4 overflow-auto">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 text-center">
              <p className="text-gray-400">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl",
                    message.isUser 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="flex-shrink-0 border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="pr-24 min-h-[80px] max-h-[200px] resize-none overflow-auto"
              disabled={isLoading}
              rows={1}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600"
              >
                <SmilePlus className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
