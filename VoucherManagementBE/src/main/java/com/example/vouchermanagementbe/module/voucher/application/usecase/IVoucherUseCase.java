package com.example.vouchermanagementbe.module.voucher.application.usecase;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherCreateRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUpdateRequest;

public interface IVoucherUseCase {
    VoucherResponse createVoucher(VoucherCreateRequest request);
    VoucherResponse updateVoucher(Long id, VoucherUpdateRequest request);
    void deleteVoucher(Long id);
    VoucherResponse getVoucherByCode(String code);
    PageResponse<VoucherResponse> getVouchers(int pageNo, int pageSize);
}
