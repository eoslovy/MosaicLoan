import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/common/Button';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined', 'non-selected', 'disabled'],
    },
    size: {
      control: 'radio',
      options: ['normal', 'large'],
    },
    disabled: { control: 'boolean' },
    label: {
      control: 'object',
      description: '버튼 내 텍스트를 설정합니다.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const FilledNormal: Story = {
  args: {
    variant: 'filled',
    size: 'normal',
    label: { text: 'Click me', size: 'md', color: 'white' },
  },
};

export const FilledLarge: Story = {
  args: {
    variant: 'filled',
    size: 'large',
    label: { text: 'Click me', size: 'md', color: 'white' },
  },
};

export const OutlinedNormal: Story = {
  args: {
    variant: 'outlined',
    size: 'normal',
    label: { text: 'Click me', size: 'lg', color: 'blue' },
  },
};

export const OutlinedLarge: Story = {
  args: {
    variant: 'outlined',
    size: 'large',
    label: { text: 'Click me', size: 'lg', color: 'blue' },
  },
};

export const NonSelectedNormal: Story = {
  args: {
    variant: 'non-selected',
    size: 'normal',
    label: { text: 'Not Selected', size: 'md', color: 'gray' },
  },
};

export const NonSelectedLarge: Story = {
  args: {
    variant: 'non-selected',
    size: 'large',
    label: { text: 'Not Selected', size: 'md', color: 'gray' },
  },
};

export const DisabledNormal: Story = {
  args: {
    variant: 'filled',
    size: 'normal',
    label: { text: 'Disabled', size: 'xl', color: 'gray' },
    disabled: true,
  },
};

export const DisabledLarge: Story = {
  args: {
    variant: 'filled',
    size: 'large',
    label: { text: 'Disabled', size: 'xl', color: 'gray' },
    disabled: true,
  },
};
