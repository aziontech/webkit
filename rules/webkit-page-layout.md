# Rule: page layout — one container type per band, two rhythm steps

A page never picks its own `max-w-*`. Each band of the page carries one of the container types
that `@aziontech/theme` ships, chosen by what the band holds. This is what keeps every Azion screen
on the same column.

## Container types

| Class                    | Holds                                                         | Measure token                  |
| ------------------------ | ------------------------------------------------------------- | ------------------------------ |
| `.layout-column`         | Data: lists, home, overviews, detail dashboards (the default) | `--layout-measure`             |
| `.layout-column-focused` | One task laid out in a few columns                            | `--layout-measure-focused`     |
| `.layout-column-form`    | Settings and in-page edit forms                               | `--layout-measure-form`        |
| `.layout-form-create`    | Dedicated create pages                                        | `--layout-measure-form-create` |
| `.layout-column-content` | Prose: documentation, blog                                    | `--layout-measure-content`     |
| `.layout-column-site`    | The marketing site frame (hero, sections, footer)             | `--layout-measure-site`        |

## Devices: window or box

Two scales, documented in `@aziontech/theme` ("Breakpoints and container sizes"):

- **Viewport breakpoints** (`sm:` 640, `md:` 768, `lg:` 1024, `xl:` 1280, `2xl:` 1536 px) are for
  what belongs to the window: the app shell (sidebar on desktop, navigation `Drawer` on a phone),
  overlays turning into sheets, the page boundary.
- **Container sizes** (`@container`, `@sm:` 408, `@md:` 472, `@lg:` 552, `@xl:` 644 px …, the
  `--container-*` scale) are for everything that can live in a panel: a band inside a drawer, a
  split view or a card lays out for its box, not the window. The variants compile from the theme
  scale, not Tailwind's defaults (`@2xl:` is 752 px, not 672), so write the variant and never a raw
  `@min-[47rem]:` for a size the scale has. A step that must happen inside a page column uses at
  most `@5xl:` on the site (the column caps at 1388 px) and `@6xl:` in the console (1620 px).

These components are box-aware and need nothing from the page: `Table` (scrolls sideways
inside its viewport, opt-in `stackable` rows, toolbar), `PageHeader`, `SectionHeader`, `SettingRow`, `SettingsSection`,
`SaveBar`, `Card` (its content is `@container/card`), `Alert`, `EmptyState`, `Pagination`,
`Wizard`, `HelpPanel`, `ChartCard`, `StatTile`, and the dialog and drawer body (`PanelContent`,
`@container/panel`). `KeyValuePairs` and `Item` reflow by themselves; `Field orientation="responsive"`
follows the nearest container.

- Write `@md:` (container) for a layout inside a band; write `md:` (viewport) only for the shell.
- Put `@container` only on a box whose width comes from its parent (a block, a grid track, a
  `flex-1` item), never on a shrink-to-fit box (`inline-flex`, `w-fit`, a popover).
- Every page reflows at 320 px with no horizontal page scroll; only code, logs, wide tables in
  scroll mode and marquees scroll sideways, inside their own box.
- Ultra-wide screens add margin, not line length: the container classes above already cap every
  band, so never widen a page past its measure.
- Touch targets are at least 24 × 24 px, and 44 × 44 px on a coarse pointer (`pointer-coarse:`);
  nothing is revealed only on hover.

## Do

- Put one container class on each band. A tab with a table is `.layout-column` even when the tab
  next to it is a form.
- Use the same class on everything in a band that must line up: the scrolling body **and** its
  sticky action bar.
- Add `.layout-boundary` (all insets) or `.layout-boundary-inline` (sides only, for a sticky bar) on
  the same block for the page inset. The boundary widens the cap by exactly the inset.
- Space sections with `gap-(--layout-section-gap)` and the parts inside one section with
  `gap-(--layout-group-gap)`. Where the parent cannot carry a `gap`, use `.layout-section-start` /
  `.layout-group-start`.
- Build the repeated bands from their components, which already carry the right container and
  rhythm: `PageHeader` for the page heading, `SectionHeader` or `SettingsSection` for a band title,
  `SettingRow` for a settings row, `PageTabs` for a detail page's tab strip, and `SaveBar` for the
  sticky action bar (`kind="plain"` is the form-column footer).
- Size cards, dialogs and side columns with the container scale: `max-w-(--container-sm)` …
  `max-w-(--container-7xl)`.
- Start a screen from its block (`npx @aziontech/webkit search <words>` → `npx @aziontech/webkit add
<block-id>`, or `search_patterns` → `get_pattern` in the webkit MCP): the block already carries
  the right container and rhythm.

## Do not

- Never hand-roll a page cap: no `mx-auto max-w-[1200px]` or `max-w-7xl` on a page root.
- Never use `w-full` to mean full-bleed. Full-bleed is the absence of a container class.
- Never add a third rhythm step (`gap-12`, `mt-16`) between sections or groups.
- Never write a literal length (`px`, `rem`) for a layout width; every measure is a token.
- Never use a viewport breakpoint (`md:`, `lg:`) for a layout that lives inside a band; it breaks
  the moment the band moves into a drawer or a split view.
- Never render a `<main>`, `AppLayout`, `Sidebar` or `GlobalHeader` in a page: the app layout,
  composed once in `App.vue`, owns them, and the page is the body of its default slot.

## Correct

A page body inside the app layout (`ConsoleLayout`, `SiteLayout`, `DocLayout` own the `<main>`):

```html
<div class="layout-column-form layout-boundary flex flex-col gap-(--layout-section-gap)">
  <section class="flex flex-col gap-(--layout-group-gap)">…</section>
  <section class="flex flex-col gap-(--layout-group-gap)">…</section>
</div>
```

## Wrong

```html
<main class="mx-auto max-w-[1100px] px-6 space-y-12">…</main>
```
