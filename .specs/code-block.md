---
name: code-block
category: data
structure: monolithic
status: implemented
spec_version: 4
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761
  node_id: 4567:33761
checksum: d6468c8f3aadfd54ee13d5ca4a436d1eb9c24a419b85cf539c2dd8a587907889
created: 2026-05-28
last_updated: 2026-07-01
---


# CodeBlock — Component Spec

## Purpose

Read-only code viewer for docs, API examples, and configuration previews. Supports four Figma-documented layouts that share one monolithic shell:

1. **Language switcher** ([4567:33761](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761)) — tabbed snippets with an animated underline, optional filename bar, syntax highlighting, and copy.
2. **Show filename** ([4567:30198](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-30198)) — single snippet with a raised filename bar (language icon + name), no tabs.
3. **Diff** ([4567:29012](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-29012)) — per-line added/removed markers (`+`/`-`), semantic row backgrounds, and a 2 px leading bar; no tabs or filename bar.
4. **Highlighted line** ([4567:31473](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-31473)) — one active line with info background and leading bar; no tabs or filename bar.

Regions render conditionally from tab data — the consumer does not pick a separate `kind`. Tab header appears when `tabs.length > 1`. Filename bar appears when the active tab sets `fileName`. Diff and highlight decorations come from `lineChanges` and `highlightedLine` on the active tab.

## Usage

Pass source on each tab’s **`code`** field inside **`tabs`**. There is no top-level `code` prop.

```vue
<script setup>
import CodeBlock from '@aziontech/webkit/code-block'

const code = `export default {
  async fetch(request) {
    return new Response('OK')
  }
}`

const tabs = [
  {
    label: 'JavaScript',
    value: 'js',
    language: 'javascript',
    fileName: 'handler.js',
    code
  }
]
</script>

<template>
  <CodeBlock :tabs="tabs" default-value="js" show-line-numbers />
</template>
```

For multiple languages, add one tab per snippet (each with its own `code`). Use `v-model:value` to control the active tab. Replace `tabs[n].code` or rebuild `tabs` when the source should update reactively.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `tabs` | `CodeBlockTab[]` | `[]` | no | Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata. |
| `value` | `string` | `undefined` | no | Controlled active tab value (`v-model:value`). |
| `defaultValue` | `string` | `undefined` | no | Initial active tab when uncontrolled. |
| `showLineNumbers` | `boolean` | `true` | no | Shows a fixed-width gutter with zero-padded line numbers before each code line. |
| `copyAriaLabel` | `string` | `'Copy code'` | no | Accessible name for the copy control (forwarded to CopyButton's aria-label). |
| `animateLines` | `boolean` | `false` | no | Staggered line entrance for website layouts: each line slides from `-8px` with opacity `0 → 1`, `300ms` apart. |

## Type shapes

### `CodeBlockTab`

| Field | Type | Required | Notes |
|---|---|---|---|
| `label` | `string` | yes | Tab label (uppercase in UI via `.text-overline-sm`). |
| `value` | `string` | yes | Stable tab id for `v-model:value`. |
| `code` | `string` | yes | Raw source; split on `\n` for rendering. |
| `language` | `string` | no | Drives syntax highlighting and default file icon when `fileIcon` is omitted. |
| `fileName` | `string` | no | When set on the active tab, renders the 40 px filename bar below the tab header (or as the top region when tabs are hidden). |
| `fileIcon` | `string` | no | Icon name for the filename bar (PrimeIcons class, e.g. `'pi pi-file'`). Falls back to a language-derived icon when omitted. |
| `highlightedLine` | `number` | no | 1-based line index. Applies info background + leading bar on that row (Figma: Highlighted). |
| `lineChanges` | `CodeBlockLineChange[]` | no | Per-line diff metadata. When non-empty, renders diff gutter markers and row backgrounds (Figma: Diff). |

### `CodeBlockLineChange`

| Field | Type | Required | Notes |
|---|---|---|---|
| `line` | `number` | yes | 1-based line index. |
| `change` | `'added' \| 'removed'` | yes | `added` → success row + `+` marker; `removed` → danger row + `-` marker. |

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
- `data-state` on code lines: `default` | `added` | `removed` | `highlighted`
- `data-disabled` not used (tabs are not disabled in v2)

### Layout rules (derived from Figma)

| Region | Visible when |
|---|---|
| Tab header (`CodeBlockHeader`, 48 px tab height) | `tabs.length > 1` |
| Filename bar (`FileName`, 40 px) | active tab has `fileName` |
| Diff gutter (`+`/`-` + 8 px spacer on unchanged lines) | active tab `lineChanges.length > 0` |
| Line highlight (info background + 2 px leading bar) | active tab `highlightedLine` is set |

When only one tab is provided and it has no `fileName`, the shell is code content + copy only (minimal block).

Code content scrolls inside `@aziontech/webkit/layout/scroll-area` (`orientation="both"`, 320 px height). Lines never wrap (`whitespace-pre`); on narrow viewports the scroll region grows horizontally so long lines stay on one row. The copy control (a `CopyButton`, `kind="outlined"` `size="small"`) is absolutely positioned on the non-scrolling content shell (`__content`) so it stays pinned top-right while lines scroll.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| tab change (indicator) | sliding underline via `transform` / `width` transition | `duration-moderate-02` · `ease-productive-entrance` (DESIGN.md § Motion primitives) | `motion-reduce:transition-none` |
| tab panel change | content slide + opacity | `duration-moderate-02` · `ease-productive-entrance` (DESIGN.md § Motion primitives) | `motion-reduce:transform-none motion-reduce:transition-none` |
| tab label hover | `transition-colors duration-fast-02 ease-productive-entrance` | `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| code line hover | `transition-opacity duration-fast-02 ease-productive-entrance` on row ghost layer (`--bg-hover`) | `duration-fast-02` · `ease-productive-entrance` (DESIGN.md § Interactive states) | `motion-reduce:transition-none` |
| line entrance (`animateLines`) | per-line slide from `-8px` + opacity, staggered `300ms` | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| tab typography | `.text-overline-sm` |
| filename typography | `.text-label-code-sm` |
| code typography | `.text-label-code-sm` |
| shell surface | `var(--bg-surface)` |
| filename bar surface | `var(--bg-surface-raised)` |
| border | `var(--border-default)` |
| tab indicator | `var(--border-selected)` |
| text default / muted | `var(--text-default)` / `var(--text-muted)` |
| spacing | `var(--spacing-xxs)` / `var(--spacing-xs)` / `var(--spacing-sm)` / `var(--spacing-lg)` |
| shape | `var(--shape-elements)` / `var(--shape-button)` |
| ring | `var(--ring-color)` |
| syntax keyword | `var(--code-sintax-keyword)` |
| syntax string | `var(--code-sintax-string)` |
| syntax function | `var(--code-sintax-function)` |
| syntax type | `var(--code-sintax-type)` |
| syntax punctuation | `var(--code-sintax-punctuation)` |
| syntax identifier | `var(--code-sintax-identifier)` |
| syntax line number | `var(--code-sintax-line-number)` |
| diff removed row | `var(--danger)` |
| diff removed leading bar | `var(--danger-border)` |
| diff removed marker | `var(--danger-contrast)` |
| diff added row | `var(--success)` |
| diff added leading bar | `var(--success-border)` |
| diff added marker | `var(--success-contrast)` |
| highlighted row | `var(--info)` |
| highlighted leading bar | `var(--info-border)` |

## Theme gaps

| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses tabs and copy; `ArrowLeft`/`ArrowRight`/`Home`/`End` move between tabs; `Enter`/`Space` activates tab; copy uses `Enter`/`Space` on the CopyButton (native `<button>`); when focus is in the code scroll region, `ArrowUp`/`ArrowDown`/`PageUp`/`PageDown`/`Home`/`End` scroll vertically and `ArrowLeft`/`ArrowRight` scroll horizontally via ScrollArea.
- ARIA: tab list uses `role="tablist"` when visible; tabs use `role="tab"` with `aria-selected`; panel uses `role="tabpanel"` with `aria-labelledby`; copy uses CopyButton `ariaLabel` (forwarded to its inner IconButton); diff `+`/`-` markers are `aria-hidden="true"` (change semantics conveyed by row `data-state` and visible background).
- Contrast ≥4.5:1 for code text on surface, including syntax token colors and diff/highlight row backgrounds in light and dark.
- `motion-reduce:transition-none motion-reduce:transform-none` on indicator and panel motion.
- When `animateLines` is enabled, line motion is disabled under `prefers-reduced-motion` (lines render fully visible immediately).
- Copy control uses CopyButton `size="small"` (28×28 px).

## Stories (Storybook)

- Default — language switcher: two tabs, `fileName` on each tab, JavaScript sample, copy affordance (Figma: Language Switcher).
- WithoutLineNumbers — same Default sample with `showLineNumbers={false}`.
- WithFileName — single tab with `fileName` and no tab header (Figma: Show filename).
- WithDiff — single tab with `lineChanges` for added/removed rows (Figma: Diff).
- WithHighlightedLine — single tab with `highlightedLine={6}` (Figma: Highlighted).
- WithAnimatedLines — single tab with `animateLines={true}` for staggered website entrance.

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
