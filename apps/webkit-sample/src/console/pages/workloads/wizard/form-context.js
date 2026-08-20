// THE WORKLOAD CREATE FORM, SHARED ROOT → PART.
//
// Same channel and the same reason as the application wizard's
// (../../applications/wizard/form-context.js): the wizard page owns one reactive `form`
// that IS the request body and has to survive Back and forward across every part, and the
// parts WRITE into it. A child writing into an object it received as a prop is what
// `vue/no-mutating-props` forbids, so the object travels by provide/inject — the sanctioned
// channel for state a root and its parts genuinely share.
import { inject, provide } from 'vue'

const CREATE_WORKLOAD_FORM = Symbol('CreateWorkloadForm')

/** Called by the wizard page. `form` is the request body; `errors` the message map. */
export const provideWorkloadForm = (context) => provide(CREATE_WORKLOAD_FORM, context)

/** Called by a part. Throws outside the wizard, so a loose part fails loudly. */
export const useWorkloadForm = () => {
  const context = inject(CREATE_WORKLOAD_FORM, null)
  if (!context) {
    throw new Error('useWorkloadForm must be used inside the workload create wizard.')
  }
  return context
}
