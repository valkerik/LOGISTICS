package com.example.logistics.web.dto;

import com.example.logistics.model.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VehicleUpdateRequestDto(
        @NotNull Long carrierId,
        @NotBlank String plateNo,
        String vin,
        String make,
        String model,
        Integer year,
        @NotNull BigDecimal capacityKg,
        @NotNull VehicleType type,
        Boolean active
) {}
