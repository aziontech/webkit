---
name: column-navigation
category: marketing
structure: composition
status: implemented
spec_version: 1
checksum: 58e5069a4993e9ec7774e331520b1b15f29751c89ed48ec0e4f3f4741e560ae5
created: 2026-09-24
last_updated: 2026-09-24
---

# Column Navigation — Component Spec

## Purpose

A directory of destinations laid out in columns on one set of shared hairlines: each column carries an overline heading over a rule, then its rows — a framed glyph, the destination's name, and one line of what it is. It is the page-level navigation band a marketing page closes a section with, so a reader who got that far can leave for anything the platform holds without going back to the bar.

## When to use

- As the "everything on the platform" band of a product, solutions or pricing page, under a `section-title` and inside the page's frame.
- When a set of destinations is grouped and the group's name carries as much as the destinations under it.
- When each destination needs a glyph and one line of what it is, not just a label.
- When the same directory appears on several pages and has to read identically on every one.

## When NOT to use

- For the header's mega-menu → use `navigation-menu`, which owns the trigger, the panel, and the open/closed state this block deliberately has none of.
- For a set of claims rather than destinations → use `card-grid` with `feature-card`, or `bento-grid` when the claims are unequal.
- For the site-wide link directory at the foot of the page → use `footer`, which already lays its columns out.
- For a trail back up the current hierarchy → use `breadcrumb`.
- For the headings of the page currently being read → use `doc-on-this-page`.

## Related

- `card-grid` — the equal-cell grid whose `divider` register draws its rules the same way; reach for it when the cells are cards rather than columns of links.
- `bento-grid` — unequal cells on the same shared rules.
- `navigation-menu` — the same anatomy inside an overlay, with a trigger and a panel.
- `footer` — the other place a directory of links is laid out in columns.
- `section-module` / `frame-box` — the frame this block is normally dropped into.

## Best practices

- Name the block with `ariaLabel`. It is a `nav` landmark, and a page carrying more than one needs every one of them named.
- Let the grid draw the rules: a column paints the page canvas and the 1px gaps between columns are the hairlines, so a border added inside a column doubles them.
- Keep the column count and the number of groups in step — four groups in a three-column block wrap the fourth onto a row of its own, beside two tracks of bare canvas.
- Give every row in a column a `description`, or give none of them one; a single row without its line reads as a mistake rather than as brevity.
- Leave `href` empty for a destination that does not exist yet. The row still renders and still reads, and it does not answer the pointer or take focus.
- Inside a framed page column, set the surrounding `frame-box` to `flush` so the column's rules stay one hairline each.

## Usage

```vue
<script setup>
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
</script>

<template>
  <ColumnNavigation
    aria-label="Platform"
    :columns="4"
    :mobile-columns="2"
  >
    <ColumnNavigation.Column title="Build">
      <ColumnNavigation.Item
        icon="ai ai-workloads"
        title="Workloads"
        description="Put an application on a hostname, everywhere"
        href="/workloads"
      />
      <ColumnNavigation.Item
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code at the edge"
        href="/functions"
      />
    </ColumnNavigation.Column>
    <ColumnNavigation.Column title="Store">
      <ColumnNavigation.Item
        icon="ai ai-edge-sql"
        title="SQL Database"
        description="A distributed SQL database"
        href="/sql-database"
      />
    </ColumnNavigation.Column>
  </ColumnNavigation>
</template>
```

## Sub-components

- `column-navigation-column/column-navigation-column.vue` — one column of the directory: its overline heading over a rule, then the rows it holds, as a list that heading names.
- `column-navigation-item/column-navigation-item.vue` — one destination row: a registration-framed glyph, the destination's name, and one line of what it is.

Column props: `title` (`string`, default `''`) — the column's overline heading, which also names its list for a screen reader. Column slot: `default` — the column's rows, composed as `ColumnNavigation.Item` elements.

Item props: `icon` (`string`, default `''`) — icon-font class for the glyph, e.g. `ai ai-workloads`; `title` (`string`, default `''`) — the destination's name, the row's first line; `description` (`string`, default `''`) — one line of what the destination is, omitted when empty; `href` (`string`, default `''`) — the destination, where empty renders a row that is not a link and not focusable. Item event: `click` — `(event: MouseEvent, item: ColumnNavigationItemTarget)`, fired only by a row that has an `href`, with `item` carrying `{ title, href }` so a consuming app can `preventDefault()` and route the destination itself instead of reloading.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof ColumnNavigation & { Column: typeof ColumnNavigationColumn; Item: typeof ColumnNavigationItem }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## Props

| Prop            | Type                            | Default | Required | JSDoc                                                                                                |
| --------------- | ------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `ariaLabel`     | `string`                        | `''`    | false    | Accessible name for the navigation landmark; a page carrying more than one needs each of them named. |
| `columns`       | `ColumnNavigationColumns`       | `4`     | false    | How many columns the directory fans out to at the large breakpoint.                                  |
| `mobileColumns` | `ColumnNavigationMobileColumns` | `1`     | false    | How many columns the directory holds below the small breakpoint.                                     |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                         |
| --------- | ----- | ----------------------------------------------------------------------------- |
| `default` | —     | The columns, composed as `ColumnNavigation.Column` elements in reading order. |

## States

- Visual states: `default`, `hover`, `focus-visible`
- `data-columns` and `data-mobile-columns` on the block mirror the track counts it lays out at each breakpoint
- `data-linked` on a row mirrors a non-empty `href`; it is what gates the row's hover plate and its brand glyph, so a row with nowhere to go never answers the pointer
- Below the small breakpoint the block holds `mobileColumns` tracks and every column claims one of them
- Empty: a block with no columns draws no rules, so an unfilled block leaves no hairline on the page

## Motion & Animations

| Trigger                                      | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| row hover / focus (plate surface + hairline) | `transition-colors duration-fast-02 ease-productive-entrance` | semantic duration + easing                        | `motion-reduce:transition-none` |
| row hover (glyph takes the brand ink)        | `transition-colors duration-fast-02 ease-productive-entrance` | semantic duration + easing                        | `motion-reduce:transition-none` |

## Tokens

| Region                                            | Token (DESIGN.md)          |
| ------------------------------------------------- | -------------------------- |
| block rules (the grid's gaps)                     | `var(--border-default)`    |
| column surface                                    | `var(--bg-canvas)`         |
| column heading rule                               | `var(--border-default)`    |
| typography (column heading)                       | `.text-overline-md`        |
| column heading ink                                | `var(--primary)`           |
| typography (row title)                            | `.text-label-sm`           |
| row title ink                                     | `var(--text-default)`      |
| typography (row description)                      | `.text-body-xs`            |
| row description ink                               | `var(--text-muted)`        |
| typography (row glyph)                            | `.text-body-md`            |
| glyph frame hairline                              | `var(--border-default)`    |
| glyph frame fill                                  | `var(--bg-surface-raised)` |
| row hover plate                                   | `var(--bg-hover)`          |
| row hover hairline                                | `var(--border-default)`    |
| row hover glyph ink                               | `var(--primary)`           |
| shape (row hover plate)                           | `var(--shape-card)`        |
| spacing (column inset, row rhythm)                | `var(--spacing-lg)`        |
| spacing (glyph to text)                           | `var(--spacing-md)`        |
| spacing (row plate padding)                       | `var(--spacing-xs)`        |
| spacing (glyph frame inset, title to description) | `var(--spacing-xxs)`       |
| ring                                              | `var(--ring-color)`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a row with an `href` carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; a row with nowhere to go is not a link and is not focusable.
- Keyboard map: `Tab` moves through the rows in DOM order and `Enter` follows one. The block is a set of links, not a composite widget, so it declares no arrow-key model and traps nothing.
- ARIA: the block is a `nav` landmark named by `ariaLabel`; each column's rows are a list named by that column's heading through `aria-labelledby` (id from `useId`), so the group and its length are announced before the rows; the glyph is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the row's title is `var(--text-default)` and its description `var(--text-muted)` on `var(--bg-canvas)`, and the hover plate keeps both on `var(--bg-hover)`.
- `motion-reduce:transition-none` on the row's hover transition, on the same class string.
- Touch target ≥40×40 px: a row is at least 44 px tall and spans the column's full width, and its hover plate is pulled past the text on both sides so the target is the row, not the words.

## Stories (Storybook)

- Default
- Columns — the same directory at two, three and four tracks (justified: `columns` is the block's only variant axis — it declares no `kind` and no `size` — so this composite story is what `Types` is for every other component, and the fan-out is invisible on a single default block).
- Rows — one column holding a row with no description and a row with nowhere to go (justified: `description` and an empty `href` are the row's two state deltas, and neither of them renders on the default block).

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
