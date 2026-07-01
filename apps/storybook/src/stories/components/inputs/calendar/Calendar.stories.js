import { ref } from 'vue'

import Calendar from '@aziontech/webkit/calendar'

const sfc = (body) =>
  ['<script setup>', "import Calendar from '@aziontech/webkit/calendar'", '</script>', '', '<template>', body, '</template>'].join(
    '\n'
  )

const DEFAULT_SOURCE = sfc('  <Calendar v-model="range" mode="range" />')
const SIZES_SOURCE = sfc(
  [
    '  <div class="flex items-start gap-4">',
    '    <Calendar v-model="range" mode="range" size="small" />',
    '    <Calendar v-model="range" mode="range" size="medium" />',
    '    <Calendar v-model="range" mode="range" size="large" />',
    '  </div>'
  ].join('\n')
)
const SINGLE_SOURCE = sfc('  <Calendar v-model="date" mode="single" placeholder="Select date" />')
const MULTI_MONTH_SOURCE = sfc('  <Calendar v-model="range" mode="range" :number-of-months="2" />')
const HORIZONTAL_SOURCE = sfc('  <Calendar v-model="range" mode="range" horizontal show-time />')
const PRESETS_SOURCE = sfc('  <Calendar v-model="range" mode="range" :presets="presets" />')
const TIME_SOURCE = sfc('  <Calendar v-model="range" mode="range" show-time />')
const TIMEZONE_SOURCE = sfc('  <Calendar v-model="range" mode="range" show-time show-timezone />')
const PERIOD_SOURCE = sfc('  <Calendar v-model="range" mode="range" period placeholder="Select period" />')
const CLEARABLE_SOURCE = sfc('  <Calendar v-model="range" mode="range" clearable />')

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
          'Date-range picker. A trigger button opens a popover that holds a one-click presets rail, one or more month grids, Start/End date + time fields, an optional timezone selector, and an Apply action; it also offers a "Select Period" mode whose text input parses relative spans (`45m`, `12 hours`, `last month`, `yesterday`, `1/1 - 1/2`). Selection is staged in a draft inside the popover and committed to `v-model` only on Apply (or immediately when `show-apply` is false). Date math uses the native `Date` API only — no date library.'
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description: 'Committed selection for v-model (Date or range).',
      table: { category: 'props', type: { summary: 'Date | null | CalendarRange' } }
    },
    mode: {
      control: 'inline-radio',
      options: ['single', 'range'],
      description: 'Selection mode.',
      table: {
        category: 'props',
        type: { summary: "'single' | 'range'" },
        defaultValue: { summary: "'range'" }
      }
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'Number of month grids rendered side-by-side.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1' } }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects the trigger, day-cell hit-area, and typography.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    min: {
      control: false,
      description: 'Earliest selectable date.',
      table: { category: 'props', type: { summary: 'Date' } }
    },
    max: {
      control: false,
      description: 'Latest selectable date.',
      table: { category: 'props', type: { summary: 'Date' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger, grid, and all controls.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    open: {
      control: false,
      description: 'Controlled open state of the popover (v-model:open).',
      table: { category: 'props', type: { summary: 'boolean' } }
    },
    placeholder: {
      control: 'text',
      description: 'Trigger text shown when there is no selection.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Select date range'" }
      }
    },
    presets: {
      control: false,
      description: 'Data-driven shortcuts rendered in the presets rail.',
      table: { category: 'props', type: { summary: 'CalendarPresetItem[]' } }
    },
    showTime: {
      control: 'boolean',
      description: 'Shows Start/End time fields alongside the date fields.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    showTimezone: {
      control: 'boolean',
      description: 'Shows the timezone selector below the fields.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    timezone: {
      control: 'text',
      description: 'Selected IANA timezone for display formatting (v-model:timezone).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    timezones: {
      control: false,
      description: 'Timezone options for the selector.',
      table: { category: 'props', type: { summary: 'string[]' } }
    },
    horizontal: {
      control: 'boolean',
      description: 'Lays the fields/apply column beside the calendar instead of below it.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear control on the trigger that empties the committed selection.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    showApply: {
      control: 'boolean',
      description: 'Stages edits in a draft and requires Apply to commit; when false, commits immediately.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    period: {
      control: 'boolean',
      description: 'Enables the Select Period relative-time mode.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    split: {
      control: 'boolean',
      description: 'Renders the trigger as a split control with a separate chevron affordance.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selection is committed.',
      table: { category: 'events', type: { summary: 'Date | null | CalendarRange' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the popover opens or closes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    'onUpdate:timezone': {
      action: 'update:timezone',
      description: 'Emitted when the timezone selection changes.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    onMonthChange: {
      action: 'month-change',
      description: 'Emitted when the first visible month changes.',
      table: { category: 'events', type: { summary: 'CalendarMonth' } }
    },
    onApply: {
      action: 'apply',
      description: 'Emitted when the draft selection is committed via Apply.',
      table: { category: 'events', type: { summary: 'Date | null | CalendarRange' } }
    }
  },
  args: {
    mode: 'range',
    numberOfMonths: 1,
    size: 'medium',
    disabled: false,
    showTime: false,
    showTimezone: false,
    horizontal: false,
    clearable: false,
    showApply: true,
    period: false,
    split: false
  }
}

export default meta

const handlers = (args) => {
  const { onUpdateModelValue, onUpdateOpen, onUpdateTimezone, onMonthChange, onApply, ...props } =
    args
  return { props, onUpdateModelValue, onUpdateOpen, onUpdateTimezone, onMonthChange, onApply }
}

const LISTENERS =
  '@update:modelValue="onUpdateModelValue" @update:open="onUpdateOpen" @update:timezone="onUpdateTimezone" @month-change="onMonthChange" @apply="onApply"'

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Default = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: DEFAULT_SOURCE },
      description: { story: 'Range picker — the trigger opens a popover with the calendar grid and Apply.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Sizes = {
  render: () => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
      return { range }
    },
    template: `<div class="flex items-start gap-4">
      <Calendar v-model="range" mode="range" size="small" />
      <Calendar v-model="range" mode="range" size="medium" />
      <Calendar v-model="range" mode="range" size="large" />
    </div>`
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: SIZES_SOURCE },
      description: { story: 'The three trigger sizes — `small`, `medium`, and `large`.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Single = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const date = ref(new Date(2026, 9, 8))
      return { ...handlers(args), date }
    },
    template: `<Calendar v-model="date" v-bind="props" mode="single" placeholder="Select date" ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: SINGLE_SOURCE },
      description: { story: 'Single-date mode picks one day instead of a range.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const MultiMonth = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 26), end: new Date(2026, 10, 8) })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" :number-of-months="2" ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: MULTI_MONTH_SOURCE },
      description: {
        story: 'Two months side-by-side; one shared nav pages both and the range band spans the boundary.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Horizontal = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" horizontal show-time ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: HORIZONTAL_SOURCE },
      description: { story: 'Horizontal layout places the Start/End fields and Apply beside the calendar.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const WithPresets = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 13), end: new Date(2026, 9, 19) })
      const presets = [
        { label: 'Last 7 days', value: { start: new Date(2026, 9, 13), end: new Date(2026, 9, 19) } },
        { label: 'Last 30 days', value: { start: new Date(2026, 8, 20), end: new Date(2026, 9, 19) } }
      ]
      return { ...handlers(args), range, presets }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" :presets="presets" ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: PRESETS_SOURCE },
      description: { story: 'A presets rail of one-click shortcuts that stage the range in the draft.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const WithTime = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({
        start: new Date(2026, 9, 8, 0, 0),
        end: new Date(2026, 9, 19, 23, 59)
      })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" show-time ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: TIME_SOURCE },
      description: { story: 'Start/End time fields round-trip the hours and minutes of each endpoint.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const WithTimezone = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({
        start: new Date(2026, 9, 8, 0, 0),
        end: new Date(2026, 9, 19, 23, 59)
      })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" show-time show-timezone ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: TIMEZONE_SOURCE },
      description: { story: 'A timezone selector (IANA zones) labels the selection; defaults to the local zone.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const SelectPeriod = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref(null)
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" period placeholder="Select period" ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: PERIOD_SOURCE },
      description: {
        story: 'Select Period mode: a relative-preset list plus a text input that parses spans like `45m` or `last month`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Clearable = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
      return { ...handlers(args), range }
    },
    template: `<Calendar v-model="range" v-bind="props" mode="range" clearable ${LISTENERS} />`
  }),
  parameters: {
    docs: {
      source: { code: CLEARABLE_SOURCE },
      description: { story: 'A clear control on the trigger empties the committed selection when present.' }
    }
  }
}
