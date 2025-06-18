"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-all duration-200",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange?.(star)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-yellow-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}