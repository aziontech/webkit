# Column Navigation

> A directory of destinations laid out in columns on one set of shared hairlines: each column carries an overline heading over a rule, then its rows — a glyph, the destination's name, and one line of what it is. It is the page-level navigation band a marketing page closes a section with, so a reader who got that far can leave for anything the platform holds without going back to the bar.

- Import: `import ColumnNavigationRoot from '@aziontech/webkit/column-navigation-root'`
- Compound import (dot notation, not tree-shakeable): `import ColumnNavigation from '@aziontech/webkit/column-navigation'`
- Category: marketing · Surface: marketing · Structure: composition
- API as JSON: [column-navigation.json](https://github.com/aziontech/webkit/blob/main/.specs/column-navigation.json)

## When to use

- As the "everything on the platform" band of a product, solutions or pricing page, under a `section-title` and inside the page's frame.
- When a set of destinations is grouped and the group's name carries as much as the destinations under it.
- When each destination needs a glyph and one line of what it is, not just a label.
- When the same directory appears on several pages and has to read identically on every one.

## Do

- Name the block with `ariaLabel`. It is a `nav` landmark, and a page carrying more than one needs every one of them named.
- Let the grid draw the rules: a column paints the page canvas and the 1px gaps between columns are the hairlines, so a border added inside a column doubles them.
- Keep the column count and the number of groups in step — four groups in a three-column block wrap the fourth onto a row of its own, beside two tracks of bare canvas.
- Give every row in a column a `description`, or give none of them one; a single row without its line reads as a mistake rather than as brevity.
- Leave `href` empty for a destination that does not exist yet. The row still renders and still reads, and it does not answer the pointer or take focus.
- Inside a framed page column, set the surrounding `frame-box` to `flush` so the column's rules stay one hairline each.

## Don’t

- For the header's mega-menu → use `navigation-menu`, which owns the trigger, the panel, and the open/closed state this block deliberately has none of.
- For a set of claims rather than destinations → use `card-grid` with `topic`, or `bento-grid` when the claims are unequal.
- For the site-wide link directory at the foot of the page → use `footer`, which already lays its columns out.
- For a trail back up the current hierarchy → use `breadcrumb`.
- For the headings of the page currently being read → use `doc-on-this-page`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the equal-cell grid whose `divider` register draws its rules the same way; reach for it when the cells are cards rather than columns of links.
- [bento-grid](bento-grid.md) — unequal cells on the same shared rules.
- [navigation-menu](navigation-menu.md) — the same anatomy inside an overlay, with a trigger and a panel.
- [footer](footer.md) — the other place a directory of links is laid out in columns.
- [section-module](section-module.md) / `frame-box` — the frame this block is normally dropped into.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the navigation landmark; a page carrying more than one needs each of them named. |
| `columns` | `ColumnNavigationColumns` | `4` | false | How many columns the directory fans out to at the large breakpoint. |
| `mobileColumns` | `ColumnNavigationMobileColumns` | `1` | false | How many columns the directory holds below the small breakpoint. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The columns, composed as `ColumnNavigation.Column` elements in reading order. |

## Sub-component imports

- `@aziontech/webkit/column-navigation-column`
- `@aziontech/webkit/column-navigation-item`

## Sub-components

- `column-navigation-column/column-navigation-column.vue` — one column of the directory: its overline heading over a rule, then the rows it holds, as a list that heading names.
- `column-navigation-item/column-navigation-item.vue` — one destination row: a glyph, the destination's name, and one line of what it is.

Column props: `title` (`string`, default `''`) — the column's overline heading, which also names its list for a screen reader. Column slot: `default` — the column's rows, composed as `ColumnNavigation.Item` elements.

Item props: `icon` (`string`, default `''`) — icon-font class for the glyph, e.g. `ai ai-workloads`; `title` (`string`, default `''`) — the destination's name, the row's first line; `description` (`string`, default `''`) — one line of what the destination is, omitted when empty; `href` (`string`, default `''`) — the destination, where empty renders a row that is not a link and not focusable. Item event: `click` — `(event: MouseEvent, item: ColumnNavigationItemTarget)`, fired only by a row that has an `href`, with `item` carrying `{ title, href }` so a consuming app can `preventDefault()` and route the destination itself instead of reloading.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof ColumnNavigation & { Column: typeof ColumnNavigationColumn; Item: typeof ColumnNavigationItem }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## States

- Visual states: `default`, `hover`, `focus-visible`
- `data-columns` and `data-mobile-columns` on the block mirror the track counts it lays out at each breakpoint
- `data-linked` on a row mirrors a non-empty `href`; it is what gates the row's hover plate and its brand glyph, so a row with nowhere to go never answers the pointer
- Below the small breakpoint the block holds `mobileColumns` tracks and every column claims one of them
- Empty: a block with no columns draws no rules, so an unfilled block leaves no hairline on the page

## Accessibility

- Visible focus: a row with an `href` carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; a row with nowhere to go is not a link and is not focusable.
- Keyboard map: `Tab` moves through the rows in DOM order and `Enter` follows one. The block is a set of links, not a composite widget, so it declares no arrow-key model and traps nothing.
- ARIA: the block is a `nav` landmark named by `ariaLabel`; each column's rows are a list named by that column's heading through `aria-labelledby` (id from `useId`), so the group and its length are announced before the rows; the glyph is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the row's title is `var(--text-default)` and its description `var(--text-muted)` on `var(--bg-canvas)`, and the hover plate keeps both on `var(--bg-hover)`.
- `motion-reduce:transition-none` on the row's hover transition, on the same class string.
- Touch target ≥40×40 px: a row is at least 44 px tall and spans the column's full width, and its hover plate is pulled past the text on both sides so the target is the row, not the words.

## Examples

### Default

```vue
<script setup>
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
  import ColumnNavigationRoot from '@aziontech/webkit/column-navigation-root'
</script>

<template>
  <ColumnNavigationRoot
    aria-label="Platform"
    :columns="4"
  >
    <ColumnNavigationColumn title="Compute">
      <ColumnNavigationItem
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-orchestrator"
        title="Rules Engine"
        description="Automate request handling with programmable rules"
        href="/rules-engine"
      />
      <ColumnNavigationItem
        icon="ai ai-load-balancer"
        title="Load Balancer"
        description="Distribute traffic for performance and availability"
        href="/load-balancer"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Data">
      <ColumnNavigationItem
        icon="ai ai-edge-storage"
        title="Object Storage"
        description="Scalable, durable storage for unstructured data"
        href="/object-storage"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-sql"
        title="SQL Database"
        description="Relational database built for distributed applications"
        href="/sql-database"
      />
      <ColumnNavigationItem
        icon="ai ai-tiered-cache"
        title="Cache"
        description="Accelerate content delivery and reduce origin load"
        href="/cache"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Security">
      <ColumnNavigationItem
        icon="ai ai-waf-rules"
        title="WAF"
        description="Block application attacks at the edge"
        href="/waf"
      />
      <ColumnNavigationItem
        icon="ai ai-network-lists"
        title="Network Shield"
        description="Absorb volumetric and protocol attacks"
        href="/network-shield"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-dns"
        title="Edge DNS"
        description="Authoritative DNS answered from every location"
        href="/edge-dns"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Observe">
      <ColumnNavigationItem
        icon="ai ai-real-time-metrics"
        title="Real-Time Metrics"
        description="Watch traffic and errors as they happen"
        href="/real-time-metrics"
      />
      <ColumnNavigationItem
        icon="ai ai-data-stream"
        title="Data Stream"
        description="Ship events to the tools you already run"
        href="/data-stream"
      />
      <ColumnNavigationItem
        icon="ai ai-real-time-events"
        title="Real-Time Events"
        description="Query every request without sampling"
        href="/real-time-events"
      />
    </ColumnNavigationColumn>
  </ColumnNavigationRoot>
</template>
```

### Columns

```vue
<script setup>
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
  import ColumnNavigationRoot from '@aziontech/webkit/column-navigation-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ColumnNavigationRoot
      aria-label="Platform, two columns"
      :columns="2"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
        <ColumnNavigationItem
          icon="ai ai-load-balancer"
          title="Load Balancer"
          description="Distribute traffic for performance and availability"
          href="/load-balancer"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
        <ColumnNavigationItem
          icon="ai ai-tiered-cache"
          title="Cache"
          description="Accelerate content delivery and reduce origin load"
          href="/cache"
        />
      </ColumnNavigationColumn>
    </ColumnNavigationRoot>

    <ColumnNavigationRoot
      aria-label="Platform, three columns"
      :columns="3"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Security">
        <ColumnNavigationItem
          icon="ai ai-waf-rules"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </ColumnNavigationColumn>
    </ColumnNavigationRoot>

    <ColumnNavigationRoot
      aria-label="Platform, four columns"
      :columns="4"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Security">
        <ColumnNavigationItem
          icon="ai ai-waf-rules"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Observe">
        <ColumnNavigationItem
          icon="ai ai-real-time-metrics"
          title="Real-Time Metrics"
          description="Watch traffic and errors as they happen"
          href="/real-time-metrics"
        />
      </ColumnNavigationColumn>
    </ColumnNavigationRoot>
  </div>
</template>
```

### Rows

```vue
<script setup>
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
  import ColumnNavigationRoot from '@aziontech/webkit/column-navigation-root'
</script>

<template>
  <ColumnNavigationRoot
    aria-label="Row states"
    :columns="2"
  >
    <ColumnNavigationColumn title="Available now">
      <ColumnNavigationItem
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-sql"
        title="SQL Database"
        href="/sql-database"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="On the way">
      <ColumnNavigationItem
        icon="ai ai-edge-ai"
        title="AI Inference"
        description="Run AI models closer to users"
      />
      <ColumnNavigationItem
        icon="ai ai-gateway"
        title="AI Gateway"
        description="Secure, manage, and optimize AI traffic"
      />
    </ColumnNavigationColumn>
  </ColumnNavigationRoot>
</template>
```
