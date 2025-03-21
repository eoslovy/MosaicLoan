import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import StatsSection from '@/components/ui/StatsSection';

export default {
  title: 'Components/StatsSection',
  component: StatsSection,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof StatsSection>;

const Template: StoryFn<typeof StatsSection> = () => <StatsSection />;

export const Default = Template.bind({});
