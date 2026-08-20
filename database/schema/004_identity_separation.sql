-- Move existing identity information into the protected table

INSERT INTO student_identities (
    user_id,
    full_name,
    phone
)
SELECT
    user_id,
    TRIM(
        COALESCE(first_name, '') ||
        CASE
            WHEN last_name IS NOT NULL
            THEN ' ' || last_name
            ELSE ''
        END
    ),
    phone
FROM student_profiles;


-- Remove personally identifiable information
-- from the general student profile

ALTER TABLE student_profiles
DROP COLUMN first_name;

ALTER TABLE student_profiles
DROP COLUMN last_name;

ALTER TABLE student_profiles
DROP COLUMN phone;