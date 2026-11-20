<script setup>
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'

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
  <PlanFeatureList
    :items="features"
    :columns="2"
    aria-label="Pro plan features"
  />
</template>
