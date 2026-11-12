---
name: copy-prompt-button
category: actions
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 9ede1a095a5c7d9df882529776926f3e654c7c7ec102bb30513865dc794408ad
created: 2026-11-12
last_updated: 2026-11-12
---

# CopyPromptButton — Component Spec

## Purpose

The "Copy prompt" button of a docs or product home: one dark chip that copies a ready-made prompt for a coding agent and, after its label, shows the marks of the agents it works with (Claude, ChatGPT, Gemini and Cursor by default). The chip is dark in both themes (it renders under `data-theme="dark"`) with a faint accent glow on its top and bottom edges, so it reads as the AI entry point next to a primary button. The marks are single-colour and decorative; their names reach screen readers as the button's description ("Works with Claude, ChatGPT, Gemini, Cursor").

## When to use

- The hero of a documentation home or a product landing, beside the primary action (`Get started`), when the page hands its reader a prompt for their agent.
- Inside `DocAgentCard`, the "Your AI agent, fluent in Azion" card of a docs home (it renders this button by default).

## When NOT to use

- To show the prompt text itself on the page → use `DocPrompt` (it renders the text with its own copy control).
- To copy a value, a token or a code snippet → use `CopyButton`.
- As a generic dark button → use `Button kind="secondary"`.

## Related

- `DocPrompt` — the prompt rendered in full, with a copy control.
- `DocAgentCard` — the docs-home card that places this button in its left column.
- `DocHero` — the docs-home masthead whose `actions` slot holds `Get started` and this button.
- `CopyButton` — the icon-only copy control; this button shares its clipboard fallback.

## Best practices

- Put it second, after the primary `Button` (`Get started`), and explain what the prompt does in one line below the row (`DocHero`'s `note` slot).
- Keep the default agents unless the product supports a different set; pass `:agents="[]"` to draw the label alone.
- Pass the exact prompt in `value`; the button copies it as it stands.
- Do not recolour the marks: they are single-colour by design and follow the chip's ink.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'

  const prompt = 'Set up the Azion CLI, connect the Azion docs over MCP and link this project.'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-sm)">
    <Button
      label="Get started"
      size="large"
      href="#"
    />
    <CopyPromptButton :value="prompt" />
  </div>
</template>
```

## Props

| Prop          | Type                | Default                          | Required | JSDoc                                                                                  |
| ------------- | ------------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `value`       | `string`            | —                                | true     | The prompt copied to the clipboard on activation.                                      |
| `label`       | `string`            | `''`                             | false    | Visible text and accessible name while idle; empty uses the catalog's `Copy prompt`.   |
| `copiedLabel` | `string`            | `''`                             | false    | Visible text announced after a copy; empty uses the catalog's `Copied`.                |
| `agents`      | `CopyPromptAgent[]` | Claude, ChatGPT, Gemini, Cursor  | false    | The agents whose marks follow the label, in order; an empty list draws no marks.       |
| `disabled`    | `boolean`           | `false`                          | false    | Disables the button; `copy` is not emitted.                                            |

## Events

| Event  | Payload  | Notes                                                                                                         |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `copy` | `string` | Fires with `value` after the clipboard write succeeds. When the write is refused, the copy fallback popover opens instead. |

## Slots

_none_

## States

- Visual states: `idle`, `hover` (a hover layer lightens the chip), `focus-visible` (outline ring), `copied` (the label swaps to a check and `Copied` for two seconds, without changing the width), `disabled`.
- `data-state` is `idle` or `copied`; `data-disabled` mirrors `disabled`.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed`.

## Motion & Animations

| Trigger            | Animation / Transition                                                         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                         |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------- |
| hover state change | `transition-colors` and the hover layer's `transition-opacity`, `duration-fast-02 ease-productive-entrance` | semantic (fast-02 · productive entrance)          | `motion-reduce:transition-none`, `motion-reduce:before:transition-none` |

## Tokens

| Region   | Token (DESIGN.md)                                                                         |
| -------- | ----------------------------------------------------------------------------------------- |
| chip     | under `data-theme="dark"`: `var(--bg-canvas)` with a `var(--bg-surface-raised)` centre    |
| frame    | `var(--border-default)` of the page theme around the chip; the chip's own `var(--border-default)` |
| glow     | `var(--accent)` hairlines on the top and bottom edges                                     |
| label    | `.text-button-lg`, `var(--text-default)`                                                  |
| marks    | `var(--text-default)`, `.text-label-lg`                                                   |
| hover    | `var(--bg-hover)` layer                                                                   |
| shape    | `var(--shape-button)`                                                                     |
| spacing  | `var(--spacing-md)` start, `var(--spacing-sm)` end and gap, `var(--spacing-xs)` between marks |
| focus    | `var(--ring-color)` outline                                                               |
| disabled | `var(--bg-disabled)`, `var(--text-disabled)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`Copy prompt`, then `Copied` while the copied state shows).
- The agent marks are `aria-hidden`; their names form the description through `aria-describedby` ("Works with Claude, ChatGPT, Gemini, Cursor").
- A polite `role="status"` region next to the button announces `Copied` after a successful copy.
- Keyboard map: `Tab` focuses; `Enter` and `Space` copy.
- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`.
- Contrast: label and marks ≥ 4.5:1 on the dark chip in both page themes.
- Touch target: 40 px tall; `pointer-coarse:min-h-11` raises it to 44 px.
- `motion-reduce:transition-none` on every transition.

## Internationalization

| Key                          | English source       | Override prop |
| ---------------------------- | -------------------- | ------------- |
| `copyPromptButton.label`     | `Copy prompt`        | `label`       |
| `copyPromptButton.copied`    | `Copied`             | `copiedLabel` |
| `copyPromptButton.worksWith` | `Works with {agents}` | `agents`      |

- Agent names are brand names and are not translated.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`, `inset-x-`); the label leads at the inline start and the marks follow it.
- Icons: brand marks are not mirrored.
- Keyboard: no arrow keys.

## Responsive

- The chip keeps its intrinsic width; the label truncates with an ellipsis before the marks shrink when the row is narrower than the chip.
- Touch: 40 px tall, 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px; the chip wraps to its own line inside a wrapping action row.

## Performance

- Bundle budget: 2.5 KB gzip for `./copy-prompt-button` in `.size-limit.json`, initial chunk only (2.18 KB measured; the clipboard fallback is loaded on demand).
- Runtime budget: none; one timer while the copied state shows.
- Heavy parts: the copy fallback popover is an async component, requested only when the clipboard write is refused.

## Examples

- Default — the chip with the default agents, beside a primary `Get started`.
- Agents — a custom agent list, and the label alone with `:agents="[]"`.
- Disabled — `disabled`.

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
