-- Make sure users table works with Clerk user IDs
ALTER TABLE users
ALTER COLUMN id TYPE VARCHAR(255);

-- Update foreign key references if they exist
DO $$ 
BEGIN
    -- Check if the foreign key exists before trying to modify it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'pdf_summaries_user_id_fkey'
        AND table_name = 'pdf_summaries'
    ) THEN
        -- Drop the constraint
        ALTER TABLE pdf_summaries DROP CONSTRAINT pdf_summaries_user_id_fkey;
        
        -- Add it back with the correct type
        ALTER TABLE pdf_summaries 
        ADD CONSTRAINT pdf_summaries_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
END $$; 