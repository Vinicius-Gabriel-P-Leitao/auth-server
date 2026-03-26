import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react";
import * as projectAnnotations from "./preview";

// NOTE: Configura as anotações do Storybook para o Vitest
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
