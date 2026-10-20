import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'
import { computed, ref } from 'vue'

export const RUNTIMES = {
  azion_js: {
    api: 'azion_js',
    label: 'JavaScript',
    language: 'javascript',
    icon: 'ai-cor ai-js'
  },
  azion_lua: { api: 'azion_lua', label: 'Lua', language: 'lua', icon: 'pi pi-code' }
}

export const runtimeOf = (fn) => RUNTIMES[fn?.runtimeApi] ?? RUNTIMES.azion_js

const JS_AUTH = `const SECRET = 'demo-only'

async function handleRequest(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const response = await fetch(request)
  response.headers.set('x-authenticated', 'true')
  return response
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`

const JS_IMAGE = `const ALLOWED = ['webp', 'avif']

async function handleRequest(request, args) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') ?? args.defaultFormat

  if (!ALLOWED.includes(format)) return fetch(request)

  url.searchParams.set('format', format)
  url.searchParams.set('quality', String(args.quality))
  return fetch(url.toString())
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const JS_GEO = `async function handleRequest(request, args) {
  const country = request.headers.get('x-geo-country') ?? args.defaultCountry
  const url = new URL(request.url)

  url.pathname = '/' + country.toLowerCase() + url.pathname
  return fetch(url.toString())
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const JS_SPLIT = `function bucket(request, buckets) {
  const seed = request.headers.get('x-request-id') ?? ''
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) % 100
  return hash < buckets.a ? 'a' : 'b'
}

async function handleRequest(request, args) {
  const variant = bucket(request, args.buckets)
  const response = await fetch(request)
  response.headers.set('x-variant', variant)
  return response
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const LUA_SHIPPER = `local http = require('http')

function ship(entry, endpoint)
  return http.post(endpoint, { body = entry, timeout = 2000 })
end

function handle_request(request, args)
  local entry = request:log_entry()
  ship(entry, args.endpoint)
  return request:next()
end
`

const JS_SIGNED_URL = `async function handleRequest(request, args) {
  const url = new URL(request.url)
  const expires = Number(url.searchParams.get('expires') ?? 0)

  if (Date.now() / 1000 > expires) {
    return new Response('Link expired', { status: 403 })
  }
  if (url.searchParams.get('signature') !== args.signature) {
    return new Response('Bad signature', { status: 403 })
  }
  return fetch(request)
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const LUA_REWRITER = `function rewrite(body, replacements)
  for from, to in pairs(replacements) do
    body = body:gsub(from, to)
  end
  return body
end

function handle_request(request, args)
  local response = request:next()
  response.body = rewrite(response.body, args.replacements)
  return response
end
`

const JS_BOT_SCORE = `async function handleRequest(request, args) {
  const score = Number(request.headers.get('x-bot-score') ?? 0)
  const response = await fetch(request)

  response.headers.set('x-bot-tier', score >= args.blockAbove ? 'block' : 'allow')
  return response
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const SEED = [
  {
    id: '4021884',
    name: 'auth-handler',
    runtimeApi: 'azion_js',
    executionEnvironment: 'application',
    instances: 4,
    status: 'Active',
    modifiedAt: daysAgo(3),
    code: JS_AUTH,
    args: {}
  },
  {
    id: '4021885',
    name: 'image-optimizer',
    runtimeApi: 'azion_js',
    executionEnvironment: 'application',
    instances: 2,
    status: 'Active',
    modifiedAt: daysAgo(11),
    code: JS_IMAGE,
    args: { defaultFormat: 'webp', quality: 80 },
    form: {
      type: 'object',
      properties: {
        defaultFormat: {
          type: 'string',
          title: 'Default format',
          description:
            'Used when the request does not ask for a format. Only these are rewritten — anything else passes through untouched.',
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
  },
  {
    id: '4021886',
    name: 'geo-router',
    runtimeApi: 'azion_js',
    executionEnvironment: 'application',
    instances: 6,
    status: 'Active',
    modifiedAt: daysAgo(21),
    code: JS_GEO,
    args: { defaultCountry: 'US' },
    form: {
      type: 'object',
      properties: {
        defaultCountry: {
          type: 'string',
          title: 'Default country',
          description:
            'The two-letter country code used when the request carries no geo header. It becomes the first path segment.',
          minLength: 2,
          maxLength: 2,
          pattern: '^[A-Z]{2}$',
          default: 'US'
        }
      },
      required: ['defaultCountry']
    }
  },
  {
    id: '4021887',
    name: 'ab-test-splitter',
    runtimeApi: 'azion_js',
    executionEnvironment: 'application',
    instances: 1,
    status: 'Draft',
    modifiedAt: daysAgo(2),
    code: JS_SPLIT,
    args: { buckets: { a: 50, b: 50 } }
  },
  {
    id: '4021888',
    name: 'waf-log-shipper',
    runtimeApi: 'azion_lua',
    executionEnvironment: 'firewall',
    instances: 3,
    status: 'Active',
    modifiedAt: daysAgo(44),
    code: LUA_SHIPPER,
    args: { endpoint: 'https://logs.example.com/ingest' }
  },
  {
    id: '4021889',
    name: 'signed-url-guard',
    runtimeApi: 'azion_js',
    executionEnvironment: 'firewall',
    instances: 0,
    status: 'Inactive',
    modifiedAt: daysAgo(96),
    code: JS_SIGNED_URL,
    args: { signature: '' }
  },
  {
    id: '4021890',
    name: 'html-rewriter',
    runtimeApi: 'azion_lua',
    executionEnvironment: 'application',
    instances: 2,
    status: 'Active',
    modifiedAt: daysAgo(7),
    code: LUA_REWRITER,
    args: { replacements: { 'http://': 'https://' } }
  },
  {
    id: '4021891',
    name: 'bot-score-tagger',
    runtimeApi: 'azion_js',
    executionEnvironment: 'firewall',
    instances: 5,
    status: 'Active',
    modifiedAt: daysAgo(15),
    code: JS_BOT_SCORE,
    args: { blockAbove: 70 }
  }
]

const decorate = (fn, index = 0) => {
  const person = authorAt(index)
  const runtime = RUNTIMES[fn.runtimeApi] ?? RUNTIMES.azion_js
  return {
    ...fn,
    runtime: runtime.label,
    language: runtime.language,
    runtimeIcon: runtime.icon,
    active: fn.status === 'Active',
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(fn.modifiedAt)
  }
}

export const FUNCTIONS = SEED.map(decorate)

const seeded = ref([...FUNCTIONS])

const STORAGE_KEY = 'webkit-sample:functions'

const loadAuthored = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map((fn) => ({
      ...fn,
      modifiedAt: fn.modifiedAt ? new Date(fn.modifiedAt) : null,
      runtimeIcon: runtimeOf(fn).icon
    }))
  } catch {
    return []
  }
}

const authored = ref(loadAuthored())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(authored.value))
  } catch {}
}

export const functions = computed(() => [...authored.value, ...seeded.value])

export const functionById = (id) => functions.value.find((fn) => fn.id === String(id))

export const functionAt = (index) => FUNCTIONS[index % FUNCTIONS.length]

export const functionOptionsFor = (environment) =>
  functions.value
    .filter((fn) => fn.executionEnvironment === environment)
    .map((fn) => ({ value: fn.id, label: fn.name }))

export function addFunction({
  name,
  runtimeApi = 'azion_js',
  executionEnvironment = 'application',
  code = '',
  args = {},
  form = undefined,
  active = true
} = {}) {
  const modifiedAt = new Date()
  const fn = decorate({
    id: `fn-${modifiedAt.getTime()}`,
    name: String(name || '').trim() || 'Untitled function',
    runtimeApi,
    executionEnvironment,
    instances: 0,
    status: active ? 'Draft' : 'Inactive',
    modifiedAt,
    code,
    args: args ?? {},
    ...(form ? { form } : {})
  })
  authored.value.unshift(fn)
  persist()
  return fn
}

export function removeFunction(id) {
  const key = String(id)

  const authoredIndex = authored.value.findIndex((fn) => fn.id === key)
  if (authoredIndex !== -1) {
    authored.value.splice(authoredIndex, 1)
    persist()
    return true
  }

  const seededIndex = seeded.value.findIndex((fn) => fn.id === key)
  if (seededIndex === -1) return false
  seeded.value.splice(seededIndex, 1)
  return true
}

export function countInstance(id, delta = 1) {
  const fn = functionById(id)
  if (!fn) return undefined

  fn.instances = Math.max(0, (fn.instances ?? 0) + delta)
  if (fn.instances > 0 && fn.status === 'Draft') {
    fn.status = 'Active'
    fn.active = true
  }
  persist()
  return fn
}
