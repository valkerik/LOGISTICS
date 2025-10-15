package com.example.logistics.web;

import java.time.OffsetDateTime;

public record ApiError(
        String error,
        String message,
        String path,
        OffsetDateTime timestamp
) {
    public static ApiError of(String error, String message, String path) {
        return new ApiError(error, message, path, OffsetDateTime.now());
    }
}
