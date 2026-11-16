<script setup>
  import TemplateGallerySection from '@aziontech/webkit/template-gallery-section'
</script>

<template>
  <TemplateGallerySection
    anchor="templates"
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
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
        icon: 'ai-color ai-nextjs',
        invertInDark: true,
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'Astro Odyssey',
        description: 'A modern business marketing website theme/starter built with Astro.',
        icon: 'ai-color ai-astro',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'SvelteKit Commerce',
        description: 'Ecommerce template built with SvelteKit and Shopify.',
        icon: 'ai-color ai-svelte',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    marquee-label="Compatible with Your Stack"
    :marquee-marks="['nextjs', 'astro', 'react', 'vue', 'angular', 'nuxt']"
  />
</template>
