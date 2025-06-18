"use client";

import { useState, useEffect } from "react";
import { Login } from "@/app/components/admin/login";
import { Dashboard } from "@/app/components/admin/dashboard";
import { FeedbackForm } from "@/app/components/feedback-form";
import { AnimatedBackground } from "@/app/components/ui/animated-background";
import { verifyToken } from "@/app/lib/auth";
import { Button } from "@/app/components/ui/button";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      fetch("/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("adminToken");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatedBackground />

      <header className="w-full px-6 py-4 flex justify-between items-center bg-gray-950 bg-opacity-70 backdrop-blur-md text-white z-10 relative">
        <h1 className="text-xl font-bold">Feedback Portal</h1>
        <Button
          variant="ghost"
          onClick={() => setShowAdmin((prev) => !prev)}
          className="text-white hover:underline"
        >
          {showAdmin ? "Home" : "Admin Portal"}
        </Button>
      </header>

      <main className="min-h-screen pt-20 px-4">
        {showAdmin ? (
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Login onLogin={handleLogin} />
          )
        ) : (
          <FeedbackForm />
        )}
      </main>
    </div>
  );
}
