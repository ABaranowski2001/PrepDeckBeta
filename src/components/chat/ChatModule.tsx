import React, { useState, useRef, useEffect } from 'react';
import { usePDFChat, ChatMessage } from '@/hooks/usePDFChat';

interface ChatModuleProps {
  isTabActive?: boolean;
}

export const ChatModule: React.FC<ChatModuleProps> = ({ isTabActive = false }) => {
  const { messages, isLoading, error, sendMessage } = usePDFChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when tab becomes active
  useEffect(() => {
    if (isTabActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTabActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-md shadow overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-2">Ask questions about your PDF</h3>
              <p className="text-sm">Get instant answers based on the content of your document.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 px-4 max-w-[80%] text-sm">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        {error && (
          <div className="mb-2 text-xs text-red-500">
            {error}
          </div>
        )}
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about your PDF..."
            className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-r-md 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

// Utility function to format timestamp
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`rounded-lg p-3 px-4 max-w-[80%] text-sm
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800'
          }`}
      >
        <div className="font-medium mb-1">
          {isUser ? 'You' : 'PDF Assistant'}
        </div>
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={`text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'} mt-1`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatModule; 