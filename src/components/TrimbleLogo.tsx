import React from 'react';

export default function TrimbleLogo({ className = "h-8", variant = "default" }: { className?: string, variant?: "default" | "white" | "blue" }) {
  const color = variant === "white" ? "white" : (variant === "blue" ? "#0063A3" : "#0063A3");
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L95 85 L5 85 Z" fill={color} />
        <circle cx="50" cy="58" r="18" stroke={variant === "white" ? "#0063A3" : "white"} strokeWidth="2" />
        <ellipse cx="50" cy="58" rx="18" ry="6" stroke={variant === "white" ? "#0063A3" : "white"} strokeWidth="1.5" />
        <ellipse cx="50" cy="58" rx="6" ry="18" stroke={variant === "white" ? "#0063A3" : "white"} strokeWidth="1.5" />
      </svg>
      <span className="font-bold tracking-tight text-[1.2em]" style={{ color: variant === "white" ? "white" : "#0063A3", fontFamily: 'Roboto, sans-serif' }}>
        Trimble<span className="text-[0.4em] align-top ml-0.5">®</span>
      </span>
    </div>
  );
}
