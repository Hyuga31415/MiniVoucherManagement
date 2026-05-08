package com.example.vouchermanagementbe.module.voucher.application.dto;

import com.example.vouchermanagementbe.module.voucher.domain.entity.Voucher;
import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VoucherResponse {
    private Long id;
    private String code;
    private Integer discountPercent;
    private Integer quantity;
    private LocalDate expiredDate;
    private VoucherStatus status;
    private LocalDateTime createdAt;

    public static VoucherResponse fromDomain(Voucher voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .discountPercent(voucher.getDiscountPercent())
                .quantity(voucher.getQuantity())
                .expiredDate(voucher.getExpiredDate())
                .status(voucher.getStatus())
                .createdAt(voucher.getCreatedAt())
                .build();
    }
}
