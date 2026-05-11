"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PageInfo } from "@/core/domain/entities/ApiResponse";

interface PaginationProps {
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

/**
 * Pagination - Compact pagination component with page navigation
 */
export const Pagination: React.FC<PaginationProps> = ({
  pageInfo,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const { pageNo, pageSize, totalElements, totalPages } = pageInfo;

  if (totalElements === 0) return null;

  const startItem = pageNo * pageSize + 1;
  const endItem = Math.min((pageNo + 1) * pageSize, totalElements);

  // Generate page numbers to display
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(0);

      if (pageNo > 2) pages.push("...");

      // Show pages around current
      const start = Math.max(1, pageNo - 1);
      const end = Math.min(totalPages - 2, pageNo + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (pageNo < totalPages - 3) pages.push("...");

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between py-3 px-1 gap-4">
      {/* Info */}
      <div className="text-[11px] text-gray-500 whitespace-nowrap">
        {startItem}–{endItem} / {totalElements} (page {pageNo} of {totalPages - 1})
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => {
            console.log("First page button clicked");
            onPageChange(0);
          }}
          disabled={pageNo === 0}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Previous */}
        <button
          onClick={() => {
            console.log("Previous page button clicked");
            onPageChange(pageNo - 1);
          }}
          disabled={pageNo === 0}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-1 text-[11px] text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => {
                console.log("Page button clicked:", page);
                onPageChange(page as number);
              }}
              className={`min-w-[24px] h-6 text-[11px] rounded transition-colors cursor-pointer ${
                pageNo === page
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {(page as number) + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(pageNo + 1)}
          disabled={pageNo >= totalPages - 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={pageNo >= totalPages - 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>

      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-[11px] border border-gray-300 rounded px-1.5 py-0.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
