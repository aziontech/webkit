/**
 * The documents the Observability band plays, one per tab. Each one names a real
 * surface of the console's Invocations screen, so the list beside the scene reads as
 * the screen's own tab bar rather than as marketing headings.
 */
export const TRACE_TABS = [
  {
    value: 'trace',
    label: 'Trace',
    title: 'Every span, on one clock',
    description:
      'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.'
  },
  {
    value: 'logs',
    label: 'Logs',
    title: 'The lines it printed',
    description:
      'Structured output on the same clock as the trace, filtered by level, searchable in place.'
  },
  {
    value: 'path',
    label: 'Request path',
    title: 'Where the request went',
    description:
      'The workload, application, function and connector it travelled, each captioned with the time spent there.'
  }
]

/** The `value`s, for the scene's tab bar and the band's picker. */
export const TRACE_TAB_VALUES = TRACE_TABS.map((tab) => tab.value)
