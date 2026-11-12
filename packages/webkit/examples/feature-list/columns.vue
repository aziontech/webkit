<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' },
    { label: 'Real-Time Metrics' },
    { label: 'Data Stream' },
    { label: 'Web Application Firewall' },
    { label: 'Team Permissions' }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    :columns="2"
    aria-label="Pro plan features"
  />
</template>
