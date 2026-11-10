<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CardPricing from '@aziontech/webkit/card-pricing'
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
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref, watch } from 'vue'

  const changePlanOpen = ref(false)
  const changePlanPeriod = ref('yearly')
  const planCards = [
    {
      id: 'free',
      name: 'Free',
      current: true,
      action: 'current',
      actionLabel: 'Current plan',
      featuresTitle: 'All Features Included.',
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

  const upgradeOpen = ref(false)
  const upgradePeriod = ref('yearly')
  const submitting = ref(false)
  const billingPeriods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const upgradeFeatures = [
    { title: '100 Resources', detail: 'then $0.10 per resource per month' },
    { title: '10M Requests', detail: 'then as low as $0.90 per 1M' },
    { title: '50 hours Compute time', detail: 'then $0.18 per hour' },
    { title: '10 GB Event log storage', detail: 'then $0.10 per GB-month' },
    { title: '100 GB File storage', detail: 'then as low as $0.021 per GB-month' },
    { title: '1 GB Database storage', detail: 'then $0.75 per GB-month' },
    { title: '100M Security rule evaluations', detail: 'then as low as $0.30 per 1M' },
    { title: 'DDoS Protection included', detail: '' },
    { title: 'PCI DSS 4.0.1 Level 1', detail: '' },
    { title: 'SOC 2 Type 2 / SOC 3', detail: '' },
    { title: 'Data migration assistance', detail: '' }
  ]
  const pricingLinks = [
    { label: 'Learn more about Pricing', href: 'https://example.com/pricing' },
    { label: 'Compare Plans', href: 'https://example.com/pricing#comparison' }
  ]
  const charges = {
    monthly: {
      rows: [
        { label: 'Next Charge Value', value: '$ 200', suffix: '' },
        { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
      ],
      total: { value: '$ 3.000', suffix: 'per year' }
    },
    yearly: {
      rows: [
        { label: 'Next Charge Value', value: '$ 200', suffix: '' },
        { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
        { label: 'Yearly Discount', value: '$ 2.200', suffix: 'per month' }
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
  const editingCard = ref(false)
  const cardLast4 = ref('8888')
  const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })
  const cardForm = reactive(blankCard())
  const startEditingCard = () => {
    Object.assign(cardForm, blankCard())
    editingCard.value = true
  }
  const updateCard = () => {
    const digits = cardForm.number.replace(/\D/g, '')
    if (digits.length >= 4) cardLast4.value = digits.slice(-4)
    editingCard.value = false
  }

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
    address.useAccountInformation = true
    Object.assign(address, accountAddress)
    submitting.value = false
  })

  const submitUpgrade = () => {
    if (submitting.value) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      upgradeOpen.value = false
      changePlanOpen.value = false
    }, 900)
  }
</script>

<template>
  <Button
    label="Change Plan"
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
                  <ul class="m-0 flex list-none flex-col p-0">
                    <li
                      v-for="feature in upgradeFeatures"
                      :key="feature.title"
                      class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xs) odd:bg-(--bg-mask)"
                    >
                      <i
                        class="pi pi-check mt-0.5 shrink-0 text-body-xs leading-none text-(--success-contrast)"
                        aria-hidden="true"
                      />
                      <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <span class="text-label-md text-(--text-default)">{{ feature.title }}</span>
                        <span
                          v-if="feature.detail"
                          class="text-body-xs text-(--text-muted)"
                          >{{ feature.detail }}</span
                        >
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Separator />
                  <div
                    v-for="link in pricingLinks"
                    :key="link.label"
                    class="ml-(--spacing-xs) w-fit"
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
                    </div>
                  </template>
                </Card>
                <Card
                  title="Payment Method"
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
                        <span
                          class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                          aria-hidden="true"
                        >
                          <svg
                            width="22"
                            height="7"
                            viewBox="0 0 22 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="block"
                            focusable="false"
                          >
                            <g clip-path="url(#card-brand-visa-clip)">
                              <path
                                d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
                                fill="currentColor"
                              />
                            </g>
                            <defs>
                              <clipPath id="card-brand-visa-clip">
                                <rect
                                  width="22"
                                  height="7"
                                  fill="white"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                        <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
                          Ended with {{ cardLast4 }}
                        </p>
                        <Button
                          label="Change"
                          kind="outlined"
                          size="small"
                          :disabled="submitting"
                          @click="startEditingCard"
                        />
                      </div>
                      <template v-else>
                        <fieldset
                          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                          :disabled="submitting"
                        >
                          <legend class="sr-only">Payment Method</legend>
                          <Field>
                            <Field.Label>Cardholder's full name</Field.Label>
                            <Input
                              v-model="cardForm.holder"
                              name="cardholderName"
                              size="large"
                              placeholder="Jane A. Doe"
                              autocomplete="cc-name"
                            />
                          </Field>
                          <Field>
                            <Field.Label>Country/Region</Field.Label>
                            <Select
                              v-model="cardForm.country"
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
                            <Field.Label>Credit card number</Field.Label>
                            <Input
                              v-model="cardForm.number"
                              name="cardNumber"
                              size="large"
                              placeholder="1234 5678 9012 3456"
                              autocomplete="cc-number"
                              inputmode="numeric"
                            />
                          </Field>
                          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
                            <Field>
                              <Field.Label>Expiration Date (MM/YY)</Field.Label>
                              <Input
                                v-model="cardForm.expiry"
                                name="cardExpiry"
                                size="large"
                                placeholder="08 / 26"
                                autocomplete="cc-exp"
                                inputmode="numeric"
                              />
                            </Field>
                            <Field>
                              <Field.Label>Security Code (CVC/CVV)</Field.Label>
                              <Input
                                v-model="cardForm.code"
                                name="cardSecurityCode"
                                size="large"
                                placeholder="999"
                                autocomplete="cc-csc"
                                inputmode="numeric"
                              />
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
                              label="Cancel"
                              kind="outlined"
                              size="medium"
                              :disabled="submitting"
                              @click="editingCard = false"
                            />
                          </div>
                          <div class="w-full sm:w-fit">
                            <Button
                              class="w-full"
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
                          <Field.Label>Postal Code</Field.Label>
                          <Input
                            v-model="address.postalCode"
                            name="postalCode"
                            size="large"
                            placeholder="00000-000"
                            autocomplete="postal-code"
                          />
                        </Field>
                        <Field>
                          <Field.Label>State/Region</Field.Label>
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
                        <Field.Label>Apartment, floor, etc.</Field.Label>
                        <Input
                          v-model="address.line2"
                          name="addressLine2"
                          size="large"
                          placeholder="Optional"
                          autocomplete="address-line2"
                        />
                      </Field>
                    </fieldset>
                  </template>
                </Card>
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
