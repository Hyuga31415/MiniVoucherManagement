package com.example.vouchermanagementbe.module.user.presentation;

import com.example.vouchermanagementbe.core.ApiResponse;
import com.example.vouchermanagementbe.core.PageResponse;
import com.example.vouchermanagementbe.module.user.application.dto.UserCreateRequest;
import com.example.vouchermanagementbe.module.user.application.dto.UserResponse;
import com.example.vouchermanagementbe.module.user.application.usecase.UserUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserUseCase userUseCase;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.success(userUseCase.createUser(request), "User created successfully");
    }

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.success(userUseCase.getUsers(pageNo, pageSize));
    }
}
