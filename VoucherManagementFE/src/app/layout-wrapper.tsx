"use client";

import { NotificationProvider } from "@/core/application/contexts/NotificationContext";

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};
