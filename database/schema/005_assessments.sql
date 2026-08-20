-- ============================================
-- MindGrid Assessment System
-- ============================================

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,

    description TEXT,

    version VARCHAR(20) NOT NULL DEFAULT '1.0',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL
        REFERENCES assessments(id)
        ON DELETE CASCADE,

    question_number INTEGER NOT NULL,

    question_text TEXT NOT NULL,

    question_type VARCHAR(30) NOT NULL DEFAULT 'SINGLE_CHOICE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (assessment_id, question_number)
);


CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    assessment_id UUID NOT NULL
        REFERENCES assessments(id)
        ON DELETE CASCADE,

    question_id UUID NOT NULL
        REFERENCES assessment_questions(id)
        ON DELETE CASCADE,

    response_value INTEGER,

    response_text TEXT,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);