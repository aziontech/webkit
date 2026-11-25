<script setup>
  import FeatureTabsSection from '@aziontech/webkit/feature-tabs-section'

  const tabs = [
    {
      title: 'Trace',
      description:
        'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.',
      illustration: 'live-debugging',
      illustrationLabel: 'A time window of requests, errors and events, with its trace bar'
    },
    {
      title: 'Logs',
      description:
        'Structured output on the same clock as the trace, filtered by level, searchable in place.',
      illustration: 'real-time-metrics-error-rate',
      illustrationLabel: 'An error-rate spike with the real-time events behind it'
    },
    {
      title: 'Request path',
      description:
        'The workload, application, function and connector it travelled, each captioned with the time spent there.',
      illustration: 'request-inspection',
      illustrationLabel: 'A request inspected on its way through the platform'
    }
  ]

  const primaryAction = {
    label: 'Open an invocation',
    href: '/product-preview',
    trailing: true
  }
</script>

<template>
  <FeatureTabsSection
    eyebrow="Observability"
    title="Inspect every run end-to-end"
    description="Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach."
    :tabs="tabs"
    :primary-action="primaryAction"
  />
</template>
