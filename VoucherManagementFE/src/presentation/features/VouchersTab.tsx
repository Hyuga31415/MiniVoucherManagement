"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useVouchers } from "@/core/application/hooks/useVouchers";
import {
  Button,
  Input,
  Modal,
  ConfirmDialog,
  Table,
  Card,
  Badge,
  Pagination,
  LoadingState,
  EmptyState,
} from "@/presentation/components";
import { Voucher } from "@/core/domain/entities/Voucher";

/**
 * VouchersTab - Tab component for managing vouchers
 */
export const VouchersTab: React.FC = () => {
  const {
    vouchers,
    searchCode,
    loading,
    pageInfo,
    fetchVouchers,
    searchVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    goToPage,
    changePageSize,
  } = useVouchers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    quantity: 0,
    expiredDate: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchInput, setSearchInput] = useState(searchCode);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null; isLoading: boolean }>({
    isOpen: false,
    id: null,
    isLoading: false,
  });

  /**
   * Open modal for creating new voucher
   */
  const handleAddVoucher = () => {
    setEditingVoucher(null);
    setFormData({
      code: "",
      discountPercent: 0,
      quantity: 0,
      expiredDate: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing existing voucher
   */
  const handleEditVoucher = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      discountPercent: voucher.discountPercent,
      quantity: voucher.quantity,
      expiredDate: voucher.expiredDate,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  /**
   * Validate form and submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate
    if (!formData.code.trim()) errors.code = "Code is required";
    if (formData.discountPercent < 1 || formData.discountPercent > 100) {
      errors.discountPercent = "Discount must be between 1-100%";
    }
    if (formData.quantity < 0) errors.quantity = "Quantity must be >= 0";
    if (!formData.expiredDate) errors.expiredDate = "Expired date is required";

    const expiredDate = new Date(formData.expiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiredDate <= today) {
      errors.expiredDate = "Expired date must be in the future";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create or Update
    if (editingVoucher) {
      const result = await updateVoucher(editingVoucher.id!, {
        code: formData.code,
        discountPercent: formData.discountPercent,
        quantity: formData.quantity,
        expiredDate: formData.expiredDate,
        status: editingVoucher.status,
      });
      if (result) setIsModalOpen(false);
    } else {
      const result = await createVoucher({
        code: formData.code,
        discountPercent: formData.discountPercent,
        quantity: formData.quantity,
        expiredDate: formData.expiredDate,
        status: "ACTIVE",
      });
      if (result) setIsModalOpen(false);
    }
  };

  /**
   * Open delete confirmation popup
   */
  const handleDeleteVoucher = (id: number) => {
    setDeleteConfirm({ isOpen: true, id, isLoading: false });
  };

  /**
   * Confirm delete voucher
   */
  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    await deleteVoucher(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null, isLoading: false });
  };

  const MIN_SEARCH_LENGTH = 3;

  /**
   * Handle search: only call API when code length >= MIN_SEARCH_LENGTH
   * If empty, reset to fetch all vouchers
   */
  const handleSearch = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      // reset to default list
      fetchVouchers(0, pageInfo.pageSize);
      return;
    }

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      // do not call API for short queries; optionally reset or keep current
      fetchVouchers(0, pageInfo.pageSize);
      return;
    }

    searchVouchers(trimmed, 0, pageInfo.pageSize);
  };

  // Debounced auto-search when input length >= MIN_SEARCH_LENGTH
  const searchDebounceRef = useRef<number | null>(null);
  useEffect(() => {
    const trimmed = searchInput.trim();

    // Clear any pending timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }

    if (!trimmed) {
      fetchVouchers(0, pageInfo.pageSize);
      return;
    }

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      fetchVouchers(0, pageInfo.pageSize);
      return;
    }

    // Debounce before triggering search
    const id = window.setTimeout(() => {
      handleSearch(trimmed);
    }, 500);
    searchDebounceRef.current = id;

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [searchInput, pageInfo.pageSize]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Search and Add Button */}
      <div className="flex gap-3 items-end">
        <Input
          label="Search by Code"
          placeholder="Enter voucher code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchInput);
            }
          }}
          helperText={
            searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH_LENGTH
              ? `Enter at least ${MIN_SEARCH_LENGTH} characters to search`
              : undefined
          }
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleAddVoucher} 
            className="flex items-center justify-center gap-1.5 h-[42px] px-4 text-sm"
          >
            Add Voucher
          </Button>
        </div>
      </div>

      {/* Vouchers Table */}
      {loading && <LoadingState message="Loading vouchers..." />}
      {!loading && vouchers.length === 0 && (
        <EmptyState title="No vouchers found" message="Create your first voucher to get started" />
      )}
      {!loading && vouchers.length > 0 && (
        <Card>
          <Table
            columns={[
              { key: "code", label: "Code", width: "12%" },
              {
                key: "discountPercent",
                label: "Discount",
                width: "12%",
                render: (value) => <Badge variant="primary">{value}%</Badge>,
              },
              { key: "quantity", label: "Quantity", width: "12%" },
              {
                key: "expiredDate",
                label: "Expired Date",
                width: "15%",
                render: (value) => {
                  const isExpired = new Date(value) <= new Date();
                  return (
                    <Badge variant={isExpired ? "danger" : "success"}>
                      {value}
                    </Badge>
                  );
                },
              },
              {
                key: "status",
                label: "Status",
                width: "12%",
                render: (value) => {
                  const variant = value === "ACTIVE" ? "success" : value === "EXPIRED" ? "danger" : "warning";
                  return <Badge variant={variant}>{value}</Badge>;
                },
              },
              {
                key: "createdAt",
                label: "Created At",
                width: "16%",
                render: (value) => {
                  if (!value) return "-";
                  return new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                },
              },
              {
                key: "actions",
                label: "Actions",
                width: "21%",
                render: (_, row: Voucher) => (
                  <div className="flex gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditVoucher(row)}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteVoucher(row.id!)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={vouchers}
          />
          {/* Pagination */}
          <Pagination
            pageInfo={pageInfo}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        </Card>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVoucher ? "Edit Voucher" : "Create New Voucher"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingVoucher ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Code"
            placeholder="e.g., SALE20"
            value={formData.code}
            onChange={(e) => {
              setFormData({ ...formData, code: e.target.value });
              if (formErrors.code) setFormErrors({ ...formErrors, code: "" });
            }}
            error={formErrors.code}
          />

          <Input
            label="Discount Percent"
            type="number"
            min="1"
            max="100"
            value={formData.discountPercent}
            onChange={(e) => {
              setFormData({
                ...formData,
                discountPercent: parseInt(e.target.value) || 0,
              });
              if (formErrors.discountPercent)
                setFormErrors({ ...formErrors, discountPercent: "" });
            }}
            error={formErrors.discountPercent}
          />

          <Input
            label="Quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => {
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 0,
              });
              if (formErrors.quantity)
                setFormErrors({ ...formErrors, quantity: "" });
            }}
            error={formErrors.quantity}
          />

          <Input
            label="Expired Date"
            type="date"
            min={today}
            value={formData.expiredDate}
            onChange={(e) => {
              setFormData({ ...formData, expiredDate: e.target.value });
              if (formErrors.expiredDate)
                setFormErrors({ ...formErrors, expiredDate: "" });
            }}
            error={formErrors.expiredDate}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete Voucher"
        message="Are you sure you want to delete this voucher? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
      />
    </div>
  );
};