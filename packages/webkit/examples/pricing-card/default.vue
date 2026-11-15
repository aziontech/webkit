<script setup>
  import PricingCard from '@aziontech/webkit/pricing-card'
</script>

<template>
  <PricingCard
    title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    actions-position="bottom"
    variant="contained"
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
</template>
