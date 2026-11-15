<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <CardPricing
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
