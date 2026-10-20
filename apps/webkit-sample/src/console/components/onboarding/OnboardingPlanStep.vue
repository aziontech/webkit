<script setup>
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import HelperText from '@aziontech/webkit/helper-text'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref } from 'vue'

  import { useOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import { azionPlans, planRequiresPayment } from '../../lib/data/plans.js'
  import PlanUpgradeDrawer from '../billing/PlanUpgradeDrawer.vue'

  const { form, errors, locked, confirmPlan } = useOnboardingForm()

  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const groupRef = ref(null)

  const focusRow = async (planId) => {
    await nextTick()
    const index = azionPlans.findIndex((plan) => plan.id === planId)
    if (index < 0) return
    groupRef.value?.$el?.querySelectorAll('[role="radio"]')?.[index]?.focus()
  }

  const selectedPlanId = computed(() => pendingPlanId.value || form.plan)

  const select = (planId) => {
    errors.plan = ''
    if (!planRequiresPayment(planId)) {
      form.plan = planId
      return
    }
    pendingPlanId.value = planId
    upgradeOpen.value = true
  }

  const onConfirm = ({ planId }) => {
    pendingPlanId.value = ''
    confirmPlan(planId)
  }

  const onOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (isOpen) return
    const dismissed = pendingPlanId.value
    pendingPlanId.value = ''
    if (dismissed) focusRow(dismissed)
  }

  const items = azionPlans.map((plan) => ({
    value: plan.id,
    label: plan.headline,
    description: plan.description,
    ariaLabel: `${plan.headline}. ${plan.name} plan, ${plan.price}.`
  }))

  const planFor = (value) => azionPlans.find((plan) => plan.id === value)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <BoxGridSelection
      ref="groupRef"
      :model-value="selectedPlanId"
      :items="items"
      :disabled="locked"
      class="flex-col"
      aria-label="Plan"
      @update:model-value="select"
    >
      <template #default="{ item }">
        <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <span class="text-body-sm text-(--text-default)">{{ item.label }}</span>
            <span class="text-body-xs text-(--text-muted)">{{ item.description }}</span>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-(--spacing-xxs)">
            <Tag
              :label="planFor(item.value).name"
              :severity="planFor(item.value).severity"
              size="small"
              rounded
            />
            <span class="text-label-sm text-(--text-muted)">
              {{ planFor(item.value).price }}
            </span>
          </div>
        </div>
      </template>
    </BoxGridSelection>

    <HelperText
      v-if="errors.plan && !locked"
      kind="required"
      :label="errors.plan"
    />

    <PlanUpgradeDrawer
      :open="upgradeOpen"
      :plan-id="pendingPlanId"
      @update:open="onOpenChange"
      @confirm="onConfirm"
    />
  </div>
</template>
