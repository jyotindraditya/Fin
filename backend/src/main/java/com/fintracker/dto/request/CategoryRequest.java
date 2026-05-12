package com.fintracker.dto.request;

import jakarta.validation.constraints.*;

public record CategoryRequest(
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must be at most 100 characters")
    String name,

    @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Color must be a valid hex color (e.g., #ff5733)")
    String color,

    @Size(max = 50, message = "Icon name must be at most 50 characters")
    String icon
) {}
