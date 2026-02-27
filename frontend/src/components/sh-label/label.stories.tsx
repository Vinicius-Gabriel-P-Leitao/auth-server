import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label.component";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Accept terms and conditions",
    htmlFor: "terms",
  },
};

export const Required: Story = {
  args: {
    children: (
      <>
        Email <span className="text-destructive">*</span>
      </>
    ),
    htmlFor: "email",
  },
};
