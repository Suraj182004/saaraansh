-- Ensure the uuid-ossp extension is enabled (for UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Update users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS credits_limit INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS next_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 month'),
ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive';

-- 2. Create index for Stripe lookup
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_id ON users(subscription_id);

-- 3. Rename columns if you need to align with your current code
-- If your code is looking for 'stripe_customer_id' but your DB has 'customer_id':
-- ALTER TABLE users 
-- RENAME COLUMN customer_id TO stripe_customer_id;
-- ALTER TABLE users 
-- RENAME COLUMN subscription_id TO stripe_subscription_id;

-- 4. Create a function to update the "updated_at" column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create a trigger to automatically update the "updated_at" column
DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 