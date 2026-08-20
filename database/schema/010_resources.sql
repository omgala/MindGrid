CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(250) NOT NULL,

    description TEXT,

    category VARCHAR(100),

    content TEXT,

    resource_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_category
ON resources(category);