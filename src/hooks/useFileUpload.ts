
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
  isLoading: boolean;
  processedText: string | null;
}

export interface FileUploadActions {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleUploadClick: () => void;
  resetFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const useFileUpload = (): [FileUploadState, FileUploadActions] => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFilePreview = (selectedFile: File) => {
    // For PDFs, we'll use a PDF icon since browsers can't easily generate thumbnails
    if (selectedFile.type === 'application/pdf') {
      // Set the preview to a placeholder PDF icon or the first page if possible
      setPreview('/placeholder.svg');
      
      // Optional: If you want to show PDF metadata
      console.log(`PDF selected: ${selectedFile.name}, size: ${(selectedFile.size / 1024).toFixed(2)}KB`);
    } else {
      // For non-PDFs (which shouldn't happen with our validation)
      setPreview('/placeholder.svg');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      setFile(selectedFile);
      generateFilePreview(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      setFile(droppedFile);
      generateFilePreview(droppedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetFile = () => {
    setFile(null);
    setPreview(null);
  };

  return [
    { file, preview, isDragging, isLoading, processedText },
    { 
      handleFileChange, 
      handleDragOver, 
      handleDragLeave, 
      handleDrop, 
      handleUploadClick, 
      resetFile,
      fileInputRef 
    }
  ];
};
