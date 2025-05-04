
import { useState } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';

// Quiz module state interface
export interface QuizModuleState extends BaseModuleState {
  questions: any[] | null;
  title: string;
  setQuizData: (data: { questions: any[] | null; title?: string }) => void;
}

// Create quiz module state
export const createQuizModule = (): QuizModuleState => {
  const baseState = createBaseModuleState();
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [title, setTitle] = useState<string>('Quiz');
  
  return {
    ...baseState,
    questions,
    title,
    setQuizData: (data: { questions: any[] | null; title?: string }) => {
      setQuestions(data.questions);
      if (data.title) setTitle(data.title);
    },
    reset: () => {
      baseState.reset();
      setQuestions(null);
      setTitle('Quiz');
    }
  };
};
