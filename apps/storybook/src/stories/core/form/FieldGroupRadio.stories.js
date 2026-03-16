import FieldGroupRadio from '@aziontech/webkit/field-group-radio';

export default {
  title: 'Core/Form/FieldGroupRadio',
  component: FieldGroupRadio,
  tags: ['autodocs'],
  argTypes: {
    nameField: {
      control: 'text',
      description: 'Field name for vee-validate binding (form validation) (required)'
    },
    label: {
      control: 'text',
      description: 'Group label displayed above the radio buttons'
    },
    helpText: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all radio buttons in the group'
    },
    options: {
      control: 'object',
      description: 'Array of radio options (required)'
    },
    hideSelector: {
      control: 'boolean',
      description: 'Whether to hide the radio selectors'
    },
    auto: {
      control: 'boolean',
      description: 'Auto width layout'
    },
    isCard: {
      control: 'boolean',
      description: 'Whether to display as cards'
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the field is required'
    }
  }
};

const radioOptions = [
  { nameField: 'plan-a', title: 'Option A', inputValue: 'a' },
  { nameField: 'plan-b', title: 'Option B', inputValue: 'b' },
  { nameField: 'plan-c', title: 'Option C', inputValue: 'c' }
];

export const Default = {
  args: {
    nameField: 'field-group-radio-default',
    label: 'Select One Option',
    options: radioOptions
  }
};

export const Disabled = {
  args: {
    nameField: 'field-group-radio-disabled',
    label: 'Disabled Radio Group',
    options: radioOptions,
    disabled: true
  }
};

export const WithHelpText = {
  args: {
    nameField: 'field-group-radio-desc',
    label: 'Choose Your Plan',
    helpText: 'Select one plan from the options below',
    options: radioOptions
  }
};
