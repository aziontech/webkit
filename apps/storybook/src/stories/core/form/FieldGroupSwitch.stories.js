import FieldGroupSwitch from '@aziontech/webkit/field-group-switch';

export default {
  title: 'Core/Form/FieldGroupSwitch',
  component: FieldGroupSwitch,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Group label displayed above the switches'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all switches in the group'
    },
    options: {
      control: 'object',
      description: 'Array of switch options'
    }
  }
};

const switchOptions = [
  { label: 'Enable Notifications', value: 'notifications' },
  { label: 'Enable Dark Mode', value: 'darkMode' },
  { label: 'Enable Auto-save', value: 'autoSave' }
];

export const Default = {
  args: {
    name: 'field-group-switch-default',
    label: 'Toggle Options',
    options: switchOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-group-switch-disabled',
    label: 'Disabled Switch Group',
    options: switchOptions,
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-group-switch-desc',
    label: 'Preferences',
    description: 'Enable or disable the features you prefer',
    options: switchOptions
  }
};
