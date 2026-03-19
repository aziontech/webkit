import FieldPasswordStrength from '@aziontech/webkit/field-password-strength'
import { useForm } from 'vee-validate'

export default {
  title: 'Core/Form/FieldPasswordStrength',
  component: FieldPasswordStrength,
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
    onFocus: { action: 'focus', description: 'Fired when field gains focus' },
    onSubmit: { action: 'submit', description: 'Fired when Enter is pressed' },
    name: {
      control: 'text',
      description: 'Field name for vee-validate binding'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the field'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input'
    },
    promptLabel: {
      control: 'text',
      description: 'Label shown when no password is entered'
    },
    weakLabel: {
      control: 'text',
      description: 'Label for weak password strength'
    },
    mediumLabel: {
      control: 'text',
      description: 'Label for medium password strength'
    },
    strongLabel: {
      control: 'text',
      description: 'Label for strong password strength'
    },
    strongRegex: {
      control: 'text',
      description: 'Regex pattern that defines a strong password'
    },
    requirements: {
      control: 'object',
      description: 'Array of requirement objects with text property'
    },
    requirementsLabel: {
      control: 'text',
      description: 'Label displayed above the requirements list'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled'
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the field is read-only'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the field'
    }
  }
}

export const Default = {
  args: {
    name: 'password',
    label: 'Password'
  }
}

export const WithPlaceholder = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password'
  }
}

export const CustomLabels = {
  args: {
    name: 'password',
    label: 'Senha',
    promptLabel: 'Escolha uma senha',
    weakLabel: 'Fraca',
    mediumLabel: 'Média',
    strongLabel: 'Forte',
    requirementsLabel: 'Deve conter pelo menos:',
    requirements: [
      { text: '8 caracteres' },
      { text: '1 letra maiúscula' },
      { text: '1 letra minúscula' },
      { text: '1 número' },
      { text: '1 caractere especial' }
    ]
  }
}

export const WithDescription = {
  args: {
    name: 'password',
    label: 'Password',
    description: 'Your password must meet all requirements listed below.'
  }
}

export const Disabled = {
  args: {
    name: 'password',
    label: 'Password',
    disabled: true
  }
}
