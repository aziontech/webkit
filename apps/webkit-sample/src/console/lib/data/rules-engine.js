// Rules Engine — the VOCABULARY of a rule: the comparison operators, the behaviors
// each phase offers, and what each behavior asks for.
//
// A rule is `if <criteria> then <behaviors>`, and both halves are CONDITIONAL forms:
//
//   AN OPERATOR DECIDES WHETHER THERE IS AN ARGUMENT. `exists` / `does not exist`
//     test for presence, so the value input is not disabled for them — it is not
//     rendered. An input that can be typed into but is never read is worse than no
//     input: it accepts an answer and silently drops it.
//   A BEHAVIOR DECIDES WHAT IT IS GIVEN, and there is no single answer. `Deliver`
//     takes nothing. `Redirect (301)` takes a location. `Set cache policy` takes one
//     of THIS application's cache settings. `Capture match groups` takes three
//     values. Rendering one generic "value" box for all of them would ask for a
//     function id as free text and offer a text box to a behavior that reads none.
//
// So each behavior carries its own `argument` descriptor and the form renders that,
// which is what keeps the drawer from growing a chain of `v-if`s per behavior name.
//
// The lists are PER PHASE because the phases are different programs: a request rule
// can set the cache policy or pick the connector to fetch from; a response rule is
// looking at something already fetched and can only shape what leaves. A behavior
// absent from a phase is not disabled there, it is not offered.
import { useCacheSettings } from './cache-settings'
import { CONNECTORS } from './connectors'
import { functions } from './functions'

/** The comparison operators a condition is written with. */
export const OPERATORS = [
  { value: 'is-equal', label: 'is equal' },
  { value: 'is-not-equal', label: 'is not equal' },
  { value: 'starts-with', label: 'starts with' },
  { value: 'does-not-start-with', label: 'does not start with' },
  { value: 'matches', label: 'matches' },
  { value: 'does-not-match', label: 'does not match' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' }
]

export const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? ''

/**
 * Whether the operator compares against a value the reader supplies.
 *
 * `exists` / `does not exist` are the two that do not: they ask whether the variable
 * is present at all, so the argument input is dropped from the row entirely.
 */
export const takesArgument = (operator) => operator !== 'exists' && operator !== 'does-not-exist'

// ── The behavior catalog ──────────────────────────────────────────────────────
//
// `argument` is what the behavior is given, and one of four shapes:
//
//   null              — the behavior reads nothing (Deliver, Deny, Enable Gzip).
//   { kind: 'text' }  — one free-text value, with the placeholder that says its
//                       FORMAT (`header-name: value`), which is the only thing
//                       standing between the reader and a rejected save.
//   { kind: 'select' }— one record of this application, listed from the store that
//                       owns it (`source`), never re-typed here.
//   { kind: 'group' } — more than one value (Capture Match Groups takes three).
//
// `field` is the key the value is stored under on the behavior, so a rule's record
// carries `{ type: 'redirect-301', target: '…' }` — the shape a request body wants,
// not a positional array the reader of the record has to decode.
const text = (field, placeholder, label) => ({ kind: 'text', field, placeholder, label })

const CATALOG = [
  {
    value: 'add-request-cookie',
    label: 'Add Request Cookie',
    phases: ['request'],
    argument: text('target', 'cookie-name=value', 'Cookie')
  },
  {
    value: 'add-request-header',
    label: 'Add Request Header',
    phases: ['request'],
    argument: text('target', 'header-name: value', 'Header')
  },
  {
    value: 'add-response-cookie',
    label: 'Add Response Cookie',
    phases: ['response'],
    argument: text('target', 'cookie-name=value', 'Cookie')
  },
  {
    value: 'add-response-header',
    label: 'Add Response Header',
    phases: ['response'],
    argument: text('target', 'header-name: value', 'Header')
  },
  { value: 'bypass-cache', label: 'Bypass Cache', phases: ['request'], argument: null },
  {
    value: 'capture-match-groups',
    label: 'Capture Match Groups',
    phases: ['request', 'response'],
    argument: {
      kind: 'group',
      fields: [
        { field: 'capturedArray', placeholder: 'Captured array name', label: 'Captured array' },
        { field: 'subject', placeholder: 'Subject', label: 'Subject' },
        { field: 'regex', placeholder: 'Regex', label: 'Regex' }
      ]
    }
  },
  { value: 'deliver', label: 'Deliver', phases: ['request', 'response'], argument: null },
  { value: 'deny', label: 'Deny (403 Forbidden)', phases: ['request'], argument: null },
  { value: 'enable-gzip', label: 'Enable Gzip', phases: ['request', 'response'], argument: null },
  {
    value: 'filter-request-cookie',
    label: 'Filter Request Cookie',
    phases: ['request'],
    argument: text('target', 'cookie-name or cookie-name=cookie-value', 'Cookie')
  },
  {
    value: 'filter-request-header',
    label: 'Filter Request Header',
    phases: ['request'],
    argument: text('target', 'header-name', 'Header')
  },
  {
    value: 'filter-response-cookie',
    label: 'Filter Response Cookie',
    phases: ['response'],
    argument: text('target', 'cookie-name or cookie-name=cookie-value', 'Cookie')
  },
  {
    value: 'filter-response-header',
    label: 'Filter Response Header',
    phases: ['response'],
    argument: text('target', 'header-name', 'Header')
  },
  { value: 'forward-cookies', label: 'Forward Cookies', phases: ['request'], argument: null },
  { value: 'no-content', label: 'No Content (204)', phases: ['request'], argument: null },
  { value: 'optimize-images', label: 'Optimize Images', phases: ['request'], argument: null },
  {
    value: 'redirect-http-to-https',
    label: 'Redirect HTTP to HTTPS',
    phases: ['request'],
    argument: null
  },
  {
    value: 'redirect-301',
    label: 'Redirect To (301 Moved Permanently)',
    phases: ['request', 'response'],
    argument: text('target', 'https://example.com${uri}', 'Location')
  },
  {
    value: 'redirect-302',
    label: 'Redirect To (302 Found)',
    phases: ['request', 'response'],
    argument: text('target', 'https://example.com${uri}', 'Location')
  },
  {
    value: 'rewrite-request',
    label: 'Rewrite Request',
    phases: ['request'],
    argument: text('target', 'URL-path', 'Path')
  },
  {
    value: 'run-function',
    label: 'Run Function',
    phases: ['request', 'response'],
    argument: { kind: 'select', field: 'functionId', source: 'functions', label: 'Function' }
  },
  {
    value: 'set-cache-policy',
    label: 'Set Cache Policy',
    phases: ['request'],
    argument: { kind: 'select', field: 'cacheId', source: 'cache-settings', label: 'Cache policy' }
  },
  {
    value: 'set-connector',
    label: 'Set Connector',
    phases: ['request'],
    argument: { kind: 'select', field: 'connectorId', source: 'connectors', label: 'Connector' }
  }
]

const BY_VALUE = Object.fromEntries(CATALOG.map((behavior) => [behavior.value, behavior]))

/** The behavior's display name — what a list, a log line or a diff calls it. */
export const behaviorLabel = (value) => BY_VALUE[value]?.label ?? ''

/** What the behavior is given, or `null` when it reads nothing. */
export const behaviorArgument = (value) => BY_VALUE[value]?.argument ?? null

/** The behaviors a phase offers, alphabetical — the order the product lists them in. */
export const behaviorsFor = (phase) => CATALOG.filter((behavior) => behavior.phases.includes(phase))

export const behaviorAllowedIn = (value, phase) => Boolean(BY_VALUE[value]?.phases.includes(phase))

/**
 * The behaviors that END the rule: nothing after them can run, so they are the last
 * one a rule can hold and `Add behavior` is spent once one is selected. The rule that
 * let a behavior be added under `Deny` would be writing a line that never executes.
 */
const TERMINAL = ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302']

export const isTerminalBehavior = (value) => TERMINAL.includes(value)

/**
 * The records a `select`-kind argument offers, read live from the store that owns
 * them — so a cache policy created in the Cache Settings tab is selectable here
 * without a reload, and one deleted there stops being offered.
 *
 * `run-function` is narrowed by PHASE, not only by execution environment: the
 * response phase runs on a request that has already been answered, where only the
 * Lua runtime is available. Offering a JS function there would be offering a save
 * the API rejects.
 */
export const behaviorOptions = (source, phase) => {
  if (source === 'cache-settings') {
    return useCacheSettings().value.map((setting) => ({ value: setting.id, label: setting.name }))
  }
  if (source === 'connectors') {
    return CONNECTORS.map((connector) => ({ value: connector.id, label: connector.name }))
  }
  if (source === 'functions') {
    return functions.value
      .filter((fn) => fn.executionEnvironment === 'application')
      .filter((fn) => phase !== 'response' || fn.runtimeApi === 'azion_lua')
      .map((fn) => ({ value: fn.id, label: fn.name }))
  }
  return []
}

/** The one note a `select` argument carries under it, or `''`. */
export const behaviorArgumentNote = (source, phase) =>
  source === 'functions' && phase === 'response'
    ? 'Only functions with the Lua runtime run in the response phase.'
    : ''
