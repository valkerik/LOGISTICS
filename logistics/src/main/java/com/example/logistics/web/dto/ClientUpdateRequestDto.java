package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ClientUpdateRequestDto(
        @NotBlank String name,
        String inn,
        String kpp,
        String phone,
        String email,
        String address
) {}
