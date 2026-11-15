---
name: hero-form
category: sections
structure: monolithic
status: implemented
spec_version: 6
created: 2026-11-05
last_updated: 2026-11-15
checksum: b6ee1677580e4e6410f740e23f9dc4f2119f29c0ad3fe434047415ec7466f3a6
template: 2
---

# HeroForm — Component Spec

## Purpose

The opening band of a lead-capture page, where the form is the reason for the page: the hero copy and a list of highlights on one side, the form on the other, above the fold, with the client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-form', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `topic`, `field`, `input`, `select`, `phone-input`, `textarea`, `button` and `alert`. The fields are data: each entry of `fields` picks its control by `type`, so the Contact page and the Under attack page are the same block with different `fields`. The block never sends: it validates the fields locally (required fields and the email format, with the messages from `messages`) and on a valid submit emits `submit` with the event and the values keyed by field `name`; the site posts them and reports the outcome back through `loading`, `submitted` and `failed`.

## When to use

- Use HeroForm when the page exists to capture a lead and the form sits above the fold.
- To open a page whose purpose is a lead form, such as Contact sales or Under attack.

## When NOT to use

- For a newsletter sign-up with one email field → use `closing-call-to-action-newsletter`.
- For an opening band with calls to action and no form → use `hero-band`, which takes every other marketing page opening.

## Related

- `closing-call-to-action-newsletter` — the other form section; same `submit` and state contract.
- `alert` — renders the success and failure messages.

## Best practices

- Give every field a unique `name`; it is the key of the submitted value.
- Mark half-width fields in pairs so each row stays full.
- Set `visuallyHiddenLabel` on a field the page labels by its placeholder alone (azion.com's phone field): the label stays the control's accessible name for assistive tech but is not drawn, so give that field a `placeholder` that says what to type.
- Keep the headline to a short phrase; the band sets it on a narrower measure than the description (`--container-md`), so "Grow as an Azion Partner" breaks over two lines as on the site. There is no width prop to tune.
- Set `loading` while the values are sent, then `submitted` or `failed` with the outcome.

## Usage

```vue
<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'
  import { ref } from 'vue'

  const loading = ref(false)
  const submitted = ref(false)
  const failed = ref(false)

  const onSubmit = async (event, values) => {
    loading.value = true
    failed.value = false
    try {
      const response = await fetch('/contact', { method: 'POST', body: JSON.stringify(values) })
      submitted.value = response.ok
      failed.value = !response.ok
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <HeroForm
    eyebrow="Sales"
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="[
      {
        icon: 'ai ai-edge-ai',
        title: 'Build AI applications',
        description: 'Run AI agents and inference close to your users.'
      }
    ]"
    form-aria-label="Contact sales"
    :fields="[
      { name: 'firstname', variant: 'text', label: 'First name', half: true, required: true },
      { name: 'email', type: 'email', label: 'Work email', required: true }
    ]"
    submit-label="Contact sales"
    :messages="{
      missing: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
      success: 'We will be in touch.',
      error: 'We could not send your message. Try again.'
    }"
    :loading="loading"
    :submitted="submitted"
    :failed="failed"
    @submit="onSubmit"
  />
</template>
```

## Props

| Prop               | Type               | Default     | Required | JSDoc                                                                                                                                                                                                                   |
| ------------------ | ------------------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`         | `HeroFormMessages` | `—`         | true     | Copy of the form outcomes: `{ missing, invalidEmail, success, error }`.                                                                                                                                                 |
| `eyebrow`          | `string`           | `''`        | false    | Short overline above the headline.                                                                                                                                                                                      |
| `titleHighlight`   | `string`           | `''`        | false    | Opening words of the headline, painted in the brand accent.                                                                                                                                                             |
| `title`            | `string`           | `''`        | false    | Page headline, rendered as the page `h1`; the band renders nothing when empty.                                                                                                                                          |
| `description`      | `string`           | `''`        | false    | Sentence under the headline.                                                                                                                                                                                            |
| `descriptionLink`  | `HeroFormLink`     | `undefined` | false    | A link continuing the description inline, such as a phone line; `{ label, href }`. Omitted when absent.                                                                                                                 |
| `descriptionAfter` | `string`           | `''`        | false    | Copy after the inline link, closing the description's sentence.                                                                                                                                                         |
| `primaryAction`    | `HeroFormAction`   | `undefined` | false    | First button under the copy; `{ label, href, trailing?, target? }`. Shown only with a label and a link.                                                                                                                 |
| `secondaryAction`  | `HeroFormAction`   | `undefined` | false    | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link.                                                                                                    |
| `anchor`           | `string`           | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                          |
| `items`            | `HeroFormItem[]`   | `[]`        | false    | The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items.                                                                                     |
| `formAriaLabel`    | `string`           | `''`        | false    | Accessible name of the field group, read as its legend.                                                                                                                                                                 |
| `fields`           | `HeroFormField[]`  | `[]`        | false    | The form fields in order; each is `{ name, type, label, placeholder?, required?, half?, options?, country?, visuallyHiddenLabel? }`; `visuallyHiddenLabel` keeps the label as the accessible name but does not draw it. |
| `submitLabel`      | `string`           | `''`        | false    | Label of the submit button.                                                                                                                                                                                             |
| `tickerLabel`      | `string`           | `''`        | false    | Overline above the client ticker.                                                                                                                                                                                       |
| `tickerMarks`      | `string[]`         | `[]`        | false    | Registry names of the client marks, in order; the ticker renders only when there are marks.                                                                                                                             |
| `loading`          | `boolean`          | `false`     | false    | The site is sending the values: the button shows its loading state and a submit is ignored.                                                                                                                             |
| `submitted`        | `boolean`          | `false`     | false    | The site sent the values: the form gives way to `messages.success`.                                                                                                                                                     |
| `failed`           | `boolean`          | `false`     | false    | The site could not send the values: `messages.error` shows under the form.                                                                                                                                              |

## Events

| Event    | Payload                                                | Notes                                                                                                                                                                 |
| -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` holds every field by `name`, trimmed, with a phone number prefixed by its dial code. The block never sends it. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `failed`
- `invalid`: on submit, an empty required field shows `messages.missing` and a malformed email `messages.invalidEmail` under the field; focus moves to the first field in error; editing the field clears it; nothing is emitted
- `loading` (prop): the button shows its loading state, every field is disabled (the scope locks off the one flag) and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): the form is replaced by a success `Alert` with `messages.success`, which takes focus when focus was in the form; `data-submitted` on the root
- `failed` (prop): a danger `Alert` with `messages.error` shows under the button; the form stays editable; `data-failed` on the root
- A field with `visuallyHiddenLabel` renders its `Field.Label` visually hidden (`sr-only`), so the control keeps its accessible name and the page shows only the placeholder
- The headline caps at `--container-md` while the description and highlights keep the `lg` column
- `descriptionLink` renders inline after `description`, underlined, followed by `descriptionAfter`, so the copy reads as one sentence
- Without `items`, the copy block is sticky from `lg` (it stays in view while the taller form scrolls past); with `items` it scrolls with the highlights
- `loading` also sets `disabled` on the `fieldset`, so the browser locks every control in it
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the list is omitted; when `tickerMarks` is empty the strip is omitted

## Motion & Animations

| Trigger                       | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| inline description link hover | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                 | Token (DESIGN.md)                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------- |
| rhythm                 | `var(--spacing-2xl)`, `var(--spacing-xl)`, `var(--spacing-lg)`, `var(--spacing-md)` |
| inline link hover      | `var(--text-default)`                                                               |
| inline link focus ring | `var(--ring-color)`, shape `var(--shape-flat)`                                      |
| anchor scroll offset   | `var(--spacing-2xl)`                                                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the field controls and `button`.
- Keyboard map: `Tab` reaches the inline description link and the actions under the copy, then walks the fields in order and the button; `Enter` in a text field or on the button submits.
- ARIA: the band is the `hero` `<section>` named by the title (`aria-label`); the root is a plain `div`. The fields sit in a `fieldset` whose visually hidden `legend` is `formAriaLabel`; each control is labelled through its own `Field.Label` with an id from `useId`; each label is a `Field.Label` rendered by the band, carrying the persistent Required tag of a `required` field from first render. An `email` field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`. Validation runs on submit only: a required field left empty takes the field's amber `required` state (warning border, `type=required` helper, `aria-required`), a malformed email the red `invalid` state (`aria-invalid`), never both at once; the message is the field's helper text, and editing the field clears it. The success message is a `status` region and the failure message an `alert`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the inline description link's colour transition; the composed components carry their own fallback.
- Touch target ≥40×40 px — the text fields and the button are large.

## Internationalization

No built-in strings: every label, placeholder, message and action is a prop from the page JSON (`fields`, `messages`, `submitLabel`, `formAriaLabel`).

- Formatting: none of its own; the phone field formats the number for its country (owned by `phone-input`).

## Right-to-left

- Layout: logical utilities only; the copy and the form swap sides under `dir="rtl"`.
- Icons: the action chevrons mirror with `button`; highlight icons are not mirrored.
- Keyboard: no arrow-key handling beyond the select's own.
- User data: email and phone values render as typed.

## Responsive

- Container queries: none; the copy and the form sit side by side from `lg` and stack below it.
- Narrow (below `lg`): the copy, the highlights and the form stack; below `sm` every field takes the full row (`half` fields stop pairing).
- Touch: the fields and the buttons are large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 40.9 KB gzip, the `.size-limit.json` entry `hero-form` (entry chunk only; raised from 40.6 KB for the inline description link and the actions under the copy, 40.82 KB measured).
- Runtime budget: validation runs on submit only.
- Heavy parts: the client strip loads its marks on demand.

## Examples

- Default
- UnderAttack — the same block with the incident `fields` and `items`
- ScaleUp (site) — no highlights or client strip, a two-line headline and a phone field labelled by its placeholder through `visuallyHiddenLabel`
- Loading
- Submitted
- Error
- Contact line — justification: `descriptionLink`, `descriptionAfter` and the two actions are parts no other example shows (a phone line inline in the description, actions under the copy, no highlights so the copy stays sticky).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
