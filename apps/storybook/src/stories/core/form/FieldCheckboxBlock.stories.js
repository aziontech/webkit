import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block';

export default {
  title: 'Core/Form/FieldCheckboxBlock',
  component: FieldCheckboxBlock,
  tags: ['autodocs'],
  argTypes: {
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
      description: 'Helper text displayed below the checkbox'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox'
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
      description: 'Whether to hide the checkbox selector'
    },
    nameField: {
      control: 'text',
      description: 'Field name for vee-validate binding (required)'
    },
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Value for the checkbox'
    },
    binary: {
      control: 'boolean',
      description: 'Whether the checkbox is binary (true/false)'
    }
  }
};

export const Default = {
  args: {
    name: 'field-checkbox-default',
    nameField: 'field-checkbox-default',
    title: 'Accept terms and conditions'
  }
};

export const Disabled = {
  args: {
    name: 'field-checkbox-disabled',
    nameField: 'field-checkbox-disabled',
    title: 'Disabled checkbox',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-checkbox-desc',
    nameField: 'field-checkbox-desc',
    title: 'Subscribe to newsletter',
    description: 'Receive monthly updates about our products'
  }
};

export const WithSubtitle = {
  args: {
    name: 'field-checkbox-subtitle',
    nameField: 'field-checkbox-subtitle',
    title: 'Enable notifications',
    subtitle: 'Get notified about new features'
  }
};

export const BinaryCheckbox = {
  args: {
    name: 'field-checkbox-binary',
    nameField: 'field-checkbox-binary',
    title: 'I agree to the terms',
    binary: true
  }
};

export const WithoutCard = {
  args: {
    name: 'field-checkbox-no-card',
    nameField: 'field-checkbox-no-card',
    title: 'Simple checkbox',
    isCard: false
  }
};
