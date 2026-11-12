import type { TraceSpan } from '../../../components/code/trace/trace.vue'
import type { TagSeverity } from '../../../components/content/tag/tag.vue'

/** A document of the function invocation the scene draws. */
export type ConsoleTraceSceneTab = 'trace' | 'logs' | 'path'

export type ConsoleTraceStep = {
  value: ConsoleTraceSceneTab
  label: string
  title: string
}

export type ConsoleTraceLog = {
  at: number
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
}

export type ConsoleTracePathNode = {
  key: string
  eyebrow: string
  icon: string
  title: string
  label: string
  severity: TagSeverity
  terminal?: boolean
  fields: { label: string; value: string }[]
}

export const CONSOLE_TRACE_STEPS: ConsoleTraceStep[] = [
  { value: 'trace', label: 'Trace', title: 'Every span, on one clock' },
  { value: 'logs', label: 'Logs', title: 'The lines it printed' },
  { value: 'path', label: 'Request path', title: 'Where the request went' }
]

export const CONSOLE_TRACE_FUNCTION = {
  name: 'image-optimizer',
  icon: 'ai ai-edge-functions',
  duration: 412
}

export const CONSOLE_TRACE_SPANS: TraceSpan[] = [
  { id: 'root', name: 'image-optimizer', icon: 'ai ai-edge-functions', start: 0, duration: 412 },
  {
    id: 'parse',
    parentId: 'root',
    name: 'parse-request',
    icon: 'pi pi-code',
    start: 4,
    duration: 12
  },
  {
    id: 'origin',
    parentId: 'root',
    name: 'fetch-origin',
    icon: 'pi pi-send',
    start: 16,
    duration: 186
  },
  {
    id: 'dns',
    parentId: 'origin',
    name: 'dns-lookup',
    icon: 'pi pi-send',
    start: 16,
    duration: 14
  },
  {
    id: 'tls',
    parentId: 'origin',
    name: 'tls-handshake',
    icon: 'pi pi-lock',
    start: 30,
    duration: 31
  },
  {
    id: 'response',
    parentId: 'origin',
    name: 'origin-response',
    icon: 'pi pi-send',
    start: 61,
    duration: 141
  },
  { id: 'decode', parentId: 'root', name: 'decode', icon: 'pi pi-code', start: 202, duration: 54 },
  {
    id: 'transform',
    parentId: 'root',
    name: 'transform',
    icon: 'pi pi-code',
    start: 256,
    duration: 92
  },
  {
    id: 'cache',
    parentId: 'root',
    name: 'put-cache',
    icon: 'ai ai-edge-storage',
    start: 348,
    duration: 38
  }
]

export const CONSOLE_TRACE_LOGS: ConsoleTraceLog[] = [
  { at: 0, level: 'info', message: 'Invocation started · GET /img/hero-4k.jpg?format=avif' },
  { at: 4, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
  { at: 16, level: 'info', message: 'Cache miss, fetching assets.storefront.com' },
  { at: 61, level: 'debug', message: 'TLS 1.3 established, cipher TLS_AES_128_GCM_SHA256' },
  { at: 202, level: 'info', message: 'Origin answered 200 · image/jpeg · 2.4 MB' },
  { at: 256, level: 'debug', message: 'Decoded 3840x2160, re-encoding to avif q80' },
  { at: 348, level: 'info', message: 'Encoded 412 KB · 83% smaller' },
  { at: 386, level: 'info', message: 'Cached for 86400s' },
  { at: 412, level: 'info', message: 'Invocation completed · 200' }
]

export const CONSOLE_TRACE_PATH: ConsoleTracePathNode[] = [
  {
    key: 'workload',
    eyebrow: 'Workload',
    icon: 'ai ai-domains',
    title: 'storefront-prod',
    label: 'Live',
    severity: 'success',
    fields: [
      { label: 'Address', value: 'storefront-prod.azion.app' },
      { label: 'Edge location', value: 'GRU · São Paulo' }
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
    icon: 'ai ai-edge-functions',
    title: 'image-optimizer',
    label: 'Active',
    severity: 'success',
    fields: [
      { label: 'Runtime', value: 'JavaScript' },
      { label: 'Time in function', value: '412 ms' }
    ]
  },
  {
    key: 'connector',
    eyebrow: 'Connector',
    icon: 'ai ai-edge-connectors',
    title: 'origin-assets',
    label: 'Answered',
    severity: 'success',
    terminal: true,
    fields: [
      { label: 'Origin', value: 'assets.storefront.com' },
      { label: 'Time at origin', value: '186 ms' }
    ]
  }
]
