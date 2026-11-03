---
name: webkit-ux-heuristics
description: Component-map discovery pass — for each UX moment (loading→Skeleton, destructive→Dialog confirm, field error→Field*/Message inline, overlay→shipped focus-trap, empty→one action) name the @aziontech/webkit component that already serves it, so the flow is sound before polish. Also owns three usability rules every surface follows — an external resource link opens in a new tab and says so (trailing pi-external-link + new-tab hint), every long list (a "+N" Tag opening a Popover, an inline picker of existing resources in a create flow, a Select of existing resources) carries a count, search and Load more, and any list of options longer than 7 turns search on. State rendering + async behavior lives in /webkit-ui-states.
status: active
last_updated: 2026-10-28
scope: general
# prettier-ignore
enforced_by: [webkit-prefer-over-custom, webkit-component-states, webkit-accessibility, ui-verify, review]
---

# Skill: webkit-ux-heuristics

## Purpose

Get the flow right before it is made to look good. Most UI slop is not a styling problem — it is a
missing loading state, an error in the wrong place, an empty screen with no next step, or a
destructive action with no confirmation. This is the **discovery pass**: for each moment in a flow,
name the `@aziontech/webkit` component that already serves it, so you compose shipped behavior instead
of hand-rolling it. **Before polish, the flow must be sound.**

Boundary: this skill picks the component per moment. How each state actually **renders** (the loading
shape, the empty layout, the error affordance) and how **async behavior** sequences belong to
`/webkit-ui-states`.

## How to use

- `/webkit-ux-heuristics`
  Apply the component map to any flow you design or build in this conversation.
- `/webkit-ux-heuristics <file>`
  Review the file's flow against the map and output, per gap:
  - the exact line / element (quoted),
  - the moment it mishandles (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Designing or reviewing a flow, form, list, or screen — **before** `/webkit-baseline-ui` /
  `/webkit-motion-polish`.
- The user asks "is this good UX", "what am I missing", "review this flow".

## Component map (the right tool per moment)

Each moment below is a Nielsen heuristic made concrete — the map **is** the checklist. Pick the
component for the moment; don't re-derive the principle.

| Moment                            | Use                                                                                                                     | Don't                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Loading (content vs. inline)      | `@aziontech/webkit/skeleton` for content shape; the control's own loading / `@aziontech/webkit/spinner` for inline busy | a bare full-page spinner for content that has a shape |
| Destructive / irreversible action | `@aziontech/webkit/dialog` (confirm)                                                                                    | a silent immediate action                             |
| Field validation error            | `@aziontech/webkit/field-*` + `@aziontech/webkit/message` **next to the field**                                         | a global toast for a field error                      |
| Page / section status             | `@aziontech/webkit/message`, `@aziontech/webkit/status-indicator`                                                       | inventing a banner                                    |
| Empty state                       | `@aziontech/webkit/button` for the one next action + a one-line reason it's empty                                       | a dead-end "no results" string                        |
| Contextual actions / menu         | `@aziontech/webkit/dropdown-menu`                                                                                       | a hand-rolled popover                                 |
| Side surface                      | `@aziontech/webkit/panel`, `@aziontech/webkit/drawer`                                                                   | a fixed div without focus management                  |
| Tooltip help                      | `@aziontech/webkit/tooltip`                                                                                             | `title` attribute only                                |
| Field label                       | `@aziontech/webkit/label`                                                                                               | placeholder-as-label                                  |
| Link to an external resource      | `@aziontech/webkit/link` with `target="_blank"` (trailing `pi-external-link`) — see rule 1 below                        | a bare `<a>`, a `ButtonMini`, or a silent new tab     |
| More items than the space holds   | first item + `+N` `@aziontech/webkit/tag` opening a `@aziontech/webkit/popover` with search and Load more — rule 2      | a wrapped inline list, or every item rendered at once |
| Picking from more than 7 options  | `@aziontech/webkit/field-select` with `searchable`, or an `input-text` search on top of the overlay list — rule 3       | a long list the user has to scroll to scan            |

Overlays (`dialog`, `drawer`, `dropdown-menu`, `panel`) must trap focus and restore it on close — use
the **shipped focus-trap composable** (discover its exact import via the MCP / catalog); don't rebuild
focus/escape behavior by hand.

## Usability rules

Three rules that hold on every surface — table cell, detail panel, card, form, overlay. Each fixes
a moment where the user otherwise guesses: where a link goes, whether a list is complete, and how to
find one entry in many.

### 1. External resource links open in a new tab and say so

An external resource is anything outside the app: documentation, a customer's domain, a Git
repository, a status page, a vendor console. A link to one:

- **Opens in a new tab** — `target="_blank"` with `rel="noopener noreferrer"`. The user keeps their
  place in the app; losing a half-filled form to a docs link is the failure this prevents.
- **Carries the trailing `pi-external-link` mark** at a fixed 12px (`text-body-xs leading-none
shrink-0`), never sized from the surrounding text. The mark is how the user knows before the click.
- **Tells assistive tech too.** The mark is `aria-hidden`, so the new-tab fact is said in text: an
  `aria-label` ending in `(opens in a new tab)`, or a `sr-only` span after the label.
- **Names the destination when the label does not.** A name or a domain gets a tooltip
  `Open <name> in a new tab`; a label that already says where it goes ("API reference") needs none.

Pick the element by where the link sits:

| Where                                       | Use                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Standalone (a domain, a repo, "Learn more") | `Link` with `target="_blank"` — it renders the mark and sets `rel` itself                 |
| Inside running prose                        | an `<a>` with the `text-link` class, the same `target`/`rel`, and the mark after the text |
| A resource name in a table cell or panel    | the shared cross-resource link from `/webkit-tables`                                      |

```vue
<Link
  label="View deployment logs"
  href="https://docs.example.com/logs"
  target="_blank"
  aria-label="View deployment logs (opens in a new tab)"
/>
```

Do not:

- open an external resource in the same tab, or open an in-app route in a new tab;
- put the mark on a link that stays in the app's tab, or on an action that goes nowhere — a `Link`
  for an in-app action sets `:show-icon="false"`;
- use `ButtonMini` or a `Button` for a link — those are actions, not destinations.

### 2. Long lists: count → search → list → Load more

Any list that can grow past what the space holds uses one anatomy, in one of three containers:

| The moment                                                                                           | Container                                                                                    |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Overflow** — a slot shows more items than it fits (domains on a workload, tags on a row)           | the first item + a **`+N` `Tag`** opening a **`Popover`** with the full list                 |
| **Picking an existing resource in a create flow** — the application for a workload, its firewall     | an **inline picker** in the band: selectable `Item` rows (see `/webkit-create-surface` § 6)  |
| **Picking an existing resource in a single field** — a certificate on a domain, a function on a rule | a **`Select`**: search in `Select.Content`'s `#search` slot, Load more in its `#footer` slot |

For overflow, never wrap the items onto extra lines and never render them all inline. For picking,
never render every resource at once and never hand the user a list they have to scroll to scan.

The anatomy, top to bottom, the same in all three:

1. **Summary** — `text-label-sm text-(--text-muted)`: `12 domains`, and while paged or searched
   `10 of 34 domains` / `3 of 34 domains`. The user always knows whether the list is complete.
2. **Search** — an `InputText` with a leading `pi pi-search`, only when the list passes the rule-3
   threshold (more than 7 items).
3. **List** — scrolls inside the popover (`max-h-(--container-xs) overflow-auto
overscroll-contain`). Each entry truncates; an entry that is an external resource follows rule 1.
4. **Load more** — a full-width `Button kind="text" size="small"` in a bordered footer, labelled
   with the count it adds (`Load 10 more`), present only while items remain. While it loads, the
   button shows `loading` and `Skeleton` rows hold the place of the incoming batch.
5. **No match** — a one-line muted message quoting the query: `No domain matches "api"`. In a
   create flow, where the user can make the thing instead, it says so: `No firewall matches "api".
Create one instead, or clear the search.`

Behavior:

- Render a fixed first batch and add one batch per Load more. Search filters the full set, not
  just the loaded batch, and resets paging to the first batch.
- Closing the popover or the Select clears the query and resets paging; the next open starts clean.
- A picker that opens with a value already chosen loads as many batches as it takes to show that
  value — the selection is never hidden behind Load more.
- A `role="status"` `sr-only` region announces the summary and `Loading N more <items>`.
- `@click.stop` on `Popover.Trigger` and `Popover.Content` when the badge sits in a clickable row.

```vue
<Popover v-model:open="open" placement="bottom-start" width="small">
  <Popover.Trigger @click.stop>
    <Tag :label="`+${count}`" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
  </Popover.Trigger>
  <Popover.Content @click.stop>
    <div class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)">
      <p class="text-label-sm text-(--text-muted)">{{ summary }}</p>
      <InputText v-if="items.length > 7" v-model="query" size="medium" placeholder="Search domains" aria-label="Search domains">
        <template #iconLeft><i class="pi pi-search" aria-hidden="true" /></template>
      </InputText>
    </div>
    <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
      <!-- visible entries, Skeleton rows while loading, no-match line -->
    </div>
    <div v-if="remaining" class="border-t border-(--border-default) p-(--spacing-xxs)">
      <Button :label="`Load ${nextBatch} more`" kind="text" size="small" :loading="loading" class="w-full" @click.stop="loadMore" />
    </div>
    <span class="sr-only" role="status">{{ loading ? `Loading ${nextBatch} more domains` : summary }}</span>
  </Popover.Content>
</Popover>
```

Build it once as a shared component per item kind and reuse it on every surface that shows that
kind; a second hand-made copy is the one that ships without search.

### 3. More than 7 options turns search on

Seven is the most a person scans at a glance. Any list the user **picks from** — a `FieldSelect`, a
filter's value step, an overflow popover, an account or workspace switcher, a menu of resources —
shows a search box **when it holds more than 7 options**, and **hides it at 7 or fewer**, where a
search box is only noise.

- `FieldSelect`: bind `:searchable="options.length > 7"`. The search applies to the `options` prop,
  not to slotted options.
- Compound `Select`: put the `InputText` in `Select.Content`'s `#search` slot behind the same
  `v-if`, and filter the `Select.Option` list by it.
- An inline picker in a create flow: the `InputText` sits above the rows, inside the band.
- An overlay list you compose (Popover, Dropdown content): an `InputText` with a leading
  `pi pi-search` above the list.
- Count the **full** set, not the loaded batch — a paged list of 40 searches even while 10 show.
- The threshold is computed from the data, never hard-coded per screen, so a list that grows past 7
  gains search without an edit.
- Search matches case-insensitively on the visible label and shows the no-match line from rule 2
  when nothing matches.

## Three states every fetch/submit surface needs

- **Loading** — reserve content shape while data arrives; show inline busy on the working control.
- **Empty** — one clear next action (a `@aziontech/webkit/button`) and a one-line reason it's empty.
- **Error** — recoverable, located next to the cause, with a retry/fix affordance.

A surface that fetches or submits but is missing any of these three is **not done** — flag it. How each
one renders, and how the async sequence behaves, lives in `/webkit-ui-states`.

## Hard rules

- Same action → same component, in the same place, with the same label, everywhere. Never two
  components for one job.
- Destructive / irreversible → `dialog` confirm; never a silent immediate action.
- Field errors sit next to the field (`field-*` + `message`); never a global toast for a field-level
  error.
- Overlays trap and restore focus via the shipped focus-trap composable; never hand-roll focus/escape.
- Labels are literal; use `label`, never placeholder-as-label; never block paste.
- External resources open in a new tab, carry the 12px `pi-external-link` mark, and say "opens in a
  new tab" to assistive tech; in-app links stay in the tab.
- A long list — overflow `Popover`, create-flow picker, or `Select` — carries a count, search past 7,
  and Load more; overflow is never a wrapped inline list.
- More than 7 options → search on; 7 or fewer → no search box.
- No motion or delight here — this pass is structure only. Defer ornament to `/webkit-motion-polish` /
  `/webkit-impeccable-polish`.
- Component discovery is always the webkit MCP `suggest_component` or
  `node_modules/@aziontech/webkit/catalog.json` (`imports`) — never a source path.

## Review output

For `/webkit-ux-heuristics <file>`, list gaps grouped by moment. Each:

```
✗ <file>:<line>  delete handler fires immediately on click
  moment: destructive action — irreversible, no confirmation.
  fix: wrap in @aziontech/webkit/dialog confirm; primary action "Delete", default focus on Cancel.
```

End with: `flow sound` or `N gaps — fix before polish`.

## Definition of Done

- [ ] Every moment uses the correct webkit component (see map).
- [ ] Every fetch/submit surface has loading + empty + error states (rendered per `/webkit-ui-states`).
- [ ] Destructive actions confirm; field errors sit next to their cause; paste is never blocked.
- [ ] Overlays trap and restore focus via the shipped focus-trap composable (import resolved via the MCP/catalog).
- [ ] Every external resource link opens in a new tab with the `pi-external-link` mark and a new-tab hint for screen readers.
- [ ] Every overflow is a `+N` Tag → Popover, and every pick of an existing resource is an inline picker or a `Select` — each with a count, search (past 7), Load more, and a no-match line.
- [ ] Every pickable list longer than 7 options has search; none at 7 or fewer.
- [ ] No motion or delight added here (structure only).
