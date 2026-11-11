const DOCS_HREF = 'https://www.azion.com/en/documentation/products/guides/#azion-templates'

export const SITE_SECTION = {
  _id: 'closing-call-to-action-templates',
  props: {
    anchor: 'contact',
    title: 'Start from a template. Ship it today.',
    description: 'Deploy a ready-made starter in seconds, then make it yours.',
    primaryAction: { label: 'Start for free', href: '/signup' },
    secondaryAction: { label: 'Browse all templates', href: DOCS_HREF, trailing: true },
    templates: [
      {
        title: 'AI Inference Starter Kit',
        description: 'Run AI models close to your users.',
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
        description: 'A business marketing website built with Astro.',
        icon: 'ai-cor ai-astro',
        href: DOCS_HREF
      },
      {
        title: 'Next.js AI Chatbot',
        description: 'A server-rendered Next.js App Router AI chatbot.',
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
        description: 'A minimal multi-tenant Next.js starter.',
        icon: 'ai-cor ai-next',
        invertInDark: true,
        href: DOCS_HREF
      },
      {
        title: 'Cosmic Agency Website',
        description: "A template built on Cosmic's React components.",
        icon: 'ai-cor ai-react',
        href: DOCS_HREF
      },
      {
        title: 'Functions Starter Kit',
        description: 'A “Hello World” originless app powered by functions.',
        icon: 'ai ai-edge-functions',
        href: DOCS_HREF
      }
    ],
    deployLabel: 'Deploy',
    templatesAriaLabel: 'Templates you can deploy'
  }
}
