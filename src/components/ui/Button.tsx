"use client";

import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
}: ButtonProps) {
  const base = "inline-flex items-center gap-2 font-medium transition-all text-sm rounded-full";
  const variants = {
    primary: "bg-signal text-ink hover:bg-signal/90",
    secondary: "border border-paper/20 text-paper/80 hover:border-paper/40 hover:text-paper",
    ghost: "text-paper/60 hover:text-paper",
  };
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {variant === "primary" && <ArrowRight className="w-4 h-4" />}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
      {variant === "primary" && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
