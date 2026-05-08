package com.example.vouchermanagementbe.module.voucher.application.dto;

import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VoucherUpdateRequest {
    @Min(value = 1, message = "Discount must be between 1 and 100")
    @Max(value = 100, message = "Discount must be between 1 and 100")
    private Integer discountPercent;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;

    private LocalDate expiredDate;
    
    private VoucherStatus status;
}
