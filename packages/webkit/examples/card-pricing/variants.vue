<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <CardPricing
      actions-position="bottom"
      variant="contained"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      actions-position="bottom"
      variant="ghost"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      actions-position="middle"
      variant="contained"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      actions-position="middle"
      variant="ghost"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
  </div>
</template>
