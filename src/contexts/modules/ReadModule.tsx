
import { useState } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';

// Read module state interface
export interface ReadModuleState extends BaseModuleState {
  texts: any[] | null;
  title: string;
  setTexts: (data: { texts: any[] | null; title?: string }) => void;
}

// Create read module state
export const createReadModule = (): ReadModuleState => {
  const baseState = createBaseModuleState();
  const [texts, setTexts] = useState<any[] | null>(null);
  const [title, setTitle] = useState<string>('Academic Texts');
  
  return {
    ...baseState,
    texts,
    title,
    setTexts: (data: { texts: any[] | null; title?: string }) => {
      setTexts(data.texts);
      if (data.title) setTitle(data.title);
    },
    reset: () => {
      baseState.reset();
      setTexts(null);
      setTitle('Academic Texts');
    }
  };
};
