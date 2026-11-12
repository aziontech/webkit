<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import FeatureList from '@aziontech/webkit/feature-list'
  import Separator from '@aziontech/webkit/separator'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Link from '@aziontech/webkit/link'
  import Alert from '@aziontech/webkit/alert'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const changePlanOpen = ref(false)
  const changePlanPeriod = ref('yearly')
  const planCards = [
    {
      id: 'free',
      name: 'Free',
      current: true,
      action: 'current',
      actionLabel: 'Current plan',
      featuresTitle: 'All features included',
      features: [
        { icon: 'pi pi-globe', label: 'Global infrastructure' },
        { icon: 'pi pi-code', label: 'Serverless compute' },
        { icon: 'pi pi-database', label: 'Storage and database' },
        { icon: 'pi pi-image', label: 'Image optimization' },
        { icon: 'pi pi-shield', label: 'DDoS mitigation and firewall' }
      ],
      card: {
        monthly: {
          value: 'Free',
          prefix: '$',
          suffix: '',
          showPrefix: false,
          showSuffix: false,
          details: 'Start free for personal projects and experimentation'
        },
        yearly: {
          value: 'Free',
          prefix: '$',
          suffix: '',
          showPrefix: false,
          showSuffix: false,
          details: 'Start free for personal projects and experimentation'
        }
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      current: false,
      action: 'upgrade',
      actionLabel: 'Continue with Pro',
      featuresTitle: 'All Free features, plus:',
      features: [
        { icon: 'pi pi-box', label: 'Additional resources' },
        { icon: 'pi pi-server', label: 'Higher request limits' },
        { icon: 'pi pi-database', label: 'More storage capacity' },
        { icon: 'pi pi-shield', label: 'Broader security coverage' },
        { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
      ],
      card: {
        monthly: {
          value: '25',
          prefix: '$',
          suffix: '/ mon',
          showPrefix: true,
          showSuffix: true,
          details: 'Billed monthly, cancel anytime'
        },
        yearly: {
          value: '20',
          prefix: '$',
          suffix: '/ mon',
          showPrefix: true,
          showSuffix: true,
          details: 'Billed annually, save 20%'
        }
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      current: false,
      action: 'contact',
      actionLabel: 'Contact sales',
      featuresTitle: 'All Pro features, plus:',
      features: [
        { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
        { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
        { icon: 'ai ai-layers', label: 'Capacity Reservation available' },
        { icon: 'pi pi-calendar', label: 'Savings Plan available' },
        { icon: 'ai ai-business-support', label: 'Advanced support available' }
      ],
      card: {
        monthly: {
          value: 'Custom',
          prefix: '$',
          suffix: '',
          showPrefix: false,
          showSuffix: false,
          details: 'Tailored to your usage requirements and payment terms'
        },
        yearly: {
          value: 'Custom',
          prefix: '$',
          suffix: '',
          showPrefix: false,
          showSuffix: false,
          details: 'Tailored to your usage requirements and payment terms'
        }
      }
    }
  ]
  const pricedPlans = computed(() =>
    planCards.map((plan) => ({ ...plan, ...plan.card[changePlanPeriod.value] }))
  )
  watch(changePlanOpen, (isOpen) => {
    if (isOpen) changePlanPeriod.value = 'yearly'
  })
  const choosePlan = (plan) => {
    if (plan.action === 'upgrade') upgradeOpen.value = true
    else if (plan.action === 'contact') changePlanOpen.value = false
  }

  const upgradeOpen = ref(true)
  const termsAccepted = ref(false)
  const termsError = ref('')
  const upgradePeriod = ref('yearly')
  const submitting = ref(false)
  const billingPeriods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const upgradeFeatures = [
    { label: '100 resources', description: 'then $0.10 per resource per month' },
    { label: '10M requests', description: 'then as low as $0.90 per 1M' },
    { label: '50 hours of compute time', description: 'then $0.18 per hour' },
    { label: '10 GB of event log storage', description: 'then $0.10 per GB-month' },
    { label: '100 GB of file storage', description: 'then as low as $0.021 per GB-month' },
    { label: '1 GB of database storage', description: 'then $0.75 per GB-month' },
    { label: '100M security rule evaluations', description: 'then as low as $0.30 per 1M' },
    { label: 'DDoS protection included' },
    { label: 'PCI DSS 4.0.1 Level 1' },
    { label: 'SOC 2 Type 2 / SOC 3' },
    { label: 'Data migration assistance' }
  ]
  const pricingLinks = [
    { label: 'Learn more about pricing', href: 'https://example.com/pricing' },
    { label: 'Compare plans', href: 'https://example.com/pricing#comparison' }
  ]
  const charges = {
    monthly: {
      rows: [
        { label: 'Next charge', value: '$ 200', suffix: '' },
        { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
      ],
      total: { value: '$ 3.000', suffix: 'per year' }
    },
    yearly: {
      rows: [
        { label: 'Next charge', value: '$ 200', suffix: '' },
        { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
        { label: 'Yearly discount', value: '$ 2.200', suffix: 'per month' }
      ],
      total: { value: '$ 2.200', suffix: 'per year' }
    }
  }

  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const cardFieldIds = {
    holder: 'card-holder',
    number: 'card-number',
    expiry: 'card-expiry',
    code: 'card-code'
  }
  const editingCard = ref(false)
  const cardLast4 = ref('8888')
  const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })
  const cardForm = reactive(blankCard())
  const cardErrors = reactive({ holder: '', number: '', expiry: '', code: '' })
  const cardDeclined = ref(false)

  const focusById = (id) => nextTick(() => document.getElementById(id)?.focus())

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
    if (digits.endsWith('0002')) {
      declineCard()
      return
    }
    cardLast4.value = digits.slice(-4)
    editingCard.value = false
    focusById('card-change')
  }

  const fieldState = (field) => ({
    required: !!cardErrors[field] && !String(cardForm[field]).trim(),
    invalid: !!cardErrors[field] && !!String(cardForm[field]).trim()
  })

  const accountAddress = {
    country: 'Brazil',
    postalCode: '01310-100',
    state: 'São Paulo',
    city: 'São Paulo',
    line1: 'Avenida Paulista, 1000',
    line2: ''
  }
  const blankAddress = () => ({
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line1: '',
    line2: ''
  })
  const address = reactive({ useAccountInformation: true, ...accountAddress })
  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress())
  )
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
  watch(upgradeOpen, (isOpen) => {
    if (!isOpen) return
    upgradePeriod.value = 'yearly'
    termsAccepted.value = false
    termsError.value = ''
    address.useAccountInformation = true
    Object.assign(address, accountAddress)
    submitting.value = false
    editingCard.value = false
    clearCardErrors()
  })

  const UPGRADE_TOAST = 'upgrade-result'

  const submitUpgrade = () => {
    if (submitting.value) return
    cardDeclined.value = false
    if (editingCard.value && !validateCard()) return
    if (!termsAccepted.value) {
      termsError.value = 'Accept the Terms of Service and the Privacy Policy to upgrade.'
      nextTick(() => document.getElementById('checkout-terms')?.focus())
      return
    }
    const digits = editingCard.value ? cardForm.number.replace(/\D/g, '') : cardLast4.value
    submitting.value = true
    toast.dismiss(UPGRADE_TOAST)
    setTimeout(() => {
      submitting.value = false
      if (digits.endsWith('0002')) {
        declineCard()
        return
      }
      if (digits.endsWith('0119')) {
        toast.error('The upgrade failed. The account is still on Free.', {
          id: UPGRADE_TOAST,
          description: 'The payment service did not answer. Your entries are kept.',
          action: { label: 'Retry', onClick: () => submitUpgrade() }
        })
        return
      }
      if (editingCard.value) {
        cardLast4.value = digits.slice(-4)
        editingCard.value = false
      }
      upgradeOpen.value = false
      changePlanOpen.value = false
      toast.success('The account was upgraded to Pro.', { id: UPGRADE_TOAST })
    }, 900)
  }
</script>

<template>
  <Toaster position="bottom-right" />

  <Button
    label="Change plan"
    kind="outlined"
    size="medium"
    @click="changePlanOpen = true"
  />

  <Drawer
    v-model:open="changePlanOpen"
    side="right"
    size="large"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent aria-label="Change plan">
        <PanelHeader class="w-full">
          <DrawerTitle>Change plan</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <div class="flex flex-col items-center gap-(--spacing-md)">
            <DrawerDescription class="w-full">
              Compare what each tier includes before moving the account onto it.
            </DrawerDescription>
            <ToggleGroup
              v-model="changePlanPeriod"
              :options="billingPeriods"
              aria-label="Billing period"
            />
            <div
              class="flex w-full min-w-0 flex-col items-stretch justify-center gap-(--spacing-md) lg:flex-row"
            >
              <div
                v-for="plan in pricedPlans"
                :key="plan.id"
                class="flex max-w-none min-w-0 flex-1"
              >
                <CardPricing
                  aligned
                  class="w-full"
                  :plan-title="plan.name"
                  :value="plan.value"
                  :prefix="plan.prefix"
                  :suffix="plan.suffix"
                  :show-prefix="plan.showPrefix"
                  :show-suffix="plan.showSuffix"
                  :pricing-details="plan.details"
                  :show-tag="plan.current"
                  tag-label="Current plan"
                  slot-position="bottom"
                  kind="contained"
                  action-label=""
                >
                  <div class="flex w-full flex-col gap-(--spacing-md)">
                    <p
                      v-if="plan.featuresTitle"
                      class="m-0 text-body-sm text-(--text-muted)"
                    >
                      {{ plan.featuresTitle }}
                    </p>
                    <ul class="m-0 flex w-full list-none flex-col gap-(--spacing-sm) p-0">
                      <li
                        v-for="feature in plan.features"
                        :key="feature.label"
                        class="flex items-start gap-(--spacing-sm)"
                      >
                        <i
                          :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']"
                          aria-hidden="true"
                        />
                        <span class="text-body-sm text-(--text-default)">{{ feature.label }}</span>
                      </li>
                    </ul>
                  </div>
                  <template #actions>
                    <Button
                      :label="plan.actionLabel"
                      :kind="plan.action === 'upgrade' ? 'primary' : 'outlined'"
                      :disabled="plan.current"
                      size="large"
                      class="w-full"
                      @click="choosePlan(plan)"
                    />
                  </template>
                </CardPricing>
              </div>
            </div>
          </div>
        </PanelContent>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>

  <Drawer
    v-model:open="upgradeOpen"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Upgrade to Pro"
          novalidate
          @submit.prevent="submitUpgrade"
        >
          <PanelHeader class="w-full">
            <DrawerTitle>Upgrade to Pro</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
            <div
              class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
            >
              <aside class="flex flex-col gap-(--spacing-md)">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <h3
                    class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:min-h-[calc(var(--spacing-sm)*2+var(--spacing-10)+1px)] lg:border-t lg:border-t-transparent lg:py-(--spacing-sm)"
                  >
                    What's included
                  </h3>
                  <div class="px-(--spacing-xs)">
                    <FeatureList :items="upgradeFeatures" />
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
                  <template #content>
                    <div class="flex flex-col">
                      <div
                        class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)"
                      >
                        <div
                          v-for="row in charges[upgradePeriod].rows"
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
                            charges[upgradePeriod].total.value
                          }}</span>
                          <span class="text-body-sm text-(--text-muted)">{{
                            charges[upgradePeriod].total.suffix
                          }}</span>
                        </span>
                      </div>
                      <Separator />
                      <div
                        class="flex flex-col gap-(--spacing-xxs) px-(--spacing-lg) py-(--spacing-md)"
                      >
                        <div
                          class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                        >
                          <span class="text-label-md text-(--text-default)">Due today</span>
                          <span class="text-label-md text-(--text-default)">$ 200</span>
                        </div>
                        <p class="text-body-xs text-(--text-muted)">
                          Taxes are calculated from the address below and shown on the invoice. The
                          plan renews
                          {{ upgradePeriod === 'yearly' ? 'every year' : 'every month' }}
                          on the day you upgrade; cancel any time from Billing.
                        </p>
                      </div>
                    </div>
                  </template>
                </Card>
                <Card
                  title="Payment method"
                  :padded="false"
                >
                  <template #content>
                    <div
                      class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)"
                    >
                      <div
                        v-if="!editingCard"
                        class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <PaymentBrand brand="visa" />
                        <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
                          Ending in {{ cardLast4 }}
                        </p>
                        <Button
                          id="card-change"
                          label="Change"
                          kind="outlined"
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
                              size="large"
                            >
                              <Select.Trigger id="card-country" />
                              <Select.Content>
                                <Select.Option
                                  v-for="option in countryOptions"
                                  :key="String(option.value)"
                                  :value="option.value"
                                  :disabled="option.disabled"
                                >
                                  {{ option.label }}
                                </Select.Option>
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
                          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
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
                        <div class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end">
                          <div class="w-full sm:w-fit">
                            <Button
                              class="w-full"
                              type="button"
                              label="Cancel"
                              kind="outlined"
                              size="medium"
                              :disabled="submitting"
                              @click="cancelEditingCard"
                            />
                          </div>
                          <div class="w-full sm:w-fit">
                            <Button
                              class="w-full"
                              type="button"
                              label="Update"
                              kind="primary"
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
                  <template #content>
                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
                      :disabled="submitting"
                    >
                      <legend class="sr-only">Address information</legend>
                      <Field orientation="horizontal">
                        <Checkbox
                          v-model="address.useAccountInformation"
                          binary
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
                      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
                        <Field>
                          <Field.Label>Country</Field.Label>
                          <Select
                            v-model="address.country"
                            placeholder="Select an option"
                            size="large"
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Option
                                v-for="option in countryOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </Field>
                        <Field>
                          <Field.Label>Postal code</Field.Label>
                          <Input
                            v-model="address.postalCode"
                            name="postalCode"
                            size="large"
                            placeholder="00000-000"
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
                              <Select.Option
                                v-for="option in stateOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Option>
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
                              <Select.Option
                                v-for="option in cityOptions"
                                :key="String(option.value)"
                                :value="option.value"
                                :disabled="option.disabled"
                              >
                                {{ option.label }}
                              </Select.Option>
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
                  orientation="horizontal"
                  :invalid="!!termsError"
                >
                  <Checkbox
                    v-model="termsAccepted"
                    binary
                    input-id="checkout-terms"
                    name="terms"
                    :disabled="submitting"
                    @update:model-value="termsError = ''"
                  />
                  <Field.Content>
                    <Field.Label for="checkout-terms">
                      I accept the
                      <Link
                        href="https://example.com/terms"
                        target="_blank"
                        label="Terms of Service"
                      />
                      and the
                      <Link
                        href="https://example.com/privacy"
                        target="_blank"
                        label="Privacy Policy"
                      />
                    </Field.Label>
                    <Field.Description v-if="termsError">{{ termsError }}</Field.Description>
                  </Field.Content>
                </Field>
              </div>
            </div>
          </PanelContent>
          <PanelFooter>
            <div
              class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
            >
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  :disabled="submitting"
                  @click="upgradeOpen = false"
                />
              </div>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  label="Upgrade"
                  kind="primary"
                  size="medium"
                  :loading="submitting"
                  type="submit"
                />
              </div>
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
