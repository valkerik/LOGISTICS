package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotBlank;

public record CarrierCreateRequestDto(
        @NotBlank String name,
        String inn,
        String phone,
        String email
) {
}
