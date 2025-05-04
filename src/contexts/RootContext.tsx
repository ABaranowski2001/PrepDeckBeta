
import React, { createContext, ReactNode } from 'react';
import { ContentProvider } from './ContentContext';

export const RootContext = createContext({});

export const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ContentProvider>
      {children}
    </ContentProvider>
  );
};
