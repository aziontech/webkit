# AccountOnboardingForm (`account/account-onboarding-form`)

> The /signup/onboarding screen, frame included: the signed-out `AppHeader` over a two-column grid whose left column is a `Card` holding a `Wizard` (the step line, the step heading, the step's fields and the Cancel / Previous / Next footer, Next gated on the required answers), and whose right column, from `lg` up, is a wireframe of the app the new organization will open into. The three steps live in one component; each story here opens on one of them. Built from `Wizard`, `Field` with `Input`, `RadioGroup` with `variant="card"` in a `fieldset` under a `Field.Legend` with a `FieldError`, a `Field.Label` choice card around a `Switch`, `Tag`, `Avatar` and `Button`; picking a paid plan opens the upgrade `Drawer` with `ToggleGroup`, `Field` with `Input`, `Select` and `Checkbox`, `Link` and `Alert`. A full page routed outside ConsoleLayout.

- Surface: app
- Source: `blocks/account/account-onboarding-form/account-onboarding-form.vue` in `@aziontech/ui`
- MCP: `get_block("account/account-onboarding-form")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [Field](../../components/field.md), `FieldDescription`, `FieldError`, [Input](../../components/input.md), [Link](../../components/link.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PaymentBrand](../../components/payment-brand.md), [PlanFeatureList](../../components/plan-feature-list.md), [RadioGroup](../../components/radio-group.md), [Select](../../components/select.md), [Separator](../../components/separator.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [ToggleGroup](../../components/toggle-group.md), `utils/focus-invalid`, [Wizard](../../components/wizard.md)
- Skills: `azion-ui-form`, `azion-ui-errors`, `azion-ui-microcopy`

## Asked as

onboarding; onboarding form; signup onboarding; create organization; organization setup; choose plan step; multi-step onboarding; onboarding wizard; welcome flow; first access setup; cadastro da organização; criar organização; onboarding da conta; onboarding stepper

The `/signup/onboarding` screen, frame included. A new user has an account but no organization yet, and needs to create one with as few questions as possible: one step at a time in a card (organization, plan, profile), with a live wireframe beside it from `lg` showing the app the organization will open into, named and colored by what they type. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- The first run after sign-up, before the user has an organization.
- Any short, linear setup of two to four steps that must finish before the product is usable.

## When not to use

- Signing in or creating the account itself: use `auth/auth-sign-in`.
- Creating a resource inside the console: use `create/create-wizard`.
- Changing an existing plan: use `account/account-change-plan-drawer`.

## Building blocks

### A. Bar — `AppHeader` (required)

The signed-out bar (`top-bar/top-bar-auth`): brand at the start, Documentation at the end.

### B. Brand — `Brand` (required)

In the bar, inside `AppHeader.Brand` linked home through its `href` with `aria-label="Azion home"`.

### C. Actions — `Button` (required)

Documentation in the bar. The step's actions are the `Wizard` footer: Cancel, Previous from step 2 on, and Next, which becomes `Create Organization` on the last step. Cancel clears every answer and returns to the first step; an app that has somewhere to send the person back to (the sign-in page) routes there in the `cancel` handler instead.

### D. Step card — `Card` (required)

Flush card capped at `--container-xl`, holding the `Wizard`.

### E. Steps — `Wizard` (required)

One `Wizard` (`aria-label="Set up your organization"`, `submit-label="Create Organization"`, `loading` bound to the create request) with three `Wizard.Step`s: Create your organization, Select your plan, Tell us about your work. It owns the step state, the `Step 1 of 3` line, the step heading and the footer; the card is narrower than the Wizard's rail breakpoint, so the rail stays hidden and only the step line shows. Next is gated in the `next` handler: it calls `preventDefault()` while a required answer is missing and the step shows why.

### F. Fields — `Field` (required)

Full name and organization name, each with `Field.Label` and `Field.Description`. Each `Field` is `required` from the start, so the label shows the Required marker; on submit, an empty value sets `invalid` and the description becomes `This field is required.`

### G. Text inputs — `Input` (required)

Large; full name with `autocomplete="name"`.

### H. Group label — `Field.Legend` (required)

`Organization mark`, the `type="label"` legend of the `fieldset` that holds the radio cards.

### I. Mark picker — `RadioGroup` with `variant="card"` (required)

Seven colors, `aria-label="Organization mark"`, each card showing the generated mark.

### J. Mark — `Avatar` (required)

Square avatars: `pattern="marble"` seeded by the organization name with the card's `colors` in each radio card, the same marble in the selected colors for the organization in the wireframe, and initials for the workspace. Never hand-build the SVG or pass it as `src`.

### K. Picker hint — `FieldDescription`, `FieldError` (required)

Under the picker: `Generated from the organization's name. Select its color.`

### L. Plan step — `Tag`, `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter`, `PlanFeatureList`, `ToggleGroup`, `Select`, `Checkbox`, `PaymentBrand`, `Separator`, `Link` (required)

The plans are full-width `RadioGroup` cards, each with its name `Tag` and price. Free selects directly; Pro or Enterprise opens the upgrade `Drawer`, the Checkout of `account/account-change-plan-drawer` (What's included as a `PlanFeatureList`, the billing period `ToggleGroup`, the payment method with its `PaymentBrand`, the billing address `Select`s and the `Checkbox` that reuses the account's address, the pricing `Link`s), and selects only once Upgrade is pressed.

### M. Work step — `Switch`, `Alert` (required)

The usage and role questions as `RadioGroup` cards, a `Field.Label` choice card around a `Switch` for the onboarding session, and one `Alert` in the card for the create outcome.

## Data

The block takes the signed-in account, the plans and the create request's state through props and emits the answers; it fetches nothing and fakes no request. `OnboardingFormValues`, `OnboardingFormPlan`, `OnboardingFormAccount` and `OnboardingFormProps` are exported from `account-onboarding-form.vue`, and `sample.ts` holds the sample account and plans the block renders when `account` or `plans` is left out. The form keeps its own draft across the three steps.

| Prop            | Type                    | What it does                                                                                                                                          |
| --------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`       | `OnboardingFormAccount` | The signed-in account: its email in the wireframe, the address the upgrade drawer reuses and the card on file.                                        |
| `plans`         | `OnboardingFormPlan[]`  | The plan rows. A plan with `charge` opens the upgrade drawer (its `features` and charge per period); one without selects directly.                    |
| `defaultValues` | `OnboardingFormDraft`   | Answers the form opens with (a draft restored from storage).                                                                                          |
| `step`          | `number`                | The open step, `0` to `2` (`v-model:step` to own it, for a route per step).                                                                           |
| `loading`       | `boolean`               | The create request is in flight: the last step locks and Create Organization spins. When it turns off with no `error`, `Organization created.` shows. |
| `error`         | `string`                | Why the organization was not created, shown in the danger `Alert` with Retry; the answers are kept.                                                   |

| Event         | Payload           | When                                                                                           |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `submit`      | `(event, values)` | Create Organization (or Retry in the alert) with both answers given; `values` is every answer. |
| `cancel`      | `(event)`         | Cancel; the answers are already cleared and the form is back on the first step.                |
| `update:step` | `(step)`          | The open step changed.                                                                         |

To go live, render the block from a route that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import AccountOnboardingForm, { type OnboardingFormValues } from './account-onboarding-form.vue'

  const { data: account } = useAccount()
  const { data: plans } = usePlans()
  const creating = ref(false)
  const createError = ref('')

  const create = async (_event: MouseEvent, values: OnboardingFormValues) => {
    creating.value = true
    createError.value = ''
    try {
      await createOrganization(values)
    } catch {
      createError.value =
        "The organization wasn't created. Check your connection, then retry. Your answers are kept."
    } finally {
      creating.value = false
    }
  }
</script>

<template>
  <AccountOnboardingForm
    v-if="account && plans"
    :account="account"
    :plans="plans"
    :loading="creating"
    :error="createError"
    @submit="create"
    @cancel="router.push('/login')"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Validate on Next, not on every keystroke; required fields show the Required marker from the start and turn `invalid` only after a failed Next.
- Explain the step under its heading before the fields (what an organization is, that it is created once).
- Keep every value when the user goes to the previous step; the three steps share one component state.
- Hide the wireframe below `lg`; it is decoration (`aria-hidden`).

## Don't

- Don't toast on this screen; a server failure creating the organization lands in one `Alert` in the card, as on the auth screens.
- Don't ask for anything the console can ask later.
- Don't build the step counter, heading or footer by hand; the `Wizard` owns them.

## Copy

- **Step line:** `Step 1 of 3`. **Heading:** the task: `Create your organization`.
- **Field descriptions:** why it is asked: `How the app will greet you.`, `Usually your company. Everyone you invite will see it.`
- **Required:** `This field is required.`
- **Final action:** names what is created: `Create Organization`.

## Accessibility

- The page `h1` is visually hidden (`Set up your organization`); each step heading is the Wizard's `h2`, and the Wizard moves focus to it on every step change.
- A Next that cannot advance (a required field empty, no plan picked) moves focus to the first invalid field and scrolls it into view.
- The fields sit in a `fieldset` with a hidden legend.
- The Wizard's `Step 1 of 3` line is a polite live region, so the step change is announced.

## States

- Organization: step 1 of 3 (`step` is `0`, the default), name fields and the organization mark.
- Plan: step 2 of 3 (`step` is `1`), the plans as rows; Free selects directly, Pro or Enterprise opens the upgrade drawer and selects only once Upgrade is pressed. The drawer is the Checkout of `account/account-change-plan-drawer` (What's included as a `PlanFeatureList`, the charge, the payment method and the billing address); keep its fields and copy identical to that block rather than diverging.
- Profile: step 3 of 3 (`step` is `2`), the usage and role questions, the onboarding-session switch and Create Organization, which emits `submit` and locks the step while `loading` is set, then answers in one `Alert` in the card: `Organization created.` when `loading` turns off with no `error`, or the `error` message (`The organization wasn't created. Check your connection, then retry. Your answers are kept.`) with Retry.

## Related

- `top-bar/top-bar-auth` — the bar this screen renders.
- `auth/auth-sign-in` — the screen before it.
- `account/account-change-plan-drawer` — the upgrade drawer the Plan step opens.
- `state/state-first-use` — what the new organization lands on.

## Steps

- organization
- plan
- profile

## Variants

- `Organization` — primary (the code below)
- `Plan` — Step 2 of 3: the three plans as full-width rows; Free selects directly, while Pro or Enterprise opens the upgrade drawer (the `account/account-change-plan-drawer#Checkout` form, What's included as a `PlanFeatureList`) and only selects once Upgrade is pressed.
- `Profile` — Step 3 of 3: the usage and role questions, the onboarding-session switch and the Create Organization action, which asks for both answers first.

Each variant is the same screen in another state: `get_block("account/account-onboarding-form", { variant })`, or the file under `blocks/account/account-onboarding-form/variants/`.

## Code (`Organization`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import AppHeader from '@aziontech/ui/app-header'
  import Brand from '@aziontech/ui/brand'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import { type PlanFeatureListItem } from '@aziontech/ui/plan-feature-list'
  import RadioGroup from '@aziontech/ui/radio-group-root'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/ui/tag'
  import { focusFirstInvalid } from '@aziontech/ui/utils/focus-invalid'
  import Wizard from '@aziontech/ui/wizard'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { accents, blankAddress, blankCard } from './onboarding-form-data'
  import OrganizationPreview from './parts/organization-preview.vue'
  import OrganizationStep from './parts/organization-step.vue'
  import ProfileStep from './parts/profile-step.vue'
  import UpgradeDrawer from './parts/upgrade-drawer.vue'
  import { sampleAccount, samplePlans } from './sample'

  /** How often a paid plan is billed. */
  export type OnboardingFormBillingPeriod = 'monthly' | 'yearly'

  /** What a paid plan charges for one billing period. */
  export interface OnboardingFormCharge {
    /** The lines above the total: next charge, subtotal, discount. */
    rows: { label: string; value: string; suffix?: string }[]
    /** The total and what it covers. */
    total: { value: string; suffix: string }
  }

  /** One plan row of the plan step. */
  export interface OnboardingFormPlan {
    /** Stable key, sent as the chosen plan. */
    value: string
    /** What the person is working on, the row's first line. */
    label: string
    /** The row's second line. */
    description: string
    /** The row's accessible name, with the plan and its price. */
    ariaLabel: string
    /** Plan name, shown in the tag and the upgrade drawer title. */
    name: string
    /** Tag severity. */
    severity?: TagSeverity
    /** Tag variant. */
    variant?: TagVariant
    /** Price line under the tag. */
    price: string
    /** What the upgrade includes; a plan with no charge selects without the drawer. */
    features?: PlanFeatureListItem[]
    /** The charge per billing period; set it for a paid plan, which opens the upgrade drawer. */
    charge?: Record<OnboardingFormBillingPeriod, OnboardingFormCharge>
  }

  /** A billing address. */
  export interface OnboardingFormAddress {
    /** Country option value. */
    country: string | undefined
    /** Postal code. */
    postalCode: string
    /** State option value. */
    state: string | undefined
    /** City option value. */
    city: string | undefined
    /** Street line. */
    line1: string
    /** Apartment or suite line. */
    line2: string
  }

  /** The signed-in account the organization is created for. */
  export interface OnboardingFormAccount {
    /** Sign-in address, shown in the wireframe and used when no full name is typed. */
    email: string
    /** The account address the upgrade drawer reuses by default. */
    address: OnboardingFormAddress
    /** Last four digits of the card on file. */
    cardLast4: string
  }

  /** The answers Create Organization sends. */
  export interface OnboardingFormValues {
    /** The person's full name. */
    fullName: string
    /** The organization name. */
    organizationName: string
    /** The organization mark color. */
    accent: string
    /** The chosen plan value. */
    plan: string
    /** Billing period chosen in the upgrade drawer. */
    billingPeriod: OnboardingFormBillingPeriod
    /** Billing address chosen in the upgrade drawer. */
    billingAddress: OnboardingFormAddress
    /** How the platform will be used. */
    usage: string
    /** The person's role. */
    role: string
    /** Whether to schedule an onboarding session. */
    session: boolean
  }

  /** Answers the form opens with. */
  export type OnboardingFormDraft = Partial<
    Pick<
      OnboardingFormValues,
      'fullName' | 'organizationName' | 'accent' | 'plan' | 'usage' | 'role' | 'session'
    >
  >

  export interface OnboardingFormProps {
    /** The signed-in account. Left out, the sample renders. */
    account?: OnboardingFormAccount
    /** The plans of the plan step. Left out, the sample renders. */
    plans?: OnboardingFormPlan[]
    /** Answers the form opens with, such as a draft restored from storage. */
    defaultValues?: OnboardingFormDraft
    /** The create request is in flight: the last step locks and Create Organization spins. */
    loading?: boolean
    /** Why the organization was not created, shown in the danger alert with Retry; the answers are kept. */
    error?: string
    /** Focus the open step's first field when the screen mounts; turn off when the form is embedded in a longer page. */
    autofocus?: boolean
  }

  const props = withDefaults(defineProps<OnboardingFormProps>(), {
    account: undefined,
    plans: undefined,
    defaultValues: () => ({}),
    loading: false,
    error: '',
    autofocus: true
  })

  const emit = defineEmits<{
    submit: [event: MouseEvent, values: OnboardingFormValues]
    cancel: [event: MouseEvent]
  }>()

  const step = defineModel<number>('step', { default: 0 })

  const account = computed(() => props.account ?? sampleAccount)
  const plans = computed(() => props.plans ?? samplePlans)
  const email = computed(() => account.value.email)

  const fullName = ref(props.defaultValues.fullName ?? '')
  const organizationName = ref(props.defaultValues.organizationName ?? '')
  const accent = ref(props.defaultValues.accent ?? 'orange')
  const organizationSubmitted = ref(false)

  const previewName = computed(() => organizationName.value.trim() || 'Your organization')
  const ownerName = computed(() => fullName.value.trim())
  const accentColors = computed(
    () => (accents.find((item) => item.value === accent.value) ?? accents[0]).colors
  )

  const plan = ref<string | undefined>(props.defaultValues.plan)
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const planSubmitted = ref(false)
  const period = ref<OnboardingFormBillingPeriod>('yearly')
  const editing = ref(false)
  const card = reactive({ last4: account.value.cardLast4, ...blankCard })
  const address = reactive({ useAccountInformation: true, ...account.value.address })

  const upgrade = computed(() =>
    pendingPlanId.value ? plans.value.find((item) => item.value === pendingPlanId.value) : undefined
  )

  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? account.value.address : blankAddress)
  )

  const selectPlan = (value: string | undefined) => {
    if (!value) return
    planSubmitted.value = false
    if (!plans.value.find((item) => item.value === value)?.charge) {
      plan.value = value
      return
    }
    pendingPlanId.value = value
    period.value = 'yearly'
    editing.value = false
    Object.assign(address, { useAccountInformation: true, ...account.value.address })
    upgradeOpen.value = true
  }

  const onOpenChange = (isOpen: boolean) => {
    upgradeOpen.value = isOpen
    if (!isOpen) pendingPlanId.value = ''
  }

  const confirmUpgrade = () => {
    plan.value = pendingPlanId.value
    onOpenChange(false)
  }

  const usage = ref<string | undefined>(props.defaultValues.usage)
  const role = ref<string | undefined>(props.defaultValues.role)
  const session = ref(props.defaultValues.session ?? false)
  const profileSubmitted = ref(false)
  const creating = computed(() => props.loading)
  const outcome = ref('')

  const createOrganization = (event: MouseEvent) => {
    if (creating.value) return
    profileSubmitted.value = true
    outcome.value = ''
    if (!usage.value || !role.value || !plan.value) return
    const { useAccountInformation: _reuse, ...billingAddress } = address
    emit('submit', event, {
      fullName: fullName.value.trim(),
      organizationName: organizationName.value.trim(),
      accent: accent.value,
      plan: plan.value,
      billingPeriod: period.value,
      billingAddress,
      usage: usage.value,
      role: role.value,
      session: session.value
    })
  }

  const wizardEl = ref<HTMLElement | null>(null)
  const FIRST_FIELD = 'input:not([type=hidden]):not([disabled]), textarea:not([disabled])'

  onMounted(() => {
    if (props.error) outcome.value = 'failed'
    if (!props.autofocus) return
    void nextTick(() => {
      const fields = [...(wizardEl.value?.querySelectorAll<HTMLElement>(FIRST_FIELD) ?? [])]
      fields.find((field) => field.getClientRects().length > 0)?.focus()
    })
  })

  watch(
    () => props.error,
    (next) => {
      if (next && !props.loading) outcome.value = 'failed'
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      outcome.value = props.error ? 'failed' : 'created'
    }
  )

  const onNext = (event: MouseEvent, position: number) => {
    if (position === 0) {
      organizationSubmitted.value = true
      if (!fullName.value.trim() || !organizationName.value.trim()) event.preventDefault()
    }
    if (position === 1) {
      planSubmitted.value = true
      if (!plan.value) event.preventDefault()
    }
    if (event.defaultPrevented) void focusFirstInvalid(wizardEl.value)
  }

  const startOver = (event: MouseEvent) => {
    fullName.value = ''
    organizationName.value = ''
    accent.value = 'orange'
    organizationSubmitted.value = false
    plan.value = undefined
    planSubmitted.value = false
    usage.value = undefined
    role.value = undefined
    session.value = false
    profileSubmitted.value = false
    outcome.value = ''
    step.value = 0
    emit('cancel', event)
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          href="https://example.com/docs"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div
        class="layout-column layout-boundary grid flex-1 grid-cols-1 items-center gap-(--spacing-2xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto"
      >
        <div class="flex w-full max-w-(--container-xl) flex-col justify-self-center lg:my-auto">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #default>
              <div
                ref="wizardEl"
                class="p-(--spacing-md)"
              >
                <h1 class="sr-only">Set up your organization</h1>
                <Wizard
                  v-model="step"
                  aria-label="Set up your organization"
                  submit-label="Create Organization"
                  :loading="creating"
                  @next="onNext"
                  @submit="createOrganization"
                  @cancel="startOver"
                >
                  <Wizard.Step
                    title="Create your organization"
                    description="Everything you deploy lives inside an organization. Yours is created once, here, and you can invite people into it afterwards."
                  >
                    <OrganizationStep
                      v-model:full-name="fullName"
                      v-model:organization-name="organizationName"
                      v-model:accent="accent"
                      :submitted="organizationSubmitted"
                      :preview-name="previewName"
                    />
                  </Wizard.Step>
                  <Wizard.Step
                    title="Select your plan"
                    description="What you are building decides the plan. You can change it later from Billing. Nothing here is locked in."
                  >
                    <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                      <legend class="sr-only">Select your plan</legend>

                      <div class="animate-fade-in motion-reduce:animate-none">
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <RadioGroup
                            :model-value="pendingPlanId || plan"
                            variant="card"
                            orientation="horizontal"
                            :options="plans"
                            aria-label="Plan"
                            @update:model-value="selectPlan"
                          >
                            <template #tag="{ option }">
                              <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                                <Tag
                                  :label="option.name"
                                  :variant="option.variant"
                                  :severity="option.severity"
                                  size="small"
                                />
                                <span class="text-label-sm text-(--text-muted)">
                                  {{ option.price }}
                                </span>
                              </div>
                            </template>
                          </RadioGroup>

                          <FieldError v-if="planSubmitted && !plan"
                            >Select a plan to continue.</FieldError
                          >

                          <UpgradeDrawer
                            v-model:period="period"
                            v-model:card="card"
                            v-model:editing="editing"
                            v-model:address="address"
                            :open="upgradeOpen"
                            :upgrade="upgrade"
                            @update:open="onOpenChange"
                            @confirm="confirmUpgrade"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </Wizard.Step>
                  <Wizard.Step
                    title="Tell us about your work"
                    description="Two answers, and they only shape what we recommend you next. Neither changes your plan or what you can do."
                  >
                    <Alert
                      v-if="outcome === 'failed'"
                      key="failed"
                      severity="danger"
                      size="small"
                      :label="error"
                    >
                      <template #actions>
                        <Button
                          label="Retry"
                          variant="secondary"
                          size="small"
                          @click="createOrganization"
                        />
                      </template>
                    </Alert>
                    <Alert
                      v-else-if="outcome === 'created'"
                      key="created"
                      severity="success"
                      size="small"
                      label="Organization created."
                    />

                    <ProfileStep
                      v-model:usage="usage"
                      v-model:role="role"
                      v-model:session="session"
                      :submitted="profileSubmitted"
                      :creating="creating"
                    />
                  </Wizard.Step>
                </Wizard>
              </div>
            </template>
          </Card>
        </div>

        <OrganizationPreview
          :preview-name="previewName"
          :owner-name="ownerName"
          :email="email"
          :accent-colors="accentColors"
        />
      </div>
    </main>
  </div>
</template>
```

## `sample.ts`

```ts
import type { SelectOptionItem } from '@aziontech/ui/select'

import type { OnboardingFormAccount, OnboardingFormPlan } from './account-onboarding-form.vue'

export const sampleAccount: OnboardingFormAccount = {
  email: 'myemail@example.com',
  address: {
    country: 'United States',
    postalCode: '94105',
    state: 'California',
    city: 'San Francisco',
    line1: '100 Market Street',
    line2: 'Suite 400'
  },
  cardLast4: '8888'
}

export const samplePlans: OnboardingFormPlan[] = [
  {
    value: 'free',
    label: "I'm working on personal projects",
    description: 'Start free for personal projects and experimentation',
    ariaLabel: "I'm working on personal projects. Free plan, Free.",
    name: 'Free',
    variant: 'contrast',
    price: 'Free'
  },
  {
    value: 'pro',
    label: "I'm working on commercial projects",
    description: 'For growing projects with higher usage demand',
    ariaLabel: "I'm working on commercial projects. Pro plan, From $20/mo.",
    name: 'Pro',
    severity: 'info',
    price: 'From $20/mo',
    features: [
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
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next charge', value: '$25', suffix: 'on Dec 16, 2026' },
          { label: 'Subtotal', value: '$25', suffix: 'per month' }
        ],
        total: { value: '$25', suffix: 'per month' }
      },
      yearly: {
        rows: [
          { label: 'Next charge', value: '$240', suffix: 'on Nov 16, 2027' },
          { label: 'Subtotal', value: '$300', suffix: 'per year' },
          { label: 'Yearly discount', value: '−$60', suffix: 'per year' }
        ],
        total: { value: '$240', suffix: 'per year' }
      }
    }
  },
  {
    value: 'enterprise',
    label: "I'm running production at scale",
    description: 'Optimize costs with usage or spend commitments',
    ariaLabel: "I'm running production at scale. Enterprise plan, From $2,000/mo.",
    name: 'Enterprise',
    variant: 'primary',
    price: 'From $2,000/mo',
    features: [
      { label: 'Unlimited resources' },
      { label: '1B requests', description: 'then as low as $0.60 per 1M' },
      { label: '500 hours of compute time', description: 'then $0.12 per hour' },
      { label: '1 TB of event log storage', description: 'then $0.08 per GB-month' },
      { label: '10 TB of file storage', description: 'then as low as $0.015 per GB-month' },
      { label: '100 GB of database storage', description: 'then $0.50 per GB-month' },
      { label: '1B security rule evaluations', description: 'then as low as $0.20 per 1M' },
      { label: 'DDoS protection included' },
      { label: 'PCI DSS 4.0.1 Level 1' },
      { label: 'SOC 2 Type 2 / SOC 3' },
      { label: 'Data migration assistance' },
      { label: '99.99% uptime SLA' },
      { label: 'Named account team' }
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next charge', value: '$2,000', suffix: 'on Dec 16, 2026' },
          { label: 'Subtotal', value: '$2,000', suffix: 'per month' }
        ],
        total: { value: '$2,000', suffix: 'per month' }
      },
      yearly: {
        rows: [
          { label: 'Next charge', value: '$19,200', suffix: 'on Nov 16, 2027' },
          { label: 'Subtotal', value: '$24,000', suffix: 'per year' },
          { label: 'Yearly discount', value: '−$4,800', suffix: 'per year' }
        ],
        total: { value: '$19,200', suffix: 'per year' }
      }
    }
  }
]

export const countryOptions: SelectOptionItem[] = [
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Japan', label: 'Japan' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' }
]
export const stateOptions: SelectOptionItem[] = [
  { value: 'California', label: 'California' },
  { value: 'New York', label: 'New York' },
  { value: 'Texas', label: 'Texas' },
  { value: 'Washington', label: 'Washington' }
]
export const cityOptions: SelectOptionItem[] = [
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'San Diego', label: 'San Diego' },
  { value: 'San Francisco', label: 'San Francisco' }
]
```

## `onboarding-form-data.ts`

```ts
import type {
  OnboardingFormAddress,
  OnboardingFormBillingPeriod
} from './account-onboarding-form.vue'

/** One organization mark the first step offers. */
export interface Accent {
  value: string
  label: string
  ariaLabel: string
  colors: string[]
}

export const accents: Accent[] = [
  {
    value: 'orange',
    label: 'Orange',
    ariaLabel: 'Orange mark',
    colors: ['var(--primary)', 'var(--primary)', 'var(--warning)']
  },
  {
    value: 'yellow',
    label: 'Yellow',
    ariaLabel: 'Yellow mark',
    colors: ['var(--warning)', 'var(--warning)', 'var(--warning-mark)']
  },
  {
    value: 'red',
    label: 'Red',
    ariaLabel: 'Red mark',
    colors: ['var(--danger)', 'var(--danger)', 'var(--danger-mark)']
  },
  {
    value: 'green',
    label: 'Green',
    ariaLabel: 'Green mark',
    colors: ['var(--success)', 'var(--success)', 'var(--success-mark)']
  },
  {
    value: 'blue',
    label: 'Blue',
    ariaLabel: 'Blue mark',
    colors: ['var(--info)', 'var(--info)', 'var(--info-mark)']
  },
  {
    value: 'violet',
    label: 'Violet',
    ariaLabel: 'Violet mark',
    colors: ['var(--chart-series-3)', 'var(--chart-series-3)', 'var(--chart-series-8)']
  },
  {
    value: 'gray',
    label: 'Gray',
    ariaLabel: 'Gray mark',
    colors: ['var(--bg-selected)', 'var(--text-muted)', 'var(--text-disabled)']
  }
]

export const accountInitials = (name: string) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

export const pricingLinks = [
  {
    label: 'Learn more about pricing',
    href: 'https://example.com/pricing'
  },
  {
    label: 'Compare plans',
    href: 'https://example.com/pricing#comparison'
  }
]

export const periods: { value: OnboardingFormBillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

export const blankAddress: OnboardingFormAddress = {
  country: undefined,
  postalCode: '',
  state: undefined,
  city: undefined,
  line1: '',
  line2: ''
}
export const blankCard = {
  holder: '',
  country: undefined as string | undefined,
  number: '',
  expiry: '',
  code: ''
}

export const usageOptions = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'study', label: 'Study' }
]
export const roleOptions = [
  { value: 'software_developer', label: 'Software developer' },
  { value: 'devops_engineer', label: 'DevOps engineer' },
  { value: 'infrastructure_analyst', label: 'Infrastructure analyst' },
  { value: 'network_engineer', label: 'Network engineer' },
  { value: 'security_specialist', label: 'Security specialist' },
  { value: 'data_engineer', label: 'Data engineer' },
  { value: 'ai_ml_engineer', label: 'AI/ML engineer' },
  { value: 'iot_engineer', label: 'IoT engineer' },
  { value: 'team_lead', label: 'Team lead' },
  { value: 'other', label: 'Other' }
]
```

## `parts/organization-preview.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'

  import { accountInitials } from '../onboarding-form-data'

  defineProps<{ previewName: string; ownerName: string; email: string; accentColors: string[] }>()

  const PREVIEW_FIGURE_CLASS =
    'pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) ' +
    'border-(--border-muted) bg-(--bg-surface) select-none'
</script>

<template>
  <div class="min-w-0 max-w-full lg:sticky lg:top-(--spacing-xl) lg:my-auto">
    <div
      class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden ltr:mask-r-from-72% rtl:mask-l-from-72% mask-b-from-80% lg:block"
    >
      <figure
        :class="PREVIEW_FIGURE_CLASS"
        aria-hidden="true"
      >
        <div
          class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
        >
          <span class="size-(--size-5) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)" />

          <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              :alt="previewName"
              :colors="accentColors"
              pattern="marble"
              size="small"
              variant="square"
              class="shrink-0"
            />
            <span class="min-w-0 truncate text-label-md text-(--text-default)">
              {{ previewName }}
            </span>
          </span>

          <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              label="MW"
              size="small"
              variant="square"
              class="shrink-0"
            />
            <span class="min-w-0 truncate text-label-md text-(--text-default)"> My Workspace </span>
          </span>

          <span class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
            <span
              class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
            />
            <span
              class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
            />
            <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
          </span>
        </div>

        <div class="flex min-h-0 flex-1">
          <div
            class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
          >
            <span
              class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
            />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span
                v-for="width in ['58%', '76%', '48%', '66%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <span class="h-px w-full shrink-0 bg-(--border-muted)" />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span class="h-1.5 w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)" />
              <span
                v-for="width in ['70%', '44%', '80%', '54%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span class="h-1.5 w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)" />
              <span
                v-for="width in ['62%', '78%', '50%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <div
              class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
            >
              <Avatar
                :label="accountInitials(ownerName || email)"
                size="medium"
                variant="square"
              />
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-label-sm text-(--text-default)">{{
                  ownerName || email.split('@')[0]
                }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ email }}</span>
              </span>
            </div>
          </div>

          <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
            <div class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)">
              <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <p class="truncate text-title-md text-(--text-default)">
                  {{ ownerName ? 'Hello, ' + ownerName : 'Hello' }}
                </p>
                <p class="truncate text-body-sm text-(--text-muted)">
                  My Workspace · no projects yet
                </p>
              </div>

              <div class="grid grid-cols-4 gap-(--spacing-md)">
                <span
                  v-for="tile in 4"
                  :key="tile"
                  class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-2) w-2/3 rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-3) w-1/2 rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                </span>
              </div>

              <div
                class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
              >
                <span
                  class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-2) w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                </span>
                <span
                  v-for="row in 7"
                  :key="row"
                  class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
                >
                  <span
                    class="h-(--size-2) flex-1 rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-2) w-[18%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-2) w-[10%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  </div>
</template>
```

## `parts/organization-step.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import RadioGroup from '@aziontech/ui/radio-group-root'

  import { accents } from '../onboarding-form-data'

  defineProps<{ submitted: boolean; previewName: string }>()

  const fullName = defineModel<string>('fullName', { required: true })
  const organizationName = defineModel<string>('organizationName', { required: true })
  const accent = defineModel<string>('accent', { required: true })
</script>

<template>
  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
    <legend class="sr-only">Create your organization</legend>

    <div class="animate-fade-in motion-reduce:animate-none">
      <div class="flex flex-col gap-(--spacing-lg)">
        <Field
          required
          :invalid="submitted && !fullName.trim()"
        >
          <Field.Label>Your full name</Field.Label>
          <Input
            v-model="fullName"
            name="fullName"
            size="large"
            placeholder="Jane Doe"
            autocomplete="name"
          />
          <Field.Description>{{
            submitted && !fullName.trim()
              ? 'This field is required.'
              : 'How the app will greet you.'
          }}</Field.Description>
        </Field>

        <Field
          required
          :invalid="submitted && !organizationName.trim()"
        >
          <Field.Label>Organization name</Field.Label>
          <Input
            v-model="organizationName"
            name="organizationName"
            size="large"
            placeholder="Acme Inc."
          />
          <Field.Description>{{
            submitted && !organizationName.trim()
              ? 'This field is required.'
              : 'Usually your company. Everyone you invite will see it.'
          }}</Field.Description>
        </Field>

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">Organization mark</Field.Legend>
          <div
            class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-3 sm:[&>[role=radiogroup]]:grid-cols-4"
          >
            <RadioGroup
              v-model="accent"
              variant="card"
              orientation="horizontal"
              :options="accents"
              aria-label="Organization mark"
              class="w-full"
            >
              <template #option="{ option }">
                <span class="flex flex-col items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="previewName"
                    :alt="option.label"
                    :colors="option.colors"
                    pattern="marble"
                    size="medium"
                    variant="square"
                  />
                  <span class="text-body-xs text-(--text-muted)">{{ option.label }}</span>
                </span>
              </template>
            </RadioGroup>
          </div>
          <FieldDescription
            >Generated from the organization's name. Select its color.</FieldDescription
          >
        </fieldset>
      </div>
    </div>
  </fieldset>
</template>
```

## `parts/profile-step.vue`

```ts
<script setup lang="ts">
  import Field from '@aziontech/ui/field'
  import FieldError from '@aziontech/ui/field-error'
  import RadioGroup from '@aziontech/ui/radio-group-root'
  import Switch from '@aziontech/ui/switch'

  import { roleOptions, usageOptions } from '../onboarding-form-data'

  defineProps<{ submitted: boolean; creating: boolean }>()

  const usage = defineModel<string | undefined>('usage', { required: true })
  const role = defineModel<string | undefined>('role', { required: true })
  const session = defineModel<boolean>('session', { required: true })
</script>

<template>
  <fieldset
    class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
    :disabled="creating"
  >
    <legend class="sr-only">Tell us about your work</legend>

    <div class="animate-fade-in motion-reduce:animate-none">
      <div class="flex flex-col gap-(--spacing-lg)">
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">How are you planning to use the platform?</Field.Legend>
          <div class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-3">
            <RadioGroup
              v-model="usage"
              variant="card"
              orientation="horizontal"
              :options="usageOptions"
              aria-label="How are you planning to use the platform?"
            />
          </div>
          <FieldError v-if="submitted && !usage">Select one to continue.</FieldError>
        </fieldset>

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">What best describes your role?</Field.Legend>
          <div
            class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-2 sm:[&>[role=radiogroup]]:grid-cols-3"
          >
            <RadioGroup
              v-model="role"
              variant="card"
              orientation="horizontal"
              :options="roleOptions"
              aria-label="What best describes your role?"
            />
          </div>
          <FieldError v-if="submitted && !role">Select one to continue.</FieldError>
        </fieldset>

        <Field.Label>
          <Field orientation="horizontal">
            <Switch v-model="session" />
            <Field.Content>
              <Field.Title>Schedule an onboarding session with an expert</Field.Title>
              <Field.Description
                >A 30-minute call to create your first project. We'll email you to schedule
                it.</Field.Description
              >
            </Field.Content>
          </Field>
        </Field.Label>
      </div>
    </div>
  </fieldset>
</template>
```

## `parts/upgrade-address-card.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import Select from '@aziontech/ui/select'

  import type { OnboardingFormAddress } from '../account-onboarding-form.vue'
  import { cityOptions, countryOptions, stateOptions } from '../sample'

  const address = defineModel<OnboardingFormAddress & { useAccountInformation: boolean }>(
    'address',
    {
      required: true
    }
  )
</script>

<template>
  <Card
    title="Address information"
    :padded="false"
  >
    <template #default>
      <fieldset
        class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
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
              >Uncheck to bill this organization at a different address.</Field.Description
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
</template>
```

## `parts/upgrade-charge-card.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import ToggleGroup from '@aziontech/ui/toggle-group'

  import type {
    OnboardingFormBillingPeriod,
    OnboardingFormCharge
  } from '../account-onboarding-form.vue'
  import { periods } from '../onboarding-form-data'

  defineProps<{ charge: OnboardingFormCharge | null }>()

  const period = defineModel<OnboardingFormBillingPeriod>('period', { required: true })
</script>

<template>
  <Card :padded="false">
    <template #header>
      <p class="text-label-lg text-(--text-default)">Charged</p>
      <ToggleGroup
        v-model="period"
        :options="periods"
        aria-label="Billing period"
      />
    </template>

    <template #default>
      <div
        v-if="charge"
        class="flex flex-col"
      >
        <div class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)">
          <div
            v-for="row in charge.rows"
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
          <span class="text-title-sm text-(--text-default)">Total</span>
          <span class="flex items-baseline gap-(--spacing-xs)">
            <span class="text-heading-xs text-(--text-default)">{{ charge.total.value }}</span>
            <span class="text-body-sm text-(--text-muted)">{{ charge.total.suffix }}</span>
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>
```

## `parts/upgrade-drawer.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Link from '@aziontech/ui/link'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import PlanFeatureList from '@aziontech/ui/plan-feature-list'
  import Separator from '@aziontech/ui/separator'
  import { computed } from 'vue'

  import type {
    OnboardingFormAddress,
    OnboardingFormBillingPeriod,
    OnboardingFormPlan
  } from '../account-onboarding-form.vue'
  import { pricingLinks } from '../onboarding-form-data'
  import UpgradeAddressCard from './upgrade-address-card.vue'
  import UpgradeChargeCard from './upgrade-charge-card.vue'
  import UpgradePaymentCard, { type OnboardingFormCard } from './upgrade-payment-card.vue'

  const props = defineProps<{ open: boolean; upgrade: OnboardingFormPlan | undefined }>()

  const emit = defineEmits<{ 'update:open': [open: boolean]; confirm: [] }>()

  const period = defineModel<OnboardingFormBillingPeriod>('period', { required: true })
  const card = defineModel<OnboardingFormCard>('card', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })
  const address = defineModel<OnboardingFormAddress & { useAccountInformation: boolean }>(
    'address',
    {
      required: true
    }
  )

  const upgradeFeatures = computed(() => props.upgrade?.features ?? [])
  const charge = computed(() => props.upgrade?.charge?.[period.value] ?? null)
</script>

<template>
  <Drawer
    :open="open"
    size="large"
    side="end"
    @update:open="(next) => emit('update:open', next)"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="upgrade ? 'Upgrade to ' + upgrade.name : 'Upgrade'"
        novalidate
        @submit.prevent="emit('confirm')"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upgrade to {{ upgrade?.name }}</DrawerTitle>
        </PanelHeader>

        <PanelBody>
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
          >
            <aside
              v-if="upgrade"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div class="flex flex-col gap-(--spacing-xs)">
                <h3
                  class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:py-(--spacing-sm)"
                >
                  What's included
                </h3>

                <div class="px-(--spacing-xs)">
                  <PlanFeatureList :items="upgradeFeatures" />
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
              <UpgradeChargeCard
                v-model:period="period"
                :charge="charge"
              />

              <UpgradePaymentCard
                v-model:card="card"
                v-model:editing="editing"
              />

              <UpgradeAddressCard v-model:address="address" />
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
                @click="emit('update:open', false)"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Upgrade"
                variant="primary"
                size="medium"
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

## `parts/upgrade-payment-card.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PaymentBrand from '@aziontech/ui/payment-brand'
  import Select from '@aziontech/ui/select'

  import { blankCard } from '../onboarding-form-data'
  import { countryOptions } from '../sample'

  /** The card on file and the card being typed. */
  export interface OnboardingFormCard {
    /** Last four digits of the card on file. */
    last4: string
    /** Name on the new card. */
    holder: string
    /** Country of the new card. */
    country: string | undefined
    /** Number of the new card. */
    number: string
    /** Expiry of the new card. */
    expiry: string
    /** Security code of the new card. */
    code: string
  }

  const card = defineModel<OnboardingFormCard>('card', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })

  const startEditing = () => {
    Object.assign(card.value, blankCard)
    editing.value = true
  }

  const updateCard = () => {
    const digits = card.value.number.replace(/\D/g, '')
    if (digits.length >= 4) card.value.last4 = digits.slice(-4)
    editing.value = false
  }

  const SAVED_CARD_CLASS =
    'flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)'
</script>

<template>
  <Card
    title="Payment method"
    :padded="false"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
        <div
          v-if="!editing"
          :class="SAVED_CARD_CLASS"
        >
          <PaymentBrand brand="visa" />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ending in {{ card.last4 }}
          </p>
          <Button
            label="Change"
            variant="outline"
            size="small"
            @click="startEditing"
          />
        </div>

        <template v-else>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Payment method</legend>

            <Field>
              <Field.Label>Cardholder name</Field.Label>
              <Input
                v-model="card.holder"
                name="cardholderName"
                size="large"
                placeholder="Jane A. Doe"
                autocomplete="cc-name"
              />
            </Field>

            <Field>
              <Field.Label>Country or region</Field.Label>
              <Select
                v-model="card.country"
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
              <Field.Label>Card number</Field.Label>
              <Input
                v-model="card.number"
                name="cardNumber"
                size="large"
                placeholder="1234 5678 9012 3456"
                autocomplete="cc-number"
                inputmode="numeric"
              />
            </Field>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <Field>
                <Field.Label>Expiration date</Field.Label>
                <Input
                  v-model="card.expiry"
                  name="cardExpiry"
                  size="large"
                  placeholder="MM / YY"
                  autocomplete="cc-exp"
                  inputmode="numeric"
                />
                <Field.Description>Month and year, as MM/YY.</Field.Description>
              </Field>
              <Field>
                <Field.Label>Security code</Field.Label>
                <Input
                  v-model="card.code"
                  name="cardSecurityCode"
                  size="large"
                  placeholder="123"
                  autocomplete="cc-csc"
                  inputmode="numeric"
                />
                <Field.Description>3 or 4 digits on the back.</Field.Description>
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
                variant="outline"
                size="medium"
                @click="editing = false"
              />
            </div>
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                label="Update"
                variant="primary"
                size="medium"
                @click="updateCard"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </Card>
</template>
```
