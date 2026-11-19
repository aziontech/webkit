<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'
  import PricingCard from '@aziontech/webkit/pricing-card'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Separator from '@aziontech/webkit/separator'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

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

  type BillingPeriod = ChangePlanDrawerPeriod
  type BillingAddress = ChangePlanDrawerAddress

  const planCards = computed(() => props.plans ?? samplePlans)
  const includedFeatures = computed(() => props.upgradeFeatures ?? sampleUpgradeFeatures)
  const chargeCards = computed(() => props.charges ?? sampleCharges)
  const startAddress = computed(() => props.accountAddress ?? sampleAccountAddress)
  const submitting = computed(() => props.loading)

  const changePlanPeriod = ref<BillingPeriod>('yearly')
  const pricedPlans = computed(() =>
    planCards.value.map((plan) => ({ ...plan, ...plan.card[changePlanPeriod.value] }))
  )
  watch(changePlanOpen, (isOpen) => {
    if (isOpen) changePlanPeriod.value = 'yearly'
  })
  const choosePlan = (event: MouseEvent, plan: ChangePlanDrawerPlan) => {
    emit('plan-select', event, plan)
    if (plan.action === 'upgrade') upgradeOpen.value = true
    else if (plan.action === 'contact') changePlanOpen.value = false
  }

  const upgradePeriod = ref<BillingPeriod>('yearly')
  const termsAccepted = ref(false)
  const termsError = ref('')
  const billingPeriods: { value: BillingPeriod; label: string }[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const pricingLinks = [
    { label: 'Learn more about pricing', href: 'https://example.com/pricing' },
    { label: 'Compare plans', href: 'https://example.com/pricing#comparison' }
  ]
  const countryOptions: SelectOptionItem[] = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Japan', label: 'Japan' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' }
  ]
  const cardFieldIds: Record<string, string> = {
    holder: 'card-holder',
    number: 'card-number',
    expiry: 'card-expiry',
    code: 'card-code'
  }
  const editingCard = ref(false)
  const cardOnFile = ref(sampleCardLast4)
  watch(
    () => props.cardLast4,
    (next) => {
      cardOnFile.value = next ?? sampleCardLast4
    },
    { immediate: true }
  )
  const blankCard = () => ({
    holder: '',
    country: undefined as string | undefined,
    number: '',
    expiry: '',
    code: ''
  })
  const cardForm = reactive(blankCard())
  const cardErrors = reactive<Record<string, string>>({
    holder: '',
    number: '',
    expiry: '',
    code: ''
  })
  const cardDeclined = ref(false)

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const clearCardErrors = () => {
    Object.assign(cardErrors, { holder: '', number: '', expiry: '', code: '' })
    cardDeclined.value = false
  }

  const validateCard = () => {
    const digits = cardForm.number.replace(/\D/g, '')
    const code = cardForm.code.trim()
    cardErrors.holder = cardForm.holder.trim() ? '' : 'This field is required.'
    cardErrors.number = !digits
      ? 'This field is required.'
      : digits.length >= 12 && digits.length <= 19
        ? ''
        : 'Enter the 12 to 19 digits on the front of the card.'
    cardErrors.expiry = !cardForm.expiry.trim()
      ? 'This field is required.'
      : /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(cardForm.expiry.trim())
        ? ''
        : 'Enter the month and year as MM/YY.'
    cardErrors.code = !code
      ? 'This field is required.'
      : /^\d{3,4}$/.test(code)
        ? ''
        : 'Enter the 3 or 4 digits on the back of the card.'
    const first = Object.keys(cardFieldIds).find((field) => cardErrors[field])
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

  const fieldState = (field: 'holder' | 'number' | 'expiry' | 'code') => ({
    required: true,
    invalid: !!cardErrors[field]
  })

  const blankAddress = (): BillingAddress => ({
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line1: '',
    line2: ''
  })
  const address = reactive({ useAccountInformation: true, ...startAddress.value })
  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? startAddress.value : blankAddress())
  )
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
                    @click="(event: MouseEvent) => choosePlan(event, plan)"
                  />
                </template>
              </PricingCard>
            </div>
          </div>
        </div>
      </PanelBody>
    </DrawerContent>
  </Drawer>

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
          <div class="@container w-full">
            <div
              class="grid grid-cols-1 gap-(--spacing-lg) @3xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] @3xl:gap-(--spacing-xl)"
            >
              <aside class="flex flex-col gap-(--spacing-md)">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <h3
                    class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) @3xl:py-(--spacing-sm)"
                  >
                    What's included
                  </h3>
                  <div class="px-(--spacing-xs)">
                    <PlanFeatureList :items="includedFeatures" />
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
                      <div
                        class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)"
                      >
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
                        <div
                          class="flex flex-col gap-(--spacing-2xs) px-(--spacing-lg) py-(--spacing-md)"
                        >
                          <div
                            class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                          >
                            <span class="text-label-md text-(--text-default)">Due today</span>
                            <span class="text-label-md text-(--text-default)">{{
                              chargeCards[upgradePeriod].dueToday
                            }}</span>
                          </div>
                          <p class="text-body-xs text-(--text-muted)">
                            Taxes are calculated from the address below and shown on the invoice.
                            The plan renews
                            {{ upgradePeriod === 'yearly' ? 'every year' : 'every month' }}
                            on the day you upgrade; cancel any time from Billing.
                          </p>
                        </div>
                      </template>
                    </div>
                  </template>
                </Card>
                <Card
                  title="Payment method"
                  :padded="false"
                >
                  <template #default>
                    <div
                      class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)"
                    >
                      <div
                        v-if="!editingCard"
                        class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <PaymentBrand brand="visa" />
                        <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
                          Ending in {{ cardOnFile }}
                        </p>
                        <Button
                          id="card-change"
                          label="Change"
                          variant="outline"
                          size="small"
                          :disabled="submitting"
                          @click="startEditingCard"
                        />
                      </div>
                      <template v-else>
                        <Alert
                          v-if="cardDeclined"
                          severity="danger"
                          size="small"
                          label="The card was declined, so the account is still on Free. Check the number or use another card, then select Upgrade again."
                        />
                        <fieldset
                          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                          :disabled="submitting"
                        >
                          <legend class="sr-only">Payment method</legend>
                          <Field v-bind="fieldState('holder')">
                            <Field.Label :for="cardFieldIds.holder">Cardholder name</Field.Label>
                            <Input
                              :id="cardFieldIds.holder"
                              v-model="cardForm.holder"
                              name="cardholderName"
                              size="large"
                              placeholder="Jane A. Doe"
                              autocomplete="cc-name"
                              @update:model-value="cardErrors.holder = ''"
                            />
                            <Field.Description v-if="cardErrors.holder">{{
                              cardErrors.holder
                            }}</Field.Description>
                          </Field>
                          <Field>
                            <Field.Label for="card-country">Country or region</Field.Label>
                            <Select
                              v-model="cardForm.country"
                              placeholder="Select an option"
                              size="large"
                            >
                              <Select.Trigger id="card-country" />
                              <Select.Content>
                                <Select.Item
                                  v-for="option in countryOptions"
                                  :key="String(option.value)"
                                  :value="option.value"
                                  :disabled="option.disabled"
                                >
                                  {{ option.label }}
                                </Select.Item>
                              </Select.Content>
                            </Select>
                          </Field>
                          <Field v-bind="fieldState('number')">
                            <Field.Label :for="cardFieldIds.number">Card number</Field.Label>
                            <Input
                              :id="cardFieldIds.number"
                              v-model="cardForm.number"
                              name="cardNumber"
                              size="large"
                              placeholder="1234 5678 9012 3456"
                              autocomplete="cc-number"
                              inputmode="numeric"
                              @update:model-value="cardErrors.number = ''"
                            />
                            <Field.Description v-if="cardErrors.number">{{
                              cardErrors.number
                            }}</Field.Description>
                          </Field>
                          <div class="grid grid-cols-1 gap-(--spacing-lg) @md:grid-cols-2">
                            <Field v-bind="fieldState('expiry')">
                              <Field.Label :for="cardFieldIds.expiry">Expiration date</Field.Label>
                              <Input
                                :id="cardFieldIds.expiry"
                                v-model="cardForm.expiry"
                                name="cardExpiry"
                                size="large"
                                placeholder="MM / YY"
                                autocomplete="cc-exp"
                                inputmode="numeric"
                                @update:model-value="cardErrors.expiry = ''"
                              />
                              <Field.Description>{{
                                cardErrors.expiry || 'Month and year, as MM/YY.'
                              }}</Field.Description>
                            </Field>
                            <Field v-bind="fieldState('code')">
                              <Field.Label :for="cardFieldIds.code">Security code</Field.Label>
                              <Input
                                :id="cardFieldIds.code"
                                v-model="cardForm.code"
                                name="cardSecurityCode"
                                size="large"
                                placeholder="123"
                                autocomplete="cc-csc"
                                inputmode="numeric"
                                @update:model-value="cardErrors.code = ''"
                              />
                              <Field.Description>{{
                                cardErrors.code || '3 or 4 digits on the back.'
                              }}</Field.Description>
                            </Field>
                          </div>
                          <Alert
                            severity="info"
                            size="small"
                            label="Sensitive data is handled by a PCI-compliant payment partner."
                          />
                        </fieldset>
                        <div class="flex flex-col gap-(--spacing-sm) @md:flex-row @md:justify-end">
                          <div class="w-full @md:w-fit">
                            <Button
                              class="w-full"
                              type="button"
                              label="Cancel"
                              variant="outline"
                              size="medium"
                              :disabled="submitting"
                              @click="cancelEditingCard"
                            />
                          </div>
                          <div class="w-full @md:w-fit">
                            <Button
                              class="w-full"
                              type="button"
                              label="Update"
                              variant="primary"
                              size="medium"
                              :disabled="submitting"
                              @click="updateCard"
                            />
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </Card>
                <Card
                  title="Address information"
                  :padded="false"
                >
                  <template #default>
                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
                      :disabled="submitting"
                    >
                      <legend class="sr-only">Address information</legend>
                      <Field orientation="horizontal">
                        <Checkbox
                          v-model="address.useAccountInformation"
                          name="useAccountInformation"
                        />
                        <Field.Content>
                          <Field.Label>Use the same information as my account</Field.Label>
                          <Field.Description
                            >Uncheck to bill this organization at a different
                            address.</Field.Description
                          >
                        </Field.Content>
                      </Field>
                      <div class="grid grid-cols-1 gap-(--spacing-lg) @md:grid-cols-2">
                        <Field>
                          <Field.Label>Country</Field.Label>
                          <Select
                            v-model="address.country"
                            placeholder="Select an option"
                            size="large"
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item
                                v-for="option in countryOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Item>
                            </Select.Content>
                          </Select>
                        </Field>
                        <Field>
                          <Field.Label>Postal code</Field.Label>
                          <Input
                            v-model="address.postalCode"
                            name="postalCode"
                            size="large"
                            autocomplete="postal-code"
                          />
                        </Field>
                        <Field>
                          <Field.Label>State or region</Field.Label>
                          <Select
                            v-model="address.state"
                            placeholder="Select an option"
                            size="large"
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item
                                v-for="option in stateOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Item>
                            </Select.Content>
                          </Select>
                        </Field>
                        <Field>
                          <Field.Label>City</Field.Label>
                          <Select
                            v-model="address.city"
                            placeholder="Select an option"
                            size="large"
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item
                                v-for="option in cityOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Item>
                            </Select.Content>
                          </Select>
                        </Field>
                      </div>
                      <Field>
                        <Field.Label>Address</Field.Label>
                        <Input
                          v-model="address.line1"
                          name="addressLine1"
                          size="large"
                          autocomplete="address-line1"
                        />
                      </Field>
                      <Field>
                        <Field.Label>Address line 2</Field.Label>
                        <Input
                          v-model="address.line2"
                          name="addressLine2"
                          size="large"
                          autocomplete="address-line2"
                        />
                        <Field.Description>Optional. Apartment, suite or floor.</Field.Description>
                      </Field>
                    </fieldset>
                  </template>
                </Card>
                <Field
                  v-if="terms"
                  orientation="horizontal"
                  :invalid="!!termsError"
                >
                  <Checkbox
                    v-model="termsAccepted"
                    id="checkout-terms"
                    name="terms"
                    :disabled="submitting"
                    @update:model-value="termsError = ''"
                  />
                  <Field.Content>
                    <Field.Label for="checkout-terms">
                      I accept the
                      <a
                        href="https://example.com/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-link"
                        >Terms of Service<span class="sr-only"> (opens in a new tab)</span></a
                      >
                      and the
                      <a
                        href="https://example.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-link"
                        >Privacy Policy<span class="sr-only"> (opens in a new tab)</span></a
                      >
                    </Field.Label>
                    <Field.Description v-if="termsError">{{ termsError }}</Field.Description>
                  </Field.Content>
                </Field>
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
