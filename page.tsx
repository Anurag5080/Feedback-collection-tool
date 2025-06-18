"use client";

import { FeedbackForm } from "@/app/components/feedback-form";
import { AnimatedBackground } from "@/app/components/ui/animated-background";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/app/components/ui/button";
import { Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">FeedbackPro</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            We Value Your Feedback
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Help us improve our products and services by sharing your thoughts and experiences. Your feedback shapes our future.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FeedbackForm />
        </motion.div>
      </main>
    </div>
  );
}