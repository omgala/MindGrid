CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    resource_id UUID
        REFERENCES resources(id)
        ON DELETE SET NULL,

    title VARCHAR(250) NOT NULL,

    reason TEXT,

    priority INTEGER DEFAULT 1,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'VIEWED',
                'COMPLETED',
                'DISMISSED'
            )
        ),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_user
ON recommendations(user_id);