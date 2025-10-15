package com.example.logistics.web.dto;

import jakarta.validation.constraints.NotNull;

public record VehicleSetActiveRequestDto(@NotNull Boolean active) {
}
