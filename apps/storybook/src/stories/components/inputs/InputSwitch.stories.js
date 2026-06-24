import { ref } from 'vue'

import InputSwitch from '@aziontech/webkit/input-switch'

const CORE_IMPORT = "import InputSwitch from '@aziontech/webkit/inputs/input-switch'"

const basicSource = ({ initial = 'false', bind = '' } = {}) =>
  [
    '<script setup>',
    CORE_IMPORT,
    "import { ref } from 'vue'",
    '',
    `const isToggled = ref(${initial})`,
    '</script>',
    '',
    '<template>',
    `  <InputSwitch v-model:isToggled="isToggled"${bind ? ' ' + bind : ''} aria-label="Toggle setting" />`,
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof InputSwitch>} */
const meta = {
 title: 'Components/Inputs/Input Switch',
  component: InputSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'Control-only pill toggle `InputSwitch` (36×20 px). Two visual types: `default` (plain handle) and `privacy` (handle carries a lock icon mirroring the toggled state). No label or description — use `FieldSwitch` / `FieldSwitchBlock` for labeled layouts.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          'const isToggled = ref(false)',
          '</script>',
          '',
          '<template>',
          '  <InputSwitch v-model:isToggled="isToggled" aria-label="Toggle setting" />',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    isToggled: {
      control: 'boolean',
      description: 'Toggled-on state. Bind with `v-model:isToggled="value"`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    type: {
      control: 'select',
      options: ['default', 'privacy'],
      description: 'Visual variant. Privacy renders a lock icon inside the handle.',
      table: {
        type: { summary: "'default' | 'privacy'" },
        defaultValue: { summary: "'default'" },
        category: 'props'
      }
    },
    isFocused: {
      control: 'boolean',
      description: 'Forces the focused visual state regardless of keyboard focus.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    'onUpdate:isToggled': {
      action: 'update:isToggled',
      description: 'Emitted when the user toggles the switch.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof InputSwitch>} */
export const Default = {
  args: {
    isToggled: false,
    type: 'default',
    isFocused: false
  },
  render: (args) => ({
    components: { InputSwitch },
    setup() {
      return { args }
    },
    template: `
      <InputSwitch
        v-model:isToggled="args.isToggled"
        :type="args.type"
        :is-focused="args.isFocused"
        aria-label="Toggle setting"
      />
    `
  }),
  parameters: {
    docs: {
      description: { story: 'Default switch. Use the Controls panel to flip isToggled, type, and isFocused.' },
      source: { code: basicSource() }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSwitch>} */
export const Types = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const defaultOff = ref(false)
      const defaultOn = ref(true)
      const privacyOff = ref(false)
      const privacyOn = ref(true)
      return { defaultOff, defaultOn, privacyOff, privacyOn }
    },
    template: `
      <div class="flex flex-wrap items-center gap-[var(--spacing-4)]">
        <InputSwitch v-model:isToggled="defaultOff" type="default" aria-label="Default off" />
        <InputSwitch v-model:isToggled="defaultOn" type="default" aria-label="Default on" />
        <InputSwitch v-model:isToggled="privacyOff" type="privacy" aria-label="Privacy off" />
        <InputSwitch v-model:isToggled="privacyOn" type="privacy" aria-label="Privacy on" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Both type variants in off and on states. Privacy adds a lock (off) / lock-open (on) icon inside the handle.'
      },
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          'const defaultOff = ref(false)',
          'const defaultOn = ref(true)',
          'const privacyOff = ref(false)',
          'const privacyOn = ref(true)',
          '</script>',
          '',
          '<template>',
          '  <InputSwitch v-model:isToggled="defaultOff" type="default" aria-label="Default off" />',
          '  <InputSwitch v-model:isToggled="defaultOn" type="default" aria-label="Default on" />',
          '  <InputSwitch v-model:isToggled="privacyOff" type="privacy" aria-label="Privacy off" />',
          '  <InputSwitch v-model:isToggled="privacyOn" type="privacy" aria-label="Privacy on" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}
