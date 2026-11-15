import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, ".", "VITE_").VITE_BASE_PATH || "/",
  build: { assetsInlineLimit: 0 },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    react(),
    {
      name: "pages-not-found",
      enforce: "post",
      generateBundle(_, bundle) {
        const page = bundle["index.html"];
        if (page?.type === "asset") {
          this.emitFile({ type: "asset", fileName: "404.html", source: page.source });
        }
      },
    },
  ],
}));
