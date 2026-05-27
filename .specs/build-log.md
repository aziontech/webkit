---
name: build-log
category: code
structure: composition
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
  node_id: 3950:34695
created: 2026-05-26
last_updated: 2026-05-26
checksum: 56087e49a0eb85e25a55fd2ce264ab2a259a2880901cb4a174e554d021eaa976

---

# Build Log — Component Spec

## Purpose

Composition-based terminal log viewer for CI/deploy output. **BuildLog** is the root shell and context provider; **BuildLogHeader**, **BuildLogContent**, and **BuildLogFooter** can be reordered, omitted, or replaced so teams can customize the toolbar and add footer actions without forking the log renderer.

## Sub-components

- `build-log.vue` — Root shell, shared state (lines, warnings filter), `provide` context.
- `build-log-header.vue` — Default toolbar: copy, line count, warning filter, optional search slot (Figma LogHeader).
- `build-log-content.vue` — Scrollable log body, line variants, bottom scroll fade.
- `build-log-footer.vue` — Optional footer region for actions (download, follow live, pagination).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `lines` | `BuildLogLine[]` | `[]` | no | Log entries (filtered in content by warnings-only). |
| `warningsOnly` | `boolean` | `false` | no | When true, shows only `warning` lines. |
| `showCopy` | `boolean` | `true` | no | Shows copy control in BuildLogHeader. |
| `disabled` | `boolean` | `false` | no | Disables header toolbar controls. |

`BuildLogLine` (exported from `injection-key.ts`):

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable row key. |
| `time` | `string` | Timestamp label. |
| `type` | `'text' \| 'folder' \| 'framework-version' \| 'success' \| 'warning'` | Figma LogLine variant. |
| `message` | `string` | Primary log text. |
| `folderType` | `string` | Optional filename highlight for `folder`. |
| `size` | `string` | Optional raw size for `folder`. |
| `gzipSize` | `string` | Optional gzip size for `folder`. |
| `suffix` | `string` | Optional highlight for `framework-version`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:warningsOnly` | `boolean` | v-model:warnings-only. |
| `copy` | `string` | Fires after copy; payload is copied plain text. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Sub-components (BuildLogHeader, BuildLogContent, BuildLogFooter) in desired order. |
| `empty` | — | On BuildLogContent when no lines match filters. |

### BuildLogHeader slots

| Slot | Scope | Notes |
|---|---|---|
| `left` | — | Replaces default left cluster (copy + line count). |
| `right` | — | Replaces default right cluster (warning filter + search region). |
| `search` | — | Optional search control; renders nothing when unset. |

### BuildLogFooter slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Footer actions and metadata. |

## States

- Visual states: `default`, `hover` (per log line), `focus-visible`, `disabled`
- `data-disabled` / `data-warnings-only` on BuildLog root
- Log line `data-type` reflects `line.type`

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| line hover | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| bottom fade | `transition-opacity duration-150 ease-out` | inline | `motion-reduce:transition-none` |

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
| spacing | `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-xxs)`, `var(--spacing-xl)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | `font-code` on log rows | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus on interactive controls in header/footer.
- BuildLogContent: `role="log"`, `aria-live="polite"`.
- Warning filter: `aria-pressed`; copy: `aria-label="Copy logs"`.
- `motion-reduce:transition-none` on motion-bearing classes.

## Stories (Storybook)

- Default (composed: Header + Content)

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
