"use client";

import React from "react";
import { Ticket, Users, History } from "lucide-react";
import { useNotification } from "@/core/application/hooks/useNotification";
import { Tabs, ToastContainer } from "@/presentation/components";
import { VouchersTab } from "@/presentation/features/VouchersTab";
import { UsersTab } from "@/presentation/features/UsersTab";
import { UsagesTab } from "@/presentation/features/UsagesTab";

/**
 * Home Page - Main dashboard with tabs for Vouchers, Users, and Usages
 */
export default function Home() {
  const { notifications, dismiss } = useNotification();

  // Define tabs
  const tabs = [
    {
      id: "vouchers",
      label: "Manage Vouchers",
      icon: <Ticket className="w-3.5 h-3.5" />,
      content: <VouchersTab />,
    },
    {
      id: "users",
      label: "Manage Users",
      icon: <Users className="w-3.5 h-3.5" />,
      content: <UsersTab />,
    },
    {
      id: "usages",
      label: "Voucher Usages",
      icon: <History className="w-3.5 h-3.5" />,
      content: <UsagesTab />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="font-bold text-gray-900">
            Voucher Management System
          </h1>
          <p className="text-gray-600 mt-1 text-xs">
            Manage vouchers, users, and track usage history
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <Tabs tabs={tabs} defaultTab="vouchers" />
      </div>

      {/* Toast Container */}
      <ToastContainer notifications={notifications} onDismiss={dismiss} />
    </main>
  );
}
