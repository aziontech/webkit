---
name: doc-tab
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: a6f1b86dd6f64df832900de818615905bf560f6bc88fdc817e15234dfe06ada1
created: 2026-11-11
last_updated: 2026-11-11
---

# DocTab — Component Spec

## Purpose

One panel inside `DocTabs`. It carries its title and its body only; `DocTabs` reads the title to build the strip. Rendered on its own it is a `display: contents` wrapper around its body.

## When to use

- As a direct child of `DocTabs`.

## When NOT to use

- Outside `DocTabs` — it renders no tab of its own.

## Related

- `DocTabs`.

## Best practices

- A short title: the platform or tool name.

## Usage

```vue
<script setup>
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
</script>

<template>
  <DocTabs>
    <DocTab title="macOS"><p>Install with Homebrew.</p></DocTab>
  </DocTabs>
</template>
```

## Props

| Prop    | Type     | Default | Required | JSDoc                                                 |
| ------- | -------- | ------- | -------- | ----------------------------------------------------- |
| `title` | `string` | `''`    | false    | The tab label; `DocTabs` reads it to build the strip. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes           |
| --------- | ----- | --------------- |
| `default` | —     | The panel body. |

## States

- Visual states: `default` (`DocTabs` owns selection).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md)   |
| ------ | ------------------- |
| none   | Inherits the panel. |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- No role of its own; `DocTabs` renders the tab and the tabpanel.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Responsive

- Inherits `DocTabs`.

## Performance

- Bundle budget: 1 KB gzip for `./doc-tab` in `.size-limit.json`.

## Examples

- Default — inside `DocTabs`.

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
