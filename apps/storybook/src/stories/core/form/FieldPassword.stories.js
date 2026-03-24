import FieldPassword from '@aziontech/webkit/field-password'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

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
    onFocus: { action: 'focus', description: 'Fired when field gains focus' },
    onSubmit: { action: 'submit', description: 'Fired when Enter is pressed' },
    onStrength: { action: 'strength', description: 'Fired with strength evaluation object when showStrength is enabled' },
    name: {
      control: 'text',
      description: 'Field name for vee-validate binding (required)'
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
    },
    showStrength: {
      control: 'boolean',
      description: 'Enables strength meter, requirements list, and strength emit'
    },
    promptLabel: {
      control: 'text',
      description: 'Label shown when no password is entered (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    weakLabel: {
      control: 'text',
      description: 'Label for weak password strength (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    mediumLabel: {
      control: 'text',
      description: 'Label for medium password strength (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    strongLabel: {
      control: 'text',
      description: 'Label for strong password strength (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    strongRegex: {
      control: 'text',
      description: 'Regex pattern that defines a strong password (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    requirements: {
      control: 'object',
      description: 'Array of requirement objects with text property (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    },
    requirementsLabel: {
      control: 'text',
      description: 'Label displayed above the requirements list (requires showStrength)',
      if: { arg: 'showStrength', truthy: true }
    }
  }
}

// --- Basic usage (no strength) ---

export const Default = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password...'
  }
}

export const WithDescription = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password...',
    description: 'Password must be at least 8 characters'
  }
}

export const WithError = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password...',
    additionalError: 'Password does not meet requirements'
  }
}

export const Disabled = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Cannot edit',
    disabled: true
  }
}

export const Readonly = {
  args: {
    name: 'password',
    label: 'Password',
    value: 'preset-password',
    readonly: true
  }
}

// --- With strength meter ---

export const WithStrength = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    showStrength: true
  }
}

export const WithStrengthCustomLabels = {
  args: {
    name: 'password',
    label: 'Senha',
    placeholder: 'Digite sua senha',
    showStrength: true,
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

export const WithStrengthAndError = {
  render: (args) => ({
    components: { FieldPassword },
    setup() {
      useForm()
      const error = ref('')

      const levelMessages = {
        weak: 'Your password is too weak',
        medium: 'Your password could be stronger',
        strong: ''
      }

      const onStrength = ({ level }) => {
        error.value = levelMessages[level]
      }

      return { args, error, onStrength }
    },
    template: `
      <div style="max-width: 400px;">
        <FieldPassword v-bind="args" :additionalError="error" @strength="onStrength" />
      </div>
    `
  }),
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    showStrength: true
  }
}

// --- Strength emit demo (showStrength off, only emit visible) ---

const levelColors = {
  weak: '#ef4444',
  medium: '#f59e0b',
  strong: '#22c55e'
}

export const StrengthEmitDemo = {
  render: (args) => ({
    components: { FieldPassword },
    setup() {
      useForm()
      const strength = ref(null)

      const onStrength = (result) => {
        strength.value = result
      }

      const levelColor = computed(() => {
        if (!strength.value) return 'transparent'
        return levelColors[strength.value.level] || '#94a3b8'
      })

      const rules = computed(() => {
        if (!strength.value) return []
        return [
          { label: 'Min 8 characters', key: 'minLength' },
          { label: 'Uppercase letter', key: 'uppercase' },
          { label: 'Lowercase letter', key: 'lowercase' },
          { label: 'Number', key: 'number' },
          { label: 'Special character', key: 'specialChar' }
        ]
      })

      return { args, strength, onStrength, levelColor, rules }
    },
    template: `
      <div style="max-width: 400px;">
        <FieldPassword v-bind="args" @strength="onStrength" />

        <div v-if="strength" style="margin-top: 16px; padding: 16px; background: var(--surface-50); border: 1px solid var(--surface-200); border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 13px; font-weight: 600; color: var(--text-color);">Strength:</span>
            <span
              style="font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;"
              :style="{ color: levelColor, background: levelColor + '18' }"
            >
              {{ strength.level }}
            </span>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
            <li
              v-for="rule in rules"
              :key="rule.key"
              style="display: flex; align-items: center; gap: 8px; font-size: 13px;"
              :style="{ color: strength[rule.key] ? '#22c55e' : 'var(--text-color-secondary)' }"
            >
              <span style="font-size: 14px;">{{ strength[rule.key] ? '✓' : '○' }}</span>
              <span>{{ rule.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    `
  }),
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Type to see strength evaluation...',
    showStrength: false
  }
}
