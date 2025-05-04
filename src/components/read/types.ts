
export interface Text {
  id: string;
  title: string;
  author?: string;
  description?: string;
  url?: string;
  doi?: string;
  thumbnail?: string;
  year?: string;
  tags?: string[];
  type?: 'article' | 'book' | 'paper' | 'thesis' | 'other';
}

export interface ReadData {
  title?: string;
  texts: Text[];
}
