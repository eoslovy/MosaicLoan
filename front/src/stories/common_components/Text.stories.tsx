import type { Meta, StoryObj } from "@storybook/react";
import Text from "@/components/common/Text";

const meta: Meta<typeof Text> = {
  title: "Common/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "텍스트 내용을 설정합니다.",
    },
    size: { 
      control: "radio", 
      options: ["xs", "sm", "md", "lg", "xl", "xxl"],
      description: "텍스트 크기를 설정합니다.",
    },
    color: { 
      control: "radio", 
      options: ["gray", "light-blue", "blue", "black", "white"],
      description: "텍스트 색상을 설정합니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    text: "Hello World",
    size: "md",
    color: "black",
  },
};

export const LargeBlue: Story = {
  args: {
    text: "Big Blue Text",
    size: "xxl",
    color: "blue",
  },
};

export const SmallGray: Story = {
  args: {
    text: "Small Gray Text",
    size: "xs",
    color: "gray",
  },
};

export const WhiteText: Story = {
  args: {
    text: "White Text",
    size: "lg",
    color: "white",
  },
};
