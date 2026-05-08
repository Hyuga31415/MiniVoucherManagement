package com.example.vouchermanagementbe.module.voucher.application.usecase;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.ApplyVoucherRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUsageResponse;

public interface ApplyVoucherUseCase {
    VoucherUsageResponse applyVoucher(ApplyVoucherRequest request);
    PageResponse<VoucherUsageResponse> getVoucherUsages(int pageNo, int pageSize);
}
