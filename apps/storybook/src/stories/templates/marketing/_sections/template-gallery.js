const DOCS_HREF = 'https://www.azion.com/en/documentation/products/guides/#azion-templates'

const TEMPLATES = [
  {
    title: 'AI Inference Starter Kit',
    description: 'Create an application that runs AI models close to users.',
    icon: 'ai ai-edge-functions',
    href: DOCS_HREF
  },
  {
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js and Shopify.',
    icon: 'ai-cor ai-next',
    invertInDark: true,
    href: DOCS_HREF
  },
  {
    title: 'Astro Odyssey',
    description: 'A modern business marketing website theme/starter built with Astro.',
    icon: 'ai-cor ai-astro',
    href: DOCS_HREF
  },
  {
    title: 'Next.js AI Chatbot',
    description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
    icon: 'ai-cor ai-next',
    invertInDark: true,
    href: DOCS_HREF
  },
  {
    title: 'SvelteKit Commerce',
    description: 'Ecommerce template built with SvelteKit and Shopify.',
    icon: 'ai-cor ai-svelte',
    href: DOCS_HREF
  },
  {
    title: 'Next.js Multi-tenant Starter',
    description: 'A minimalistic multi-tenant Next.js starter template.',
    icon: 'ai-cor ai-next',
    invertInDark: true,
    href: DOCS_HREF
  },
  {
    title: 'Functions Starter Kit',
    description: 'Launch a “Hello World” originless application powered by functions.',
    icon: 'ai ai-edge-functions',
    href: DOCS_HREF
  },
  {
    title: 'Cosmic Agency Website',
    description: "A custom template built using Cosmic's React components, Blocks.",
    icon: 'ai-cor ai-react',
    href: DOCS_HREF
  }
]

const TICKER_MARKS = [
  'nextjs',
  'astro',
  'react',
  'vue',
  'angular',
  'nuxt',
  'gatsby',
  'hugo',
  'preact',
  'remix',
  'qwik',
  'vite',
  'vitepress',
  'docusaurus',
  'eleventy',
  'hexo',
  'jekyll',
  'hono',
  'nodejs',
  'aws',
  'gcp',
  'azure',
  'workers-cloudflare',
  'terraform',
  'github',
  'openai',
  'anthropic',
  'groq',
  'sqlite',
  'drizzle'
]

export const SITE_SECTION = {
  _id: 'template-gallery',
  props: {
    eyebrow: 'Your Stack, Your Way',
    title: 'Quick Start with Templates',
    description:
      'Launch storefronts faster with pre-built templates and starter kits for headless commerce, marketing pages, and product catalogs. Deploy complete projects in seconds with popular frameworks.',
    primaryAction: { label: 'Start for free', href: '/signup' },
    secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true },
    templates: TEMPLATES,
    deployLabel: 'Deploy now',
    templatesAriaLabel: 'Templates you can deploy',
    tickerLabel: 'Compatible with Your Stack',
    tickerMarks: TICKER_MARKS
  }
}
