---
name: code-editor
category: data
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4177-15489
  node_id: 4177:15489
checksum: d4a6b37ffcafe4d4da021d0c43cfff23f39f1c2719275bc0bf50e9db033d9500
created: 2026-05-28
last_updated: 2026-05-28
---

# CodeEditor — Component Spec

## Purpose

Read-only code viewer with tabbed snippets, syntax highlighting using theme code tokens, an animated tab indicator, and a copy action. Use in docs, API examples, and configuration previews where users switch between related code samples.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import CodeEditor from '@aziontech/webkit/data/code-editor'

const activeTab = ref('js')

const tabs = [
  {
    label: 'JavaScript',
    value: 'js',
    language: 'javascript',
    code: "export default {\n  async fetch(request) {\n    return new Response('OK')\n  }\n}"
  },
  {
    label: 'TypeScript',
    value: 'ts',
    language: 'typescript',
    code: "export default {\n  async fetch(request: Request): Promise<Response> {\n    return new Response('OK')\n  }\n}"
  }
]
</script>

<template>
  <CodeEditor v-model:value="activeTab" :tabs="tabs" show-line-numbers />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `tabs` | `CodeEditorTab[]` | `[]` | no | Tab definitions with label, value, code, and optional language for highlighting. |
| `value` | `string` | `undefined` | no | Controlled active tab value (`v-model:value`). |
| `defaultValue` | `string` | `undefined` | no | Initial active tab when uncontrolled. |
| `showLineNumbers` | `boolean` | `true` | no | Shows a fixed-width gutter with line numbers before each code line. |
| `copyAriaLabel` | `string` | `'Copy code'` | no | Accessible name for the copy IconButton. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:value` | `string` | v-model:value. |
| `value-change` | `string` | Fires when the active tab changes. |
| `copy` | `string` | Fires after the active tab code is copied to the clipboard. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible` on tabs and copy control
- `data-state` on tabs: `active` | `inactive`
- `data-disabled` not used (tabs are not disabled in v1)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| tab change (indicator) | sliding underline via `transform` / `width` transition | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| tab panel change | content slide + opacity | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transform-none motion-reduce:transition-none` |
| tab label hover | `transition-colors duration-fast-02 ease-productive-entrance` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| tab typography | `.text-overline-sm` |
| code typography | `.text-label-code-sm` |
| surface | `var(--bg-surface)` |
| border | `var(--border-default)` |
| tab indicator | `var(--border-selected)` |
| text default / muted | `var(--text-default)` / `var(--text-muted)` |
| spacing | `var(--spacing-xs)` / `var(--spacing-sm)` |
| shape | `var(--shape-elements)` / `var(--shape-button)` |
| ring | `var(--ring-color)` |
| syntax keyword | `var(--code-sintax-keyword)` |
| syntax string | `var(--code-sintax-string)` |
| syntax function | `var(--code-sintax-function)` |
| syntax type | `var(--code-sintax-type)` |
| syntax punctuation | `var(--code-sintax-punctuation)` |
| syntax identifier | `var(--code-sintax-identifier)` |
| syntax line number | `var(--code-sintax-line-number)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses tabs and copy; `ArrowLeft`/`ArrowRight`/`Home`/`End` move between tabs; `Enter`/`Space` activates tab; copy uses `Enter`/`Space` on IconButton.
- ARIA: tab list uses `role="tablist"`; tabs use `role="tab"` with `aria-selected`; panel uses `role="tabpanel"` with `aria-labelledby`; copy uses IconButton `ariaLabel`.
- Contrast ≥4.5:1 for code text on surface, including syntax token colors in light and dark.
- `motion-reduce:transition-none motion-reduce:transform-none` on indicator and panel motion.
- Copy control uses IconButton `size="small"` (32×32 px) per Figma.

## Stories (Storybook)

- Default — multiple tabs with JavaScript sample code and copy affordance.
- WithoutLineNumbers — same sample with `showLineNumbers={false}` to demonstrate the gutter toggle.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
