<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import { type PlanFeatureListItem } from '@aziontech/webkit/plan-feature-list'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, onMounted, reactive, ref, watch } from 'vue'

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

  const account = computed(() => props.account ?? sampleAccount)
  const plans = computed(() => props.plans ?? samplePlans)
  const email = computed(() => account.value.email)

  const fullName = ref(props.defaultValues.fullName ?? '')
  const organizationName = ref(props.defaultValues.organizationName ?? '')
  const accent = ref(props.defaultValues.accent ?? 'orange')
  const organizationSubmitted = ref(false)

  const previewName = computed(() => organizationName.value.trim() || 'Your organization')
  const ownerName = computed(() => fullName.value.trim() || email.value.split('@')[0])
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
