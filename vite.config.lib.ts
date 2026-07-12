import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// Library build: emits ESM + CJS bundles and .d.ts types to dist/.
// React is a peer dependency, so it stays external. Components use
// inline styles driven by the theme, so there is no CSS to ship.
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: [
        "src/App.tsx",
        "src/main.tsx",
        "src/demo/**",
        "src/test/**",
        "src/__tests__/**",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Halo",
      formats: ["es", "cjs"],
      fileName: (format) => `halo.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
      output: {
        // Every component uses React context/state, so the whole library is
        // client-side. This banner makes it safe to import from a Next.js
        // App Router Server Component without a hard RSC error.
        banner: '"use client";',
        globals: { react: "React", "react-dom": "ReactDOM" },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
