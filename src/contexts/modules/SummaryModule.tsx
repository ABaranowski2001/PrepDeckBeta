
import { useState } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';

// Summary module state interface
export interface SummaryModuleState extends BaseModuleState {
  processedText: string | null;
  originalText: string | null;
  setSummaryData: (data: { processed?: string | null; original?: string | null }) => void;
}

// Create summary module state
export const createSummaryModule = (): SummaryModuleState => {
  const baseState = createBaseModuleState();
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  
  return {
    ...baseState,
    processedText,
    originalText,
    setSummaryData: (data: { processed?: string | null; original?: string | null }) => {
      if (data.processed !== undefined) setProcessedText(data.processed);
      if (data.original !== undefined) setOriginalText(data.original);
    },
    reset: () => {
      baseState.reset();
      setProcessedText(null);
      setOriginalText(null);
    }
  };
};
