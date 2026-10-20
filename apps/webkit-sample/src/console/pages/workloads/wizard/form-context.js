import { inject, provide } from 'vue'

const CREATE_WORKLOAD_FORM = Symbol('CreateWorkloadForm')

export const provideWorkloadForm = (context) => provide(CREATE_WORKLOAD_FORM, context)

export const useWorkloadForm = () => {
  const context = inject(CREATE_WORKLOAD_FORM, null)
  if (!context) {
    throw new Error('useWorkloadForm must be used inside the workload create wizard.')
  }
  return context
}
