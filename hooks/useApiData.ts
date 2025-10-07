import { ChartData } from '@/types/api';
import { useState, useEffect } from 'react';

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
function transformTopicsData(apiData: Record<string, { subtopic: { number: number } }>): Topic[] {
  const topicIcons = ['🌱', '📚', '🌍', '💰', '⚖️', '🏛️', '🎭', '🔬', '🏥', '🚀', '🎨', '📊'];
  const colors = [
    '#F5A3A3', '#A3C3F5', '#7DB8E8', '#E67E22', '#C39BD3', '#85C1E9',
    '#F8C471', '#82E0AA', '#D7BDE2', '#F9E79F', '#AED6F1', '#A9DFBF'
  ];

  return Object.entries(apiData).map(([topicName, data], index) => {
    const subtopicCount = data.subtopic.number;
    const priority = Math.floor(Math.random() * 10) + 1; // Random 1-10
    const rating = Math.round((Math.random() * 4 + 1) * 10) / 10; // Random 1.0-5.0 with 1 decimal
    const isHot = Math.random() > 0.5; // Random true/false
    
    // Determine difficulty based on subtopic count
    let difficulty: 'Low' | 'Medium' | 'High';
    if (subtopicCount < 100) {
      difficulty = 'Low';
    } else if (subtopicCount <= 130) {
      difficulty = 'Medium';
    } else {
      difficulty = 'High';
    }

    return {
      id: topicName, // Use topic name as ID
      name: topicName.charAt(0).toUpperCase() + topicName.slice(1), // Capitalize first letter
      priority,
      rating,
      isHot,
      color: colors[index % colors.length],
      icon: topicIcons[index % topicIcons.length],
      subtopicCount,
      difficulty
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

  console.log('Raw subtopic data received:', rawData);

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
  
  console.log('Extracted subtopic data:', JSON.stringify(subtopicData, null, 2));
  
  if (!subtopicData || !subtopicData.ids) {
    console.log('No subtopic data or ids found');
    return [];
  }

  const subtopicsIds = subtopicData.ids;
  console.log('Subtopic IDs:', JSON.stringify(subtopicsIds, null, 2));
  
  return Object.entries(subtopicsIds).map(([id, subtopicData], index) => {
    const data = subtopicData as { name: string, count: number };
    const priority = data.count; // Use count as priority
    const rating = Math.round((Math.random() * 4 + 1) * 10) / 10; // Random 1.0-5.0 with 1 decimal
    const isHot = Math.random() > 0.7; // 30% chance of being hot
    const questionsCount = Math.floor(Math.random() * 150) + 1; // Random 1-150
    
    // Determine difficulty based on questions count
    let difficulty: 'Low' | 'Medium' | 'High';
    if (questionsCount < 50) {
      difficulty = 'Low';
    } else if (questionsCount <= 100) {
      difficulty = 'Medium';
    } else {
      difficulty = 'High';
    }

    return {
      id,
      name: data.name,
      priority,
      rating,
      isHot,
      icon: subtopicIcons[index % subtopicIcons.length],
      questionsCount,
      difficulty,
      topicId: topicName.toLowerCase()
    };
  });
}
export function useChartData(subtopicId: string) {
  return useApiData<ChartData>({
    endpoint: '/line_chart',
    method: 'POST',
    body: {
      topic_title: subtopicId,
      topic_subtopic: "0.0"
    },
    enabled: !!subtopicId,
    dependencies: [subtopicId]
  });
}