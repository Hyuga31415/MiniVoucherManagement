"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type: NotificationType, duration?: number) => string;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider - Provides notification context to entire app
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    (message: string, type: NotificationType = "info", duration = 3000) => {
      const id = `${Date.now()}-${Math.random()}`;
      const notification: Notification = {
        id,
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      return notify(message, "success", duration);
    },
    [notify]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return notify(message, "error", duration);
    },
    [notify]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return notify(message, "warning", duration);
    },
    [notify]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return notify(message, "info", duration);
    },
    [notify]
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * useNotification - Hook to use notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};
