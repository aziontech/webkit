// The onboarding wizard's shared state, passed down by provide/inject.
//
// A wizard's answers outlive the step that collected them: step 2 must not lose
// what step 1 typed, and pressing Back has to redraw the previous step from the
// user's own words. So the state is owned by the flow (Onboarding.vue) and the
// steps read and write the same object.
//
// provide/inject rather than props, for two reasons. Passing the reactive `form`
// down as a prop and writing into it from the step is a prop mutation — the step
// would be editing state it does not own, which `vue/no-mutating-props` blocks and
// which hides where an answer actually changed. And routing each field through its
// own v-model would put ten pass-through bindings in the middle of the flow whose
// only job is to forward, so the wizard would grow a line every time a step grows
// a question.
//
// Not a module-level singleton, unlike the sample's stores (accounts.js,
// sidebar.js, theme.js): those model facts about the account that outlive any one
// screen, while these are one visit's unsaved answers. Scoping them to the
// component tree is what makes leaving the page and coming back start clean,
// instead of the flow reopening on a stranger's half-filled form.
import { inject, provide } from "vue";

const OnboardingFormKey = Symbol("OnboardingForm");

/**
 * Called by the flow. `context` is `{ form, errors, locked, confirmPlan }` — the
 * reactive answers, the reactive per-field messages, a ref that is true while the
 * submit lock is on, and the one function allowed to commit a paid plan.
 *
 * `confirmPlan` is a function rather than a plain write because committing a paid
 * tier is not only "set a value": it also advances the wizard and announces the
 * tier. Leaving that to the step would put the flow's own navigation inside a
 * step, and a second step doing it slightly differently is how a wizard starts
 * skipping screens.
 */
export function provideOnboardingForm(context) {
  provide(OnboardingFormKey, context);
}

/**
 * Called by each step. Throws when the step is rendered outside the flow, so a
 * step mounted loose fails loudly instead of silently rendering an empty form.
 */
export function useOnboardingForm() {
  const context = inject(OnboardingFormKey, null);
  if (!context) {
    throw new Error("useOnboardingForm() must be used inside the onboarding flow.");
  }
  return context;
}
