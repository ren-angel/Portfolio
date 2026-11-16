-- Private guestbook: messages belong to a visitor "mailbox" (hash of a random key kept in their
-- browser) and can get a reply from the site owner.
ALTER TABLE entries ADD COLUMN visitor_hash TEXT;
ALTER TABLE entries ADD COLUMN reply TEXT CHECK (reply IS NULL OR length(reply) BETWEEN 1 AND 1000);
ALTER TABLE entries ADD COLUMN replied_at INTEGER;

CREATE INDEX IF NOT EXISTS entries_visitor ON entries (visitor_hash, id);
