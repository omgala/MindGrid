CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    counselor_user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    appointment_time TIMESTAMP NOT NULL,

    duration_minutes INTEGER NOT NULL DEFAULT 30,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'CONFIRMED',
                'COMPLETED',
                'CANCELLED',
                'NO_SHOW'
            )
        ),

    student_note TEXT,

    counselor_note TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_student
ON appointments(student_user_id);

CREATE INDEX idx_appointments_counselor
ON appointments(counselor_user_id);

CREATE INDEX idx_appointments_time
ON appointments(appointment_time);