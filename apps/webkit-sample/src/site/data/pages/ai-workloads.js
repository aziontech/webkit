import { AI_STACK } from '@shared/ui/brand/strips.js'

import { AI_FAQ } from '../ai.js'
import { EARTH_NETWORK, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Artificial Intelligence (AI)',
  title: 'Build AI-powered applications on distributed architecture',
  description:
    'Run AI models for real-time text, image, and media generation. Build with AI Inference, Functions, and SQL Database on Azion.'
}

const CAPABILITIES = [
  {
    icon: 'pi pi-microchip-ai',
    title: 'Global inference on GPUs',
    description:
      'Run real-time inference on GPUs across Azion’s distributed infrastructure, with median latency under 30 ms and no infrastructure to manage.'
  },
  {
    icon: 'pi pi-code',
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
    icon: 'pi pi-database',
    title: 'RAG with SQL vector search',
    description:
      'Integrate AI Inference with SQL Database vector search to power semantic retrieval and hybrid search.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Monitoring built for AI',
    description:
      'Track behavior and performance with Real-Time Metrics, Real-Time Events, and GraphQL APIs.'
  },
  {
    icon: 'pi pi-shield',
    title: 'AI-powered security workflows',
    description:
      'Build autonomous security agents to detect abuse and stop threats before they reach your origin. Or deploy a pre-built one instantly.'
  }
]

const USE_CASES = {
  title: 'The Platform for Your AI Workloads',
  items: [
    {
      illustration: 'ai-applications',
      title: 'Build AI Agents',
      description:
        'Automate multi-step workflows with AI agents that reason, plan, and act for you. Cut days of manual effort to minutes and free teams for higher-value work.'
    },
    {
      illustration: 'deploy-secure-mcp-server',
      title: 'Deploy Secure MCP Servers',
      description:
        "Connect AI agents to your tools, APIs, and live data through MCP servers running on the same distributed infrastructure as your inference. Protect against prompt injection with WAF and preserve data sovereignty by keeping context within the user's region."
    },
    {
      illustration: 'build-applications',
      title: 'Build and Scale AI Applications',
      description:
        'Run AI models, LoRA fine-tuning, and RAG pipelines in your applications, using SQL Database vector search to retrieve context and ground responses. Add AI to any application with minimal effort.'
    },
    {
      illustration: 'automate-threat-mitigation',
      title: 'Automate Threat Mitigation',
      description:
        'Run multi-model AI to spot phishing and abuse patterns across your digital assets. Automate security workflows with agentic AI — from detection to takedown.'
    }
  ]
}

const STACK = { label: 'Compatible With Your Stack', marks: AI_STACK }

const CTA = {
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.'
}

export const AI_WORKLOADS_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  useCases: USE_CASES,
  stack: STACK,
  quotes: quotesLedBy('axur'),
  primitivesTitle: 'Everything You Need to Run AI',
  network: EARTH_NETWORK,
  faq: AI_FAQ,
  cta: CTA,
  agents: true
})
