package com.fintracker.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record SettingsRequest(
    @NotNull(message = "Monthly budget is required")
    @DecimalMin(value = "0", message = "Monthly budget cannot be negative")
    BigDecimal monthlyBudget,

    @Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
    String currency,

    @Min(value = 1, message = "Reset day must be between 1 and 28")
    @Max(value = 28, message = "Reset day must be between 1 and 28")
    Integer resetDay
) {}
