package com.fintracker.controller;

import com.fintracker.dto.request.ExpenseRequest;
import com.fintracker.dto.response.ApiResponse;
import com.fintracker.dto.response.ExpenseResponse;
import com.fintracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId) {

        List<ExpenseResponse> expenses = expenseService.getExpensesFiltered(startDate, endDate, categoryId);
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Expense retrieved", expenseService.getExpenseById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse created = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Expense created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Expense updated", expenseService.updateExpense(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted", null));
    }
}
