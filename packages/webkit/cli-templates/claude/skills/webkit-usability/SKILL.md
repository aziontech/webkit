---
name: webkit-usability
description: Async-interaction usability for UI on @aziontech/webkit — lock the scope while an action is in flight (trigger shows :loading, every field :disabled off one flag), pick the right loading affordance (Skeleton / Button :loading / Spinner / ProgressBar) for the direction and emphasis of the flow, and report request/API failures where the user is looking via @aziontech/webkit/toast. Keeps field validation next to the field; toasts are for request-level errors.
status: active
last_updated: 2026-07-20
---

# Skill: usability

## Purpose

Async actions are where prototypes leak. A submit that stays clickable fires twice; a form whose
fields stay editable mid-request sends data the user has already changed; a request that fails
silently leaves the user staring at a spinner that never resolves. This skill fixes the two moments
that decide whether an async flow feels trustworthy: **while it runs** (lock the scope) and **when it
fails** (say so, where the user is looking). It is the async-behavior companion to
`/webkit-ux-heuristics` — heuristics 1 (system status) and 9 (recover from errors), made concrete for
`@aziontech/webkit`.

## How to use

- `/webkit-usability`
  Apply the two patterns below to any async flow (submit, save, delete, fetch-then-act) you build in
  this conversation.
- `/webkit-usability <file>`
  Review the file's async flows against both patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing anything with a submit, save, delete, or fetch that then mutates the screen.
- The user asks "why did it submit twice", "the form didn't lock", "where do errors go", "handle the
  API error".
- Choosing or reviewing a loading affordance — "spinner or progress bar", "skeleton vs spinner",
  "loading state for the deploy/build logs", "why does the spinner keep spinning after it's done".
- After `/webkit-ux-heuristics` establishes the states, to make the loading + error states behave
  correctly.

## Pattern 1 — lock the scope while an action is in flight

While an async action runs, **one boolean drives the whole scope**: the trigger shows `:loading`, and
**every field the action reads is `:disabled` off that same flag**. Not the button alone — a loading
button next to editable fields still lets the user change the payload after they committed it.

Why both, off one flag:

- **No double-submit.** `:loading` disables the trigger and shows a spinner; the handler also guards on
  the flag (`if (submitting.value) return`).
- **No mid-flight edits.** Disabling the inputs freezes the payload the user just committed.
- **One source of truth.** A single `ref` flips on entry and off on settle (success _or_ failure), so
  the button and the fields can never disagree.

The canonical lock-the-scope pattern: one `submitting` flag drives the trigger `Button`'s `:loading`
**and** every field's `:disabled` (`Select`, `InputGroup`, `InputText`, `Switch`, …) in the same
scope.

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'

  const submitting = ref(false)
  const scope = ref('')
  const repoName = ref('')

  const runDeploy = async () => {
    // Guard: the flag is also the re-entrancy lock.
    if (submitting.value) return
    submitting.value = true
    try {
      await deploy({ scope: scope.value, repoName: repoName.value })
    } finally {
      // Release on BOTH paths — success and failure — so the scope never stays stuck.
      submitting.value = false
    }
  }
</script>

<template>
  <Select
    v-model="scope"
    :disabled="submitting"
  >
    <Select.Trigger />
    <Select.Content><!-- options --></Select.Content>
  </Select>
  <InputText
    v-model="repoName"
    :disabled="submitting"
  />
  <Button
    label="Deploy"
    kind="primary"
    :loading="submitting"
    @click="runDeploy"
  />
</template>
```

Rules:

- **Bind `:loading` and every field's `:disabled` to the same flag.** Never a loading button over
  live fields.
- **Guard the handler on the flag** (`if (submitting.value) return`) — `:loading` disabling the
  button is the visual lock, the guard is the logical one.
- **Release in `finally`.** The flag must clear on failure too, or a failed request bricks the form.
- **`:disabled` is not `:loading`.** Only the trigger takes `:loading` (spinner); the fields take
  `:disabled`. Don't put a spinner on every input.
- **Fetch-then-render is the mirror image:** while _loading data into_ a scope, reserve it with
  `@aziontech/webkit/skeleton`, don't disable empty fields — see the **Skeleton vs Button loading**
  section below.

## The loading vocabulary — four affordances, one per question

Every loading state is "system status" (heuristic 1), but the four affordances answer **different
questions** and are **not** interchangeable. Pick by two axes: the **direction** of the flow (data
coming _in_ vs. an action going _out_) and whether the wait has a **measurable extent**.

| Affordance                             | Answers                                | Use when                                                                                                                                              | Emphasis                                                     |
| -------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `@aziontech/webkit/skeleton`           | "the screen is arriving"               | Reading data _into_ a view (first paint, route enter, fetch-then-render)                                                                              | High — occupies the content's own space                      |
| Button `:loading` + fields `:disabled` | "your action is committed and running" | Committing an action _out_ (submit / save / delete / mutate)                                                                                          | High — locks the scope (Pattern 1)                           |
| `@aziontech/webkit/spinner`            | "something is still working"           | Continuous / indeterminate background activity with **no measurable extent** — a per-step status glyph, a header "Preparing…" status, a streaming log | **Low** — a small glyph beside a label, never the whole view |
| `@aziontech/webkit/progress-bar`       | "how far along the whole thing is"     | A long process with a **measurable whole** (steps done / total, bytes, %)                                                                             | Medium — a flush bar conveying forward motion                |

### Skeleton vs Button loading — direction of the flow

- **Reading data _into_ a view → `Skeleton`.** There is nothing for the user to act on yet; the screen
  is arriving. Reserve the layout with skeletons so it doesn't reflow when the data lands, and don't
  render disabled-but-empty fields (a disabled empty input reads as "broken", not "loading").
- **Committing an action _out_ of a view → Button `:loading` + fields `:disabled`.** The screen is
  already here and the user has committed a payload; lock it off one flag per Pattern 1.

Rules of thumb:

- **Never a Skeleton on a form the user is filling.** Filling ≠ loading; a Skeleton over live inputs
  hides the fields the user is trying to use.
- **Never a Button spinner while a view is still loading its data.** There's no committed action to
  reflect — use Skeletons for the content and only show a `:loading` trigger once the user submits.
- **A view can do both in sequence:** Skeletons while the initial data loads (`settingsLoading`), then
  Button `:loading` + `:disabled` fields when the user submits the now-populated form (`submitting`).
  Two different flags, two different affordances.

### Spinner — continuous feedback, low emphasis

A `Spinner` says _"work is ongoing"_ when there is **nothing to reserve** (it's not content arriving)
and **nothing to lock** (the user isn't waiting on a button they pressed) — a background or streaming
process the user watches rather than blocks on. It carries the **least** emphasis of the four: a
`size-4` glyph next to a status label, tinted with a text token (`--text-muted` for ambient,
`--text-default`/`--primary` for the active item), **never** a full-view overlay.

- **Pair it with a label, never alone.** "Preparing git repository" + Spinner, "Provisioning… 12s" +
  Spinner — the words say _what_, the spinner says _still going_. A lone spinner is a spinner that never
  explains itself.
- **Use it for per-item liveness in a sequence.** In a multi-step list, the running step gets a
  `--primary`/`--text-default` Spinner, queued steps a dimmed (`--text-muted opacity-60`) one, done
  steps a check glyph (a running Spinner resolving to a `pi-check` / `pi-check-circle`).
- **Remove it the instant the process settles.** When the flow is `finished`, swap the header Spinner
  for a `Tag severity="success"` — a spinner that keeps turning after completion reads as stuck.
- **Not for determinate work.** If you can compute "N of M done", that's a ProgressBar, not (only) a
  Spinner.

```vue
<script setup>
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <!-- Low-emphasis header status: label + Spinner while running, Tag once done -->
  <div class="flex items-center gap-[var(--spacing-sm)]">
    <Tag
      v-if="done"
      label="Completed"
      severity="success"
    />
    <span class="text-label-sm text-[var(--text-muted)]">
      {{ done ? elapsedLabel : `Provisioning… ${elapsed}s` }}
    </span>
    <Spinner
      v-if="!done"
      class="size-4 text-[var(--text-muted)]"
    />
  </div>
</template>
```

### ProgressBar — forward motion over a measurable whole

A `ProgressBar` answers _"how far along"_ — reach for it only when the wait has a **measurable
extent**: log lines revealed / total, steps done, upload bytes. Feed it `:value` + `:max`; use
`indeterminate` only when there genuinely is no measurable extent yet (and prefer a Spinner there
instead, since indeterminate progress and a spinner say the same thing). Place it flush on an edge
(`size="small" shape="flat"`) so it reads as ambient forward motion, not a control.

- **Determinate whenever you can count.** Compute `progress` from revealed log lines over `totalLines`
  — a real percentage, not `indeterminate`.
- **Remove it on completion.** Like the Spinner, the bar is gone once `phase === 'finished'` — there is
  no more motion to convey.

## Combining loading types — a long multi-step flow

Spinner and ProgressBar are **complementary, not redundant**: the Spinner conveys _local liveness_
("this step is alive"), the ProgressBar conveys _global progress_ ("here's the whole job"). A long
multi-step process that has **both** per-unit activity **and** a measurable whole shows both at once.
The canonical orchestration is a deploy/build flow, three stages handing off in sequence:

1. **The "cloning" splash.** A **Skeleton-style** browser-window mock reserves the layout while the
   repo clones (nothing to act on yet), and the header carries a low-emphasis `--text-muted`
   **Spinner** + "Preparing git repository". After a beat it hands off to the logs.
2. **The sequential build logs** (where the whole pattern comes together). Three affordances at once,
   each doing one job:
   - a **per-step Spinner** glyph (running = `--text-default`, pending = dimmed, done = `pi-check`) —
     _which step is alive_;
   - a **header Spinner** + `statusLabel` while `phase !== 'finished'` — _the job as a whole is alive_;
   - a flush **ProgressBar** (`:value="progress"` over revealed log lines) on the bottom edge — _how
     far along_.
     On `finished`, the Spinners and the bar are all removed and a `Tag severity="success"` + a
     `CopyButton` take their place.
3. **The provisioning variant:** per-step **Spinner** → `pi-check-circle`, a header Spinner + elapsed
   counter, and **no ProgressBar** — the check-marks down the step list _are_ the progress, so a bar
   would be redundant. Add the bar only when the whole is measurable but the step list isn't the
   progress indicator itself.

The rule the flow encodes:

- **Skeleton** while content arrives → **Spinner** for the indeterminate/streaming middle → **Tag /
  content** once settled. One affordance per moment, never two saying the same thing.
- **Spinner + ProgressBar together** only when you have both per-unit liveness _and_ a countable whole
  (the build-logs stage). If the step list already shows progress via check-marks (the provisioning
  stage), the ProgressBar is redundant — drop it.
- **Every ongoing affordance clears on settle.** Spinners and bars disappear the moment the flow is
  `finished`; a turning spinner or a stuck bar after completion is a bug, not decoration.

The canonical fetch-then-render pattern — read data _in_ with a `Skeleton`, then commit _out_ with
Button `:loading` — off two different flags:

```vue
<script setup>
  import { ref } from 'vue'
  import Skeleton from '@aziontech/webkit/skeleton'
  import InputText from '@aziontech/webkit/input-text'
  import Button from '@aziontech/webkit/button'

  const settingsLoading = ref(true) // reading data IN  → Skeleton
  const submitting = ref(false) // committing OUT   → Button :loading + :disabled
</script>

<template>
  <!-- View loading: reserve the field's space, don't show a disabled empty input -->
  <Skeleton
    v-if="settingsLoading"
    kind="shape"
    width="240px"
    height="40px"
  />
  <template v-else>
    <InputText
      v-model="repoName"
      :disabled="submitting"
    />
    <Button
      label="Save"
      :loading="submitting"
      @click="save"
    />
  </template>
</template>
```

## Pattern 2 — report request/API errors via toast

A request-level failure (network down, 4xx/5xx not tied to one field, "Deploy failed") is a
**transient, screen-level event** — it surfaces through `@aziontech/webkit/toast`, not by mutating the
form and not by a silent `console.error`. Mount the region once; raise from anywhere.

```js
// main.js — mount the region once for the whole app.
import { ToastPlugin } from '@aziontech/webkit/toast'
createApp(App).use(router).use(ToastPlugin).mount('#app')
// ToastPlugin registers <Toaster> globally. (Alternatively: place a single
// <Toaster /> in App.vue and import { toast } directly.)
```

```vue
<script setup>
  import { ref } from 'vue'
  import { toast } from '@aziontech/webkit/toast'

  const submitting = ref(false)

  const runDeploy = async () => {
    if (submitting.value) return
    submitting.value = true
    try {
      await deploy()
      toast.success('Deployment started.')
    } catch (error) {
      // Say what failed and how to recover — never just "Error".
      toast.error('Deployment failed.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => runDeploy() }
      })
    } finally {
      submitting.value = false // release the lock from Pattern 1 on failure too
    }
  }
</script>
```

Prefer `toast.promise` when the whole lifecycle maps to one request — it raises a loading toast and
settles it to success/error in place:

```js
toast.promise(deploy(), {
  loading: 'Deploying…',
  success: 'Deployment started.',
  error: (e) => `Deployment failed: ${e?.message ?? 'unknown error'}`
})
```

Rules:

- **Mount `<Toaster>` exactly once** (via `ToastPlugin` or a single `<Toaster />` at the app root).
  The store is a singleton — a second region does not duplicate toasts, but there must be one.
- **Use the typed shortcut for the severity:** `toast.error` for failures, `toast.success` for the
  happy path, `toast.promise` to track a request end-to-end.
- **The message is actionable.** State what failed and the recovery; attach an `action: { label,
onClick }` (e.g. "Retry") when the user can retry. Never a bare "Error".
- **Release the lock on error** (Pattern 1's `finally`) so the toast's Retry actually re-runs.

### The boundary with `/webkit-ux-heuristics` (do not cross it)

`toast` is for **request / system** errors. **Field validation is not.** A bad email, a missing
required value, an out-of-range number stays **next to the field** with `@aziontech/webkit/field-*` +
`@aziontech/webkit/message` (`/webkit-ux-heuristics` heuristic 9) — validating before submit is
`error prevention`, and it never fires a global toast.

| Failure                                                  | Where it goes                                   |
| -------------------------------------------------------- | ----------------------------------------------- |
| Field is invalid / required / malformed                  | `field-*` + `message`, inline next to the field |
| Request failed (network, 5xx, 4xx not tied to one field) | `toast.error` / `toast.promise`                 |
| Long request succeeded / started                         | `toast.success` (optional)                      |

## Review output

For `/webkit-usability <file>`, list gaps grouped by pattern. Each:

```
✗ SomeForm.vue:NN  Button :loading="submitting" but fields have no :disabled
  pattern: Lock the scope — loading trigger over editable fields lets the payload change mid-request.
  fix: bind :disabled="submitting" on the Select / InputText / Switch in the same card.

✗ api.js:31  catch (e) { console.error(e) }
  pattern: Report request errors — the failure is silent; the user sees a spinner that never clears.
  fix: toast.error("Request failed.", { description: e.message, action: { label: "Retry", onClick } }); release the lock in finally.
```

End with: `async flows sound` or `N gaps — fix before polish`.

## References

- Toast API (`toast`, `toast.error`, `toast.promise`, `ToastPlugin`, `<Toaster>`):
  `@aziontech/webkit/toast`.
- Lock-the-scope and fetch-then-render patterns are shown inline above (`submitting` → `:loading` +
  `:disabled`; `settingsLoading` + `@aziontech/webkit/skeleton`).
- Loading component APIs: `@aziontech/webkit/spinner`, `@aziontech/webkit/progress-bar`
  (`:value` / `:max` / `indeterminate` / `size` / `shape`), `@aziontech/webkit/skeleton`.
- Components and their import paths: the webkit MCP `suggest_component`, or
  `node_modules/@aziontech/webkit/catalog.json` (`imports`).
- Design tokens: the `@aziontech/theme` tokens, listed by the webkit MCP.
- Companion skills: `/webkit-ux-heuristics` (states + error placement), `/webkit-impeccable-polish`
  (state-completeness sign-off).

## Definition of Done

- [ ] Loading affordance matches the question: `Skeleton` while reading data _into_ a view; Button `:loading` + `:disabled` fields when committing an action _out_; `Spinner` (low emphasis, + label) for indeterminate/streaming activity; `ProgressBar` (`:value`/`:max`) for a measurable whole.
- [ ] `Spinner` + `ProgressBar` appear together only when there is both per-unit liveness _and_ a countable whole; every ongoing affordance is removed the moment the flow settles (swap to a success `Tag`).
- [ ] Every async action locks its scope off **one** flag: trigger `:loading`, every field `:disabled`.
- [ ] The handler guards on the flag and releases it in `finally` (success **and** failure).
- [ ] `<Toaster>` is mounted once; request/API errors raise `toast.error` / `toast.promise`.
- [ ] Error toasts say what failed + how to recover, with a Retry action where it applies.
- [ ] Field validation stays inline (`field-*` + `message`) — never a toast.
