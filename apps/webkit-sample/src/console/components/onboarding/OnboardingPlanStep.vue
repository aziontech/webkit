<script setup>
  // Step 2 of onboarding — which Azion plan the organization starts on.
  //
  // The question is NOT "which tier do you want". Nobody arriving for the first
  // time thinks in tiers, and a tier list makes the user reverse-engineer which
  // description matches their situation before they can answer. So each row is a
  // sentence about their own work — "I'm working on personal projects" — and the
  // tier it resolves to rides the row as a tag, on the right, where it is read as
  // the CONSEQUENCE of the answer rather than as the question. One question, two
  // things learned: the plan, and what the user is here to build.
  //
  // BoxGridSelection rather than FieldRadioBlock, deliberately. Both are the DS's
  // selectable-block treatment and both are a real radiogroup; the difference is
  // that BoxGridSelection lets the row's content be composed, which is the only way
  // the tier tag can sit at the row's trailing edge. It arrives as a wrap-grid, so
  // `flex-col` turns it into the full-width row list this step wants — the options
  // are already `items-stretch`, so they fill the column. It brings its own roving
  // tabindex, arrow-key navigation and `aria-checked`.
  //
  // Nothing is pre-selected, and that is the point of the step. A seeded tier is a
  // contract nobody chose, agreed to by pressing Continue — so an untouched step
  // fails Continue with the amber `required` prompt every other field in this flow
  // uses, and the user picks.
  //
  // ── A PAID TIER GOES THROUGH THE DRAWER ──
  //
  // Selecting a plan whose `requiresPayment` is true does not select it: it opens
  // the upgrade drawer, and only paying there makes the choice stick. Hobby is
  // free, so it selects immediately.
  //
  // The selection is therefore held in TWO places on purpose. `form.plan` is the
  // committed answer — the one the wizard validates and the one the organization
  // is created on — and it is only ever written by a completed payment (or by
  // choosing the free tier). `pendingPlanId` is the row the user is looking at
  // while the drawer is open. Backing out of the drawer clears the pending value
  // and leaves the committed one exactly as it was, which is what makes cancelling
  // read as "I did not choose this" rather than as a half-selected contract.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import HelperText from '@aziontech/webkit/helper-text'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref } from 'vue'

  import { useOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import { azionPlans, planRequiresPayment } from '../../lib/data/plans.js'
  import PlanUpgradeDrawer from '../billing/PlanUpgradeDrawer.vue'

  // The flow owns the answers; the step reads and writes them.
  const { form, errors, locked, confirmPlan } = useOnboardingForm()

  // The row the drawer is open for. Empty when it is closed.
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const groupRef = ref(null)

  // Return focus to the row that opened the drawer.
  //
  // An overlay owes the keyboard two things: a trap while it is open, and the
  // focus back where it came from on close. The Drawer does the first, and does
  // the second by returning focus to its own trigger — but this drawer has no
  // trigger. It is opened by SELECTING a row, so there is no button for the DS to
  // remember, and focus would otherwise land on `<body>`: a keyboard user who
  // dismissed the drawer would be back at the top of the document with their place
  // in the form gone.
  const focusRow = async (planId) => {
    await nextTick()
    const index = azionPlans.findIndex((plan) => plan.id === planId)
    if (index < 0) return
    groupRef.value?.$el?.querySelectorAll('[role="radio"]')?.[index]?.focus()
  }

  // What the radiogroup shows as checked: the committed plan, or the row being
  // paid for while the drawer is open.
  const selectedPlanId = computed(() => pendingPlanId.value || form.plan)

  const select = (planId) => {
    errors.plan = ''
    if (!planRequiresPayment(planId)) {
      // Free tier: no drawer, and it also clears any paid tier chosen earlier.
      form.plan = planId
      return
    }
    pendingPlanId.value = planId
    upgradeOpen.value = true
  }

  // Paid. The flow decides what happens next (it advances the wizard); all that
  // happens here is that the pending row becomes the committed answer.
  const onConfirm = ({ planId }) => {
    pendingPlanId.value = ''
    confirmPlan(planId)
  }

  // Closed without paying — including Escape, the overlay and the X. The pending
  // row is dropped, so the group falls back to whatever was committed before,
  // which for a first-time user is nothing at all.
  const onOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (isOpen) return
    const dismissed = pendingPlanId.value
    pendingPlanId.value = ''
    // Only when the drawer was dismissed. On a successful upgrade the step is
    // already unmounting, and the flow moves focus to the next step's heading.
    if (dismissed) focusRow(dismissed)
  }

  // BoxGridSelection takes `{ value, label }`; the plan's `headline` is the label
  // the user reads and `ariaLabel` states both halves, so a screen reader hears the
  // tier it is choosing and not only the sentence.
  const items = azionPlans.map((plan) => ({
    value: plan.id,
    label: plan.headline,
    description: plan.description,
    ariaLabel: `${plan.headline}. ${plan.name} plan, ${plan.price}.`
  }))

  const planFor = (value) => azionPlans.find((plan) => plan.id === value)
</script>

<template>
  <div class="flex flex-col gap-[var(--spacing-xs)]">
    <!-- `:model-value` + `@update:model-value` rather than `v-model`, deliberately:
         choosing a paid row must not write the answer, it must open the drawer, so
         the group's selection is DERIVED (committed plan, or the row being paid
         for) and every change is routed through `select`. A plain v-model would
         commit the tier the moment the row was clicked, and the user would be on
         Pro whether or not they ever paid. -->
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
        <!-- The option is a flex column, so this one child stretches to the row's
             full width: the tier tag lands on the trailing edge whatever the
             sentence's length. -->
        <div class="flex w-full items-center justify-between gap-[var(--spacing-sm)]">
          <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
            <span class="text-body-sm text-[var(--text-default)]">{{ item.label }}</span>
            <span class="text-body-xs text-[var(--text-muted)]">{{ item.description }}</span>
          </div>
          <!-- Tier over price, right-aligned and shrink-0: the tag answers "what
               am I on" and the line under it "what does it cost", which are the
               only two things the user needs before pressing Continue. -->
          <div class="flex shrink-0 flex-col items-end gap-[var(--spacing-xxs)]">
            <Tag
              :label="planFor(item.value).name"
              :severity="planFor(item.value).severity"
              size="small"
              rounded
            />
            <span class="text-label-sm text-[var(--text-muted)]">
              {{ planFor(item.value).price }}
            </span>
          </div>
        </div>
      </template>
    </BoxGridSelection>

    <!-- Only after a failed Continue, and it goes away while the scope is locked,
         like every other guidance line in this flow. -->
    <HelperText
      v-if="errors.plan && !locked"
      kind="required"
      :label="errors.plan"
    />

    <!-- One drawer for every paid tier: which one it is showing is the plan id it
         is given, and all of its content comes from that plan (see plans.js). -->
    <PlanUpgradeDrawer
      :open="upgradeOpen"
      :plan-id="pendingPlanId"
      @update:open="onOpenChange"
      @confirm="onConfirm"
    />
  </div>
</template>
