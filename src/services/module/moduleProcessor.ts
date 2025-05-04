
import { callSummaryWebhook } from './summaryModule';
import { callCardsWebhook } from './cardsModule';
import { callQuizWebhook } from './quizModule';
import { callVideosWebhook } from './videosModule';
import { callReadWebhook } from './readModule';
import { callChatWebhook } from './chatModule';

interface ModuleHandlers {
  summary: {
    setSummaryData: (data: { processed?: string | null; original?: string | null }) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
  cards: {
    setCards: (cards: any[] | { cards: any[]; title?: string } | null) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
  quiz: {
    setQuizData: (data: { questions: any[] | null; title?: string }) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
  videos: {
    setVideos: (data: { videos: any[] | null; title?: string }) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
  read: {
    setTexts: (data: { texts: any[] | null; title?: string }) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
  chat?: {
    setChatData?: (data: any) => void;
    setIsLoading?: (loading: boolean) => void;
    setError?: (error: string | null) => void;
  };
}

export const processAllWebhooks = async (
  file: File,
  handlers: ModuleHandlers
) => {
  const promises = [
    callSummaryWebhook(file, handlers.summary.setIsLoading, handlers.summary.setError)
      .then(result => {
        handlers.summary.setSummaryData({
          processed: result.processedText,
          original: result.originalText
        });
      }),
    callCardsWebhook(file, handlers.cards.setIsLoading, handlers.cards.setError)
      .then(cards => {
        handlers.cards.setCards(cards);
      }),
    callQuizWebhook(file, handlers.quiz.setIsLoading, handlers.quiz.setError)
      .then(quizData => {
        handlers.quiz.setQuizData(quizData || { questions: null, title: '' });
      }),
    callVideosWebhook(file, handlers.videos.setIsLoading, handlers.videos.setError)
      .then(videosData => {
        handlers.videos.setVideos(videosData || { videos: null, title: '' });
      }),
    callReadWebhook(file, handlers.read.setIsLoading, handlers.read.setError)
      .then(readData => {
        handlers.read.setTexts(readData || { texts: null, title: '' });
      })
  ];
  
  if (handlers.chat?.setChatData) {
    promises.push(
      callChatWebhook(file, 
        handlers.chat.setIsLoading || (() => {}), 
        handlers.chat.setError || (() => {})
      )
        .then(chatData => {
          if (handlers.chat?.setChatData) {
            handlers.chat.setChatData(chatData);
          }
        })
    );
  }
  
  await Promise.allSettled(promises);
};
