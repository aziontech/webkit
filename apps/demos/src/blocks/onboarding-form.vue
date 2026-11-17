<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import PlanFeatureList, { type PlanFeatureListItem } from '@aziontech/webkit/plan-feature-list'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Separator from '@aziontech/webkit/separator'
  import Switch from '@aziontech/webkit/switch'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, onMounted, reactive, ref, watch } from 'vue'

  import { sampleAccount, samplePlans } from './onboarding-form.sample'

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
  }

  const props = withDefaults(defineProps<OnboardingFormProps>(), {
    account: undefined,
    plans: undefined,
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: MouseEvent, values: OnboardingFormValues]
    cancel: [event: MouseEvent]
  }>()

  const step = defineModel<number>('step', { default: 0 })

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

  const account = computed(() => props.account ?? sampleAccount)
  const plans = computed(() => props.plans ?? samplePlans)
  const email = computed(() => account.value.email)

  const fullName = ref(props.defaultValues.fullName ?? '')
  const organizationName = ref(props.defaultValues.organizationName ?? '')
  const accent = ref(props.defaultValues.accent ?? 'orange')
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
  const ownerName = computed(() => fullName.value.trim() || email.value.split('@')[0])
  const accentColors = computed(
    () => (accents.find((item) => item.value === accent.value) ?? accents[0]).colors
  )

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
  const periods: { value: OnboardingFormBillingPeriod; label: string }[] = [
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
  const blankAddress: OnboardingFormAddress = {
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
  const upgradeFeatures = computed<PlanFeatureListItem[]>(() => upgrade.value?.features ?? [])
  const charge = computed(() => upgrade.value?.charge?.[period.value] ?? null)

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

  onMounted(() => {
    if (props.error) outcome.value = 'failed'
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
      <AppHeader.Brand>
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
                            <FieldDescription
                              >Generated from the organization's name. Select its
                              color.</FieldDescription
                            >
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

                          <FieldError v-if="planSubmitted && !plan"
                            >Select a plan to continue.</FieldError
                          >

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
                            <FieldError v-if="profileSubmitted && !usage"
                              >Select one to continue.</FieldError
                            >
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
                            <FieldError v-if="profileSubmitted && !role"
                              >Select one to continue.</FieldError
                            >
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
                      <span class="truncate text-body-xs text-(--text-muted)">{{ email }}</span>
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
