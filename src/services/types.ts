
// AI Service Type Definitions

export interface AIGeneratedContent {
  summary: {
    title: string;
    text: string;
    original?: string; // Original transcribed text before rewriting
  };
  mindmap: {
    title: string;
    data: MindmapNode;
  };
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
}

export interface MindmapNode {
  id: string;
  text: string;
  children?: MindmapNode[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string; // Optional explanation for answers
}
