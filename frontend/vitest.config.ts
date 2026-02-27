import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
// Note: Because we use vitest.workspace.ts, this file acts as a globally shared base config.
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup-ui.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./src/__tests__/setup-ui.ts"],
          include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@lib": path.resolve(dirname, "./src/lib"),
      "@app": path.resolve(dirname, "./src/app"),
      "@store": path.resolve(dirname, "./src/store"),
      "@assets": path.resolve(dirname, "./src/assets"),
      "@modules": path.resolve(dirname, "./src/modules"),
      "@components": path.resolve(dirname, "./src/components"),
      // NOTE: Testes
      "@tests": path.resolve(dirname, "./src/__tests__"),
      "@fixtures": path.resolve(dirname, "./src/__fixtures__"),
    },
  },
});
