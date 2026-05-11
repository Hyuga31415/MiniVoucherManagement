"use client";

import React, { useState, useEffect } from "react";
import { useVouchers } from "@/core/application/hooks/useVouchers";
import { useUsers } from "@/core/application/hooks/useUsers";
import { useVoucherUsages } from "@/core/application/hooks/useVoucherUsages";
import { useNotification } from "@/core/application/hooks/useNotification";
import {
  Button,
  Input,
  Select,
  Card,
  Table,
  Badge,
  Pagination,
  LoadingState,
  EmptyState,
} from "@/presentation/components";
import { VoucherUsage } from "@/core/domain/entities/VoucherUsage";
import { Send } from "lucide-react";

export const UsagesTab: React.FC = () => {
  const { vouchers, applyVoucher } = useVouchers();
  const { users } = useUsers();
  const { usages, loading, pageInfo, refreshUsages, goToPage, changePageSize } = useVoucherUsages();
  const { warning: notifyWarning } = useNotification();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    console.log("UsagesTab: pageInfo updated:", pageInfo);
  }, [pageInfo]);

  const getUserName = (userId: number): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : `User #${userId}`;
  };

  const getUserEmail = (userId: number): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.email : "";
  };

  const getVoucherCode = (voucherId: number): string => {
    const voucher = vouchers.find((v) => v.id === voucherId);
    return voucher ? voucher.code : `Voucher #${voucherId}`;
  };

  const getVoucherDiscount = (voucherId: number): number | null => {
    const voucher = vouchers.find((v) => v.id === voucherId);
    return voucher ? voucher.discountPercent : null;
  };

  const handleApplyVoucher = async () => {
    if (!selectedUserId || !voucherCode.trim()) {
      notifyWarning("Please select a user and enter a voucher code");
      return;
    }

    const normalizedCode = voucherCode.toUpperCase().trim();
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === normalizedCode
    );
    
    if (!voucher) {
      notifyWarning(`Voucher code "${normalizedCode}" does not exist. Please check and try again.`);
      return;
    }

    if (!voucher.isValid()) {
      notifyWarning("Voucher has expired or is inactive");
      return;
    }

    if (!voucher.hasAvailableQuantity()) {
      notifyWarning("Voucher is out of stock");
      return;
    }

    setIsApplying(true);
    try {
      await applyVoucher(parseInt(selectedUserId), voucher.id!);
      setSelectedUserId("");
      setVoucherCode("");
      await refreshUsages();
    } finally {
      setIsApplying(false);
    }
  };

  const userOptions = users.map((u) => ({
    value: u.id?.toString() || "",
    label: `${u.fullName} (${u.email})`,
  }));

  return (
    <div className="space-y-4">
      <Card title="Apply Voucher to User" subtitle="Select a user and enter voucher code to apply discount">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select label="Select User" options={userOptions} placeholder="Choose a user..." value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} />
          <Input label="Voucher Code" placeholder="e.g., SALE10" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} />
          <div className="flex items-end">
            <Button onClick={handleApplyVoucher} isLoading={isApplying} className="w-full flex items-center justify-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Apply Voucher
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Voucher Usage History" subtitle="View all voucher applications">
        {loading && <LoadingState message="Loading usage history..." />}
        {!loading && usages.length === 0 && (
          <EmptyState title="No usage records" message="Vouchers will appear here once they are applied to users" />
        )}
        {!loading && usages.length > 0 && (
          <>
            <Table
              columns={[
                { key: "id", label: "ID", width: "8%" },
                {
                  key: "userId", label: "User", width: "25%",
                  render: (_, row: VoucherUsage) => (
                    <div>
                      <p className="font-medium text-xs">{getUserName(row.userId)}</p>
                    </div>
                  ),
                },
                {
                  key: "voucherId", label: "Voucher", width: "20%",
                  render: (_, row: VoucherUsage) => <Badge variant="primary">{getVoucherCode(row.voucherId)}</Badge>,
                },
                {
                  key: "actions", label: "Discount", width: "12%",
                  render: (_, row: VoucherUsage) => {
                    const d = getVoucherDiscount(row.voucherId);
                    return d !== null ? <Badge variant="success">{d}%</Badge> : "-";
                  },
                },
                {
                  key: "usedAt", label: "Used At", width: "25%",
                  render: (_, row: VoucherUsage) => row.getFormattedDate() || "-",
                },
              ]}
              data={usages}
            />
            <Pagination pageInfo={pageInfo} onPageChange={goToPage} onPageSizeChange={changePageSize} />
          </>
        )}
      </Card>
    </div>
  );
};
