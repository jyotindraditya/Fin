package com.fintracker.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SettingsResponse(
    Long id,
    BigDecimal monthlyBudget,
    String currency,
    Integer resetDay,
    LocalDateTime updatedAt
) {}
