---
name: reasoning
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: ab27ea861ffb59d22614e3d58dea37fd8f7041f4ddf50af1f2f60f69ac93d81f
created: 2026-11-11
last_updated: 2026-11-13
---

# Reasoning — Component Spec

## Purpose

Shows the model's thinking before its response (Cloudscape Thinking pattern, AI Elements Reasoning):
a disclosure whose label reads `Thinking` (pulsing) while the model reasons and `Thought for 14
seconds` once it is done, with the trace inside. Collapsed by default in a chat, where the response is
the main content. The duration comes from the server (`duration`) or is measured from `streaming`
turning on to turning off, rounded to whole seconds. An optional `Skip thinking` lets the reader ask
for the response now.

## When to use

- The model performs extended reasoning before answering, and the trace helps the reader trust or check the response.

## When NOT to use

- Ordinary loading with no reasoning → `ai-loading`.
- Agent actions with side effects (calls, commands) → `tool-call` and `action-confirmation`.
- Progressive steps of a long task → a `stepper` or a list of `tool-call`s.

## Related

- `ai-loading` — loading without a trace.
- `tool-call` — what the agent did, rather than what it thought.
- `streaming-response` — renders a Markdown trace inside the slot.

## Best practices

- Keep it collapsed in chat; open it by default only where reasoning is the point (an editor, a review).
- Never show secrets, token counts or system prompts in the trace.
- Do not replace the label with trace text; the label stays `Thinking` until done.
- Offer `skippable` only when the model can answer meaningfully without finishing.

## Usage

```vue
<script setup>
  import Reasoning from '@aziontech/webkit/reasoning'
</script>

<template>
  <Reasoning :duration="14">
    <p>The reader asked about cache TTL. Checking the cache settings of the workload first.</p>
  </Reasoning>
</template>
```

## Sub-components

_None. Exports: `"./reasoning"`. Composed DS components: `button` (Skip thinking)._

## Props

| Prop          | Type      | Default     | Required | JSDoc                                                                                                                   |
| ------------- | --------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `streaming`   | `boolean` | `false`     | false    | The model is still reasoning: the label reads `Thinking` and pulses; when it turns false the label shows how long it took. |
| `duration`    | `number`  | `undefined` | false    | Seconds the reasoning took, when the server reports it. Without it the component measures from `streaming` turning on to turning off. |
| `open`        | `boolean` | `undefined` | false    | Controlled open state. Use with `v-model:open`.                                                                         |
| `defaultOpen` | `boolean` | `false`     | false    | Initial open state when uncontrolled; collapsed is the default in a chat, where the response is the main content.       |
| `skippable`   | `boolean` | `false`     | false    | Offers `Skip thinking` while streaming, for a model that can answer before it finishes reasoning.                       |

## Events

| Event         | Payload   | When                                    |
| ------------- | --------- | --------------------------------------- |
| `update:open` | `boolean` | The trace was expanded or collapsed.    |
| `skip`        | `(event: MouseEvent)` | Skip thinking pressed while streaming.  |

## Slots

| Slot      | Scope | Notes                                                                        |
| --------- | ----- | ---------------------------------------------------------------------------- |
| `default` | —     | The trace: short narration, steps, inline code. Kept as it was once thinking ends. |

## States

- `data-state="open|closed"` (disclosure), `data-streaming`.
- Label: `Thinking` while streaming; `Thought for {n} seconds` with a duration; `Thought for a few seconds` when neither was measured nor given.

## Motion & Animations

| Trigger            | Animation / Transition                                    | Token                         | Reduced-motion fallback          |
| ------------------ | --------------------------------------------------------- | ----------------------------- | -------------------------------- |
| streaming glyph    | `animate-pulse`                                           | `pulse`                       | `motion-reduce:animate-none`     |
| chevron open/close | `transition-transform duration-fast-02 ease-productive-entrance` | `fast-02`                | `motion-reduce:transition-none`  |
| label color hover  | `transition-colors`                                       | `fast-02`                     | `motion-reduce:transition-none`  |

## Tokens

| Region  | Token                                                         |
| ------- | ------------------------------------------------------------- |
| label   | `.text-label-sm`, `var(--text-muted)` → hover `var(--text-default)` |
| trace   | `.text-body-sm`, `var(--text-muted)`, `border-s-2 var(--border-default)`, `var(--spacing-sm)` |
| gaps    | `var(--spacing-xs)`, `var(--spacing-sm)`                      |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the trigger.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` to Skip thinking.
- ARIA: a `button` with `aria-expanded` and `aria-controls` the trace; glyphs `aria-hidden`; a polite visually hidden status announces the completed label (`Thought for 14 seconds`) when thinking ends. The trace is not live.
- Contrast ≥4.5:1 on the muted label and trace.

## Internationalization

| Key                        | English source                                | Override prop |
| -------------------------- | --------------------------------------------- | ------------- |
| `reasoning.thinking`       | `Thinking`                                    | —             |
| `reasoning.thought`        | `Thought for {count} second(s)` (plural)       | —             |
| `reasoning.thoughtBriefly` | `Thought for a few seconds`                   | —             |
| `reasoning.skip`           | `Skip thinking`                               | —             |

- Formatting: plural rules through `Intl.PluralRules`; the count through `Intl.NumberFormat`.

## Right-to-left

- Layout: `border-s` / `ps-` put the trace rule on the inline start.
- Icons: sparkles and chevron-down are not mirrored.
- Keyboard: none.
- User data: none.

## Responsive

- Container queries: none.
- Narrow: the trigger and Skip wrap.
- Touch: the trigger is text-sized; Skip is a small `Button` (44 px on coarse pointers).
- Reflow: no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`reasoning`).
- Runtime budget: static.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/reasoning/`: Default (done, collapsed), Streaming (with skip)._

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
