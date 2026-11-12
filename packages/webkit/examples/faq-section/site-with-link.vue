<script setup>
  import FaqSection from '@aziontech/webkit/faq-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const items = [
    {
      question: 'What types of storefronts can I build and deploy on Azion?',
      answer:
        'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
    },
    {
      question: 'Which frameworks are compatible?',
      answer:
        'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full [frameworks compatibility list](/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).'
    },
    {
      question: 'How do preview deployments work?',
      answer:
        'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <FaqSection
      anchor="faq"
      title="Frequently asked questions"
      :items="items"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
