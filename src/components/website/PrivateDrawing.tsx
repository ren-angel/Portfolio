import { useEffect, useState } from "react";
import { LIMITS } from "../../../guestbook-api/src/rules";
import { fetchDrawing } from "@/lib/guestbookApi";

// Drawings are private: fetched with a key (the visitor's mailbox key or your Inbox password)
// and shown through a temporary blob: URL that's released when the card unmounts.
export default function PrivateDrawing({ id, token, alt }: { id: number; token: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    fetchDrawing(id, token)
      .then((u) => { if (cancelled) URL.revokeObjectURL(u); else { url = u; setSrc(u); } })
      .catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [id, token]);

  const box = "mt-2 aspect-[3/2] w-full max-w-[240px] rounded-md border-2 border-k-outline bg-white";
  if (failed) return <div className={`${box} grid place-items-center text-xs text-[#4A3B52]`}>🖼 ✕</div>;
  if (!src) return <div className={`${box} animate-pulse`} aria-busy="true" />;
  return <img src={src} alt={alt} width={LIMITS.drawingWidth} height={LIMITS.drawingHeight} className={box} />;
}
