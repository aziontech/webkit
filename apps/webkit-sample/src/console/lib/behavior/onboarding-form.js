import { inject, provide } from 'vue'

const OnboardingFormKey = Symbol('OnboardingForm')

export function provideOnboardingForm(context) {
  provide(OnboardingFormKey, context)
}

export function useOnboardingForm() {
  const context = inject(OnboardingFormKey, null)
  if (!context) {
    throw new Error('useOnboardingForm() must be used inside the onboarding flow.')
  }
  return context
}
