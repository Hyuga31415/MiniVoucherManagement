"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Spinner - Loading spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-600 border-t-transparent ${sizeStyles[size]} ${className}`}
    />
  );
};
