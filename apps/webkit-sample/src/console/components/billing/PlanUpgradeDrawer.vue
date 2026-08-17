<script setup>
  // Upgrade to <plan> — the drawer a paid tier goes through before it counts.
  //
  // Figma node 314:18499. Two columns: the tier's case on the left (what the
  // money buys, and where to read more), the transaction on the right (what is
  // charged, by which card, to which address). The split is the argument of the
  // screen — the user is deciding and paying in one place, so the reasons stay
  // visible while the form is filled instead of being a page they already left.
  //
  // ── NOTHING ABOUT A TIER IS WRITTEN HERE ──
  //
  // Every string in the left column and every figure in the Charged card comes
  // from the selected plan in `plans.js`. This component knows the SHAPE of an
  // upgrade (a lead, a checklist, links, a charge table per billing period), not
  // any tier's content. That is what lets one drawer serve Pro and Enterprise
  // today and a fourth tier tomorrow with no change to this file.
  //
  // ── WHAT SUBMITTING MEANS ──
  //
  // Upgrade confirms the plan and hands control back to the ONBOARDING flow. It
  // does not navigate: the user is three steps into creating an organization, and
  // dropping them somewhere else the moment they pay would abandon a half-built
  // organization and lose the answers they already gave. The wizard decides what
  // happens next (see Onboarding.vue).
  //
  // Cancelling — the button, the X, Escape, or the overlay — leaves the plan
  // UNPAID, and the flow treats that as no plan selected. An unpaid Pro is not a
  // tier anyone is on, so the alternative would be an organization created on a
  // contract nobody agreed to.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Link from '@aziontech/webkit/link'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, reactive, ref, watch } from 'vue'

  import { chargeFor, leadPartsFor, planFor } from '../../lib/data/plans.js'
  import PaymentMethodCard from './PaymentMethodCard.vue'

  const props = defineProps({
    // Which plan is being upgraded to. Everything rendered here reads from it.
    planId: { type: String, default: '' }
  })

  // Two-way open state; the parent binds v-model:open.
  const open = defineModel('open', { type: Boolean, default: false })

  // `confirm` carries the plan that was paid for. A form commit, not a DOM
  // activation, so it takes no event.
  const emit = defineEmits(['confirm'])

  const plan = computed(() => planFor(props.planId))
  const lead = computed(() => leadPartsFor(props.planId))

  // Yearly leads, as in the design: it is the cheaper of the two per month, so
  // opening on Monthly would show the worse deal first and make the discount a
  // thing the user has to go looking for.
  const period = ref('yearly')
  const charge = computed(() => chargeFor(props.planId, period.value))
  const periods = computed(() => plan.value?.charge?.periods ?? [])

  // The address already on the account. Checking the box copies it into the
  // fields below rather than hiding them: the design keeps them visible, and it is
  // right to — this is the address an invoice will carry, so the user should be
  // able to read it without first unchecking something to reveal it.
  const accountAddress = {
    country: 'Brazil',
    postalCode: '01310-100',
    state: 'São Paulo',
    city: 'São Paulo',
    line2: ''
  }

  const blankAddress = () => ({
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line2: ''
  })

  const address = reactive({ useAccountInformation: true, ...accountAddress })

  // Checking fills from the account; unchecking clears, so the user is typing into
  // empty fields instead of correcting someone else's address line by line.
  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress())
  )

  const submitting = ref(false)

  // Value === label, deliberately. `FieldSelect` does not forward `Select`'s
  // `displayValue` formatter, so its trigger renders whatever the model holds —
  // a pre-seeded code shows as "BR" instead of "Brazil" until the list is opened,
  // which is exactly the case here, since the address arrives filled from the
  // account. Storing the display name keeps every field readable on first paint.
  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const stateOptions = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
    { value: 'Minas Gerais', label: 'Minas Gerais' },
    { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' }
  ]
  const cityOptions = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Campinas', label: 'Campinas' },
    { value: 'Santos', label: 'Santos' }
  ]

  // Reopening for a different plan starts clean: a billing period or an address
  // carried over from the tier the user backed out of is a value they never chose
  // for the tier they are looking at.
  watch(open, (isOpen) => {
    if (!isOpen) return
    period.value = 'yearly'
    address.useAccountInformation = true
    Object.assign(address, accountAddress)
    submitting.value = false
  })

  // Mock settlement, the same shape the rest of the sample uses for a request.
  const settle = () => new Promise((resolve) => setTimeout(resolve, 900))

  const cancel = () => {
    if (submitting.value) return
    open.value = false
  }

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    submitting.value = true
    try {
      await settle()
      // The flow owns what happens next; the drawer only reports that the tier
      // was paid for.
      emit('confirm', { planId: props.planId, period: period.value })
      open.value = false
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="plan ? `Upgrade to ${plan.name}` : 'Upgrade'"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <DrawerTitle>Upgrade to {{ plan?.name }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- The two columns of the design. They stack below lg, where the
                 tier's case reads first and the transaction follows it — the same
                 order as the wide layout, read top to bottom instead of left to
                 right. -->
            <div
              class="grid grid-cols-1 gap-[var(--spacing-lg)] lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-[var(--spacing-xl)]"
            >
              <!-- ── Left: what the tier buys ── -->
              <aside
                v-if="plan?.upgrade"
                class="flex flex-col gap-[var(--spacing-md)]"
              >
                <p
                  v-if="lead"
                  class="text-body-sm text-[var(--text-default)]"
                >
                  {{ lead.before }}<span class="text-[var(--text-default)]">{{ lead.name }}</span
                  >{{ lead.after }}
                </p>

                <div class="flex flex-col gap-[var(--spacing-sm)]">
                  <h3 class="text-label-md text-[var(--text-default)]">
                    {{ plan.upgrade.featuresTitle }}
                  </h3>

                  <!-- The checklist. A real list, so a screen reader announces how
                       many things the tier includes instead of reading a run of
                       unrelated lines. -->
                  <ul class="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
                    <li
                      v-for="feature in plan.upgrade.features"
                      :key="feature.title"
                      class="flex items-start gap-[var(--spacing-xs)]"
                    >
                      <i
                        class="pi pi-check mt-[2px] shrink-0 text-[length:var(--text-body-xs)] leading-none text-[var(--success-contrast)]"
                        aria-hidden="true"
                      />
                      <span class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                        <span class="text-body-sm text-[var(--text-default)]">{{
                          feature.title
                        }}</span>
                        <span
                          v-if="feature.detail"
                          class="text-body-xs text-[var(--text-muted)]"
                          >{{ feature.detail }}</span
                        >
                      </span>
                    </li>
                  </ul>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Link
                    v-for="link in plan.upgrade.links"
                    :key="link.label"
                    :label="link.label"
                    :href="link.href"
                    target="_blank"
                    size="small"
                    class="w-fit"
                  />
                </div>
              </aside>

              <!-- ── Right: the transaction ── -->
              <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
                <!-- Charged. The period control sits in the card's header, where
                     it reads as the switch that governs the figures under it. -->
                <CardBox :padded="false">
                  <template #header>
                    <p class="text-label-lg text-[var(--text-default)]">Charged</p>
                    <SegmentedButton
                      v-model="period"
                      :options="periods"
                      aria-label="Billing period"
                    />
                  </template>

                  <template #content>
                    <div
                      v-if="charge"
                      class="flex flex-col"
                    >
                      <div
                        class="flex flex-col gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-lg)]"
                      >
                        <div
                          v-for="row in charge.rows"
                          :key="row.label"
                          class="flex flex-wrap items-baseline justify-between gap-[var(--spacing-sm)]"
                        >
                          <span class="text-body-sm text-[var(--text-muted)]">{{ row.label }}</span>
                          <span class="flex items-baseline gap-[var(--spacing-xs)]">
                            <span class="text-heading-xs text-[var(--text-default)]">{{
                              row.value
                            }}</span>
                            <span
                              v-if="row.suffix"
                              class="text-body-sm text-[var(--text-muted)]"
                              >{{ row.suffix }}</span
                            >
                          </span>
                        </div>
                      </div>

                      <Divider />

                      <!-- The total is the one figure the user is agreeing to, so
                           it gets its own band and the largest type in the card. -->
                      <div
                        class="flex flex-wrap items-baseline justify-between gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-lg)]"
                      >
                        <span class="text-heading-xs text-[var(--text-default)]">Total</span>
                        <span class="flex items-baseline gap-[var(--spacing-xs)]">
                          <span class="text-heading-md text-[var(--text-default)]">{{
                            charge.total.value
                          }}</span>
                          <span class="text-body-sm text-[var(--text-muted)]">{{
                            charge.total.suffix
                          }}</span>
                        </span>
                      </div>
                    </div>
                  </template>
                </CardBox>

                <PaymentMethodCard :disabled="submitting" />

                <CardBox
                  title="Address information"
                  :padded="false"
                >
                  <template #content>
                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 px-[var(--spacing-lg)] py-[var(--spacing-lg)]"
                      :disabled="submitting"
                    >
                      <legend class="sr-only">Address information</legend>

                      <FieldCheckbox
                        v-model="address.useAccountInformation"
                        label="Use the same information as my account"
                        description="Uncheck to bill this organization at a different address."
                        input-id="upgrade-same-address"
                        name="useAccountInformation"
                      />

                      <!-- Always visible, as the design has them: this is the
                           address the invoice will carry, so it is shown whether it
                           came from the account or was typed here. The checkbox
                           fills or clears it (see the watcher); it never hides it. -->
                      <div class="grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-2">
                        <FieldSelect
                          v-model="address.country"
                          label="Country"
                          :options="countryOptions"
                          input-id="upgrade-country"
                          placeholder="Select an option"
                          size="large"
                        />
                        <FieldText
                          v-model="address.postalCode"
                          label="Postal Code"
                          input-id="upgrade-postal-code"
                          name="postalCode"
                          size="large"
                          placeholder="00000-000"
                          autocomplete="postal-code"
                        />
                        <FieldSelect
                          v-model="address.state"
                          label="State/Region"
                          :options="stateOptions"
                          input-id="upgrade-state"
                          placeholder="Select an option"
                          size="large"
                        />
                        <FieldSelect
                          v-model="address.city"
                          label="City"
                          :options="cityOptions"
                          input-id="upgrade-city"
                          placeholder="Select an option"
                          size="large"
                        />
                      </div>

                      <FieldText
                        v-model="address.line2"
                        label="Apartment, floor, etc."
                        input-id="upgrade-address-line-2"
                        name="addressLine2"
                        size="large"
                        placeholder="Optional"
                        autocomplete="address-line2"
                      />
                    </fieldset>
                  </template>
                </CardBox>
              </div>
            </div>
          </PanelContent>

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <!-- "Upgrade", as the design has it: the drawer's title already says
                 which tier, so repeating it on the button would be the only place
                 the tier is stated twice on one screen. -->
            <Button
              class="w-full md:w-auto"
              label="Upgrade"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Upgrade
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
