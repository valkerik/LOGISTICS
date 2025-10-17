package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

// web/dto/DriverUpdateRequestDto.java
public record DriverUpdateRequestDto(
        @NotNull Long carrierId,
        @NotBlank String fullName,
        @NotBlank String licenseNumber,
        @NotNull LocalDate licenseValidUntil,
        String phone,
        Boolean active
) {}

