import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, getCurrentUser } from '@/services/api';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ARCHBISHOP' | 'PRIEST' | 'LAITY';
  email: string;
  parishId?: number;  // Make sure this is included
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => null,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getCurrentUser()
        .then(userData => {
          console.log('Raw user data from API:', userData);
          
          const formattedUser = {
            id: userData.id,
            username: userData.username,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,
            email: userData.email,
            parishId: userData.parish_id  // Make sure this maps correctly
          };
          
          console.log('Formatted user with parishId:', formattedUser);
          setUser(formattedUser);
          localStorage.setItem('user', JSON.stringify(formattedUser));
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    try {
      const response = await apiLogin(username, password);
      console.log('Login response:', response);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Get full user details
      const userData = await getCurrentUser();
      console.log('User data from API:', userData);
      
      const formattedUser = {
        id: userData.id,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        email: userData.email,
        parishId: userData.parish_id  // This should now be 1
      };
      
      console.log('Formatted user with parishId:', formattedUser);
      
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUser(formattedUser);
      
      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      return error.response?.data?.detail || 'Login failed';
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};