package com.example.vouchermanagementbe.module.voucher.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VoucherCreateRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotNull(message = "Discount percent is required")
    @Min(value = 1, message = "Discount must be between 1 and 100")
    @Max(value = 100, message = "Discount must be between 1 and 100")
    private Integer discountPercent;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;

    @NotNull(message = "Expired date is required")
    private LocalDate expiredDate;
}
