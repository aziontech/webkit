# Onboarding form

The `/signup/onboarding` screen, frame included. A new user has an account but no organization yet, and needs to create one with as few questions as possible: one step at a time in a card (organization, plan, profile), with a live wireframe beside it from `lg` showing the app the organization will open into, named and colored by what they type.

## When to use

- The first run after sign-up, before the user has an organization.
- Any short, linear setup of two to four steps that must finish before the product is usable.

## When not to use

- Signing in or creating the account itself: use `platform/auth`.
- Creating a resource inside the console: use `platform/create/multipage-create` or `platform/create/provision-wizard`.
- Changing an existing plan: use `platform/account/change-plan-drawer`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

The signed-out bar (`headers/auth-header`): brand at the start, Documentation at the end.

### B. Brand — `Brand` (required)

In the bar, linked home with `aria-label="Azion home"`.

### C. Actions — `Button` (required)

Documentation in the bar; the step's `Continue` (primary, large, `type="submit"`). Later steps add `Back`, and the last step ends on `Create Organization`.

### D. Step card — `Card` (required)

Flush card capped at `--container-xl`, holding the progress bar and the form.

### E. Progress — `Progress` (required)

Flat, small, `value` of `max` steps, with `aria-label="Step 1 of 3"`. The visible `Step 1 of 3` line repeats it in text.

### F. Fields — `Field` (required)

Full name and organization name, each with `Field.Label` and `Field.Description`. On submit, an empty value sets `required` (amber) and the description becomes `This field is required.`

### G. Text inputs — `Input` (required)

Large; full name with `autocomplete="name"`.

### H. Group label — `Label` (required)

`Organization mark`, above the radio cards.

### I. Mark picker — `RadioCards` (required)

Seven colors, `aria-label="Organization mark"`, each card showing the generated mark.

### J. Mark — `Avatar` (required)

Square avatars: the generated marble in each radio card, and in the wireframe the organization and workspace.

### K. Picker hint — `HelperText` (required)

Under the picker: `Generated from the organization's name. Select its color.`

## Do

- Validate on submit, not on every keystroke; required fields show the amber prompt, not the red error.
- Explain the step under its heading before the fields (what an organization is, that it is created once).
- Keep every value when the user goes Back.
- Hide the wireframe below `lg`; it is decoration (`aria-hidden`).

## Don't

- Don't toast on this screen; a server failure creating the organization lands in one `Alert` in the card, as on the auth screens.
- Don't ask for anything the console can ask later.
- Don't show the stepper as navigation; steps are reached by Continue and Back only.

## Copy

- **Step line:** `Step 1 of 3`. **Heading:** the task: `Create your organization`.
- **Field descriptions:** why it is asked: `How the app will greet you.`, `Usually your company. Everyone you invite will see it.`
- **Required:** `This field is required.`
- **Final action:** names what is created: `Create Organization`.

## Accessibility

- The form is labelled by the step heading (`aria-labelledby`); on step change move focus to the heading (it has `tabindex="-1"`).
- The fields sit in a `fieldset` with a hidden legend.
- The progress bar's label and the visible step line say the same thing.

## States

- Organization: step 1 of 3, name fields and the organization mark.
- Plan: step 2 of 3, the plans as rows; Free selects directly, Pro or Enterprise opens the upgrade drawer and selects only once Upgrade is pressed.
- Profile: step 3 of 3, the usage and role questions, the onboarding-session switch and Create Organization.

## Related

- `headers/auth-header` — the bar this screen renders.
- `platform/auth` — the screen before it.
- `platform/account/change-plan-drawer` — the upgrade drawer the Plan step opens.
- `platform/states/first-use` — what the new organization lands on.
