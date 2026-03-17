import FieldRadioBlock from '@aziontech/webkit/field-radio-block';

export default {
  title: 'Core/Form/FieldRadioBlock',
  component: FieldRadioBlock,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (DOM element ID) (required)'
    },
    nameField: {
      control: 'text',
      description: 'Field name for vee-validate binding (form validation) (required)'
    },
    title: {
      control: 'text',
      description: 'Title text displayed in the card'
    },
    isLabel: {
      control: 'boolean',
      description: 'Whether to show as label style'
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text displayed in the card'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the radio button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the radio button'
    },
    auto: {
      control: 'boolean',
      description: 'Auto width layout'
    },
    isCard: {
      control: 'boolean',
      description: 'Whether to display as a card'
    },
    hideSelector: {
      control: 'boolean',
      description: 'Whether to hide the radio selector'
    },
    inputValue: {
      control: 'text',
      description: 'Value for the radio button'
    },
    binary: {
      control: 'boolean',
      description: 'Whether the radio is binary'
    }
  }
};

export const Default = {
  args: {
    name: 'field-radio-block-default',
    nameField: 'field-radio-block-field',
    title: 'Select this option'
  }
};

export const Disabled = {
  args: {
    name: 'field-radio-block-disabled',
    nameField: 'field-radio-block-field-disabled',
    title: 'Disabled radio option',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-radio-block-desc',
    nameField: 'field-radio-block-field-desc',
    title: 'Choose this option',
    description: 'This is an additional description for this radio option'
  }
};
