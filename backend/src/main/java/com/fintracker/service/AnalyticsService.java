package com.fintracker.service;

import com.fintracker.dto.response.PieChartResponse;
import com.fintracker.dto.response.PieChartResponse.CategorySlice;
import com.fintracker.entity.Expense;
import com.fintracker.entity.Settings;
import com.fintracker.repository.ExpenseRepository;
import com.fintracker.repository.SettingsRepository;
import com.fintracker.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final SettingsRepository settingsRepository;

    public AnalyticsService(ExpenseRepository expenseRepository,
                            SettingsRepository settingsRepository) {
        this.expenseRepository = expenseRepository;
        this.settingsRepository = settingsRepository;
    }

    public PieChartResponse getPieChartData(Integer month, Integer year) {
        Long userId = SecurityUtils.getCurrentUserId();

        // Default to current month/year
        YearMonth ym = (month != null && year != null)
            ? YearMonth.of(year, month)
            : YearMonth.now();

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Expense> expenses = expenseRepository
            .findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, start, end);

        // Aggregate by category
        BigDecimal totalSpent = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, List<Expense>> grouped = expenses.stream()
            .collect(Collectors.groupingBy(e -> e.getCategory().getName()));

        List<CategorySlice> slices = grouped.entrySet().stream()
            .map(entry -> {
                BigDecimal categoryTotal = entry.getValue().stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                double percentage = totalSpent.compareTo(BigDecimal.ZERO) > 0
                    ? categoryTotal.multiply(BigDecimal.valueOf(100))
                        .divide(totalSpent, 1, RoundingMode.HALF_UP)
                        .doubleValue()
                    : 0.0;

                String color = entry.getValue().get(0).getCategory().getColor();

                return new CategorySlice(entry.getKey(), color, categoryTotal, percentage);
            })
            .sorted((a, b) -> Double.compare(b.percentage(), a.percentage()))
            .toList();

        // Get budget
        BigDecimal budget = settingsRepository.findByUserId(userId)
            .map(Settings::getMonthlyBudget)
            .orElse(BigDecimal.ZERO);

        double budgetUsage = budget.compareTo(BigDecimal.ZERO) > 0
            ? totalSpent.multiply(BigDecimal.valueOf(100))
                .divide(budget, 1, RoundingMode.HALF_UP)
                .doubleValue()
            : 0.0;

        return new PieChartResponse(
            slices, totalSpent, budget, budgetUsage,
            ym.getMonthValue(), ym.getYear()
        );
    }
}
