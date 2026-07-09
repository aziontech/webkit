import { ref } from 'vue'

import Textarea from '@aziontech/webkit/textarea'

import { toSfc } from '../../../_shared/story-source'

const CORE_IMPORT = "import Textarea from '@aziontech/webkit/textarea'"
const IMPORTS = [CORE_IMPORT, "import { ref } from 'vue'"]

const withRef = (body, { initial = "''" } = {}) =>
  toSfc(IMPORTS, [`const value = ref(${initial})`, '', body].join('\n'))

/** @type {import('@storybook/vue3').Meta<typeof Textarea>} */
const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Multi-line free-form text input. Renders a fixed-size (large) textarea with a minimum height of 80px. The drag-resize axis is controlled by the `resizable` prop (`vertical` by default, `horizontal`, `both`, or `none`). Native textarea attributes (rows, maxlength, name, ...) flow through via attribute fallthrough.'
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Bound value (v-model).',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field as read-only.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies invalid styling and sets aria-invalid.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required and sets aria-required.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    resizable: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both', 'none'],
      description: 'Which axes the user can drag to resize the field.',
      table: {
        type: { summary: "'vertical' | 'horizontal' | 'both' | 'none'" },
        defaultValue: { summary: "'vertical'" },
        category: 'props'
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the bound value changes.',
      table: { type: { summary: 'string' }, category: 'events' }
    }
  },
  args: {
    modelValue: '',
    placeholder: 'Write your message',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    resizable: 'vertical'
  }
}

export default meta

const Template = (args) => ({
  components: { Textarea },
  setup() {
    const value = ref(args.modelValue ?? '')
    return { args, value }
  },
  template: `
    <div class="max-w-sm">
      <Textarea v-model="value" v-bind="args" />
    </div>
  `
})

const DEFAULT_MARKUP = '<Textarea v-model="value" placeholder="Write your message" />'

export const Default = {
  args: { placeholder: 'Write your message' },
  render: Template,
  parameters: {
    docs: {
      source: { code: withRef(DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<Textarea v-model="value" placeholder="Placeholder" disabled />'

export const Disabled = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        ${DISABLED_MARKUP}
      </div>
    `
  }),
  parameters: {
    docs: { controls: { disable: true }, source: { code: withRef(DISABLED_MARKUP) } }
  }
}

const INVALID_MARKUP = '<Textarea v-model="value" invalid />'

export const Invalid = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('Text Filled')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        ${INVALID_MARKUP}
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: withRef(INVALID_MARKUP, { initial: "'Text Filled'" }) }
    }
  }
}

const REQUIRED_MARKUP = '<Textarea v-model="value" required placeholder="Required field" />'

export const Required = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        ${REQUIRED_MARKUP}
      </div>
    `
  }),
  parameters: {
    docs: { controls: { disable: true }, source: { code: withRef(REQUIRED_MARKUP) } }
  }
}

const RESIZABLE_MARKUP = `<div class="flex flex-col gap-[var(--spacing-md)]">
  <Textarea v-model="value" placeholder="resizable=vertical (default)" resizable="vertical" />
  <Textarea v-model="value" placeholder="resizable=horizontal" resizable="horizontal" />
  <Textarea v-model="value" placeholder="resizable=both" resizable="both" />
  <Textarea v-model="value" placeholder="resizable=none" resizable="none" />
</div>`

export const Resizable = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        ${RESIZABLE_MARKUP}
      </div>
    `
  }),
  parameters: {
    docs: { controls: { disable: true }, source: { code: withRef(RESIZABLE_MARKUP) } }
  }
}
