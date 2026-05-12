-- Add user_id to categories
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories ADD COLUMN user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

-- Add user_id to expenses
ALTER TABLE expenses ADD COLUMN user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

-- Add user_id to settings
ALTER TABLE settings ADD COLUMN user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

-- Delete old seed data (no user assigned)
DELETE FROM expenses;
DELETE FROM categories;
DELETE FROM settings;

-- Make columns NOT NULL
ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE settings ALTER COLUMN user_id SET NOT NULL;

-- Unique category name per user
ALTER TABLE categories ADD CONSTRAINT uq_category_name_user UNIQUE (name, user_id);

-- Indexes
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_settings_user ON settings(user_id);
