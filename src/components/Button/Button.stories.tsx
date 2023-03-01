import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  FiShare2
} from "react-icons/fi";

import Button from './';

export default {
  title: 'Example/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'Button'
}

export const WithIcon = Template.bind({});

WithIcon.args = {
  icon: "FiShare2"
}

export const WithTextAndIcon = Template.bind({});

WithTextAndIcon.args = {
  children: 'Compartilhar',
  icon: 'FiShare2'
}