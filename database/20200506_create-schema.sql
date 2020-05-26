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
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    github_username VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(1000),
    language VARCHAR(255)
);

CREATE TABLE connections (
    id SERIAL NOT NULL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    recommendation_accepted BOOLEAN DEFAULT NULL,
    connection_accepted BOOLEAN DEFAULT NULL
);