package com.example.vouchermanagementbe.module.voucher.infrastructure.repository;

import com.example.vouchermanagementbe.module.voucher.infrastructure.entity.VoucherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherJpaRepository extends JpaRepository<VoucherEntity, Long> {
    Optional<VoucherEntity> findByCode(String code);
    boolean existsByCode(String code);
}
