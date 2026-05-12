package com.fintracker.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    BigDecimal amount,

    @Size(max = 500, message = "Description must be at most 500 characters")
    String description,

    @NotNull(message = "Date is required")
    LocalDate date,

    @NotNull(message = "Category ID is required")
    Long categoryId
) {}
