CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  metadata TEXT
);

CREATE INDEX ON embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT CHECK (role IN ('user', 'agent')),
  content TEXT,
  created_at TIMESTAMP
);