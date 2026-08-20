CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    title VARCHAR(200),

    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    last_message_at TIMESTAMP
);


CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id UUID NOT NULL
        REFERENCES chat_sessions(id)
        ON DELETE CASCADE,

    sender VARCHAR(20) NOT NULL
        CHECK (sender IN ('USER', 'BOT')),

    message TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_sessions_user
ON chat_sessions(user_id);

CREATE INDEX idx_chat_messages_session
ON chat_messages(session_id, created_at);