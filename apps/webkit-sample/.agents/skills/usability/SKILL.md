---
name: usability
description: Async-interaction usability for UI on @aziontech/webkit — lock the scope while an action is in flight (trigger shows :loading, every field :disabled off one flag) and report request/API failures where the user is looking via @aziontech/webkit/toast. Keeps field validation next to the field; toasts are for request-level errors.
status: active
last_updated: 2026-07-14
---

# Skill: usability

## Purpose

Async actions are where prototypes leak. A submit that stays clickable fires twice; a form whose
fields stay editable mid-request sends data the user has already changed; a request that fails
silently leaves the user staring at a spinner that never resolves. This skill fixes the two moments
that decide whether an async flow feels trustworthy: **while it runs** (lock the scope) and **when it
fails** (say so, where the user is looking). It is the async-behavior companion to
[`/ux-heuristics`](../ux-heuristics/SKILL.md) — heuristics 1 (system status) and 9 (recover from
errors), made concrete for `@aziontech/webkit`.

## How to use

- `/usability`
  Apply the two patterns below to any async flow (submit, save, delete, fetch-then-act) you build in
  this conversation.
- `/usability <file>`
  Review the file's async flows against both patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing anything with a submit, save, delete, or fetch that then mutates the screen.
- The user asks "why did it submit twice", "the form didn't lock", "where do errors go", "handle the
  API error".
- After `/ux-heuristics` establishes the states, to make the loading + error states behave correctly.

## Pattern 1 — lock the scope while an action is in flight

While an async action runs, **one boolean drives the whole scope**: the trigger shows `:loading`, and
**every field the action reads is `:disabled` off that same flag**. Not the button alone — a loading
button next to editable fields still lets the user change the payload after they committed it.

Why both, off one flag:

- **No double-submit.** `:loading` disables the trigger and shows a spinner; the handler also guards on
  the flag (`if (submitting.value) return`).
- **No mid-flight edits.** Disabling the inputs freezes the payload the user just committed.
- **One source of truth.** A single `ref` flips on entry and off on settle (success *or* failure), so
  the button and the fields can never disagree.

The exemplar is the Deploy form in [`DeployTemplate.vue`](../../../src/components/DeployTemplate.vue):
`submitting` drives the `Button`'s `:loading` **and** the `Select`, `InputGroup`, `InputText`, and
`Switch` `:disabled` in the same card.

```vue
<script setup>
import { ref } from "vue";
import Button from "@aziontech/webkit/button";
import InputText from "@aziontech/webkit/input-text";
import Select from "@aziontech/webkit/select";

const submitting = ref(false);
const scope = ref("");
const repoName = ref("");

const runDeploy = async () => {
  // Guard: the flag is also the re-entrancy lock.
  if (submitting.value) return;
  submitting.value = true;
  try {
    await deploy({ scope: scope.value, repoName: repoName.value });
  } finally {
    // Release on BOTH paths — success and failure — so the scope never stays stuck.
    submitting.value = false;
  }
};
</script>

<template>
  <Select v-model="scope" :disabled="submitting">
    <Select.Trigger />
    <Select.Content><!-- options --></Select.Content>
  </Select>
  <InputText v-model="repoName" :disabled="submitting" />
  <Button label="Deploy" kind="primary" :loading="submitting" @click="runDeploy" />
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
- **Fetch-then-render is the mirror image:** while *loading data into* a scope, reserve it with
  `@aziontech/webkit/skeleton` (see `DeployTemplate.vue`'s `settingsLoading`), don't disable empty
  fields — see the **Skeleton vs Button loading** section below.

## Skeleton vs Button loading — pick by direction of the flow

Both are "system status" (heuristic 1), but they answer different questions and are **not**
interchangeable. The direction of the data decides which one:

- **Reading data *into* a view → `@aziontech/webkit/skeleton`.** There is nothing for the user to act
  on yet; the screen is arriving. Reserve the layout with skeletons so it doesn't reflow when the data
  lands, and don't render disabled-but-empty fields (a disabled empty input reads as "broken", not
  "loading").
- **Committing an action *out* of a view (submit / save / delete) → Button `:loading` + fields
  `:disabled`.** The screen is already here and the user has committed a payload; lock it off one flag
  per Pattern 1. The trigger takes `:loading`, every field the action reads takes `:disabled`.

| Moment | Affordance | Why |
|---|---|---|
| First paint / route enter / fetch-then-render | `Skeleton` in place of the arriving content | Reserves layout, no reflow; nothing is actionable yet |
| Submit / save / delete / any mutate | Button `:loading` + all fields `:disabled` (one flag) | Prevents double-submit and mid-flight edits (Pattern 1) |

Rules of thumb:

- **Never a Skeleton on a form the user is filling.** Filling ≠ loading; a Skeleton over live inputs
  hides the fields the user is trying to use.
- **Never a Button spinner while a view is still loading its data.** There's no committed action to
  reflect — use Skeletons for the content and only show a `:loading` trigger once the user submits.
- **A view can do both in sequence:** Skeletons while the initial data loads (`settingsLoading`), then
  Button `:loading` + `:disabled` fields when the user submits the now-populated form (`submitting`).
  Two different flags, two different affordances — see [`DeployTemplate.vue`](../../../src/components/DeployTemplate.vue).

```vue
<script setup>
import { ref } from "vue";
import Skeleton from "@aziontech/webkit/skeleton";
import InputText from "@aziontech/webkit/input-text";
import Button from "@aziontech/webkit/button";

const settingsLoading = ref(true); // reading data IN  → Skeleton
const submitting = ref(false);     // committing OUT   → Button :loading + :disabled
</script>

<template>
  <!-- View loading: reserve the field's space, don't show a disabled empty input -->
  <Skeleton v-if="settingsLoading" kind="shape" width="240px" height="40px" />
  <template v-else>
    <InputText v-model="repoName" :disabled="submitting" />
    <Button label="Save" :loading="submitting" @click="save" />
  </template>
</template>
```

## Pattern 2 — report request/API errors via toast

A request-level failure (network down, 4xx/5xx not tied to one field, "Deploy failed") is a
**transient, screen-level event** — it surfaces through `@aziontech/webkit/toast`, not by mutating the
form and not by a silent `console.error`. Mount the region once; raise from anywhere.

```js
// main.js — mount the region once for the whole app.
import { ToastPlugin } from "@aziontech/webkit/toast";
createApp(App).use(router).use(ToastPlugin).mount("#app");
// ToastPlugin registers <Toaster> globally. (Alternatively: place a single
// <Toaster /> in App.vue and import { toast } directly.)
```

```vue
<script setup>
import { ref } from "vue";
import { toast } from "@aziontech/webkit/toast";

const submitting = ref(false);

const runDeploy = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    await deploy();
    toast.success("Deployment started.");
  } catch (error) {
    // Say what failed and how to recover — never just "Error".
    toast.error("Deployment failed.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => runDeploy() },
    });
  } finally {
    submitting.value = false; // release the lock from Pattern 1 on failure too
  }
};
</script>
```

Prefer `toast.promise` when the whole lifecycle maps to one request — it raises a loading toast and
settles it to success/error in place:

```js
toast.promise(deploy(), {
  loading: "Deploying…",
  success: "Deployment started.",
  error: (e) => `Deployment failed: ${e?.message ?? "unknown error"}`,
});
```

Rules:

- **Mount `<Toaster>` exactly once** (via `ToastPlugin` or a single `<Toaster />` at the app root).
  The store is a singleton — a second region does not duplicate toasts, but there must be one.
- **Use the typed shortcut for the severity:** `toast.error` for failures, `toast.success` for the
  happy path, `toast.promise` to track a request end-to-end.
- **The message is actionable.** State what failed and the recovery; attach an `action: { label,
  onClick }` (e.g. "Retry") when the user can retry. Never a bare "Error".
- **Release the lock on error** (Pattern 1's `finally`) so the toast's Retry actually re-runs.

### The boundary with `ux-heuristics` (do not cross it)

`toast` is for **request / system** errors. **Field validation is not.** A bad email, a missing
required value, an out-of-range number stays **next to the field** with `@aziontech/webkit/field-*` +
`@aziontech/webkit/message` (ux-heuristics heuristic 9) — validating before submit is
`error prevention`, and it never fires a global toast.

| Failure | Where it goes |
|---|---|
| Field is invalid / required / malformed | `field-*` + `message`, inline next to the field |
| Request failed (network, 5xx, 4xx not tied to one field) | `toast.error` / `toast.promise` |
| Long request succeeded / started | `toast.success` (optional) |

## Review output

For `/usability <file>`, list gaps grouped by pattern. Each:

```
✗ DeployTemplate.vue:422  Button :loading="submitting" but fields have no :disabled
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
- Lock-the-scope exemplar: [`DeployTemplate.vue`](../../../src/components/DeployTemplate.vue)
  (`submitting` → `:loading` + `:disabled`), fetch-then-render exemplar: its `settingsLoading` +
  `@aziontech/webkit/skeleton`.
- Component import paths: `packages/webkit/package.json#exports`.
- Companion skills: [`/ux-heuristics`](../ux-heuristics/SKILL.md) (states + error placement),
  [`/impeccable-polish`](../impeccable-polish/SKILL.md) (state-completeness sign-off).

## Definition of Done

- [ ] Loading affordance matches direction: `Skeleton` while reading data *into* a view; Button `:loading` + `:disabled` fields when committing an action *out*.
- [ ] Every async action locks its scope off **one** flag: trigger `:loading`, every field `:disabled`.
- [ ] The handler guards on the flag and releases it in `finally` (success **and** failure).
- [ ] `<Toaster>` is mounted once; request/API errors raise `toast.error` / `toast.promise`.
- [ ] Error toasts say what failed + how to recover, with a Retry action where it applies.
- [ ] Field validation stays inline (`field-*` + `message`) — never a toast.
</content>
</invoke>
