<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <CardPricing
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    show-tag
    tag-label="Popular"
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
</template>
