<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import TemplateGallery from '@aziontech/webkit/template-gallery'

  const primaryAction = {
    label: 'Start for free',
    href: '/signup'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
    href: '/contact',
    trailing: true
  }

  const templates = [
    {
      title: 'AI Inference Starter Kit',
      description: 'Create an application that runs AI models close to users.',
      icon: 'ai ai-edge-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Commerce',
      description: 'Ecommerce template built with Next.js and Shopify.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Astro Odyssey',
      description: 'A modern business marketing website theme/starter built with Astro.',
      icon: 'ai-cor ai-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js AI Chatbot',
      description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'ai-cor ai-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Multi-tenant Starter',
      description: 'A minimalistic multi-tenant Next.js starter template.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Functions Starter Kit',
      description: 'Launch a “Hello World” originless application powered by functions.',
      icon: 'ai ai-edge-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Cosmic Agency Website',
      description: "A custom template built using Cosmic's React components, Blocks.",
      icon: 'ai-cor ai-react',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]

  const tickerMarks = [
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
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <TemplateGallery
      eyebrow="Your Stack, Your Way"
      title="Quick Start with Templates"
      description="Launch storefronts faster with pre-built templates and starter kits for headless commerce, marketing pages, and product catalogs. Deploy complete projects in seconds with popular frameworks."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
      :templates="templates"
      deploy-label="Deploy now"
      templates-aria-label="Templates you can deploy"
      ticker-label="Compatible with Your Stack"
      :ticker-marks="tickerMarks"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
