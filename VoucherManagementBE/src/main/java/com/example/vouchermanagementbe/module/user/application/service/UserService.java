package com.example.vouchermanagementbe.module.user.application.service;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.application.dto.UserCreateRequest;
import com.example.vouchermanagementbe.module.user.application.dto.UserResponse;
import com.example.vouchermanagementbe.module.user.application.usecase.UserUseCase;
import com.example.vouchermanagementbe.module.user.domain.entity.User;
import com.example.vouchermanagementbe.module.user.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase {

    private final UserRepositoryPort userRepositoryPort;

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        log.info("Creating user with email: {}", request.getEmail());

        // Validation: email không trùng
        userRepositoryPort.findByEmail(request.getEmail()).ifPresent(u -> {
            log.warn("Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        });

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .createdAt(LocalDateTime.now())
                .build();

        user.validate();

        User savedUser = userRepositoryPort.save(user);
        log.info("User created successfully with id: {}", savedUser.getId());

        return UserResponse.fromDomain(savedUser);
    }

    @Override
    public PageResponse<UserResponse> getUsers(int pageNo, int pageSize) {
        log.info("Fetching users - page: {}, size: {}", pageNo, pageSize);

        PageResponse<User> pageDomain = userRepositoryPort.findAll(pageNo, pageSize);
        List<UserResponse> userResponses = pageDomain.getContent().stream()
                .map(UserResponse::fromDomain)
                .collect(Collectors.toList());

        log.info("Fetched {} users", userResponses.size());

        return PageResponse.<UserResponse>builder()
                .content(userResponses)
                .pageNo(pageDomain.getPageNo())
                .pageSize(pageDomain.getPageSize())
                .totalElements(pageDomain.getTotalElements())
                .totalPages(pageDomain.getTotalPages())
                .last(pageDomain.isLast())
                .build();
    }
}
