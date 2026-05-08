"use client";

import React, { useState } from "react";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

/**
 * Tabs - Reusable tabs component for switching between different sections
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-2 font-medium text-xs whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) =>
          activeTab === tab.id ? (
            <div key={tab.id} className="animate-fadeIn">
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
