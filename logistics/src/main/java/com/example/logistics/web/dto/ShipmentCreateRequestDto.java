package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ShipmentCreateRequestDto(
        @NotNull Long clientId,
        @NotNull Long carrierId,
        @NotBlank String pickupAddress,
        @NotBlank String deliveryAddress,
        @NotBlank String cargoDescription,
        @NotNull BigDecimal cargoWeight,
        @NotNull OffsetDateTime plannedPickupAt,
        @NotNull OffsetDateTime plannedDeliveryAt,
        BigDecimal price
) {}

