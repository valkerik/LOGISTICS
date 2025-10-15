package com.example.logistics.web.dto;


import jakarta.validation.constraints.NotBlank;

public record CarrierUpdateRequestDto(
        @NotBlank String name,
        String inn,
        String phone,
        String email
) {}
