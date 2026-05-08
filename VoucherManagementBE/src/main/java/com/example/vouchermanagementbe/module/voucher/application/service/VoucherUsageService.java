package com.example.vouchermanagementbe.module.voucher.application.service;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.domain.repository.UserRepositoryPort;
import com.example.vouchermanagementbe.module.voucher.domain.entity.Voucher;
import com.example.vouchermanagementbe.module.voucher.domain.repository.IVoucherRepository;
import com.example.vouchermanagementbe.module.voucher.application.dto.ApplyVoucherRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUsageResponse;
import com.example.vouchermanagementbe.module.voucher.application.usecase.ApplyVoucherUseCase;
import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherUsage;
import com.example.vouchermanagementbe.module.voucher.domain.repository.IVoucherUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherUsageService implements ApplyVoucherUseCase {

    private final IVoucherUsageRepository voucherUsageRepository;
    private final IVoucherRepository voucherRepository;
    private final UserRepositoryPort userRepositoryPort;

    @Override
    @Transactional
    public VoucherUsageResponse applyVoucher(ApplyVoucherRequest request) {
        log.info("Applying voucher - userId: {}, voucherId: {}", request.getUserId(), request.getVoucherId());

        // Validate User
        userRepositoryPort.findById(request.getUserId())
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", request.getUserId());
                    return new RuntimeException("User not found");
                });

        // Load Voucher
        Voucher voucher = voucherRepository.findById(request.getVoucherId())
                .orElseThrow(() -> {
                    log.warn("Voucher not found with id: {}", request.getVoucherId());
                    return new RuntimeException("Voucher not found");
                });

        // Use voucher (Domain logic rules are checked here: status, expiredDate, quantity)
        voucher.use();
        log.info("Voucher domain validation passed - code: {}, remaining quantity: {}", voucher.getCode(), voucher.getQuantity());

        // Save voucher to update new quantity
        voucherRepository.save(voucher);

        // Record usage history
        VoucherUsage usage = VoucherUsage.builder()
                .userId(request.getUserId())
                .voucherId(request.getVoucherId())
                .usedAt(LocalDateTime.now())
                .build();

        VoucherUsage savedUsage = voucherUsageRepository.save(usage);
        log.info("Voucher usage recorded - usageId: {}, userId: {}, voucherId: {}",
                savedUsage.getId(), savedUsage.getUserId(), savedUsage.getVoucherId());

        return VoucherUsageResponse.fromDomain(savedUsage);
    }

    @Override
    public PageResponse<VoucherUsageResponse> getVoucherUsages(int pageNo, int pageSize) {
        log.info("Fetching voucher usages - page: {}, size: {}", pageNo, pageSize);

        PageResponse<VoucherUsage> pageDomain = voucherUsageRepository.findAll(pageNo, pageSize);
        List<VoucherUsageResponse> content = pageDomain.getContent().stream()
                .map(VoucherUsageResponse::fromDomain)
                .collect(Collectors.toList());

        log.info("Fetched {} voucher usage records", content.size());

        return PageResponse.<VoucherUsageResponse>builder()
                .content(content)
                .pageNo(pageDomain.getPageNo())
                .pageSize(pageDomain.getPageSize())
                .totalElements(pageDomain.getTotalElements())
                .totalPages(pageDomain.getTotalPages())
                .last(pageDomain.isLast())
                .build();
    }
}
