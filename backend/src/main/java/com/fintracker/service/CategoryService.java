package com.fintracker.service;

import com.fintracker.dto.request.CategoryRequest;
import com.fintracker.dto.response.CategoryResponse;
import com.fintracker.entity.Category;
import com.fintracker.entity.User;
import com.fintracker.exception.BadRequestException;
import com.fintracker.exception.ResourceNotFoundException;
import com.fintracker.mapper.CategoryMapper;
import com.fintracker.repository.CategoryRepository;
import com.fintracker.repository.ExpenseRepository;
import com.fintracker.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           ExpenseRepository expenseRepository,
                           CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
        this.categoryMapper = categoryMapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        Long userId = SecurityUtils.getCurrentUserId();
        return categoryRepository.findAllByUserId(userId)
            .stream()
            .map(categoryMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = SecurityUtils.getCurrentUser();

        if (categoryRepository.existsByNameAndUserId(request.name(), userId)) {
            throw new BadRequestException("Category with name '" + request.name() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.name());
        category.setColor(request.color() != null ? request.color() : "#6366f1");
        category.setIcon(request.icon());
        category.setUser(user);

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        // Check for duplicate name (excluding current)
        categoryRepository.findByNameAndUserId(request.name(), userId)
            .filter(existing -> !existing.getId().equals(id))
            .ifPresent(existing -> {
                throw new BadRequestException("Category with name '" + request.name() + "' already exists");
            });

        category.setName(request.name());
        if (request.color() != null) category.setColor(request.color());
        category.setIcon(request.icon());

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }

        long expenseCount = expenseRepository.countByCategoryId(id);
        if (expenseCount > 0) {
            throw new BadRequestException(
                "Cannot delete category: " + expenseCount + " expense(s) are linked to it. " +
                "Reassign or delete those expenses first.");
        }

        categoryRepository.deleteById(id);
    }
}
