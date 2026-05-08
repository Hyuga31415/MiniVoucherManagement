"use client";

import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Card - Reusable card component for grouping content
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = "",
}) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-200">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};
