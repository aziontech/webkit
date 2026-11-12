# ChangePlanDrawer (`platform/account/change-plan-drawer`)

> The Change plan drawer the Billing page opens from its Subscription Plan card: a Monthly or Yearly switch over the Free, Pro and Enterprise `CardPricing` cards, each with its feature list and one action, on an account that is on Free. Continue with Pro opens the Upgrade to Pro drawer on top of it, with what is included as a `FeatureList`, and Contact sales closes it. In the upgrade drawer a declined card lands in an `Alert` in the Payment method card with the number invalid, and a payment-service failure raises an error toast with Retry. Built from `Drawer`, `PanelHeader`, `PanelContent`, `ToggleGroup`, `CardPricing`, `FeatureList` and `Button`.

- Surface: product
- Source: `blocks/platform/account/change-plan-drawer/change-plan-drawer.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/change-plan-drawer")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CardPricing](../../../components/card-pricing.md), [Checkbox](../../../components/checkbox.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [FeatureList](../../../components/feature-list.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [Link](../../../components/link.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PaymentBrand](../../../components/payment-brand.md), [Select](../../../components/select.md), [Separator](../../../components/separator.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-microcopy`, `webkit-ux-heuristics`, `webkit-form`, `webkit-errors`

## Asked as

change plan; plan selection; pricing plans drawer; choose plan; switch plan; monthly or yearly plans; compare plans; mudar plano; trocar plano; escolher plano; upgrade to pro; upgrade plan; plan upgrade; checkout; checkout drawer; upgrade drawer; purchase plan; fazer upgrade; assinar plano; finalizar compra; upgrade checkout; accept terms; checkout de upgrade

The drawer the Billing page opens from its Subscription Plan card. The user wants to compare tiers and move the account to one without leaving Billing: a Monthly or Yearly switch over the Free, Pro and Enterprise pricing cards, each with its features and one action. Continue with Pro stacks the Upgrade to Pro drawer on top (what is included, the charge, the payment method and the billing address, then Upgrade); Contact sales closes the drawer.

## When to use

- Changing the subscription plan from Billing or from an upgrade prompt anywhere in the console.

## When not to use

- Choosing a plan during sign-up: use `platform/account/onboarding-form` (its Plan step).
- Editing only the card on file: use `platform/account/payment-method-card`.
- A public pricing page: use the marketing pricing sections in `shells/website`.

## Building blocks

### A. Trigger and actions — `Button` (required)

`Change plan` (outlined) opens the drawer. In each pricing card one large action: the current plan is disabled, the upgrade is `primary`, the rest `outlined`. In the upgrade drawer: Change, Cancel and Update on the payment method, and the footer's Cancel and Upgrade (`type="submit"`, `:loading` while submitting).

### B. Drawer — `Drawer` (required)

Two drawers, both `side="right"`, `size="large"`. The upgrade drawer opens on top of the plan drawer and, on success, closes both. Each reset to Yearly and to the account's address when reopened.

### C. Drawer layer — `DrawerPortal` (required)

Mounts each drawer at the document root, so the upgrade drawer can stack over the plan drawer.

### D. Drawer backdrop — `DrawerOverlay` (required)

Dims the page behind the open drawer.

### E. Drawer panel — `DrawerContent` (required)

The panel that holds header, body and footer, with an accessible name taken from its title.

### F. Drawer header — `PanelHeader` (required)

Holds the title and the close control at the top of each drawer.

### G. Title — `DrawerTitle` (required)

Names the task: `Change plan`, `Upgrade to Pro`. It labels the drawer for assistive technology.

### H. Close — `DrawerClose` (required)

Always present in the header, so the drawer can be left without scrolling to the footer.

### I. Body — `PanelContent` (required)

The scrolling body of each drawer, between header and footer.

### J. Description — `DrawerDescription` (plan drawer)

Says why the user is here before the cards: `Compare what each tier includes before moving the account onto it.`

### K. Billing period — `ToggleGroup` (required)

`Monthly` or `Yearly`, `aria-label="Billing period"`, defaulting to Yearly. In the plan drawer it reprices the cards; in the upgrade drawer it sits in the Charged card's header and switches the charge rows.

### L. Plan — `CardPricing` (required)

One per tier, `kind="contained"`, aligned, actions at the bottom: price with prefix and suffix, details line, the `Current plan` tag on the current tier, a feature list headed by what it builds on (`All Free features, plus:`).

### M. Divider — `Separator` (required)

Above the pricing links and above the Total row.

### N. Pricing links — `Link` (required)

`Learn more about pricing` and `Compare plans`, small, opening in a new tab.

### O. Sections — `Card` (required)

Flush cards for Charged (rows, then Total), Payment method and Address information.

### P. Field — `Field` (required)

Each control of the card form (cardholder, country, number, expiry, security code) and of the address (country, postal code, state, city, line 2) sits in a `Field` with its `Field.Label`.

### Q. Text value — `Input` (required)

Cardholder, number, expiry, security code and the address lines, with `cc-*` autocomplete, `postal-code`, `address-line1` and `address-line2` on the address, and `inputmode="numeric"` on the card numbers.

### R. Choice — `Select` (required)

Country and state.

### S. Notices — `Alert` (required)

`severity="info"`, `size="small"`, under the card fields: the data goes to a PCI-compliant partner. A declined card adds a `danger` `Alert` at the top of the Payment method card, and the number field takes the invalid state and focus.

### T. Same address — `Checkbox` (required)

`Use the same information as my account`, checked by default; unchecking clears the address fields for a different billing address.

### U. Footer — `PanelFooter` (required)

Cancel and Upgrade, side by side from `md`, full width below.

### V. Card brand — `PaymentBrand` (required)

The plate before the card on file in the Payment method section, named after the brand.

### W. Included features — `FeatureList` (required)

What's included in the upgrade drawer, under its visible heading: one check per feature, with the usage allowance as the label and the overage price as its description. Do not hand-write the list with your own check icons. The pricing cards keep their own icon list, since each icon names the feature.

### Toasts — through `toast`

A failure no section owns (the payment service did not answer) is `toast.error` with Retry, and the drawer stays open with the entries kept; a successful upgrade closes both drawers and toasts `The account was upgraded to Pro.` This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Disable every field and secondary action while the upgrade submits, and release the lock when it ends, on success and on failure.
- Show the total and the period it is billed for before the Upgrade button.
- Close both drawers once the upgrade succeeds.

## Don't

- Don't let the current plan's action do anything; it is disabled and labelled `Current plan`.
- Don't ask for the card number again when one is on file; offer Change.
- Don't toast a declined card; it is scoped to the Payment method section.

## Copy

- **Plan actions:** a verb and the destination: `Continue with Pro`, `Contact sales`, `Current plan`.
- **Feature list title:** what the tier adds: `All Pro features, plus:`.
- **Field labels:** 1 to 3 words, sentence case, no parentheses; put formats in the description: `Expiration date` with `Month and year, as MM/YY.`, `Security code` with `3 or 4 digits on the back.`, `Address line 2` with `Optional. Apartment, suite or floor.`
- **Charge rows:** `Next charge`, `Subtotal`, `Yearly discount`, `Total`.
- **Card on file:** `Ending in 8888`.
- **Declined card:** `The card was declined, so the account is still on Free. Check the number or use another card, then select Upgrade again.`
- **Unscoped failure:** a toast with Retry: `The upgrade failed. The account is still on Free.`, described by `The payment service did not answer. Your entries are kept.`
- **Success:** `The account was upgraded to Pro.`

## Accessibility

- Each drawer is a dialog labelled by its title; focus moves into it on open and returns to the trigger on close, including when the stacked drawer closes.
- Each fieldset has a visually hidden legend (`Payment method`, `Address information`).
- After a failed Update or Upgrade, focus moves to the first field in error; after a decline, to the card number.
- The billing period toggle is labelled; a price change is visible text, not color only.

## States

- Default: the plan drawer open on an account that is on Free, Yearly selected. In the upgrade drawer, a new card ending in 0002 is declined and one ending in 0119 makes the payment service fail, so both failure paths can be walked.
- Checkout: the Upgrade to Pro drawer open on its own, as the checkout step: the charge card adds Due today and a note that taxes come from the billing address and the plan renews on the upgrade day; under the address a required `Checkbox` accepts the Terms of Service and the Privacy Policy (each a `Link` in a new tab). Upgrade without it shows `Accept the Terms of Service and the Privacy Policy to upgrade.` on the field and focuses the checkbox; the card and service failures work as in the primary.

## Related

- `platform/account/payment-method-card` — the Payment method card on its own, with its editing state.
- `platform/account/onboarding-form` — the plan choice during sign-up opens the same upgrade drawer.
- `platform/account/profile` — the account settings layout Billing shares.

## Variants

- `Default` — primary (the code below)
- `Checkout` — The Upgrade to Pro drawer opened at checkout: the charge with Due today and the renewal and tax note, the payment method, the billing address, and a required terms Checkbox with Terms of Service and Privacy Policy links; Upgrade without it marks the checkbox invalid and focuses it.

Each variant is the same screen in another state: `get_pattern("platform/account/change-plan-drawer", { variant })`, or the file under `blocks/platform/account/change-plan-drawer/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
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
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  type BillingPeriod = 'monthly' | 'yearly'

  interface BillingAddress {
    country: string | undefined
    postalCode: string
    state: string | undefined
    city: string | undefined
    line1: string
    line2: string
  }

  const changePlanOpen = ref(false)
  const changePlanPeriod = ref<BillingPeriod>('yearly')
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
  const choosePlan = (plan: (typeof planCards)[number]) => {
    if (plan.action === 'upgrade') upgradeOpen.value = true
    else if (plan.action === 'contact') changePlanOpen.value = false
  }

  const upgradeOpen = ref(false)
  const upgradePeriod = ref<BillingPeriod>('yearly')
  const submitting = ref(false)
  const billingPeriods: { value: BillingPeriod; label: string }[] = [
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

  const countryOptions: SelectOptionItem[] = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const cardFieldIds: Record<string, string> = {
    holder: 'card-holder',
    number: 'card-number',
    expiry: 'card-expiry',
    code: 'card-code'
  }
  const editingCard = ref(false)
  const cardLast4 = ref('8888')
  const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })
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
    if (digits.endsWith('0002')) {
      declineCard()
      return
    }
    cardLast4.value = digits.slice(-4)
    editingCard.value = false
    focusById('card-change')
  }

  const fieldState = (field: 'holder' | 'number' | 'expiry' | 'code') => ({
    required: !!cardErrors[field] && !String(cardForm[field]).trim(),
    invalid: !!cardErrors[field] && !!String(cardForm[field]).trim()
  })

  const accountAddress: BillingAddress = {
    country: 'Brazil',
    postalCode: '01310-100',
    state: 'São Paulo',
    city: 'São Paulo',
    line1: 'Avenida Paulista, 1000',
    line2: ''
  }
  const blankAddress = (): BillingAddress => ({
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
  const stateOptions: SelectOptionItem[] = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
    { value: 'Minas Gerais', label: 'Minas Gerais' },
    { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' }
  ]
  const cityOptions: SelectOptionItem[] = [
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
    editingCard.value = false
    clearCardErrors()
  })

  const UPGRADE_TOAST = 'upgrade-result'

  const submitUpgrade = () => {
    if (submitting.value) return
    cardDeclined.value = false
    if (editingCard.value && !validateCard()) return
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
```
