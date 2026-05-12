package com.fintracker.dto.response;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String username
) {}
