// The deploy flow's published templates, as the site's own catalog. `@site` may not
// import `@console`, so the copy below mirrors console/lib/data/templates.js rather
// than importing it — retitle a template there and retitle it here.

const CONFIGURED_ONLY = new Set(['azion-proxy', 'azion-static-site', 'dynamic-static-optimization'])

const DARK_INK_MARKS = ['ai-next']

const routeFor = (slug) =>
  CONFIGURED_ONLY.has(slug)
    ? { path: '/applications/new', query: { method: 'template', template: slug } }
    : { path: '/deploy', query: { template: slug } }

/** What a mark needs to survive the dark theme — `''` for all but hard-coded dark ink. */
export const markFilterFor = (icon) =>
  DARK_INK_MARKS.some((mark) => icon.split(' ').includes(mark))
    ? '[[data-theme=dark]_&]:invert'
    : ''

const PUBLISHED = [
  {
    slug: 'ai-inference-starter',
    title: 'AI Inference Starter Kit',
    description: 'Create an application running AI models at the edge.',
    icon: 'ai ai-edge-functions'
  },
  {
    slug: 'nextjs-commerce',
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js and Shopify.',
    icon: 'ai-cor ai-next'
  },
  {
    slug: 'astro-odyssey',
    title: 'Astro Odyssey',
    description: 'A modern business marketing website theme/starter built with Astro.',
    icon: 'ai-cor ai-astro'
  },
  {
    slug: 'nextjs-ai-chatbot',
    title: 'Next.js AI Chatbot',
    description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
    icon: 'ai-cor ai-next'
  },
  {
    slug: 'sveltekit-commerce',
    title: 'SvelteKit Commerce',
    description: 'Ecommerce template built with SvelteKit and Shopify.',
    icon: 'ai-cor ai-svelte'
  },
  {
    slug: 'nextjs-multi-tenant',
    title: 'Next.js Multi-tenant Starter',
    description: 'A minimalistic multi-tenant Next.js starter template.',
    icon: 'ai-cor ai-next'
  },
  {
    slug: 'functions-starter',
    title: 'Functions Starter Kit',
    description: 'Launch a “Hello World” originless application powered by functions.',
    icon: 'ai ai-edge-functions'
  },
  {
    slug: 'cosmic-agency-website',
    title: 'Cosmic Agency Website',
    description: "A custom template built using Cosmic's React components, Blocks.",
    icon: 'ai-cor ai-react'
  },
  {
    slug: 'cosmic-astro-blog',
    title: 'Cosmic Simple Astro Blog',
    description: 'An Astro blog template powered by Cosmic.',
    icon: 'ai-cor ai-astro'
  },
  {
    slug: 'eleventy-base-blog',
    title: '11ty Base Blog',
    description: 'Deploy this starter template to build a blog with the Eleventy site generator.',
    icon: 'ai ai-eleventy'
  },
  {
    slug: 'eleventy-landing-page',
    title: '11ty Landing Page',
    description: 'Create a simple landing page template built with 11ty and Tailwind CSS.',
    icon: 'ai ai-eleventy'
  },
  {
    slug: 'azion-proxy',
    title: 'Azion Proxy',
    description: 'Front an origin you already run. Azion receives the traffic and passes it on.',
    icon: 'ai ai-edge-connectors'
  },
  {
    slug: 'azion-static-site',
    title: 'Azion Static Site',
    description: 'Publish a folder of built files and serve it from Azion.',
    icon: 'ai ai-edge-storage'
  },
  {
    slug: 'dynamic-static-optimization',
    title: 'Dynamic and Static File Optimization',
    description: 'Boost your application to deliver your content using Azion as a CDN.',
    icon: 'ai ai-tiered-cache'
  }
]

/** Every published template, each carrying where it opens and what its mark needs on dark. */
export const DEPLOY_TEMPLATES = PUBLISHED.map((template) => ({
  ...template,
  markClass: markFilterFor(template.icon),
  to: routeFor(template.slug)
}))
