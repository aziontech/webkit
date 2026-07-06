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
          'Control-only pill toggle `Switch` (36×20 px). Two visual types: `default` (plain handle) and `privacy` (handle carries a lock icon mirroring the toggled state). No label or description — use `FieldSwitch` / `FieldSwitchBlock` for labeled layouts.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    isToggled: {
      control: 'boolean',
      description: 'Toggled-on state. Bind with `v-model:isToggled="value"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    type: {
      control: 'select',
      options: ['default', 'privacy'],
      description: 'Visual variant. Privacy renders a lock icon inside the handle.',
      table: {
        category: 'props',
        type: { summary: "'default' | 'privacy'" },
        defaultValue: { summary: "'default'" }
      }
    },
    isFocused: {
      control: 'boolean',
      description: 'Forces the focused visual state regardless of keyboard focus.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:isToggled': {
      action: 'update:isToggled',
      description: 'Emitted when the user toggles the switch.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    isToggled: false,
    type: 'default',
    isFocused: false
  }
}

export default meta

const Template = (args) => ({
  components: { Switch },
  setup() {
    const value = ref(args.isToggled ?? false)
    watch(
      () => args.isToggled,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:isToggled']?.(next)
    }
    return { args, value, onUpdate }
  },
  template:
    '<Switch v-bind="args" :is-toggled="value" @update:is-toggled="onUpdate" aria-label="Toggle setting" />'
})

const DEFAULT_SOURCE = toSfc(
  [IMPORT, "import { ref } from 'vue'", '', 'const isToggled = ref(false)'],
  '<Switch v-model:isToggled="isToggled" aria-label="Toggle setting" />'
)

/** @type {import('@storybook/vue3').StoryObj<typeof Switch>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default switch. Use the Controls panel to flip isToggled, type, and isFocused.'
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
  <Switch v-model:isToggled="defaultOff" type="default" aria-label="Default off" />
  <Switch v-model:isToggled="defaultOn" type="default" aria-label="Default on" />
  <Switch v-model:isToggled="privacyOff" type="privacy" aria-label="Privacy off" />
  <Switch v-model:isToggled="privacyOn" type="privacy" aria-label="Privacy on" />
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
          'Both type variants in off and on states. Privacy adds a lock (off) / lock-open (on) icon inside the handle.'
      },
      source: { code: toSfc(TYPES_SCRIPT, TYPES_TEMPLATE) }
    }
  }
}
