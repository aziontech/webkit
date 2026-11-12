# Devices

> Viewport breakpoints for the shell, container queries for the content, touch targets and reflow at 320 px.

## 8. Devices — the window, the box, the finger

A component does not know whether it is on a 1440 px page or in a 400 px drawer, so it must not
ask the window. Two scales (both in `@aziontech/theme`, "Breakpoints and container sizes"):

| Question               | Scale            | Variants                       | Use it for                                                      |
| ---------------------- | ---------------- | ------------------------------ | --------------------------------------------------------------- |
| How big is the window? | `--breakpoint-*` | `sm:` `md:` `lg:` `xl:` `2xl:` | the shell (sidebar ↔ drawer), overlays as sheets, page boundary |
| How big is my box?     | `--container-*`  | `@container` + `@sm:` `@md:` … | everything inside a band, a card, a drawer, a split view        |

```vue
<template>
  <section class="@container/usage flex flex-col gap-(--layout-group-gap)">
    <div class="grid grid-cols-1 gap-(--spacing-md) @xl/usage:grid-cols-2">…</div>
  </section>
</template>
```

The components that live in panels already do this, so a page gets it for free: `Table` (rows
stack into label/value cards below `--container-lg`; `:stackable="false"` keeps the scrolling grid),
`PageHeader` and `SectionHeader` (actions drop under the title, full width), `SettingRow` (the
control moves under its copy), `SettingsSection`, `SaveBar` (actions stack full width, Save on top),
`Card` (its content is `@container/card`), `Alert` (the action takes its own line), `EmptyState`,
`Pagination` (only previous / current / next in a narrow box), `Wizard` (the rail hides when the
wizard is narrow), `HelpPanel`, `ChartCard`, `StatTile`, and the body of every dialog and drawer
(`@container/panel`). `KeyValuePairs` picks its column count from its own width, and
`Field orientation="responsive"` follows whichever container encloses it.

The window still owns the shell:

- Below `md` the console sidebar is not shown; the shell opens the same `Sidebar` inside a
  `Drawer` from a menu button (the `shells/console` block).
- Below `md` a `Dialog` or `Drawer` is a bottom sheet; below `sm` it is a full-height, full-width
  sheet, and its `PanelFooter` actions stay pinned and stretch.
- Ultra-wide (1920, 2560 px): the column classes of section 2 cap the content, so wide screens add
  margin. Never widen a band to "use the space".

Containment has one cost: a box with `@container` has no intrinsic width. Put it only on a box whose
width comes from its parent (block, grid track, `flex-1`), never on `inline-flex`, `w-fit` or a
popover.

Touch: every target is at least 24 × 24 px, 44 × 44 px on a coarse pointer. The webkit controls do
it without changing their drawn size (an invisible hit area under `pointer-coarse:`); in your own
markup prefer a larger hit area over a larger control. Anything shown on hover is also shown on
focus and under `[@media(hover:none)]:`.

Reflow (WCAG 1.4.10): the page works at 320 px with no horizontal page scroll. Only code, logs,
tables in scroll mode and marquees scroll sideways, inside their own box. Give fixed-width demo
wrappers `w-full max-w-*`, rows that hold several controls `flex-wrap`, and flex items that hold
truncating text `min-w-0`.
