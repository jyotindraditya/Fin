package com.fintracker.repository;

import com.fintracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);

    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
        Long userId, LocalDate start, LocalDate end);

    List<Expense> findByUserIdAndCategoryIdOrderByExpenseDateDesc(Long userId, Long categoryId);

    List<Expense> findByUserIdAndCategoryIdAndExpenseDateBetweenOrderByExpenseDateDesc(
        Long userId, Long categoryId, LocalDate start, LocalDate end);

    long countByCategoryId(Long categoryId);
}
