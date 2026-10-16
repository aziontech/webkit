import { markRaw } from 'vue'

import AiInferenceFunctionFragment from '../../ui/mockup/widgets/AiInferenceFunctionFragment.vue'
import AiInferenceModelFragment from '../../ui/mockup/widgets/AiInferenceModelFragment.vue'
import AiInferenceTemplateFragment from '../../ui/mockup/widgets/AiInferenceTemplateFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-globe',
    title: 'Built-in reliability',
    description: 'Distributed architecture with automatic failover keeps your AI running.'
  },
  {
    icon: 'pi pi-code',
    title: 'OpenAI-compatible API',
    description: 'Keep your existing code and SDKs — just change the endpoint.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Pay for usage',
    description: 'You pay only when your models are running inference.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-bolt',
    title: 'AI agents for automated workflows',
    description:
      'Build agents that plan, call tools, and complete tasks with context-aware responses.',
    href: '/site/solutions/ai'
  },
  {
    icon: 'pi pi-cog',
    title: 'AI-powered applications (RAG + search)',
    description:
      'Create RAG, semantic search, and personalized experiences using SQL Database vector search.',
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'pi pi-users',
    title: 'Customer support copilot',
    description: 'Answer customer questions using your knowledge base and scalable AI inference.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'pi pi-shield',
    title: 'Automated threat detection and takedown',
    description: 'Classify threats, detect abuse, and automate security actions with AI models.',
    href: '/site/solutions/security'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Azion AI Inference?',
    answer:
      'Azion AI Inference is a serverless platform for deploying and running AI models on a distributed architecture. It provides an OpenAI-compatible API for easy migration, supports LLMs, VLMs, embeddings, and reranking models, and offers LoRA fine-tuning for domain customization. Scale automatically without GPU management while maintaining low-latency responses globally.'
  },
  {
    value: 'models',
    question: 'Which models can I run?',
    answer:
      'Choose from a catalog of open-source models for text and code generation, vision-language tasks, embeddings, and reranking. The catalog evolves as new models become available, and you can fine-tune supported models with LoRA for your specific domain.'
  },
  {
    value: 'openai-compatible',
    question: 'Is it compatible with OpenAI API?',
    answer:
      'Yes. AI Inference uses an OpenAI-compatible API format, so you can migrate existing applications by updating the base URL and credentials. Keep your current SDKs and integration patterns—no code rewrite required.'
  },
  {
    value: 'fine-tune',
    question: 'Can I fine-tune models?',
    answer:
      'Yes. AI Inference supports LoRA (Low-Rank Adaptation) fine-tuning, allowing you to specialize models for your domain without full retraining. This reduces compute costs while improving accuracy for specific tasks like customer support, code generation, or domain-specific Q&A.'
  },
  {
    value: 'rag',
    question: 'How do I build RAG and semantic search?',
    answer:
      'Use AI Inference with SQL Database Vector Search to store embeddings and retrieve relevant context for RAG applications. This built-in vector search means no separate vector database to manage—SQL and vectors in one service.'
  },
  {
    value: 'agents',
    question: 'Can I build AI agents and tool-calling workflows?',
    answer:
      'Yes. AI Inference powers agent patterns like ReAct and tool-calling workflows when combined with Applications, Functions, and external APIs. Azion provides templates and guides for LangChain and LangGraph-based agent architectures.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from Cloudflare Workers AI?',
    answer:
      'Migration is straightforward due to OpenAI-compatible APIs on both platforms. Update your base URL to point to Azion AI Inference endpoints, migrate any LoRA adapters, and integrate with Azion Functions. If you use Cloudflare Vectorize, migrate to Azion SQL Database Vector Search for built-in vector storage.'
  },
  {
    value: 'pricing',
    question: 'How does pricing compare to other platforms?',
    answer:
      'AI Inference uses straightforward per-request pricing without abstract units like "neurons." You pay for inference requests based on model and token usage—no idle costs, no capacity commitments. This transparency makes cost forecasting predictable compared to neuron-based billing models.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy AI inference into my application?',
    answer:
      'Create an AI Inference endpoint, then integrate it into your request flow using Applications and Functions. This adds AI capabilities to existing APIs and user experiences with distributed execution, managed scaling, and automatic failover.'
  }
]

export const AI_INFERENCE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'AI Inference',
    title: 'Global AI inference on managed infrastructure',
    description:
      'Build and deploy intelligent applications that run AI models close to your users — at any scale.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'From a template to a running model',
    description:
      'The starter you deploy, the model it loads and the function that calls it live in one workflow, shipped together to the same distributed infrastructure.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-marketplace',
        title: 'Quick start with templates',
        description:
          'Start from pre-built applications and starter kits for AI and agent use cases, and deploy a complete project in seconds.',
        scene: { component: markRaw(AiInferenceTemplateFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-microchip-ai',
        title: 'Pick the model your app runs',
        description:
          'Choose from a catalog of open-source models for text and code generation, vision-language tasks, embeddings, and reranking.',
        scene: { component: markRaw(AiInferenceModelFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'From hello world to production AI workloads',
        description:
          'Call a model from a function in a few lines, and connect it with SQL Database, Object Storage, and Functions in one platform.',
        scene: { component: markRaw(AiInferenceFunctionFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Deploy from your local environment',
        description:
          'Build, debug, and ship AI workloads the way you already code, but with the scale of distributed infrastructure.',
        href: PRODUCT_DOCS,
        illustration: 'quick-start-with-templates',
        illustrationLabel: 'A project going from a starter template to a live deployment',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Fine-tune with LoRA',
        description:
          'Adapt model outputs to your domain using Low-Rank Adaptation (LoRA), improving accuracy for specialized tasks while reducing compute costs—without full model retraining.',
        href: '/site/solutions/ai',
        illustration: 'ai-applications',
        illustrationLabel:
          'An application calling AI models that run on distributed infrastructure',
        actions: [{ label: 'AI solutions', href: '/site/solutions/ai' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What you can build with AI Inference',
    description:
      'Put AI Inference behind any application and run models on Azion’s distributed infrastructure, close to your users. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('axur') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
