import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/common/Button";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["filled", "outlined"] },
    disabled: { control: "boolean" },
    label: {
      control: "object",
      description: "버튼 내 텍스트를 설정합니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Filled: Story = {
  args: {
    variant: "filled",
    label: { text: "Click me", size: "md", color: "white"},
  },
};

export const Outlined: Story = {
  args: {
    variant: "outline",
    label: { text: "Click me", size: "lg", color: "black" },
  },
};

export const Disabled: Story = {
  args: {
    variant: "filled",
    label: { text: "Disabled", size: "xl", color: "gray" },
    disabled: true,
  },
};
