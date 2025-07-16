// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('kalam_token');
      if (token) {
        const decodedUser = jwtDecode(token);
        setAuthUser(decodedUser);
      }
    } catch (error) {
      console.error("Error decoding token on initial load", error);
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('kalam_token', token);
    const decodedUser = jwtDecode(token);
    setAuthUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('kalam_token');
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};