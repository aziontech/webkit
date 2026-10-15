import { toSfc } from '../../_shared/story-source'
import {
  components as pageComponents,
  DEFAULT_FILTERS,
  EVENTS_MAIN,
  pageScript,
  pageState
} from './_events-page'
import {
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const ACTIVE = 'real-time-events'

const TEMPLATE = shell({ withBreadcrumb: false, main: pageScroll(EVENTS_MAIN) })

const components = { ...SHELL_COMPONENTS, ...pageComponents }

const SHELL_SCRIPT = scriptLines({ parts: [], active: ACTIVE, declarations: [], state: [] })

const story = (initial, description) => ({
  render: () => ({
    components,
    setup: () => ({ ...shellState(ACTIVE), ...pageState(initial) }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(mergeScripts(SHELL_SCRIPT, pageScript(initial)), TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Shell/EventsVisualizer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Real-Time Events page as the console draws it: the platform shell with Real-Time Events active, then the controls row (Filter popover, event search, Refresh and Download CSV) over the applied filter chips, and the explorer. The explorer pairs a resizable, collapsible fields `Sidebar` (each field a column checkbox and a popover of its top values, grouped in an `Accordion` by category) with the log: the Events, Errors and Avg request time summary, the stacked volume chart whose buckets filter the period on click or drag, and the event `TableRoot`. Clicking a row opens the event document beside the log in a resizable end `Sidebar` when the explorer is wide enough, and in a `Drawer` when it is not.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  { filters: DEFAULT_FILTERS },
  'The last 24 hours of events: the fields panel, the summary over the volume chart, and the paginated log; click a row to open its event document.'
)

export const Filtered = story(
  { filters: { ...DEFAULT_FILTERS, source: ['waf', 'firewall'], level: ['Error'] } },
  'Errors from WAF and Firewall: the Filter button counts three applied fields and each shows as a chip that reopens the popover on that field or removes it.'
)

export const Empty = story(
  { filters: DEFAULT_FILTERS, empty: true },
  'A workspace with no traffic yet: the summary reads zero, the chart is flat and the log shows its No events yet state.'
)
