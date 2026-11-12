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

The components that live in panels already do this, so a page gets it for free: `Table` (the grid
scrolls sideways inside its own viewport; `stackable` opts a short list into label/value cards),
`PageHeader` and `SectionHeader` (actions drop under the title, full width), `SettingRow` (keeps its
two columns, the description clamped; `stackable` moves a field under its copy), `SettingsSection`, `SaveBar` (actions stack full width, Save on top),
`Card` (its content is `@container/card`), `Alert` (the action takes its own line), `EmptyState`,
`Pagination` (the strip and page-size control wrap under the info text; the page list stays whole), `Wizard` (the rail hides when the
wizard is narrow), `HelpPanel`, `ChartCard`, `StatTile`, and the body of every dialog and drawer
(`@container/panel`). `KeyValuePairs` picks its column count from its own width, and
`Field orientation="responsive"` follows whichever container encloses it.

The window still owns the shell:

- `ConsoleLayout` measures its own width (through `AppLayout`): below 768 px the rail moves into
  the layout's navigation drawer, opened from the header's menu button; on a header under its `@xs`
  (a 320 px phone) the brand mark drops out of the header and stays in the drawer. `DocLayout` moves its rail
  into a drawer below `lg` and shows the outline rail from `xl`.
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
