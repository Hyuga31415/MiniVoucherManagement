package com.example.vouchermanagementbe.module.user.application.usecase;

import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.application.dto.UserCreateRequest;
import com.example.vouchermanagementbe.module.user.application.dto.UserResponse;

public interface UserUseCase {
    UserResponse createUser(UserCreateRequest request);
    PageResponse<UserResponse> getUsers(int pageNo, int pageSize);
}
