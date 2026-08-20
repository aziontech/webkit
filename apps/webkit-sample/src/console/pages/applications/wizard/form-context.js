// THE CREATE FORM, SHARED ROOT → PART.
//
// The wizard page owns one `form` object — it IS the request body, and it has to survive
// Back and forward across every part (../CreateApplication.vue). The Configure part reads
// and WRITES it.
//
// It travels by provide/inject rather than as a prop, for the reason `vue/no-mutating-props`
// exists: a child that writes into an object it received as a prop is mutating its
// parent's state through a channel Vue considers one-way, and the lint rule flags every
// `v-model` that does it. Injected context is the sanctioned channel for state a root and
// its parts genuinely SHARE — the same choice the design system's composition components
// make (.claude/rules/compound-api.md § "Shared state flows through provide/inject").
//
// It also removes the prop-drilling: a part that needs three more fields does not change
// its own signature, and the wizard page does not grow a prop per field.
import { inject, provide } from 'vue'

const CREATE_APPLICATION_FORM = Symbol('CreateApplicationForm')

/**
 * Called by the wizard page (the root). `form` is the reactive request body; `errors` is
 * the reactive per-field message map the commit's validation fills in.
 */
export const provideCreateForm = (context) => provide(CREATE_APPLICATION_FORM, context)

/**
 * Called by a part. Throws when used outside the wizard, so a part rendered loose fails
 * loudly instead of silently reading `undefined`.
 */
export const useCreateForm = () => {
  const context = inject(CREATE_APPLICATION_FORM, null)
  if (!context) {
    throw new Error('useCreateForm must be used inside the application create wizard.')
  }
  return context
}
