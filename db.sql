CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- board table
CREATE TABLE IF NOT EXISTS boards(
  id uuid DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  user_id uuid,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- users table
CREATE TABLE IF NOT EXISTS users(
  id uuid DEFAULT uuid_generate_v4(),
  google_id VARCHAR(255),
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);