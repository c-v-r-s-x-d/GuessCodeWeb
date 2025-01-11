import { useState, useCallback } from 'react';
import { ApiError, handleApiError } from '../utils/errorHandling';

interface LoadingState {
  isLoading: boolean;
  error: ApiError | null;
}

export function useLoadingState(initialState: boolean = false) {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialState,
    error: null,
  });

  const startLoading = useCallback(() => {
    setState({ isLoading: true, error: null });
  }, []);

  const stopLoading = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  const setError = useCallback((error: ApiError) => {
    setState({ isLoading: false, error });
  }, []);

  const executeWithLoading = useCallback(async <T>(
    promise: Promise<T>
  ): Promise<T | null> => {
    try {
      startLoading();
      const result = await promise;
      stopLoading();
      return result;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError);
      return null;
    }
  }, [startLoading, stopLoading, setError]);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    executeWithLoading,
  };
} 