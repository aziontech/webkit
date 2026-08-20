// The FILTER's model — the data a list page declares so the Filter button can narrow it.
//
// A FIELD is one thing the list can be narrowed by. The page owns the catalog,
// because only the page knows which of its columns are enumerable and how a row
// answers for each of them:
//
//     {
//       id: 'status',                                 // key in the applied state
//       label: 'Status',                              // chip prefix + menu row
//       kind: 'options' | 'range',                    // many values, or exactly one
//       options: [{ value, label, avatar?, icon? }],  // what the second level lists
//       match: (row, values) => boolean               // does this row survive
//     }
//
// APPLIED STATE is a plain object keyed by field id, each holding the ARRAY of
// picked values — `{ status: ['Active'], created: ['7d'] }`. A missing or empty
// entry is not a filter. That single rule is what the whole control reads from: a
// non-empty entry is a removable chip beside the button, an empty one is a plain row
// in the panel, and "how many filters are applied" — the number in the button's
// badge — is the count of non-empty entries.
//
// `kind` says how many values a field can hold, not how it looks: `'options'`
// accumulates (three authors is still one filter on Author), `'range'` replaces
// (two date windows at once would contradict each other). The panel reads it to
// decide whether picking a value keeps the list open or returns to the fields.
//
// The state is a flat object of arrays rather than a list of {field, operator,
// value} conditions on purpose. Every field here narrows by MEMBERSHIP — is the
// row's author one of these people, is its date inside this window — so an
// operator column would be a control with one option on every row. The generic
// field/operator/value builder is the right shape for a query language; it is
// the wrong shape for a set of columns whose operator is always "is one of".

import { daysAgo, monthsAgo, withinRange } from '@shared/lib/dates'

/**
 * Whether `field` currently narrows the list.
 *
 * Takes the FIELD, not its id, like every other function here — a module where
 * one helper wants `field` and its neighbour wants `field.id` reads fine and
 * fails silently, since `state[someObject]` is a valid lookup that is always
 * `undefined`.
 */
export const isApplied = (state, field) => Boolean(state[field.id]?.length)

/** The fields narrowing the list right now, in catalog order (the chips). */
export const appliedFields = (fields, state) => fields.filter((field) => isApplied(state, field))

/**
 * How many FIELDS are narrowing the list — never how many values.
 *
 * Three authors is one filter on Author; reading "3" for that would suggest three
 * columns are cut when only one is. It drives the button's badge only; the chips
 * beside it are what say WHICH, and what a screen reader reads.
 */
export const filterCount = (state) => Object.values(state).filter((values) => values?.length).length

/** The fields not narrowing anything yet. */
export const idleFields = (fields, state) => fields.filter((field) => !isApplied(state, field))

/**
 * The chip's value half, split into `{ label, extra }` rather than pre-joined.
 *
 * `label` is the FIRST pick's own label and `extra` is how many more there are, so
 * a chip reads "Author Bruno Germano +2" — it names something concrete and then
 * says how much more there is. The obvious alternative, "3 selected", is the same
 * width and tells you nothing: you have to open the panel to learn a single one of
 * the three, which is the exact cost this whole pattern exists to remove.
 *
 * Returns `null` (not an empty string) when nothing is picked, so a caller has to
 * decide what an unfilled field looks like instead of rendering a blank.
 */
export const summarize = (field, values = []) => {
  if (!values.length) return null
  const first = field.options?.find((option) => option.value === values[0])
  if (first) return { label: first.label, extra: values.length - 1 }
  // No matching option means the value is not from the list — a custom one the user
  // composed (a hand-picked date range). Only the field knows how to say it.
  const label = field.formatValue ? field.formatValue(values[0]) : String(values[0])
  return { label, extra: values.length - 1 }
}

/** `summarize` flattened for places that can only take a string (a menu row's hint). */
export const summarizeText = (field, values = []) => {
  const parts = summarize(field, values)
  if (!parts) return ''
  return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
}

/**
 * The picked options that carry a face, capped — the chip's avatar cluster.
 *
 * Capped because the cluster is an identity hint, not the selection: past three
 * overlapping faces nobody recognises a fourth, and the `+N` beside it already
 * says how many are not shown.
 */
export const pickedAvatars = (field, values = [], max = 3) =>
  (field.options ?? [])
    .filter((option) => values.includes(option.value) && 'avatar' in option)
    .slice(0, max)

/**
 * Run the catalog over the rows: a row survives when EVERY applied field keeps it.
 *
 * Fields intersect (Author AND Status) while the values inside one field union
 * (author A OR author B) — the arrangement every list filter implies and none of
 * them states, so it is stated here once instead of being re-derived per page.
 *
 * @param {Array<object>} rows
 * @param {Array<object>} fields The page's catalog.
 * @param {Record<string, Array<unknown>>} state
 */
export const applyFilters = (rows, fields, state) =>
  rows.filter((row) =>
    fields.every((field) => {
      const values = state[field.id]
      if (!values?.length) return true
      return field.match(row, values)
    })
  )

/** State with `value` added to / removed from `field` — `kind` decides which. */
export const toggleValue = (state, field, value) => {
  const current = state[field.id] ?? []
  // A range replaces: picking the same window again clears it, picking another swaps it.
  if (field.kind === 'range') {
    return { ...state, [field.id]: current[0] === value ? [] : [value] }
  }
  return {
    ...state,
    [field.id]: current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  }
}

/** State with `field` no longer narrowing anything (the chip's ×). */
export const clearField = (state, field) => {
  const next = { ...state }
  delete next[field.id]
  return next
}

// ── Date windows ──────────────────────────────────────────────────────────────
// PERIODS FIRST, a month grid only on request. The periods answer the question
// people actually arrive with ("what changed this week"), in one click, and they
// keep the second level the same shape as every other field: a list of values.
// A specific window is the rarer, more deliberate ask, so it sits behind `Custom…`
// and costs the extra step it is worth.
//
// The periods are open-ended (`end: null`) because each one means "since", and
// pinning the end to `now` would quietly exclude a row that lands while the panel
// is open. A custom range carries both of its own bounds instead.

/** Sentinel value for the row that opens the month grid instead of picking a window. */
export const DATE_CUSTOM = 'custom'

/** The value list a `kind: 'range'` date field offers. */
export const DATE_PRESETS = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  // `custom: true` is what the panel looks for to open a calendar rather than commit.
  { value: DATE_CUSTOM, label: 'Custom…', custom: true }
]

/**
 * A picked date value → the `{ start, end }` range `withinRange` compares against.
 *
 * Accepts either a period id or a range object, because those are the two things a
 * date field can hold once `Custom…` exists.
 */
export const dateRange = (value) => {
  if (value && typeof value === 'object') return value
  switch (value) {
    case '24h':
      return { start: daysAgo(1), end: null }
    case '7d':
      return { start: daysAgo(7), end: null }
    case '30d':
      return { start: daysAgo(30), end: null }
    case '3m':
      return { start: monthsAgo(3), end: null }
    default:
      // Includes the bare `custom` sentinel: chosen, but no range picked yet, so it
      // narrows nothing rather than narrowing to nothing.
      return null
  }
}

const RANGE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

/** A custom range as a chip-sized label: "Jun 1 – Jun 17". */
export const formatDateRange = (value) => {
  if (!value || typeof value !== 'object') return ''
  const { start, end } = value
  if (start && end) return `${RANGE_FORMAT.format(start)} – ${RANGE_FORMAT.format(end)}`
  if (start) return `Since ${RANGE_FORMAT.format(start)}`
  if (end) return `Until ${RANGE_FORMAT.format(end)}`
  return ''
}

/** The `match` every date field wants: is the row's instant inside the picked window. */
export const matchDate = (date, values) => withinRange(date, dateRange(values[0]))
