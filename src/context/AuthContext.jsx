import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create context
const AuthContext = createContext();

// 2. Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // When token changes → save to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // When user changes → save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Login function (UI will call this)
  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Auth state
  const value = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Custom hook for consuming context
export function useAuth() {
  return useContext(AuthContext);
}
