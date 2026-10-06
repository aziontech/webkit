import { inject, provide } from 'vue'

const CREATE_APPLICATION_FORM = Symbol('CreateApplicationForm')

export const provideCreateForm = (context) => provide(CREATE_APPLICATION_FORM, context)

export const useCreateForm = () => {
  const context = inject(CREATE_APPLICATION_FORM, null)
  if (!context) {
    throw new Error('useCreateForm must be used inside the application create wizard.')
  }
  return context
}
