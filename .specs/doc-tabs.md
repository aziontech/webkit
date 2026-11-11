---
name: doc-tabs
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 62910e9e0b616bb47854db33709d1ddec9162c08cec9b79a4b5557a5bb84f5de
created: 2026-11-11
last_updated: 2026-11-11
---

# DocTabs — Component Spec

## Purpose

Alternative paths through the same instruction ("macOS / Linux / Windows", "Console / CLI"). It reads the `title` of each `DocTab` child to build the strip and renders each child body in its panel, on `Tabs`, so the strip, the indicator and the keyboard model are the design system's.

## When to use

- The same procedure that differs per platform or per tool.

## When NOT to use

- For code-only alternatives — use `DocCodeGroup`.
- For page navigation — use links or `DocCardGroup`.

## Related

- `DocTab` — the panel it reads.
- `Tabs` — the surface it renders on.
- `DocCodeGroup`.

## Best practices

- Two to five tabs; put the most common path first.
- Keep the panels parallel so switching compares like with like.

## Usage

```vue
<script setup>
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
</script>

<template>
  <DocTabs>
    <DocTab title="Console"><p>Open Settings, then Domains.</p></DocTab>
    <DocTab title="CLI"><p>Run the link command.</p></DocTab>
  </DocTabs>
</template>
```

## Props

| _none_ | — | — |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                         |
| --------- | ----- | --------------------------------------------------------------------------------------------- |
| `default` | —     | The `DocTab` children, in strip order. A child without a `title` is labelled by its position. |

## States

- The first tab is selected on render; selection state comes from `Tabs`.
- `data-doc-block` on the root; the strip carries `data-doc-chrome`.

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
| ------ | ----------------- |
| all    | From `Tabs`.      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `tablist`, `tab` and `tabpanel` roles and the arrow-key model come from `Tabs`.
- Panels have no padding of their own; the first block in a panel carries the prose rhythm.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Responsive

- The strip scrolls inside its own row on narrow screens (from `Tabs`).

## Performance

- Bundle budget: 17 KB gzip for `./doc-tabs` in `.size-limit.json` (Tabs included).

## Stories (Storybook)

- Default — three platforms with prose and a code block in each panel.

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
