<script setup>
  import ComparePlans from '@aziontech/webkit/compare-plans'

  const plans = [
    {
      id: 'hobby',
      name: 'Hobby',
      description: 'For side projects.',
      action: { label: 'Start for free', href: '/signup' }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For teams in production.',
      highlighted: true,
      action: { label: 'Start trial', href: '/signup?plan=pro' }
    }
  ]

  const sections = [
    {
      eyebrow: 'Compute',
      title: 'Functions',
      description: 'Run code close to users.',
      rows: [
        { label: 'Requests per month', values: ['1M', '10M'] },
        { label: 'Custom domains', values: [true, true] },
        { label: 'Usage alerts', values: ['—', true] }
      ],
      link: { label: 'See compute rates', href: '/pricing/compute' }
    },
    {
      eyebrow: 'Storage',
      title: 'Object Storage',
      rows: [
        { label: 'Storage included', values: ['5 GB', '100 GB'] },
        { label: 'Versioning', values: ['—', true] }
      ],
      link: { label: 'See storage rates', href: '/pricing/storage' }
    }
  ]
</script>

<template>
  <ComparePlans
    caption="Hobby and Pro compared feature by feature"
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="plans"
    :sections="sections"
  />
</template>
