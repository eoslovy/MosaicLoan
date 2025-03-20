import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import PieChart from "@/components/chart/PieChart";
import { PieChartProps } from "@/types/components";


export default {
  title: "Charts/PieChart",
  component: PieChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    labels: { control: { type: "object" } },
    data: { control: { type: "object" } },
    colors: { control: { type: "object" } },
  },
} satisfies Meta<PieChartProps>;

const Template: StoryFn<typeof PieChart> = (args) => <PieChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  labels: ["주식", "채권", "부동산", "기타"],
  data: [40, 30, 20, 10],
  colors: ["#6366F1", "#10B981", "#FACC15", "#EF4444"],
};
