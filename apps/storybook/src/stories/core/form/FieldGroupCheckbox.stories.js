import FieldGroupCheckbox from '@aziontech/webkit/field-group-checkbox';

export default {
  title: 'Core/Form/FieldGroupCheckbox',
  component: FieldGroupCheckbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label displayed above the checkboxes'
    },
    helpText: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all checkboxes in the group'
    },
    options: {
      control: 'object',
      description: 'Array of checkbox options (each needs nameField, title, value)'
    },
    hideSelector: {
      control: 'boolean',
      description: 'Whether to hide the checkbox selectors'
    },
    auto: {
      control: 'boolean',
      description: 'Auto width layout'
    },
    isCard: {
      control: 'boolean',
      description: 'Whether to display as cards'
    },
    hasDivider: {
      control: 'boolean',
      description: 'Whether to show dividers between options'
    }
  }
};

const checkboxOptions = [
  { nameField: 'option-a', title: 'Option A', value: 'a' },
  { nameField: 'option-b', title: 'Option B', value: 'b' },
  { nameField: 'option-c', title: 'Option C', value: 'c' }
];

export const Default = {
  args: {
    label: 'Select Options',
    options: checkboxOptions
  }
};

export const Disabled = {
  args: {
    label: 'Disabled Checkbox Group',
    options: checkboxOptions,
    disabled: true
  }
};

export const WithHelpText = {
  args: {
    label: 'Choose Your Preferences',
    helpText: 'Select all that apply',
    options: checkboxOptions
  }
};
