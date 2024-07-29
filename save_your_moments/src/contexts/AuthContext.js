import React, { createContext, useState, useEffect } from "react";
import { login, signUp, logout, refreshToken } from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          await refreshToken();
          setUser({ token });
        } catch (error) {
          console.error("Failed to initialize auth:", error);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    setUser({ token: data.access });
    return data;
  };

  const signUpUser = async (email, password, username) => {
    const data = await signUp(email, password, username);
    return data;
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginUser,
        signUp: signUpUser,
        logout: logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
