<script setup>
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'

  const features = [
    { label: 'Unlimited applications' },
    { label: 'Unlimited workloads' },
    { label: 'Custom domains' },
    { label: 'Priority support' },
    { label: 'Real-Time Metrics' },
    { label: 'Data Stream' },
    { label: 'Web Application Firewall' },
    { label: 'Team permissions' }
  ]
</script>

<template>
  <PlanFeatureList
    :items="features"
    :columns="2"
    aria-label="Pro plan features"
  />
</template>
