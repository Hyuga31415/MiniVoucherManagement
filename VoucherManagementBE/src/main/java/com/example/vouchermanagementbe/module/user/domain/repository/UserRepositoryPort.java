package com.example.vouchermanagementbe.module.user.domain.repository;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.domain.entity.User;

import java.util.Optional;

public interface UserRepositoryPort {
    User save(User user);
    Optional<User> findByEmail(String email);
    PageResponse<User> findAll(int pageNo, int pageSize);
    Optional<User> findById(Long id);
}
