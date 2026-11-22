<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Separator from '@aziontech/webkit/separator'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import type {
    ChangePlanDrawerCharges,
    ChangePlanDrawerPeriod
  } from '../account-change-plan-drawer.vue'

  export interface UpgradeChargeCardProps {
    /** The charge card per billing period. */
    chargeCards: Record<ChangePlanDrawerPeriod, ChangePlanDrawerCharges>
    /** The billing periods of the switch. */
    billingPeriods: { value: ChangePlanDrawerPeriod; label: string }[]
    /** Checkout step: the card adds Due today. */
    terms: boolean
  }

  defineProps<UpgradeChargeCardProps>()

  const upgradePeriod = defineModel<ChangePlanDrawerPeriod>('period', { required: true })
</script>

<template>
  <Card :padded="false">
    <template #header>
      <p class="text-label-lg text-(--text-default)">Charged</p>
      <ToggleGroup
        v-model="upgradePeriod"
        :options="billingPeriods"
        aria-label="Billing period"
      />
    </template>
    <template #default>
      <div class="flex flex-col">
        <div class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)">
          <div
            v-for="row in chargeCards[upgradePeriod].rows"
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
          <span class="text-heading-xs text-(--text-default)">Total</span>
          <span class="flex items-baseline gap-(--spacing-xs)">
            <span class="text-heading-xs text-(--text-default)">{{
              chargeCards[upgradePeriod].total.value
            }}</span>
            <span class="text-body-sm text-(--text-muted)">{{
              chargeCards[upgradePeriod].total.suffix
            }}</span>
          </span>
        </div>
        <template v-if="terms">
          <Separator />
          <div class="flex flex-col gap-(--spacing-2xs) px-(--spacing-lg) py-(--spacing-md)">
            <div class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)">
              <span class="text-label-md text-(--text-default)">Due today</span>
              <span class="text-label-md text-(--text-default)">{{
                chargeCards[upgradePeriod].dueToday
              }}</span>
            </div>
            <p class="text-body-xs text-(--text-muted)">
              Taxes are calculated from the address below and shown on the invoice. The plan renews
              {{ upgradePeriod === 'yearly' ? 'every year' : 'every month' }}
              on the day you upgrade; cancel any time from Billing.
            </p>
          </div>
        </template>
      </div>
    </template>
  </Card>
</template>
