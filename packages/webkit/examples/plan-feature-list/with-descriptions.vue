<script setup>
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'

  const features = [
    {
      label: 'Unlimited applications',
      description: 'Deploy as many applications as your projects need.'
    },
    {
      label: 'Custom domains',
      description: 'Serve every application from your own domain, with managed certificates.'
    },
    {
      label: 'Priority support',
      description: 'Reach the support team by chat and get an answer within one business day.'
    }
  ]
</script>

<template>
  <PlanFeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
