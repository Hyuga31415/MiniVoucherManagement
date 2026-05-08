package com.example.vouchermanagementbe.module.voucher.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplyVoucherRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Voucher ID is required")
    private Long voucherId;
}
