CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    monthly_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings row (singleton)
INSERT INTO settings (monthly_budget, currency) VALUES (0, 'USD');
