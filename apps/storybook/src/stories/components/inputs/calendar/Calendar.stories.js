import { ref } from 'vue'

import Calendar from '@aziontech/webkit/calendar'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Calendar from '@aziontech/webkit/calendar'"

// Runnable snippet scripts: real imports + the reactive state each canvas uses, so
// "Show code" is copy-paste-ready and matches the canvas exactly.
const sfcScript = (...decls) => [
  "import { ref } from 'vue'",
  '',
  IMPORT,
  ...(decls.length ? ['', ...decls] : [])
]

const DEFAULT_SOURCE = toSfc(
  sfcScript('const range = ref(null)'),
  '<Calendar v-model="range" mode="range" clearable show-time show-timezone />'
)
const SIZES_SOURCE = toSfc(
  sfcScript('const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })'),
  `<div class="flex items-start gap-4">
  <Calendar v-model="range" mode="range" size="small" />
  <Calendar v-model="range" mode="range" size="medium" />
  <Calendar v-model="range" mode="range" size="large" />
</div>`
)
const SINGLE_SOURCE = toSfc(
  sfcScript('const date = ref(null)'),
  '<Calendar v-model="date" mode="single" placeholder="Select date" />'
)
const HORIZONTAL_SOURCE = toSfc(
  sfcScript('const range = ref(null)'),
  '<Calendar v-model="range" mode="range" horizontal clearable show-time />'
)
const PRESETS_SOURCE = toSfc(
  sfcScript(
    'const now = new Date()',
    'const daysAgo = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)',
    'const range = ref(null)',
    'const presets = [',
    "  { label: 'Last 3 Days', value: { start: daysAgo(3), end: now } },",
    "  { label: 'Last 7 Days', value: { start: daysAgo(7), end: now } },",
    "  { label: 'Last 14 Days', value: { start: daysAgo(14), end: now } },",
    "  { label: 'Last Month', value: { start: daysAgo(30), end: now } }",
    ']'
  ),
  '<Calendar v-model="range" mode="range" :presets="presets" />'
)
const MIN_MAX_SOURCE = toSfc(
  sfcScript(
    'const now = new Date()',
    'const range = ref(null)',
    'const min = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())',
    'const max = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())'
  ),
  '<Calendar v-model="range" mode="range" :min="min" :max="max" clearable />'
)
const TIME_SOURCE = toSfc(
  sfcScript(
    'const range = ref({ start: new Date(2026, 9, 8, 0, 0), end: new Date(2026, 9, 19, 23, 59) })'
  ),
  '<Calendar v-model="range" mode="range" show-time />'
)
const TIMEZONE_SOURCE = toSfc(
  sfcScript(
    'const range = ref({ start: new Date(2026, 9, 8, 0, 0), end: new Date(2026, 9, 19, 23, 59) })'
  ),
  '<Calendar v-model="range" mode="range" show-time show-timezone />'
)
const PERIOD_SOURCE = toSfc(
  sfcScript('const range = ref(null)'),
  '<Calendar v-model="range" mode="range" period placeholder="Select period" />'
)
const CLEARABLE_SOURCE = toSfc(
  sfcScript('const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })'),
  '<Calendar v-model="range" mode="range" clearable />'
)

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
          'Date-range picker. A trigger opens a popover with a month grid, Start/End date + time fields, an optional timezone selector, and an Apply action. When `presets` are supplied, the trigger splits into two side-by-side segments — a preset dropdown (left, `🕐 label ⌄`) and the calendar (right, `📅 range`). It also offers a "Select Period" mode whose text input parses relative spans (`45m`, `12 hours`, `last month`, `yesterday`, `1/1 - 1/2`); a committed period shows the same two-segment trigger (token beside the resolved window). Date math uses the native `Date` API only — no date library.'
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
        defaultValue: { summary: "'Select a Date Range'" }
      }
    },
    presets: {
      control: false,
      description: 'Consumer-provided shortcuts; when present the trigger becomes a two-part control.',
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
      description: 'Selected IANA timezone (v-model:timezone). Empty resolves to the user local zone; set a specific IANA name to pin it.',
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

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Default = {
  args: { clearable: true, showTime: true, showTimezone: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref(null)
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
  }),
  parameters: {
    docs: {
      source: { code: DEFAULT_SOURCE },
      description: {
        story: 'Baseline range picker with Start/End time fields and a timezone selector (defaults to the user local zone; set `timezone` to pin a specific IANA zone).'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Sizes = {
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: SIZES_SOURCE },
      description: { story: 'The three trigger sizes — `small`, `medium`, and `large`.' }
    }
  },
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
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Single = {
  args: { mode: 'single', placeholder: 'Select date' },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const date = ref(null)
      return { args, date }
    },
    template: '<Calendar v-bind="args" v-model="date" />'
  }),
  parameters: {
    docs: {
      source: { code: SINGLE_SOURCE },
      description: { story: 'Single-date mode picks one day instead of a range.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Horizontal = {
  args: { horizontal: true, clearable: true, showTime: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref(null)
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
  }),
  parameters: {
    docs: {
      source: { code: HORIZONTAL_SOURCE },
      description: {
        story: 'Horizontal layout places the Start/End fields and Apply beside the calendar, with a full-height divider.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const WithPresets = {
  render: (args) => ({
    components: { Calendar },
    setup() {
      const now = new Date()
      const daysAgo = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)
      const range = ref(null)
      const presets = [
        { label: 'Last 3 Days', value: { start: daysAgo(3), end: now } },
        { label: 'Last 7 Days', value: { start: daysAgo(7), end: now } },
        { label: 'Last 14 Days', value: { start: daysAgo(14), end: now } },
        { label: 'Last Month', value: { start: daysAgo(30), end: now } }
      ]
      return { args, range, presets }
    },
    template: '<Calendar v-bind="args" v-model="range" :presets="presets" />'
  }),
  parameters: {
    docs: {
      source: { code: PRESETS_SOURCE },
      description: {
        story: 'Consumer presets drive the two-part trigger: the left dropdown applies a range in one click; the right calendar fine-tunes it.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const MinMax = {
  args: { clearable: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const now = new Date()
      const range = ref(null)
      const min = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
      const max = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
      return { args, range, min, max }
    },
    template: '<Calendar v-bind="args" v-model="range" :min="min" :max="max" />'
  }),
  parameters: {
    docs: {
      source: { code: MIN_MAX_SOURCE },
      description: {
        story: 'The `min` and `max` bounds (±2 months) disable days outside the allowed window and clamp navigation.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const WithTime = {
  args: { showTime: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({
        start: new Date(2026, 9, 8, 0, 0),
        end: new Date(2026, 9, 19, 23, 59)
      })
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
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
  args: { showTime: true, showTimezone: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({
        start: new Date(2026, 9, 8, 0, 0),
        end: new Date(2026, 9, 19, 23, 59)
      })
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
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
  args: { period: true, placeholder: 'Select period' },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref(null)
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
  }),
  parameters: {
    docs: {
      source: { code: PERIOD_SOURCE },
      description: {
        story: 'Select Period mode: pick a relative span (`45m`, `last month`) and the trigger shows the token beside the resolved window (`14:44 – 23:59`).'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Calendar>} */
export const Clearable = {
  args: { clearable: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
      return { args, range }
    },
    template: '<Calendar v-bind="args" v-model="range" />'
  }),
  parameters: {
    docs: {
      source: { code: CLEARABLE_SOURCE },
      description: { story: 'A clear control on the trigger empties the committed selection when present.' }
    }
  }
}
