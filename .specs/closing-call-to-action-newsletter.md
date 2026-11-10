---
name: closing-call-to-action-newsletter
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: a8a81b4f9472e45f745839e37af45f9d15b8c7f4cec3a2ada3730b683bd49515
---
# ClosingCallToActionNewsletter — Component Spec

## Purpose

The closing band whose ask is a newsletter sign-up: the overline and a large headline on the lead side, a subscribe form labelled by the ask on the other, over a strip lit by the pixelated primary wave, then the hatched closing frame. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-newsletter', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `overline`, `field-text`, `button` and `texture-material`. The block never sends: it validates the address locally (an empty field and a malformed address each show their message under the field) and on a valid submit emits `submit` with the event and `{ email }`; the site posts the address and reports the outcome back through `loading`, `submitted` and `error`, which the band renders with the messages from `form`.

## When to use

- To close the Blog or the Resource Hub on a newsletter subscription.

## When NOT to use

- For a close on one or two link actions → use `closing-call-to-action`.
- For a lead form with several fields → use `hero-form`.

## Related

- `closing-call-to-action` — the closing band whose ask is a link action.
- `message` — renders the success and failure messages.

## Best practices

- Set `loading` while the address is sent, then `submitted` or `error` with the outcome.
- Keep `description` to one sentence; it is set as the large headline.
- Write `form.invalidMessage` with an example address so the fix is obvious.

## Usage

```vue
<script setup>
import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'
import { ref } from 'vue'

const loading = ref(false)
const submitted = ref(false)
const error = ref(false)

const onSubmit = async (event, values) => {
  loading.value = true
  error.value = false
  try {
    await fetch('/newsletter', { method: 'POST', body: JSON.stringify(values) })
    submitted.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ClosingCallToActionNewsletter
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="{
      placeholder: 'Your email',
      submitLabel: 'Subscribe',
      successMessage: 'Thanks for subscribing to the Azion newsletter',
      errorMessage: 'We could not subscribe you. Try again.',
      requiredMessage: 'Enter your email address.',
      invalidMessage: 'Enter an email address like name@example.com.'
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
| `form` | `ClosingCallToActionNewsletterForm` | `—` | true | Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline on the lead side, closed by the blinking cursor. |
| `title` | `string` | `''` | false | The ask, rendered as the label of the email field; it also names the band. |
| `description` | `string` | `''` | false | The pitch, rendered as the band's large `h2` on the lead side. |
| `loading` | `boolean` | `false` | false | The site is sending the address: the field is disabled, the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the address: the form gives way to `form.successMessage`. |
| `error` | `boolean` | `false` | false | The site could not send the address: `form.errorMessage` shows under the form. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` is `{ email }` with the trimmed address. The block never sends it. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `error`
- `invalid`: an empty field shows `form.requiredMessage`, a malformed address `form.invalidMessage`, under the field; typing clears it; nothing is emitted
- `loading` (prop): the field is disabled, the button shows its loading state and a submit emits nothing
- `submitted` (prop): the form is replaced by a success `Message` with `form.successMessage`
- `error` (prop): a danger `Message` with `form.errorMessage` shows under the form, which stays editable

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| form surface | `var(--bg-surface)` |
| headline | `.text-heading-lg`, `var(--text-default)` |
| ask | `.text-heading-sm`, `var(--text-default)` |
| texture strip | `var(--bg-canvas)`, `var(--border-default)` |
| rhythm | `var(--spacing-xxl)`, `var(--spacing-xl)`, `var(--spacing-lg)`, `var(--spacing-md)`, `var(--spacing-sm)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `field-text` and `button`.
- Keyboard map: `Tab` reaches the field then the button; `Enter` in the field or on the button submits.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the ask is a `<label for>` bound to the field with `useId`; the validation message is the field's helper text and `invalid` sets `aria-invalid`. The success message is a `status` region and the failure message an `alert`. The texture strip is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline and ask `var(--text-default)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the button carry their own fallback.
- Touch target ≥40×40 px — the field and the button are large.

## Stories (Storybook)

- Default
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
