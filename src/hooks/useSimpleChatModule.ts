import { usePDFChat } from './usePDFChat';

/**
 * A simple wrapper around usePDFChat for more reliable chat functionality
 */
export const useSimpleChatModule = () => {
  const chatResult = usePDFChat();
  return chatResult;
}; 