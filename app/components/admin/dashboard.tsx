"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GlassCard } from "@/app/components/ui/glass-card";
import { StarRating } from "@/app/components/ui/star-rating";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Users, Star, MessageCircle, TrendingUp, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";


interface DashboardData {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
  recentFeedbacks: any[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-white/10 rounded"></div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
          <p className="text-gray-300">Unable to load dashboard data.</p>
          <Button onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </GlassCard>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Feedbacks",
      value: data.totalFeedbacks,
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Average Rating",
      value: data.averageRating.toFixed(1),
      icon: Star,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Happy Customers",
      value: data.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0),
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Growth Rate",
      value: "+12.5%",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and analyze user feedback in real-time</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="rating" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Rating Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.ratingDistribution.filter(item => item.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ rating, count }) => `${rating}★ (${count})`}
                  >
                    {data.ratingDistribution.filter(item => item.count > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Feedbacks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Feedbacks</h3>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {data.recentFeedbacks.length > 0 ? (
                  data.recentFeedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                            {feedback.name || 'Anonymous'}
                          </Badge>
                          <StarRating value={feedback.rating} readonly size="sm" />
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{feedback.feedback}</p>
                      {feedback.email && (
                        <p className="text-xs text-gray-500 mt-1">{feedback.email}</p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No feedback entries yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}