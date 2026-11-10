<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <CardPricing
      aligned
      plan-title="Hobby"
      pricing-details=""
      value="Free"
      prefix=""
      suffix=""
      action-label="Start for free"
    />
    <CardPricing
      aligned
      show-tag
      tag-label="Popular"
      plan-title="Pro"
      pricing-details="Billed annually, save 20%"
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Continue with Pro"
    />
    <CardPricing
      aligned
      plan-title="Enterprise"
      pricing-details="Tailored to your usage requirements and payment terms"
      value="Custom"
      prefix=""
      suffix=""
      action-label="Talk to a specialist"
    />
  </div>
</template>
