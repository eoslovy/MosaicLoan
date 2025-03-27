import type { Meta, StoryObj } from '@storybook/react';
import Nav from '@/components/layout/Nav';

const meta: Meta<typeof Nav> = {
  title: 'Layout/Nav',
  component: Nav,
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const Default: Story = {
  render: () => <Nav />,
};
