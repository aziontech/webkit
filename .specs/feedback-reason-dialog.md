---
name: feedback-reason-dialog
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 522363446a87b6dbf58bdcc0c7e8a350ce56ac7c8da1435fa39ff828a62ad0e7
created: 2026-11-11
last_updated: 2026-11-11
---

# FeedbackReasonDialog — Component Spec

## Purpose

Asks why an assistant response was not helpful, right after the thumbs-down in `ChatMessage.Feedback`: a small dialog with one required reason (radio buttons) and optional details, then Send feedback. It turns a bare thumbs-down into a signal the team can act on, without a page or a form of the owner's own. The owner opens it, sends the payload it emits and closes it.

## When to use

- After a thumbs-down on an AI response, to collect the reason.
- Any rating of generated content that needs a short, categorised reason.

## When NOT to use

- General product feedback with several fields → a page or `Drawer` form.
- A confirmation with no input → `ConfirmDialog`.

## Related

- `chat-message` — `ChatMessage.Feedback` holds the thumbs that open it.
- `confirm-dialog` — the same dialog anatomy for a yes/no decision.

## Best practices

- Open it only after a thumbs-down; a thumbs-up needs no reason.
- Keep the reasons short and mutually exclusive; the last is `Other`, and details stay optional.
- Close it from the `submit` handler once the request succeeds; keep it open with `loading` while it is sent.

## Usage

```vue
<script setup>
  import FeedbackReasonDialog from '@aziontech/webkit/feedback-reason-dialog'
  import { ref } from 'vue'

  const open = ref(false)
  const send = ({ reason, details }) => {
    open.value = false
  }
</script>

<template>
  <FeedbackReasonDialog
    v-model:open="open"
    @submit="send"
  />
</template>
```

## Props

| Prop      | Type                                 | Default | Required | JSDoc                                                                                                                                    |
| --------- | ------------------------------------ | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `reasons` | `{ value: string; label: string }[]` | `[]`    | false    | Reasons offered, in order. Empty uses the catalog's five: inaccurate, not helpful, did not follow the request, unsafe or harmful, other. |
| `loading` | `boolean`                            | `false` | false    | The feedback is being sent: Send feedback shows a spinner and the form is locked.                                                        |
| `title`   | `string`                             | `''`    | false    | Dialog title. Empty uses the locale catalog (`What went wrong?`).                                                                        |

## v-model

| Model          | Type      | Default | Emits         | Notes                                                              |
| -------------- | --------- | ------- | ------------- | ------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `false` | `update:open` | Opens the dialog; the reason and details reset each time it opens. |

## Events

| Event    | Payload                               | When                                                                                                                                              |
| -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit` | `{ reason: string; details: string }` | Send feedback with a reason chosen. `details` is trimmed. Without a reason the group shows `Choose a reason.` and focus moves to the first radio. |

## Slots

_none_

## States

- Idle (open): no reason chosen, Send feedback enabled.
- Invalid: submitted without a reason; the fieldset is invalid and its error is announced.
- Loading: Send feedback spinner, radios, details and Cancel disabled.
- `data-state` on the dialog mirrors `open` / `closed` (from `Dialog`).

## Motion & Animations

| Trigger      | Animation / Transition | Token                    | Reduced-motion fallback |
| ------------ | ---------------------- | ------------------------ | ----------------------- |
| open / close | owned by `Dialog`      | `semantic/animations.js` | handled by `Dialog`     |

## Tokens

| Region      | Token                   |
| ----------- | ----------------------- |
| dialog      | from `Dialog` (`small`) |
| options gap | `var(--spacing-sm)`     |
| form gap    | `var(--spacing-lg)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A modal `Dialog` named by its title and described by its one-line description; focus moves into it and returns to the thumbs-down on close.
- The reasons are a `fieldset` with a `legend` (`Reason`), one `RadioButton` per reason with its label; the details `Textarea` is labelled `Details (optional)`.
- Submitting without a reason marks the fieldset invalid, shows the error text and focuses the first radio; nothing is sent.
- Keyboard: `Tab` through radios (arrows within the group), details, Cancel, Send feedback; `Enter` in a radio submits; `Escape` closes.

## Internationalization

| Key                                                                            | English source                                                                                    | Override prop |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------- |
| `feedbackReason.title`                                                         | `What went wrong?`                                                                                | `title`       |
| `feedbackReason.description`                                                   | `Your answer helps improve future responses.`                                                     | —             |
| `feedbackReason.reason`                                                        | `Reason`                                                                                          | —             |
| `feedbackReason.details`                                                       | `Details (optional)`                                                                              | —             |
| `feedbackReason.detailsPlaceholder`                                            | `What did you expect instead?`                                                                    | —             |
| `feedbackReason.required`                                                      | `Choose a reason.`                                                                                | —             |
| `feedbackReason.cancel`                                                        | `Cancel`                                                                                          | —             |
| `feedbackReason.send`                                                          | `Send feedback`                                                                                   | —             |
| `feedbackReason.inaccurate`, `notHelpful`, `ignoredRequest`, `unsafe`, `other` | `Inaccurate or made up`, `Not helpful`, `Did not follow my request`, `Unsafe or harmful`, `Other` | `reasons`     |

## Right-to-left

- Layout: logical spacing only; the footer actions sit at the inline end.
- Icons: none.
- Keyboard: radio arrows follow the page direction (native).
- User data: details render with `dir="auto"` through `Textarea`.

## Responsive

- Container queries: the dialog body is the `@container/panel` from `PanelContent`.
- Narrow: the dialog is the `small` size and becomes full width under `sm`; the footer buttons stretch (from `PanelFooter`).
- Touch: radios and buttons keep their 40 px targets.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 31.64 KB gzip for `./feedback-reason-dialog` in `.size-limit.json` (most of it is `Dialog`, `Field`, `RadioButton`, `Textarea` and `Button`, shared with the page).
- Runtime budget: renders only while open (the dialog content is portalled on open).
- Heavy parts: none.

## Examples

- Default — a response with thumbs; thumbs-down opens the dialog, Send feedback closes it and the thumbs read `Feedback sent`.

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
