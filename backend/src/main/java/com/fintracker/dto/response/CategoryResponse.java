package com.fintracker.dto.response;

import java.time.LocalDateTime;

public record CategoryResponse(
    Long id,
    String name,
    String color,
    String icon,
    LocalDateTime createdAt
) {}
