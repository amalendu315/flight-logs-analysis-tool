"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

export const LoginForm = () => {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a small network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(userName, passWord);
    if (success) {
      toast.success("Welcome back!");
    } else {
      toast.error("Invalid Credentials");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
          <ShieldAlert className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome👋 Flight Logs Analyst
        </h1>
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-950/50 backdrop-blur-sm text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your admin credentials to access the logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 h-11 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 h-11 focus-visible:ring-blue-600"
              />
            </div>
            <Button
              type="submit"
              className="h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-slate-500">
        &copy; Air IQ Inc. Internal System
      </p>
    </div>
  );
};
