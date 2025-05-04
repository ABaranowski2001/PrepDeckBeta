
import { ReactNode } from 'react';

// Base module state interface
export interface BaseModuleState {
  data: any;
  isLoading: boolean;
  error: string | null;
  setData: (data: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Utility function to create base module state
export const createBaseModuleState = (initialData = null): BaseModuleState => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    data,
    isLoading,
    error,
    setData: (newData: any) => setData(newData),
    setIsLoading: (loading: boolean) => setIsLoading(loading),
    setError: (errorMsg: string | null) => setError(errorMsg),
    reset: () => {
      setData(null);
      setIsLoading(false);
      setError(null);
    }
  };
};

// Add missing import
import { useState } from 'react';
