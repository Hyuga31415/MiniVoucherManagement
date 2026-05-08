package com.example.vouchermanagementbe.module.voucher.infrastructure.adapter;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherUsage;
import com.example.vouchermanagementbe.module.voucher.domain.repository.IVoucherUsageRepository;
import com.example.vouchermanagementbe.module.voucher.infrastructure.entity.VoucherUsageEntity;
import com.example.vouchermanagementbe.module.voucher.infrastructure.repository.VoucherUsageJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VoucherUsageRepositoryAdapter implements IVoucherUsageRepository {

    private final VoucherUsageJpaRepository repository;

    @Override
    public VoucherUsage save(VoucherUsage usage) {
        VoucherUsageEntity entity = VoucherUsageEntity.builder()
                .id(usage.getId())
                .userId(usage.getUserId())
                .voucherId(usage.getVoucherId())
                .usedAt(usage.getUsedAt())
                .build();
        VoucherUsageEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public PageResponse<VoucherUsage> findAll(int pageNo, int pageSize) {
        Page<VoucherUsageEntity> page = repository.findAll(PageRequest.of(pageNo, pageSize));
        List<VoucherUsage> content = page.getContent().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());

        return PageResponse.<VoucherUsage>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private VoucherUsage toDomain(VoucherUsageEntity entity) {
        return VoucherUsage.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .voucherId(entity.getVoucherId())
                .usedAt(entity.getUsedAt())
                .build();
    }
}
