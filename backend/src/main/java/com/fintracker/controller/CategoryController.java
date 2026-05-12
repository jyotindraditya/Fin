package com.fintracker.controller;

import com.fintracker.dto.request.CategoryRequest;
import com.fintracker.dto.response.ApiResponse;
import com.fintracker.dto.response.CategoryResponse;
import com.fintracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(
            ApiResponse.success("Categories retrieved", categoryService.getAllCategories()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Category retrieved", categoryService.getCategoryById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Category created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(
            ApiResponse.success("Category updated", categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
