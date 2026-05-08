"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

/**
 * ConfirmDialog - Popup confirmation dialog to replace browser confirm()
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-500 bg-red-100",
      button: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
    },
    warning: {
      icon: "text-yellow-500 bg-yellow-100",
      button: "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white",
    },
    info: {
      icon: "text-blue-500 bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 flex items-start gap-3">
          <div className={`p-2 rounded-full flex-shrink-0 ${styles.icon}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-gray-700 text-xs leading-relaxed pt-1">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 ${styles.button}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
