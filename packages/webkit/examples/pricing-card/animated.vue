<script setup>
  import PricingCard from '@aziontech/webkit/pricing-card'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  const period = ref('monthly')

  const periods = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ]

  const price = computed(() =>
    period.value === 'yearly'
      ? { value: '200', suffix: '/ year', details: 'Billed once a year. Two months free.' }
      : { value: '20', suffix: '/ mon', details: 'Billed every month. Cancel anytime.' }
  )
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col items-start gap-(--spacing-md)">
    <ToggleGroup
      v-model="period"
      :options="periods"
      aria-label="Billing period"
    />
    <PricingCard
      animated
      title="Pro"
      prefix="$"
      :value="price.value"
      :suffix="price.suffix"
      :pricing-details="price.details"
      action-label="Upgrade to Pro"
    />
  </div>
</template>
