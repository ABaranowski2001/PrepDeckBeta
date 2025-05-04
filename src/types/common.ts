
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  structuredContent?: {
    title?: string;
    text?: string;
    points?: string[];
    [key: string]: any;
  };
}
