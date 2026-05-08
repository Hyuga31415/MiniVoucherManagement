package com.example.vouchermanagementbe.module.voucher.domain.repository;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherUsage;

public interface IVoucherUsageRepository {
    VoucherUsage save(VoucherUsage usage);
    PageResponse<VoucherUsage> findAll(int pageNo, int pageSize);
}
