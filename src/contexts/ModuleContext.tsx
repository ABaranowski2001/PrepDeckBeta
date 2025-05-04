
import { createContext, useContext, ReactNode } from 'react';

// Import module types and creators
import { SummaryModuleState, createSummaryModule } from './modules/SummaryModule';
import { CardsModuleState, createCardsModule } from './modules/CardsModule';
import { QuizModuleState, createQuizModule } from './modules/QuizModule';
import { VideosModuleState, createVideosModule } from './modules/VideosModule';
import { ReadModuleState, createReadModule } from './modules/ReadModule';
import { ChatModuleState, createChatModule } from './modules/ChatModule';
import { FileState, createFileState } from './modules/FileState';

// Define the full context type
interface ModuleContextType {
  summaryModule: SummaryModuleState;
  cardsModule: CardsModuleState;
  quizModule: QuizModuleState;
  videosModule: VideosModuleState;
  readModule: ReadModuleState;
  chatModule: ChatModuleState;
  fileState: FileState;
}

// Create the context
const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Provider component
export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const summaryModule = createSummaryModule();
  const cardsModule = createCardsModule();
  const quizModule = createQuizModule();
  const videosModule = createVideosModule();
  const readModule = createReadModule();
  const chatModule = createChatModule();
  const fileState = createFileState();

  const value = {
    summaryModule,
    cardsModule,
    quizModule,
    videosModule,
    readModule,
    chatModule,
    fileState
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};

// Custom hook for accessing the entire modules context
export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useModules must be used within a ModuleProvider');
  
  return {
    ...context,
    clearModule: (moduleName: keyof Omit<typeof context, 'fileState'>) => {
      switch (moduleName) {
        case 'summaryModule':
          context.summaryModule.reset();
          break;
        case 'cardsModule':
          context.cardsModule.reset();
          break;
        case 'quizModule':
          context.quizModule.reset();
          break;
        case 'videosModule':
          context.videosModule.reset();
          break;
        case 'readModule':
          context.readModule.reset();
          break;
        case 'chatModule':
          context.chatModule.reset();
          break;
      }
    }
  };
};

// Individual module hooks
export const useSummaryModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useSummaryModule must be used within a ModuleProvider');
  return context.summaryModule;
};

export const useCardsModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useCardsModule must be used within a ModuleProvider');
  return context.cardsModule;
};

export const useQuizModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useQuizModule must be used within a ModuleProvider');
  return context.quizModule;
};

export const useVideosModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useVideosModule must be used within a ModuleProvider');
  return context.videosModule;
};

export const useReadModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useReadModule must be used within a ModuleProvider');
  return context.readModule;
};

export const useChatModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useChatModule must be used within a ModuleProvider');
  return context.chatModule;
};

export const useFileState = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useFileState must be used within a ModuleProvider');
  return context.fileState;
};
