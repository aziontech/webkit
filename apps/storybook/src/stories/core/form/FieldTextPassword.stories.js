import FieldTextPassword from '@aziontech/webkit/field-text-password';

export default {
  title: 'Core/Form/FieldTextPassword',
  component: FieldTextPassword,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the password input'
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
      description: 'Disables the password input'
    }
  }
};

export const Default = {
  args: {
    name: 'field-password-default',
    label: 'Password',
    placeholder: 'Enter password...'
  }
};

export const Disabled = {
  args: {
    name: 'field-password-disabled',
    label: 'Disabled Password Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-password-desc',
    label: 'Password',
    placeholder: 'Enter password...',
    description: 'Password must be at least 8 characters long'
  }
};
