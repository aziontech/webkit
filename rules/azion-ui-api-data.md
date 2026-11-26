# Rule: API data — show what the API means, never what it stores

A console screen shows records that come from an API: resources that point at other resources, codes
that stand for states, ports and ranges with a shape of their own. The person reading the screen must
see names, labels and summaries, never the storage form behind them. This rule is the contract for
any value that came from an API. The recipes (references, remote pickers, freshness, lists) are in the
[`azion-ui-api-data`](../skills/azion-ui-api-data/SKILL.md) skill; how the call itself reaches the API is
in [`azion-ui-azion-api`](../skills/azion-ui-azion-api/SKILL.md).

## The contract

- **A reference shows its name.** A field that holds another resource's ID renders that resource's
  name, in a table cell, a summary, a picker trigger and a detail page alike. A bare ID is never the
  visible text of a reference (an ID may sit next to the name in `TableCellId` or `CopyText`).
- **Resolve in this order.** The name embedded in the record (`{ id, name }`), then the loaded options,
  then one batched fetch of the missing IDs. Only when all three fail show the unresolved state:
  `Unknown <noun> (ID 1797)` in a warning style, so the gap is visible instead of looking like data.
- **A selected value is always an option.** A `Select` or `MultiSelect` whose value is not among its
  loaded options still lists it, checked, under its resolved name, so the person can see and remove
  it. Never drop a selected value because the options did not include it.
- **Data has an age.** Options and lookups loaded from the API are revalidated when the form or page
  that uses them opens, after a save that changes their collection, and when the window regains focus
  after a minute. A cache that lives for the whole session is a defect: another person, another tab or
  a script can change the data at any time.
- **Codes become text through the API or one map.** A state, reason or enum code renders the label the
  API gives (`status.label`) or, where the API gives none, a label from one typed map next to the API
  types. Never title-case a code (`ip_address_only` is not "Ip Address Only").
- **Rows have types.** API records are typed from the API's contract (generated types or a schema
  library), never `any` or an untyped `Record<string, unknown>`. Each shape (a port range, a time
  window) has one formatter, typed against that shape, used everywhere it appears.
- **Lists the server owns stay on the server.** When the API pages, sorts and searches a collection,
  the list sends the query to the API (`useCollection` server mode) instead of filtering one loaded
  page. The default order puts what the person is looking for first (their own items before predefined
  ones, newest records first), and an item the person just created is visible without paging.

## Why

On 2026-11-23 a firewall rule in an Azion console showed "Network services: 1797". The service had
been created by a script; the console's options cache was older than the service, and the picker
fell back to the raw value. The same service could not be found in its list: the list rendered port
ranges with field names the API did not send, showed no UDP ports, ordered by ID and searched the
loaded page only. Every one of those is a line above.

## How to check it works

1. Create a resource through the API (or in another tab) while the screen that references it is open.
   Open the form or page again without reloading: the new resource shows by name.
2. Point a record at an ID the options do not contain: the picker lists it as selected, and the table
   shows its name or the `Unknown <noun> (ID n)` state, never the bare number.
3. Search the list for the name with spaces instead of underscores, and open the list after creating an
   item: the item is found and is on the first page.
4. Type-check: no API record in the screen is typed `any`.
