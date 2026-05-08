"use client";

import React from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { Notification } from "../../core/application/hooks/useNotification";

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

/**
 * Toast - Individual toast notification component
 */
export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconStyles = {
    success: { icon: CheckCircle, color: "text-green-500" },
    error: { icon: AlertCircle, color: "text-red-500" },
    warning: { icon: AlertTriangle, color: "text-yellow-500" },
    info: { icon: Info, color: "text-blue-500" },
  };

  const { icon: IconComponent, color } = iconStyles[notification.type];

  return (
    <div
      className={`border rounded-lg p-3 flex items-start gap-2 ${typeStyles[notification.type]} shadow-md animate-slideUp`}
    >
      <IconComponent className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} />
      <div className="flex-1">
        <p className="font-medium text-xs">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

/**
 * ToastContainer - Container for displaying multiple toast notifications
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};
