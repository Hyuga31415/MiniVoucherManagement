package com.example.vouchermanagementbe.module.voucher.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    private Long id;
    private String code;
    private Integer discountPercent;
    private Integer quantity;
    private LocalDate expiredDate;
    private VoucherStatus status;
    private LocalDateTime createdAt;

    // Logic khởi tạo
    public void validateForCreation() {
        if (discountPercent == null || discountPercent < 1 || discountPercent > 100) {
            throw new RuntimeException("Discount percent must be between 1 and 100");
        }
        if (quantity == null || quantity < 0) {
            throw new RuntimeException("Quantity must be greater than or equal to 0");
        }
        if (expiredDate == null || expiredDate.isBefore(LocalDate.now()) || expiredDate.isEqual(LocalDate.now())) {
            throw new RuntimeException("Expired date must be in the future");
        }
    }

    // Nghiệp vụ sử dụng voucher
    public void use() {
        if (this.status == VoucherStatus.INACTIVE) {
            throw new RuntimeException("Voucher is INACTIVE");
        }
        if (this.expiredDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Voucher is expired");
        }
        if (this.quantity <= 0) {
            throw new RuntimeException("Voucher is out of stock");
        }
        this.quantity -= 1;
    }
}
