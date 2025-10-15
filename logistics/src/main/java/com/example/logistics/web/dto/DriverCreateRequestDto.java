package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DriverCreateRequestDto(
        @NotNull Long carrierId,
        @NotBlank String fullName,
        @NotBlank String licenseNumber,
        @NotNull LocalDate licenseValidUntil,
        String phone
) {}
