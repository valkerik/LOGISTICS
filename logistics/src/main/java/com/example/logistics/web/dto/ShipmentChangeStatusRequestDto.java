package com.example.logistics.web.dto;

import com.example.logistics.model.ShipmentStatus;
import jakarta.validation.constraints.NotNull;

public record ShipmentChangeStatusRequestDto(
        @NotNull ShipmentStatus status,
        Long changedByUserId,
        String note
) {
}
