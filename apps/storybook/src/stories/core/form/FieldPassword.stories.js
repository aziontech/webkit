import FieldPassword from '@aziontech/webkit/field-password'
import { useForm } from 'vee-validate'

export default {
  title: 'Core/Form/FieldPassword',
  component: FieldPassword,
  tags: ['autodocs'],
  decorators: [
    () => ({
      setup() {
        useForm()
      },
      template: '<div style="max-width: 400px;"><story /></div>'
    })
  ],
  argTypes: {
    onInput: { action: 'input', description: 'Fired when password value changes' },
    onBlur: { action: 'blur', description: 'Fired when field loses focus' },
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
    additionalError: {
      control: 'text',
      description: 'Additional error message to display'
    }
  }
}

export const Default = {
  args: {
    name: 'field-password-default',
    label: 'Password',
    placeholder: 'Enter password...'
  }
}

export const Disabled = {
  args: {
    name: 'field-password-disabled',
    label: 'Disabled Password Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
}

export const WithDescription = {
  args: {
    name: 'field-password-desc',
    label: 'Password',
    placeholder: 'Enter password...',
    description: 'Password must be at least 8 characters'
  }
}

export const Readonly = {
  args: {
    name: 'field-password-readonly',
    label: 'Read-only Password',
    value: 'preset-password',
    readonly: true
  }
}

export const Sensitive = {
  args: {
    name: 'field-password-sensitive',
    label: 'Sensitive Password Field',
    placeholder: 'Enter password...',
    sensitive: true,
    description: 'This field contains sensitive information'
  }
}

export const WithError = {
  args: {
    name: 'field-password-error',
    label: 'Password with Error',
    placeholder: 'Enter password...',
    additionalError: 'Password does not meet requirements'
  }
}
