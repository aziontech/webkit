<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import type {
    OnboardingFormBillingPeriod,
    OnboardingFormCharge
  } from '../account-onboarding-form.vue'
  import { periods } from '../onboarding-form-data'

  defineProps<{ charge: OnboardingFormCharge | null }>()

  const period = defineModel<OnboardingFormBillingPeriod>('period', { required: true })
</script>

<template>
  <Card :padded="false">
    <template #header>
      <p class="text-label-lg text-(--text-default)">Charged</p>
      <ToggleGroup
        v-model="period"
        :options="periods"
        aria-label="Billing period"
      />
    </template>

    <template #default>
      <div
        v-if="charge"
        class="flex flex-col"
      >
        <div class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)">
          <div
            v-for="row in charge.rows"
            :key="row.label"
            class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
          >
            <span class="text-body-sm text-(--text-muted)">{{ row.label }}</span>
            <span class="flex items-baseline gap-(--spacing-xs)">
              <span class="text-label-md text-(--text-default)">{{ row.value }}</span>
              <span
                v-if="row.suffix"
                class="text-body-sm text-(--text-muted)"
                >{{ row.suffix }}</span
              >
            </span>
          </div>
        </div>

        <Separator />

        <div
          class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm) px-(--spacing-lg) py-(--spacing-lg)"
        >
          <span class="text-title-sm text-(--text-default)">Total</span>
          <span class="flex items-baseline gap-(--spacing-xs)">
            <span class="text-heading-xs text-(--text-default)">{{ charge.total.value }}</span>
            <span class="text-body-sm text-(--text-muted)">{{ charge.total.suffix }}</span>
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>
