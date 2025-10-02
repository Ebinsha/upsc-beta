import { useState, useEffect } from 'react';

interface UseApiDataOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  enabled?: boolean;
  dependencies?: any[];
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
  dependencies = []
}: UseApiDataOptions): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const fetchData = async () => {
    if (!enabled || !baseUrl || !apiKey) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${baseUrl}${endpoint}`;
      
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...headers,
        },
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('API fetch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
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
  return useApiData<Topic[]>({
    endpoint: '/high_level_topic',
    method: 'GET'
  });
}

export function useSubtopics(topicName: string) {
  // Convert topic name to lowercase endpoint (e.g., "Environment" -> "/environment")
  const endpoint = `/${topicName.toLowerCase()}`;
  
  return useApiData<Subtopic[]>({
    endpoint,
    method: 'GET',
    enabled: !!topicName,
    dependencies: [topicName]
  });
}

export function useChartData(subtopicId: string) {
  return useApiData<ChartData>({
    endpoint: '/line_chart',
    method: 'POST',
    body: {
      subtopic_id: subtopicId
    },
    enabled: !!subtopicId,
    dependencies: [subtopicId]
  });
}