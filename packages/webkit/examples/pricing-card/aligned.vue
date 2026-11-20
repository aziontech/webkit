<script setup>
  import PricingCard from '@aziontech/webkit/pricing-card'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <PricingCard
      equal-height
      title="Hobby"
      pricing-details=""
      value="Free"
      prefix=""
      suffix=""
      action-label="Start for free"
    />
    <PricingCard
      equal-height
      show-tag
      tag-label="Popular"
      title="Pro"
      pricing-details="Billed annually, save 20%"
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Continue with Pro"
    />
    <PricingCard
      equal-height
      title="Enterprise"
      pricing-details="Tailored to your usage requirements and payment terms"
      value="Custom"
      prefix=""
      suffix=""
      action-label="Talk to sales"
    />
  </div>
</template>
