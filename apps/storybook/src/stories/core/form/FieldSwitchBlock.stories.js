import FieldSwitchBlock from '@aziontech/webkit/field-switch-block';

export default {
  title: 'Core/Form/FieldSwitchBlock',
  component: FieldSwitchBlock,
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
      description: 'Helper text displayed below the switch'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the switch'
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
      description: 'Whether to hide the switch selector'
    },
    value: {
      control: 'boolean',
      description: 'Initial value of the switch'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the switch read-only'
    },
    selectorClass: {
      control: 'text',
      description: 'CSS class for the selector'
    },
    rootClass: {
      control: 'text',
      description: 'CSS class for the root element'
    }
  }
};

export const Default = {
  args: {
    name: 'field-switch-block-default',
    nameField: 'field-switch-block-field',
    title: 'Toggle Switch Block'
  }
};

export const Disabled = {
  args: {
    name: 'field-switch-block-disabled',
    nameField: 'field-switch-block-field-disabled',
    title: 'Disabled Switch Block',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-switch-block-desc',
    nameField: 'field-switch-block-field-desc',
    title: 'Enable Feature',
    description: 'Toggle to enable or disable this feature'
  }
};
