import { useState } from 'react';

export interface FileInfo {
  name: string;
  type: string;
}

// File state interface
export interface FileState {
  currentFile: File | FileInfo | null;
  setCurrentFile: (file: File | FileInfo | null) => void;
}

// Create file state
export const createFileState = (): FileState => {
  const [currentFile, setCurrentFile] = useState<File | FileInfo | null>(null);
  
  return {
    currentFile,
    setCurrentFile
  };
};
