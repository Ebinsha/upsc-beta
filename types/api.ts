export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

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
  topicId: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    strokeWidth?: number;
    color?: (opacity: number) => string;
  }[];
  timeRange: string;
  insights: {
    title: string;
    description: string;
    percentage?: number;
  }[];
}

export interface TopicsResponse extends ApiResponse<Topic[]> {}
export interface SubtopicsResponse extends ApiResponse<Subtopic[]> {}
export interface ChartDataResponse extends ApiResponse<ChartData> {}