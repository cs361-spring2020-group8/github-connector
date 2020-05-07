CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    twitter VARCHAR,
    phone VARCHAR,
    email VARCHAR
);

CREATE TABLE github_info (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id SERIAL NOT NULL UNIQUE REFERENCES users(id),
    github_username VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(1000),
    language VARCHAR(255)
);
