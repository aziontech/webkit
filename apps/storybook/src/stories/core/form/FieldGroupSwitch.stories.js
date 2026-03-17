import FieldGroupSwitch from '@aziontech/webkit/field-group-switch';

export default {
  title: 'Core/Form/FieldGroupSwitch',
  component: FieldGroupSwitch,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label displayed above the switches'
    },
    helpText: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all switches in the group'
    },
    options: {
      control: 'object',
      description: 'Array of switch options (required)'
    },
    hideSelector: {
      control: 'boolean',
      description: 'Whether to hide the switch selectors'
    },
    auto: {
      control: 'boolean',
      description: 'Auto width layout'
    },
    isCard: {
      control: 'boolean',
      description: 'Whether to display as cards'
    },
    inputClass: {
      control: 'text',
      description: 'Additional CSS class for the input'
    }
  }
};

const switchOptions = [
  { nameField: 'enable-notifications', title: 'Enable Notifications', value: 'notifications' },
  { nameField: 'enable-dark-mode', title: 'Enable Dark Mode', value: 'darkMode' },
  { nameField: 'enable-auto-save', title: 'Enable Auto-save', value: 'autoSave' }
];

export const Default = {
  args: {
    label: 'Toggle Options',
    options: switchOptions
  }
};

export const Disabled = {
  args: {
    label: 'Disabled Switch Group',
    options: switchOptions,
    disabled: true
  }
};

export const WithHelpText = {
  args: {
    label: 'Preferences',
    helpText: 'Enable or disable the features you prefer',
    options: switchOptions
  }
};
