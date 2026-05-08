"use client";

import { useState, useCallback } from "react";

/**
 * Notification type definitions
 */
export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}

/**
 * useNotification - Custom hook for managing notifications/toasts
 * Provides methods to show/hide notifications with auto-dismiss
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Show notification with auto-dismiss after 3 seconds
   */
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
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);

      return id;
    },
    []
  );

  /**
   * Show success notification
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      notify(message, "success", duration);
    },
    [notify]
  );

  /**
   * Show error notification
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      notify(message, "error", duration);
    },
    [notify]
  );

  /**
   * Show warning notification
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      notify(message, "warning", duration);
    },
    [notify]
  );

  /**
   * Show info notification
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      notify(message, "info", duration);
    },
    [notify]
  );

  /**
   * Manually dismiss notification by ID
   */
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  };
};
