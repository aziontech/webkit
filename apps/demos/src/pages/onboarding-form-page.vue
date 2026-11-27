<script setup lang="ts">
  import { toast } from '@aziontech/ui/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import OnboardingForm, {
    type OnboardingFormDraft,
    type OnboardingFormValues
  } from '../blocks/onboarding-form.vue'

  const STEPS = ['/onboarding', '/onboarding/plan', '/onboarding/profile']
  const STEP_DRAFTS: OnboardingFormDraft[] = [
    {},
    { fullName: 'Jane Doe', organizationName: 'Acme Inc.' },
    { fullName: 'Jane Doe', organizationName: 'Acme Inc.', plan: 'free' }
  ]

  const route = useRoute()
  const router = useRouter()
  const creating = ref(false)

  const step = computed({
    get: () => Math.max(0, STEPS.indexOf(route.path)),
    set: (next: number) => {
      if (STEPS[next] && STEPS[next] !== route.path) router.push(STEPS[next])
    }
  })
  const defaultValues = STEP_DRAFTS[step.value] ?? {}

  const onSubmit = (_event: MouseEvent, values: OnboardingFormValues) => {
    creating.value = true
    setTimeout(() => {
      creating.value = false
      toast.success(`${values.organizationName} was created.`, { closable: true })
      router.push('/resources')
    }, 900)
  }
</script>

<template>
  <OnboardingForm
    v-model:step="step"
    :default-values="defaultValues"
    :loading="creating"
    @submit="onSubmit"
    @cancel="router.push('/onboarding')"
  />
</template>
