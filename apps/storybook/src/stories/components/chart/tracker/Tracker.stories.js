import Tracker from '@aziontech/webkit/tracker'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Tracker from '@aziontech/webkit/tracker'"

const DAYS = 90
const DEGRADED_DAY = 52
const OUTAGE_DAY = 73

const uptimeDays = () =>
  Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
    const id = date.toISOString().slice(0, 10)
    const day = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
    if (index === DAYS - 1) return { id, label: `${day} · No data` }
    if (index === OUTAGE_DAY) return { id, severity: 'danger', label: `${day} · Partial outage` }
    if (index === DEGRADED_DAY)
      return { id, severity: 'warning', label: `${day} · Degraded performance` }
    return { id, severity: 'success', label: `${day} · Operational` }
  })

const UPTIME_SCRIPT = [
  IMPORT,
  '',
  'const DAYS = 90',
  'const DEGRADED_DAY = 52',
  'const OUTAGE_DAY = 73',
  '',
  'const days = Array.from({ length: DAYS }, (_, index) => {',
  '  const date = new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))',
  '  const id = date.toISOString().slice(0, 10)',
  "  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })",
  '  if (index === DAYS - 1) return { id, label: `${day} · No data` }',
  "  if (index === OUTAGE_DAY) return { id, severity: 'danger', label: `${day} · Partial outage` }",
  "  if (index === DEGRADED_DAY) return { id, severity: 'warning', label: `${day} · Degraded performance` }",
  "  return { id, severity: 'success', label: `${day} · Operational` }",
  '})'
]

const meta = {
  title: 'Components/Primitives/Chart/Tracker',
  component: Tracker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A status strip: one block per period, colored by its severity, with a readout of the period label on hover or keyboard focus. It shows the history of a state at a glance, such as uptime, health checks or build results, where a chart would plot a measure.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'One block per period, oldest first; each item is { id?: string; severity?: ChartStatus; label: string }. No severity renders a neutral no-data block.',
      table: {
        category: 'props',
        type: { summary: 'TrackerItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Renders a Skeleton strip in place of the blocks.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the strip.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: {
    items: uptimeDays(),
    loading: false,
    ariaLabel: 'Edge Application uptime, last 90 days'
  }
}

export default meta

const Template = (args) => ({
  components: { Tracker },
  setup: () => ({ args }),
  template:
    '<div class="w-full max-w-(--container-xl) pt-(--spacing-xl)"><Tracker v-bind="args" /></div>'
})

const DEFAULT_MARKUP = `<div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
  <Tracker aria-label="Edge Application uptime, last 90 days" :items="days" />
</div>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Ninety days of uptime for an Edge Application: one degraded day, one partial outage, and a last day with no data yet. Hover a block, or focus the strip and use the arrow keys, to read its day.'
      },
      source: { code: toSfc(UPTIME_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const LOADING_MARKUP = `<div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
  <Tracker aria-label="Edge Application uptime, last 90 days" loading />
</div>`

export const Loading = {
  render: Template,
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story: 'A Skeleton strip holds the place of the blocks while the history loads.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const EMPTY_MARKUP = `<div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
  <Tracker aria-label="Edge Application uptime, last 90 days" :items="[]" />
</div>`

export const Empty = {
  render: Template,
  args: { items: [] },
  parameters: {
    docs: {
      description: {
        story:
          'No periods for the range: the strip renders one neutral block and is announced as No data.'
      },
      source: { code: toSfc(IMPORT, EMPTY_MARKUP) }
    }
  }
}
