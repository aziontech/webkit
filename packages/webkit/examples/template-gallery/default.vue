<script setup>
  import TemplateGallery from '@aziontech/webkit/template-gallery'
</script>

<template>
  <TemplateGallery
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    :templates="[
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
        title: 'SvelteKit Commerce',
        description: 'Ecommerce template built with SvelteKit and Shopify.',
        icon: 'ai-cor ai-svelte',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    ticker-label="Compatible with Your Stack"
    :ticker-marks="['nextjs', 'astro', 'react', 'vue', 'angular', 'nuxt']"
  />
</template>
