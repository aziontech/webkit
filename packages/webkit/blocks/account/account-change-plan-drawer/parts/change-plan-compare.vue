<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'
  import PricingCard from '@aziontech/webkit/pricing-card'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed } from 'vue'

  import type {
    ChangePlanDrawerPeriod,
    ChangePlanDrawerPlan
  } from '../account-change-plan-drawer.vue'

  export interface ChangePlanCompareProps {
    /** The tiers to compare. */
    plans: ChangePlanDrawerPlan[]
    /** The billing periods of the switch. */
    periods: { value: ChangePlanDrawerPeriod; label: string }[]
  }

  const props = defineProps<ChangePlanCompareProps>()

  const changePlanOpen = defineModel<boolean>('open', { required: true })
  const changePlanPeriod = defineModel<ChangePlanDrawerPeriod>('period', { required: true })

  const emit = defineEmits<{
    choose: [event: MouseEvent, plan: ChangePlanDrawerPlan]
  }>()

  const billingPeriods = computed(() => props.periods)
  const pricedPlans = computed(() =>
    props.plans.map((plan) => ({ ...plan, ...plan.card[changePlanPeriod.value] }))
  )
</script>

<template>
  <Drawer
    v-model:open="changePlanOpen"
    side="end"
    size="large"
  >
    <DrawerContent aria-label="Change plan">
      <PanelHeader class="w-full">
        <DrawerTitle>Change plan</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <div class="@container flex w-full flex-col items-center gap-(--spacing-md)">
          <DrawerDescription class="w-full">
            Compare what each tier includes before moving the account onto it.
          </DrawerDescription>
          <ToggleGroup
            v-model="changePlanPeriod"
            :options="billingPeriods"
            aria-label="Billing period"
          />
          <div
            class="flex w-full min-w-0 flex-col items-stretch justify-center gap-(--spacing-md) @4xl:flex-row"
          >
            <div
              v-for="plan in pricedPlans"
              :key="plan.id"
              class="flex max-w-none min-w-0 flex-1"
            >
              <PricingCard
                equal-height
                class="w-full"
                :title="plan.name"
                :value="plan.value"
                :prefix="plan.prefix"
                :suffix="plan.suffix"
                :show-prefix="plan.showPrefix"
                :show-suffix="plan.showSuffix"
                :pricing-details="plan.details"
                :show-tag="plan.current"
                tag-label="Current plan"
                actions-position="bottom"
                variant="contained"
                action-label=""
              >
                <div class="flex w-full flex-col gap-(--spacing-md)">
                  <p
                    v-if="plan.featuresTitle"
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    {{ plan.featuresTitle }}
                  </p>
                  <PlanFeatureList :items="plan.features" />
                </div>
                <template #actions>
                  <Button
                    :label="plan.actionLabel"
                    :variant="plan.action === 'upgrade' ? 'primary' : 'outline'"
                    :disabled="plan.current"
                    size="large"
                    class="w-full"
                    @click="(event: MouseEvent) => emit('choose', event, plan)"
                  />
                </template>
              </PricingCard>
            </div>
          </div>
        </div>
      </PanelBody>
    </DrawerContent>
  </Drawer>
</template>
