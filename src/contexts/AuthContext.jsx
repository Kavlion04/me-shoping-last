
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { toast } from '../hooks/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken) => {
    try {
      setIsLoading(true);
      console.log('Fetching user data with token:', authToken);
      const userData = await api.getMe(authToken);
      console.log('User data received:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await api.login({ username, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        
        if (response.user) {
          setUser(response.user);
          console.log('User data from login response:', response.user);
        } else {
          await fetchUserData(response.token);
        }
        
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, username, password) => {
    try {
      setIsLoading(true);
      await api.register({ name, username, password });
      toast.success('Registration successful! Please log in.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
