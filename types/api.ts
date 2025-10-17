export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Topic {
  id: string;
  name: string;
  weightage: number;
  color: string;
  icon: string;
  subtopicCount: number;

}

export interface Subtopic {
  id: string;
  name: string;
  priority: string; // e.g., 'trending', 'hot', 'medium'
  icon: string;
  questionsCount: number;
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
  forecast?: {
    prefix?: string;
    relatives?: string[];
    trend?: string;
    impact?: string; // Added for impact score
  };
//   insights: {
//     title: string;
//     description: string;
//     percentage?: number;
//   }[];
}

export interface TopicsResponse extends ApiResponse<Topic[]> {}
export interface SubtopicsResponse extends ApiResponse<Subtopic[]> {}
export interface ChartDataResponse extends ApiResponse<ChartData> {}