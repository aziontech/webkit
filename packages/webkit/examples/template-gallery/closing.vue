<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import TemplateGallery from '@aziontech/webkit/template-gallery'

  const primaryAction = {
    label: 'Start for free',
    href: '/signup'
  }

  const secondaryAction = {
    label: 'Browse all templates',
    href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates',
    trailing: true
  }

  const templates = [
    {
      title: 'AI Inference Starter Kit',
      description: 'Run AI models close to your users.',
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
      description: 'A business marketing website built with Astro.',
      icon: 'ai-color ai-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js AI Chatbot',
      description: 'A server-rendered Next.js App Router AI chatbot.',
      icon: 'ai-color ai-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'ai-color ai-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Multi-tenant Starter',
      description: 'A minimal multi-tenant Next.js starter.',
      icon: 'ai-color ai-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Cosmic Agency Website',
      description: "A template built on Cosmic's React components.",
      icon: 'ai-color ai-react',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Functions Starter Kit',
      description: 'A “Hello World” originless app powered by functions.',
      icon: 'ai ai-edge-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <TemplateGallery
      closing
      anchor="contact"
      title="Start from a template. Ship it today."
      description="Deploy a ready-made starter in seconds, then make it yours."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
      :templates="templates"
      deploy-label="Deploy"
      templates-aria-label="Templates you can deploy"
      :hatch="false"
    />
    <SectionGap hatch />

    <ClosingCallToAction
      kind="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    />
  </SectionContainer>
</template>
