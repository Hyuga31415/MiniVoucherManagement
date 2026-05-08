package com.example.vouchermanagementbe.module.voucher.domain.repository;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.domain.entity.Voucher;

import java.util.Optional;

public interface IVoucherRepository {
    Voucher save(Voucher voucher);
    Optional<Voucher> findById(Long id);
    Optional<Voucher> findByCode(String code);
    PageResponse<Voucher> findAll(int pageNo, int pageSize);
    void deleteById(Long id);
}
