-- CV Ingestion App — SQLite Schema
-- All timestamps stored as ISO-8601 strings (UTC)

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── Profile (single-user, id = 1 always) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  first_name    TEXT,
  last_name     TEXT,
  email         TEXT,
  phone         TEXT,
  location      TEXT,
  bio           TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed empty profile row
INSERT OR IGNORE INTO profile (id) VALUES (1);

-- ─── Education ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id            TEXT PRIMARY KEY,
  institution   TEXT NOT NULL,
  qualification TEXT,
  field         TEXT,
  start_date    TEXT,
  end_date      TEXT,
  description   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Experience ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id            TEXT PRIMARY KEY,
  company       TEXT NOT NULL,
  position      TEXT,
  start_date    TEXT,
  end_date      TEXT,
  location      TEXT,
  description   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Skills ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT,
  proficiency   TEXT CHECK(proficiency IN ('beginner','intermediate','advanced','expert') OR proficiency IS NULL),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  technologies  TEXT,   -- JSON array stored as text
  url           TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Certifications ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  issuer        TEXT,
  date          TEXT,
  url           TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Documents ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id                TEXT PRIMARY KEY,
  original_filename TEXT NOT NULL,
  stored_filename   TEXT NOT NULL,   -- randomised, server-generated
  mime_type         TEXT NOT NULL,
  size_bytes        INTEGER NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'uploaded'
                    CHECK(processing_status IN (
                      'uploaded','validating','valid','extracting',
                      'extracted','needs_review','confirmed','synced','failed','rejected'
                    )),
  uploaded_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Extraction Jobs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS extraction_jobs (
  id                     TEXT PRIMARY KEY,
  document_id            TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  status                 TEXT NOT NULL DEFAULT 'pending'
                         CHECK(status IN (
                           'pending','text_extracting','text_done','ai_extracting',
                           'ai_done','needs_review','confirmed','synced','failed'
                         )),
  raw_text               TEXT,         -- extracted PDF text
  extracted_json         TEXT,         -- raw AI/regex output (JSON)
  confidence_json        TEXT,         -- per-field confidence scores (JSON)
  extraction_method      TEXT,         -- 'gemini' | 'regex' | 'ocr+gemini' | 'ocr+regex'
  error_message          TEXT,
  retry_count            INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Confirmed Profile Snapshot ───────────────────────────────────────────────
-- Stores the final user-reviewed profile as a JSON blob (versioned)
CREATE TABLE IF NOT EXISTS profile_snapshots (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_json  TEXT NOT NULL,
  source        TEXT DEFAULT 'manual',  -- 'manual' | 'pdf_extraction'
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Analytics Events ─────────────────────────────────────────────────────────
-- Collects portfolio telemetry: page views, CV opens, project clicks, contact clicks
CREATE TABLE IF NOT EXISTS analytics_events (
  id            TEXT PRIMARY KEY,
  event_type    TEXT NOT NULL CHECK(event_type IN ('page_view','cv_open','project_click','contact_click')),
  target        TEXT,
  visitor_id    TEXT,
  user_agent    TEXT,
  referrer      TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

