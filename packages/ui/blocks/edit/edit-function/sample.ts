import type { LogViewerLine } from '@aziontech/webkit/log-viewer-root'
import type { TraceSpan } from '@aziontech/webkit/trace'

import type { FunctionEditorField, FunctionEditorService } from './edit-function.vue'

const sampleCode = `const ALLOWED = ['webp', 'avif']

export async function handleRequest(request, args = {}) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') ?? args.defaultFormat

  if (!ALLOWED.includes(format)) return fetch(request)

  url.searchParams.set('format', format)
  url.searchParams.set('quality', String(args.quality))
  return fetch(url.toString())
}
`

const formSchema = {
  type: 'object',
  properties: {
    defaultFormat: {
      type: 'string',
      title: 'Default format',
      description:
        'Used when the request does not ask for a format. Only these are rewritten. Anything else passes through untouched.',
      enum: ['webp', 'avif'],
      default: 'webp'
    },
    quality: {
      type: 'integer',
      title: 'Quality',
      description: 'Compression quality applied to every rewritten image.',
      minimum: 1,
      maximum: 100,
      default: 80
    }
  },
  required: ['defaultFormat']
}

export const sampleService: FunctionEditorService = {
  name: 'image-optimizer',
  executionEnvironment: 'request',
  active: true,
  code: sampleCode,
  schema: JSON.stringify(formSchema, null, 2)
}

export const sampleFields: FunctionEditorField[] = [
  {
    id: 'field-1',
    key: 'defaultFormat',
    type: 'select',
    title: 'Default format',
    description:
      'Used when the request does not ask for a format. Only these are rewritten. Anything else passes through untouched.',
    required: true,
    default: 'webp',
    minLength: '',
    maxLength: '',
    pattern: '',
    minimum: '',
    maximum: '',
    options: ['webp', 'avif'],
    itemType: 'string'
  },
  {
    id: 'field-2',
    key: 'quality',
    type: 'integer',
    title: 'Quality',
    description: 'Compression quality applied to every rewritten image.',
    required: false,
    default: '80',
    minLength: '',
    maxLength: '',
    pattern: '',
    minimum: '1',
    maximum: '100',
    options: [],
    itemType: 'string'
  }
]

const authCode = `const SECRET = 'demo-only'

export async function handleRequest(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const response = await fetch(request)
  response.headers.set('x-authenticated', 'true')
  return response
}
`

export const sampleServiceWithoutArguments: FunctionEditorService = {
  name: 'auth-handler',
  executionEnvironment: 'request',
  active: true,
  code: authCode,
  schema: JSON.stringify({ type: 'object', properties: {} }, null, 2)
}

export const sampleRunRequest = 'GET /img/hero.jpg?format=avif'
export const sampleRunSpans: TraceSpan[] = [
  { id: 'root', name: 'image-optimizer', service: 'Function', start: 0, duration: 412 },
  {
    id: 'parse',
    parentId: 'root',
    name: 'parse-request',
    service: 'Compute',
    start: 4,
    duration: 12,
    attributes: { 'args.defaultFormat': 'webp', 'args.quality': 80 }
  },
  {
    id: 'origin',
    parentId: 'root',
    name: 'fetch-origin',
    service: 'Network',
    start: 16,
    duration: 186,
    attributes: {
      'http.method': 'GET',
      'http.url': 'https://assets.example.com/img/hero.jpg',
      'http.status_code': 200
    }
  },
  {
    id: 'dns',
    parentId: 'origin',
    name: 'dns-lookup',
    service: 'Network',
    start: 16,
    duration: 14
  },
  {
    id: 'tls',
    parentId: 'origin',
    name: 'tls-handshake',
    service: 'Security',
    start: 30,
    duration: 31
  },
  {
    id: 'response',
    parentId: 'origin',
    name: 'origin-response',
    service: 'Network',
    start: 61,
    duration: 141
  },
  {
    id: 'decode',
    parentId: 'root',
    name: 'decode',
    service: 'Compute',
    start: 202,
    duration: 54
  },
  {
    id: 'encode',
    parentId: 'root',
    name: 'encode',
    service: 'Compute',
    start: 256,
    duration: 92,
    attributes: { 'image.format': 'avif', 'image.bytes': 421888 }
  },
  {
    id: 'cache',
    parentId: 'root',
    name: 'put-cache',
    service: 'Storage',
    start: 348,
    duration: 38
  }
]
export const sampleRunLines: LogViewerLine[] = [
  { id: 'l1', time: '0 ms', type: 'text', message: 'Run started: ' + sampleRunRequest },
  {
    id: 'l2',
    time: '4 ms',
    type: 'text',
    message: 'args { defaultFormat:"webp", quality: 80 }'
  },
  { id: 'l3', time: '16 ms', type: 'text', message: 'Cache miss, fetching assets.example.com' },
  { id: 'l4', time: '202 ms', type: 'text', message: 'Origin answered 200, image/jpeg, 2.4 MB' },
  { id: 'l5', time: '348 ms', type: 'text', message: 'Encoded 412 KB, 83% smaller' },
  { id: 'l6', time: '412 ms', type: 'success', message: 'Run finished with 200' }
]
export const sampleRunDetails = [
  { label: 'Started', value: 'Nov 10, 2026, 14:28' },
  { label: 'Duration', value: '412 ms' },
  { label: 'Data center', value: 'US East (Washington)' },
  { label: 'Memory', value: '38 MB of 128 MB' }
]

export const sampleRunId = 'run_7f21c9'
