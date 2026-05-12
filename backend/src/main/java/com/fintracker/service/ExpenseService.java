package com.fintracker.service;

import com.fintracker.dto.request.ExpenseRequest;
import com.fintracker.dto.response.ExpenseResponse;
import com.fintracker.entity.Category;
import com.fintracker.entity.Expense;
import com.fintracker.entity.User;
import com.fintracker.exception.ResourceNotFoundException;
import com.fintracker.mapper.ExpenseMapper;
import com.fintracker.repository.CategoryRepository;
import com.fintracker.repository.ExpenseRepository;
import com.fintracker.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseService(ExpenseRepository expenseRepository,
                          CategoryRepository categoryRepository,
                          ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.expenseMapper = expenseMapper;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
            .stream()
            .map(expenseMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        return expenseMapper.toResponse(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesFiltered(LocalDate startDate, LocalDate endDate, Long categoryId) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<Expense> expenses;

        if (categoryId != null && startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndCategoryIdAndExpenseDateBetweenOrderByExpenseDateDesc(
                userId, categoryId, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
                userId, startDate, endDate);
        } else if (categoryId != null) {
            expenses = expenseRepository.findByUserIdAndCategoryIdOrderByExpenseDateDesc(userId, categoryId);
        } else {
            expenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        }

        return expenses.stream().map(expenseMapper::toResponse).toList();
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = SecurityUtils.getCurrentUser();

        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

        Expense expense = new Expense();
        expense.setAmount(request.amount());
        expense.setDescription(request.description());
        expense.setExpenseDate(request.date());
        expense.setCategory(category);
        expense.setUser(user);

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Expense", id));

        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

        expense.setAmount(request.amount());
        expense.setDescription(request.description());
        expense.setExpenseDate(request.date());
        expense.setCategory(category);

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", id);
        }
        expenseRepository.deleteById(id);
    }
}
