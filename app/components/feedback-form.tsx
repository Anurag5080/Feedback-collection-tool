"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { StarRating } from "@/app/components/ui/star-rating";
import { GlassCard } from "@/app/components/ui/glass-card";
import { Label } from "@/app/components/ui/label";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  feedback: z.string().min(10, "Feedback must be at least 10 characters long"),
  rating: z.number().min(1, "Please provide a rating").max(5)
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema)
  });

  const onSubmit = async (data: FeedbackForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setIsSubmitted(true);
      reset();
      setRating(0);
      toast.success("Thank you for your feedback!");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue("rating", newRating);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <GlassCard className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-300">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <GlassCard className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Share Your Feedback</h2>
          <p className="text-gray-300">Help us improve by sharing your thoughts</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Name (Optional)</Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Your name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email (Optional)</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Rating</Label>
            <div className="flex justify-center">
              <StarRating
                value={rating}
                onChange={handleRatingChange}
                size="lg"
              />
            </div>
            {errors.rating && (
              <p className="text-red-400 text-sm text-center">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-white">Feedback *</Label>
            <Textarea
              {...register("feedback")}
              id="feedback"
              placeholder="Tell us what you think..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50 resize-none"
            />
            {errors.feedback && (
              <p className="text-red-400 text-sm">{errors.feedback.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}