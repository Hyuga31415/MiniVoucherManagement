package com.example.vouchermanagementbe.module.voucher.presentation;

import com.example.vouchermanagementbe.core.ApiResponse;
import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherCreateRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUpdateRequest;
import com.example.vouchermanagementbe.module.voucher.application.usecase.IVoucherUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherUseCase voucherUseCase;

    @PostMapping
    public ApiResponse<VoucherResponse> createVoucher(@Valid @RequestBody VoucherCreateRequest request) {
        return ApiResponse.success(voucherUseCase.createVoucher(request), "Voucher created successfully");
    }

    @GetMapping
    public ApiResponse<PageResponse<VoucherResponse>> getVouchers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.success(voucherUseCase.getVouchers(pageNo, pageSize));
    }

    @GetMapping("/search")
    public ApiResponse<VoucherResponse> getVoucherByCode(@RequestParam String code) {
        return ApiResponse.success(voucherUseCase.getVoucherByCode(code));
    }

    @PutMapping("/{id}")
    public ApiResponse<VoucherResponse> updateVoucher(
            @PathVariable Long id,
            @Valid @RequestBody VoucherUpdateRequest request
    ) {
        return ApiResponse.success(voucherUseCase.updateVoucher(id, request), "Voucher updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteVoucher(@PathVariable Long id) {
        voucherUseCase.deleteVoucher(id);
        return ApiResponse.success(null, "Voucher deleted successfully");
    }
}
