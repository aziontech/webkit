<script setup>
  import PricingCard from '@aziontech/webkit/pricing-card'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <PricingCard
      actions-position="bottom"
      variant="contained"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <PricingCard
      actions-position="bottom"
      variant="ghost"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <PricingCard
      actions-position="middle"
      variant="contained"
      title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <PricingCard
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
