-- Guestbook entries. Drawings are small validated PNGs stored inline (no paid object storage).
CREATE TABLE IF NOT EXISTS entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname   TEXT    NOT NULL CHECK (length(nickname) BETWEEN 1 AND 24),
  message    TEXT    NOT NULL CHECK (length(message) BETWEEN 1 AND 280),
  drawing    BLOB             CHECK (drawing IS NULL OR length(drawing) <= 150000),
  ip_hash    TEXT    NOT NULL,             -- salted SHA-256, only used for rate limiting
  created_at INTEGER NOT NULL              -- unix milliseconds
);

-- Rate-limit lookups ("how many entries from this visitor recently?") and the daily cap.
CREATE INDEX IF NOT EXISTS entries_ip_time ON entries (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS entries_time ON entries (created_at);
