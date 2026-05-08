package com.example.vouchermanagementbe.module.voucher.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsage {
    private Long id;
    private Long userId;
    private Long voucherId;
    private LocalDateTime usedAt;
}
