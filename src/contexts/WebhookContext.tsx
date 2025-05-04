
import { createContext, useContext, useState, ReactNode } from 'react';

interface PendingWebhooks {
  cardGame: boolean;
  quiz: boolean;
  additional: boolean;
  read: boolean;
}

interface WebhookContextType {
  makeResponse: string | null;
  setMakeResponse: (response: string | null) => void;
  tertiaryResponse: string | null;
  setTertiaryResponse: (text: string | null) => void;
  additionalResponse: string | null;
  setAdditionalResponse: (text: string | null) => void;
  pendingWebhooks: PendingWebhooks;
  setPendingWebhooks: (pending: PendingWebhooks | ((prev: PendingWebhooks) => PendingWebhooks)) => void;
}

const WebhookContext = createContext<WebhookContextType>({
  makeResponse: null,
  setMakeResponse: () => {},
  tertiaryResponse: null,
  setTertiaryResponse: () => {},
  additionalResponse: null,
  setAdditionalResponse: () => {},
  pendingWebhooks: {
    cardGame: false,
    quiz: false,
    additional: false,
    read: false
  },
  setPendingWebhooks: () => {},
});

export const useWebhook = () => useContext(WebhookContext);

export const WebhookProvider = ({ children }: { children: ReactNode }) => {
  const [makeResponse, setMakeResponse] = useState<string | null>(null);
  const [tertiaryResponse, setTertiaryResponse] = useState<string | null>(null);
  const [additionalResponse, setAdditionalResponse] = useState<string | null>(null);
  const [pendingWebhooks, setPendingWebhooks] = useState<PendingWebhooks>({
    cardGame: false,
    quiz: false,
    additional: false,
    read: false
  });

  return (
    <WebhookContext.Provider 
      value={{ 
        makeResponse,
        setMakeResponse,
        tertiaryResponse,
        setTertiaryResponse,
        additionalResponse,
        setAdditionalResponse,
        pendingWebhooks,
        setPendingWebhooks,
      }}
    >
      {children}
    </WebhookContext.Provider>
  );
};
