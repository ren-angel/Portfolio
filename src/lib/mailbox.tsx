import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMine, forgetVisitorToken, getVisitorToken, guestbookConfigured, type Entry } from "./guestbookApi";

// The visitor's own private messages + the owner's replies. Returning visitors (who have a mailbox
// key) check once on load, so the Guestbook icon can show a badge when a new reply is waiting.
const SEEN_KEY = "guestbook-seen";

interface Mailbox {
  mine: Entry[];
  status: "idle" | "loading" | "ready" | "error";
  /** Replies the visitor hasn't looked at yet. */
  unseen: number;
  /** Time of the newest reply the visitor has already seen. */
  seenAt: number;
  refresh: () => Promise<void>;
  add: (e: Entry) => void;
  markSeen: () => void;
  forget: () => void;
}

const Ctx = createContext<Mailbox | null>(null);

const readSeen = () => { try { return Number(localStorage.getItem(SEEN_KEY)) || 0; } catch { return 0; } };

export function MailboxProvider({ children }: { children: ReactNode }) {
  const [mine, setMine] = useState<Entry[]>([]);
  const [status, setStatus] = useState<Mailbox["status"]>("idle");
  const [seen, setSeen] = useState(readSeen);

  const refresh = useCallback(async () => {
    if (!guestbookConfigured || !getVisitorToken()) return;
    setStatus("loading");
    try {
      setMine(await fetchMine());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const latestReply = Math.max(0, ...mine.map((e) => e.repliedAt ?? 0));
  const unseen = mine.filter((e) => e.repliedAt && e.repliedAt > seen).length;

  const value: Mailbox = {
    mine, status, unseen, seenAt: seen, refresh,
    add: (e) => setMine((prev) => [e, ...prev.filter((x) => x.id !== e.id)]),
    markSeen: () => {
      if (latestReply <= seen) return;
      setSeen(latestReply);
      try { localStorage.setItem(SEEN_KEY, String(latestReply)); } catch { /* fine */ }
    },
    forget: () => {
      forgetVisitorToken();
      try { localStorage.removeItem(SEEN_KEY); } catch { /* fine */ }
      setMine([]);
      setSeen(0);
      setStatus("idle");
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMailbox() {
  const value = useContext(Ctx);
  if (!value) throw new Error("MailboxProvider is missing");
  return value;
}
