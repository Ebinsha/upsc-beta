export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  context: string;
  references: Reference[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  subtopic: string;
}

export interface Reference {
  title: string;
  type: 'Article' | 'Book' | 'Video' | 'Website';
  url?: string;
  description: string;
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeTaken: number;
}

export interface TestResult {
  testId: string;
  questions: Question[];
  answers: TestAnswer[];
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: Date;
}

export interface PracticeTest {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  completed: boolean;
  score?: number;
}