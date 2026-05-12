package com.fintracker.mapper;

import com.fintracker.dto.response.CategoryResponse;
import com.fintracker.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getColor(),
            category.getIcon(),
            category.getCreatedAt()
        );
    }
}
