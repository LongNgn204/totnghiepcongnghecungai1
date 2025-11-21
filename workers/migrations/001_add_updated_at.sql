-- Migration: add/update timestamp columns to support sync
-- Run with: npx wrangler d1 execute <DATABASE_NAME> --file=./workers/migrations/001_add_updated_at.sql

-- NOTE: SQLite ALTER TABLE ADD COLUMN will fail if column already exists. Run cautiously or inspect schema first.

-- Exams: add updated_at to allow detecting changes (fallback to completed_at when missing)
ALTER TABLE exams ADD COLUMN updated_at INTEGER;

-- Flashcards: add updated_at to track changes
ALTER TABLE flashcards ADD COLUMN updated_at INTEGER;

-- Study sessions: add updated_at (alias for session_date if needed)
ALTER TABLE study_sessions ADD COLUMN updated_at INTEGER;

-- Ensure indexes for faster change queries
CREATE INDEX IF NOT EXISTS idx_exams_updated_at ON exams(updated_at);
CREATE INDEX IF NOT EXISTS idx_flashcards_updated_at ON flashcards(updated_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_updated_at ON study_sessions(updated_at);

-- For rows that only have created_at/completed_at, you may want to initialize updated_at
-- Example (optional): set updated_at = completed_at for exams where updated_at IS NULL
-- UPDATE exams SET updated_at = completed_at WHERE updated_at IS NULL AND completed_at IS NOT NULL;
-- UPDATE flashcards SET updated_at = created_at WHERE updated_at IS NULL AND created_at IS NOT NULL;
-- UPDATE study_sessions SET updated_at = session_date WHERE updated_at IS NULL AND session_date IS NOT NULL;
