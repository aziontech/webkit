import { ref, watch } from 'vue'

import Switch from '@aziontech/webkit/switch'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Switch from '@aziontech/webkit/switch'"

/** @type {import('@storybook/vue3').Meta<typeof Switch>} */
const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
        component:
          'Control-only pill toggle `Switch` (36×20 px). Two visual kinds: `default` (plain handle) and `privacy` (handle carries a lock icon mirroring the toggled state). No label or description — use `FieldSwitch` / `FieldSwitchBlock` for labeled layouts.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Toggled-on state. Bind with `v-model="value"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    kind: {
      control: 'select',
      options: ['default', 'privacy'],
      description: 'Visual variant. Privacy renders a lock icon inside the handle.',
      table: {
        category: 'props',
        type: { summary: "'default' | 'privacy'" },
        defaultValue: { summary: "'default'" }
      }
    },
    focused: {
      control: 'boolean',
      description: 'Forces the focused visual state regardless of keyboard focus.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the user toggles the switch.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    modelValue: false,
    kind: 'default',
    focused: false
  }
}

export default meta

const Template = (args) => ({
  components: { Switch },
  setup() {
    const value = ref(args.modelValue ?? false)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template:
    '<Switch v-bind="args" :model-value="value" @update:model-value="onUpdate" aria-label="Toggle setting" />'
})

const DEFAULT_SOURCE = toSfc(
  [IMPORT, "import { ref } from 'vue'", '', 'const modelValue = ref(false)'],
  '<Switch v-model="modelValue" aria-label="Toggle setting" />'
)

/** @type {import('@storybook/vue3').StoryObj<typeof Switch>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default switch. Use the Controls panel to flip modelValue, kind, and focused.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}

const TYPES_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const defaultOff = ref(false)',
  'const defaultOn = ref(true)',
  'const privacyOff = ref(false)',
  'const privacyOn = ref(true)'
]

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-[var(--spacing-4)]">
  <Switch v-model="defaultOff" kind="default" aria-label="Default off" />
  <Switch v-model="defaultOn" kind="default" aria-label="Default on" />
  <Switch v-model="privacyOff" kind="privacy" aria-label="Privacy off" />
  <Switch v-model="privacyOn" kind="privacy" aria-label="Privacy on" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Switch>} */
export const Types = {
  render: () => ({
    components: { Switch },
    setup() {
      const defaultOff = ref(false)
      const defaultOn = ref(true)
      const privacyOff = ref(false)
      const privacyOn = ref(true)
      return { defaultOff, defaultOn, privacyOff, privacyOn }
    },
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both kind variants in off and on states. Privacy adds a lock (off) / lock-open (on) icon inside the handle.'
      },
      source: { code: toSfc(TYPES_SCRIPT, TYPES_TEMPLATE) }
    }
  }
}

const PRIVACY_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const off = ref(false)',
  'const on = ref(true)'
]

const PRIVACY_TEMPLATE = `<div class="flex items-center gap-[var(--spacing-4)]">
  <Switch v-model="off" kind="privacy" aria-label="Privacy off" />
  <Switch v-model="on" kind="privacy" aria-label="Privacy on" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Switch>} */
export const Privacy = {
  render: () => ({
    components: { Switch },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: PRIVACY_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Privacy variant in both states. The off handle carries a closed lock (`pi-lock`) tinted `var(--bg-surface)` against the muted handle; the on handle carries an open lock (`pi-lock-open`) tinted `var(--text-default)` against the canvas handle — so the icon contrasts against the handle rather than blending into the surrounding `var(--success-contrast)` track.'
      },
      source: { code: toSfc(PRIVACY_SCRIPT, PRIVACY_TEMPLATE) }
    }
  }
}
