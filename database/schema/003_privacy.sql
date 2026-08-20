-- ============================================
-- MindGrid Privacy Migration
-- ============================================

-- Add a pseudonymous identifier to students
ALTER TABLE student_profiles
ADD COLUMN anonymous_id VARCHAR(20);

-- Generate anonymous IDs for existing students
UPDATE student_profiles
SET anonymous_id =
    'MG-' || UPPER(SUBSTRING(REPLACE(user_id::text, '-', '') FROM 1 FOR 8))
WHERE anonymous_id IS NULL;

-- Make anonymous ID mandatory
ALTER TABLE student_profiles
ALTER COLUMN anonymous_id SET NOT NULL;

-- Make anonymous ID unique
ALTER TABLE student_profiles
ADD CONSTRAINT unique_student_anonymous_id
UNIQUE (anonymous_id);


-- ============================================
-- Protected identity information
-- ============================================

CREATE TABLE student_identities (
    user_id UUID PRIMARY KEY
        REFERENCES users(id)
        ON DELETE CASCADE,

    full_name VARCHAR(200),

    email VARCHAR(255),

    phone VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);