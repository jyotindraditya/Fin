package com.fintracker.repository;

import com.fintracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByUserId(Long userId);

    Optional<Category> findByNameAndUserId(String name, Long userId);

    boolean existsByNameAndUserId(String name, Long userId);

    long countByUserId(Long userId);
}
