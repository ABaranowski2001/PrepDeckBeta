
import { createContext, useContext, useState, ReactNode } from 'react';
import { AIGeneratedContent } from '@/services/types';
import { Text } from '@/components/read/types';
import { Message } from '@/types/common';

// Re-export the Message type for backward compatibility
export type { Message };

interface CardGameData {
  cards?: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
}

interface QuizData {
  title?: string;
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface VideoData {
  title?: string;
  videos?: Array<{
    id: string;
    title: string;
    url: string;
    description?: string;
  }>;
}

interface ReadData {
  title?: string;
  texts: Text[];
}

interface ContentDataContextType {
  content: AIGeneratedContent | null;
  setContent: (content: AIGeneratedContent) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  cardGameData: CardGameData | null;
  setCardGameData: (data: CardGameData | null) => void;
  quizData: QuizData | null;
  setQuizData: (data: QuizData | null) => void;
  videoData: VideoData | null;
  setVideoData: (data: VideoData | null) => void;
  readData: ReadData | null;
  setReadData: (data: ReadData | null) => void;
}

const defaultContent: AIGeneratedContent = {
  summary: {
    title: "",
    text: ""
  },
  mindmap: {
    title: "",
    data: { id: "root", text: "" }
  },
  quiz: {
    title: "",
    questions: []
  }
};

const ContentDataContext = createContext<ContentDataContextType>({
  content: defaultContent,
  setContent: () => {},
  isLoading: false,
  setIsLoading: () => {},
  cardGameData: null,
  setCardGameData: () => {},
  quizData: null,
  setQuizData: () => {},
  videoData: null,
  setVideoData: () => {},
  readData: null,
  setReadData: () => {},
});

export const useContentData = () => useContext(ContentDataContext);

export const ContentDataProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<AIGeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardGameData, setCardGameData] = useState<CardGameData | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [readData, setReadData] = useState<ReadData | null>(null);

  return (
    <ContentDataContext.Provider 
      value={{ 
        content, 
        setContent, 
        isLoading, 
        setIsLoading,
        cardGameData,
        setCardGameData,
        quizData,
        setQuizData,
        videoData,
        setVideoData,
        readData,
        setReadData,
      }}
    >
      {children}
    </ContentDataContext.Provider>
  );
};
