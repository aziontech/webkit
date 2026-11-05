const SUBJECTS = [
  {
    slug: 'api-security',
    title: 'API Security',
    description:
      'Understand threat risks, follow an API Security checklist, and learn architecture best practices to protect your applications with maximum performance.',
    articles: [
      {
        label: 'What is API Security?',
        href: 'https://www.azion.com/en/learning/api/what-is-api-security/'
      },
      {
        label: 'API Gateway vs. API Security',
        href: 'https://www.azion.com/en/learning/api/api-gateway-vs-api-security/'
      },
      {
        label: 'OWASP API Security Top 10',
        href: 'https://www.azion.com/en/learning/api/owasp-api-security-top-10/'
      },
      {
        label: 'OWASP Top 10 for LLMs',
        href: 'https://www.azion.com/en/learning/api/owasp-top-10-for-llms/'
      },
      {
        label: 'REST vs. GraphQL Security',
        href: 'https://www.azion.com/en/learning/api/rest-vs-graphql-security/'
      },
      {
        label: 'API Security Checklist',
        href: 'https://www.azion.com/en/learning/api/api-security-checklist/'
      },
      {
        label: 'API Security Best Practices',
        href: 'https://www.azion.com/en/learning/api/api-security-best-practices/'
      }
    ]
  },
  {
    slug: 'ai',
    title: 'AI',
    description:
      'Learn the core concepts of Artificial Intelligence (AI), from machine learning and RAG to agents and inference.',
    articles: [
      {
        label: 'What is Artificial Intelligence (AI)?',
        href: 'https://www.azion.com/en/learning/ai/what-is-artificial-intelligence/'
      },
      {
        label: 'What is Machine Learning?',
        href: 'https://www.azion.com/en/learning/ai/what-is-machine-learning/'
      },
      { label: 'What is RAG?', href: 'https://www.azion.com/en/learning/ai/what-is-rag/' },
      {
        label: 'What is Vector Search?',
        href: 'https://www.azion.com/en/learning/ai/what-is-vector-search/'
      },
      {
        label: 'What are AI Agents?',
        href: 'https://www.azion.com/en/learning/ai/what-are-ai-agents/'
      },
      {
        label: 'Model Context Protocol (MCP)',
        href: 'https://www.azion.com/en/learning/ai/model-context-protocol-mcp/'
      },
      {
        label: 'What is AI Inference?',
        href: 'https://www.azion.com/en/learning/ai/what-is-ai-inference/'
      }
    ]
  },
  {
    slug: 'bots',
    title: 'Bots',
    description:
      'Bots are automated software programs that perform repetitive tasks on websites and applications. While some bots like search engine crawlers are beneficial, malicious bots can cause significant harm to businesses in multiple ways.',
    articles: [
      { label: 'What is a Bot?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/' },
      {
        label: 'What is a Bot Attack?',
        href: 'https://www.azion.com/en/learning/bots/what-is-a-bot-attack/'
      },
      {
        label: 'What is Bot Management?',
        href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/'
      },
      {
        label: 'What is Credential Stuffing?',
        href: 'https://www.azion.com/en/learning/bots/what-is-credential-stuffing/'
      }
    ]
  },
  {
    slug: 'cdn',
    title: 'CDN',
    description:
      'The primary goal of a CDN is to reduce latency and improve the speed at which static content is delivered by caching it on servers closer to the end-users',
    articles: [
      { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
      { label: 'What is Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-caching/' },
      {
        label: 'What is Micro Caching?',
        href: 'https://www.azion.com/en/learning/cdn/what-is-micro-caching/'
      },
      {
        label: 'What is Tiered Caching?',
        href: 'https://www.azion.com/en/learning/cdn/what-is-tiered-caching/'
      }
    ]
  }
]

export const SITE_SECTION = {
  _id: 'subject-library',
  props: {
    anchor: 'subjects',
    subjects: SUBJECTS,
    closing: {
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description:
        'Deploy your first application in minutes, or talk to an expert about your architecture.',
      primaryAction: { label: 'Start for free', href: '/signup' },
      secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
    }
  }
}
