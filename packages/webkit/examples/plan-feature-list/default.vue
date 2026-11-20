<script setup>
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' }
  ]
</script>

<template>
  <PlanFeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
