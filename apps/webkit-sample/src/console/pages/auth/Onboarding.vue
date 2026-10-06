<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AuthShell from '../../components/auth/AuthShell.vue'
  import OnboardingOrganizationStep from '../../components/onboarding/OnboardingOrganizationStep.vue'
  import OnboardingPlanStep from '../../components/onboarding/OnboardingPlanStep.vue'
  import OnboardingProfileStep from '../../components/onboarding/OnboardingProfileStep.vue'
  import OnboardingWire from '../../components/onboarding/OnboardingWire.vue'
  import { useAnimatedHeight } from '../../lib/behavior/animate-height.js'
  import { useAuthEntrance } from '../../lib/behavior/auth-entrance'
  import { provideOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import { onboardingSteps, profileDataKeys } from '../../lib/data/onboarding.js'
  import { planFor, planNameFor } from '../../lib/data/plans.js'
  import {
    createOrganization,
    DEFAULT_WORKSPACE_NAME,
    orgAccents
  } from '../../lib/state/organizations.js'

  const route = useRoute()
  const router = useRouter()

  const email = computed(() => route.query.email || 'myemail@azion.com')

  const form = reactive({
    fullName: '',
    name: '',
    accent: orgAccents[0].value,
    plan: undefined,
    usage: undefined,
    role: undefined,
    session: false
  })

  const errors = reactive({ fullName: '', name: '', plan: '', usage: '', role: '' })
  const submitting = ref(false)

  const stepIndex = ref(0)
  const step = computed(() => onboardingSteps[stepIndex.value])
  const isLastStep = computed(() => stepIndex.value === onboardingSteps.length - 1)

  const confirmPlan = async (planId) => {
    form.plan = planId
    errors.plan = ''
    const plan = planFor(planId)
    if (plan) {
      toast.success(`${plan.name} plan confirmed.`, {
        description: `Your organization will be created on ${plan.name}.`
      })
    }
    await nextTick()
    if (!isLastStep.value) {
      animateHeight(() => {
        stepIndex.value += 1
      })
    }
    await nextTick()
    document.getElementById('onboarding-title')?.focus()
  }

  provideOnboardingForm({ form, errors, locked: submitting, confirmPlan })

  const REQUIRED_FIELD = 'This field is required.'
  const validators = {
    organization: () => {
      errors.fullName = form.fullName.trim() ? '' : REQUIRED_FIELD
      errors.name = form.name.trim() ? '' : REQUIRED_FIELD
      return !errors.fullName && !errors.name
    },
    plan: () => {
      errors.plan = form.plan ? '' : 'Select a plan to continue.'
      return !errors.plan
    },
    profile: () => {
      errors.usage = form.usage ? '' : 'Select one to continue.'
      errors.role = form.role ? '' : 'Select one to continue.'
      return !errors.usage && !errors.role
    }
  }

  const previewName = computed(() => form.name.trim() || 'Your organization')
  const ownerName = computed(() => form.fullName.trim() || String(email.value).split('@')[0])

  const answeredProfile = () => {
    const entries = [
      [profileDataKeys.usage, form.usage],
      [profileDataKeys.role, form.role],
      [profileDataKeys.session, form.session ? 'yes' : 'no']
    ].filter(([, value]) => Boolean(value))
    return Object.fromEntries(entries)
  }

  const { entered, leadStyle: formEnterStyle, followStyle: wireEnterStyle } = useAuthEntrance()

  const persistOrganization = () => new Promise((resolve) => setTimeout(resolve, 900))

  const { region: stepRegion, height: stepRegionHeight, animateHeight } = useAnimatedHeight()

  const back = () => {
    if (submitting.value || stepIndex.value === 0) return
    animateHeight(() => {
      stepIndex.value -= 1
    })
  }

  const next = async () => {
    if (submitting.value) return
    if (!validators[step.value.id]()) return

    if (!isLastStep.value) {
      animateHeight(() => {
        stepIndex.value += 1
      })
      return
    }

    submitting.value = true
    try {
      await persistOrganization()
      const organization = createOrganization({
        name: form.name.trim(),
        accent: form.accent,
        plan: planNameFor(form.plan),
        additionalData: answeredProfile(),
        owner: { name: ownerName.value, email: email.value }
      })
      toast.success(`${organization.name} created.`, {
        description: `You're the owner, on the ${organization.plan} plan. ${organization.workspaces[0].name} is ready for your first deployment.`
      })
      router.push({ name: 'home', query: { email: email.value } })
    } catch (error) {
      toast.error("Couldn't create your organization.", {
        description: error?.message ?? 'Check your connection and retry.',
        action: { label: 'Retry', onClick: () => next() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <AuthShell>
    <div
      class="mx-auto grid w-full max-w-(--container-7xl) flex-1 grid-cols-1 items-center gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto lg:px-(--spacing-xl)"
    >
      <div
        :data-entered="entered || null"
        :style="formEnterStyle"
        class="mx-auto flex w-full max-w-(--container-xl) -translate-x-6 flex-col opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:my-auto"
      >
        <CardBox
          :padded="false"
          class="w-full"
        >
          <template #content>
            <ProgressBar
              :value="stepIndex + 1"
              :max="onboardingSteps.length"
              size="small"
              shape="flat"
              class="shrink-0"
              :aria-label="`Step ${stepIndex + 1} of ${onboardingSteps.length}`"
            />

            <div
              ref="stepRegion"
              :style="{ height: stepRegionHeight }"
              :data-resizing="stepRegionHeight ? '' : null"
              class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
            >
              <form
                class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                aria-labelledby="onboarding-title"
                novalidate
                @submit.prevent="next"
              >
                <button
                  type="submit"
                  class="sr-only"
                  aria-hidden="true"
                  tabindex="-1"
                />

                <header class="flex flex-col gap-(--spacing-xs)">
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <p class="text-label-sm text-(--text-muted)">
                      Step {{ stepIndex + 1 }} of {{ onboardingSteps.length }}
                    </p>
                    <h1
                      id="onboarding-title"
                      tabindex="-1"
                      class="text-heading-sm text-(--text-default) focus:outline-none"
                    >
                      {{ step.title }}
                    </h1>
                  </div>
                  <p class="text-body-sm text-(--text-muted)">{{ step.description }}</p>
                </header>

                <fieldset
                  class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                  :disabled="submitting"
                >
                  <legend class="sr-only">{{ step.title }}</legend>

                  <div
                    :key="step.id"
                    class="animate-fade-in motion-reduce:animate-none"
                  >
                    <OnboardingOrganizationStep v-if="step.id === 'organization'" />
                    <OnboardingPlanStep v-else-if="step.id === 'plan'" />
                    <OnboardingProfileStep v-else />
                  </div>
                </fieldset>

                <div class="flex items-center gap-(--spacing-sm)">
                  <Button
                    v-if="stepIndex > 0"
                    label="Back"
                    kind="outlined"
                    size="large"
                    :disabled="submitting"
                    @click="back"
                  />
                  <Button
                    :label="isLastStep ? 'Create Organization' : 'Continue'"
                    kind="primary"
                    size="large"
                    class="flex-1"
                    :loading="submitting"
                    @click="next"
                  />
                </div>
              </form>
            </div>
          </template>
        </CardBox>
      </div>

      <div
        :data-entered="entered || null"
        :style="wireEnterStyle"
        class="translate-x-12 opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-mr-(--spacing-xl)"
      >
        <OnboardingWire
          :org-name="previewName"
          :accent="form.accent"
          :workspace-name="DEFAULT_WORKSPACE_NAME"
          :owner-name="ownerName"
          :owner-email="email"
        />
      </div>
    </div>
  </AuthShell>
</template>
