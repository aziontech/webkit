---
name: webkit-ui-states
description: Every data-backed view in a @aziontech/webkit app declares its full state surface — loading, empty, error, partial, success — not just the happy path. Use when building or reviewing any screen that fetches, filters, submits, or paginates. Maps each state to the shipped component (Skeleton, EmptyState, Message) and fixes when to use which.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-ui-states

## Purpose

Most "unfinished" UI is not a styling problem — it is a missing state. A view that fetches renders
beautifully with data and breaks with none: a spinner that never resolves, a blank panel where an
empty result should explain itself, a red toast where an inline field error belongs. This skill fixes
the **state surface** every data-backed view owns, and maps each state to the `@aziontech/webkit`
component that renders it — so the loading/empty/error of every screen looks and behaves the same.

## How to use

- `/webkit-ui-states` — apply the state matrix to any view you build in this conversation.
- `/webkit-ui-states <file>` — review the file's views and report, per gap: the quoted line, which
  state is missing or mis-rendered, and the concrete fix naming the webkit component.

## How to find the components

Never guess an import path. Resolve it the same way for every state component below:

- Ask the **webkit MCP** — `suggest_component` in plain words ("empty state", "loading placeholder").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

Do **not** rely on a path you saw in another repo file — files move; the catalog and MCP are the
contract.

## The state matrix — every data-backed view

A view that fetches, filters, submits, or paginates owns **all** of these. Declare each one; a view
missing any is not done.

| State                                    | When                                            | Render with                                                                               |
| ---------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Loading** (first paint / route enter)  | data is arriving, nothing actionable yet        | `Skeleton` in the shape of the arriving content — reserve the layout so it doesn't reflow |
| **Loading** (inline / a control is busy) | a button/section is working, the rest is usable | `Spinner` inside the control (or the button's own `loading` prop)                         |
| **Empty** (no data at all)               | the collection is genuinely empty (first run)   | `EmptyState` — a one-line reason + one clear next action                                  |
| **Empty** (no results for a filter)      | data exists, the current filter matches nothing | `EmptyState` with a "clear filters" action — distinct copy from first-run empty           |
| **Partial**                              | some rows loaded, more paging in                | render what arrived + an inline `Spinner`/"load more"; never blank the list               |
| **Error** (request failed)               | network / 5xx / 4xx not tied to one field       | a `Message` in the view (or a toast for a transient action) with what failed + a retry    |
| **Success** (transient)                  | a mutation completed                            | optional toast; don't leave the user guessing whether it worked                           |

Field-level validation is **not** in this matrix — a bad email or a required value stays inline next
to the field (see `webkit-usage` and the form guidance). This skill is about the **view's** data
states, not a single input's.

## Loading: Skeleton vs Spinner — pick by direction

They answer different questions and are not interchangeable:

- **Reading data _into_ a view → `Skeleton`.** There is nothing to act on yet; reserve the layout.
  Never render disabled-but-empty fields as a "loading" state — a disabled empty input reads as
  broken, not loading.
- **A control committing an action _out_ → the control's `loading` + a `Spinner`.** The screen is
  already here; only the busy control shows motion.

```vue
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Skeleton from '@aziontech/webkit/skeleton'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import Button from '@aziontech/webkit/button'

  type Row = { id: string; name: string }
  const rows = ref<Row[]>([])
  const loading = ref(true)
  const error = ref('')

  const load = async () => {
    loading.value = true
    error.value = ''
    try {
      rows.value = await fetchRows()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
</script>

<template>
  <!-- Loading: reserve the shape of the arriving content -->
  <div
    v-if="loading"
    class="flex flex-col gap-[var(--spacing-sm)]"
  >
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
  </div>

  <!-- Error: located in the view, recoverable -->
  <Message
    v-else-if="error"
    severity="danger"
    :title="error"
  >
    <Button
      label="Retry"
      kind="outlined"
      size="small"
      @click="load"
    />
  </Message>

  <!-- Empty: one reason + one action -->
  <EmptyState
    v-else-if="!rows.length"
    title="No workloads yet"
    description="Create your first workload to see it here."
  >
    <Button
      label="Create workload"
      kind="primary"
      @click="onCreate"
    />
  </EmptyState>

  <!-- Success: the data -->
  <ul
    v-else
    class="flex flex-col gap-[var(--spacing-xs)]"
  >
    <li
      v-for="r in rows"
      :key="r.id"
    >
      {{ r.name }}
    </li>
  </ul>
</template>
```

The trigger for each state comes from the **consuming app** (its data layer / async state). The
design system ships the _rendering_ of each state; it never fetches. Keep the state flags where the
app owns them (a `ref`, a store, a query result), and route them to the components above.

## Hard rules

- Every fetch/filter/submit/paginate view renders loading **and** empty **and** error — not just the
  happy path.
- First-run empty and no-filter-results empty are **different copy** and different actions.
- Skeleton for data arriving; the control's own loading for an action leaving. Never a full-page
  spinner for content that has a shape.
- Hand-rolled "Nothing here" strings or bespoke spinners are forbidden when `EmptyState` / `Skeleton`
  / `Spinner` exist — resolve them via the MCP/catalog.
- Field validation is inline, never in this matrix.

## Review output

For `/webkit-ui-states <file>`, list gaps grouped by view. Each:

```
✗ WorkloadsList.vue:31  v-if="items.length" with no empty/error branch
  state: Empty + Error missing — a failed or empty fetch renders a blank panel.
  fix: add EmptyState (reason + Create action) and a Message severity="danger" with Retry.
```

End with: `states complete` or `N gaps — fix before polish`.

## Definition of Done

- [ ] Every data-backed view renders loading, empty, and error — plus partial where it paginates.
- [ ] Skeleton reserves the arriving layout; controls show their own loading; no blank async panels.
- [ ] First-run empty ≠ no-results empty (distinct copy + action).
- [ ] Every state component came from the MCP/catalog, not a guessed or borrowed path.
