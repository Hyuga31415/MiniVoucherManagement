"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge - Reusable badge component for labels and tags
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-medium",
    md: "px-2.5 py-0.5 text-xs font-medium",
  };

  return (
    <span
      className={`inline-block rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
