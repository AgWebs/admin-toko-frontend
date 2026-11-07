import React, { createContext, useContext, useState } from "react";
import apiClient from "./apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Login
  const login = async (credentials) => {
    const res = await apiClient.post("/login", credentials);
    const newToken = res.data.token || res.data.access_token;
    
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    return res;
  };

  // Register
  const register = async (userData) => {
    return await apiClient.post("/register", userData);
  };

  // Logout
  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);