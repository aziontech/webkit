<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <CardPricing
      slot-position="bottom"
      kind="contained"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="bottom"
      kind="transparent"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="middle"
      kind="contained"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="middle"
      kind="transparent"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
  </div>
</template>
