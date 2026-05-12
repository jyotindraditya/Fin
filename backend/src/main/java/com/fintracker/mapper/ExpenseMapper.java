package com.fintracker.mapper;

import com.fintracker.dto.response.ExpenseResponse;
import com.fintracker.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    private final CategoryMapper categoryMapper;

    public ExpenseMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
            expense.getId(),
            expense.getAmount(),
            expense.getDescription(),
            expense.getExpenseDate(),
            categoryMapper.toResponse(expense.getCategory()),
            expense.getCreatedAt()
        );
    }
}
