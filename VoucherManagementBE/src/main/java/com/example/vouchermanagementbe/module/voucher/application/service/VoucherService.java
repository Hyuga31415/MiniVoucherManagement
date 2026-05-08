package com.example.vouchermanagementbe.module.voucher.application.service;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherCreateRequest;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherResponse;
import com.example.vouchermanagementbe.module.voucher.application.dto.VoucherUpdateRequest;
import com.example.vouchermanagementbe.module.voucher.application.usecase.IVoucherUseCase;
import com.example.vouchermanagementbe.module.voucher.domain.entity.Voucher;
import com.example.vouchermanagementbe.module.voucher.domain.entity.VoucherStatus;
import com.example.vouchermanagementbe.module.voucher.domain.repository.IVoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherService implements IVoucherUseCase {

    private final IVoucherRepository voucherRepository;

    @Override
    public VoucherResponse createVoucher(VoucherCreateRequest request) {
        log.info("Creating voucher with code: {}", request.getCode());

        voucherRepository.findByCode(request.getCode()).ifPresent(v -> {
            log.warn("Voucher code already exists: {}", request.getCode());
            throw new RuntimeException("Voucher code already exists");
        });

        Voucher voucher = Voucher.builder()
                .code(request.getCode())
                .discountPercent(request.getDiscountPercent())
                .quantity(request.getQuantity())
                .expiredDate(request.getExpiredDate())
                .status(VoucherStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        voucher.validateForCreation();

        Voucher savedVoucher = voucherRepository.save(voucher);
        log.info("Voucher created successfully with id: {}", savedVoucher.getId());
        return VoucherResponse.fromDomain(savedVoucher);
    }

    @Override
    public VoucherResponse updateVoucher(Long id, VoucherUpdateRequest request) {
        log.info("Updating voucher id: {}", id);

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Voucher not found with id: {}", id);
                    return new RuntimeException("Voucher not found");
                });

        if (request.getDiscountPercent() != null) {
            voucher.setDiscountPercent(request.getDiscountPercent());
        }
        if (request.getQuantity() != null) {
            voucher.setQuantity(request.getQuantity());
        }
        if (request.getExpiredDate() != null) {
            voucher.setExpiredDate(request.getExpiredDate());
        }
        if (request.getStatus() != null) {
            voucher.setStatus(request.getStatus());
        }

        // Validate lại trạng thái và dữ liệu
        voucher.validateForCreation();

        Voucher updatedVoucher = voucherRepository.save(voucher);
        log.info("Voucher updated successfully with id: {}", updatedVoucher.getId());
        return VoucherResponse.fromDomain(updatedVoucher);
    }

    @Override
    public void deleteVoucher(Long id) {
        log.info("Deleting voucher id: {}", id);

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Voucher not found with id: {}", id);
                    return new RuntimeException("Voucher not found");
                });
        voucherRepository.deleteById(voucher.getId());
        log.info("Voucher deleted successfully with id: {}", id);
    }

    @Override
    public VoucherResponse getVoucherByCode(String code) {
        log.info("Searching voucher by code: {}", code);

        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.warn("Voucher not found with code: {}", code);
                    return new RuntimeException("Voucher not found");
                });
        return VoucherResponse.fromDomain(voucher);
    }

    @Override
    public PageResponse<VoucherResponse> getVouchers(int pageNo, int pageSize) {
        log.info("Fetching vouchers - page: {}, size: {}", pageNo, pageSize);

        PageResponse<Voucher> page = voucherRepository.findAll(pageNo, pageSize);
        List<VoucherResponse> content = page.getContent().stream()
                .map(VoucherResponse::fromDomain)
                .collect(Collectors.toList());

        log.info("Fetched {} vouchers", content.size());

        return PageResponse.<VoucherResponse>builder()
                .content(content)
                .pageNo(page.getPageNo())
                .pageSize(page.getPageSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
