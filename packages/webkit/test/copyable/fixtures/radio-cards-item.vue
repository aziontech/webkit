<script setup lang="ts">
  import RadioCards, { type RadioCardsItem } from '@aziontech/webkit/radio-cards'
  import { ref } from 'vue'

  interface Plan extends RadioCardsItem {
    value: 'free' | 'pro'
    price: number
  }

  const plan = ref<Plan['value']>('free')
  const plans: Plan[] = [
    { value: 'free', label: 'Free', price: 0 },
    { value: 'pro', label: 'Pro', price: 20 }
  ]
  const onPlan = (value: Plan['value']): void => {
    plan.value = value
  }
</script>

<template>
  <RadioCards
    v-model="plan"
    :items="plans"
    aria-label="Plan"
  >
    <template #tag="{ item, selected }">
      <span :data-selected="selected">{{ item.price.toFixed(2) }}</span>
      <span>
        <!-- @vue-expect-error a field the item does not have -->
        {{ item.missing }}
      </span>
    </template>
  </RadioCards>
  <RadioCards
    :model-value="plan"
    :items="plans"
    aria-label="Plan"
    @update:model-value="onPlan"
  />
  <!-- @vue-expect-error update:modelValue sends the items' value union, not a number -->
  <RadioCards
    :items="plans"
    aria-label="Plan"
    @update:model-value="(value: number) => value"
  />
</template>
