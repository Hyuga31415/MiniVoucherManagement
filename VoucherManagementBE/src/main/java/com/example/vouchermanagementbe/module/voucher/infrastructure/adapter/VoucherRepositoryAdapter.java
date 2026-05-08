package com.example.vouchermanagementbe.module.voucher.infrastructure.adapter;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.domain.repository.IVoucherRepository;
import com.example.vouchermanagementbe.module.voucher.domain.entity.Voucher;
import com.example.vouchermanagementbe.module.voucher.infrastructure.entity.VoucherEntity;
import com.example.vouchermanagementbe.module.voucher.infrastructure.repository.VoucherJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VoucherRepositoryAdapter implements IVoucherRepository {

    private final VoucherJpaRepository voucherJpaRepository;

    @Override
    public Voucher save(Voucher voucher) {
        VoucherEntity entity = toEntity(voucher);
        VoucherEntity saved = voucherJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Voucher> findById(Long id) {
        return voucherJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Voucher> findByCode(String code) {
        return voucherJpaRepository.findByCode(code).map(this::toDomain);
    }

    @Override
    public PageResponse<Voucher> findAll(int pageNo, int pageSize) {
        Page<VoucherEntity> page = voucherJpaRepository.findAll(PageRequest.of(pageNo, pageSize));
        List<Voucher> content = page.getContent().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());

        return PageResponse.<Voucher>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public void deleteById(Long id) {
        voucherJpaRepository.deleteById(id);
    }

    private VoucherEntity toEntity(Voucher domain) {
        return VoucherEntity.builder()
                .id(domain.getId())
                .code(domain.getCode())
                .discountPercent(domain.getDiscountPercent())
                .quantity(domain.getQuantity())
                .expiredDate(domain.getExpiredDate())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    private Voucher toDomain(VoucherEntity entity) {
        return Voucher.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .discountPercent(entity.getDiscountPercent())
                .quantity(entity.getQuantity())
                .expiredDate(entity.getExpiredDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
