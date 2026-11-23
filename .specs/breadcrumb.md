---
name: breadcrumb
category: navigation
structure: composition
status: implemented
spec_version: 8
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6301
  node_id: 3374:6301
checksum: b285c043d839003b00e55e20011fd3ca051287edadc24de8edd6a71a41cf65cf
created: 2026-05-25
last_updated: 2026-11-17
---

# Breadcrumb — Component Spec

## Purpose

Shows the page hierarchy so users can navigate back to parent views. Composes `BreadcrumbList`, `BreadcrumbItem`, and `BreadcrumbSeparator` (chevron). Accepts an `items` array for the common case or slot composition for custom layouts. Reference: PrimeNG Breadcrumb (adapted to Webkit tokens).

## When to use

- Use Breadcrumb (with `items`, or Breadcrumb.Item parts) for the page trail.
- A page sits two or more levels deep and the reader needs a way back to its parents (resource detail under a list, a settings sub-page).
- The trail is known as data — pass `items` and let the component render the segments, separators and the collapse when its own box is narrower than 768px.
- The trail needs a custom layout the `items` array cannot express — compose `Breadcrumb.List`, `Breadcrumb.Item` and `Breadcrumb.Separator` in the default slot.

## When NOT to use

- It is the app's primary navigation → use `navigation-menu` or `sidebar` with `sidebar-menu`.
- It moves between sibling views of the same page → use `tabs`.
- It is the previous / next pair at the end of a docs page → use `doc-previous-next`.

## Related

- `breadcrumb-item` — the single segment this component renders; use it alone only inside a hand-composed trail.
- `navigation-menu` — top-level navigation with dropdown panels, not a location trail.
- `link` — a standalone link; a breadcrumb segment is a link with the trail's muted / current styling.

## Best practices

- Prefer `items`; only `items` mode collapses the middle segments into an overflow menu when its own box is narrower than 768px. The default slot renders only when `items` is empty, and a hand-composed trail never collapses.
- Let the last entry be the current page — it is treated as current unless its `active` is set to `false`; give every ancestor an `href`.
- Handle routing in `@navigate`, which receives `(event, href)` for ancestor segments; call `event.preventDefault()` when a client-side router takes over.
- **Vue Router:** a segment has no `to`; put the route's path in `href` (for a named route, `router.resolve(to).href`) and write `@navigate="(event, href) => { event.preventDefault(); router.push(href) }"`. The segment stays a real link, so open-in-new-tab keeps working; leave a modified click (Ctrl, ⌘, Shift, middle button) to the browser.
- In slot mode, wrap each `Breadcrumb.Item` in an `li`: `Breadcrumb.List` is an `ol` and the item renders an `a` / `span`, while `Breadcrumb.Separator` is already an `li`.

## Usage

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
</script>

<template>
  <Breadcrumb>
    <Breadcrumb.List>
      <li>
        <Breadcrumb.Item
          label="Home"
          href="/"
          show-icon
          icon="az az-home"
        />
      </li>
      <Breadcrumb.Separator />
      <li>
        <Breadcrumb.Item
          label="Applications"
          href="/applications"
        />
      </li>
      <Breadcrumb.Separator />
      <li>
        <Breadcrumb.Item
          label="my-application"
          active
        />
      </li>
    </Breadcrumb.List>
  </Breadcrumb>
</template>
```

## Sub-components

- `breadcrumb.vue` — Root `<nav>` with `aria-label` from `ariaLabel`, or the locale catalog (`Breadcrumb`) when empty; a consumer `aria-label` lands on the prop and wins.
- `breadcrumb-list.vue` — Ordered list wrapper (`<ol>`) for segments.
- `breadcrumb-item/breadcrumb-item.vue` — `Breadcrumb.Item`, the segment control; it lives in this component's folder and keeps its flat export `@aziontech/webkit/breadcrumb-item`.
- `breadcrumb-separator.vue` — Decorative chevron between segments (`aria-hidden`).

## Props

| Prop        | Type                   | Default    | Required | JSDoc                                                                                                        |
| ----------- | ---------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `items`     | `BreadcrumbItemData[]` | `() => []` | false    | Ordered path segments; the last entry is treated as the current page when `active` is omitted on that entry. |
| `ariaLabel` | `string`               | `''`       | false    | Accessible name of the navigation landmark; empty uses the locale catalog (`Breadcrumb`).                    |

`BreadcrumbItemData`: `{ label: string; href?: string; showIcon?: boolean; icon?: string; active?: boolean }`

## Events

| Event      | Payload                             | Notes                                                                                                              |
| ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `navigate` | `(event: MouseEvent, href: string)` | Fires when an ancestor segment is activated. `event` is the activation event; `href` is the segment's destination. |

## Slots

| Slot      | Scope | Notes                                                                                   |
| --------- | ----- | --------------------------------------------------------------------------------------- |
| `default` | —     | Custom composition (`BreadcrumbList` + items + separators). Used when `items` is empty. |

## States

- Visual states: inherited from `BreadcrumbItem` (default, hover, focus-visible, disabled)
- Last segment in `items` is current when its `active` is not explicitly `false`

### Responsive contract

- The trail is always a **single row**. A segment wider than the space available shrinks and ellipsizes its label; the current (last) segment gives way first, down to a 2.5rem floor, so the parent link stays readable (the current page is also the page title); a trail that still does not fit scrolls horizontally. It never wraps to a second line and never extends past its container.
- **`items` mode** additionally collapses when the `nav`'s own width is below 768px (a `ResizeObserver` on the landmark, so a breadcrumb in a narrow panel or drawer collapses on a wide screen too): first segment, an overflow menu holding the middle segments, then the current segment. The overflow entries are links (`href`) inside the menu, so they navigate natively, open in a new tab, and still emit `navigate`. The breakpoint is owned by the component's own `use-breadcrumb-collapse` composable.
- **Slot (hand-composed) mode** keeps every segment it was given, since the root cannot know which of the consumer's children are middle segments, so on a narrow screen it degrades through the single-row rules above rather than through a collapse.
- Server render and hydration: the collapse measures the `nav` only after mount (`use-breadcrumb-collapse` reads its width in `onMounted`, then follows a `ResizeObserver`), so the server HTML and the first client render are the full trail and match; in a narrow box the collapse applies in the same tick as mount, before paint.

## Motion & Animations

_none_

## Tokens

| Region          | Token (DESIGN.md)                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| typography      | `.text-label-lg`                                                                                                                                              |
| text (ancestor) | `var(--text-muted)`                                                                                                                                           |
| text (current)  | `var(--text-default)`                                                                                                                                         |
| separator icon  | `var(--text-muted)`                                                                                                                                           |
| spacing gap     | `var(--spacing-1)`                                                                                                                                            |
| shape           | `var(--shape-control)`                                                                                                                                        |
| optical inset   | root `-ms-(--spacing-xs)`: pulls the trail back by the item padding, so the first item's text lines up with the page column and its hover fill bleeds outward |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: on each interactive `BreadcrumbItem` segment.
- Keyboard map: `Tab` moves between ancestor links; current page is not in tab order when rendered as `span`.
- ARIA: root `nav` with `aria-label="Breadcrumb"`; list uses `<ol>` / `<li>`; separators are `aria-hidden`.
- Contrast ≥4.5:1 for labels and chevron.
- `motion-reduce:transition-none` on segment color transitions.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the separator chevron and any directional item `icon` mirror (`rtl:-scale-x-100`), so the trail reads from the start edge.
- Keyboard: no horizontal arrow-key logic.
- User data: item labels are text; page names in another script keep their own direction.

## Examples

- Default
- Depths — single, two-level and full five-level trails.
- LongLabel — a segment wider than its container ellipsizes.

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
