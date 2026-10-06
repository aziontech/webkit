<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'

  import { azionPlans, cardFor } from '../../lib/data/plans'
  import { useSamplePreset } from '../../lib/state/sample-preset'
  import PlanUpgradeDrawer from './PlanUpgradeDrawer.vue'

  interface Props {
    title?: string
    reason?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Change plan',
    reason: ''
  })

  const open = defineModel('open', { type: Boolean, default: false })

  const emit = defineEmits<{
    upgraded: [planId: unknown]
  }>()

  const { plan: currentPlanId, setPlan } = useSamplePreset()

  const billingOptions = computed(
    () => azionPlans.find((entry) => entry.charge)?.charge.periods ?? []
  )

  const period = ref('yearly')

  const currentIndex = computed(() =>
    azionPlans.findIndex((entry) => entry.id === currentPlanId.value)
  )

  const ACTION_LABELS = {
    current: () => 'Current plan',
    contact: () => 'Contact sales',
    upgrade: (name) => `Continue with ${name}`,
    downgrade: (name) => `Move to ${name}`
  }

  const cards = computed(() =>
    azionPlans.map((entry, index) => {
      const isCurrent = entry.id === currentPlanId.value
      const isUp = index > currentIndex.value
      const card = cardFor(entry.id, period.value)
      return {
        id: entry.id,
        name: entry.name,
        description: entry.description,
        value: card.value,
        prefix: card.prefix ?? '$',
        suffix: card.suffix ?? '',
        showPrefix: card.showPrefix !== false,
        showSuffix: card.showSuffix !== false && Boolean(card.suffix),
        details: card.details || entry.description || '',
        featuresTitle: entry.comparison?.featuresTitle ?? '',
        features: entry.comparison?.features ?? [],
        isCurrent,
        action: isCurrent
          ? 'current'
          : entry.contactSales
            ? 'contact'
            : isUp
              ? 'upgrade'
              : 'downgrade'
      }
    })
  )

  const upgradePlanId = ref('')
  const upgradeOpen = ref(false)

  const choose = (card) => {
    if (card.action === 'current') return
    if (card.action === 'contact') {
      open.value = false
      toast.info('Sales will get in touch.', {
        description: `${card.name} is a negotiated contract — volume, SLAs and support are agreed before it starts.`
      })
      return
    }
    if (card.action === 'downgrade') {
      setPlan(card.id)
      open.value = false
      toast.success(`Moved to ${card.name}.`, {
        description: 'The console now shows what this contract includes.'
      })
      return
    }
    upgradePlanId.value = card.id
    upgradeOpen.value = true
  }

  const onUpgraded = ({ planId }) => {
    setPlan(planId)
    upgradeOpen.value = false
    open.value = false
    emit('upgraded', planId)
  }

  const onUpgradeOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (!isOpen) upgradePlanId.value = ''
  }

  watch(open, (isOpen) => {
    if (isOpen) period.value = 'yearly'
  })
</script>

<template>
  <Drawer
    v-model:open="open"
    side="right"
    size="large"
    data-testid="change-plan-drawer"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent aria-label="Change plan">
        <PanelHeader class="w-full">
          <DrawerTitle>{{ title }}</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <div class="flex flex-col items-center gap-(--spacing-md)">
            <DrawerDescription
              v-if="reason"
              class="m-0 w-full text-body-sm text-(--text-muted)"
            >
              {{ reason }}
            </DrawerDescription>

            <SegmentedButton
              v-model="period"
              :options="billingOptions"
              aria-label="Billing period"
            />

            <div
              class="flex w-full min-w-0 flex-col items-stretch justify-center gap-(--spacing-md) lg:flex-row"
            >
              <CardPricing
                v-for="card in cards"
                :key="card.id"
                aligned
                class="w-full! min-w-0 max-w-none flex-1"
                :plan-title="card.name"
                :value="card.value"
                :prefix="card.prefix"
                :suffix="card.suffix"
                :show-prefix="card.showPrefix"
                :show-suffix="card.showSuffix"
                :pricing-details="card.details"
                :show-tag="card.isCurrent"
                tag-label="Current plan"
                slot-position="bottom"
                kind="contained"
                action-label=""
                :data-testid="`change-plan-drawer__plan-${card.id}`"
              >
                <div class="flex w-full flex-col gap-(--spacing-md)">
                  <p
                    v-if="card.featuresTitle"
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    {{ card.featuresTitle }}
                  </p>
                  <ul class="m-0 flex w-full list-none flex-col gap-(--spacing-sm) p-0">
                    <li
                      v-for="feature in card.features"
                      :key="feature.label"
                      class="flex items-start gap-(--spacing-sm)"
                    >
                      <i
                        :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']"
                        aria-hidden="true"
                      />
                      <span class="text-body-sm text-(--text-default)">
                        {{ feature.label }}
                      </span>
                    </li>
                  </ul>
                </div>

                <template #actions>
                  <Button
                    :label="ACTION_LABELS[card.action](card.name)"
                    :kind="card.action === 'upgrade' ? 'primary' : 'outlined'"
                    :disabled="card.isCurrent"
                    size="large"
                    class="w-full"
                    @click="choose(card)"
                  />
                </template>
              </CardPricing>
            </div>
          </div>
        </PanelContent>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>

  <PlanUpgradeDrawer
    :open="upgradeOpen"
    :plan-id="upgradePlanId"
    @update:open="onUpgradeOpenChange"
    @confirm="onUpgraded"
  />
</template>
