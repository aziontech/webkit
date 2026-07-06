import { ref, watch } from 'vue'

import Calendar from '@aziontech/webkit/calendar'

import { toSfc } from '../../../_shared/story-source'

const SINGLE_SCRIPT = [
  "import { ref } from 'vue'",
  '',
  "import Calendar from '@aziontech/webkit/calendar'",
  '',
  'const selected = ref(new Date(2026, 9, 8))'
]

const SINGLE_MARKUP = '<Calendar v-model="selected" />'

const RANGE_SCRIPT = [
  "import { ref } from 'vue'",
  '',
  "import Calendar from '@aziontech/webkit/calendar'",
  '',
  'const selected = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })'
]

const RANGE_MARKUP = '<Calendar v-model="selected" mode="range" />'

/** @type {import('@storybook/vue3').Meta<typeof Calendar>} */
const meta = {
  title: 'Components/Inputs/Calendar',
  component: Calendar,
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
          'Inline date picker that renders a month grid for selecting a single date or a date range. Unlike a popover-anchored datepicker, Calendar is always-visible (no overlay, no positioning) and is the standalone surface a consumer embeds in a form, panel, or popover body. Date math uses the native `Date` API only — no date library.'
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description:
        'Selected value for v-model. A Date (or null) in single mode; a range object in range mode.',
      table: { category: 'props', type: { summary: 'Date | null | CalendarRange' } }
    },
    mode: {
      control: 'inline-radio',
      options: ['single', 'range'],
      description: 'Selection mode. Single picks one date; range picks a start and end date.',
      table: {
        category: 'props',
        type: { summary: "'single' | 'range'" },
        defaultValue: { summary: "'single'" }
      }
    },
    min: {
      control: false,
      description: 'Earliest selectable date; earlier days render disabled.',
      table: { category: 'props', type: { summary: 'Date' } }
    },
    max: {
      control: false,
      description: 'Latest selectable date; later days render disabled.',
      table: { category: 'props', type: { summary: 'Date' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the whole grid and navigation, applying disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    showHeader: {
      control: 'boolean',
      description: 'Shows the month/year label and previous/next month navigation.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selection changes.',
      table: { category: 'events', type: { summary: 'Date | null | CalendarRange' } }
    },
    onMonthChange: {
      action: 'month-change',
      description: 'Emitted when the visible month changes via navigation or keyboard paging.',
      table: { category: 'events', type: { summary: 'CalendarMonth' } }
    }
  },
  args: {
    mode: 'single',
    disabled: false,
    showHeader: true
  }
}

export default meta

const Template = (args) => ({
  components: { Calendar },
  setup() {
    const value = ref(args.modelValue ?? new Date(2026, 9, 8))
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? new Date(2026, 9, 8)
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: '<Calendar v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Single-mode calendar with a preselected date.' },
      source: { code: toSfc(SINGLE_SCRIPT, SINGLE_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Range = {
  args: { mode: 'range' },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const value = ref(
        args.modelValue ?? { start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) }
      )
      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? { start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) }
        }
      )
      const onUpdate = (next) => {
        value.value = next
        args['onUpdate:modelValue']?.(next)
      }
      return { args, value, onUpdate }
    },
    template: '<Calendar v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Range mode showing a selected start and end date with the in-range band between them.'
      },
      source: { code: toSfc(RANGE_SCRIPT, RANGE_MARKUP) }
    }
  }
}
