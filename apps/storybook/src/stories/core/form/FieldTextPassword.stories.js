import FieldTextPassword from '@aziontech/webkit/field-text-password';

export default {
  title: 'Core/Form/FieldTextPassword',
  component: FieldTextPassword,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Initial value of the input'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only'
    },
    sensitive: {
      control: 'boolean',
      description: 'Marks the field as containing sensitive data'
    },
    aditionalError: {
      control: 'text',
      description: 'Additional error message to display'
    }
  }
};

export const Default = {
  args: {
    name: 'field-text-password-default',
    label: 'Password',
    placeholder: 'Enter password...'
  }
};

export const Disabled = {
  args: {
    name: 'field-text-password-disabled',
    label: 'Disabled Password Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-text-password-desc',
    label: 'Password',
    placeholder: 'Enter password...',
    description: 'Password must be at least 8 characters'
  }
};

export const Readonly = {
  args: {
    name: 'field-text-password-readonly',
    label: 'Read-only Password',
    value: 'preset-password',
    readonly: true
  }
};

export const Sensitive = {
  args: {
    name: 'field-text-password-sensitive',
    label: 'Sensitive Password Field',
    placeholder: 'Enter password...',
    sensitive: true,
    description: 'This field contains sensitive information'
  }
};

export const WithError = {
  args: {
    name: 'field-text-password-error',
    label: 'Password with Error',
    placeholder: 'Enter password...',
    aditionalError: 'Password does not meet requirements'
  }
};
