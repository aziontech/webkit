---
name: priority-tag
category: content
structure: monolithic
status: approved
stability: preview
spec_version: 1
template: 2
checksum: 4a4bbde7fd1c513eefee8d8bd7aaacef4fd2cdecddb2aec2d7bc7dfe9c297228
created: 2026-11-23
last_updated: 2026-11-23
---

# PriorityTag — Component Spec

## Purpose

Use PriorityTag only for the priority of a ticket, task or request on the urgent → low scale, or for "no priority"; the severity of a finding or alert is a SeverityTag, and the state of a ticket is a StatusIndicator or a Tag.

PriorityTag labels a work item with how soon it should be handled: urgent, high, medium, low or none. The level reads from a three-bar signal glyph (the filled bars count the level), from a distinct alert mark for urgent, from three flat dashes for none, and from the label, so no level depends on colour alone. Its accessible name always says the axis ("Priority: High"), which is why it is its own component and not a SeverityTag (decision SUP-05).

## When to use

- Show how urgent a support ticket, task, issue or request is, in a ticket list row, a table cell, a board card or a ticket detail header.
- Rank work on the fixed urgent, high, medium, low scale used by help desks and issue trackers, with "no priority" for items nobody has triaged yet.

## When NOT to use

- The value is how severe a finding, alert, incident or vulnerability is → use `severity-tag`.
- The value is the state of the ticket (open, pending, solved) → use `status-indicator` or `tag`.
- The user picks or changes the priority (a priority field or filter) → use `select` or `chip`; show the chosen value with this tag elsewhere.
- The value is a count on an icon or avatar → use `badge`.

## Related

- `severity-tag` — the same frame and bar glyph for the critical → info findings scale; its accessible name is the level alone.
- `tag` — a toned status or category label with no order between values.
- `status-indicator` — the live state of a resource or ticket.
- `chip` — an interactive or removable token, for priority filters.

## Best practices

- Keep the default label (the level name from the locale catalog, translated under `ConfigProvider`); override `label` only when the product glossary names a level differently (`Normal` for medium).
- Show `none` for an untriaged item instead of leaving the cell empty, so the column reads the same on every row.
- Use one PriorityTag per row, in its own column, so the glyphs line up and the scale reads down the column.
- Do not add a toned `tag` beside it for the same level; the glyph and the label already carry it.

## Usage

```vue
<script setup>
  import PriorityTag from '@aziontech/webkit/priority-tag'
</script>

<template>
  <PriorityTag
    priority="high"
    size="medium"
  />
</template>
```

## Props

| Prop       | Type                                                | Default    | Required | JSDoc                                                                                                                         |
| ---------- | --------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `priority` | `'urgent' \| 'high' \| 'medium' \| 'low' \| 'none'` | `'none'`   | false    | Priority level (exported as `PriorityTagPriority`); sets the glyph (alert mark, filled bars or dashes) and the default label. |
| `label`    | `string`                                            | `''`       | false    | Text of the tag. Empty uses the locale catalog (`Urgent`, `High`, `Medium`, `Low`, `No priority`).                            |
| `size`     | `'small' \| 'medium'`                               | `'medium'` | false    | Size token; `medium` is 24px tall, `small` is 20px.                                                                           |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                   |
| --------- | ----- | ----------------------------------------------------------------------- |
| `default` | —     | Replaces the visible label text; the hidden `Priority:` prefix remains. |

## States

- Visual states: `default` (static, non-interactive)
- `data-priority` mirrors the `priority` prop: `urgent` | `high` | `medium` | `low` | `none`
- `data-size` mirrors the `size` prop: `small` | `medium`
- Glyph per level: urgent the `az-circle-alert` mark; high 3 filled bars of 3; medium 2; low 1; none three flat dashes
- `none` ("No priority", three dashes) is the empty, untriaged value: the tag never renders blank
- Loading, error, disabled, readonly and invalid do not apply: the tag is static and non-interactive (a loading row shows a `skeleton` in its place)

## Motion & Animations

_none_

## Tokens

| Region                  | Token (DESIGN.md)                                                 |
| ----------------------- | ----------------------------------------------------------------- |
| typography (both sizes) | `.text-label-sm` (the urgent icon inherits it)                    |
| surface                 | `var(--bg-canvas)`                                                |
| border                  | `var(--border-default)`                                           |
| text                    | `var(--text-default)`                                             |
| spacing (medium)        | `var(--spacing-xs)` horizontal padding and glyph gap              |
| spacing (small)         | `var(--spacing-2xs)` horizontal padding and glyph gap             |
| shape                   | `var(--shape-control)`                                            |
| glyph bar (filled)      | `var(--text-default)`                                             |
| glyph bar (empty)       | `var(--border-default)`                                           |
| glyph dashes (none)     | `var(--text-muted)`                                               |
| urgent mark             | `var(--danger-mark)` (a status icon standing on a surface, OI-02) |

The border width is the theme's default border width, the same utility SeverityTag uses. The `--severity-*` ramp is not used: it belongs to the severity scale only (`rules/webkit-tokens.md`).

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: not focusable; the tag is static text and takes no `tabindex`.
- Keyboard map: none; the tag has no interaction.
- ARIA: the glyph is `aria-hidden="true"`; a visually hidden prefix (`sr-only`, locale key `priorityTag.prefix`, `Priority:`) sits before the label, so the text a screen reader reads is "Priority: High". No `role` or `aria-label` on the root (a generic element takes no name); the hidden prefix stays when the default slot replaces the label.
- Contrast: label `var(--text-default)` on `var(--bg-canvas)` ≥4.5:1; filled bars `var(--text-default)` and the urgent mark `var(--danger-mark)` meet the mark and icon targets (Lc 30 / Lc 45, WCAG ≥3:1) in both themes; only documented token pairs (`rules/webkit-tokens.md` § Contrast).
- Never colour only: every level differs by glyph shape and by text.
- No motion, so no `motion-reduce:*` fallback is needed.
- Touch target: not applicable; the tag is not interactive.

## Internationalization

| Key                  | English source | Override prop          |
| -------------------- | -------------- | ---------------------- |
| `priorityTag.prefix` | `Priority:`    | —                      |
| `priorityTag.urgent` | `Urgent`       | `label` / default slot |
| `priorityTag.high`   | `High`         | `label` / default slot |
| `priorityTag.medium` | `Medium`       | `label` / default slot |
| `priorityTag.low`    | `Low`          | `label` / default slot |
| `priorityTag.none`   | `No priority`  | `label` / default slot |

- Formatting: none
- The accessible name is the prefix followed by the label (`Priority: High`). Translators get the prefix alone, with its colon (`Prioridade:`, `Prioridad:`); a language whose order is "level then axis" is a follow-up that would move to one placeholder key.

## Right-to-left

- Layout: logical utilities only (`px-`, `gap-`); the glyph sits at the inline start and moves to the right under `dir="rtl"`.
- Icons: the bars are a flex row in the inline direction, so they rise from the inline start and mirror under `dir="rtl"` (rising right to left), the same as SeverityTag; nothing extra is set. `az-circle-alert` is not directional and is not in `DIRECTIONAL_ICONS`.
- Keyboard: none.
- User data: none (a custom `label` is short product text; no `<bdi>` needed).

## Responsive

- Container queries: none: fixed size.
- Narrow (≤ 640 px or a narrow container): the tag never wraps (`whitespace-nowrap`); the cell around it truncates or wraps rows.
- Touch: not interactive, no target.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the tag is at most about 110 px wide in English.

## Performance

- Bundle budget: 1.85 KB gzip for `./priority-tag` (the `.size-limit.json` entry; the same ceiling as SeverityTag).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — one tag driven by the controls, file `default.vue`.
- Priorities — composite example rendering every `priority` value side by side, from urgent to none (`priorities.vue`; the axis is `priority`, so it replaces Variants).
- Sizes — composite example rendering both `size` values for one level (`sizes.vue`).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
