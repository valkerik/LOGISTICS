package com.example.logistics.web.dto;

import com.example.logistics.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserCreateRequestDto(
        @NotBlank String username,
        @NotBlank String passHash,
        @NotNull UserRole role
) {}
