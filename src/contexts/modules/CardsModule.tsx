
import { useState } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';

// Cards module state interface
export interface CardsModuleState extends BaseModuleState {
  cards: any[] | { cards: any[]; title?: string } | null;
  title: string;
  setCards: (cards: any[] | { cards: any[]; title?: string } | null) => void;
}

// Create cards module state
export const createCardsModule = (): CardsModuleState => {
  const baseState = createBaseModuleState();
  const [cards, setCards] = useState<any[] | { cards: any[]; title?: string } | null>(null);
  const [title, setTitle] = useState<string>('Memory Cards');
  
  return {
    ...baseState,
    cards,
    title,
    setCards: (newCards: any[] | { cards: any[]; title?: string } | null) => {
      setCards(newCards);
      if (newCards && typeof newCards === 'object' && !Array.isArray(newCards) && newCards.title) {
        setTitle(newCards.title);
      }
    },
    reset: () => {
      baseState.reset();
      setCards(null);
      setTitle('Memory Cards');
    }
  };
};
