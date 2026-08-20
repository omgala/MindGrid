CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    risk_level VARCHAR(20) NOT NULL
        CHECK (
            risk_level IN (
                'LOW',
                'MODERATE',
                'HIGH',
                'CRITICAL'
            )
        ),

    risk_score DECIMAL(5,2),

    trigger_source VARCHAR(50),

    explanation TEXT,

    recommended_action TEXT,

    reviewed_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    reviewed_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_user
ON risk_assessments(user_id);

CREATE INDEX idx_risk_level
ON risk_assessments(risk_level);