<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <CardPricing
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    slot-position="bottom"
    kind="contained"
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
</template>
