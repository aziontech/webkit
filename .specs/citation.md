---
name: citation
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 65a304c7211f1b8c2c35fbc54d8a70b768bf4f1e6919d7b30339906e52bf91ff
created: 2026-11-11
last_updated: 2026-11-11
---

# Citation — Component Spec

## Purpose

An inline numbered reference in generated text (`[1]`), Cloudscape's inline citation: a small
superscript number that links to the source — to item `n` of the `Sources` list under the response,
or straight to the URL — with a tooltip naming the source and an accessible name of `Source 1: <title>`.
`StreamingResponse` renders it for every `[n]`; use it directly when you build responses yourself.

## When to use

- A statement in a generated response that comes from a specific source.

## When NOT to use

- A link the reader is meant to follow as part of the prose → a normal link.
- Footnotes in documentation → `doc-prose` conventions.

## Related

- `sources` — the list citations point at.
- `streaming-response` — renders citations from `[n]` in Markdown.
- `tooltip` — shows the source title.

## Best practices

- Number in order of first use: [1], [2], [3].
- Give every citation a `title`; a bare number tells a screen reader nothing.

## Usage

```vue
<script setup>
  import Citation from '@aziontech/webkit/citation'
</script>

<template>
  <p>
    Purges reach every edge location in seconds
    <Citation :index="1" title="Real-Time Purge" href="#answer-1-source-1" />.
  </p>
</template>
```

## Sub-components

_None. Exports: `"./citation"`. Composed DS components: `tooltip`._

## Props

| Prop    | Type     | Default | Required | JSDoc                                                                                                                       |
| ------- | -------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `index` | `number` | —       | true     | 1-based number of the source, in the order the response first cites it.                                                     |
| `title` | `string` | `''`    | false    | Title of the source, shown in the tooltip and read in the accessible name.                                                  |
| `href`  | `string` | `''`    | false    | Where the reference points: `#<anchor>-source-<n>` for the `Sources` list under the response, or the source URL. Without it the number is plain text. |

## Events

_No events._

## Slots

_No slots._

## States

- With `href`: an `<a>` (external URLs open in a new tab); without: a `role="note"` span.
- Tooltip only when `title` is set.

## Motion & Animations

| Trigger | Animation / Transition | Token     | Reduced-motion fallback         |
| ------- | ---------------------- | --------- | ------------------------------- |
| hover   | `transition-colors`    | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region | Token                                                              |
| ------ | ------------------------------------------------------------------ |
| chip   | `var(--bg-surface-raised)`, hover `var(--bg-hover)`, `var(--shape-elements)` |
| number | `.text-label-sm`, `var(--text-link)` (linked) / `var(--text-muted)` |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches a linked citation; `Enter` follows it; focus shows the tooltip.
- ARIA: `aria-label="Source 1: Real-Time Purge"` (the visible digit alone is not a name).
- Touch target: inline text reference; exempt from the 24 px minimum as inline text (WCAG 2.5.8 exception).

## Internationalization

| Key                      | English source            | Override prop |
| ------------------------ | ------------------------- | ------------- |
| `citation.label`         | `Source {index}: {title}` | —             |
| `citation.labelUntitled` | `Source {index}`          | —             |

- Formatting: the index through `Intl.NumberFormat`.

## Right-to-left

- Layout: symmetric margins.
- Icons: none.
- Keyboard: none.
- User data: none.

## Responsive

- Container queries: none: fixed size.
- Narrow: unchanged.
- Touch: inline exception (see Accessibility).
- Reflow: inline.

## Performance

- Bundle budget: see `.size-limit.json` (`citation`; includes `Tooltip`).
- Runtime budget: static.
- Heavy parts: none.

## Examples

_Example in `packages/webkit/examples/citation/`: Default._

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
