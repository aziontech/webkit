# Sectioned resource

The page of one resource whose tab holds more sibling pages than a tab row can carry: the rules of a policy, the records of a zone, the settings of one application. The user arrives from the resource's list row or its tabs and moves between the sibling pages without leaving the resource. A console screen shows one navigation per level: the rail lists modules and first-level pages, `PageTabs` lists the resource's sections, and this block adds the third level, at most one local navigation inside the active tab. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`.

## When to use

- One tab of a resource holds more than 7 sibling pages that only exist inside that resource, such as the Private access families of a policy.
- The siblings fall into a few named groups the reader scans before picking one.
- Each sibling page is a list or a form of its own, with its own route, so a link to it can be shared.

## When not to use

- The rail already lists these pages: a destination appears once per screen, so drop either the rail rows or the local navigation. Pages that need a resource are reached through the resource, never as rail rows.
- The tab has 7 or fewer siblings: use a `ToggleGroup` (the FewSiblings variant), tabs, or sections of one page.
- The pages do not belong to one resource: they are first-level pages and go in the rail.
- A resource whose tabs each hold one page: use `detail/resource-detail` or `detail/dns-zone-detail`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Trigger` per section of the resource, in a `sticky top-0` wrapper on the canvas fill, so it stays in view while the layout's content region scrolls the tab under it. It is level 2; the breadcrumb names the resource and is not a level. Each tab is its own route: this block renders the open tab's page, and another tab shows an `EmptyState` with an Open link to that tab's route, so no tab is ever dead.

### B. Local navigation — `SidebarMenuRoot` (required)

From `@3xl` of the tab body, a `SidebarMenuRoot` with `groups` in a fixed `w-(--container-3xs)` column at the inline start. Its rows are `href` links with no glyphs, like the rail's sub-rows, grouped under short group labels. `active-id` comes from the route: the row whose `href` matches the current path is the one current row (`aria-current="page"`), and no row is current when the route is not one of them. Its `aria-label` is the tab name. `navigate` routes on a plain click and leaves modified clicks to the browser.

### C. Folded navigation — `Field`, `Select` (required)

Below `@3xl` of the tab body the menu is hidden and a medium `Select` takes its place, labelled with the tab name through `Field` and `Field.Label`, its options grouped like the menu with `Select.Group`. The value is the current route; picking an option navigates. The container query sits on the tab body wrapper (`@container/tab`) and the `@3xl/tab:` variants on its children, because a container query never matches its own container.

### D. Few siblings — `ToggleGroup` (optional)

When `sections` hold 7 or fewer pages there is no menu and no folded `Select`: a medium `ToggleGroup` labelled with the tab name sits above the list and switches between them, at every width.

### E. Page heading — `PageHeader`, `Button` (required)

The current sibling opens with a small `PageHeader`: its name as the title, one sentence of description, then an outlined medium Documentation and an outlined medium `Add <Noun>`. Inside a resource no action is primary and the create verb is Add.

### F. Controls row — `PropertyFilter`, `Tooltip`, `IconButton` (required)

The TableView controls row: a `PropertyFilter` that grows to fill the row, bound to `useCollection`, then an outlined Refresh `IconButton` named by a `Tooltip`. Moving to another sibling clears the filters.

### G. List — `Card`, `DataTable`, `Table.CellLink`, `Table.CellId`, `Table.CellStatus`, `Table.CellTime`, `EmptyState` (required)

`Card :padded="false"` around `DataTable :bordered="false"` with the `useCollection` table props and sorting. Name is a `Table.CellLink` to the entry, ID a `Table.CellId`, Status a `Table.CellStatus` and Last Modified a `Table.CellTime` with its author. The table's `#empty` slot branches on `useCollection`'s `status`: a filter that matches nothing shows a No matching `EmptyState` with Clear filters; a sibling page with no entries yet (Posture checks, Webhooks, Exceptions here) shows `No <page> yet` with `Add <Noun>`.

## Data

The block takes its sibling pages and entries through props and emits every action; it fetches nothing. `SectionedResourceEntry`, `SectionedResourceSection`, `SectionedResourceSibling` and `SectionedResourceProps` are exported from `sectioned-resource.vue`, and `sample.ts` holds the sample pages and entries the block renders when `sections` or `entries` is left out (and never while `loading` is set).

| Prop            | Type                         | What it does                                                                                                                 |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `sections`      | `SectionedResourceSection[]` | The sibling pages of the open tab, in groups. More than 7 render the menu and the folded Select; 7 or fewer a `ToggleGroup`. |
| `entries`       | `SectionedResourceEntry[]`   | The rows of the current page; the filter, the sort and the pages run on them. Pass `[]` for a page with none.                |
| `loading`       | `boolean`                    | The entries are loading: Refresh spins and the table shows its loading state.                                                |
| `v-model:page`  | `string`                     | The id of the current sibling page; picking a row, an option or a toggle sets it.                                            |
| `currentTab`    | `string`                     | The tab whose page the block renders; every other tab links to its own route.                                                |
| `basePath`      | `string`                     | The resource route; tabs are `basePath/tab` and pages `basePath/currentTab/page`.                                            |
| `resourceLabel` | `string`                     | How the headings name the resource, e.g. "the acme-default policy".                                                          |

| Event         | Payload            | When                                                |
| ------------- | ------------------ | --------------------------------------------------- |
| `update:page` | `(page)`           | Another sibling page was picked; the filters clear. |
| `refresh`     | `(event)`          | Refresh.                                            |
| `add`         | `(event, sibling)` | `Add <Noun>` in the heading or on an empty page.    |

To go live, render the block from the tab route and pass the current page's entries:

```vue
<script setup lang="ts">
  import SectionedResource from './sectioned-resource.vue'

  const route = useRoute()
  const router = useRouter()
  const page = computed({
    get: () => String(route.params.page),
    set: (next) => router.push(`/policies/acme-default/private-access/${next}`)
  })
  const { data, pending, refresh } = usePolicyEntries(page)
</script>

<template>
  <SectionedResource
    v-model:page="page"
    :sections="privateAccessSections"
    :entries="data ?? []"
    :loading="pending"
    @refresh="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep one control per navigation level: the rail, the tabs, and at most this one local navigation.
- Derive the current row from the route on every level, and make the current rows of all levels describe the same place.
- Keep the menu column at `--container-3xs`, so the list keeps the page column minus that column.
- Label the folded `Select` with the tab name, so the reader knows which set of pages it switches.
- Tell an empty page (Add) apart from a filter that matches nothing (Clear filters).
- Give every sibling page its own route, and let the menu rows be real links that open in a new tab on a modified click.

## Don't

- Don't render a `SidebarMenu` in a page body outside this block; local navigation is this block.
- Don't repeat in the local navigation a page the rail already offers, and don't add rail rows that route into a resource, not even as a shortcut into a default one.
- Don't use it for 7 or fewer siblings; a `ToggleGroup`, tabs or one page of sections carries them.
- Don't add glyphs to the menu rows or nest a second level inside the local navigation.
- Don't put the container query on the element that declares the container.

## Copy

- **Tabs:** short nouns, e.g. "Private access", "Settings".
- **Group labels:** one noun for the family, e.g. "Applications", "Access", "Monitoring".
- **Rows and options:** the page name in sentence case, plural, e.g. "Access rules", "Server groups".
- **Heading:** the page name as the title and one sentence that ends with a period, e.g. "Access rules of the acme-default policy."
- **Actions:** "Documentation" and "Add Rule", the noun of one entry.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The local navigation is a `nav` named after the tab; exactly one row carries `aria-current="page"`, the one that matches the route.
- The folded `Select` is labelled by its `Field.Label`, and only one of the two forms is rendered at a time, so the reader never meets the same pages twice.
- Focus order follows reading order: tabs, local navigation, page actions, filter, Refresh, table, pagination.
- The filter has an `aria-label` that matches its placeholder; Refresh is named by its `aria-label` and a `Tooltip` with the same words.
- Every utility is logical (`ms-`, `ps-`, `start`), so the menu column sits on the inline start in right-to-left.
- The tab entrance respects reduced motion.

## States

- Default: `sections` with more than 7 pages; the Private access tab of the acme-default policy, 16 sibling pages in 4 groups in the menu column, Access rules current and listed beside it.
- Narrow: `page` set to Server groups; the same tab below `@3xl` of the tab body: the menu folds into a Select labelled Private access, Server groups current, the list under it at full width. The page keeps the primary's root, so `layout-column` alone sets the measure.
- FewSiblings: `sections` with 6 pages and `currentTab` set to Network security; the Network security tab with 6 siblings and no local navigation; a ToggleGroup labelled Network security switches between them above the list.

## Related

- `view/table-view` — the list each sibling page renders, and the source of the controls row recipe.
- `detail/resource-detail` — a resource whose tabs each hold one page.
- `detail/dns-zone-detail` — a resource with a settings tab and one dominant record list.
- `ConsoleLayout` — the rail (level 1) this block must not repeat; see `skills/webkit-navigation`.
