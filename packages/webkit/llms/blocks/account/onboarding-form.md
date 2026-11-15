# OnboardingForm (`account/onboarding-form`)

> The /signup/onboarding screen, frame included: the signed-out `GlobalHeader` over a two-column grid whose left column is a `Card` holding a `Wizard` (the step line, the step heading, the step's fields and the Cancel / Previous / Next footer, Next gated on the required answers), and whose right column, from `lg` up, is a wireframe of the app the new organization will open into. The three steps live in one component; each story here opens on one of them. Built from `Wizard`, `Field` with `Input`, `RadioGroup` with `variant="card"` in a `fieldset` under a `Field.Legend` with a `HelperText`, a `Field.Label` choice card around a `Switch`, `Tag`, `Avatar` and `Button`; picking a paid plan opens the upgrade `Drawer` with `ToggleGroup`, `Field` with `Input`, `Select` and `Checkbox`, `Link` and `Alert`. A full page routed outside ConsoleLayout.

- Surface: app
- Source: `blocks/account/onboarding-form/onboarding-form.vue` in `@aziontech/webkit`
- MCP: `get_block("account/onboarding-form")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [FeatureList](../../components/feature-list.md), [Field](../../components/field.md), [GlobalHeader](../../components/global-header.md), [HelperText](../../components/helper-text.md), [Input](../../components/input.md), [Link](../../components/link.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PaymentBrand](../../components/payment-brand.md), [RadioGroup](../../components/radio-group.md), [Select](../../components/select.md), [Separator](../../components/separator.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [ToggleGroup](../../components/toggle-group.md), [Wizard](../../components/wizard.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-microcopy`

## Asked as

onboarding; onboarding form; signup onboarding; create organization; organization setup; choose plan step; multi-step onboarding; onboarding wizard; welcome flow; first access setup; cadastro da organização; criar organização; onboarding da conta; onboarding stepper

The `/signup/onboarding` screen, frame included. A new user has an account but no organization yet, and needs to create one with as few questions as possible: one step at a time in a card (organization, plan, profile), with a live wireframe beside it from `lg` showing the app the organization will open into, named and colored by what they type. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- The first run after sign-up, before the user has an organization.
- Any short, linear setup of two to four steps that must finish before the product is usable.

## When not to use

- Signing in or creating the account itself: use `auth/sign-in`.
- Creating a resource inside the console: use `create/create-wizard`.
- Changing an existing plan: use `account/change-plan-drawer`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

The signed-out bar (`top-bar/auth-bar`): brand at the start, Documentation at the end.

### B. Brand — `Brand` (required)

In the bar, linked home with `aria-label="Azion home"`.

### C. Actions — `Button` (required)

Documentation in the bar. The step's actions are the `Wizard` footer: Cancel, Previous from step 2 on, and Next, which becomes `Create Organization` on the last step. Cancel clears every answer and returns to the first step; an app that has somewhere to send the person back to (the sign-in page) routes there in the `cancel` handler instead.

### D. Step card — `Card` (required)

Flush card capped at `--container-xl`, holding the `Wizard`.

### E. Steps — `Wizard` (required)

One `Wizard` (`aria-label="Set up your organization"`, `submit-label="Create Organization"`, `loading` bound to the create request) with three `Wizard.Step`s: Create your organization, Select your plan, Tell us about your work. It owns the step state, the `Step 1 of 3` line, the step heading and the footer; the card is narrower than the Wizard's rail breakpoint, so the rail stays hidden and only the step line shows. Next is gated in the `next` handler: it calls `preventDefault()` while a required answer is missing and the step shows why.

### F. Fields — `Field` (required)

Full name and organization name, each with `Field.Label` and `Field.Description`. On submit, an empty value sets `required` (amber) and the description becomes `This field is required.`

### G. Text inputs — `Input` (required)

Large; full name with `autocomplete="name"`.

### H. Group label — `Field.Legend` (required)

`Organization mark`, the `type="label"` legend of the `fieldset` that holds the radio cards.

### I. Mark picker — `RadioGroup` with `variant="card"` (required)

Seven colors, `aria-label="Organization mark"`, each card showing the generated mark.

### J. Mark — `Avatar` (required)

Square avatars: `pattern="marble"` seeded by the organization name with the card's `colors` in each radio card, the same marble in the selected colors for the organization in the wireframe, and initials for the workspace. Never hand-build the SVG or pass it as `src`.

### K. Picker hint — `HelperText` (required)

Under the picker: `Generated from the organization's name. Select its color.`

### L. Plan step — `Tag`, `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter`, `FeatureList`, `ToggleGroup`, `Select`, `Checkbox`, `PaymentBrand`, `Separator`, `Link` (required)

The plans are full-width `RadioGroup` cards, each with its name `Tag` and price. Free selects directly; Pro or Enterprise opens the upgrade `Drawer`, the Checkout of `account/change-plan-drawer` (What's included as a `FeatureList`, the billing period `ToggleGroup`, the payment method with its `PaymentBrand`, the billing address `Select`s and the `Checkbox` that reuses the account's address, the pricing `Link`s), and selects only once Upgrade is pressed.

### M. Work step — `Switch`, `Alert` (required)

The usage and role questions as `RadioGroup` cards, a `Field.Label` choice card around a `Switch` for the onboarding session, and one `Alert` in the card for the create outcome.

## Do

- Validate on Next, not on every keystroke; required fields show the amber prompt, not the red error.
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
- The fields sit in a `fieldset` with a hidden legend.
- The Wizard's `Step 1 of 3` line is a polite live region, so the step change is announced.

## States

- Organization: step 1 of 3, name fields and the organization mark.
- Plan: step 2 of 3, the plans as rows; Free selects directly, Pro or Enterprise opens the upgrade drawer and selects only once Upgrade is pressed. The drawer is the Checkout of `account/change-plan-drawer` (What's included as a `FeatureList`, the charge, the payment method and the billing address); keep its fields and copy identical to that block rather than diverging.
- Profile: step 3 of 3, the usage and role questions, the onboarding-session switch and Create Organization, which locks the step while the request runs and answers in one `Alert` in the card: `Organization created.`, or, when the request fails (offline), `The organization wasn't created. Check your connection, then retry. Your answers are kept.` with Retry.

## Related

- `top-bar/auth-bar` — the bar this screen renders.
- `auth/sign-in` — the screen before it.
- `account/change-plan-drawer` — the upgrade drawer the Plan step opens.
- `state/first-use` — what the new organization lands on.

## Steps

- organization
- plan
- profile

## Variants

- `Organization` — primary (the code below)
- `Plan` — Step 2 of 3: the three plans as full-width rows; Free selects directly, while Pro or Enterprise opens the upgrade drawer (the `account/change-plan-drawer#Checkout` form, What's included as a `FeatureList`) and only selects once Upgrade is pressed.
- `Profile` — Step 3 of 3: the usage and role questions, the onboarding-session switch and the Create Organization action, which asks for both answers first.

Each variant is the same screen in another state: `get_block("account/onboarding-form", { variant })`, or the file under `blocks/account/onboarding-form/variants/`.

## Code (`Organization`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FeatureList, { type FeatureListItem } from '@aziontech/webkit/feature-list'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Separator from '@aziontech/webkit/separator'
  import Switch from '@aziontech/webkit/switch'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, reactive, ref, watch } from 'vue'

  interface Accent {
    value: string
    label: string
    ariaLabel: string
    colors: string[]
  }

  const accents: Accent[] = [
    {
      value: 'orange',
      label: 'Orange',
      ariaLabel: 'Orange mark',
      colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
    },
    {
      value: 'yellow',
      label: 'Yellow',
      ariaLabel: 'Yellow mark',
      colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
    },
    {
      value: 'red',
      label: 'Red',
      ariaLabel: 'Red mark',
      colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
    },
    {
      value: 'green',
      label: 'Green',
      ariaLabel: 'Green mark',
      colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
    },
    {
      value: 'blue',
      label: 'Blue',
      ariaLabel: 'Blue mark',
      colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
    },
    {
      value: 'violet',
      label: 'Violet',
      ariaLabel: 'Violet mark',
      colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
    },
    {
      value: 'gray',
      label: 'Gray',
      ariaLabel: 'Gray mark',
      colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
    }
  ]
  const email = 'myemail@example.com'

  const fullName = ref('')
  const organizationName = ref('')
  const accent = ref('orange')
  const organizationSubmitted = ref(false)

  const accountInitials = (name: string) => {
    const words = String(name ?? '')
      .trim()
      .split(/\s+/)
      .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
    return (words[0] ?? '').slice(0, 2).toUpperCase()
  }

  const previewName = computed(() => organizationName.value.trim() || 'Your organization')
  const ownerName = computed(() => fullName.value.trim() || email.split('@')[0])
  const accentColors = computed(
    () => (accents.find((item) => item.value === accent.value) ?? accents[0]).colors
  )

  type BillingPeriod = 'monthly' | 'yearly'

  interface PlanItem {
    value: string
    label: string
    description: string
    ariaLabel: string
    name: string
    severity?: TagSeverity
    variant?: TagVariant
    price: string
  }

  interface PlanCharge {
    rows: { label: string; value: string; suffix?: string }[]
    total: { value: string; suffix: string }
  }

  interface PlanUpgrade {
    name: string
    features: { title: string; detail?: string }[]
    charge: Record<BillingPeriod, PlanCharge>
  }

  interface BillingAddress {
    country: string | undefined
    postalCode: string
    state: string | undefined
    city: string | undefined
    line1: string
    line2: string
  }

  const plans: PlanItem[] = [
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
      price: 'From $20/mo'
    },
    {
      value: 'enterprise',
      label: "I'm running production at scale",
      description: 'Optimize costs with usage or spend commitments',
      ariaLabel: "I'm running production at scale. Enterprise plan, From $2,000/mo.",
      name: 'Enterprise',
      variant: 'primary',
      price: 'From $2,000/mo'
    }
  ]
  const upgrades: Partial<Record<string, PlanUpgrade>> = {
    pro: {
      name: 'Pro',
      features: [
        { title: '100 resources', detail: 'then $0.10 per resource per month' },
        { title: '10M requests', detail: 'then as low as $0.90 per 1M' },
        { title: '50 hours of compute time', detail: 'then $0.18 per hour' },
        { title: '10 GB of event log storage', detail: 'then $0.10 per GB-month' },
        {
          title: '100 GB of file storage',
          detail: 'then as low as $0.021 per GB-month'
        },
        { title: '1 GB of database storage', detail: 'then $0.75 per GB-month' },
        {
          title: '100M security rule evaluations',
          detail: 'then as low as $0.30 per 1M'
        },
        { title: 'DDoS protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next charge', value: '$200' },
            { label: 'Subtotal', value: '$3,000', suffix: 'per month' }
          ],
          total: { value: '$3,000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next charge', value: '$200' },
            { label: 'Subtotal', value: '$3,000', suffix: 'per month' },
            { label: 'Yearly discount', value: '$2,200', suffix: 'per month' }
          ],
          total: { value: '$2,200', suffix: 'per year' }
        }
      }
    },
    enterprise: {
      name: 'Enterprise',
      features: [
        { title: 'Unlimited resources' },
        { title: '1B requests', detail: 'then as low as $0.60 per 1M' },
        { title: '500 hours of compute time', detail: 'then $0.12 per hour' },
        { title: '1 TB of event log storage', detail: 'then $0.08 per GB-month' },
        {
          title: '10 TB of file storage',
          detail: 'then as low as $0.015 per GB-month'
        },
        { title: '100 GB of database storage', detail: 'then $0.50 per GB-month' },
        {
          title: '1B security rule evaluations',
          detail: 'then as low as $0.20 per 1M'
        },
        { title: 'DDoS protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' },
        { title: '99.99% uptime SLA' },
        { title: 'Named account team' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next charge', value: '$2,000' },
            { label: 'Subtotal', value: '$24,000', suffix: 'per month' }
          ],
          total: { value: '$24,000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next charge', value: '$2,000' },
            { label: 'Subtotal', value: '$24,000', suffix: 'per month' },
            { label: 'Yearly discount', value: '$4,800', suffix: 'per month' }
          ],
          total: { value: '$19,200', suffix: 'per year' }
        }
      }
    }
  }
  const pricingLinks = [
    {
      label: 'Learn more about pricing',
      href: 'https://example.com/pricing'
    },
    {
      label: 'Compare plans',
      href: 'https://example.com/pricing#comparison'
    }
  ]
  const periods: { value: BillingPeriod; label: string }[] = [
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
  const accountAddress: BillingAddress = {
    country: 'United States',
    postalCode: '94105',
    state: 'California',
    city: 'San Francisco',
    line1: '100 Market Street',
    line2: 'Suite 400'
  }
  const blankAddress: BillingAddress = {
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line1: '',
    line2: ''
  }
  const blankCard = {
    holder: '',
    country: undefined as string | undefined,
    number: '',
    expiry: '',
    code: ''
  }

  const plan = ref<string>()
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const planSubmitted = ref(false)
  const period = ref<BillingPeriod>('yearly')
  const editing = ref(false)
  const card = reactive({ last4: '8888', ...blankCard })
  const address = reactive({ useAccountInformation: true, ...accountAddress })

  const upgrade = computed(() => upgrades[pendingPlanId.value])
  const upgradeFeatures = computed<FeatureListItem[]>(() =>
    (upgrade.value?.features ?? []).map((feature) => ({
      label: feature.title,
      description: feature.detail
    }))
  )
  const charge = computed(() => upgrade.value?.charge[period.value] ?? null)

  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress)
  )

  const selectPlan = (value: string | undefined) => {
    if (!value) return
    planSubmitted.value = false
    if (value === 'free') {
      plan.value = value
      return
    }
    pendingPlanId.value = value
    period.value = 'yearly'
    editing.value = false
    Object.assign(address, { useAccountInformation: true, ...accountAddress })
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

  const startEditing = () => {
    Object.assign(card, blankCard)
    editing.value = true
  }

  const updateCard = () => {
    const digits = card.number.replace(/\D/g, '')
    if (digits.length >= 4) card.last4 = digits.slice(-4)
    editing.value = false
  }

  const usageOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'study', label: 'Study' }
  ]
  const roleOptions = [
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

  const usage = ref<string>()
  const role = ref<string>()
  const session = ref(false)
  const profileSubmitted = ref(false)
  const creating = ref(false)
  const outcome = ref('')

  const createOrganization = () => {
    if (creating.value) return
    profileSubmitted.value = true
    outcome.value = ''
    if (!usage.value || !role.value) return
    creating.value = true
    setTimeout(() => {
      creating.value = false
      outcome.value = navigator.onLine ? 'created' : 'failed'
    }, 900)
  }

  const step = ref(0)

  const onNext = (event: MouseEvent, position: number) => {
    if (position === 0) {
      organizationSubmitted.value = true
      if (!fullName.value.trim() || !organizationName.value.trim()) event.preventDefault()
    }
    if (position === 1) {
      planSubmitted.value = true
      if (!plan.value) event.preventDefault()
    }
  }

  const startOver = () => {
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
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="ai ai-book"
          href="https://example.com/docs"
        />
      </GlobalHeader.End>
    </GlobalHeader>

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
              <div class="p-(--spacing-md)">
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
                    <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                      <legend class="sr-only">Create your organization</legend>

                      <div class="animate-fade-in motion-reduce:animate-none">
                        <div class="flex flex-col gap-(--spacing-lg)">
                          <Field :required="organizationSubmitted && !fullName.trim()">
                            <Field.Label>Your full name</Field.Label>
                            <Input
                              v-model="fullName"
                              name="fullName"
                              size="large"
                              placeholder="Jane Doe"
                              autocomplete="name"
                            />
                            <Field.Description>{{
                              organizationSubmitted && !fullName.trim()
                                ? 'This field is required.'
                                : 'How the app will greet you.'
                            }}</Field.Description>
                          </Field>

                          <Field :required="organizationSubmitted && !organizationName.trim()">
                            <Field.Label>Organization name</Field.Label>
                            <Input
                              v-model="organizationName"
                              name="organizationName"
                              size="large"
                              placeholder="Acme Inc."
                            />
                            <Field.Description>{{
                              organizationSubmitted && !organizationName.trim()
                                ? 'This field is required.'
                                : 'Usually your company. Everyone you invite will see it.'
                            }}</Field.Description>
                          </Field>

                          <fieldset
                            class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                          >
                            <Field.Legend type="label">Organization mark</Field.Legend>
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
                                  <span class="text-body-xs text-(--text-muted)">{{
                                    option.label
                                  }}</span>
                                </span>
                              </template>
                            </RadioGroup>
                            <HelperText
                              label="Generated from the organization's name. Select its color."
                            />
                          </fieldset>
                        </div>
                      </div>
                    </fieldset>
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
                            <template #option="{ option }">
                              <div
                                class="flex w-full items-center justify-between gap-(--spacing-sm)"
                              >
                                <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                                  <span class="text-body-sm text-(--text-default)">{{
                                    option.label
                                  }}</span>
                                  <span class="text-body-xs text-(--text-muted)">{{
                                    option.description
                                  }}</span>
                                </div>
                                <div class="flex shrink-0 flex-col items-end gap-(--spacing-2xs)">
                                  <Tag
                                    :label="option.name"
                                    :variant="option.variant"
                                    :severity="option.severity"
                                    size="small"
                                    rounded
                                  />
                                  <span class="text-label-sm text-(--text-muted)">
                                    {{ option.price }}
                                  </span>
                                </div>
                              </div>
                            </template>
                          </RadioGroup>

                          <HelperText
                            v-if="planSubmitted && !plan"
                            type="required"
                            label="Select a plan to continue."
                          />

                          <Drawer
                            :open="upgradeOpen"
                            size="large"
                            side="end"
                            @update:open="onOpenChange"
                          >
                            <DrawerContent>
                              <form
                                class="flex min-h-0 flex-1 flex-col"
                                :aria-label="upgrade ? 'Upgrade to ' + upgrade.name : 'Upgrade'"
                                novalidate
                                @submit.prevent="confirmUpgrade"
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
                                            <div
                                              class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)"
                                            >
                                              <div
                                                v-for="row in charge.rows"
                                                :key="row.label"
                                                class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                                              >
                                                <span class="text-body-sm text-(--text-muted)">{{
                                                  row.label
                                                }}</span>
                                                <span
                                                  class="flex items-baseline gap-(--spacing-xs)"
                                                >
                                                  <span
                                                    class="text-label-md text-(--text-default)"
                                                    >{{ row.value }}</span
                                                  >
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
                                              <span class="text-heading-xs text-(--text-default)"
                                                >Total</span
                                              >
                                              <span class="flex items-baseline gap-(--spacing-xs)">
                                                <span
                                                  class="text-heading-xs text-(--text-default)"
                                                  >{{ charge.total.value }}</span
                                                >
                                                <span class="text-body-sm text-(--text-muted)">{{
                                                  charge.total.suffix
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
                                        <template #default>
                                          <div
                                            class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)"
                                          >
                                            <div
                                              v-if="!editing"
                                              class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                                            >
                                              <PaymentBrand brand="visa" />
                                              <p
                                                class="min-w-0 flex-1 text-label-md text-(--text-default)"
                                              >
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
                                              <fieldset
                                                class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                                              >
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

                                                <div
                                                  class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                                >
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
                                                    <Field.Description
                                                      >Month and year, as MM/YY.</Field.Description
                                                    >
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
                                                    <Field.Description
                                                      >3 or 4 digits on the back.</Field.Description
                                                    >
                                                  </Field>
                                                </div>

                                                <Alert
                                                  severity="info"
                                                  size="small"
                                                  label="Sensitive data is handled by a PCI-compliant payment partner."
                                                />
                                              </fieldset>

                                              <div
                                                class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end"
                                              >
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
                                                <Field.Label
                                                  >Use the same information as my
                                                  account</Field.Label
                                                >
                                                <Field.Description
                                                  >Uncheck to bill this organization at a different
                                                  address.</Field.Description
                                                >
                                              </Field.Content>
                                            </Field>

                                            <div
                                              class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                            >
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
                                              <Field.Description
                                                >Optional. Apartment, suite or
                                                floor.</Field.Description
                                              >
                                            </Field>
                                          </fieldset>
                                        </template>
                                      </Card>
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
                                        @click="onOpenChange(false)"
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
                      label="The organization wasn't created. Check your connection, then retry. Your answers are kept."
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

                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                      :disabled="creating"
                    >
                      <legend class="sr-only">Tell us about your work</legend>

                      <div class="animate-fade-in motion-reduce:animate-none">
                        <div class="flex flex-col gap-(--spacing-lg)">
                          <fieldset
                            class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                          >
                            <Field.Legend type="label"
                              >How are you planning to use the platform?</Field.Legend
                            >
                            <RadioGroup
                              v-model="usage"
                              variant="card"
                              orientation="horizontal"
                              :options="usageOptions"
                              aria-label="How are you planning to use the platform?"
                            />
                            <HelperText
                              v-if="profileSubmitted && !usage"
                              type="required"
                              label="Select one to continue."
                            />
                          </fieldset>

                          <fieldset
                            class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                          >
                            <Field.Legend type="label">What best describes your role?</Field.Legend>
                            <RadioGroup
                              v-model="role"
                              variant="card"
                              orientation="horizontal"
                              :options="roleOptions"
                              aria-label="What best describes your role?"
                            />
                            <HelperText
                              v-if="profileSubmitted && !role"
                              type="required"
                              label="Select one to continue."
                            />
                          </fieldset>

                          <Field.Label>
                            <Field orientation="horizontal">
                              <Switch v-model="session" />
                              <Field.Content>
                                <Field.Title
                                  >Schedule an onboarding session with an expert</Field.Title
                                >
                                <Field.Description
                                  >A 30-minute call to create your first project. We'll email you to
                                  schedule it.</Field.Description
                                >
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </div>
                      </div>
                    </fieldset>
                  </Wizard.Step>
                </Wizard>
              </div>
            </template>
          </Card>
        </div>

        <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-me-(--spacing-xl)">
          <div
            class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
          >
            <figure
              class="pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
              aria-hidden="true"
            >
              <div
                class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
              >
                <span
                  class="size-(--size-5) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />

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
                  <span class="min-w-0 truncate text-label-md text-(--text-default)">
                    My Workspace
                  </span>
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
                      :label="accountInitials(ownerName)"
                      size="medium"
                      variant="square"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-label-sm text-(--text-default)">{{
                        ownerName
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >myemail@example.com</span
                      >
                    </span>
                  </div>
                </div>

                <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
                  <div
                    class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <p class="truncate text-heading-sm text-(--text-default)">
                        Hello, {{ ownerName }}
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
      </div>
    </main>
  </div>
</template>
```
