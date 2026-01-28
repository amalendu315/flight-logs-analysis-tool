"use client";

import React, { useEffect, useState } from "react";
import AuthContext from "@/context/auth-context";
import { LoginForm } from "@/components/forms/login-form";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded credentials as per your request
  const defaultLoginCreds = {
    username: "Admin",
    password: "Admin",
  };

  // Check LocalStorage on Mount (Old Logic)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expirationTimeString = localStorage.getItem("tokenExpiration");

    if (token && expirationTimeString) {
      const currentTime = new Date().getTime();
      const expirationTime = parseInt(expirationTimeString);

      if (currentTime <= expirationTime) {
        setIsAuthenticated(true);
      } else {
        // Expired
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    if (
      username === defaultLoginCreds.username &&
      password === defaultLoginCreds.password
    ) {
      const token = `${Math.floor(Math.random() * 9000) + 1001}`;
      // 1 Hour Expiration
      const expirationTime = new Date().getTime() + 60 * 60 * 1000;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", `${expirationTime}`);

      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsAuthenticated(false);
    // Optional: Reload to clear all states
    // window.location.reload();
  };

  // If still checking auth, show nothing or a spinner
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-slate-500">
        Loading system...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {isAuthenticated ? (
        // If Logged In -> Show the App (Sidebar + Page)
        children
      ) : (
        // If Logged Out -> Show Login Form Only
        <LoginForm />
      )}
    </AuthContext.Provider>
  );
}
