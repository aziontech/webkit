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
