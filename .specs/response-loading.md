---
name: response-loading
category: ai
structure: monolithic
status: implemented
spec_version: 5
template: 2
checksum: 40d904766c74064bf8f805b56ef487f4dd9f2c901e22bc521d14046b239120a8
created: 2026-11-11
last_updated: 2026-11-15
---

# ResponseLoading — Component Spec

## Purpose

Use ResponseLoading only while a generative AI answer is being produced; never for loading product data, which uses Skeleton (known shape), Spinner (inline) or Progress (measurable).

The loading state of a generative AI response (Cloudscape generative AI loading states and loading
bar, AI Elements Loader): visible loading text — `Generating a response`, `Loading list of workloads`
— paired with three pulsing dots (`inline`, for text) or an indeterminate bar (`bar`, where a table,
list or code block is about to appear). It waits `delay` milliseconds before showing anything, so a
response that arrives within a second never flickers a loading state.

## When to use

- Processing: the model has the prompt but has produced nothing yet (`ChatMessage` renders it for `state="pending"`).
- Generation of mixed content: a bar where a table or code block will appear while text streams.

## When NOT to use

- Model reasoning with a trace → `reasoning`.
- Loading a page or table of product data → `skeleton`, `spinner`, `progress`.
- Determinate progress → `progress`.

## Related

- `chat-message` — renders this while `pending`.
- `progress` — the indeterminate bar it draws.
- `reasoning` — thinking with a trace.

## Best practices

- Text says `[Generating|Loading] <what>` without end punctuation: `Generating a response`, `Loading list of workloads`.
- Keep the default 1 s delay; set `delay` to 0 only when the owner already delayed.
- Use the bar only for non-text content; stream text instead of loading it.

## Usage

```vue
<script setup>
  import ResponseLoading from '@aziontech/webkit/response-loading'
</script>

<template>
  <ResponseLoading />
  <ResponseLoading
    variant="bar"
    label="Generating a table of cache hits"
  />
</template>
```

## Sub-components

_None. Exports: `"./response-loading"`; type `ResponseLoadingVariant`. Composed DS components: `progress`._

## Props

| Prop      | Type                | Default    | Required | JSDoc                                                                                                                                                         |
| --------- | ------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`   | `string`            | `''`       | false    | Visible loading text, `Generating <what>` or `Loading <what>`, with no end punctuation. Empty uses the locale catalog (`Generating a response`).              |
| `variant` | `'inline' \| 'bar'` | `'inline'` | false    | `inline` pulses three dots beside the text (text responses); `bar` draws an indeterminate bar under it, where a table, list or code block is about to appear. |
| `delay`   | `number`            | `1000`     | false    | Milliseconds to wait before showing anything, so a fast response never flickers a loading state.                                                              |

## Events

_No events._

## Slots

_No slots._

## States

- `data-variant`; `data-state="closed"` until the delay has passed, then `data-state="open"`. Before that the `role="status"` region exists but is empty, so the text is announced when it appears.

## Motion & Animations

| Trigger | Animation / Transition            | Token     | Reduced-motion fallback                    |
| ------- | --------------------------------- | --------- | ------------------------------------------ |
| dots    | `animate-pulse`, staggered 200 ms | `pulse`   | `motion-reduce:animate-none` (static dots) |
| bar     | `Progress` indeterminate sweep    | component | handled by `Progress` (full static bar)    |

## Tokens

| Region | Token                                               |
| ------ | --------------------------------------------------- |
| text   | `.text-body-sm`, `var(--text-muted)`                |
| dots   | `var(--text-muted)`, `var(--radius-full)`           |
| bar    | `Progress` small rounded, max `var(--container-xs)` |
| gaps   | `var(--spacing-xs)`, `var(--spacing-2xs)`           |

## Theme gaps

| Figma variable | Temporary primitive                                                  | Follow-up                                           |
| -------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| —              | `var(--radius-full)` for the dots, as `help-panel` and `stepper` use | `TODO: document --radius-full in TOKENS.md § Shape` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: nothing focusable.
- Keyboard map: none.
- ARIA: `role="status"` (polite) holds the visible text; dots and bar are `aria-hidden`. Loading is always conveyed in text, not only in motion.
- Reduced motion: dots stop pulsing; the bar stops sweeping.

## Internationalization

| Key                          | English source          | Override prop |
| ---------------------------- | ----------------------- | ------------- |
| `responseLoading.generating` | `Generating a response` | `label`       |

- Formatting: none.

## Right-to-left

- Layout: logical utilities; the bar sweeps from the inline start (handled by `Progress`).
- Icons: none.
- Keyboard: none.
- User data: none.

## Responsive

- Container queries: none.
- Narrow: the bar fills the width up to `--container-xs`.
- Touch: nothing interactive.
- Reflow: wraps.

## Performance

- Bundle budget: see `.size-limit.json` (`response-loading`).
- Runtime budget: one timer.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/response-loading/`: Default, Bar._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
