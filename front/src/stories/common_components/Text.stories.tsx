import type { Meta, StoryObj } from "@storybook/react";
import Text from "@/components/common/Text";

const meta: Meta<typeof Text> = {
  title: "Common/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    size: { 
      control: "radio", 
      options: ["xs", "sm", "md", "lg", "xl", "xxl"] 
    },
    color: { 
      control: "radio", 
      options: ["gray", "light-blue", "blue", "black"] 
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
