package com.fintracker.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record PieChartResponse(
    List<CategorySlice> categories,
    BigDecimal totalSpent,
    BigDecimal monthlyBudget,
    double budgetUsagePercent,
    int month,
    int year
) {
    public record CategorySlice(
        String name,
        String color,
        BigDecimal amount,
        double percentage
    ) {}
}
