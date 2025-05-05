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
    
    // Обрабатываем 401 только для не-профильных эндпоинтов
    if (response.status === 401 && !url.toString().includes('/profile-info')) {
      tokenService.removeTokenData();
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Unauthorized access');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = new Error(errorData.message || 'Network response was not ok');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const apiClient = new Client(baseURL, { fetch: customFetch });