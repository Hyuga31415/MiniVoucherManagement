package com.example.vouchermanagementbe.module.voucher.application.dto;

import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherUsage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VoucherUsageResponse {
    private Long id;
    private Long userId;
    private Long voucherId;
    private LocalDateTime usedAt;

    public static VoucherUsageResponse fromDomain(VoucherUsage usage) {
        return VoucherUsageResponse.builder()
                .id(usage.getId())
                .userId(usage.getUserId())
                .voucherId(usage.getVoucherId())
                .usedAt(usage.getUsedAt())
                .build();
    }
}
