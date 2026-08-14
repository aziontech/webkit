// The functions the sample is seeded with — the Build → Functions module.
//
// A FUNCTION is the code itself, written once and instanced per application (an
// application's Functions Instances tab binds a function with its own arguments).
// So this list is the library, not the bindings: a row is a function, its runtime
// and how many instances currently run it.
//
// `modifiedAt` is the real instant — the Last Modified filter compares it, the cell
// renders it relative, and `lastModified` (the sortable display string) is derived
// from it by one formatter instead of being hand-written per row.
//
// EVERY ROW CARRIES THE WHOLE RECORD, not just what the list column needs: the code,
// the default arguments, the execution environment and the active flag — the six
// properties `POST v4/workspace/functions` takes (see ./create-resources.js). That is
// what lets the detail page (../components/FunctionDetail.vue) open a seeded function
// and edit it, instead of showing a form with nothing in it.
import { daysAgo, formatListDate } from './dates'
import { authorAt, emailOf } from './people'

/**
 * The runtimes the endpoint accepts — `runtime: enum(azion_js, azion_lua)` — with how
 * each reads to a person and which grammar the editor highlights it in. One map, so the
 * list's Runtime column, its filter, the create page's locked field and the detail
 * page's editor all say the same thing.
 */
export const RUNTIMES = {
  azion_js: { api: 'azion_js', label: 'JavaScript', language: 'javascript' },
  azion_lua: { api: 'azion_lua', label: 'Lua', language: 'lua' }
}

/** The runtime a function runs on, from its API value. Defaults to JavaScript. */
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

/** The seeded functions, in list order. */
export const FUNCTIONS = [
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
    args: { defaultFormat: 'webp', quality: 80 }
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
    args: { defaultCountry: 'US' }
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
].map((fn, index) => {
  const person = authorAt(index)
  const runtime = RUNTIMES[fn.runtimeApi]
  return {
    ...fn,
    // The display runtime and its grammar are DERIVED from the API value, never typed
    // twice: the list column, the filter chip and the editor cannot disagree.
    runtime: runtime.label,
    language: runtime.language,
    // `active` is the API's boolean; `status` is the three-way label the list renders
    // (a function is Draft until it has ever been instanced).
    active: fn.status === 'Active',
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(fn.modifiedAt)
  }
})

/** A seeded function by id, or `undefined`. */
export const functionById = (id) => FUNCTIONS.find((fn) => fn.id === String(id))

/** The function at `index`, wrapping round. */
export const functionAt = (index) => FUNCTIONS[index % FUNCTIONS.length]
