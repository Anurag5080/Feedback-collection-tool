import { cn } from "@/app/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md",
        "shadow-2xl shadow-black/20",
        "before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-transparent before:p-[1px]",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}