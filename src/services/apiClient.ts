import { Api } from './api.generated';
import { tokenService } from './tokenService';

const baseURL = process.env.REACT_APP_API_URL || 'http://192.168.0.35:5000';

// Create custom fetch function to handle 401 responses
const customFetch = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  
  // Only handle 401 for non-profile endpoints to prevent logout loops
  if (response.status === 401 && !args[0].toString().includes('/profile-info')) {
    tokenService.removeTokenData();
    window.dispatchEvent(new Event('auth:logout'));
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Network response was not ok');
  }
  
  return response;
};

export const apiClient = new Api({
  baseUrl: baseURL,
  securityWorker: async () => {
    const token = tokenService.getToken();
    if (!token) return {};
    
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  },
  baseApiParams: {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
    secure: true
  },
  customFetch
});