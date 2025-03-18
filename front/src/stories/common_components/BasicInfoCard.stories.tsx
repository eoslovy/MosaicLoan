import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import BasicInfoCard from "@/components/common/BasicInfoCard";

export default {
  title: "Components/BasicInfoCard",
  component: BasicInfoCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: { type: "radio" },
      options: ["creditCard", "trendingUp", "clock", "arrowUpRight"],
    },
  },
} as Meta<typeof BasicInfoCard>;

const Template: StoryFn<typeof BasicInfoCard> = (args) => <BasicInfoCard {...args} />;

export const CreditCard = Template.bind({});
CreditCard.args = {
  icon: "creditCard",
  value: "₩ 2,500,000",
  label: "총 투자 금액",
};

export const TrendingUp = Template.bind({});
TrendingUp.args = {
  icon: "trendingUp",
  value: "₩ 1,500",
  label: "누적 투자액",
};

export const Clock = Template.bind({});
Clock.args = {
  icon: "clock",
  value: "99.8%",
  label: "상환율",
};

export const ArrowUpRight = Template.bind({});
ArrowUpRight.args = {
  icon: "arrowUpRight",
  value: "20%",
  label: "지난 달 대비 투자 증가율",
};
