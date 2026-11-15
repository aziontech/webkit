<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  const sections: SitePageSection[] = [
    {
      _id: 'faq-section',
      props: {
        anchor: 'faq',
        title: 'Frequently asked questions',
        items: [
          {
            question: 'Can I start without a credit card?',
            answer: 'Yes. The free plan needs only an email address.'
          }
        ]
      }
    },
    {
      _id: 'closing-call-to-action',
      props: {
        variant: 'panel',
        title: 'Ready to join us?',
        description: 'See our open positions and find the right fit.',
        primaryAction: { label: 'See open roles', href: '/careers/jobs', trailing: true }
      }
    },
    {
      _id: 'closing-call-to-action',
      props: {
        variant: 'primary',
        anchor: 'contact',
        title: 'Build, run, and protect applications everywhere.',
        description: 'Get faster launches, lower latency, and less infrastructure overhead.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]

  const legal: SitePageSection[] = [
    {
      _id: 'faq-section',
      props: {
        title: 'Privacy questions',
        items: [
          {
            question: 'Where is my data stored?',
            answer: 'In the regions you choose for each workload.'
          }
        ]
      }
    },
    { _id: 'closing-call-to-action', props: { variant: 'frame' } }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <SitePage :sections="sections" />
    <SitePage :sections="legal" />
  </div>
</template>
