"use client";

import React from "react";
import { Spinner } from "./Spinner";

interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState - Component for displaying loading state
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <Spinner size="md" />
      <p className="text-gray-600 text-xs font-medium">{message}</p>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}

/**
 * EmptyState - Component for displaying empty state
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      {icon && <div className="text-gray-400 text-2xl">{icon}</div>}
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {message && <p className="text-gray-600 text-xs">{message}</p>}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorState - Component for displaying error state
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error",
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="text-red-600 text-2xl">⚠️</div>
      <h3 className="font-semibold text-red-900">{title}</h3>
      <p className="text-red-700 text-xs text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
};
