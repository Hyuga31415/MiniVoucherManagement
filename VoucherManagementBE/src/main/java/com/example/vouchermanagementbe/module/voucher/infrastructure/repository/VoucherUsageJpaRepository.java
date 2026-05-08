package com.example.vouchermanagementbe.module.voucher.infrastructure.repository;

import com.example.vouchermanagementbe.module.voucher.infrastructure.entity.VoucherUsageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherUsageJpaRepository extends JpaRepository<VoucherUsageEntity, Long> {
}
