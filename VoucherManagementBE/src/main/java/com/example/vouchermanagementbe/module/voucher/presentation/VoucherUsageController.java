package com.example.vouchermanagementbe.module.voucher.presentation;

import com.example.vouchermanagementbe.core.ApiResponse;
import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.ApplyVoucherRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUsageResponse;
import com.example.vouchermanagementbe.module.voucher.application.usecase.ApplyVoucherUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/voucher-usages")
@RequiredArgsConstructor
public class VoucherUsageController {

    private final ApplyVoucherUseCase applyVoucherUseCase;

    @PostMapping
    public ApiResponse<VoucherUsageResponse> applyVoucher(@Valid @RequestBody ApplyVoucherRequest request) {
        return ApiResponse.success(applyVoucherUseCase.applyVoucher(request), "Voucher applied successfully");
    }

    @GetMapping
    public ApiResponse<PageResponse<VoucherUsageResponse>> getVoucherUsages(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.success(applyVoucherUseCase.getVoucherUsages(pageNo, pageSize));
    }
}
