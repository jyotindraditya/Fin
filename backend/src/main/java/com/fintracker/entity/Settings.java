package com.fintracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monthly_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyBudget = BigDecimal.ZERO;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "reset_day", nullable = false)
    private Integer resetDay = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Settings() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getResetDay() { return resetDay; }
    public void setResetDay(Integer resetDay) { this.resetDay = resetDay; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
