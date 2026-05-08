"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input - Reusable input component with label and error display
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-black mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-2.5 py-1.5 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500"
          } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-[11px] mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-black text-[11px] mt-0.5">{helperText}</p>
      )}
    </div>
  );
};