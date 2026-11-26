<script setup>
  import ClosingCallToActionSection from '@aziontech/ui/closing-call-to-action-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'
  import TemplateGallerySection from '@aziontech/ui/template-gallery-section'

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
      icon: 'az az-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Commerce',
      description: 'Ecommerce template built with Next.js and Shopify.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Astro Odyssey',
      description: 'A business marketing website built with Astro.',
      icon: 'az-color az-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js AI Chatbot',
      description: 'A server-rendered Next.js App Router AI chatbot.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'az-color az-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Multi-tenant Starter',
      description: 'A minimal multi-tenant Next.js starter.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Cosmic Agency Website',
      description: "A template built on Cosmic's React components.",
      icon: 'az-color az-react',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Functions Starter Kit',
      description: 'A “Hello World” originless app powered by functions.',
      icon: 'az az-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <TemplateGallerySection
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
    <Spacer hatch />

    <ClosingCallToActionSection
      variant="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    />
  </Container>
</template>
