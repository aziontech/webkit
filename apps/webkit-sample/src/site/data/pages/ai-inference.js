import { NetworkBanner } from '@shared/ui/banners/index.js'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
import { markRaw } from 'vue'

import { AI_FAQ } from '../ai.js'
import { BUILD_CTA, EARTH_NETWORK, NETWORK_TOPICS, quotesLedBy } from '../solutions.js'

const DOCS = '/site/docs'

const FEATURES = [
  {
    icon: 'pi pi-globe',
    title: 'Global inference on GPUs',
    description:
      'Run real-time serverless inference on GPUs across hundreds of locations with median latency under 30 ms. No infra to manage.'
  },
  {
    icon: 'ai ai-azion-api',
    title: 'OpenAI-compatible API',
    description:
      'Migrate and integrate AI features quickly using OpenAI-compatible endpoints and SDKs. Just swap the endpoint.'
  },
  {
    icon: 'pi pi-bolt',
    title: 'Real-time decisioning with AI agents',
    description:
      'Run ReAct-style AI agents on a distributed architecture to reason over context, call tools, and respond in real time.'
  },
  {
    icon: 'ai ai-edge-sql',
    title: 'RAG with SQL vector search',
    description:
      'Integrate AI Inference with SQL Database vector search to power semantic retrieval and hybrid search.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Observability built for AI',
    description:
      'Track behavior and performance with Real-Time Metrics, Real-Time Events, and GraphQL APIs.'
  },
  {
    icon: 'pi pi-shield',
    title: 'AI-powered security workflows',
    description:
      'Build autonomous security agents to detect abuse and mitigate threats before origin impact. Or deploy a pre-built one instantly.'
  }
]

const PLATFORM_CARDS = [
  {
    icon: 'ai ai-edge-ai',
    title: 'Build AI Agents',
    description:
      'Automate multi-step workflows with AI agents that reason, plan, and act on your behalf. Collapse days of manual effort into minutes and free teams for higher-value work.'
  },
  {
    icon: 'pi pi-share-alt',
    title: 'Deploy Secure MCP Servers',
    description:
      'Connect AI agents to your tools, APIs, and live data through MCP servers running on the same distributed infrastructure as your inference.'
  },
  {
    icon: 'ai ai-layers',
    title: 'Build and Scale AI Applications',
    description:
      'Supercharge your applications with AI models, LoRA fine-tuned with SQL Database context, and generate real-time responses.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Automate Threat Mitigation',
    description:
      'Run multi-model AI to identify phishing and abuse patterns across your digital assets. Automate security workflows with agentic AI — from detection to takedown.'
  }
]

const FRAMEWORKS = ['vue', 'react', 'nextjs', 'astro', 'svelte', 'angular', 'nuxt']

const OPERATE_ROWS = [
  {
    title: 'Run AI models close to users',
    description:
      'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
  },
  {
    title: 'Run AI models close to users',
    description:
      'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
  },
  {
    title: 'Run AI models close to users',
    description:
      'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
  }
]

const operateDescription = [
  ...new Set(OPERATE_ROWS.map((row) => `${row.title}. ${row.description}`))
].join(' ')

export const AI_INFERENCE_PAGE = [
  {
    section: 'Heroes',
    kind: 'pixel-floor',
    title: 'Build and deploy AI agents and applications in seconds',
    description:
      'Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality.',
    actions: [
      { label: 'Start free', href: '/signup', kind: 'secondary' },
      { label: 'Docs', href: DOCS, kind: 'outlined' }
    ],
    carouselMarks: CLIENT_STRIP
  },
  { section: 'CapabilityGrid', items: FEATURES },
  { section: 'CapabilityGrid', items: PLATFORM_CARDS },
  {
    section: 'TemplateGallery',
    eyebrow: '',
    title: 'Quick start with templates',
    description:
      'Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks.',
    actions: [{ label: 'Deploy now', href: '/signup', kind: 'secondary', trailing: true }],
    stackLabel: 'Compatible with your stack',
    stackMarks: FRAMEWORKS
  },
  {
    section: 'MediaSplitBand',
    title: 'Operate AI With Speed, Reliability, and Cost Control',
    description: operateDescription,
    scene: { component: markRaw(NetworkBanner), props: { kind: 'band' } }
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('axur') },
  { section: 'PlatformDirectory', title: 'All the AI Primitives You Need' },
  { section: 'NetworkSection', ...EARTH_NETWORK, kind: 'benefits', benefits: NETWORK_TOPICS },
  { section: 'FaqSection', items: AI_FAQ },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: BUILD_CTA.eyebrow,
    title: BUILD_CTA.title,
    titleMuted: BUILD_CTA.titleMuted,
    description: BUILD_CTA.description,
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
