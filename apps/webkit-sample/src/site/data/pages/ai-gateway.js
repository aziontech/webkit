import { markRaw } from 'vue'

import DiagramSet from '../../ui/diagram/DiagramSet.vue'
import { LATENCY_ROUTING, MODEL_ROUTING, PROVIDER_FAILOVER } from '../diagrams.js'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const FEATURES = [
  {
    icon: 'ai ai-azion-api',
    title: 'One endpoint for every model',
    description:
      'Apps send OpenAI-format requests with a model alias. Change the model behind an alias once, and every app follows.'
  },
  {
    icon: 'pi pi-replay',
    title: 'Fallback when a provider fails',
    description:
      'Each alias lists its models in order. When a call errors or times out, the gateway moves to the next one.'
  },
  {
    icon: 'pi pi-key',
    title: 'Provider keys stay server-side',
    description:
      'Provider keys live in secret environment variables. Each team gets its own gateway key, stored only as a SHA-256 hash.'
  },
  {
    icon: 'ai ai-edge-firewall',
    title: 'Abuse blocked before it costs tokens',
    description:
      'Firewall applies WAF, rate limits, and DDoS Protection before requests reach the gateway, so blocked traffic never reaches a model.'
  },
  {
    icon: 'ai ai-tiered-cache',
    title: 'Repeated prompts served from cache',
    description:
      'Callers opt in per request. A matching prompt gets a stored response, with no model call and no tokens spent.'
  },
  {
    icon: 'pi pi-list',
    title: 'Every call on the record',
    description:
      'Each call logs the team, model, fallback, cache result, and tokens used. Stream the logs to your SIEM or data warehouse.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-users',
    title: 'Central model access for every team',
    description:
      'Give each team its own gateway key and list of allowed models, and block a team that reaches its budget.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-sync',
    title: 'Failover across providers',
    description:
      "Try a model on AI Inference first, then a third-party provider, so one provider's outage doesn't take your AI features down.",
    href: '/site/products/ai-inference'
  },
  {
    icon: 'pi pi-chart-bar',
    title: 'Spend tracked per team',
    description:
      'Sum token usage per team from the gateway logs, and answer repeated prompts from cache with no model call.',
    href: '/site/products/data-stream'
  },
  {
    icon: 'ai ai-edge-ai',
    title: 'Governed model access for agents',
    description:
      'Point agents and MCP servers at the gateway, so every model call they make follows the same keys, limits, and logs.',
    href: '/site/solutions/ai'
  }
]

const ROUTING_DIAGRAMS = [
  {
    value: 'availability',
    spec: PROVIDER_FAILOVER,
    ariaLabel:
      'An AI app checks whether its provider is degraded; Claude Haiku 5.5 on Anthropic is degraded, so the call falls back to Claude Haiku 5.5 on Amazon Bedrock'
  },
  {
    value: 'costs',
    spec: MODEL_ROUTING,
    ariaLabel:
      'An AI app routes paid users to OpenAI GPT-5.5 with a fallback to Claude Opus 4.7, and everyone else to Kimi K2.6 or Gemma 4 depending on load'
  },
  {
    value: 'latency',
    spec: LATENCY_ROUTING,
    ariaLabel:
      'An AI app sends real-time tasks to Mistral 3 Small on AI Inference, under 30 ms, and other tasks to OpenAI GPT-5.5'
  }
]

const ROUTING_TABS = [
  { value: 'availability', title: 'Availability' },
  { value: 'costs', title: 'Costs' },
  { value: 'latency', title: 'Latency' }
]

const CLIENT_SAMPLE = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.AI_GATEWAY_URL,
  apiKey: process.env.AI_GATEWAY_KEY
});

const reply = await client.chat.completions.create({
  model: 'general',
  messages: [{ role: 'user', content: 'Summarize this ticket.' }]
});

console.log(reply.choices[0].message.content);`

const COPILOT_CONFIG = `[
  {
    "name": "Azion AI Gateway",
    "vendor": "customendpoint",
    "apiKey": "\${input:chat.lm.secret.azion}",
    "apiType": "chat-completions",
    "models": [
      {
        "id": "general",
        "name": "general",
        "url": "https://YOUR_GATEWAY_DOMAIN/v1",
        "toolCalling": true,
        "streaming": true,
        "maxInputTokens": 128000,
        "maxOutputTokens": 16000
      }
    ]
  }
]`

const CODE_AGENTS = [
  {
    label: 'OpenAI SDK',
    value: 'openai-sdk',
    language: 'ts',
    code: CLIENT_SAMPLE,
    fileName: 'client.ts',
    fileIcon: 'pi pi-code',
    icon: 'ai-cor ai-open'
  },
  {
    label: 'GitHub Copilot',
    value: 'github-copilot',
    language: 'json',
    code: COPILOT_CONFIG,
    fileName: 'chatLanguageModels.json',
    fileIcon: 'ai ai-json',
    icon: 'ai-cor ai-microsoft-copilot'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is AI Gateway?',
    answer:
      "AI Gateway is one endpoint between your applications and the AI models they call, built on the Azion Web Platform. It authenticates each team, picks a model by policy, falls back when a call fails, caches responses the caller allows, and writes a usage and audit log line for every call. It runs as a function on Azion's distributed infrastructure, behind Firewall."
  },
  {
    value: 'built-with',
    question: 'What is AI Gateway built with?',
    answer:
      'Functions runs the gateway logic on an application, and AI Inference runs the models hosted on Azion. Firewall applies WAF, rate limits, and DDoS Protection before a request reaches the function. KV Store holds team keys and policies, the Cache API stores allowed responses, and Connectors reach your own model servers. Real-Time Events, Real-Time Metrics, and Data Stream record and export every call.'
  },
  {
    value: 'models',
    question: 'Which models and providers can I use?',
    answer:
      'Any model on AI Inference, including Qwen3 30B A3B, GPT-OSS 20B, and Mistral 3 Small, plus embedding, reranking, and vision models. The gateway also calls third-party providers whose APIs accept the OpenAI chat completions format, and your own model servers through Connectors. For a provider with its own request format, adapt the request in the function.'
  },
  {
    value: 'code-changes',
    question: 'Do I need to change my application code?',
    answer:
      'Usually only the base URL and the key. The gateway accepts OpenAI chat completions requests at /v1/chat/completions, so OpenAI SDKs and compatible clients keep working. Teams send a model alias, such as general, and the platform team decides which model answers it.'
  },
  {
    value: 'fallback',
    question: 'How does fallback work?',
    answer:
      'Each alias has an ordered list of models. When a call throws an error, returns no choices, answers with an error status, or runs past its timeout, the gateway tries the next model. Every failed attempt is logged, and if all of them fail, the gateway answers 502.'
  },
  {
    value: 'spend',
    question: 'How do I control spend per team?',
    answer:
      'Every call logs the team and the tokens the model used, so your analytics platform can sum spend per team. When a team reaches its budget, set its status to blocked, and the gateway answers 429 to its key. Third-party calls use your own provider keys, so providers bill your accounts at their own prices, with no markup from Azion.'
  },
  {
    value: 'keys',
    question: 'How are provider keys and team keys protected?',
    answer:
      'Provider keys are stored as secret environment variables and read inside the function, so they never appear in code or reach a team. Each team gets its own gateway key, and KV Store keeps only its SHA-256 hash. To validate JSON Web Tokens instead, run the JWT function from Marketplace on Firewall.'
  },
  {
    value: 'monitoring',
    question: 'How do I monitor requests, latency, and errors?',
    answer:
      "Real-Time Metrics charts requests, status codes, upstream status, and function invocations. Real-Time Events keeps each request's log lines for 7 days, grouped by request ID. Data Stream sends the same lines to Splunk, Datadog, Elasticsearch, Google BigQuery, Amazon S3, Apache Kafka, or any HTTPS endpoint."
  },
  {
    value: 'compare',
    question: 'How does AI Gateway on Azion compare to other AI gateways?',
    answer:
      "Managed AI gateways give you a fixed set of features to configure. On Azion, the gateway is code you own: routing, fallback, caching, and authentication live in one function, so you can apply any policy your teams need. The same platform runs models on AI Inference and protects the endpoint with Firewall, so there's no separate proxy to secure."
  },
  {
    value: 'get-started',
    question: 'What do I need to get started?',
    answer:
      'An application with Application Accelerator, which lets a rule run the gateway function, and KV Store, which is in Preview and enabled through Technical Support. The documentation covers the full setup, from the function code to the usage stream. Talk to a specialist to plan the models, routes, and budgets for your teams.'
  }
]

export const AI_GATEWAY_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'AI Gateway',
    title: 'One gateway for all your AI applications',
    description:
      'Route requests to AI Inference and third-party providers, fall back when a model fails, and keep keys, limits, and usage logs in one place, with no proxy servers to run.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: FEATURES },
  {
    section: 'ConsolePanel',
    kind: 'diagram',
    size: 'large',
    anchor: 'routing',
    eyebrow: 'Routing',
    title: 'Every AI request through one control point',
    description:
      'Chatbots, AI agents, and coding agents call one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it. Pick a policy per alias: fall back when a provider degrades, spend premium tokens only where they pay off, or keep real-time tasks close to users.',
    texture: 'dots',
    tabs: ROUTING_TABS,
    tabsAriaLabel: 'Routing policies',
    scene: { component: markRaw(DiagramSet), props: { diagrams: ROUTING_DIAGRAMS } },
    actions: [{ label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use AI Gateway for',
    description:
      'Put one gateway in front of every model your teams call, and decide routing, limits and logging in one place. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  {
    section: 'CodeSplit',
    kind: 'agents',
    title: 'The shortest path to a production AI gateway',
    description:
      'Keep the OpenAI SDK you already use. Point it at your gateway and send a model alias. The gateway handles keys, routing, fallback, and logs.',
    agents: CODE_AGENTS,
    copyAriaLabel: 'Copy the gateway client sample',
    actions: [{ label: 'Read the guide', href: PRODUCT_DOCS }]
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('axur') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
