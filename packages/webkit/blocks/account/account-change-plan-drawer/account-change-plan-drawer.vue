<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { type SelectOptionItem } from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { blankAddress, blankCard, cardErrorsOf, cardFieldIds } from './change-plan-card'
  import ChangePlanCompare from './parts/change-plan-compare.vue'
  import UpgradeAddressCard from './parts/upgrade-address-card.vue'
  import UpgradeChargeCard from './parts/upgrade-charge-card.vue'
  import UpgradeIncluded from './parts/upgrade-included.vue'
  import UpgradePaymentCard from './parts/upgrade-payment-card.vue'
  import UpgradeTermsField from './parts/upgrade-terms-field.vue'
  import {
    sampleAccountAddress,
    sampleCardLast4,
    sampleCharges,
    samplePlans,
    sampleUpgradeFeatures
  } from './sample'

  /** How often the plan bills. */
  export type ChangePlanDrawerPeriod = 'monthly' | 'yearly'

  /** What a plan's button does. */
  export type ChangePlanDrawerPlanAction = 'current' | 'upgrade' | 'contact'

  /** One line of a feature list. */
  export interface ChangePlanDrawerFeature {
    /** What is included. */
    label: string
    /** The overage price or a detail, under the label. */
    description?: string
  }

  /** A plan's price for one billing period. */
  export interface ChangePlanDrawerPrice {
    /** The amount, or a word such as Free or Custom. */
    value: string
    /** Currency symbol before the amount. */
    prefix: string
    /** Unit after the amount. */
    suffix: string
    /** Whether the currency symbol shows. */
    showPrefix: boolean
    /** Whether the unit shows. */
    showSuffix: boolean
    /** One line under the price. */
    details: string
  }

  /** One tier in the plan drawer. */
  export interface ChangePlanDrawerPlan {
    /** Stable key. */
    id: string
    /** Tier name. */
    name: string
    /** Whether the account is on it. */
    current: boolean
    /** What its button does. */
    action: ChangePlanDrawerPlanAction
    /** Its button label. */
    actionLabel: string
    /** The line over its features. */
    featuresTitle: string
    /** What it includes. */
    features: ChangePlanDrawerFeature[]
    /** Its price per billing period. */
    card: Record<ChangePlanDrawerPeriod, ChangePlanDrawerPrice>
  }

  /** One line of the charge card. */
  export interface ChangePlanDrawerChargeRow {
    /** What is charged. */
    label: string
    /** The formatted amount. */
    value: string
    /** Unit after the amount, or empty. */
    suffix: string
  }

  /** The charge card for one billing period. */
  export interface ChangePlanDrawerCharges {
    /** The lines over the total. */
    rows: ChangePlanDrawerChargeRow[]
    /** The total and its unit. */
    total: { value: string; suffix: string }
    /** What the checkout charges today. */
    dueToday: string
  }

  /** A billing address. */
  export interface ChangePlanDrawerAddress {
    /** Country, or none chosen. */
    country: string | undefined
    /** Postal code. */
    postalCode: string
    /** State, or none chosen. */
    state: string | undefined
    /** City, or none chosen. */
    city: string | undefined
    /** Street and number. */
    line1: string
    /** Suite, floor or unit. */
    line2: string
  }

  /** A new card typed in the upgrade drawer. */
  export interface ChangePlanDrawerCard {
    /** Name on the card. */
    holder: string
    /** Country of the card. */
    country: string | undefined
    /** Card number as typed. */
    number: string
    /** Expiration as MM/YY. */
    expiry: string
    /** Security code. */
    code: string
  }

  /** What Upgrade submits. */
  export interface ChangePlanDrawerUpgrade {
    /** The billing period chosen. */
    period: ChangePlanDrawerPeriod
    /** The new card, or null to charge the card on file. */
    card: ChangePlanDrawerCard | null
    /** The billing address. */
    address: ChangePlanDrawerAddress
  }

  export interface ChangePlanDrawerProps {
    /** The tiers to compare. Left out, the sample renders. */
    plans?: ChangePlanDrawerPlan[]
    /** What the Pro upgrade includes. Left out, the sample renders. */
    upgradeFeatures?: ChangePlanDrawerFeature[]
    /** The charge card per billing period. Left out, the sample renders. */
    charges?: Record<ChangePlanDrawerPeriod, ChangePlanDrawerCharges>
    /** The account address the billing address starts from. Left out, the sample renders. */
    accountAddress?: ChangePlanDrawerAddress
    /** Last four digits of the card on file. Left out, the sample renders. */
    cardLast4?: string
    /** Checkout step: the charge card adds Due today and Upgrade requires the terms. */
    terms?: boolean
    /** The upgrade request is in flight; when it ends with no error or decline, both drawers close. */
    loading?: boolean
    /** The card was declined; the card fields open with the number invalid. */
    declined?: boolean
    /** Why the upgrade failed; shown in an error toast with Retry. */
    error?: string
  }

  const props = withDefaults(defineProps<ChangePlanDrawerProps>(), {
    plans: undefined,
    upgradeFeatures: undefined,
    charges: undefined,
    accountAddress: undefined,
    cardLast4: undefined,
    terms: false,
    loading: false,
    declined: false,
    error: ''
  })

  const emit = defineEmits<{
    'plan-select': [event: MouseEvent, plan: ChangePlanDrawerPlan]
    upgrade: [event: Event, values: ChangePlanDrawerUpgrade]
  }>()

  const changePlanOpen = defineModel<boolean>('open', { default: false })
  const upgradeOpen = defineModel<boolean>('upgradeOpen', { default: false })

  const planCards = computed(() => props.plans ?? samplePlans)
  const includedFeatures = computed(() => props.upgradeFeatures ?? sampleUpgradeFeatures)
  const chargeCards = computed(() => props.charges ?? sampleCharges)
  const startAddress = computed(() => props.accountAddress ?? sampleAccountAddress)
  const submitting = computed(() => props.loading)

  const changePlanPeriod = ref<ChangePlanDrawerPeriod>('yearly')
  watch(changePlanOpen, (isOpen) => {
    if (isOpen) changePlanPeriod.value = 'yearly'
  })
  const choosePlan = (event: MouseEvent, plan: ChangePlanDrawerPlan) => {
    emit('plan-select', event, plan)
    if (plan.action === 'upgrade') upgradeOpen.value = true
    else if (plan.action === 'contact') changePlanOpen.value = false
  }

  const upgradePeriod = ref<ChangePlanDrawerPeriod>('yearly')
  const termsAccepted = ref(false)
  const termsError = ref('')
  const billingPeriods: { value: ChangePlanDrawerPeriod; label: string }[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const countryOptions: SelectOptionItem[] = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Japan', label: 'Japan' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' }
  ]

  const stateOptions: SelectOptionItem[] = [
    { value: 'California', label: 'California' },
    { value: 'New York', label: 'New York' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Washington', label: 'Washington' }
  ]

  const cityOptions: SelectOptionItem[] = [
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'San Diego', label: 'San Diego' },
    { value: 'San Francisco', label: 'San Francisco' }
  ]

  const editingCard = ref(false)
  const cardOnFile = ref(sampleCardLast4)
  watch(
    () => props.cardLast4,
    (next) => {
      cardOnFile.value = next ?? sampleCardLast4
    },
    { immediate: true }
  )
  const cardForm = reactive(blankCard())
  const cardErrors = reactive({ holder: '', number: '', expiry: '', code: '' })
  const cardDeclined = ref(false)

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const clearCardErrors = () => {
    Object.assign(cardErrors, { holder: '', number: '', expiry: '', code: '' })
    cardDeclined.value = false
  }

  const validateCard = () => {
    Object.assign(cardErrors, cardErrorsOf(cardForm))
    const first = (Object.keys(cardFieldIds) as (keyof typeof cardFieldIds)[]).find(
      (field) => cardErrors[field]
    )
    if (first) focusById(cardFieldIds[first])
    return !first
  }

  const startEditingCard = () => {
    Object.assign(cardForm, blankCard())
    clearCardErrors()
    editingCard.value = true
    focusById(cardFieldIds.holder)
  }

  const cancelEditingCard = () => {
    clearCardErrors()
    editingCard.value = false
    focusById('card-change')
  }

  const declineCard = () => {
    cardDeclined.value = true
    cardErrors.number = 'The issuer declined this card.'
    focusById(cardFieldIds.number)
  }

  const updateCard = () => {
    cardDeclined.value = false
    if (!validateCard()) return
    const digits = cardForm.number.replace(/\D/g, '')
    cardOnFile.value = digits.slice(-4)
    editingCard.value = false
    focusById('card-change')
  }

  const address = reactive({ useAccountInformation: true, ...startAddress.value })
  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? startAddress.value : blankAddress())
  )
  watch(upgradeOpen, (isOpen) => {
    if (!isOpen) return
    upgradePeriod.value = 'yearly'
    address.useAccountInformation = true
    Object.assign(address, startAddress.value)
    termsAccepted.value = false
    termsError.value = ''
    editingCard.value = false
    clearCardErrors()
  })

  const UPGRADE_TOAST = 'upgrade-result'

  const submitUpgrade = (event: Event) => {
    if (submitting.value) return
    cardDeclined.value = false
    if (editingCard.value && !validateCard()) return
    if (props.terms && !termsAccepted.value) {
      termsError.value = 'Accept the Terms of Service and the Privacy Policy to upgrade.'
      nextTick(() => document.getElementById('checkout-terms')?.focus())
      return
    }
    toast.dismiss(UPGRADE_TOAST)
    emit('upgrade', event, {
      period: upgradePeriod.value,
      card: editingCard.value ? { ...cardForm } : null,
      address: {
        country: address.country,
        postalCode: address.postalCode,
        state: address.state,
        city: address.city,
        line1: address.line1,
        line2: address.line2
      }
    })
  }

  watch(
    () => props.declined,
    (declined) => {
      if (!declined) return
      if (!editingCard.value) {
        Object.assign(cardForm, blankCard())
        editingCard.value = true
      }
      declineCard()
    }
  )

  watch(
    () => props.error,
    (message) => {
      if (!message) return
      toast.error('The upgrade failed. The account is still on Free.', {
        id: UPGRADE_TOAST,
        description: message,
        action: { label: 'Retry', onClick: (event: MouseEvent) => submitUpgrade(event) }
      })
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (now || !before || props.error || props.declined) return
      if (editingCard.value) {
        cardOnFile.value = cardForm.number.replace(/\D/g, '').slice(-4)
        editingCard.value = false
      }
      upgradeOpen.value = false
      changePlanOpen.value = false
      toast.success('The account was upgraded to Pro.', { id: UPGRADE_TOAST })
    }
  )
</script>

<template>
  <Button
    label="Change plan"
    variant="outline"
    size="medium"
    @click="changePlanOpen = true"
  />

  <ChangePlanCompare
    v-model:open="changePlanOpen"
    v-model:period="changePlanPeriod"
    :plans="planCards"
    :periods="billingPeriods"
    @choose="choosePlan"
  />

  <Drawer
    v-model:open="upgradeOpen"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Upgrade to Pro"
        novalidate
        @submit.prevent="submitUpgrade"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upgrade to Pro</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div
            class="@container w-full outline-none"
            tabindex="-1"
            data-autofocus
          >
            <div
              class="grid grid-cols-1 gap-(--spacing-lg) @3xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] @3xl:gap-(--spacing-xl)"
            >
              <UpgradeIncluded :included-features="includedFeatures" />
              <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                <UpgradeChargeCard
                  v-model:period="upgradePeriod"
                  :charge-cards="chargeCards"
                  :billing-periods="billingPeriods"
                  :terms="terms"
                />
                <UpgradePaymentCard
                  :country-options="countryOptions"
                  :form="cardForm"
                  :errors="cardErrors"
                  :editing="editingCard"
                  :card-on-file="cardOnFile"
                  :declined="cardDeclined"
                  :submitting="submitting"
                  @start="startEditingCard"
                  @cancel="cancelEditingCard"
                  @update="updateCard"
                />
                <UpgradeAddressCard
                  :country-options="countryOptions"
                  :state-options="stateOptions"
                  :city-options="cityOptions"
                  :address="address"
                  :submitting="submitting"
                />
                <UpgradeTermsField
                  v-if="terms"
                  v-model:accepted="termsAccepted"
                  v-model:error="termsError"
                  :submitting="submitting"
                />
              </div>
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
                :disabled="submitting"
                @click="upgradeOpen = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Upgrade"
                variant="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
