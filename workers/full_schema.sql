-- Full System Schema
-- Combines Auth and Feature tables

-- ==========================================
-- AUTHENTICATION
-- ==========================================

-- Users table
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at INTEGER NOT NULL,
  last_login INTEGER,
  is_active INTEGER DEFAULT 1,
  is_admin INTEGER DEFAULT 0,
  security_question TEXT,
  security_answer_hash TEXT
);
CREATE INDEX IF NOT EXISTS idx_auth_users_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);

-- Sessions table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  used INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);

-- ==========================================
-- FEATURES
-- ==========================================

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  grade INTEGER NOT NULL,
  questions TEXT NOT NULL, -- JSON
  answers TEXT, -- JSON
  score REAL,
  total_questions INTEGER NOT NULL,
  duration INTEGER,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_exams_user ON exams(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_completed ON exams(completed_at);

-- Flashcard Decks
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  grade INTEGER NOT NULL,
  is_public INTEGER DEFAULT 0,
  color TEXT DEFAULT 'blue',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_decks_user ON flashcard_decks(user_id);

-- Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  tags TEXT, -- JSON
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  next_review INTEGER,
  last_reviewed INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_cards_deck ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_review ON flashcards(next_review);

-- Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  grade INTEGER,
  messages TEXT NOT NULL, -- JSON
  message_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id);

-- Study Sessions (Progress Tracking)
CREATE TABLE IF NOT EXISTS study_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity TEXT NOT NULL, -- 'exam', 'flashcard', 'chat', 'reading'
  duration INTEGER DEFAULT 0, -- seconds
  score REAL,
  cards_studied INTEGER DEFAULT 0,
  questions_asked INTEGER DEFAULT 0,
  subject TEXT,
  grade INTEGER,
  session_date INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON study_sessions(session_date);

-- Study Goals
CREATE TABLE IF NOT EXISTS study_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'score', 'time', 'streak'
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  deadline TEXT,
  completed INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON study_goals(user_id);

-- Shared Resources (Community)
CREATE TABLE IF NOT EXISTS shared_resources (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'exam', 'deck'
  resource_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- JSON or Description
  category TEXT,
  grade INTEGER,
  is_public INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_shared_public ON shared_resources(is_public);
