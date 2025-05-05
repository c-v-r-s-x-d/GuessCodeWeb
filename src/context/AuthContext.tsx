import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { tokenService } from '../services/tokenService';
import { LoginDto, RegisterDto, ProfileInfoDto } from '../services/api.generated';
import { useNavigate } from 'react-router-dom';
import { signalRService } from '../services/signalRService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: ProfileInfoDto | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ProfileInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = tokenService.getUserId();
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const response = await apiClient.profileInfo(userId);
        
        // Only set authenticated if we successfully get user data
        if (response) {
          setUser(response);
          setIsAuthenticated(!!response);
        }
      } catch (error) {
        // Don't remove token on network errors or other temporary issues
        console.error('Auth initialization error:', error);
        if (error.response?.status === 401) {
          tokenService.removeTokenData();
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      signalRService.startConnection();
    }
  }, [isAuthenticated]);

  const loadUser = async () => {
    try {
      const userId = tokenService.getUserId();
      if (!userId) throw new Error('No user ID found');

      const response = await apiClient.profileInfo(userId);
      setUser(response);
      setIsAuthenticated(!!response);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      const response = await apiClient.login(credentials);
      const tokenData = response;
      
      if (!tokenData?.accessToken || !tokenData?.userId) {
        throw new Error('Invalid token response');
      }

      // Set both token and userId
      tokenService.setTokenData(tokenData.accessToken, tokenData.userId);
      
      // Then load user data
      await loadUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterDto) => {
    try {
      await apiClient.register(userData);
      
      // После успешной регистрации выполняем вход
      const loginDto = new LoginDto({
        username: userData.username,
        password: userData.password
      });
      
      await login(loginDto);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    await signalRService.stopConnection();
    tokenService.removeTokenData();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 