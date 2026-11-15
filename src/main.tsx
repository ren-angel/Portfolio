import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import Desktop from "./components/kawaii/Desktop";
import { ErrorBoundary, NotFound } from "./components/Fallback";
import { I18nProvider } from "./lib/i18n";
import "./styles/fonts.css";
import "./styles/desktop.css";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const path = location.pathname.replace(/\/$/, "");
const home = path === base || path === base + "/index.html";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    {home ? (
      <MotionConfig reducedMotion="user">
        <I18nProvider><Desktop /></I18nProvider>
      </MotionConfig>
    ) : <NotFound />}
  </ErrorBoundary>
);
