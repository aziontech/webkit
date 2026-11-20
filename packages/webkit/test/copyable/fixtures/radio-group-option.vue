<script setup lang="ts">
  import RadioGroup, { type RadioGroupOption } from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  interface Plan extends RadioGroupOption {
    value: 'free' | 'pro'
    price: number
  }

  const plan = ref<Plan['value']>('free')
  const plans: Plan[] = [
    { value: 'free', label: 'Free', price: 0 },
    { value: 'pro', label: 'Pro', price: 20 }
  ]
  const onPlan = (value: Plan['value'] | undefined): void => {
    if (value) plan.value = value
  }
</script>

<template>
  <RadioGroup
    v-model="plan"
    variant="card"
    :options="plans"
    aria-label="Plan"
  >
    <template #tag="{ option, selected }">
      <span :data-selected="selected">{{ option.price.toFixed(2) }}</span>
      <span>
        <!-- @vue-expect-error a field the option does not have -->
        {{ option.missing }}
      </span>
    </template>
  </RadioGroup>
  <RadioGroup
    :model-value="plan"
    :options="plans"
    aria-label="Plan"
    @update:model-value="onPlan"
  />
  <!-- @vue-expect-error update:modelValue sends the options' value union, not a number -->
  <RadioGroup
    :options="plans"
    aria-label="Plan"
    @update:model-value="(value: number) => value"
  />
</template>
