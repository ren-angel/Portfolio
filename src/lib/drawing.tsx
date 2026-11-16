import { createContext, useContext, useState, type ReactNode } from "react";

// Bridge between Paint and the Guestbook: Paint attaches a PNG data URL, the guestbook form uses it.
const Ctx = createContext<{ attachment: string | null; setAttachment: (png: string | null) => void } | null>(null);

export function DrawingProvider({ children }: { children: ReactNode }) {
  const [attachment, setAttachment] = useState<string | null>(null);
  return <Ctx.Provider value={{ attachment, setAttachment }}>{children}</Ctx.Provider>;
}

export function useDrawing() {
  const value = useContext(Ctx);
  if (!value) throw new Error("DrawingProvider is missing");
  return value;
}
