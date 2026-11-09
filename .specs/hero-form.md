---
name: hero-form
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 79a4c066e6520a355b505f55dfa0e3c9b8fbf4c7a9677c0f5225fce9fcd1417a
---
# HeroForm — Component Spec

## Purpose

The opening band of a lead-capture page, where the form is the reason for the page: the hero copy and a list of highlights on one side, the form on the other, above the fold, with the client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-form', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `topic`, `field-text`, `field-select`, `field-phone-number`, `field-textarea`, `button` and `message`. The fields are data: each entry of `fields` picks its control by `kind`, so the Contact page and the Under attack page are the same block with different `fields`. The block never sends: it validates the fields locally (required fields and the email format, with the messages from `messages`) and on a valid submit emits `submit` with the event and the values keyed by field `name`; the site posts them and reports the outcome back through `loading`, `submitted` and `error`.

## When to use

- To open a page whose purpose is a lead form, such as Contact sales or Under attack.

## When NOT to use

- For a newsletter sign-up with one email field → use `closing-call-to-action-newsletter`.
- For an opening band with calls to action and no form → use `hero-band` or `hero-with-opening`.

## Related

- `closing-call-to-action-newsletter` — the other form section; same `submit` and state contract.
- `message` — renders the success and failure messages.

## Best practices

- Give every field a unique `name`; it is the key of the submitted value.
- Mark half-width fields in pairs so each row stays full.
- Set `loading` while the values are sent, then `submitted` or `error` with the outcome.

## Usage

```vue
<script setup>
import HeroForm from '@aziontech/webkit/sections/hero-form'
import { ref } from 'vue'

const loading = ref(false)
const submitted = ref(false)
const error = ref(false)

const onSubmit = async (event, values) => {
  loading.value = true
  error.value = false
  try {
    const response = await fetch('/contact', { method: 'POST', body: JSON.stringify(values) })
    submitted.value = response.ok
    error.value = !response.ok
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
    :items="[{ icon: 'ai ai-edge-ai', title: 'Build AI applications', description: 'Run AI agents and inference close to your users.' }]"
    form-aria-label="Contact sales"
    :fields="[
      { name: 'firstname', kind: 'text', label: 'First name', half: true, required: true },
      { name: 'email', kind: 'email', label: 'Work email', required: true }
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
    :error="error"
    @submit="onSubmit"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `messages` | `HeroFormMessages` | `—` | true | Copy of the form outcomes: `{ missing, invalidEmail, success, error }`. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `items` | `HeroFormItem[]` | `[]` | false | The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items. |
| `formAriaLabel` | `string` | `''` | false | Accessible name of the field group, read as its legend. |
| `fields` | `HeroFormField[]` | `[]` | false | The form fields in order; each is `{ name, kind, label, placeholder?, required?, half?, options?, country? }`. |
| `submitLabel` | `string` | `''` | false | Label of the submit button. |
| `carouselLabel` | `string` | `''` | false | Overline above the client strip. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the client marks, in order; the strip renders only when there are marks. |
| `loading` | `boolean` | `false` | false | The site is sending the values: the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the values: the form gives way to `messages.success`. |
| `error` | `boolean` | `false` | false | The site could not send the values: `messages.error` shows under the form. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` holds every field by `name`, trimmed, with a phone number prefixed by its dial code. The block never sends it. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `error`
- `invalid`: on submit, an empty required field shows `messages.missing` and a malformed email `messages.invalidEmail` under the field; editing the field clears it; nothing is emitted
- `loading` (prop): the button shows its loading state and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): the form is replaced by a success `Message` with `messages.success`; `data-submitted` on the root
- `error` (prop): a danger `Message` with `messages.error` shows under the button; the form stays editable; `data-error` on the root
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the list is omitted; when `carouselMarks` is empty the strip is omitted

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| rhythm | `var(--spacing-xxl)`, `var(--spacing-xl)`, `var(--spacing-lg)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the field controls and `button`.
- Keyboard map: `Tab` walks the fields in order then the button; `Enter` in a text field or on the button submits.
- ARIA: the band is the `hero` `<section>` named by the title (`aria-label`); the root is a plain `div`. The fields sit in a `fieldset` whose visually hidden `legend` is `formAriaLabel`; each control is labelled through its own `Label` with an id from `useId`; each label is a `Label` rendered by the band, carrying the persistent Required tag of a `required` field from first render. Validation runs on submit only: a required field left empty takes the field's amber `required` state (warning border, `kind=required` helper, `aria-required`), a malformed email the red `invalid` state (`aria-invalid`), never both at once; the message is the field's helper text, and editing the field clears it. The success message is a `status` region and the failure message an `alert`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the composed components carry their own fallback.
- Touch target ≥40×40 px — the text fields and the button are large.

## Stories (Storybook)

- Default
- UnderAttack — the same block with the incident `fields` and `items`
- Loading
- Submitted
- Failed

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
