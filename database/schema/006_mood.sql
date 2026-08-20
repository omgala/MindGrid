CREATE TABLE mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    mood_score INTEGER NOT NULL
        CHECK (mood_score BETWEEN 1 AND 5),

    stress_level INTEGER
        CHECK (stress_level BETWEEN 1 AND 5),

    energy_level INTEGER
        CHECK (energy_level BETWEEN 1 AND 5),

    sleep_hours DECIMAL(4,2),

    note TEXT,

    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mood_user_date
ON mood_entries(user_id, recorded_at);