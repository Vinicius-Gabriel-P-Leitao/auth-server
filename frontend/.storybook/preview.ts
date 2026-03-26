import type { Preview } from "@storybook/react-vite";
// @ts-expect-error - tsc struggles with relative CSS imports in .storybook configuration
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
