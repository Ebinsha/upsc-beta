export interface Topic {
  id: string;
  name: string;
  priority: number;
  rating: number;
  isHot: boolean;
  color: string;
  icon: string;
  subtopicCount: number;
  difficulty: string;
}

export interface Subtopic {
  id: string;
  name: string;
  priority: number;
  rating: number;
  isHot: boolean;
  icon: string;
  questionsCount: number;
  difficulty: string;
}