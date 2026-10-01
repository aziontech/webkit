import { daysAgo } from '@shared/lib/dates'

/** The glyph and the word each span kind is read with, in the trace and in its detail. */
export const SPAN_KINDS = {
  function: { label: 'Function', icon: 'ai ai-edge-functions' },
  compute: { label: 'Compute', icon: 'pi pi-code' },
  network: { label: 'Network', icon: 'pi pi-send' },
  security: { label: 'Security', icon: 'pi pi-lock' },
  storage: { label: 'Storage', icon: 'ai ai-edge-storage' }
}

/**
 * The kind a span is read as, falling back to compute for an unknown one.
 *
 * @param {object} span
 * @returns {{ label: string, icon: string }}
 */
export const spanKind = (span) => SPAN_KINDS[span?.kind] ?? SPAN_KINDS.compute

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000)

const RUNS = [
  {
    id: 'inv_01KC7XRJZ4',
    status: 'Completed',
    startedAt: minutesAgo(2),
    duration: 412,
    region: 'GRU · São Paulo',
    trigger: 'GET /img/hero-4k.jpg?format=avif',
    outcome: '200 — served from the transform, then written to cache.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started · GET /img/hero-4k.jpg?format=avif' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 16, level: 'info', message: 'Cache miss — fetching assets.storefront.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, cipher TLS_AES_128_GCM_SHA256' },
      { at: 202, level: 'info', message: 'Origin answered 200 · image/jpeg · 2.4 MB' },
      { at: 256, level: 'debug', message: 'Decoded 3840x2160, re-encoding to avif q80' },
      { at: 348, level: 'info', message: 'Encoded 412 KB · 83% smaller' },
      { at: 386, level: 'info', message: 'Cached for 86400s' },
      { at: 412, level: 'info', message: 'Invocation completed · 200' }
    ],
    spans: [
      { id: 'root', name: 'image-optimizer', kind: 'function', depth: 0, start: 0, duration: 412 },
      { id: 'parse', name: 'parse-request', kind: 'compute', depth: 1, start: 4, duration: 12 },
      { id: 'origin', name: 'fetch-origin', kind: 'network', depth: 1, start: 16, duration: 186 },
      { id: 'dns', name: 'dns-lookup', kind: 'network', depth: 2, start: 16, duration: 14 },
      { id: 'tls', name: 'tls-handshake', kind: 'security', depth: 2, start: 30, duration: 31 },
      {
        id: 'response',
        name: 'origin-response',
        kind: 'network',
        depth: 2,
        start: 61,
        duration: 141
      },
      { id: 'decode', name: 'decode', kind: 'compute', depth: 1, start: 202, duration: 54 },
      { id: 'transform', name: 'transform', kind: 'compute', depth: 1, start: 256, duration: 92 },
      { id: 'cache', name: 'put-cache', kind: 'storage', depth: 1, start: 348, duration: 38 }
    ]
  },
  {
    id: 'inv_01KC7XQM8P',
    status: 'Failed',
    startedAt: minutesAgo(14),
    duration: 1240,
    region: 'GIG · Rio de Janeiro',
    trigger: 'GET /img/gallery-12.jpg?format=webp',
    outcome: '502 — the origin did not answer within the 1s budget.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started · GET /img/gallery-12.jpg?format=webp' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "webp", quality: 80 }' },
      { at: 15, level: 'info', message: 'Cache miss — fetching assets.storefront.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, waiting on response headers' },
      { at: 1061, level: 'warn', message: 'Origin silent for 1000ms — read budget exhausted' },
      { at: 1216, level: 'error', message: 'ConnectionTimeout: read timed out after 1000ms' },
      { at: 1240, level: 'error', message: 'Invocation failed · 502' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-optimizer',
        kind: 'function',
        depth: 0,
        start: 0,
        duration: 1240,
        status: 'error'
      },
      { id: 'parse', name: 'parse-request', kind: 'compute', depth: 1, start: 4, duration: 11 },
      {
        id: 'origin',
        name: 'fetch-origin',
        kind: 'network',
        depth: 1,
        start: 15,
        duration: 1201,
        status: 'error'
      },
      { id: 'dns', name: 'dns-lookup', kind: 'network', depth: 2, start: 15, duration: 12 },
      { id: 'tls', name: 'tls-handshake', kind: 'security', depth: 2, start: 27, duration: 34 },
      {
        id: 'response',
        name: 'origin-response',
        kind: 'network',
        depth: 2,
        start: 61,
        duration: 1155,
        status: 'error',
        message: 'Read timed out after 1000 ms.'
      }
    ]
  },
  {
    id: 'inv_01KC7XSD1F',
    status: 'Running',
    startedAt: minutesAgo(0),
    duration: 168,
    region: 'GRU · São Paulo',
    trigger: 'GET /img/product-88.jpg?format=avif',
    outcome: 'Still running — the origin has not answered yet.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started · GET /img/product-88.jpg?format=avif' },
      { at: 3, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 13, level: 'info', message: 'Cache miss — fetching assets.storefront.com' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-optimizer',
        kind: 'function',
        depth: 0,
        start: 0,
        duration: 168,
        status: 'running'
      },
      { id: 'parse', name: 'parse-request', kind: 'compute', depth: 1, start: 3, duration: 10 },
      {
        id: 'origin',
        name: 'fetch-origin',
        kind: 'network',
        depth: 1,
        start: 13,
        duration: 155,
        status: 'running'
      }
    ]
  }
]

/** The function every seeded run belongs to — the Functions library row it instances. */
export const RUN_FUNCTION = {
  id: '4021885',
  name: 'image-optimizer',
  runtime: 'JavaScript',
  icon: 'ai ai-edge-functions'
}

/**
 * The chain the request travelled, narrowed to what this invocation touched and
 * captioned with the time spent in each hop. `spanId` binds a node to the span that
 * measured it, so selecting a node and selecting a waterfall row are one selection.
 *
 * @param {object} run An entry of `functionRuns`.
 * @returns {object[]} Nodes for `FlowCard`, in travel order.
 */
export const runPath = (run) => {
  const span = (id) => run.spans.find((entry) => entry.id === id)
  const ms = (id) => (span(id) ? `${span(id).duration} ms` : '—')
  const failed = run.status === 'Failed'

  return [
    {
      key: 'workload',
      eyebrow: 'Workload',
      icon: 'ai ai-domains',
      title: 'storefront-prod',
      label: 'Live',
      severity: 'success',
      fields: [
        { label: 'Address', value: 'storefront-prod.azion.app' },
        { label: 'Edge location', value: run.region }
      ]
    },
    {
      key: 'application',
      eyebrow: 'Application',
      icon: 'ai ai-edge-application',
      title: 'storefront',
      label: 'Active',
      severity: 'success',
      fields: [
        { label: 'Matched rule', value: 'Optimize images' },
        { label: 'Phase', value: 'Request' }
      ]
    },
    {
      key: 'function',
      eyebrow: 'Function',
      icon: RUN_FUNCTION.icon,
      title: RUN_FUNCTION.name,
      label: failed ? 'Failed' : 'Active',
      severity: failed ? 'danger' : 'success',
      spanId: 'root',
      fields: [
        { label: 'Runtime', value: RUN_FUNCTION.runtime },
        { label: 'Time in function', value: ms('root') }
      ]
    },
    {
      key: 'connector',
      eyebrow: 'Connector',
      icon: 'ai ai-edge-connectors',
      title: 'origin-assets',
      label: failed ? 'Timed out' : 'Answered',
      severity: failed ? 'danger' : 'success',
      spanId: 'origin',
      terminal: true,
      fields: [
        { label: 'Origin', value: 'assets.storefront.com' },
        { label: 'Time at origin', value: ms('origin') }
      ]
    }
  ]
}

/** Every seeded invocation, newest first — what the run picker offers. */
export const functionRuns = RUNS

/**
 * One invocation by id, falling back to the newest.
 *
 * @param {string} id
 * @returns {object}
 */
export const runById = (id) => RUNS.find((run) => run.id === id) ?? RUNS[0]

/**
 * A duration in milliseconds, as a person reads it — `412 ms`, `1.24 s`.
 *
 * @param {number} ms
 * @returns {string}
 */
export const formatDuration = (ms) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`

/** The last time the seeded function shipped, for the summary's caption. */
export const RUN_FUNCTION_MODIFIED = daysAgo(11)
