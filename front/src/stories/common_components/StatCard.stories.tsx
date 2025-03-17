import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import StatCard from "@/components/common/StatCard"

export default {
  title: "Components/StatCard",
  component: StatCard,
  argTypes: {
    icon: { control: "select", options: ["users", "trendingUp", "clock"] },
    value: { control: "text" },
    label: { control: "text" },
  },
} as Meta<typeof StatCard>;

const Template: StoryFn<typeof StatCard> = (args) => <StatCard {...args} />;

export const Users = Template.bind({});
Users.args = {
  icon: "users",
  value: "10K+",
  label: "Users",
};

export const Revenue = Template.bind({});
Revenue.args = {
  icon: "trendingUp",
  value: "$1M",
  label: "Total Revenue",
};

export const TimeSpent = Template.bind({});
TimeSpent.args = {
  icon: "clock",
  value: "24h",
  label: "Time Spent",
};
