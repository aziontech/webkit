---
name: doc-code-group
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 556dd75a4553d04ebd0af92974af1d360a755cacd02c0f99cf46e7d82bdcc276
created: 2026-11-11
last_updated: 2026-11-11
---

# DocCodeGroup — Component Spec

## Purpose

One or more code samples of the same thing in different languages or package managers, rendered on `CodeBlock` so the docs inherit its header, copy control and syntax surface. One sample renders a plain block; several render the joined tab strip.

## When to use

- The same install command for npm, pnpm and yarn.
- The same request in cURL, JavaScript and Python.

## When NOT to use

- For unrelated snippets — use one `CodeBlock` each.
- For prose that differs per platform — use `DocTabs`.

## Related

- `CodeBlock` — the surface it renders on.
- `DocTabs` — alternatives that are prose, not code.

## Best practices

- Label each sample with what differs (the language or the tool), not with "Example".
- Keep the same order across a page.

## Usage

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'
</script>

<template>
  <DocCodeGroup
    :samples="[
      { label: 'npm', language: 'bash', code: 'npm install @aziontech/webkit' },
      { label: 'pnpm', language: 'bash', code: 'pnpm add @aziontech/webkit' }
    ]"
  />
</template>
```

## Props

| Prop              | Type              | Default | Required | JSDoc                                                                                                                                                    |
| ----------------- | ----------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `samples`         | `DocCodeSample[]` | `[]`    | false    | The samples, in tab order: `{ label?, language?, fileName?, code }`. One renders a plain block, several render a joined tab strip; none renders nothing. |
| `showLineNumbers` | `boolean`         | `false` | false    | Shows the line-number gutter.                                                                                                                            |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: from `CodeBlock` (tab selection, copied).
- `data-doc-block` and `data-doc-chrome` put it on the block rung and stop prose rules at its edge.

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
| ------ | ----------------- |
| all    | From `CodeBlock`. |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Tabs, copy button and announcements come from `CodeBlock`.
- A tab label falls back to the language, then to the sample position.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: code stays left-to-right inside `CodeBlock`; the strip follows the page direction.
- Keyboard: unchanged.

## Responsive

- Long lines scroll inside the block, never the page.

## Performance

- Bundle budget: 27 KB gzip for `./doc-code-group` in `.size-limit.json` (CodeBlock included).

## Examples

- Default — one sample.
- Group — three package managers.

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
