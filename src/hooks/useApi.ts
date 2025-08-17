import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import api from '../services/api';
import { ApiError } from '../types';

interface UseApiOptions<T = any> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  retryCount?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
}

interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  refetch: () => Promise<void>;
}

// Generic API hook
export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<AxiosResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
    cache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);
  const mountedRef = useRef(true);
  const retriesRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    // Check cache
    if (cache && cacheRef.current) {
      const { data: cachedData, timestamp } = cacheRef.current;
      if (Date.now() - timestamp < cacheTime) {
        setData(cachedData);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);
    retriesRef.current = 0;

    const attemptCall = async (): Promise<T> => {
      try {
        const response = await apiCall(...args);
        const responseData = response.data as T;

        if (mountedRef.current) {
          setData(responseData);
          setLoading(false);
          
          // Update cache
          if (cache) {
            cacheRef.current = {
              data: responseData,
              timestamp: Date.now(),
            };
          }

          if (onSuccess) {
            onSuccess(responseData);
          }
        }

        return responseData;
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        const apiError: ApiError = axiosError.response?.data || {
          code: 'UNKNOWN_ERROR',
          message: axiosError.message || 'An unexpected error occurred',
          statusCode: axiosError.response?.status || 500,
        };

        if (retriesRef.current < retryCount) {
          retriesRef.current++;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attemptCall();
        }

        if (mountedRef.current) {
          setError(apiError);
          setLoading(false);
          
          if (onError) {
            onError(apiError);
          }
        }

        throw apiError;
      }
    };

    return attemptCall();
  }, [apiCall, cache, cacheTime, onSuccess, onError, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    cacheRef.current = null;
  }, []);

  const refetch = useCallback(async () => {
    cacheRef.current = null;
    await execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, reset, refetch };
}

// GET request hook
export function useGet<T = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseApiOptions<T>
) {
  return useApi(
    () => api.get<T>(url, config),
    options
  );
}

// POST request hook
export function usePost<T = any>(
  url: string,
  options?: UseApiOptions<T>
) {
  return useApi(
    (data?: any, config?: AxiosRequestConfig) => api.post<T>(url, data, config),
    options
  );
}

// PUT request hook
export function usePut<T = any>(
  url: string,
  options?: UseApiOptions<T>
) {
  return useApi(
    (data?: any, config?: AxiosRequestConfig) => api.put<T>(url, data, config),
    options
  );
}

// DELETE request hook
export function useDelete<T = any>(
  url: string,
  options?: UseApiOptions<T>
) {
  return useApi(
    (config?: AxiosRequestConfig) => api.delete<T>(url, config),
    options
  );
}

// Paginated data hook
export function usePaginatedApi<T = any>(
  apiCall: (page: number, pageSize: number) => Promise<AxiosResponse<T>>,
  pageSize = 10,
  options?: UseApiOptions<T>
) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);

  const { loading, error, execute, reset } = useApi(
    () => apiCall(page, pageSize),
    {
      ...options,
      onSuccess: (newData: any) => {
        if (Array.isArray(newData)) {
          setAllData(prev => [...prev, ...newData]);
          setHasMore(newData.length === pageSize);
        } else if (newData.items) {
          setAllData(prev => [...prev, ...newData.items]);
          setHasMore(newData.hasNext || newData.items.length === pageSize);
        }
        options?.onSuccess?.(newData);
      },
    }
  );

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      await execute();
    }
  }, [loading, hasMore, execute]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    reset();
  }, [reset]);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    page,
  };
}

// Infinite scroll hook
export function useInfiniteScroll<T = any>(
  apiCall: (page: number) => Promise<AxiosResponse<T[]>>,
  options?: UseApiOptions<T[]>
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  const {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedApi(apiCall, 10, options);

  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  return {
    data,
    loading,
    error,
    hasMore,
    refresh,
    loadMoreRef,
  };
}

// Polling hook
export function usePolling<T = any>(
  apiCall: () => Promise<AxiosResponse<T>>,
  interval: number,
  options?: UseApiOptions<T>
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { data, loading, error, execute, reset } = useApi(apiCall, options);

  useEffect(() => {
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        execute();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, execute]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!intervalRef.current && interval > 0) {
      intervalRef.current = setInterval(() => {
        execute();
      }, interval);
    }
  }, [interval, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    stop,
    start,
  };
}