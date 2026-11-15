import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language } from "@/content/translations";

const Ctx = createContext<{
  lang: Language;
  t: typeof translations.en;
  setLang: (lang: Language) => void;
} | null>(null);

function savedLanguage(): Language {
  try {
    const saved = localStorage.getItem("kawaii-lang");
    if (saved === "pt" || saved === "ja") return saved;
  } catch { /* The desktop also works when browser storage is disabled. */ }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(savedLanguage);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  }, [lang]);

  function setLang(language: Language) {
    setLangState(language);
    try { localStorage.setItem("kawaii-lang", language); } catch { /* Session only. */ }
  }
  return <Ctx.Provider value={{ lang, t: translations[lang], setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const value = useContext(Ctx);
  if (!value) throw new Error("I18nProvider is missing");
  return value;
}
