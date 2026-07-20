---
name: webkit-performance-ux
description: Perceived performance is a UX contract — a @aziontech/webkit view should feel instant (<100ms), keep interaction latency good (INP ≤ 200ms), never shift layout as async content lands, and ship light. Use when building or reviewing any view that fetches, mutates, filters, or renders long lists. Covers response-time budgets, optimistic UI, zero-CLS skeletons, debounced input, content-visibility for long lists, and shipping less up front.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-performance-ux

## Purpose

Speed the user _feels_ is not the same as speed a profiler measures — a 300ms action that shows nothing
feels broken, while a mutation that reflects its result in 0ms feels instant even before the request
returns. This skill fixes the **perceived-performance surface** of a view built on `@aziontech/webkit`:
what to render at each response-time threshold, when to be optimistic, how to keep async content from
shoving the layout, and how to ship less code up front. The numbers here are budgets, not vibes.

## How to use

- `/webkit-performance-ux` — apply the budgets and patterns below to any view you build in this
  conversation.
- `/webkit-performance-ux <file>` — review the file and report, per gap: the quoted line, which budget
  or pattern it breaks, and the concrete fix.

## How to find the components

Never guess an import path. Resolve every component the same way:

- Ask the **webkit MCP** — `suggest_component` in plain words ("loading placeholder", "toast", "spinner").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist. The tree-shakeable `<name>-root`
  keys (e.g. `table-root`, `toast-root`) live there too.

Do **not** rely on a path you saw in another repo file — files move; the catalog and MCP are the contract.

## Response-time budgets — render by the threshold, not always

Distilled from Nielsen's response-time thresholds and Core Web Vitals (INP). Match the affordance to the
delay; a spinner on a sub-100ms action just flickers and reads as _slower_.

| Perceived       | Budget    | Meaning                                      | What to render                                                          |
| --------------- | --------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| **Instant**     | < 100ms   | direct-manipulation feel; no wait perceived  | nothing — no spinner; the result is already painting                    |
| **Good (INP)**  | ≤ 200ms   | "good" interaction latency (Core Web Vitals) | still nothing; keep the handler cheap so it stays here                  |
| **Noticeable**  | 200–500ms | user notices lag but holds their flow        | a busy affordance — the control's own `loading`, or an inline `Spinner` |
| **Frustrating** | > 500ms   | "poor" INP; flow breaks                      | show progress; prefer **optimistic UI** so it _feels_ instant           |
| **Long**        | > 1s      | past the ~1s attention threshold             | `Skeleton` / progress, kept interruptible                               |

**Delay the spinner ~200–300ms.** Start a timer, only show the loading affordance if the request is still
in flight when it fires — so a fast (sub-200ms) response never flashes a loader.

## Optimistic UI — reflect the intended result now, roll back on failure

For a mutation whose success is the common case (toggle, delete, rename), update local state immediately
and reconcile when the request settles. The user perceives 0ms; on failure you restore the exact prior
state and surface it.

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  type Row = { id: string; name: string }
  const rows = ref<Row[]>([])

  const remove = async (row: Row) => {
    const snapshot = rows.value.slice() // capture exact prior state
    const index = rows.value.findIndex((r) => r.id === row.id)
    rows.value.splice(index, 1) // 1. reflect it now — list updates in one frame (~16ms)
    try {
      await api.deleteRow(row.id) // 2. request runs in the background
    } catch {
      rows.value = snapshot // 3. failed → restore the exact prior list
      notifyError(`Couldn't delete "${row.name}".`) //    + a Toast/Message (discover via catalog/MCP)
    }
  }
</script>
```

Roll back to a **snapshot**, not by re-deriving — a re-fetch to "fix" a failed optimistic update is slow
and can race. Reserve optimistic UI for reversible, high-success actions; a destructive irreversible one
should confirm first.

## Zero layout shift — reserve space before async content lands

Content popping in and shoving the layout is a measurable defect (Core Web Vitals CLS "good" is ≤ 0.1).
Reserve the space **before** the data arrives with a `Skeleton` sized to the incoming content — same
width/height as the real element — so the arriving data drops into place with no reflow. This is the
loading half of the state surface owned by **webkit-ui-states**; size the skeleton to what replaces it,
never a generic block that resizes on swap. Give images and media explicit dimensions for the same reason.

## Debounce search / filter input — one request per pause, not per keystroke

Firing a request on every keystroke wastes work and floods the network. Wait ~250–300ms after the user
stops typing:

```vue
<script setup lang="ts">
  import { ref, watch } from 'vue'

  const query = ref('')
  const results = ref<string[]>([])
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(query, (q) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      // one request 250ms after the last keystroke
      results.value = await search(q)
    }, 250)
  })
</script>

<template>
  <input
    v-model="query"
    type="search"
    placeholder="Filter workloads"
  />
</template>
```

## Long lists — native scroll + `content-visibility`, no virtualization lib

webkit forbids external virtualization libraries. For long lists, let the browser skip rendering
offscreen rows with CSS `content-visibility: auto`, and reserve each row's height with
`contain-intrinsic-size` so the scrollbar stays stable:

```vue
<template>
  <ul class="max-h-[70vh] overflow-y-auto">
    <li
      v-for="row in rows"
      :key="row.id"
      class="[content-visibility:auto] [contain-intrinsic-size:auto_44px]"
    >
      {{ row.name }}
    </li>
  </ul>
</template>
```

## Ship less up front — lazy-load, individual imports, `-root` over the compound

- **Lazy-load heavy overlays and routes** so the initial view stays light — a dialog the user may never
  open should not be in the first bundle:
  ```ts
  import { defineAsyncComponent } from 'vue'
  const SettingsDialog = defineAsyncComponent(() => import('./SettingsDialog.vue'))
  ```
- **Import icons individually**, never a whole icon set, so tree-shaking keeps only what you render.
- **Prefer the tree-shakeable `<name>-root` import** when you only need the root of a compound component:
  `import TableRoot from '@aziontech/webkit/table-root'` pulls in nothing else, whereas
  `@aziontech/webkit/table` (the compound) retains every sub-component. Discover the `-root` key via the
  catalog/MCP.

## Don't stall the main thread or animate layout

- **Don't block the main thread** on large synchronous work (parsing a huge payload, a big sort/map in
  one tick) — it freezes input and blows the INP budget. Chunk it, defer it, or move it off the render path.
- **Animate `transform` / `opacity` only** — never layout properties (`width`, `height`, `top`, `left`),
  which force reflow every frame and miss the ~16ms/frame budget for 60fps. The full motion contract is
  in **webkit-motion-polish**.

## Hard rules

- No loading affordance on a sub-100ms action; delay any spinner ~200–300ms so fast responses don't flash it.
- Optimistic updates roll back to a captured **snapshot** on failure and surface the failure (Toast/Message).
- Async content lands into reserved space (Skeleton sized to the content); never let it reflow the layout.
- Debounce search/filter input (~250–300ms); one request per pause, not per keystroke.
- Long lists use native scroll + `content-visibility: auto` + `contain-intrinsic-size` — no virtualization lib.
- Lazy-load heavy overlays/routes; import icons individually; prefer `<name>-root` over the full compound.
- Never animate layout properties or block the main thread on large synchronous work.

## Review output

For `/webkit-performance-ux <file>`, list gaps grouped by view. Each:

```
✗ WorkloadsList.vue:22  watch(query, () => search(query.value))  — request per keystroke
  budget: floods the network; every keystroke is a fetch.
  fix: debounce ~250ms — clearTimeout + setTimeout so one request fires after the user stops typing.

✗ WorkloadRow.vue:40  await api.deleteRow(id); rows = await refetch()  — no optimistic reflect
  budget: > 500ms round-trip before the row disappears; feels frustrating.
  fix: splice locally now, restore a snapshot on catch, notify on failure.
```

End with: `perf on budget` or `N gaps — fix before ship`.

## Enforcement

Two honest layers, neither complete alone. **Package weight** is gated in the design system itself: a
`size-limit` budget per export fails CI when a component grows, so the bundle you import can't bloat
unnoticed. **App-side interaction and Core Web Vitals** (INP, CLS, LCP) are a **measurement** concern —
run Lighthouse / the CWV field metrics against the real screen; there is no static check that proves a
handler stays under 200ms or that a list doesn't shift. Treat the budgets above as review criteria and
verify them with measurement, not assertion.

## Definition of Done

- [ ] Affordance matches the delay: nothing under 100ms, busy state past ~200–300ms, progress past 1s.
- [ ] Mutations that can be optimistic reflect immediately and roll back to a snapshot + notify on failure.
- [ ] Async content lands into reserved space (Skeleton sized to it); CLS stays ≤ 0.1, no reflow on load.
- [ ] Search/filter input debounced (~250–300ms); long lists use `content-visibility`, no virtualization lib.
- [ ] Heavy overlays/routes lazy-loaded; icons imported individually; `-root` used where only the root is needed.
- [ ] No layout-property animation, no main-thread stalls; budgets verified with Lighthouse/CWV, not assumed.
