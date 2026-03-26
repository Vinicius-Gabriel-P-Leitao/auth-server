import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname } from "path";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: ["@storybook/addon-docs", "@storybook/addon-onboarding", "@storybook/addon-a11y", "@storybook/addon-vitest"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  async viteFinal(configVite) {
    return mergeConfig(configVite, {
      plugins: [tsconfigPaths({ projects: ["tsconfig.json"] })],

      esbuild: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },

      resolve: {
        alias: {
          "@client": path.resolve(__dirname, "../app/client"),
          "@server": path.resolve(__dirname, "../app/server"),
          "@shared": path.resolve(__dirname, "../app/shared"),
          "@fixtures": path.resolve(__dirname, "../fixtures"),
        },
      },
    });
  },
};

export default config;
