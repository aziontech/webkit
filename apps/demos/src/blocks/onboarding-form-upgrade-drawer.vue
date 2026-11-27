<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Link from '@aziontech/ui/link'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import PlanFeatureList from '@aziontech/ui/plan-feature-list'
  import Separator from '@aziontech/ui/separator'
  import { computed } from 'vue'

  import { pricingLinks } from './onboarding-form.onboarding-form-data'
  import type {
    OnboardingFormAddress,
    OnboardingFormBillingPeriod,
    OnboardingFormPlan
  } from './onboarding-form.vue'
  import UpgradeAddressCard from './onboarding-form-upgrade-address-card.vue'
  import UpgradeChargeCard from './onboarding-form-upgrade-charge-card.vue'
  import UpgradePaymentCard, {
    type OnboardingFormCard
  } from './onboarding-form-upgrade-payment-card.vue'

  const props = defineProps<{ open: boolean; upgrade: OnboardingFormPlan | undefined }>()

  const emit = defineEmits<{ 'update:open': [open: boolean]; confirm: [] }>()

  const period = defineModel<OnboardingFormBillingPeriod>('period', { required: true })
  const card = defineModel<OnboardingFormCard>('card', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })
  const address = defineModel<OnboardingFormAddress & { useAccountInformation: boolean }>(
    'address',
    {
      required: true
    }
  )

  const upgradeFeatures = computed(() => props.upgrade?.features ?? [])
  const charge = computed(() => props.upgrade?.charge?.[period.value] ?? null)
</script>

<template>
  <Drawer
    :open="open"
    size="large"
    side="end"
    @update:open="(next) => emit('update:open', next)"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="upgrade ? 'Upgrade to ' + upgrade.name : 'Upgrade'"
        novalidate
        @submit.prevent="emit('confirm')"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upgrade to {{ upgrade?.name }}</DrawerTitle>
        </PanelHeader>

        <PanelBody>
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
          >
            <aside
              v-if="upgrade"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div class="flex flex-col gap-(--spacing-xs)">
                <h3
                  class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:py-(--spacing-sm)"
                >
                  What's included
                </h3>

                <div class="px-(--spacing-xs)">
                  <PlanFeatureList :items="upgradeFeatures" />
                </div>
              </div>

              <div class="flex flex-col gap-(--spacing-xs)">
                <Separator />
                <div
                  v-for="link in pricingLinks"
                  :key="link.label"
                  class="ms-(--spacing-xs) w-fit"
                >
                  <Link
                    :label="link.label"
                    :href="link.href"
                    target="_blank"
                    size="small"
                    class="w-full"
                  />
                </div>
              </div>
            </aside>

            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <UpgradeChargeCard
                v-model:period="period"
                :charge="charge"
              />

              <UpgradePaymentCard
                v-model:card="card"
                v-model:editing="editing"
              />

              <UpgradeAddressCard v-model:address="address" />
            </div>
          </div>
        </PanelBody>

        <PanelFooter>
          <div
            class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
          >
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="emit('update:open', false)"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Upgrade"
                variant="primary"
                size="medium"
                type="submit"
              />
            </div>
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
