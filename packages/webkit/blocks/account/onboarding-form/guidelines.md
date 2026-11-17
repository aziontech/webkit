# Onboarding form

The `/signup/onboarding` screen, frame included. A new user has an account but no organization yet, and needs to create one with as few questions as possible: one step at a time in a card (organization, plan, profile), with a live wireframe beside it from `lg` showing the app the organization will open into, named and colored by what they type. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- The first run after sign-up, before the user has an organization.
- Any short, linear setup of two to four steps that must finish before the product is usable.

## When not to use

- Signing in or creating the account itself: use `auth/sign-in`.
- Creating a resource inside the console: use `create/create-wizard`.
- Changing an existing plan: use `account/change-plan-drawer`.

## Building blocks

### A. Bar — `AppHeader` (required)

The signed-out bar (`top-bar/auth-bar`): brand at the start, Documentation at the end.

### B. Brand — `Brand` (required)

In the bar, inside `AppHeader.Brand` linked home through its `href` with `aria-label="Azion home"`.

### C. Actions — `Button` (required)

Documentation in the bar. The step's actions are the `Wizard` footer: Cancel, Previous from step 2 on, and Next, which becomes `Create Organization` on the last step. Cancel clears every answer and returns to the first step; an app that has somewhere to send the person back to (the sign-in page) routes there in the `cancel` handler instead.

### D. Step card — `Card` (required)

Flush card capped at `--container-xl`, holding the `Wizard`.

### E. Steps — `Wizard` (required)

One `Wizard` (`aria-label="Set up your organization"`, `submit-label="Create Organization"`, `loading` bound to the create request) with three `Wizard.Step`s: Create your organization, Select your plan, Tell us about your work. It owns the step state, the `Step 1 of 3` line, the step heading and the footer; the card is narrower than the Wizard's rail breakpoint, so the rail stays hidden and only the step line shows. Next is gated in the `next` handler: it calls `preventDefault()` while a required answer is missing and the step shows why.

### F. Fields — `Field` (required)

Full name and organization name, each with `Field.Label` and `Field.Description`. On submit, an empty value sets `required` (amber) and the description becomes `This field is required.`

### G. Text inputs — `Input` (required)

Large; full name with `autocomplete="name"`.

### H. Group label — `Field.Legend` (required)

`Organization mark`, the `type="label"` legend of the `fieldset` that holds the radio cards.

### I. Mark picker — `RadioGroup` with `variant="card"` (required)

Seven colors, `aria-label="Organization mark"`, each card showing the generated mark.

### J. Mark — `Avatar` (required)

Square avatars: `pattern="marble"` seeded by the organization name with the card's `colors` in each radio card, the same marble in the selected colors for the organization in the wireframe, and initials for the workspace. Never hand-build the SVG or pass it as `src`.

### K. Picker hint — `FieldDescription`, `FieldError` (required)

Under the picker: `Generated from the organization's name. Select its color.`

### L. Plan step — `Tag`, `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter`, `PlanFeatureList`, `ToggleGroup`, `Select`, `Checkbox`, `PaymentBrand`, `Separator`, `Link` (required)

The plans are full-width `RadioGroup` cards, each with its name `Tag` and price. Free selects directly; Pro or Enterprise opens the upgrade `Drawer`, the Checkout of `account/change-plan-drawer` (What's included as a `PlanFeatureList`, the billing period `ToggleGroup`, the payment method with its `PaymentBrand`, the billing address `Select`s and the `Checkbox` that reuses the account's address, the pricing `Link`s), and selects only once Upgrade is pressed.

### M. Work step — `Switch`, `Alert` (required)

The usage and role questions as `RadioGroup` cards, a `Field.Label` choice card around a `Switch` for the onboarding session, and one `Alert` in the card for the create outcome.

## Data

The block takes the signed-in account, the plans and the create request's state through props and emits the answers; it fetches nothing and fakes no request. `OnboardingFormValues`, `OnboardingFormPlan`, `OnboardingFormAccount` and `OnboardingFormProps` are exported from `onboarding-form.vue`, and `sample.ts` holds the sample account and plans the block renders when `account` or `plans` is left out. The form keeps its own draft across the three steps.

| Prop            | Type                    | What it does                                                                                                                                          |
| --------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`       | `OnboardingFormAccount` | The signed-in account: its email in the wireframe, the address the upgrade drawer reuses and the card on file.                                        |
| `plans`         | `OnboardingFormPlan[]`  | The plan rows. A plan with `charge` opens the upgrade drawer (its `features` and charge per period); one without selects directly.                    |
| `defaultValues` | `OnboardingFormDraft`   | Answers the form opens with (a draft restored from storage).                                                                                          |
| `step`          | `number`                | The open step, `0` to `2` (`v-model:step` to own it, for a route per step).                                                                           |
| `loading`       | `boolean`               | The create request is in flight: the last step locks and Create Organization spins. When it turns off with no `error`, `Organization created.` shows. |
| `error`         | `string`                | Why the organization was not created, shown in the danger `Alert` with Retry; the answers are kept.                                                   |

| Event         | Payload           | When                                                                                           |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `submit`      | `(event, values)` | Create Organization (or Retry in the alert) with both answers given; `values` is every answer. |
| `cancel`      | `(event)`         | Cancel; the answers are already cleared and the form is back on the first step.                |
| `update:step` | `(step)`          | The open step changed.                                                                         |

To go live, render the block from a route that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import OnboardingForm, { type OnboardingFormValues } from './onboarding-form.vue'

  const { data: account } = useAccount()
  const { data: plans } = usePlans()
  const creating = ref(false)
  const createError = ref('')

  const create = async (_event: MouseEvent, values: OnboardingFormValues) => {
    creating.value = true
    createError.value = ''
    try {
      await createOrganization(values)
    } catch {
      createError.value =
        "The organization wasn't created. Check your connection, then retry. Your answers are kept."
    } finally {
      creating.value = false
    }
  }
</script>

<template>
  <OnboardingForm
    v-if="account && plans"
    :account="account"
    :plans="plans"
    :loading="creating"
    :error="createError"
    @submit="create"
    @cancel="router.push('/login')"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Validate on Next, not on every keystroke; required fields show the amber prompt, not the red error.
- Explain the step under its heading before the fields (what an organization is, that it is created once).
- Keep every value when the user goes to the previous step; the three steps share one component state.
- Hide the wireframe below `lg`; it is decoration (`aria-hidden`).

## Don't

- Don't toast on this screen; a server failure creating the organization lands in one `Alert` in the card, as on the auth screens.
- Don't ask for anything the console can ask later.
- Don't build the step counter, heading or footer by hand; the `Wizard` owns them.

## Copy

- **Step line:** `Step 1 of 3`. **Heading:** the task: `Create your organization`.
- **Field descriptions:** why it is asked: `How the app will greet you.`, `Usually your company. Everyone you invite will see it.`
- **Required:** `This field is required.`
- **Final action:** names what is created: `Create Organization`.

## Accessibility

- The page `h1` is visually hidden (`Set up your organization`); each step heading is the Wizard's `h2`, and the Wizard moves focus to it on every step change.
- The fields sit in a `fieldset` with a hidden legend.
- The Wizard's `Step 1 of 3` line is a polite live region, so the step change is announced.

## States

- Organization: step 1 of 3 (`step` is `0`, the default), name fields and the organization mark.
- Plan: step 2 of 3 (`step` is `1`), the plans as rows; Free selects directly, Pro or Enterprise opens the upgrade drawer and selects only once Upgrade is pressed. The drawer is the Checkout of `account/change-plan-drawer` (What's included as a `PlanFeatureList`, the charge, the payment method and the billing address); keep its fields and copy identical to that block rather than diverging.
- Profile: step 3 of 3 (`step` is `2`), the usage and role questions, the onboarding-session switch and Create Organization, which emits `submit` and locks the step while `loading` is set, then answers in one `Alert` in the card: `Organization created.` when `loading` turns off with no `error`, or the `error` message (`The organization wasn't created. Check your connection, then retry. Your answers are kept.`) with Retry.

## Related

- `top-bar/auth-bar` — the bar this screen renders.
- `auth/sign-in` — the screen before it.
- `account/change-plan-drawer` — the upgrade drawer the Plan step opens.
- `state/first-use` — what the new organization lands on.
