import jwtDecode from 'jwt-decode';

interface TokenData {
  token: string;
  userId: number;
}

export const tokenService = {
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  setTokenData: (token: string, userId: number) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId.toString());
  },

  removeTokenData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },

  getUserId: () => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }
}; 