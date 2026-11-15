<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StoryLibrary from '@aziontech/webkit/story-library'

  const items = []

  const facets = [
    {
      id: 'industry',
      label: 'Industry',
      allLabel: 'All industries',
      options: [
        {
          value: 'Media',
          label: 'Media'
        },
        {
          value: 'Retail',
          label: 'Retail'
        },
        {
          value: 'Tech',
          label: 'Tech'
        }
      ]
    },
    {
      id: 'solution',
      label: 'Solution',
      allLabel: 'All solutions',
      options: [
        {
          value: 'Build',
          label: 'Build'
        },
        {
          value: 'Deploy',
          label: 'Deploy'
        },
        {
          value: 'Observe',
          label: 'Observe'
        },
        {
          value: 'Secure',
          label: 'Secure'
        }
      ]
    },
    {
      id: 'product',
      label: 'Product',
      allLabel: 'All products',
      options: [
        {
          value: 'AI Inference',
          label: 'AI Inference'
        },
        {
          value: 'Application Accelerator',
          label: 'Application Accelerator'
        },
        {
          value: 'Applications',
          label: 'Applications'
        },
        {
          value: 'Bot Manager',
          label: 'Bot Manager'
        },
        {
          value: 'Cache',
          label: 'Cache'
        },
        {
          value: 'Edge DNS',
          label: 'Edge DNS'
        },
        {
          value: 'Firewall',
          label: 'Firewall'
        },
        {
          value: 'Functions',
          label: 'Functions'
        },
        {
          value: 'Image Processor',
          label: 'Image Processor'
        },
        {
          value: 'Real-Time Events',
          label: 'Real-Time Events'
        },
        {
          value: 'Real-Time Metrics',
          label: 'Real-Time Metrics'
        },
        {
          value: 'WAF',
          label: 'WAF'
        }
      ]
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <StoryLibrary
      anchor="cases"
      title="Companies building with Azion"
      :items="items"
      :facets="facets"
      search-placeholder="Search by company or story"
      search-aria-label="Search success stories"
      empty-title="No stories match these filters."
      empty-action-label="View all success stories"
      link-label="Read story"
      more-label="Load more"
      aria-label="Success stories"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
