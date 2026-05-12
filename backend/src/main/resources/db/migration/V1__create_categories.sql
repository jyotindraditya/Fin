CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT INTO categories (name, color, icon) VALUES
('Food & Dining',    '#ef4444', 'utensils'),
('Transportation',   '#f59e0b', 'car'),
('Shopping',         '#8b5cf6', 'shopping-bag'),
('Entertainment',    '#ec4899', 'film'),
('Bills & Utilities','#3b82f6', 'zap'),
('Healthcare',       '#10b981', 'heart'),
('Other',            '#6b7280', 'more-horizontal');
