---
name: item
category: content
structure: composition
status: implemented
spec_version: 2
created: 2026-05-24
last_updated: 2026-05-24
checksum: 1b0f3505f9280bff926913b6b7e9865f443dea19cb89c4362ec6b1e669633b69
---
# Item — Component Spec

## Purpose

Versatile flex row for title, description, media, and actions. Mirrors the shadcn-vue Item anatomy so consumers can reorder or omit regions. Compose with `ItemGroup` for lists and `ItemSeparator` between rows. Reference: https://www.shadcn-vue.com/docs/components/item (adapted to Webkit tokens and naming).

## Sub-components

- `item.vue` — Root row container (`kind`, `size`).
- `item-group.vue` — Vertical list wrapper (`role="list"`).
- `item-separator.vue` — Horizontal divider between rows in a group.
- `item-media.vue` — Leading media slot (`kind` for icon/image frames).
- `item-content.vue` — Main text column (title + description).
- `item-title.vue` — Primary label line.
- `item-description.vue` — Secondary muted line.
- `item-actions.vue` — Trailing actions cluster.
- `item-header.vue` — Optional top band (e.g. cover image).
- `item-footer.vue` — Optional bottom band.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'default' \| 'outline' \| 'muted'` | `'default'` | no | Item root surface variant. |
| `size` | `'small' \| 'medium'` | `'medium'` | no | Item root density (padding and gap). |
| `asChild` | `boolean` | `false` | no | Merge row layout and interactive-state classes onto the single default-slot child (e.g. anchor). |
| `kind` | `'default' \| 'icon' \| 'image'` | `'default'` | no | ItemMedia region variant (icon frame, image frame). |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Every sub-component exposes `default` for its region. |

## States

- Visual states on Item shell: `default` only (no row-level hover, active, or focus)
- Slotted controls (`Button`, `a`, etc.) own hover, active, and `focus-visible`
- `data-kind` on Item root: `default` | `outline` | `muted`
- `data-size` on Item root: `small` | `medium`
- `data-kind` on ItemMedia: `default` | `icon` | `image`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| title typography | `.text-body-sm` |
| description typography | `.text-body-sm` |
| surface (default) | `var(--bg-surface)` |
| surface (muted kind) | `var(--bg-mask)` |
| text | `var(--text-default)` |
| text muted | `var(--text-muted)` |
| border | `var(--border-default)` |
| spacing gap (medium) | `var(--spacing-4)` |
| spacing gap (small) | `var(--spacing-2)` |
| padding (medium) | `var(--spacing-4)` |
| padding (small) | `var(--spacing-3)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: on slotted links and buttons only (Item shell does not draw a focus ring).
- Keyboard map: slotted links and buttons supply Tab order; use `asChild` to merge layout onto a single focusable child when the whole row is a link.
- ARIA: `ItemGroup` uses `role="list"`; consumers may set `role="listitem"` on Item when inside a list; `ItemSeparator` uses `role="separator"`.
- Contrast ≥4.5:1 for title and description text.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px on slotted actions (owned by children).

## Stories (Storybook)

- Default
- Outline
- Muted
- Small
- WithIconMedia — `ItemMedia` with `kind="icon"` and a leading icon (security-style row).
- WithAvatar — `ItemMedia` wrapping `Avatar` for profile list rows.
- WithImageMedia — `ItemMedia` with `kind="image"` and a thumbnail image.
- WithGroup — `ItemGroup` with multiple items, avatars, actions, and `ItemSeparator` between rows.
- WithAsChild — `asChild` on `Item` wrapping an anchor; row layout merges onto the link; focus stays on the anchor.

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
