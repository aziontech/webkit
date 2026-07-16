import { ref, watch } from 'vue'

import ThemeSwitcher from '@aziontech/webkit/theme-switcher'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ThemeSwitcher from '@aziontech/webkit/theme-switcher'"

// Canonical runnable usage for the "Show code" panel: v-model:value with a ref.
// toSfc joins these lines verbatim inside <script setup>, so extra script lines
// (the ref) are included alongside the imports.
const V_MODEL_SCRIPT = ["import { ref } from 'vue'", IMPORT, '', "const theme = ref('system')"]

const meta = {
  title: 'Components/Inputs/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact pill-shaped segmented control that lets the user pick the app color-theme mode — system, dark, or light — via three icon-only segments. It is a pure controlled input: it reflects and emits the selected mode with v-model:value and applies no global side effect itself.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['system', 'dark', 'light'],
      description: 'Selected theme mode. Bind with v-model:value.',
      table: { type: { summary: "'system' | 'dark' | 'light'" }, defaultValue: { summary: "'system'" } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the whole control and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the icon-only segmented group.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Theme'" } }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: 'Emitted when the user selects a mode. Paired with v-model:value.',
      table: { type: { summary: "'system' | 'dark' | 'light'" } }
    }
  },
  args: { value: 'system', disabled: false, ariaLabel: 'Theme' }
}

export default meta

// Interactive: a local model reflects the Controls `value` (via watch) and is
// updated on each selection, so the canvas reacts and the indicator slides.
const Template = (args) => ({
  components: { ThemeSwitcher },
  setup() {
    const model = ref(args.value)
    watch(
      () => args.value,
      (next) => {
        model.value = next
      }
    )
    const onSelect = (next) => {
      model.value = next
      args['onUpdate:value']?.(next)
    }
    return { args, model, onSelect }
  },
  template:
    '<ThemeSwitcher :value="model" :disabled="args.disabled" :aria-label="args.ariaLabel" @update:value="onSelect" />'
})

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Controlled theme switcher; defaults to the system mode. Click a segment and the highlight slides to it.' },
      source: { code: toSfc(V_MODEL_SCRIPT, '<ThemeSwitcher v-model:value="theme" />') }
    }
  }
}

export const Disabled = {
  render: Template,
  args: { disabled: true },
  parameters: {
    docs: {
      description: { story: 'The whole control is disabled and applies disabled tokens; no segment can be selected.' },
      source: { code: toSfc(V_MODEL_SCRIPT, '<ThemeSwitcher v-model:value="theme" disabled />') }
    }
  }
}
