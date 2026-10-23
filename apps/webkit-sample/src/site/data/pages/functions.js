import { markRaw } from 'vue'

import FunctionsStartScene from '../../ui/FunctionsStartScene.vue'
import { cliBand } from '../cli-band.js'
import { AGENT_PROMPT, START_TABS } from '../functions-start.js'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const IMPORT = 'import'

const FRAMEWORK_MARKS = [
  'nextjs',
  'react',
  'vue',
  'nuxt',
  'astro',
  'angular',
  'hono',
  'qwik',
  'preact',
  'gatsby',
  'docusaurus',
  'vitepress',
  'hugo',
  'eleventy',
  'hexo',
  'jekyll'
]

const BENEFITS = [
  {
    icon: 'ai ai-content-delivery',
    title: 'Close to every user',
    description:
      'Functions run across 100+ data centers, so the code executes next to the person making the request, with no region to pick.'
  },
  {
    icon: 'pi pi-bolt',
    title: 'No cold starts',
    description:
      'Each request starts in a V8 isolate, so there is nothing to pre-warm and no first-request penalty to design around.'
  },
  {
    icon: 'pi pi-microchip',
    title: 'Room for real work',
    description:
      'Every isolate gets 512 MB of memory, enough for APIs, authentication and model calls in the same handler.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Free to start',
    description:
      'Hobby includes 3M function requests and 8 hours of compute time a month, so a first function costs nothing to run.'
  },
  {
    icon: 'pi pi-code',
    title: 'The code you already have',
    description:
      'Web standards and 68 Node.js modules, so most existing handlers move over with small changes.'
  },
  {
    icon: 'pi pi-database',
    title: 'One platform, no keys to wire',
    description:
      'Read from KV Store, query SQL Database and call models from the same function, without credentials to manage.'
  }
]

const KV_SAMPLE = `export default {
  async fetch(request) {
    const kv = await Azion.KV.open('sessions')
    const id = new URL(request.url).searchParams.get('id')

    const session = await kv.get(id, 'json')
    if (!session) return new Response(null, { status: 404 })

    await kv.put(id, session, { expirationTtl: 3600 })
    return Response.json(session)
  }
}`

const SQL_SAMPLE = `export default {
  async fetch(request) {
    const db = await Azion.Sql.Database.open('catalog')
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))

    const rows = await db.query(
      'select name, price from products where id = ?',
      [id]
    )
    const row = rows.next()
    if (!row) return new Response(null, { status: 404 })

    return Response.json({ name: row.getString(0) })
  }
}`

const STORAGE_SAMPLE = `${IMPORT} { createObject } from 'azion/storage'

export default {
  async fetch(request) {
    const file = (await request.formData()).get('file')
    const { data, error } = await createObject({
      bucket: 'uploads',
      key: file.name,
      content: await file.arrayBuffer()
    })
    if (error) return Response.json(error, { status: 502 })
    return Response.json({ key: data.key }, { status: 201 })
  }
}`

const AI_SAMPLE = `export default {
  async fetch(request) {
    const { question } = await request.json()
    const model = 'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8'

    const answer = await Azion.AI.run(model, {
      messages: [{ role: 'user', content: question }]
    })

    const text = answer?.choices?.[0]?.message?.content
    return Response.json({ answer: text })
  }
}`

const FIREWALL_SAMPLE = `export default {
  firewall: async (request, env, ctx) => {
    const token = request.headers.get('authorization')

    // Refused before the request reaches an application
    if (!token?.startsWith('Bearer ')) ctx.deny()
  }
}`

const INTEGRATIONS = [
  {
    icon: 'ai ai-edge-kv',
    title: 'KV Store',
    description:
      'Open a namespace with Azion.KV and read or write sessions, flags and counters, with an optional TTL on every key.'
  },
  {
    icon: 'ai ai-edge-sql',
    title: 'SQL Database',
    description:
      'Query a distributed SQL database from the handler with Azion.Sql, using positional or named parameters.'
  },
  {
    icon: 'ai ai-edge-storage',
    title: 'Object Storage',
    description:
      'Write uploads to a bucket and serve them back from the same function, with the azion/storage library.'
  },
  {
    icon: 'ai ai-edge-ai',
    title: 'AI Inference',
    description:
      'Call a model with Azion.AI.run and return its answer in the same response, with no API key to manage.'
  },
  {
    icon: 'ai ai-edge-firewall',
    title: 'Firewall',
    description:
      'Run the same code inside Firewall and refuse a request with ctx.deny() before it reaches an application.'
  }
]

const sample = (value, label, code) => ({
  label,
  value,
  language: 'javascript',
  code,
  fileName: `${value}.js`,
  fileIcon: 'ai ai-edge-functions'
})

const INTEGRATION_SAMPLES = [
  sample('kv-store', 'KV Store', KV_SAMPLE),
  sample('sql-database', 'SQL Database', SQL_SAMPLE),
  sample('object-storage', 'Object Storage', STORAGE_SAMPLE),
  sample('ai-inference', 'AI Inference', AI_SAMPLE),
  sample('firewall', 'Firewall', FIREWALL_SAMPLE)
]

const USE_CASES = [
  {
    icon: 'ai ai-azion-api',
    title: 'Ship low-latency APIs',
    description:
      'Answer API requests in the request flow, next to the user, with no cold starts and no servers to scale for traffic peaks.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-lock',
    title: 'Authenticate before the origin',
    description:
      'Validate tokens and sessions in a function and refuse a request before it reaches your application or your origin.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Connect services in one handler',
    description:
      'Read from KV Store, query SQL Database and write to Object Storage from the same function, with no credentials to wire.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-edge-ai',
    title: 'Add AI to the request',
    description:
      'Call a model with AI Inference and return its answer in the same response, close to the user who asked.',
    href: PRODUCT_DOCS
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What are Functions?',
    answer:
      'Azion Functions runs JavaScript and TypeScript in the request flow of an application or a firewall, across 100+ data centers, with no cold starts. A Rules Engine rule calls the function, and it answers with a Response. There is no server to provision or scale.'
  },
  {
    value: 'languages',
    question: 'Which languages and frameworks are supported?',
    answer:
      'JavaScript and TypeScript, plus WebAssembly through the WebAssembly API. The runtime follows web standards such as fetch, Streams and Web Crypto, and can import 68 Node.js modules. azion init ships 25 presets, including Next.js, Nuxt, React, Vue, Astro, Angular, Svelte, Qwik and Hono.'
  },
  {
    value: 'cold-starts',
    question: 'Are there cold starts?',
    answer:
      'No. Each function runs in a V8 isolate, so the first request performs like every request after it. That matters most for user-facing APIs, authentication and inference.'
  },
  {
    value: 'limits',
    question: 'What are the execution limits?',
    answer:
      'Each invocation gets 2 seconds of CPU time and up to 5 minutes of wall-clock time, so waiting on I/O does not count against the CPU budget. An isolate has 512 MB of memory, and code can be up to 6 MB from the Console or 20 MB through the API.'
  },
  {
    value: 'application-or-firewall',
    question: 'Should a function run on an application or a firewall?',
    answer:
      'On an application, a function runs in the request or response phase, after routing, to rewrite requests or build responses. On a firewall, it runs before the request reaches an application, and it can refuse the request with ctx.deny().'
  },
  {
    value: 'data-access',
    question: 'Can Functions access databases and storage?',
    answer:
      'Yes, through runtime globals that need no keys: Azion.KV for KV Store, Azion.Sql for SQL Database and Azion.AI for AI Inference, plus the azion/storage library for Object Storage. A SQL Database connection opened from a function is read-only; writes go through the Azion API.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy Functions?',
    answer:
      'From the terminal, azion init scaffolds a project, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain. In the Console, create the function, instance it on an application, and add a rule that runs it. A coding agent can do the same through the Azion MCP servers.'
  },
  {
    value: 'variables',
    question: 'How do environment variables and secrets work?',
    answer:
      'Create them with azion create variables or in the Console, and read them with Azion.env.get(). Keys that name a token, a key, a secret or auth are stored as secrets by default. A change takes effect on the next deploy.'
  },
  {
    value: 'observability',
    question: 'How do I monitor and debug Functions?',
    answer:
      'Every console.log lands in Real-Time Events, in the Functions Console tab, with its level and request id. Stream the same events out with Data Stream, or follow them live with azion logs cells --tail.'
  },
  {
    value: 'pricing',
    question: 'How are Functions priced?',
    answer:
      'By requests and compute time. Hobby is free, with 3M function requests and 8 hours of compute time a month. Pro is $25 a month, with 10M requests and 10 hours. Enterprise plans are custom.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from Cloudflare Workers?',
    answer:
      'Both run JavaScript in V8 isolates behind a fetch handler, so most handlers move with small changes. Keep the handler, swap the platform bindings for KV Store, SQL Database and Object Storage, and deploy with azion deploy.'
  }
]

const START_TILES = START_TABS.map(({ value, title, description }) => ({
  title,
  description,
  scene: { component: markRaw(FunctionsStartScene), props: { tab: value } },
  ...(value === 'agents'
    ? { copy: { label: 'Copy Prompt', text: AGENT_PROMPT } }
    : { href: PRODUCT_DOCS })
}))

export const INTEGRATION_CODE_BAND = {
  section: 'IntegrationCode',
  title: 'Integrates with the',
  emphasis: 'Azion Web Platform',
  description:
    'Read data, call models and refuse requests from the same function, with no keys to wire between products.',
  items: INTEGRATIONS,
  samples: INTEGRATION_SAMPLES,
  action: { label: 'Explore the runtime APIs', href: PRODUCT_DOCS }
}

export const FUNCTIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Functions',
    title: 'Run code globally, with no cold starts',
    description:
      'Run JavaScript and TypeScript close to users, with data and AI Inference built in.',
    actions: PRODUCT_HERO_ACTIONS,
    carouselLabel: 'Built for your framework',
    carouselMarks: FRAMEWORK_MARKS
  },
  { section: 'CapabilityGrid', items: BENEFITS },
  {
    section: 'FeatureWidgets',
    anchor: 'get-started',
    eyebrow: 'Get started',
    title: 'Start where you already work',
    description:
      'The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: START_TILES
  },
  {
    section: 'StickyScrollCode',
    eyebrow: 'Integrations',
    title: 'Integrates with the Azion Web Platform',
    description:
      'Read data, call models and refuse requests from the same function, with no keys to wire between products.',
    items: INTEGRATIONS.map((item) => ({
      ...item,
      action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true }
    })),
    samples: INTEGRATION_SAMPLES
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use Functions for',
    description:
      'Run JavaScript and TypeScript in the request flow on Azion’s distributed infrastructure. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('contabilizei') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  cliBand({
    title: 'Deploy your first function in two commands',
    description:
      'Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion.'
  }),
  PRODUCT_CLOSING
]
