---
name: webkit-accessibility-implementation
description: The @aziontech/webkit components are accessible by construction, but the composition around them can still break WCAG 2.2 AA — a lost focus ring, a placeholder used as a label, a spinner no screen reader announces, a click handler with no key handler. Use when building or reviewing any screen; fixes focus, roles/ARIA, live regions, forms, target size, keyboard, and motion at the composition layer.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-accessibility-implementation

## Purpose

A `<Button>`, a `<Dialog>`, a `<Chip>` from `@aziontech/webkit` ships its own role, keyboard model,
focus ring, and reduced-motion fallback — you do not re-implement them. But accessibility is a
property of the **whole screen**, and the parts you write between the components are where WCAG 2.2 AA
still breaks: a `<div @click>` with no key handler, a field whose only "label" is its placeholder, an
async error announced only by color, a focus that never returns to the trigger a dialog closed. This
skill fixes that composition layer so a screen built on webkit is WCAG-correct end to end, not just
component by component.

## How to use

- `/webkit-accessibility-implementation` — apply the checklist below to any screen you build in this
  conversation.
- `/webkit-accessibility-implementation <file>` — review the file and report, per violation: the
  quoted line, which WCAG criterion it breaks, and the concrete fix.

## How to find the components

Never guess an import path. Resolve every component — including the shipped focus-trap composable —
the same way:

- Ask the **webkit MCP** — `suggest_component` in plain words ("focus trap", "toast", "helper text",
  "icon button").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

Do **not** rely on a path you saw in another repo file — files move; the catalog and MCP are the
contract.

## Focus

- **Visible focus, always.** Every interactive element shows a `focus-visible` ring built from the
  ring token (`focus-visible:ring-[var(--ring-color)]`). Never `outline: none` / `focus:outline-none`
  without a visible replacement — a keyboard user who can't see focus can't navigate.
- **Logical order.** Tab order follows reading order (DOM order). Do not reorder with positive
  `tabindex`; use `tabindex="0"` only to make a genuinely custom control reachable, `-1` only to move
  it out of the sequence — never a positive value.
- **Focus is never trapped or lost** on the page as a whole; the one exception is a modal overlay,
  which **must** trap focus while open and **restore it to the trigger on close**. Use the shipped
  focus-trap composable (discover via MCP/catalog) — do not hand-roll a trap. A webkit `<Dialog>`
  already does this; if you build a custom overlay, wire the same composable.

## Roles & ARIA

- **Prefer native elements.** A `<button>`, `<a href>`, `<input>`, `<nav>`, `<ul>` carries its role,
  keyboard, and focus for free. Add `role` only when no native element fits — a `role` on a `<div>` is
  a signal you reached for the wrong element.
- **ARIA state mirrors visual state.** If it looks expanded, `aria-expanded="true"`; if it reads as an
  error, `aria-invalid="true"`; if it's working, `aria-busy="true"`. State that only the eye can see is
  invisible to assistive tech.
- **Accessible name via the component's `ariaLabel` prop**, never a raw `aria-label` attribute an
  icon-only control passes through inconsistently. An icon-only button with no text needs a name:

```vue
<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <!-- icon-only control: the name comes from ariaLabel, not the glyph -->
  <IconButton
    icon="ai-trash"
    ariaLabel="Delete workload"
    @click="onDelete"
  />
</template>
```

## Live regions

Anything that changes **asynchronously** must be announced — a spinner alone is silent to a screen
reader. Route async status through a live region:

- **Polite** (`aria-live="polite"`) for non-urgent updates — "Saved", "3 results loaded".
- **Assertive** (`aria-live="assertive"`, or a webkit toast/message with the right severity) for
  errors and anything the user must hear now.

A webkit `Toast`/`Message` set as a status surface handles this; if you render your own status text,
give its container `aria-live` (and `role="status"` for polite, `role="alert"` for assertive) so the
change is spoken, not just drawn.

## Forms

- **Every field has a real label.** A visible `<label for>` (or the field component's label prop) —
  **never a placeholder as the label.** Placeholder text disappears on input and is not reliably read
  as a name.
- **Errors are associated**, not just colored. Point the field at its message with `aria-describedby`
  and mark it `aria-invalid` so the error is announced when focus lands:

```vue
<script setup lang="ts">
  import { useId, ref } from 'vue'
  const email = ref('')
  const error = ref('')
  const fieldId = useId()
  const errorId = useId()
</script>

<template>
  <label
    :for="fieldId"
    class="text-body-md"
    >Email</label
  >
  <input
    :id="fieldId"
    v-model="email"
    type="email"
    :aria-invalid="!!error || undefined"
    :aria-describedby="error ? errorId : undefined"
    class="focus-visible:ring-[var(--ring-color)]"
  />
  <span
    v-if="error"
    :id="errorId"
    class="text-body-sm text-[var(--text-danger)]"
    >{{ error }}</span
  >
</template>
```

- **Group related fields** with `<fieldset>` + `<legend>` (radio sets, address blocks) so the group's
  purpose is announced with each control.

## Target size

- **Interactive targets are ≥ 24×24 px** (WCAG 2.2, 2.5.8). webkit controls at their default size
  already clear this; if you shrink one or build a custom hit target, keep it ≥ 24 px, or leave ≥ 24 px
  of spacing around it.
- Don't strip a focus outline to "clean up" a dense control — reduce padding instead, keep the ring.

## Keyboard

- **Everything clickable is reachable and operable by keyboard.** If you attach `@click` to a
  non-interactive element, it also needs a key handler (`@keydown.enter`/`@keydown.space`) and
  `tabindex="0"` and a `role` — but the right fix is almost always to use a `<button>` instead.
- No keyboard trap outside a modal; every custom widget answers Tab, Enter/Space, and Escape as its
  role implies.

## Motion

- **Every animation pairs with `motion-reduce:`** (`motion-reduce:transition-none` /
  `motion-reduce:animate-none`) so users with `prefers-reduced-motion` get a still fallback. This is
  the floor; the full motion contract is deepened in **webkit-motion-polish**.

## Hard rules

- Never `outline: none` / `focus:outline-none` without a visible ring replacement using the ring token.
- Never a placeholder as a field's label; every field has a real associated label.
- Never `@click` on a non-interactive element without a key handler + `tabindex` + `role` (prefer a
  native `<button>`).
- Accessible names come from the component's `ariaLabel` prop, not a raw `aria-label`.
- Async status (loading, error, success) is announced via a live region; a spinner alone is not enough.
- Interactive targets are ≥ 24×24 px; every animation has a `motion-reduce:` fallback.

## Review output

For `/webkit-accessibility-implementation <file>`, list violations. Each:

```
✗ WorkloadRow.vue:42  <div class="row" @click="open(row)">  — no key handler, no role, not focusable
  wcag: 2.1.1 Keyboard — a mouse-only handler; keyboard users cannot open the row.
  fix: use a <button> (or IconButton), or add role="button" tabindex="0" @keydown.enter/.space.

✗ SettingsForm.vue:17  <input placeholder="API token" />  — placeholder-as-label, no association
  wcag: 1.3.1 / 3.3.2 — no programmatic label; error not tied to the field.
  fix: add <label for>, aria-invalid, and aria-describedby pointing at the error span.
```

End with: `a11y clear` or `N violations — fix before ship`.

## Enforcement

Two layers pair up, and neither alone is enough. **`eslint-plugin-vuejs-accessibility`** catches the
static ~40% at lint time (missing `alt`, bad `role`, `click` without a key handler). The behavioral
60% — focus actually reachable, focus restored on close, a live region actually announcing — is caught
at runtime by the **axe pass in the `webkit-ui-verify` skill**: axe is the runtime a11y check, run it
against the rendered screen before you call a11y done.

## Definition of Done

- [ ] Every interactive element shows a `focus-visible` ring from the ring token; no stripped outlines.
- [ ] Overlays trap focus while open and restore it to the trigger on close (shipped focus-trap composable).
- [ ] Native elements preferred; `role` only where none fits; ARIA state mirrors visual state.
- [ ] Every field has a real associated label; errors tied via `aria-describedby` + `aria-invalid`.
- [ ] Async status announced via a live region; icon-only controls named via `ariaLabel`.
- [ ] Targets ≥ 24×24 px; every animation has a `motion-reduce:` fallback.
- [ ] eslint-vuejs-accessibility clean **and** the axe pass (webkit-ui-verify) reports no violations.
