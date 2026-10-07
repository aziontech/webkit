import contabilizeiTile from '@aziontech/webkit/assets/contabilizei-symbol-color.png'
import { markRaw } from 'vue'

import { TRACE_TABS } from '../console-trace.js'
import {
  PRODUCT_CLOSING,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import ConsoleTraceScene from '../../ui/ConsoleTraceScene.vue'
import RuntimeApiCloud from '../../ui/RuntimeApiCloud.vue'

const IMPORT = 'import'

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

const CODE_FILES = [
  {
    label: 'File upload',
    value: 'file-upload',
    language: 'typescript',
    code: FILE_UPLOAD,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  },
  {
    label: 'Send transactional emails',
    value: 'transactional-email',
    language: 'typescript',
    code: TRANSACTIONAL_EMAIL,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  }
]

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

const FAQ = [
  {
    value: 'what-is',
    question: 'What are Functions?',
    answer:
      'Azion Functions is a serverless platform for running code on distributed infrastructure with up to 5 minutes of CPU time per execution. Key features include: zero cold starts, 20MB bundle size, TypeScript/JavaScript support, WebAssembly runtime, and native framework support for Next.js, React, Vue, and Astro. Deploy API handlers, authentication, data pipelines, and browser automation without managing servers.'
  },
  {
    value: 'vs-workers',
    question: 'How does Functions compare to Cloudflare Workers?',
    answer:
      'Both platforms offer serverless compute with zero cold starts. The key difference is CPU time: Azion Functions supports extended execution, while Cloudflare Workers is optimized for lightweight request handlers. This makes Azion suitable for longer-running workloads like data transformation and browser automation. Cloudflare offers broader global distribution and multi-language support (Python, Rust, etc.). Choose Azion for compute-intensive jobs; choose Cloudflare for maximum global distribution.'
  },
  {
    value: 'languages',
    question: 'Which languages and frameworks are supported?',
    answer:
      'Functions supports TypeScript and JavaScript natively, plus WebAssembly for compiled extensions. Frameworks with native CLI support include Next.js, Vue, React, Angular, Gatsby, and Astro. The runtime provides web-standard APIs, extended Node.js APIs, and WebAssembly support.'
  },
  {
    value: 'cold-starts',
    question: 'Are there cold starts?',
    answer:
      'No. Functions are designed for consistent first-request performance with zero cold starts on the Azion Web Platform. Initial requests perform as fast as subsequent requests—critical for user-facing APIs and authentication flows.'
  },
  {
    value: 'cpu-time',
    question: 'What can I do with 5 minutes of CPU time?',
    answer:
      "Extended CPU time enables workloads that traditional serverless platforms can't handle: browser automation with Puppeteer, complex data transformation pipelines, image and video processing, AI inference jobs, and multi-step API orchestration. You don't need to architect around execution limits or set up external orchestration services."
  },
  {
    value: 'limits',
    question: 'What are the execution limits?',
    answer:
      'Functions support up to 5 minutes of CPU time per execution and bundle sizes up to 20 MB. These limits are designed for production workloads requiring extended processing time.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy Functions?',
    answer:
      'Deploy from Git repositories with continuous deployment or use the Azion CLI (`azion init`, `azion build`, `azion deploy`). Functions integrate with Applications and Firewall via Rules Engine for request-time execution.'
  },
  {
    value: 'observability',
    question: 'How do I monitor and debug Functions?',
    answer:
      'Functions include built-in observability with metrics, logs, and per-request execution traces. You can troubleshoot issues directly in the console or stream data to external tools via Data Stream.'
  },
  {
    value: 'data-access',
    question: 'Can Functions access databases and storage?',
    answer:
      'Yes. Functions can connect to SQL Database, KV Store, and Object Storage using native APIs in the runtime. This enables building complete applications with data persistence on a single platform.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from Cloudflare Workers?',
    answer:
      "Both platforms use JavaScript/TypeScript, so code migration is straightforward for most functions. Export your Worker code, initialize an Azion Function, adapt runtime APIs, and deploy. If using Cloudflare KV/R2/D1, migrate data to Azion SQL Database, KV Store, or Object Storage. Lightweight request handlers can work on both platforms; longer-running functions benefit from Azion's extended execution time."
  }
]

const READ_DOCS = {
  label: 'Read Azion Docs',
  href: PRODUCT_DOCS,
  kind: 'secondary',
  icon: 'pi pi-book'
}

export const FUNCTIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'product-ticker',
    eyebrow: 'Functions',
    title: 'Instant serverless functions for modern applications',
    description: 'Build and scale AI-powered applications on a globally integrated platform.',
    actions: PRODUCT_HERO_ACTIONS,
    scene: { component: markRaw(RuntimeApiCloud) }
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Build with familiar frameworks',
        description:
          'Write Functions in TypeScript or JavaScript and ship with the frameworks you already use.',
        href: PRODUCT_DOCS,
        illustration: 'modern-frontends',
        actions: [READ_DOCS]
      },
      {
        title: 'Serverless runtime built for modern workloads',
        description:
          'Use Functions as a programmable layer between users, storefronts, APIs, and origins. Adapt requests in real time without changing your backend architecture.',
        href: PRODUCT_DOCS,
        illustration: 'runtime',
        actions: [READ_DOCS]
      }
    ]
  },
  {
    section: 'CodeSplit',
    kind: 'default',
    title: 'From hello world to full-stack applications',
    description:
      'Run application logic with the resources a full-stack product needs: relational data, low-latency state, object storage, and AI responses through Azion libraries.',
    files: CODE_FILES,
    defaultFile: 'file-upload',
    copyAriaLabel: 'Copy the file upload sample',
    actions: [
      READ_DOCS,
      {
        label: 'See Github',
        href: 'https://github.com/aziontech',
        kind: 'outlined',
        icon: 'pi pi-github',
        external: true
      }
    ]
  },
  {
    section: 'FeatureTabs',
    eyebrow: 'Observability',
    title: 'Inspect every run end-to-end',
    description:
      'Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it.',
    tabs: TRACE_TABS.map((entry) => ({
      value: entry.value,
      title: entry.label,
      description: entry.description
    })),
    scene: { component: markRaw(ConsoleTraceScene) },
    action: { label: 'Open an invocation', href: '/product-preview' }
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
  PRODUCT_CLOSING
]
