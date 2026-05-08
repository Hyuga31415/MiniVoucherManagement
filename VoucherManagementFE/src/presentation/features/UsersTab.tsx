"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useUsers } from "@/core/application/hooks/useUsers";
import {
  Button,
  Input,
  Modal,
  ConfirmDialog,
  Table,
  Card,
  LoadingState,
  EmptyState,
  Pagination,
} from "@/presentation/components";
import { User } from "@/core/domain/entities/User";

/**
 * UsersTab - Tab component for managing users
 */
export const UsersTab: React.FC = () => {
  const { users, loading, createUser, updateUser, deleteUser, pageInfo, goToPage, changePageSize, fetchUsers } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null; isLoading: boolean }>({
    isOpen: false,
    id: null,
    isLoading: false,
  });

  /**
   * Open modal for creating new user
   */
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", phone: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing existing user
   */
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form and submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(formData.email))
      errors.email = "Email format is invalid";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create or Update
    if (editingUser) {
      const result = await updateUser(editingUser.id!, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      if (result) setIsModalOpen(false);
    } else {
      const result = await createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      if (result) setIsModalOpen(false);
    }
  };

  /**
   * Open delete confirmation popup
   */
  const handleDeleteUser = (id: number) => {
    setDeleteConfirm({ isOpen: true, id, isLoading: false });
  };

  /**
   * Confirm delete user
   */
  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    await deleteUser(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null, isLoading: false });
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={handleAddUser} className="flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      {loading && <LoadingState message="Loading users..." />}
      {!loading && users.length === 0 && (
        <EmptyState title="No users found" message="Create your first user to get started" />
      )}
      {!loading && users.length > 0 && (
        <Card>
          <Table
            columns={[
              { key: "id", label: "ID", width: "8%" },
              { key: "fullName", label: "Full Name", width: "22%" },
              { key: "email", label: "Email", width: "25%" },
              { key: "phone", label: "Phone", width: "15%" },
              {
                key: "createdAt",
                label: "Created At",
                width: "15%",
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
                width: "15%",
                render: (_, row: User) => (
                  <div className="flex gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditUser(row)}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(row.id!)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={users}
          />
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
        title={editingUser ? "Edit User" : "Create New User"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Full Name"
            placeholder="Nguyen Van A..."
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
            }}
            error={formErrors.fullName}
          />

          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (formErrors.email)
                setFormErrors({ ...formErrors, email: "" });
            }}
            error={formErrors.email}
          />

          <Input
            label="Phone (Optional)"
            placeholder="0901234567"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (formErrors.phone)
                setFormErrors({ ...formErrors, phone: "" });
            }}
            error={formErrors.phone}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
      />
    </div>
  );
};
