
import { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  processedText: string | null;
  setProcessedText: (text: string | null) => void;
  originalText: string | null;
  setOriginalText: (text: string | null) => void;
}

const FileContext = createContext<FileContextType>({
  currentFile: null,
  setCurrentFile: () => {},
  processedText: null,
  setProcessedText: () => {},
  originalText: null,
  setOriginalText: () => {},
});

export const useFile = () => useContext(FileContext);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);

  return (
    <FileContext.Provider 
      value={{ 
        currentFile,
        setCurrentFile,
        processedText,
        setProcessedText,
        originalText,
        setOriginalText,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
