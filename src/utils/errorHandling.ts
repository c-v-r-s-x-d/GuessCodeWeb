import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const data = error.response.data as ErrorResponse;
    return {
      message: data.message || 'An error occurred',
      code: data.code,
      details: data.details,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response from server. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something happened in setting up the request
    return {
      message: 'Failed to make request. Please try again.',
      code: 'REQUEST_SETUP_ERROR',
    };
  }
};

export const isApiError = (error: any): error is ApiError => {
  return 'message' in error && typeof error.message === 'string';
}; 