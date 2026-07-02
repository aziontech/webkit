---
name: log-view
category: code
structure: composition
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
  node_id: 3950:34695
checksum: 49751f0a321eef939f1f251f761e293808202bfa2b51abdbff3ec61d05d3f251
created: 2026-05-26
last_updated: 2026-07-01
---

# Log View — Component Spec

## Purpose

Composition-based terminal log viewer for CI/deploy output. **LogView** is the root shell and context provider; **LogViewHeader**, **LogViewContent**, and **LogViewFooter** are composed as children so teams can reorder, omit, or replace the toolbar and footer without forking the log renderer.

## Usage

```vue
<script setup>
import LogView from '@aziontech/webkit/log-view'
import LogViewHeader from '@aziontech/webkit/log-view-header'
import LogViewContent from '@aziontech/webkit/log-view-content'

const lines = [
  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
  { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
  { id: '3', time: '13:47:42', type: 'warning', message: 'Bundle larger than recommended' }
]
const search = ''
const warningsOnly = false
</script>

<template>
  <LogView :lines="lines" v-model:search="search" v-model:warnings-only="warningsOnly">
    <LogViewHeader />
    <LogViewContent />
  </LogView>
</template>
```

## Sub-components

LogView ships flat, individually importable sub-components (each from its own `@aziontech/webkit/log-view-*` entry); every sub-component reads the root's shared state through the injected context, so the consumer wires nothing.

- `log-view-header.vue` — Default 48px toolbar: line count, warning filter, and a search field. Slots: `left`, `right`, `search`.
- `log-view-content.vue` — Scrollable log body with per-`type` line rendering, search highlighting, a bottom scroll fade, and the copy-to-clipboard control (a `CopyButton` pinned top-right over the log content, shown when `showCopy` is set). When `loading` is set, it replaces the log body with a centered `Spinner` (`@aziontech/webkit/spinner`) and the `loadingLabel` text (`role="status"`). Slot: `empty`.
- `log-view-footer.vue` — Optional footer region for actions (download, follow live, pagination). Slot: `default`.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `lines` | `LogViewLine[]` | `[]` | no | Log entries; filtered in LogViewContent by search and warnings-only. |
| `searchPlaceholder` | `string` | `'Find in Logs'` | no | Placeholder for the default header search field. |
| `showCopy` | `boolean` | `true` | no | Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent). |
| `disabled` | `boolean` | `false` | no | Disables toolbar controls in LogViewHeader. |
| `loading` | `boolean` | `false` | no | Replaces the LogViewContent log body with a centered spinner and label. |
| `loadingLabel` | `string` | `'Loading...'` | no | Label shown beneath the spinner while `loading`. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model:search` | `string` | `''` | `update:search` | Two-way search query; filters LogViewContent and highlights matches. |
| `v-model:warnings-only` | `boolean` | `false` | `update:warningsOnly` | When true, shows only lines whose `type` is `warning`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `copy` | `string` | Fires after a successful copy; payload is the copied plain text. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Sub-components (LogViewHeader, LogViewContent, LogViewFooter) composed in the desired order. |

## Data types

`LogViewLine` (exported from `injection-key.ts`):

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable row key. |
| `time` | `string` | Timestamp label. |
| `type` | `'text' \| 'folder' \| 'framework-version' \| 'success' \| 'warning'` | Log line variant. |
| `message` | `string` | Primary log text. |
| `folderType` | `string` | Optional filename highlight for `folder`. |
| `size` | `string` | Optional raw size for `folder`. |
| `gzipSize` | `string` | Optional gzip size for `folder`. |
| `suffix` | `string` | Optional highlight for `framework-version`. |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`, `loading`
- `data-disabled` / `data-warnings-only` / `data-loading` on the LogView root
- `loading` state: LogViewContent renders a centered spinner + `loadingLabel` in place of the log body
- Log line `data-type` reflects `line.type`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| log line hover (LogViewContent) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| bottom scroll fade (LogViewContent) | `transition-opacity duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (header label) | `.text-label-sm` |
| typography (log lines) | `.text-label-sm` |
| surface (header/footer) | `var(--bg-surface)` |
| surface (log canvas) | `var(--bg-canvas)` |
| surface (line hover) | `var(--bg-surface-raised)` |
| text (default line) | `var(--text-default)` |
| text (timestamp) | `var(--text-muted)` |
| text (warning line) | `var(--warning-contrast)` |
| text (success line) | `var(--success-contrast)` |
| border | `var(--border-muted)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | `font-code` on log rows | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus on the interactive controls in the header/footer.
- LogViewContent uses `role="log"` with `aria-live="polite"`.
- The warning filter exposes `aria-pressed`; the copy control (a CopyButton in LogViewContent) uses `aria-label="Copy logs"` at rest, switching to `"Copied logs"` after a successful copy.
- The loading state uses `role="status"` with `aria-live="polite"`; the spinner is `aria-hidden` (from the Spinner component) and the `loadingLabel` text conveys status.
- `motion-reduce:transition-none` on every motion-bearing class.
- Touch target: the warning control is ≥40×40 px; the copy control uses CopyButton `size="small"` (28×28 px) to match CodeBlock — a justified deviation for the compact overlay.

## Stories (Storybook)

- Default — composed LogViewHeader + LogViewContent over a realistic deploy log; search filters lines and highlights matches.
- Loading — LogView with `loading` set; LogViewContent shows the centered spinner + label.

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
