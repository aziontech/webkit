import contabilizeiTile from '@aziontech/webkit/assets/contabilizei-symbol-color.png'
import { markRaw } from 'vue'

import FunctionsStartScene from '../../ui/FunctionsStartScene.vue'
import FunctionsTerminalScene from '../../ui/FunctionsTerminalScene.vue'
import { START_TABS } from '../functions-start.js'
import {
  PRODUCT_CLOSING,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'

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

const FIGURES = [
  { value: '100', suffix: '+', label: 'Data centers' },
  { value: '0', label: 'Cold starts' },
  { value: '512', suffix: 'MB', label: 'Memory per isolate' },
  { value: '3', suffix: 'M', label: 'Free requests a month' }
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

const CAPABILITIES = [
  {
    icon: 'ai ai-edge-application',
    title: 'Application or Firewall',
    description:
      'Run on the requests an application serves, or inside Firewall, where a request can still be refused.'
  },
  {
    icon: 'pi pi-arrow-right-arrow-left',
    title: 'Request and response phase',
    description:
      'Rewrite a request before it reaches the origin, or change a response before it reaches the user.'
  },
  {
    icon: 'pi pi-sliders-h',
    title: 'Arguments per instance',
    description:
      'One function, many instances. Each passes its own JSON arguments, so the code stays the same everywhere it runs.'
  },
  {
    icon: 'pi pi-lock',
    title: 'Variables and secrets',
    description:
      'Read configuration with Azion.env.get(). Keys that name a token, a key or a secret are stored as secrets.'
  },
  {
    icon: 'pi pi-globe',
    title: 'Web standards and Node.js',
    description:
      'fetch, Streams and Web Crypto in a V8 isolate, plus 68 Node.js modules for the code you already have.'
  },
  {
    icon: 'pi pi-code',
    title: 'WebAssembly',
    description:
      'Compile Rust or C to WebAssembly with the Rustwasm and Emscripten presets, and call it from the same handler.'
  }
]

const FILE_UPLOAD = `${IMPORT} type { AzionBucketObject, AzionStorageResponse } from "azion/storage";
${IMPORT} { createObject } from "azion/storage";
${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"]; // File | string

  // First check if file is a valid File object
  if (
    !file ||
    typeof file !== "object" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ message: "Invalid file" }, 400);
  }

  const { data: newObject } = (await createObject({
    bucket: "uploads",
    key: file.name,
    content: await file.arrayBuffer(),
  })) as AzionStorageResponse<AzionBucketObject>;

  return c.json({ key: newObject?.key }, 201, {
    "Content-Type": file.type,
    "Content-Disposition": \`attachment; filename="\${newObject?.key}"\`,
    "Content-Length": newObject?.size?.toString() ?? "0",
  });
});

export default app;`

const TRANSACTIONAL_EMAIL = `${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/welcome", async (c) => {
  const { email, name } = await c.req.json();

  // The API key lives in the workload's environment, never in the bundle
  const sent = await fetch("https://api.provider.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${Azion.env.get("EMAIL_API_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "Welcome aboard",
      text: \`Hi \${name}, your account is ready.\`,
    }),
  });

  if (!sent.ok) {
    return c.json({ message: "Could not send the email" }, 502);
  }

  return c.json({ queued: true }, 202);
});

export default app;`

const PLATFORM_GROUPS = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally'
      },
      { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Distribute traffic with high availability'
      },
      {
        icon: 'pi pi-image',
        title: 'Image Processor',
        description: 'Optimize and transform images'
      }
    ]
  },
  {
    label: 'AI',
    items: [
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run low-latency models'
      },
      { icon: 'ai ai-gateway', title: 'AI Gateway', description: 'Govern and route LLMs' }
    ]
  },
  {
    label: 'Data',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and deliver globally'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Distributed SQL database'
      },
      { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Key-value data store' },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Accelerate delivery and availability'
      }
    ]
  },
  {
    label: 'Security',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'Web Application Firewall',
        description: 'Smart way to block threats'
      },
      {
        icon: 'ai ai-azion-api',
        title: 'API Gateway',
        description: 'Authenticate and protect APIs'
      },
      {
        icon: 'pi pi-android',
        title: 'Bot Management',
        description: 'Stop bots, prevent abuse'
      },
      { icon: 'ai ai-edge-dns', title: 'DNS', description: 'High-performance DNS' }
    ]
  }
]

const RATE_LIMIT = `export default {
  async fetch(request) {
    const kv = await Azion.KV.open('rate-limits')
    const ip = request.headers.get('x-forwarded-for') ?? ''
    const key = \`\${ip}:\${Math.floor(Date.now() / 60000)}\`

    const count = Number((await kv.get(key)) ?? 0)
    if (count >= 100) return new Response(null, { status: 429 })

    await kv.put(key, String(count + 1), { expirationTtl: 120 })
    return fetch(request)
  }
}`

const RECIPE_FILES = [
  {
    label: 'Transactional email',
    value: 'transactional-email',
    language: 'typescript',
    code: TRANSACTIONAL_EMAIL,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  },
  {
    label: 'File upload',
    value: 'file-upload',
    language: 'typescript',
    code: FILE_UPLOAD,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  },
  {
    label: 'Rate limit',
    value: 'rate-limit',
    language: 'javascript',
    code: RATE_LIMIT,
    fileName: 'rate-limit.js',
    fileIcon: 'ai ai-edge-functions'
  }
]

const RECIPES = [
  {
    title: 'Send transactional emails',
    description:
      'Call your email provider from a function, with the API key kept in the environment and out of the bundle.'
  },
  {
    title: 'Accept file uploads',
    description:
      'Parse a multipart form, write the file to Object Storage, and answer with its key.'
  },
  {
    title: 'Rate-limit an API',
    description:
      'Count requests per client in KV Store and answer 429 before the request reaches your origin.'
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

const READ_DOCS = {
  label: 'Read the docs',
  href: PRODUCT_DOCS,
  kind: 'outlined',
  icon: 'pi pi-book'
}

export const FUNCTIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Functions',
    title: 'Run your code in every request',
    description:
      'Serverless JavaScript and TypeScript for APIs, auth and AI, running across 100+ data centers with no cold starts.',
    actions: PRODUCT_HERO_ACTIONS,
    carouselLabel: 'Built for your framework',
    carouselMarks: FRAMEWORK_MARKS
  },
  { section: 'StatsBand', items: FIGURES },
  {
    section: 'FeatureTabs',
    anchor: 'get-started',
    eyebrow: 'Get started',
    title: 'Start where you already work',
    description:
      'The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal.',
    tabs: START_TABS,
    scene: { component: markRaw(FunctionsStartScene) },
    interval: 14000,
    action: { label: 'Create your first function', href: PRODUCT_DOCS }
  },
  {
    section: 'StickyScrollCode',
    eyebrow: 'Platform',
    title: 'Integrates with the Azion Web Platform',
    description:
      'Read data, call models and refuse requests from the same function, with no keys to wire between products.',
    items: INTEGRATIONS,
    samples: INTEGRATION_SAMPLES,
    action: { label: 'Explore the runtime APIs', href: PRODUCT_DOCS }
  },
  { section: 'CapabilityGrid', items: CAPABILITIES },
  {
    section: 'CodeSplit',
    kind: 'recipes',
    title: 'From hello world to production APIs',
    description:
      'Starting points for the work a function does most: talking to APIs, storing files, and protecting origins.',
    files: RECIPE_FILES,
    defaultFile: 'transactional-email',
    copyAriaLabel: 'Copy the function sample',
    recipes: RECIPES
  },
  {
    section: 'QuoteBand',
    kind: 'highlight',
    text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
    name: 'Fabrício Santos',
    jobTitle: 'DevSecOps Manager at Contabilizei',
    logo: contabilizeiTile,
    logoAlt: 'Contabilizei'
  },
  { ...PRODUCT_DIRECTORY, groups: PLATFORM_GROUPS },
  { section: 'FaqSection', items: FAQ },
  {
    section: 'MediaSplitBand',
    eyebrow: 'Azion CLI',
    title: 'Deploy your first function in two commands',
    description:
      'Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion.',
    scene: {
      component: markRaw(FunctionsTerminalScene),
      props: { script: 'deploy', texture: false }
    },
    actions: [
      { label: 'Start free', href: '/signup' },
      { ...READ_DOCS, label: 'Install the CLI' }
    ]
  },
  PRODUCT_CLOSING
]
