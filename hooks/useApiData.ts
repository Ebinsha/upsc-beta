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

  const fetchData = async () => {
    if (!enabled || !baseUrl) {
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
  return useApiData<{ topics: any[] }>({
    endpoint: '/topics',
    method: 'GET'
  });
}

export function useSubtopics(topicId: string, filters?: any) {
  return useApiData<{ subtopics: any[] }>({
    endpoint: '/subtopics',
    method: 'POST',
    body: {
      topicId,
      ...filters
    },
    enabled: !!topicId,
    dependencies: [topicId, filters]
  });
}

export function useChartData(topicId: string, timeRange: string) {
  return useApiData<{ chartData: any }>({
    endpoint: '/chart-data',
    method: 'POST',
    body: {
      topicId,
      timeRange
    },
    enabled: !!topicId && !!timeRange,
    dependencies: [topicId, timeRange]
  });
}