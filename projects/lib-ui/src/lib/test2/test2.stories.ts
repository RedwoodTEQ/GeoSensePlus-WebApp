
import type { Meta, StoryObj } from '@storybook/angular';

import { fn } from 'storybook/test';

import { Test2 } from './test2';

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

const meta: Meta<Test2> = {
  title: 'Group1/Test2',
  component: Test2,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  args: {
    ...ActionsData,
  },
};

export default meta;
type Story = StoryObj<Test2>;

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Test2',
      state: 'TASK_INBOX',
    },
  },
};

