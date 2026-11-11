---
name: prompt-input
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 714c337faf9e60c69fb345a70f7fa913bf97f772d6856ddc4d8e0f35daa220b5
created: 2026-11-11
last_updated: 2026-11-11
---

# PromptInput — Component Spec

## Purpose

The composer of a generative AI chat (Cloudscape prompt input, AI Elements PromptInput): a text area
that grows with the prompt up to `maxRows`, a Submit control that becomes Stop while a response is
being generated, a toolbar row for secondary controls (attach, mode), an attachments row above the
text, an optional character limit with a counter, and constraint text under it (a disclaimer or the
shortcuts it accepts). Enter submits; Shift+Enter adds a line; an IME composition never submits.

It is controlled: the owner holds the text, receives `submit` with the trimmed prompt, and clears it.
While `state` is `submitted` or `streaming` the reader can keep typing the next prompt, but cannot
submit it until the response ends or they press Stop.

## When to use

- The input of any conversation with the generative AI assistant.
- A single "Ask about this page" box that opens a conversation.

## When NOT to use

- A text field in a form → `textarea` inside `field`.
- Search over a list → `input` with a search icon or `property-filter`.
- A command palette → `command`.

## Related

- `textarea` — the form control; this one has no visible label and submits on Enter.
- `conversation` — the log above it; only the log scrolls.
- `suggestion-group` — prompts the reader can send without typing.
- `file-dropzone`, `chip` — what attachment flows compose into the `attachments` slot.

## Best practices

- Placeholder is a suggested question with no end punctuation (`Ask a question`); never the only instruction.
- Put the disclaimer and the shortcuts in `hint`, not in the placeholder.
- Set `state` from the request so Submit turns into Stop; wire `stop` to abort it.
- Clear `v-model` in the `submit` handler and keep focus in the input.
- Use `maxLength` only when the backend has a limit; the counter is the warning.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import PromptInput from '@aziontech/webkit/prompt-input'

  const prompt = ref('')
  const state = ref('ready')
  function send(text) {
    prompt.value = ''
    state.value = 'submitted'
  }
</script>

<template>
  <PromptInput v-model="prompt" :state="state" :max-length="4000" @submit="send" @stop="state = 'ready'">
    <template #hint>The AI assistant can make mistakes. Check important information.</template>
  </PromptInput>
</template>
```

## Sub-components

_None — monolithic with slots. Exports: `"./prompt-input": "./src/components/ai/prompt-input/prompt-input.vue"`.
Exported type: `PromptInputState = 'ready' | 'submitted' | 'streaming'`. Composed DS components:
`icon-button` (Submit, Stop). Exposes `focus()`._

## Props

| Prop          | Type                                     | Default   | Required | JSDoc                                                                                                                         |
| ------------- | ---------------------------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `placeholder` | `string`                                 | `''`      | false    | Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`).       |
| `ariaLabel`   | `string`                                 | `''`      | false    | Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`).                   |
| `maxLength`   | `number`                                 | `0`       | false    | Character limit; shows an `n/max` counter and blocks submit over it. `0` means no limit.                                      |
| `minRows`     | `number`                                 | `1`       | false    | Rows shown while empty.                                                                                                       |
| `maxRows`     | `number`                                 | `6`       | false    | Rows the text area grows to before it scrolls.                                                                                |
| `state`       | `'ready' \| 'submitted' \| 'streaming'`  | `'ready'` | false    | Request lifecycle: `submitted` and `streaming` swap Submit for Stop and block another submit; typing stays allowed.           |
| `disabled`    | `boolean`                                | `false`   | false    | Disables the text area, the submit control and every control in the slots' row.                                               |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                  |
| --------- | -------- | ------- | ------------------- | -------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The prompt being written, via `defineModel`. The owner clears it in its `submit` handler. |

## Events

| Event               | Payload  | When                                                                 |
| ------------------- | -------- | -------------------------------------------------------------------- |
| `submit`            | `string` | Enter (without Shift, outside an IME composition) or Submit, with a non-empty prompt within the limit while `state` is `ready`. Payload is trimmed. |
| `stop`              | —        | Stop pressed while `submitted` or `streaming`.                        |

## Slots

| Slot          | Scope | Notes                                                                 |
| ------------- | ----- | --------------------------------------------------------------------- |
| `attachments` | —     | Attached files or context chips, above the text.                      |
| `actions`     | —     | Secondary controls at the inline start of the toolbar; inside a `fieldset` disabled with the input. |
| `hint`        | —     | Constraint text under the input; referenced by `aria-describedby`.    |

## States

- `data-status` mirrors `state`; `data-disabled`; `data-invalid` while over `maxLength`.
- `ready`: Submit (primary `IconButton`, `pi pi-arrow-up`), disabled while the prompt is empty, over the limit or `disabled`.
- `submitted` / `streaming`: Stop (secondary `IconButton`, `pi pi-stop`) replaces Submit; Enter does nothing.
- Over the limit: border turns `--danger-border`, the counter turns danger, `aria-invalid="true"`, and a polite live region says how many characters are over.

## Motion & Animations

| Trigger            | Animation / Transition                                         | Token                      | Reduced-motion fallback          |
| ------------------ | -------------------------------------------------------------- | -------------------------- | -------------------------------- |
| focus / invalid    | `transition-colors duration-fast-02 ease-productive-entrance`   | `fast-02`, `productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region            | Token                                                    |
| ----------------- | -------------------------------------------------------- |
| container         | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)`; focus `var(--border-strong)` + `var(--ring-color)` |
| invalid border    | `var(--danger-border)`                                   |
| disabled surface  | `var(--bg-disabled)`                                     |
| text              | `.text-body-md`, `var(--text-default)`; placeholder `var(--text-muted)` |
| counter, hint     | `.text-body-xs`, `var(--text-muted)`; over limit `var(--danger-contrast)` |
| padding / gaps    | `var(--spacing-xs)`, `var(--spacing-xxs)`, `var(--spacing-sm)` |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the container shows `focus-within:ring-2 focus-within:ring-(--ring-color)`.
- Keyboard map: `Enter` submits; `Shift+Enter` new line; `Tab` moves to the slot controls, then Submit / Stop. IME composition (`isComposing`) never submits.
- ARIA: the `<textarea>` is named by `aria-label` (no visible label, as Cloudscape allows for an input with an action button), described by the counter and the hint, `aria-invalid` over the limit; Submit and Stop are named icon buttons.
- The placeholder never carries required information (it disappears on typing).
- Touch target: `IconButton` medium (44 px on coarse pointers).

## Internationalization

| Key                      | English source                     | Override prop |
| ------------------------ | ---------------------------------- | ------------- |
| `promptInput.label`      | `Prompt`                           | `ariaLabel`   |
| `promptInput.placeholder`| `Ask a question`                   | `placeholder` |
| `promptInput.submit`     | `Submit`                           | —             |
| `promptInput.stop`       | `Stop generating`                  | —             |
| `promptInput.count`      | `{count}/{max}`                    | —             |
| `promptInput.overLimit`  | `{count} characters over the limit`| —             |

- Formatting: counts go through `Intl.NumberFormat` (the `t()` number formatting).

## Right-to-left

- Layout: logical utilities; actions at the inline start, Submit at the inline end.
- Icons: the arrow-up and stop glyphs are not mirrored.
- Keyboard: no arrow-key behavior of its own.
- User data: the text area follows the document direction; mixed prompts render with the browser's bidi.

## Responsive

- Container queries: none; full width of its host.
- Narrow: the toolbar wraps its slot controls; Submit stays at the inline end.
- Touch: `enterkeyhint="send"` on mobile keyboards; targets 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: see `.size-limit.json` (`prompt-input`).
- Runtime budget: one layout read per input event (auto-size).
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/prompt-input/`: Default, Streaming (Stop), Character limit, With attachments and actions, Disabled._

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
