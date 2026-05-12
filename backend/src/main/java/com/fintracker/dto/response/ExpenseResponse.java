package com.fintracker.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
    Long id,
    BigDecimal amount,
    String description,
    LocalDate date,
    CategoryResponse category,
    LocalDateTime createdAt
) {}
