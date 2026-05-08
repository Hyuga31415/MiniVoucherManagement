package com.example.vouchermanagementbe.module.user.infrastructure.adapter;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.domain.entity.User;
import com.example.vouchermanagementbe.module.user.domain.repository.UserRepositoryPort;
import com.example.vouchermanagementbe.module.user.infrastructure.entity.UserEntity;
import com.example.vouchermanagementbe.module.user.infrastructure.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository userJpaRepository;

    @Override
    public User save(User user) {
        UserEntity entity = toEntity(user);
        UserEntity savedEntity = userJpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public PageResponse<User> findAll(int pageNo, int pageSize) {
        Page<UserEntity> page = userJpaRepository.findAll(PageRequest.of(pageNo, pageSize));
        List<User> content = page.getContent().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());

        return PageResponse.<User>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id).map(this::toDomain);
    }

    // Mapper methods
    private UserEntity toEntity(User domain) {
        return UserEntity.builder()
                .id(domain.getId())
                .fullName(domain.getFullName())
                .email(domain.getEmail())
                .phone(domain.getPhone())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    private User toDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
