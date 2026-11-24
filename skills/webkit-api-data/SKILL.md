---
name: webkit-api-data
description: Showing API data correctly on @aziontech/webkit screens — references rendered by name (never a bare ID) with one resolution order and a visible unresolved state, remote pickers on Select / MultiSelect (server search, loading, selected values that are not in the loaded page), data freshness (revalidate on open, on focus and after a save; no session-long cache), records typed from the API contract with one formatter per shape, codes turned into text, and server-owned lists (useCollection server mode, a default order that shows what the person is looking for). Use when a screen lists, edits or summarizes resources that come from an API, especially resources that point at other resources.
status: active
last_updated: 2026-11-23
scope: general
enforced_by: [webkit-api-data, webkit-component-states, ui-verify, review]
---

# Skill: webkit-api-data

## Purpose

A console screen is a view of an API. Most of what goes wrong on it is not layout but data: a rule
shows `Network services: 1797` instead of the service's name, a picker forgets a value because its
options were loaded before the value existed, a list renders a field the API does not send, a new item
hides on page 3, a state code reaches the reader as `pending_approval`. Each of these looks like a
small bug and each comes back on the next screen, because the screen rebuilt something the API (or one
shared module) should own.

The contract is rule [`webkit-api-data`](../../rules/webkit-api-data.md). This skill is how to meet it
with webkit pieces. How the request reaches the API (proxy, token, status codes) is
[`webkit-azion-api`](../webkit-azion-api/SKILL.md).

## When to use

- A table, list, summary or detail page shows a field that holds another resource's ID.
- A form edits such a field with a `Select`, `MultiSelect` or `Combobox`.
- A screen shows codes (states, reasons, types) that come from an API.
- A list pages, sorts or searches data that lives on a server.

## 1. One data layer between the API and the screen

Put three things in one module per app, never in a page:

- **The typed client.** Records typed from the API's contract: generated types (`openapi-typescript`
  or the API's SDK) or one schema per resource. A page imports `NetworkService`, not
  `Record<string, any>`.
- **The lookups.** One function per referenceable collection that loads its options (`id`, `name`,
  optional `summary` and `active`), caches them with a timestamp, and revalidates (section 4).
- **The formatters.** One function per shape the API sends (`formatPortRanges`, `formatTimeWindow`),
  typed against that shape, used by every table cell, summary and detail page.

A page that needs a name, an option list or a formatted value asks this module. Two pages never solve
the same mapping twice.

## 2. References: name first, never the bare ID

Resolve every reference in this order, and stop at the first that answers:

1. **The record itself.** An API that follows the expanded-reference convention returns
   `{ id, name, ... }`. Use that name. It is always as fresh as the record.
2. **The loaded options** of that collection (the lookup cache).
3. **One batched fetch of the missing IDs** (`GET /network_services?id__in=1797,1798`, or the API's
   bulk read), merged into the cache. Never one request per ID.
4. **The unresolved state**: `Unknown network service (ID 1797)`, rendered as a warning (a
   `StatusIndicator` with `severity="warning"`, or muted text plus an icon with a name). The ID stays
   visible so the person can report it, and the state does not look like data.

```ts
export function referenceLabel(kind: LookupKind, id: number | string, embedded?: { name?: string | null }) {
  if (embedded?.name) return embedded.name
  const hit = cachedOptions(kind).find((option) => String(option.value) === String(id))
  if (hit) return hit.label
  void resolveMissing(kind, [id])
  return `Unknown ${NOUNS[kind]} (ID ${id})`
}
```

`resolveMissing` batches the IDs it receives in the same tick, fetches them once, and updates the
cache. Because the cache is reactive, the cell re-renders with the name.

In a table, the reference cell is a `TableCellLink` to the referenced resource, labelled with its name.
`TableCellId` or `CopyText` may show the ID next to it when people need it for support.

## 3. Remote pickers: the selected value is always an option

A `Select` or `MultiSelect` whose options come from an API has three jobs the static examples do not
show:

- **Search on the server.** Set `searchable`, set `:filter="false"` so the component does not filter
  the page it has, listen to `@search`, debounce it (150 ms) and send the text to the API. Show
  `loading` while the request runs. Cancel a superseded request.
- **Keep the selected values listed.** Build the option list as: the selected values (resolved by
  section 2, in the order they were picked), then the search results without them. A value that is
  not among the results still shows, checked, and can be removed. When the API supports it, ask for the
  selected IDs on the first page (`ids_first=1797`).
- **Name the trigger from the same resolution.** `displayValue` maps each value through
  `referenceLabel`, so the trigger never prints an ID.

```vue
<script setup lang="ts">
  import MultiSelect from '@aziontech/webkit/multi-select'
  import { computed } from 'vue'

  const model = defineModel<number[]>({ default: () => [] })
  const { results, loading, search } = useRemoteOptions('network_service')
  const options = computed(() => withSelected('network_service', model.value, results.value))
  const displayValue = (values: number[]) => values.map((id) => referenceLabel('network_service', id)).join(', ')
</script>

<template>
  <MultiSelect
    v-model="model"
    searchable
    :filter="false"
    :loading="loading"
    :display-value="displayValue"
    @search="search"
  >
    <MultiSelect.Trigger aria-label="Network services" />
    <MultiSelect.Content>
      <MultiSelect.Item
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        >{{ option.label }}</MultiSelect.Item
      >
    </MultiSelect.Content>
  </MultiSelect>
</template>
```

Show each option's `summary` (ports, schedule, member count) under its name when the collection has
one: two services named alike are told apart by what they do.

A picker for a resource the person may not have yet offers `Create <noun>` and selects the new item
on save (the "A form creates what it is missing" invariant).

## 4. Freshness: data has an age

Another administrator, another tab, a script or an API client can change any collection at any time.
Revalidate a lookup:

- **when a form or drawer that uses it opens** (fetch in the background, keep showing the cached
  options meanwhile, never blank the field);
- **after a save** that creates, renames, deletes or switches off an item of that collection;
- **when the window regains focus** and the cache is older than 60 s;
- **when the API's change stream** (server-sent events, a webhook relay, a poll of a revision number)
  names the collection.

A conditional request (`If-None-Match`) makes the revalidation cheap when nothing changed. Never keep
options for the whole session, and never clear them only on sign-out.

## 5. Shapes, codes and text

- **Type the record, then format it once.** A port range is whatever the contract says (`{ start, end }`
  or `{ from, to }`); the formatter is typed against it, so a wrong field name fails the type check
  instead of rendering `[object Object]`. Show every part of the shape the person needs (TCP and UDP
  ports, not only TCP).
- **Codes become text through the API.** Prefer the label the API sends (`status.label`,
  `reason.label`). Where it sends none, keep one typed map next to the API types, keyed by the code
  union, so a new code is a type error until it has a label. Never title-case a code.
- **States are components.** A resource state is `StatusIndicator` (`severity` from the API's
  severity or from the same map), a moment is `Timestamp`, a size or a number goes through the
  `useLocale()` formatters.

## 6. Lists the server owns

- **Use `useCollection` in server mode** (`fetch`) when the API pages, sorts or searches. Send the
  text, the filters, the sort and the page to the API; do not filter the loaded page.
- **Search like a person types.** If the API's search does not treat `_`, `-` and spaces as equal,
  normalise the query before sending it (and file the gap with the API team); "google meet" must find
  `google_meet_media`.
- **Default order shows what the person is looking for**: their own items before predefined or
  catalog items, then by name; records newest first; ordered rules by their order.
- **A new item is visible.** After a create, the list shows the new item without paging (refresh and
  move to its page, or keep it pinned at the top with a highlight until the next sort or filter).
- **Columns render the shape the API sends**, with the formatters of section 5.

## Don't

- Don't render a bare ID as the visible text of a reference, in a cell, a summary, a trigger or a toast.
- Don't fall back to `String(value)` when a lookup misses; resolve the missing IDs or show the
  unresolved state.
- Don't drop a selected value because the options do not include it.
- Don't cache options for the whole session, or rebuild them only when the page reloads.
- Don't type API records as `any` or read fields the contract does not define.
- Don't title-case codes, or copy a code-to-label map into each page.
- Don't filter or sort one loaded page of a server-paged collection in the browser.

## How to check it works

1. With the screen open, create a referenced item through the API or another tab; open the form again
   without reloading: the item is listed and shown by name.
2. Point a record at an ID outside the loaded options: the picker shows it checked, and the table shows
   its name, or `Unknown <noun> (ID n)` in the warning style if it does not exist.
3. Search a list with spaces where the name has underscores, and create an item: both are found on the
   first page.
4. Run the type check: no record from the API is `any`.
5. Run `/webkit-ui-verify`: loading, empty and error states of the picker and the list render through
   webkit's state components in both themes.
