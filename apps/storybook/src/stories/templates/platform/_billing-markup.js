import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { declare } from './_forms-markup'

export const CARD_BRAND_MARK = `<span
  class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-[#2548a0]"
  aria-hidden="true"
>
  <svg width="22" height="7" viewBox="0 0 22 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="block" focusable="false">
    <g clip-path="url(#card-brand-visa-clip)">
      <path
        d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="card-brand-visa-clip">
        <rect width="22" height="7" fill="white" />
      </clipPath>
    </defs>
  </svg>
</span>`

const disabledAttr = (disabled) => {
  if (!disabled) return ''
  return disabled === 'true' ? ' disabled' : ` :disabled="${disabled}"`
}

const cardField = ({ model, label, id, name, placeholder, autocomplete, numeric = false }) =>
  `<FieldText
  v-model="cardForm.${model}"
  label="${label}"
  input-id="${id}"
  name="${name}"
  size="large"
  placeholder="${placeholder}"
  autocomplete="${autocomplete}"${numeric ? '\n  inputmode="numeric"' : ''}
/>`

export const paymentMethodCard = (disabled = '') => {
  const off = disabledAttr(disabled)
  return `<CardBox title="Payment Method" :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
      <div
        v-if="!editingCard"
        class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
      >
${indent(CARD_BRAND_MARK, 4)}
        <p class="min-w-0 flex-1 text-label-md text-(--text-default)">Ended with {{ cardLast4 }}</p>
        <Button label="Change" kind="outlined" size="small"${off} @click="startEditingCard" />
      </div>
      <template v-else>
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"${off}>
          <legend class="sr-only">Payment Method</legend>
${indent(
  [
    cardField({
      model: 'holder',
      label: "Cardholder's full name",
      id: 'payment-holder',
      name: 'cardholderName',
      placeholder: 'Jane A. Doe',
      autocomplete: 'cc-name'
    }),
    `<FieldSelect
  v-model="cardForm.country"
  label="Country/Region"
  :options="countryOptions"
  input-id="payment-country"
  size="large"
/>`,
    cardField({
      model: 'number',
      label: 'Credit card number',
      id: 'payment-number',
      name: 'cardNumber',
      placeholder: '1234 5678 9012 3456',
      autocomplete: 'cc-number',
      numeric: true
    })
  ].join('\n'),
  5
)}
          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
${indent(
  [
    cardField({
      model: 'expiry',
      label: 'Expiration Date (MM/YY)',
      id: 'payment-expiry',
      name: 'cardExpiry',
      placeholder: '08 / 26',
      autocomplete: 'cc-exp',
      numeric: true
    }),
    cardField({
      model: 'code',
      label: 'Security Code (CVC/CVV)',
      id: 'payment-code',
      name: 'cardSecurityCode',
      placeholder: '999',
      autocomplete: 'cc-csc',
      numeric: true
    })
  ].join('\n'),
  6
)}
          </div>
          <Message severity="info" size="small" label="Sensitive data is handled by a PCI-compliant payment partner." />
        </fieldset>
        <div class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end">
          <Button class="w-full sm:w-auto" label="Cancel" kind="outlined" size="medium"${off} @click="editingCard = false" />
          <Button class="w-full sm:w-auto" label="Update" kind="primary" size="medium"${off} @click="updateCard" />
        </div>
      </template>
    </div>
  </template>
</CardBox>`
}

export const COUNTRY_OPTIONS = [
  { value: 'Brazil', label: 'Brazil' },
  { value: 'United States', label: 'United States' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Mexico', label: 'Mexico' }
]

export const CARD_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import Message from '@aziontech/webkit/message'"
]

export const cardScript = (editing = false) => [
  declare('countryOptions', COUNTRY_OPTIONS),
  `const editingCard = ref(${editing})`,
  "const cardLast4 = ref('8888')",
  "const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })",
  'const cardForm = reactive(blankCard())',
  'const startEditingCard = () => {',
  '  Object.assign(cardForm, blankCard())',
  '  editingCard.value = true',
  '}',
  'const updateCard = () => {',
  "  const digits = cardForm.number.replace(/\\D/g, '')",
  '  if (digits.length >= 4) cardLast4.value = digits.slice(-4)',
  '  editingCard.value = false',
  '}'
]

const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })

export const useCard = (editing = false) => {
  const editingCard = ref(editing)
  const cardLast4 = ref('8888')
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
  return {
    countryOptions: COUNTRY_OPTIONS,
    editingCard,
    cardLast4,
    cardForm,
    startEditingCard,
    updateCard
  }
}

export const BILLING_PERIODS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const COMPLIANCE_FEATURES = [
  { title: 'DDoS Protection included', detail: '' },
  { title: 'PCI DSS 4.0.1 Level 1', detail: '' },
  { title: 'SOC 2 Type 2 / SOC 3', detail: '' },
  { title: 'Universal Data Migration Service', detail: '' }
]

export const UPGRADE_FEATURES = [
  { title: '100 Workloads', detail: 'then $0.10 per workload per month' },
  { title: '10M Application requests', detail: 'then as low as $0.90 per 1M' },
  { title: '50 hours Function compute time', detail: 'then $0.18 per hour' },
  { title: '10 GB Real-Time Events Storage', detail: 'then $0.10 per GB-month' },
  { title: '100 GB Object Storage', detail: 'then as low as $0.021 per GB-month' },
  { title: '1 GB SQL Database Storage', detail: 'then $0.75 per GB-month' },
  { title: '100M Firewall requests', detail: 'then as low as $0.30 per 1M' },
  ...COMPLIANCE_FEATURES
]

export const PRICING_LINKS = [
  { label: 'Learn more about Pricing', href: '/site/pricing' },
  { label: 'Compare Plans', href: '/site/pricing#comparison' }
]

export const CHARGES = {
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

export const ACCOUNT_ADDRESS = {
  country: 'Brazil',
  postalCode: '01310-100',
  state: 'São Paulo',
  city: 'São Paulo',
  line2: ''
}

export const STATE_OPTIONS = [
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
  { value: 'Minas Gerais', label: 'Minas Gerais' },
  { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' }
]

export const CITY_OPTIONS = [
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Campinas', label: 'Campinas' },
  { value: 'Santos', label: 'Santos' }
]

const addressSelect = (model, label, options, id) => `<FieldSelect
  v-model="address.${model}"
  label="${label}"
  :options="${options}"
  input-id="${id}"
  placeholder="Select an option"
  size="large"
/>`

export const PLAN_UPGRADE_DRAWER = `<Drawer v-model:open="upgradeOpen" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form class="flex min-h-0 flex-1 flex-col" aria-label="Upgrade to Pro" novalidate @submit.prevent="submitUpgrade">
        <PanelHeader class="w-full">
          <DrawerTitle>Upgrade to Pro</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)">
            <aside class="flex flex-col gap-(--spacing-md)">
              <div class="flex flex-col gap-(--spacing-xs)">
                <h3 class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:min-h-[calc(var(--spacing-sm)*2+var(--spacing-10)+1px)] lg:border-t lg:border-t-transparent lg:py-(--spacing-sm)">
                  What's included
                </h3>
                <ul class="m-0 flex list-none flex-col p-0">
                  <li
                    v-for="feature in upgradeFeatures"
                    :key="feature.title"
                    class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xs) odd:bg-(--bg-mask)"
                  >
                    <i class="pi pi-check mt-0.5 shrink-0 text-body-xs leading-none text-(--success-contrast)" aria-hidden="true" />
                    <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-md text-(--text-default)">{{ feature.title }}</span>
                      <span v-if="feature.detail" class="text-body-xs text-(--text-muted)">{{ feature.detail }}</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div class="flex flex-col gap-(--spacing-xs)">
                <Divider />
                <Link
                  v-for="link in pricingLinks"
                  :key="link.label"
                  :label="link.label"
                  :href="link.href"
                  target="_blank"
                  size="small"
                  class="ml-(--spacing-xs) w-fit"
                />
              </div>
            </aside>
            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <CardBox :padded="false">
                <template #header>
                  <p class="text-label-lg text-(--text-default)">Charged</p>
                  <SegmentedButton v-model="upgradePeriod" :options="billingPeriods" aria-label="Billing period" />
                </template>
                <template #content>
                  <div class="flex flex-col">
                    <div class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)">
                      <div
                        v-for="row in charges[upgradePeriod].rows"
                        :key="row.label"
                        class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                      >
                        <span class="text-body-sm text-(--text-muted)">{{ row.label }}</span>
                        <span class="flex items-baseline gap-(--spacing-xs)">
                          <span class="text-label-md text-(--text-default)">{{ row.value }}</span>
                          <span v-if="row.suffix" class="text-body-sm text-(--text-muted)">{{ row.suffix }}</span>
                        </span>
                      </div>
                    </div>
                    <Divider />
                    <div class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm) px-(--spacing-lg) py-(--spacing-lg)">
                      <span class="text-heading-xs text-(--text-default)">Total</span>
                      <span class="flex items-baseline gap-(--spacing-xs)">
                        <span class="text-heading-xs text-(--text-default)">{{ charges[upgradePeriod].total.value }}</span>
                        <span class="text-body-sm text-(--text-muted)">{{ charges[upgradePeriod].total.suffix }}</span>
                      </span>
                    </div>
                  </div>
                </template>
              </CardBox>
${indent(paymentMethodCard('submitting'), 7)}
              <CardBox title="Address information" :padded="false">
                <template #content>
                  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)" :disabled="submitting">
                    <legend class="sr-only">Address information</legend>
                    <FieldCheckbox
                      v-model="address.useAccountInformation"
                      label="Use the same information as my account"
                      description="Uncheck to bill this organization at a different address."
                      input-id="upgrade-same-address"
                      name="useAccountInformation"
                    />
                    <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
${indent(
  [
    addressSelect('country', 'Country', 'countryOptions', 'upgrade-country'),
    `<FieldText
  v-model="address.postalCode"
  label="Postal Code"
  input-id="upgrade-postal-code"
  name="postalCode"
  size="large"
  placeholder="00000-000"
  autocomplete="postal-code"
/>`,
    addressSelect('state', 'State/Region', 'stateOptions', 'upgrade-state'),
    addressSelect('city', 'City', 'cityOptions', 'upgrade-city')
  ].join('\n'),
  11
)}
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
            @click="upgradeOpen = false"
          />
          <Button class="w-full md:w-auto" label="Upgrade" kind="primary" size="medium" :loading="submitting" @click="submitUpgrade" />
          <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">Upgrade</button>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

export const UPGRADE_IMPORTS = [
  ...CARD_IMPORTS,
  "import Divider from '@aziontech/webkit/divider'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import FieldCheckbox from '@aziontech/webkit/field-checkbox'",
  "import Link from '@aziontech/webkit/link'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'"
]

export const upgradeScript = (closeLines) => [
  'const upgradeOpen = ref(false)',
  "const upgradePeriod = ref('yearly')",
  'const submitting = ref(false)',
  declare('billingPeriods', BILLING_PERIODS),
  declare('upgradeFeatures', UPGRADE_FEATURES),
  declare('pricingLinks', PRICING_LINKS),
  declare('charges', CHARGES),
  '',
  ...cardScript(),
  '',
  declare('accountAddress', ACCOUNT_ADDRESS),
  "const blankAddress = () => ({ country: undefined, postalCode: '', state: undefined, city: undefined, line2: '' })",
  'const address = reactive({ useAccountInformation: true, ...accountAddress })',
  'watch(',
  '  () => address.useAccountInformation,',
  '  (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress())',
  ')',
  declare('stateOptions', STATE_OPTIONS),
  declare('cityOptions', CITY_OPTIONS),
  '',
  'const submitUpgrade = () => {',
  '  if (submitting.value) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    submitting.value = false',
  ...closeLines.map((line) => `    ${line}`),
  '  }, 900)',
  '}'
]

const blankAddress = () => ({
  country: undefined,
  postalCode: '',
  state: undefined,
  city: undefined,
  line2: ''
})

export const useUpgrade = (close) => {
  const upgradeOpen = ref(false)
  const upgradePeriod = ref('yearly')
  const submitting = ref(false)
  const address = reactive({ useAccountInformation: true, ...ACCOUNT_ADDRESS })
  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? ACCOUNT_ADDRESS : blankAddress())
  )
  const submitUpgrade = () => {
    if (submitting.value) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      upgradeOpen.value = false
      close?.()
    }, 900)
  }
  return {
    upgradeOpen,
    upgradePeriod,
    submitting,
    billingPeriods: BILLING_PERIODS,
    upgradeFeatures: UPGRADE_FEATURES,
    pricingLinks: PRICING_LINKS,
    charges: CHARGES,
    ...useCard(),
    address,
    stateOptions: STATE_OPTIONS,
    cityOptions: CITY_OPTIONS,
    submitUpgrade
  }
}

const freeCard = (value, details) => ({
  value,
  prefix: '$',
  suffix: '',
  showPrefix: false,
  showSuffix: false,
  details
})

export const PLAN_CARDS = [
  {
    id: 'hobby',
    name: 'Hobby',
    current: true,
    action: 'current',
    actionLabel: 'Current plan',
    featuresTitle: 'All Features Included.',
    features: [
      { icon: 'pi pi-globe', label: 'Global infrastructure' },
      { icon: 'ai ai-edge-functions', label: 'Serverless functions' },
      { icon: 'ai ai-edge-storage', label: 'Storage and database' },
      { icon: 'pi pi-image', label: 'Image optimization' },
      { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation and firewall' }
    ],
    card: {
      monthly: freeCard('Free', 'Start free for personal projects and experimentation'),
      yearly: freeCard('Free', 'Start free for personal projects and experimentation')
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    current: false,
    action: 'upgrade',
    actionLabel: 'Continue with Pro',
    featuresTitle: 'All Hobby features, plus:',
    features: [
      { icon: 'ai ai-workloads', label: 'Additional workloads' },
      { icon: 'ai ai-edge-application', label: 'Higher application limits' },
      { icon: 'ai ai-store', label: 'More storage capacity' },
      { icon: 'ai ai-waf-rules', label: 'Broader security coverage' },
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
      monthly: freeCard('Custom', 'Tailored to your usage requirements and payment terms'),
      yearly: freeCard('Custom', 'Tailored to your usage requirements and payment terms')
    }
  }
]

export const CHANGE_PLAN_DRAWER = `<Drawer v-model:open="changePlanOpen" side="right" size="large">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent aria-label="Change plan">
      <PanelHeader class="w-full">
        <DrawerTitle>Change plan</DrawerTitle>
        <DrawerClose />
      </PanelHeader>
      <PanelContent>
        <div class="flex flex-col items-center gap-(--spacing-md)">
          <DrawerDescription class="m-0 w-full text-body-sm text-(--text-muted)">
            Compare what each tier includes before moving the account onto it.
          </DrawerDescription>
          <SegmentedButton v-model="changePlanPeriod" :options="billingPeriods" aria-label="Billing period" />
          <div class="flex w-full min-w-0 flex-col items-stretch justify-center gap-(--spacing-md) lg:flex-row">
            <CardPricing
              v-for="plan in pricedPlans"
              :key="plan.id"
              aligned
              class="w-full! min-w-0 max-w-none flex-1"
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
                <p v-if="plan.featuresTitle" class="m-0 text-body-sm text-(--text-muted)">{{ plan.featuresTitle }}</p>
                <ul class="m-0 flex w-full list-none flex-col gap-(--spacing-sm) p-0">
                  <li v-for="feature in plan.features" :key="feature.label" class="flex items-start gap-(--spacing-sm)">
                    <i :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']" aria-hidden="true" />
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
      </PanelContent>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

export const CHANGE_PLAN_IMPORTS = [
  "import CardPricing from '@aziontech/webkit/card-pricing'",
  "import DrawerDescription from '@aziontech/webkit/drawer-description'"
]

export const CHANGE_PLAN_SCRIPT = [
  'const changePlanOpen = ref(false)',
  "const changePlanPeriod = ref('yearly')",
  declare('planCards', PLAN_CARDS),
  'const pricedPlans = computed(() =>',
  '  planCards.map((plan) => ({ ...plan, ...plan.card[changePlanPeriod.value] }))',
  ')',
  'const choosePlan = (plan) => {',
  "  if (plan.action === 'upgrade') upgradeOpen.value = true",
  "  else if (plan.action === 'contact') changePlanOpen.value = false",
  '}'
]

export const useChangePlan = (upgradeOpen) => {
  const changePlanOpen = ref(false)
  const changePlanPeriod = ref('yearly')
  const pricedPlans = computed(() =>
    PLAN_CARDS.map((plan) => ({ ...plan, ...plan.card[changePlanPeriod.value] }))
  )
  const choosePlan = (plan) => {
    if (plan.action === 'upgrade') upgradeOpen.value = true
    else if (plan.action === 'contact') changePlanOpen.value = false
  }
  return { changePlanOpen, changePlanPeriod, pricedPlans, choosePlan }
}

export const useChangePlanFlow = () => {
  let closeChangePlan = () => {}
  const upgrade = useUpgrade(() => closeChangePlan())
  const changePlan = useChangePlan(upgrade.upgradeOpen)
  closeChangePlan = () => {
    changePlan.changePlanOpen.value = false
  }
  return { ...upgrade, ...changePlan }
}
