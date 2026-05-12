CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(500),
    expense_date DATE NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
