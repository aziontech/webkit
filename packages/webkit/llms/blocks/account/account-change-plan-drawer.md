# AccountChangePlanDrawer (`account/account-change-plan-drawer`)

> The Change plan drawer the Billing page opens from its Subscription Plan card: a Monthly or Yearly switch over the Free, Pro and Enterprise `PricingCard` cards, each with its feature list and one action, on an account that is on Free. Continue with Pro opens the Upgrade to Pro drawer on top of it, with what is included as a `PlanFeatureList`, and Contact sales closes it. In the upgrade drawer a declined card lands in an `Alert` in the Payment method card with the number invalid, and a payment-service failure raises an error toast with Retry. Built from `Drawer`, `PanelHeader`, `PanelBody`, `ToggleGroup`, `PricingCard`, `PlanFeatureList` and `Button`.

- Surface: app
- Source: `blocks/account/account-change-plan-drawer/account-change-plan-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-change-plan-drawer")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [Field](../../components/field.md), [Input](../../components/input.md), [Link](../../components/link.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PaymentBrand](../../components/payment-brand.md), [PlanFeatureList](../../components/plan-feature-list.md), [PricingCard](../../components/pricing-card.md), [Select](../../components/select.md), [Separator](../../components/separator.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md)
- Skills: `webkit-navigation`, `webkit-microcopy`, `webkit-ux-heuristics`, `webkit-form`, `webkit-errors`

## Asked as

change plan; plan selection; pricing plans drawer; choose plan; switch plan; monthly or yearly plans; compare plans; mudar plano; trocar plano; escolher plano; upgrade to pro; upgrade plan; plan upgrade; checkout; checkout drawer; upgrade drawer; purchase plan; fazer upgrade; assinar plano; finalizar compra; upgrade checkout; accept terms; checkout de upgrade; change my plan; upgrade plan drawer

The drawer the Billing page opens from its Subscription Plan card. The user wants to compare tiers and move the account to one without leaving Billing: a Monthly or Yearly switch over the Free, Pro and Enterprise pricing cards, each with its features and one action. Continue with Pro stacks the Upgrade to Pro drawer on top (what is included, the charge, the payment method and the billing address, then Upgrade); Contact sales closes the drawer.

## When to use

- Use account-change-plan-drawer to change a signed-in account's plan.
- Changing the subscription plan from Billing or from an upgrade prompt anywhere in the console.

## When not to use

- Choosing a plan during sign-up: use `account/account-onboarding-form` (its Plan step).
- Editing only the card on file: use `account/account-payment-method-card`.
- A public pricing page: use the marketing pricing sections in `shell/shell-site`.

## Building blocks

### A. Trigger and actions — `Button` (required)

`Change plan` (outlined) opens the drawer. In each pricing card one large action: the current plan is disabled, the upgrade is `primary`, the rest `outline`. In the upgrade drawer: Change, Cancel and Update on the payment method, and the footer's Cancel and Upgrade (`type="submit"`, `:loading` while submitting).

### B. Drawer — `Drawer` (required)

Two drawers, both `side="end"`, `size="large"`. The upgrade drawer opens on top of the plan drawer and, on success, closes both. Each reset to Yearly and to the account's address when reopened.

### C. Drawer panel — `DrawerContent` (required)

The panel that holds header, body and footer, with an accessible name taken from its title. It mounts each drawer at the document root, so the upgrade drawer stacks over the plan drawer, and dims the page behind it with its own overlay.

### D. Drawer header — `PanelHeader` (required)

Holds the title at the top of each drawer, and the drawer adds its close button at the end, so the drawer can be left without scrolling to the footer.

### E. Title — `DrawerTitle` (required)

Names the task: `Change plan`, `Upgrade to Pro`. It labels the drawer for assistive technology.

### F. Body — `PanelBody` (required)

The scrolling body of each drawer, between header and footer.

### G. Description — `DrawerDescription` (plan drawer)

Says why the user is here before the cards: `Compare what each tier includes before moving the account onto it.`

### H. Billing period — `ToggleGroup` (required)

`Monthly` or `Yearly`, `aria-label="Billing period"`, defaulting to Yearly. In the plan drawer it reprices the cards; in the upgrade drawer it sits in the Charged card's header and switches the charge rows.

### I. Plan — `PricingCard` (required)

One per tier, `variant="contained"`, aligned, actions at the bottom: price with prefix and suffix, details line, the `Current plan` tag on the current tier, a `PlanFeatureList` headed by what it builds on (`All Free features, plus:`).

### J. Divider — `Separator` (required)

Above the pricing links and above the Total row.

### K. Pricing links — `Link` (required)

`Learn more about pricing` and `Compare plans`, small, opening in a new tab.

### L. Sections — `Card` (required)

Flush cards for Charged (rows, then Total), Payment method and Address information.

### M. Field — `Field` (required)

Each control of the card form (cardholder, country, number, expiry, security code) and of the address (country, postal code, state, city, line 2) sits in a `Field` with its `Field.Label`.

### N. Text value — `Input` (required)

Cardholder, number, expiry, security code and the address lines, with `cc-*` autocomplete, `postal-code`, `address-line1` and `address-line2` on the address, and `inputmode="numeric"` on the card numbers.

### O. Choice — `Select` (required)

Country and state.

### P. Notices — `Alert` (required)

`severity="info"`, `size="small"`, under the card fields: the data goes to a PCI-compliant partner. A declined card adds a `danger` `Alert` at the top of the Payment method card, and the number field takes the invalid state and focus.

### Q. Same address — `Checkbox` (required)

`Use the same information as my account`, checked by default; unchecking clears the address fields for a different billing address.

### R. Footer — `PanelFooter` (required)

Cancel and Upgrade, side by side from `md`, full width below.

### S. Card brand — `PaymentBrand` (required)

The plate before the card on file in the Payment method section, named after the brand.

### T. Included features — `PlanFeatureList` (required)

What's included in the upgrade drawer, under its visible heading: one check per feature, with the usage allowance as the label and the overage price as its description. Do not hand-write the list with your own check icons. The pricing cards use the same `PlanFeatureList` in their slot, so every feature list in the flow reads the same.

### Toasts — through `toast`

A failure no section owns (the payment service did not answer) is `toast.error` with Retry, and the drawer stays open with the entries kept; a successful upgrade closes both drawers and toasts `The account was upgraded to Pro.` This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its plans and prices through props and emits the upgrade; it fetches nothing and charges nothing. `ChangePlanDrawerProps`, `ChangePlanDrawerPlan`, `ChangePlanDrawerCharges`, `ChangePlanDrawerAddress` and `ChangePlanDrawerUpgrade` are exported from `account-change-plan-drawer.vue`, and `sample.ts` holds the sample tiers, the Pro allowance, the charges, the account address and the card on file the block renders when a prop is left out.

| Prop              | Type                                                      | What it does                                                                                                                      |
| ----------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `plans`           | `ChangePlanDrawerPlan[]`                                  | The tiers in the plan drawer, each with its price per billing period, its features and what its button does.                      |
| `upgradeFeatures` | `ChangePlanDrawerFeature[]`                               | What's included in the upgrade drawer.                                                                                            |
| `charges`         | `Record<ChangePlanDrawerPeriod, ChangePlanDrawerCharges>` | The Charged rows, the Total and Due today per billing period.                                                                     |
| `accountAddress`  | `ChangePlanDrawerAddress`                                 | The account address the billing address starts from.                                                                              |
| `cardLast4`       | `string`                                                  | The last four digits of the card on file.                                                                                         |
| `open`            | `boolean` (`v-model:open`)                                | The plan drawer.                                                                                                                  |
| `upgradeOpen`     | `boolean` (`v-model:upgrade-open`)                        | The upgrade drawer.                                                                                                               |
| `terms`           | `boolean`                                                 | The checkout step: the charge card adds Due today and Upgrade requires the terms checkbox.                                        |
| `loading`         | `boolean`                                                 | The upgrade request is in flight; when it ends with no `error` and no `declined`, both drawers close and the success toast shows. |
| `declined`        | `boolean`                                                 | The issuer declined the card: the danger alert, and the number field invalid and focused.                                         |
| `error`           | `string`                                                  | Why the upgrade failed, in an error toast with Retry; the drawer stays open with the entries kept.                                |

| Event         | Payload           | When                                                                                                                                    |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `plan-select` | `(event, plan)`   | A pricing card's action; Continue with Pro also opens the upgrade drawer.                                                               |
| `upgrade`     | `(event, values)` | Upgrade passed validation: `{ period, card, address }`, `card` is `null` for the card on file. Retry in the error toast sends it again. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import AccountChangePlanDrawer, {
    type ChangePlanDrawerUpgrade
  } from './account-change-plan-drawer.vue'

  const { data } = usePlans()
  const { pending, declined, error, execute } = useUpgrade()
  const upgrade = (event: Event, values: ChangePlanDrawerUpgrade) => execute(values)
</script>

<template>
  <AccountChangePlanDrawer
    :plans="data?.plans"
    :upgrade-features="data?.proFeatures"
    :charges="data?.charges"
    :account-address="data?.address"
    :card-last4="data?.cardLast4"
    :loading="pending"
    :declined="declined"
    :error="error ? 'The payment service did not answer. Your entries are kept.' : ''"
    @upgrade="upgrade"
  />
</template>
```

Then delete `sample.ts` and its import.

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

- Default: the Change plan button; it opens the plan drawer on an account that is on Free, Yearly selected. Continue with Pro opens the upgrade drawer, and Upgrade emits `upgrade`; `declined` shows the declined card and `error` the payment service failure.
- Checkout: the Upgrade to Pro drawer open on its own (`upgradeOpen` and `terms`), as the checkout step: the charge card adds Due today and a note that taxes come from the billing address and the plan renews on the upgrade day; under the address a required `Checkbox` accepts the Terms of Service and the Privacy Policy (each a `Link` in a new tab). Upgrade without it shows `Accept the Terms of Service and the Privacy Policy to upgrade.` on the field and focuses the checkbox; the card and service failures come from `declined` and `error` as in the primary.

## Related

- `account/account-payment-method-card` — the Payment method card on its own, with its editing state.
- `account/account-onboarding-form` — the plan choice during sign-up opens the same upgrade drawer.
- `settings/settings-form` (Profile) — the account settings layout Billing shares.

## Variants

- `Default` — primary (the code below)
- `Checkout` — The Upgrade to Pro drawer opened at checkout: the charge with Due today and the renewal and tax note, the payment method, the billing address, and a required terms Checkbox with Terms of Service and Privacy Policy links; Upgrade without it marks the checkbox invalid and focuses it.

Each variant is the same screen in another state: `get_block("account/account-change-plan-drawer", { variant })`, or the file under `blocks/account/account-change-plan-drawer/variants/`.

## Code (`Default`)

```vue
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
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
          >
            <aside class="flex flex-col gap-(--spacing-md)">
              <div class="flex flex-col gap-(--spacing-xs)">
                <h3
                  class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:py-(--spacing-sm)"
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
                          Taxes are calculated from the address below and shown on the invoice. The
                          plan renews
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
                  <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
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
                            variant="outline"
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
```

## `sample.ts`

```ts
import type {
  ChangePlanDrawerAddress,
  ChangePlanDrawerCharges,
  ChangePlanDrawerFeature,
  ChangePlanDrawerPeriod,
  ChangePlanDrawerPlan
} from './account-change-plan-drawer.vue'

export const samplePlans: ChangePlanDrawerPlan[] = [
  {
    id: 'free',
    name: 'Free',
    current: true,
    action: 'current',
    actionLabel: 'Current plan',
    featuresTitle: 'All features included',
    features: [
      { label: 'Global infrastructure' },
      { label: 'Serverless compute' },
      { label: 'Storage and database' },
      { label: 'Image optimization' },
      { label: 'DDoS mitigation and firewall' }
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
      { label: 'Additional resources' },
      { label: 'Higher request limits' },
      { label: 'More storage capacity' },
      { label: 'Broader security coverage' },
      { label: 'Configurable spend limit' }
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
      { label: 'On-demand pricing' },
      { label: 'Cut costs with commitments' },
      { label: 'Capacity Reservation available' },
      { label: 'Savings Plan available' },
      { label: 'Advanced support available' }
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

export const sampleUpgradeFeatures: ChangePlanDrawerFeature[] = [
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

export const sampleCharges: Record<ChangePlanDrawerPeriod, ChangePlanDrawerCharges> = {
  monthly: {
    rows: [
      { label: 'Next charge', value: '$25', suffix: 'on Dec 16, 2026' },
      { label: 'Subtotal', value: '$25', suffix: 'per month' }
    ],
    total: { value: '$25', suffix: 'per month' },
    dueToday: '$25'
  },
  yearly: {
    rows: [
      { label: 'Next charge', value: '$240', suffix: 'on Nov 16, 2027' },
      { label: 'Subtotal', value: '$300', suffix: 'per year' },
      { label: 'Yearly discount', value: '−$60', suffix: 'per year' }
    ],
    total: { value: '$240', suffix: 'per year' },
    dueToday: '$240'
  }
}

export const sampleAccountAddress: ChangePlanDrawerAddress = {
  country: 'United States',
  postalCode: '94105',
  state: 'California',
  city: 'San Francisco',
  line1: '100 Market Street',
  line2: 'Suite 400'
}

export const sampleCardLast4 = '8888'
```
