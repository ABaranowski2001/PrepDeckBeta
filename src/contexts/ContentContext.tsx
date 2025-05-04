
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FileProvider, useFile } from './FileContext';
import { WebhookProvider, useWebhook } from './WebhookContext';
import { ContentDataProvider, useContentData } from './ContentDataContext';
import type { Message } from '@/types/common';

// Combine contexts in one clear provider rather than re-export
export const useContent = () => {
  const fileContext = useFile();
  const webhookContext = useWebhook();
  const contentDataContext = useContentData();
  
  const clearAllContent = () => {
    // Clear content data
    contentDataContext.setContent(null);
    contentDataContext.setCardGameData(null);
    contentDataContext.setQuizData(null);
    contentDataContext.setVideoData(null);
    contentDataContext.setReadData(null);
    
    // Clear file data
    fileContext.setProcessedText(null);
    fileContext.setOriginalText(null);
    fileContext.setCurrentFile(null);
    
    // Clear webhook data
    webhookContext.setMakeResponse(null);
    webhookContext.setTertiaryResponse(null);
    webhookContext.setAdditionalResponse(null);
    webhookContext.setPendingWebhooks({
      cardGame: false,
      quiz: false,
      additional: false,
      read: false
    });
    
    // Clear local storage
    localStorage.removeItem('appContent');
    localStorage.removeItem('appCurrentFile');
    localStorage.removeItem('appProcessedText');
    localStorage.removeItem('appOriginalText');
    
    console.log("All content and local storage cleared");
  };

  return {
    // Combine all context values to maintain the original API
    ...fileContext,
    ...webhookContext,
    ...contentDataContext,
    clearAllContent
  };
};

// Direct provider component instead of re-exporting
export const ContentProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FileProvider>
      <WebhookProvider>
        <ContentDataProvider>
          {children}
        </ContentDataProvider>
      </WebhookProvider>
    </FileProvider>
  );
};

export type { Message };
