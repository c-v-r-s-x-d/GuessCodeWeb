import { tokenService } from './tokenService';
import { Client } from "./api.generated";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface ApiError extends Error {
  status?: number;
  data?: any;
}

// Создаем кастомную функцию fetch для обработки ошибок
const customFetch = async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
  try {
    const token = tokenService.getToken();
    const userId = tokenService.getUserId();
    const isProfileEndpoint = url.toString().includes('/profile-info');

    // Добавляем заголовки авторизации
    const headers = new Headers(init?.headers);
    
    // Устанавливаем Content-Type только если это не FormData
    if (!(init?.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (userId) {
      headers.set('UserId', userId.toString());
    }

    const response = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
      mode: 'cors'
    });
    
    // Обрабатываем 401 для всех эндпоинтов, кроме публичных
    if (response.status === 401 && !isProfileEndpoint) {
      tokenService.removeTokenData();
      window.dispatchEvent(new Event('auth:logout'));
      const error: ApiError = new Error('Unauthorized access');
      error.status = 401;
      throw error;
    }
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network response was not ok' };
      }
      
      const error: ApiError = new Error(errorData.message || 'Network response was not ok');
      error.status = response.status;
      error.data = errorData;
      
      // Для профильных эндпоинтов добавляем специальную обработку
      if (isProfileEndpoint && response.status === 401) {
        error.message = 'Please login to view this profile';
      }
      
      throw error;
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const apiError: ApiError = new Error('An unexpected error occurred');
    apiError.status = 500;
    throw apiError;
  }
};

export const apiClient = new Client(baseURL, { fetch: customFetch });