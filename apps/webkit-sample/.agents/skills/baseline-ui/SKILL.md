---
name: baseline-ui
description: Fast deslop pass for UI built on @aziontech/webkit — enforce components-only, tokens-only (typography/color/shape/spacing/shadow), correct typography hierarchy, and consistent spacing rhythm. Use for a quick cleanup or polish review.
status: active
last_updated: 2026-06-29
---

# Skill: baseline-ui

## Purpose

Remove AI-generated UI slop from product code built on `@aziontech/webkit`. This is the opinionated
baseline: real components, real tokens, real typography hierarchy, real spacing rhythm — nothing
hand-rolled, nothing hardcoded.

## How to use

- `/baseline-ui`
  Apply the constraints below to any UI work in this conversation.
- `/baseline-ui <file>`
  Review the file against every constraint and output, per violation:
  - the exact line / snippet (quoted),
  - why it matters (1 short sentence),
  - a concrete code-level fix.

## When to invoke

- The user asks to "clean up", "deslop", "polish", or "review" a screen / prototype.
- Before shipping any UI composed on top of webkit.
- After scaffolding a screen quickly and wanting a correctness sweep.

## Constraints

### Components

- **MUST** compose from `@aziontech/webkit` whenever a primitive exists. Import via the canonical path
  in `packages/webkit/package.json#exports` (e.g. `@aziontech/webkit/button`,
  `@aziontech/webkit/input-text`, `@aziontech/webkit/dialog`, `@aziontech/webkit/dropdown-menu`).
- **NEVER** hand-roll a `<button>`, input, modal, tooltip, dropdown, or tabs that webkit ships.
- **NEVER** mix another component library's primitives onto the same surface.
- **MUST** use `@aziontech/webkit/icon-button` with an `aria-label` for icon-only actions.
- **MUST** use `@aziontech/webkit/utils/cn` (clsx + tailwind-merge) for any class composition.

### Color — tokens only

- **MUST** use `@aziontech/theme` semantic vars: `bg-[var(--bg-surface)]`, `text-[var(--text-default)]`,
  `text-[var(--text-muted)]`, `bg-[var(--primary)]`, `text-[var(--primary-contrast)]`,
  `border-[var(--border-default)]`, `ring-[var(--ring-color)]`, feedback `var(--success|--warning|--danger|--info)`.
- **NEVER** HEX (`#0af`), `rgb()/rgba()/hsl()`, or Tailwind palette names (`bg-blue-500`, `text-gray-700`).
- **SHOULD** limit accent color to one per view; the rest carries on surface + text + border tokens.

### Typography — tokens + hierarchy (non-negotiable)

- **MUST** use only `text-*` classes from `texts.data.js`: `text-heading-2xl … text-heading-sm`,
  `text-body-lg … text-body-xxs`, `text-label-sm/md/lg`, `text-overline-xs/sm/md`,
  `text-button-md/lg`, `text-link`, `text-big-number-*`.
- **NEVER** raw `text-xs/sm/base/lg`, `leading-*` (except `leading-none` on an icon set to
  `text-[length:inherit]`), or `tracking-*` overrides — line-height and tracking are baked into the token.
- **NEVER** make a heading visually smaller than a label. Respect the order
  `text-heading-* > text-body-* > text-label-* > text-overline-*`, and don't skip levels arbitrarily.
- **MUST** use `text-balance` on headings and `text-pretty` on body/paragraph copy.
- **MUST** use `tabular-nums` for numeric / data columns.

### Shape & elevation — tokens only

- **MUST** use `rounded-[var(--shape-button)]` (buttons), `rounded-[var(--shape-elements)]` (inputs,
  chips), `rounded-[var(--shape-card)]` (cards), `rounded-[var(--shape-flat)]` (none).
- **NEVER** `rounded-md/lg` or a numeric radius.
- **MUST** use `shadow-[var(--shadow-*)]` for elevation (`--shadow-sm` cards, `--shadow-md` overlays);
  never a bare Tailwind `shadow-md` or a hardcoded `box-shadow`.

### Spacing rhythm — one scale

- **MUST** use only `--spacing-xxs … --spacing-xxl` for padding, gap, and margin:
  `p-[var(--spacing-md)]`, `gap-[var(--spacing-sm)]`, `mt-[var(--spacing-xs)]`.
- **NEVER** arbitrary values (`p-[13px]`, `gap-[7px]`), Tailwind's default scale (`p-4`, `gap-3`), or
  the primitive `--spacing-1 … --spacing-96`.
- **SHOULD** keep one consistent step between sibling elements; don't alternate `--spacing-xs` and
  `--spacing-md` between rows of the same list.

### Layout

- **NEVER** `h-screen` — use `h-dvh`.
- **MUST** respect `safe-area-inset` (`env(safe-area-inset-*)`) for fixed / sticky elements.
- **SHOULD** use `size-*` for square elements instead of `w-* + h-*`.
- **SHOULD** drive variant styling from `data-*` attributes (per [`styling.md`](../../rules/styling.md)),
  not from JS class-preset objects.

### Width & containers — fluid-first shell, cap only reading width

The default is **fluid**: content fills the space the shell gives it. A container
(`max-w-[var(--container-*)]`) is the exception, applied only where unbounded width hurts legibility or
balance. Reach for it in this order.

- **MUST** keep the **app shell fluid-first** — never cap it with a container. The **sidebar**, the
  **global header**, the **page heading**, and the **main content spacing** (the content zone's
  `p-[var(--spacing-*)]` inset) all stay full-width and stretch with the viewport. These are chrome; a
  max-width on them only creates dead gutters.
- **MUST** cap **reading / input width** with `max-w-[var(--container-2xs … xl)]`: form fields, text
  columns, focused auth/save cards, fixed side rails. Pick the tight end (`2xs … sm`) for compact
  settings rows and the loose end (up to `xl`, 576px) for an ItemGroup control column that must fit a
  longer value — see [`/form`](../form/SKILL.md). A form input that spans a 2560px screen is a
  legibility bug, not a feature.
- **MUST** give **focused create/edit flows** a centered page container — `mx-auto
  max-w-[var(--container-7xl)]` on the flow's content wrapper — so the column sits centered instead of
  drifting to the left edge on wide screens. This is the one place the *page section* (not just a field)
  is capped.
- **SHOULD** keep **data-dense surfaces fluid** — tables, dashboards, log/grid views breathe to the full
  content width; don't box them into a narrow container.
- **MUST** express every cap as `max-w-[var(--container-<size>)]` (`3xs … 7xl`, from
  `primitives/shape/container.js`). **NEVER** a raw `max-w-5xl` / `max-w-[768px]`, and never a legacy
  helper (`.max-container-width`, `--container-max-width`). See [`DESIGN.md`](../../docs/DESIGN.md) § Max width.

### Control size rhythm — same size on a horizontal line

- **MUST** give buttons and fields sitting on the **same horizontal line** the **same `size`**. When a
  `@aziontech/webkit/button` sits beside an `@aziontech/webkit/input-text` (search bar + submit, filter
  row, toolbar, inline form), both take the same size token so their heights match and the row shares one
  baseline. A `medium` input next to a `large` button breaks the rhythm.
- **MUST** keep that one size consistent across every control in the group — inputs, selects, buttons,
  icon-buttons in the same toolbar all share it. Don't mix a `small` icon-button into a row of `medium`
  controls.
- **SHOULD** align them on a shared baseline (`items-center` / `items-end`) so equal heights actually
  read as one line, not stacked boxes.
- Vertical stacks are exempt — this is about controls that sit **side by side**.

### Design restraint

- **NEVER** gradients, glow effects, or multicolor fills unless explicitly requested.
- **MUST** give every empty state one clear next action.
- **NEVER** block paste in `input` / `textarea`.

## Review output

For `/baseline-ui <file>`, group findings by constraint section. Each finding:

```
✗ <file>:<line>  `bg-[#0a0a0a] text-blue-500`
  why: hardcoded HEX + palette color bypass the theme; break dark mode and brand.
  fix: bg-[var(--bg-surface)] text-[var(--primary)]
```

End with a one-line verdict: `clean` or `N violations across <sections>`.

## References

- Token catalog: [`DESIGN.md`](../../docs/DESIGN.md) (§ Typography, § Spacing, § Colors, § Shapes, § Shadows).
- Component paths: `packages/webkit/package.json#exports`.
- Variant/styling discipline: [`styling.md`](../../rules/styling.md).
- For deeper UX (states, heuristics) → [`/ux-heuristics`](../ux-heuristics/SKILL.md);
  for motion → [`/motion-polish`](../motion-polish/SKILL.md).

## Definition of Done

- [ ] Every interactive primitive is a `@aziontech/webkit` component.
- [ ] No HEX / rgb / Tailwind palette / arbitrary spacing / `rounded-md|lg` / raw `text-*` size remains.
- [ ] Typography uses `text-*` tokens with correct hierarchy; spacing uses only `--spacing-*`.
- [ ] `h-dvh` not `h-screen`; one accent per view; empty states have an action.
- [ ] Shell (sidebar, global header, page heading, content-zone spacing) is fluid; only reading width and focused flows are capped, always via `max-w-[var(--container-*)]`.
- [ ] Buttons and fields on the same horizontal line share one `size` token and a common baseline.
- [ ] (File mode) Every violation has a quoted line, a why, and a concrete fix.
