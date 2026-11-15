<script setup>
  import FeatureWidgets from '@aziontech/webkit/feature-widgets'

  const docs = 'https://www.azion.com/en/documentation/products/build/applications/'

  const items = [
    {
      title: 'Cache settings you reuse.',
      description:
        'Set the CDN TTL, stale cache and large file optimization once, then reuse the setting wherever the application needs it.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-cache' } },
      action: { label: 'Docs', href: docs }
    },
    {
      title: 'Rules that decide what is cached.',
      description:
        'Match a path, a method or a header, and attach a cache setting to just that traffic.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-rule' } },
      action: { label: 'Docs', href: docs }
    },
    {
      title: 'Functions for the cases rules miss.',
      description:
        'Rewrite cache headers on the response in a few lines of JavaScript, running in every data center before the response leaves.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-function' } },
      action: { label: 'Docs', href: docs },
      copy: {
        label: 'Copy prompt',
        text: 'Write an Azion function that sets cache-control to public, max-age=3600 on every response from /assets.'
      }
    }
  ]
</script>

<template>
  <FeatureWidgets
    anchor="built-in"
    eyebrow="Built in"
    title="Every cache control in one application"
    description="Cache settings, the rules that apply them and the functions that shape responses live inside the application, versioned and deployed with it."
    :columns="3"
    :items="items"
  />
</template>
