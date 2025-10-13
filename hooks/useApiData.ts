import { ChartData } from '@/types/api';
import { Question } from '@/types/test';
import { Subtopic } from '@/types/topic';
import { useEffect, useState } from 'react';

interface UseApiDataOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  enabled?: boolean;
  dependencies?: any[];
  useBodyForGet?: boolean; // New option to allow body in GET requests
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiData<T = any>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  enabled = true,
  dependencies = [],
  useBodyForGet = false
}: UseApiDataOptions): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const fetchData = async () => {
    if (!enabled) {
      return;
    }
    
    if (!baseUrl || !apiKey) {
      setError('API configuration missing. Please check environment variables.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ensure proper URL construction without double slashes
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${cleanBaseUrl}${cleanEndpoint}`;
      
      const config: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          ...headers,
        },
      };

      if (body && (method === 'POST' || method === 'PUT' || (method === 'GET' && useBodyForGet))) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`API endpoint not found: ${endpoint}`);
        } else if (response.status === 401) {
          throw new Error('API authentication failed. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('API access forbidden. Please check your permissions.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      let errorMessage = 'An unknown error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('CORS')) {
          errorMessage = 'CORS error: Server does not allow cross-origin requests. Please contact the API administrator.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the API server. Please check your internet connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setData(null); // Clear existing data to prevent flickering
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [enabled, endpoint, method, JSON.stringify(body), JSON.stringify(headers), ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch
  };
}

// Specialized hooks for different data types
export function useTopics() {
  const { data: rawData, loading, error, refetch } = useApiData<Record<string, { subtopic: { number: number } }>>({
    endpoint: '/high_level_topic',
    method: 'GET'
  });

  // Transform API data to match Topic structure
  const transformedData = rawData ? transformTopicsData(rawData) : null;

  return {
    data: transformedData,
    loading,
    error,
    refetch
  };
}

// Helper function to transform API data to Topic structure
function transformTopicsData(apiData: Record<string, { subtopic: { number: number , hot:number} }>): Topic[] {
  const topicIcons = ['🌱', '📚', '🌍', '💰', '⚖️', '🏛️', '🎭', '🔬', '🏥', '🚀', '🎨', '📊'];
  const colors = [
    '#F5A3A3', '#A3C3F5', '#7DB8E8', '#E67E22', '#C39BD3', '#85C1E9',
    '#F1b3c9', '#82E0AA', '#D7BDE2', '#F9E79F', '#AED6F1', '#A9DFBF'
  ];

  return Object.entries(apiData).map(([topicName, data], index) => {
    const subtopicCount = data.subtopic.number;
    // const priority = Math.floor(Math.random() * 10) + 1; // Random 1-10
    const rating = data.subtopic.hot; // from API hot
    // const isHot = Math.random() > 0.5; // Random true/false
    
    // // Determine difficulty based on subtopic count
    // let difficulty: 'Low' | 'Medium' | 'High';
    // if (subtopicCount < 100) {
    //   difficulty = 'Low';
    // } else if (subtopicCount <= 130) {
    //   difficulty = 'Medium';
    // } else {
    //   difficulty = 'High';
    // }

    return {
      id: topicName, // Use topic name as ID
      name: topicName.charAt(0).toUpperCase() + topicName.slice(1), // Capitalize first letter
      // priority,
      rating,
      // isHot,
      color: colors[index % colors.length],
      icon: topicIcons[index % topicIcons.length],
      subtopicCount,
      // difficulty
    };
  });
}

export function useSubtopics(topicName: string) {
  // Convert topic name to lowercase endpoint (e.g., "Environment" -> "/environment")
  const endpoint = `/${topicName.toLowerCase()}`;
  
  console.log('Fetching subtopics for:', topicName, 'Endpoint:', endpoint);
  
  const { data: rawData, loading, error, refetch } = useApiData<any>({
    endpoint,
    method: 'GET',
    enabled: !!topicName,
    dependencies: [topicName]
  });

  // console.log('Raw subtopic data received:', rawData);

  // Transform API data to match Subtopic structure
  const transformedData = rawData ? transformSubtopicsData(rawData, topicName) : null;
  
  console.log('Transformed subtopic data:', transformedData);

  return {
    data: transformedData,
    loading,
    error,
    refetch
  };
}

// Helper function to transform API subtopics data to Subtopic structure
function transformSubtopicsData(apiData: any, topicName: string): Subtopic[] {
  const subtopicIcons = ['🔬', '📊', '🌐', '⚡', '🎯', '📈', '🔍', '💡', '🛠️', '📋', '🌟', '🚀'];
  
  console.log('Raw API Data:', JSON.stringify(apiData, null, 2));
  
  // Handle the API response structure: { "subtopic": { "number": 10, "ids": {...} } }
  let subtopicData;
  
  if (apiData.subtopic) {
    // Direct structure: { "subtopic": { "ids": {...} } }
    subtopicData = apiData.subtopic;
  } else {
    // Nested structure: { "topicName": { "subtopic": { "ids": {...} } } }
    const topicData = Object.values(apiData)[0] as any;
    if (topicData && topicData.subtopic) {
      subtopicData = topicData.subtopic;
    }
  }
  
  // console.log('Extracted subtopic data:', JSON.stringify(subtopicData, null, 2));
  
  if (!subtopicData || !subtopicData.ids) {
    console.log('No subtopic data or ids found');
    return [];
  }

  const subtopicsIds = subtopicData.ids;
  console.log('Subtopic IDs:', JSON.stringify(subtopicsIds, null, 2));
  
  return Object.entries(subtopicsIds).map(([id, subtopicData], index) => {
    const data = subtopicData as { name: string, count: number , hot: boolean};
    const priority = data.count; // Use count as priority
    const rating = Math.round((Math.random() * 4 + 1) * 10) / 10; // Random 1.0-5.0 with 1 decimal
    const isHot = data.hot; // from API
    const questionsCount = Math.floor(Math.random() * 150) + 1; // Random 1-150
    
    // // Determine difficulty based on questions count
    // let difficulty: 'Low' | 'Medium' | 'High';
    // if (questionsCount < 50) {
    //   difficulty = 'Low';
    // } else if (questionsCount <= 100) {
    //   difficulty = 'Medium';
    // } else {
    //   difficulty = 'High';
    // }

    return {
      id,
      name: data.name,
      priority,
      rating,
      isHot,
      icon: subtopicIcons[index % subtopicIcons.length],
      questionsCount,
      // difficulty,
      topicId: topicName.toLowerCase()
    };
  });
}
export function useChartData(subtopicId: string, ) {
  const { data: rawData, loading, error, refetch } = useApiData<any>({
    endpoint: '/line_chart',
    method: 'POST',
    body: {
      topic_id: subtopicId,
    
    },
    enabled: !!subtopicId,
    dependencies: [subtopicId]
  });

  // Transform API data to chart format
  const transformedData = rawData ? transformChartData(rawData, subtopicId) : null;

  return {
    data: transformedData,
    loading,
    error,
    refetch
  };
}

// Helper function to transform API chart data with half yearly data
function transformChartData(apiData: any, subtopicId: string): ChartData {
  console.log('Raw chart API data:', JSON.stringify(apiData, null, 2));
  
  if (!apiData.range) {
    console.log('No range data found in API response');
    return createEmptyChartData();
  }

  // Get the data for the specific subtopic ID
  const subtopicData = apiData.range[subtopicId];

  if (!subtopicData) {
    console.log(`No data found for subtopic ID: ${subtopicId}`);
    // Try to get the first available subtopic data
    const firstSubtopicId = Object.keys(apiData.range)[0];
    if (firstSubtopicId) {
      console.log(`Using data from first available subtopic: ${firstSubtopicId}`);
      return processHalfYearlyData(apiData.range[firstSubtopicId], apiData.forecast);
    }
    return createEmptyChartData();
  }

  return processHalfYearlyData(subtopicData, apiData.forecast);
}

function processHalfYearlyData(subtopicData: Record<string, number>, forecast: any): ChartData {
  const entries = Object.entries(subtopicData);
  
  // Sort by date
  entries.sort(([a], [b]) => {
    const [yearA, halfA] = a.split('-');
    const [yearB, halfB] = b.split('-');
    return yearA === yearB ? 
      (halfA === 'H1' ? -1 : 1) : 
      parseInt(yearA) - parseInt(yearB);
  });

  // Create formatted labels
  const labels = entries.map(([period]) => {
    const [year, half] = period.split('-');
    return `${half === 'H1' ? 'Jan-Jun' : 'Jul-Dec'} ${year.slice(2)}`;
  });

  const data = entries.map(([, value]) => value);
  
  // // Calculate insights
  // const totalQuestions = data.reduce((sum, val) => sum + val, 0);
  // const maxValue = Math.max(...data);
  // const avgValue = totalQuestions / data.length;
  // const nonZeroHalves = data.filter(val => val > 0).length;
  // const growthRate = calculateGrowthRate(data);

  // const insights = [];

   // Add dummy impact score based on data patterns
  const nonZeroCount = data.filter(v => v > 0).length;
  const totalPeriods = data.length;
  let impactScore = 'Medium';
  
  if (nonZeroCount / totalPeriods > 0.5) {
    impactScore = 'Very High';
  } else if (nonZeroCount / totalPeriods > 0.3) {
    impactScore = 'High';
  }

  
  // if (totalQuestions > 0) {
  //   insights.push({
  //     title: 'Total Questions',
  //     description: `${totalQuestions} questions appeared in total`,
  //     percentage: totalQuestions
  //   });
  // }

  // if (maxValue > 0) {
  //   const maxIndex = data.indexOf(maxValue);
  //   insights.push({
  //     title: 'Peak Activity',
  //     description: `Highest activity in ${labels[maxIndex]} with ${maxValue} questions`,
  //     percentage: Math.round((maxValue / totalQuestions) * 100)
  //   });
  // }

  // if (recommendation?.trend) {
  //   insights.push({
  //     title: 'Trend Analysis',
  //     description: recommendation.trend,
  //     percentage: Math.round((nonZeroHalves / entries.length) * 100)
  //   });
  // }

  // if (recommendation?.impact) {
  //   insights.push({
  //     title: 'Impact Assessment',
  //     description: `Impact Level: ${recommendation.impact}`,
  //     percentage: recommendation.impact === 'Very High' ? 90 : 
  //                recommendation.impact === 'High' ? 75 :
  //                recommendation.impact === 'Medium' ? 50 : 25
  //   });
  // }

  return {
    labels,
    datasets: [{
      data,
      strokeWidth: 3,
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`
    }],
    timeRange: entries.length > 0 ? 
      `${entries[0][0]} to ${entries[entries.length - 1][0]}` : 
      'No data available',
   forecast: {
       prefix: forecast?.prefix,
      relatives: forecast?.relatives,
      trend: forecast?.trend,
      impact: impactScore // Add the impact score
    }
  };
}

// Calculate growth rate between first and last non-zero values
function calculateGrowthRate(data: number[]): number {
  const nonZeroValues = data.filter(val => val > 0);
  if (nonZeroValues.length < 2) return 0;
  
  const firstValue = nonZeroValues[0];
  const lastValue = nonZeroValues[nonZeroValues.length - 1];
  
  if (firstValue === 0) return 0;
  
  return Math.round(((lastValue - firstValue) / firstValue) * 100);
}

// Hook for fetching exam questions
export function useExamQuestions(subtopicId: string) {
  const { data: rawData, loading, error, refetch } = useApiData<any>({
    endpoint: '/exam',
    method: 'POST',
    body: {
      topic_id: subtopicId
    },
   
    dependencies: [subtopicId]
  });

  
  // Transform API data to match Question structure
  const transformedData = rawData ? transformExamData(rawData) : null;

  return {
    data: transformedData,
    loading,
    error,
    refetch
  };
}

// Helper function to transform API exam data to Question structure
function transformExamData(apiData: any): Question[] {
  console.log('Raw exam API data:', JSON.stringify(apiData, null, 2));
  
  if (!apiData.questions || !Array.isArray(apiData.questions)) {
    console.log('No questions found in API response');
    return [];
  }



  return apiData.questions.map((q: any) => ({
    id: q.id.toString(),
    question: q.Question,
    additionalQuestion: q.Additional_Question || '',
    statement: q.Statement || [],
    options: q.Options || [],
    correctAnswer: q.Answer, // 0-based indexing API
    explanation: q.Explanation || '',
    // context: `This question is from ${q.labelled_topic || q.topic_std || 'General Studies'}`,
    references: [
      {
        title: q.labelled_topic || 'Topic Reference',
        // type: 'Article' as const,
        description: `Study material for ${q.topic_std || 'this topic'}`
      }
    ],
    difficulty: 'Medium' as const,
    topic: q.topic_std || 'General Studies',
    subtopic: q.labelled_topic || 'General',
  }),
 
)

}

// Create empty chart data for fallback
function createEmptyChartData(): ChartData {
  return {
    labels: ['No Data'],
    datasets: [{
      data: [0],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`
    }],
    timeRange: 'No data available',
    // insights: [{
    //   title: 'No Data',
    //   description: 'No chart data available for this topic',
    //   percentage: 0
    // }]
  };
}