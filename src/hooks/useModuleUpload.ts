
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { processAllWebhooks } from '@/services/module/moduleProcessor';
import { useModules } from '@/contexts/ModuleContext';

export const useModuleUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const {
    summaryModule,
    cardsModule,
    quizModule,
    videosModule,
    readModule,
    chatModule,
    fileState,
    clearModule
  } = useModules();
  
  const handleSubmit = async (file: File | null) => {
    if (!file) {
      toast("No file selected", {
        description: 'Please upload a file first'
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Clear all existing content by resetting each module individually
      clearModule('summaryModule');
      clearModule('cardsModule');
      clearModule('quizModule');
      clearModule('videosModule');
      clearModule('readModule');
      clearModule('chatModule');
      
      // Set the current file
      fileState.setCurrentFile(file);
      
      console.log("Starting file upload processing with isolated modules");
      
      // Process all webhooks concurrently but independently
      await processAllWebhooks(file, {
        summary: {
          setSummaryData: summaryModule.setSummaryData,
          setIsLoading: summaryModule.setIsLoading,
          setError: summaryModule.setError
        },
        cards: {
          setCards: cardsModule.setCards,
          setIsLoading: cardsModule.setIsLoading,
          setError: cardsModule.setError
        },
        quiz: {
          setQuizData: quizModule.setQuizData,
          setIsLoading: quizModule.setIsLoading,
          setError: quizModule.setError
        },
        videos: {
          setVideos: videosModule.setVideos,
          setIsLoading: videosModule.setIsLoading,
          setError: videosModule.setError
        },
        read: {
          setTexts: readModule.setTexts,
          setIsLoading: readModule.setIsLoading,
          setError: readModule.setError
        },
        chat: {
          setChatData: (data: any) => chatModule.setMessages(data.messages || []),
          setIsLoading: chatModule.setIsLoading,
          setError: chatModule.setError
        }
      });
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to results page
      navigate('/results', { replace: true });
      
    } catch (error) {
      console.error("Error during upload processing:", error);
      toast.error("Error processing file", {
        description: "There was a problem processing your file"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleSubmit
  };
};
