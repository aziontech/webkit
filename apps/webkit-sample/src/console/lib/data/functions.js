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
//
// ── ONE LIBRARY, EVERY SURFACE THAT BINDS A FUNCTION ──
//
// The seed is not the whole story: this module is also the STORE. The module list
// creates and deletes functions, and an application's Functions Instances tab binds
// one — including creating a new one from inside its own create drawer. All three
// read and write the same `functions` list, because the alternative (a page-local
// copy per surface) is a console where a function created in the instance drawer
// does not exist in the Functions module, and a function deleted in the module is
// still offered by the drawer's selector.
//
// The contract is the one ./deployment-strategies.js already follows: the seed is a
// fixture (deletions are session-local), what the operator authored is persisted in
// sessionStorage so it survives a reload, and a new tab starts from the clean seed.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'
import { computed, ref } from 'vue'

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

/** The seeded functions, in list order — the request body of each, before decoration. */
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
]

/**
 * The stored shape of a function: the request body plus what a list renders of it.
 *
 * ONE decorator, used by the seed AND by what the console creates, so a function
 * authored in this session cannot read differently from one that shipped with the
 * sample — same runtime label, same author block, same date formatting.
 */
const decorate = (fn, index = 0) => {
  const person = authorAt(index)
  const runtime = RUNTIMES[fn.runtimeApi] ?? RUNTIMES.azion_js
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
}

/** The seeded functions, decorated — the catalog the sample boots with. */
export const FUNCTIONS = SEED.map(decorate)

// ── THE STORE ────────────────────────────────────────────────────────────────
//
// A ref, not a constant: the module list deletes rows, and a deletion has to be
// gone from the instance drawer's selector too — one store, or that selector would
// keep offering a function the list says no longer exists.
const seeded = ref([...FUNCTIONS])

// Session-scoped persistence, the same contract ./deployment-strategies.js and
// ./provisioning.js follow: a function the operator wrote has to survive a reload,
// and a new tab starts from the clean catalog. `modifiedAt` is revived by hand —
// JSON has no date type and the Last Modified filter compares a Date.
const STORAGE_KEY = 'webkit-sample:functions'

const loadAuthored = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map((fn) => ({
      ...fn,
      modifiedAt: fn.modifiedAt ? new Date(fn.modifiedAt) : null
    }))
  } catch {
    return []
  }
}

// Authored first (newest on top), then the seed — a function the operator just wrote
// is the one they are looking for.
const authored = ref(loadAuthored())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(authored.value))
  } catch {
    // A full or unavailable sessionStorage must not break the create flow.
  }
}

/** Every function the workspace holds: what this session authored, then the seed. */
export const functions = computed(() => [...authored.value, ...seeded.value])

/** A function by id, or `undefined`. Reads the live library, not just the seed. */
export const functionById = (id) => functions.value.find((fn) => fn.id === String(id))

/** The seeded function at `index`, wrapping round. */
export const functionAt = (index) => FUNCTIONS[index % FUNCTIONS.length]

/**
 * Options for a function Select, narrowed to ONE execution environment.
 *
 * The narrowing is the API's, not a convenience: `execution_environment` decides
 * which request object the code receives, so a firewall function cannot be
 * instanced on an application and must not be offered there.
 *
 * @param {string} environment `application` or `firewall`.
 * @returns {Array<{value: string, label: string}>}
 */
export const functionOptionsFor = (environment) =>
  functions.value
    .filter((fn) => fn.executionEnvironment === environment)
    .map((fn) => ({ value: fn.id, label: fn.name }))

/**
 * Write a function — what the create page and the instance drawer's quick-add both do.
 *
 * A new function has never been instanced, so it lands as **Draft**: the status is
 * derived from the API's `active` flag and the instance count, exactly as the seed
 * documents it, rather than being asked for as a third value.
 *
 * @param {object} input
 * @param {string} input.name The function's name (`name` in the request body).
 * @param {string} [input.runtimeApi] `azion_js` or `azion_lua` (`runtime`).
 * @param {string} [input.executionEnvironment] `application` or `firewall`.
 * @param {string} [input.code] The function's source.
 * @param {object} [input.args] `default_args` — what an instance of it starts from.
 * @param {boolean} [input.active] Whether the function may run.
 * @returns {object} The stored function.
 */
export function addFunction({
  name,
  runtimeApi = 'azion_js',
  executionEnvironment = 'application',
  code = '',
  args = {},
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
    args: args ?? {}
  })
  authored.value.unshift(fn)
  persist()
  return fn
}

/**
 * Drop a function from the library.
 *
 * @param {string} id
 * @returns {boolean} Whether a function was removed.
 */
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
  // Seeded deletions are session-local (the seed is a fixture, not a record), which
  // is what the list page's own copy of the array did before this store existed.
  seeded.value.splice(seededIndex, 1)
  return true
}

/**
 * Count an instance of a function up or down — the other half of the relationship an
 * application's Functions Instances tab creates. The list's Instances column is that
 * count, so instantiating a function has to be visible in the module that owns it.
 *
 * Being instanced is also what takes a function out of Draft: the seed's own rule
 * ("a function is Draft until it has ever been instanced"), applied rather than
 * merely written down.
 *
 * @param {string} id
 * @param {number} [delta]
 * @returns {object|undefined} The function, or `undefined` when the id is unknown.
 */
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
