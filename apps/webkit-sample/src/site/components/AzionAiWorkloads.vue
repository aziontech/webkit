<script setup>
  import { AI_CLIENT_STRIP, AI_STACK } from '@shared/ui/brand/strips.js'

  import { quotesLedBy } from '../data/solutions.js'
  import SolutionPage from './SolutionPage.vue'

  const HERO = {
    eyebrow: 'Artificial Intelligence (AI)',
    title: 'Build AI-powered applications on distributed architecture',
    description:
      'Run AI models for real-time text, image, and media generation. Build with AI Inference, Functions, and SQL Database on Azion.',
    carouselMarks: AI_CLIENT_STRIP
  }

  const CAPABILITIES = [
    {
      icon: 'pi pi-microchip-ai',
      title: 'Global inference on GPUs',
      description:
        'Run real-time serverless inference on GPUs across hundreds of locations with median latency under 30 ms. No infra to manage.'
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

  const USE_CASES = {
    title: 'The Platform for Your AI Workloads',
    items: [
      {
        illustration: 'ai-applications',
        title: 'Build AI Agents',
        description:
          'Automate multi-step workflows with AI agents that reason, plan, and act on your behalf. Collapse days of manual effort into minutes and free teams for higher-value work.'
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
          'Supercharge your applications by running AI models, LoRA fine-tuning, and RAG pipelines with SQL Database vector search to retrieve context and generate grounded responses. Make any application AI-powered with minimal effort.'
      },
      {
        illustration: 'automate-threat-mitigation',
        title: 'Automate Threat Mitigation',
        description:
          'Run multi-model AI to identify phishing and abuse patterns across your digital assets. Automate security workflows with agentic AI — from detection to takedown.'
      }
    ]
  }

  const STACK = { label: 'Compatible With Your Stack', marks: AI_STACK }

  const FAQ = [
    {
      value: 'q1',
      question: 'Which model types are supported?',
      answer:
        'Azion AI Inference supports model categories including LLMs, VLMs, embeddings, and rerankers.'
    },
    {
      value: 'q2',
      question: 'How do I use AI Inference in my application?',
      answer:
        'You can call AI Inference directly from Functions with the API pattern `const response = await Azion.AI.run(model, input)` and integrate it into your existing request flow.'
    },
    {
      value: 'q3',
      question: 'Is Azion AI compatible with OpenAI APIs and SDKs?',
      answer:
        'Yes. Azion AI Inference provides OpenAI-compatible endpoints, so migration typically requires endpoint and credential updates instead of full rewrites.'
    },
    {
      value: 'q4',
      question: 'How do I implement RAG and semantic search?',
      answer:
        'Use AI Inference with SQL Database vector search to store embeddings, retrieve relevant context, and build retrieval-augmented generation flows.'
    },
    {
      value: 'q5',
      question: 'Can I fine-tune models with proprietary data?',
      answer:
        'Yes. You can apply LoRA fine-tuning to pre-trained models to adapt them and improve task accuracy for domain-specific workloads.'
    },
    {
      value: 'q6',
      question: 'What if the model I need is not available?',
      answer:
        "Azion is constantly expanding model support. If you need a specific model that's not yet available, open a Support ticket or submit feedback through the Azion Console. Each request is evaluated based on technical feasibility and demand."
    },
    {
      value: 'q7',
      question: 'What is the difference between training and inference?',
      answer:
        'Training teaches a model with data and is typically resource-intensive. Inference is running the trained model to generate predictions or responses, which is the phase handled by Azion AI Inference.'
    },
    {
      value: 'q8',
      question: 'How can I monitor AI application behavior in production?',
      answer:
        'You can monitor requests, latency, and runtime behavior with Real-Time Metrics, Real-Time Events, and GraphQL APIs for operational visibility.'
    },
    {
      value: 'q9',
      question: 'Do I need to manage servers or clusters for scaling?',
      answer:
        'No. AI workloads scale automatically on Azion infrastructure, including scale-to-zero behavior and usage-based pricing.'
    },
    {
      value: 'q10',
      question: 'Can AI be used for autonomous security use cases?',
      answer:
        'Yes. You can deploy AI agents to analyze content in real time, detect malicious patterns, and trigger automated mitigation workflows.'
    }
  ]

  const CTA = {
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.'
  }
</script>

<template>
  <SolutionPage
    :hero="HERO"
    :capabilities="CAPABILITIES"
    :use-cases="USE_CASES"
    :stack="STACK"
    :quotes="quotesLedBy('axur')"
    primitives-title="All the AI Primitives You Need"
    :faq="FAQ"
    :cta="CTA"
  />
</template>
