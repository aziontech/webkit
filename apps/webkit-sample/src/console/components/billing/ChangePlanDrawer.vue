<script setup>
  // Change Plan — the three tiers side by side, opened when the console has to say
  // "not on this contract".
  //
  // It is the CONSOLE's plan surface, and it is deliberately a different screen from
  // the entrance's plan step (./OnboardingPlanStep.vue): a first-time user is asked
  // what they are working on and the tier is the consequence, because they do not yet
  // think in tiers. Somebody who has been operating an account for six months and
  // just hit a limit does — they want the three columns, the prices, and what each
  // one includes. Same data behind both (../../plans.js), two readings of it.
  //
  // ── IT ONLY EVER OPENS FOR A REASON ──
  //
  // Nothing in this console links to "Change plan" as a page. The drawer opens
  // because an action was refused — today, creating a second organization on Hobby
  // (../shell/TenancySwitcher.vue) — so it is handed the sentence that says which action, and it
  // says it above the cards. A pricing table with no such line is a page that appeared
  // for no reason the reader can name.
  //
  // ── UPGRADING IS THE PATTERN WE ALREADY HAVE ──
  //
  // Choosing a paid tier here does NOT change the plan: it opens the same
  // ./PlanUpgradeDrawer.vue the onboarding flow uses, and only completing that makes
  // the tier stick (../../lib/sample-preset.js). One payment surface for the whole
  // sample — the alternative is two places where a contract can be agreed to, which
  // is exactly the thing a billing flow must not have.
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

  defineProps({
    // THE TITLE IS THE TRIGGER'S QUESTION, not the mechanism.
    //
    // "Change Plan" describes what this drawer does to the account; the reader did
    // not come here to change a plan, they came here because they wanted another
    // organization. So the caller names the want — "Need more organizations?" — and
    // the cards answer it. The default stays generic for a caller with no question
    // to state, but every real trigger has one.
    title: { type: String, default: 'Change plan' },
    // Optional supporting line under the title, for a trigger whose title cannot
    // carry the whole reason on its own. Omitted, nothing renders.
    reason: { type: String, default: '' }
  })

  const open = defineModel('open', { type: Boolean, default: false })

  // `upgraded` carries the tier that was paid for, so the caller can finish what the
  // reader was doing when they were stopped. The drawer never navigates itself: it
  // does not know what the refused action was, only that it is now allowed.
  const emit = defineEmits(['upgraded'])

  const { plan: currentPlanId, setPlan } = useSamplePreset()

  // Billing period, shared by every card. The options come from a plan's own charge
  // table rather than being written here, so a period added to ../../plans.js appears
  // on the control with no edit.
  const billingOptions = computed(
    () => azionPlans.find((entry) => entry.charge)?.charge.periods ?? []
  )

  const period = ref('yearly')

  const currentIndex = computed(() =>
    azionPlans.findIndex((entry) => entry.id === currentPlanId.value)
  )

  // What each card's button says, keyed by what pressing it does. A lookup rather
  // than nested ternaries in the template: the four cases are the four outcomes, and
  // they read as a list.
  // Console casing, not the pricing page's uppercase mono ("COMECE COM PRO"). The
  // page's actions are a marketing voice; a button in the console reads the way every
  // other button in the console reads (see the `webkit-microcopy` skill).
  const ACTION_LABELS = {
    current: () => 'Current plan',
    contact: () => 'Contact sales',
    upgrade: (name) => `Continue with ${name}`,
    downgrade: (name) => `Move to ${name}`
  }

  // What each card renders. `value` is the tier's headline price as ../../plans.js
  // states it ("Free", "From $20/mo"), and the period control drives the line BELOW
  // it — the charge for the period in force. A card whose big number changed with the
  // toggle would be claiming a different price per tier per period, which is not what
  // the charge table says.
  const cards = computed(() =>
    azionPlans.map((entry, index) => {
      const isCurrent = entry.id === currentPlanId.value
      const isUp = index > currentIndex.value
      // The figure DECOMPOSED, so CardPricing's Currency typesets it — symbol,
      // amount and period as three parts (../../plans.js § card). Handing it the
      // whole "From $20/mo" string with the prefix off would render money as prose.
      // Keyed by the period in force, so the toggle moves the figure and its caveat.
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
        // The caveat qualifies what the figure means on the term in force ("Billed
        // annually, save 20%") — the same line the pricing page carries, moving with
        // the same toggle. It is the card's ONE prose region now (the description band
        // above the price is gone), so a tier with no caveat falls back to its own
        // positioning line rather than showing an empty band: Hobby is free, and
        // "billed annually" would be a lie. The band is reserved either way, so the
        // row still aligns.
        details: card.details || entry.description || '',
        // The five claims the pricing page makes for the tier, glyph and all. Read from
        // `comparison` rather than the upgrade checklist: the checklist is metered
        // allowances ("100 Workloads, then $0.10 each"), which answers "what will this
        // cost me" — the right question one screen later, in the upgrade drawer. Here
        // the question is "which tier", so the card lists what the tier is FOR.
        featuresTitle: entry.comparison?.featuresTitle ?? '',
        features: entry.comparison?.features ?? [],
        isCurrent,
        // Three answers, in order of what the tier can be entered BY:
        //   contact    · a sales-led tier (../../plans.js § contactSales) — negotiated
        //                terms, so there is no card to enter and no button that can
        //                agree to them.
        //   downgrade  · leaving a contract is not a purchase, so it needs no payment
        //                surface and takes effect on the spot.
        //   upgrade    · the only one that opens the payment drawer.
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

  // The upgrade drawer, handed the tier the reader picked.
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

  // Paid. The tier sticks, both panels close, and the caller resumes the action that
  // was refused — announced by the caller, not here, because only it knows what that
  // action was.
  const onUpgraded = ({ planId }) => {
    setPlan(planId)
    upgradeOpen.value = false
    open.value = false
    emit('upgraded', planId)
  }

  // A dismissed upgrade leaves the plan exactly as it was and the reader back on the
  // three cards — the same "cancelling is not a half-agreed contract" rule the
  // onboarding step follows.
  const onUpgradeOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (!isOpen) upgradePlanId.value = ''
  }

  // Every open starts on the period the account is most likely to want to see.
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

        <!-- The stack lives INSIDE PanelContent: in a drawer PanelContent is a
             ScrollArea around its own padded div, so a class passed to it formats
             the scroller instead of this content. -->
        <PanelContent>
          <div class="flex flex-col items-center gap-(--spacing-md)">
            <!-- Only when the caller has something to say. The title already states
                 why the drawer opened, and a paragraph restating it in longer words
                 is the kind of copy a reader learns to skip. -->
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
              <!-- `aligned` is what puts the three cards on one grid: `bottom` sizes a
                   card by its own content, so without it each region inherits whatever
                   height its own copy wrapped to and the row staggers — Pro's caveat
                   runs one line, Enterprise's two, Hobby has none, and the feature
                   lists and buttons end up on three different lines. The prop reserves
                   each prose band inside the component, which is the only place that
                   can be done: the regions are CardPricing's, and the arbitrary-variant
                   selector this used to carry reached past the component's API into its
                   internal `data-testid`s to fake it. -->
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
                <!-- What the tier is FOR, as the pricing page states it: a lead-in
                     that frames the five claims under it, and one product glyph per
                     claim. The glyph is per-feature rather than a repeated checkmark —
                     five identical ticks carry no information beyond "included", while
                     the product mark says WHICH capability the line is about, which is
                     the thing a reader comparing tiers is scanning for.
                     Same copy, same glyphs, same treatment as @site/components/AzionPricing.vue:
                     one comparison, two surfaces. Only `slotPosition` differs — the
                     drawer is a compact `bottom` card, the marketing band a full
                     `middle` one. -->
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
                      <!-- The whole icon-font class comes from the data ('pi pi-globe',
                           'ai ai-workloads'): the `pi` / `ai` prefix is half of it, and
                           binding only the name renders an empty box.
                           `--primary` like the pricing page: the glyph is the one accent
                           in the card and it is what makes the five lines scan as a list
                           of capabilities rather than as a paragraph. It is `aria-hidden`
                           with the label beside it, so the colour carries no meaning on
                           its own. `items-start` + the half-line nudge sits it on the
                           label's first line, which is what keeps a wrapping label from
                           dragging its glyph to the middle. -->
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

                <!-- One filled button in the drawer at most — the upgrade that can
                     actually be completed here. Contact Sales and Downgrade are
                     outlined: neither is the purchase this screen is offering, and
                     three filled buttons side by side name no primary action at
                     all. -->
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

  <!-- The payment surface, shared with onboarding. It stacks over this drawer on
       purpose: backing out returns to the comparison, which is where the decision
       is being made. -->
  <PlanUpgradeDrawer
    :open="upgradeOpen"
    :plan-id="upgradePlanId"
    @update:open="onUpgradeOpenChange"
    @confirm="onUpgraded"
  />
</template>
