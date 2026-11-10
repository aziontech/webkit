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
- Size cards, dialogs and side columns with the container scale: `max-w-(--container-sm)` …
  `max-w-(--container-7xl)`.
- Start a screen from its pattern (`search_patterns` → `get_pattern` in the webkit MCP): the pattern
  already carries the right container and rhythm.

## Do not

- Never hand-roll a page cap: no `mx-auto max-w-[1200px]` or `max-w-7xl` on a page root.
- Never use `w-full` to mean full-bleed. Full-bleed is the absence of a container class.
- Never add a third rhythm step (`gap-12`, `mt-16`) between sections or groups.
- Never write a literal length (`px`, `rem`) for a layout width; every measure is a token.

## Correct

```html
<main class="layout-column-form layout-boundary flex flex-col gap-(--layout-section-gap)">
  <section class="flex flex-col gap-(--layout-group-gap)">…</section>
  <section class="flex flex-col gap-(--layout-group-gap)">…</section>
</main>
```

## Wrong

```html
<main class="mx-auto max-w-[1100px] px-6 space-y-12">…</main>
```
