"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * Select - Reusable select/dropdown component
 */
export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = "Select an option",
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-black mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full px-2.5 py-1.5 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none pr-8 ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500"
            } ${className}`}
          {...props}
        >
          <option value="" className="text-black">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-black pointer-events-none" />
      </div>
      {error && <p className="text-red-600 text-[11px] mt-0.5">{error}</p>}
    </div>
  );
};