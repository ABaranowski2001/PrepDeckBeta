import { MessageSquare } from 'lucide-react';
import PanelContainer from '@/components/panels/PanelContainer';
import { useState, useRef, useEffect } from 'react';
import { useSimpleChatModule } from '@/hooks/useSimpleChatModule';

interface ChatPanelProps {
  documentTitle: string;
  isTabActive?: boolean;
}

const ChatPanel = ({ documentTitle, isTabActive = false }: ChatPanelProps) => {
  const { messages, isLoading, error, sendMessage } = useSimpleChatModule();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Don't use the emptyTitle condition since we want to show the chat UI even when there are no messages
  return (
    <PanelContainer
      isPending={false}
      loadingTitle="Preparing chat service"
      loadingDescription="Our chat service is initializing. Please wait."
      error={error}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center p-6">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Chat with AI about this document</h3>
                <p className="text-sm">Ask questions about the content and get instant answers.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`rounded-lg p-3 px-4 max-w-[80%] text-sm
                      ${message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
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
    </PanelContainer>
  );
};

export default ChatPanel;
