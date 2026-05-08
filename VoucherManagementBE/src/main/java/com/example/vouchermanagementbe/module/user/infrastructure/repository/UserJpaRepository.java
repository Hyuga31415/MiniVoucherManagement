package com.example.vouchermanagementbe.module.user.infrastructure.repository;

import com.example.vouchermanagementbe.module.user.infrastructure.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);
    java.util.Optional<UserEntity> findByEmail(String email);
}
