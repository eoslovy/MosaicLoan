import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { DoughnutChartProps, DoughnutChartType } from "@/types/components";

export default {
  title: "Charts/DoughnutChart",
  component: DoughnutChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    percentage: { control: { type: "range", min: 0, max: 100, step: 1 } },
    type: {
      control: { type: "select" },
      options: ["repay-complete", "investing",] as DoughnutChartType[],
    },
    label: { control: "text" },
  },
} as Meta<typeof DoughnutChart>;

const Template: StoryFn<typeof DoughnutChart> = (args) => <DoughnutChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  percentage: 75,
  type: "repay-complete",
  label: "투자 성공률",
};
