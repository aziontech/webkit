# Toast

> A transient, non-blocking notification system: mount the `<Toaster>` region **once** near the application root, then raise notifications imperatively from anywhere via the exported `toast()` function (`toast('Saved')`) and its type shortcuts (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.loading`, `toast.promise`, `toast.dismiss`). Each notification is a self-dismissing card that stacks in a corner, animates in and out, and is announced to assistive technology — without stealing focus. Unlike the sibling [`Alert`](alert.md), which is an **inline** banner the consumer places in the document flow and controls with `v-model`-style props, Toast is a **transient overlay** stack driven by an imperative call and a shared reactive store, so the call site needs no local visibility state and no markup of its own. The card surface, typography, and severity icons follow the Figma design (see `figma` in the frontmatter). The interaction model follows the established mount-once toast pattern (a single anchored region + imperative trigger + auto-dismiss stack that groups collapsed and expands on hover), built on our tokens, our semantic animation utilities, and our composition/compound-API conventions per [`.claude/rules/migration.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/migration.md); nothing is inherited from any external library. Each severity tints only its leading **icon** via the matching `-contrast` token (`var(--success-contrast)` / `var(--warning-contrast)` / `var(--danger-contrast)` / `var(--info-contrast)`) over the shared `var(--bg-surface-raised)` surface.

- Import: `import ToastRoot from '@aziontech/webkit/toast-root'`
- Compound import (dot notation, not tree-shakeable): `import Toast from '@aziontech/webkit/toast'`
- Category: feedback · Surface: product · Structure: composition
- API as JSON: [toast.json](https://github.com/aziontech/webkit/blob/main/.specs/toast.json)

## Setup

One-time app-level wiring before the first toast() call — service (recommended): import { ToastPlugin } from '@aziontech/webkit/toast' and chain .use(ToastPlugin) onto createApp() in the app entry; the plugin mounts the toast region automatically. Alternative: mount a Toaster component once near the app root. `webkit doctor` flags toast usage with no wired region.

## When to use

- Confirming the result of an action that finished out of view or in the background: saved, deployed, copied.
- Following an async operation from start to finish with `toast.promise`, or `toast.loading` plus a dismiss by id.
- A short notice that is not tied to one place on the page and can disappear on its own.

## Do

- Mount `Toaster` once near the app root, or install `ToastPlugin`. Don't mount one per page; the store renders only the first registered region.
- Use the typed shortcuts (`toast.success`, `toast.error`, …). The type sets the icon and the live-region urgency: `error` makes the region assertive, and `error` and `warning` items get `role="alert"`.
- Keep the message text to one line and move detail to `description`. Offer at most two actions: one `action`, or `actions` with two entries when a failure has two ways forward (**Edit** and **Redeploy**).
- duration: 0` keeps a toast until it is dismissed. Keep the returned id and call `toast.dismiss(id)`, or pass the same `id` to update the toast in place.
- Don't make a toast the only path to an important action. It auto-dismisses and never takes focus.

## Don’t

- The message must stay visible next to the content it concerns → use `message`.
- The user must decide something before continuing → use `dialog`.
- Validation feedback for a single field → use `helper-text`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- message` — inline severity banner placed in the page flow; it stays until it is closed.
- [dialog](dialog.md) — blocking modal for decisions and confirmations.
- [spinner](spinner.md) — rendered by the `loading` toast type.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | false | Corner (or edge-center) the stack is anchored to. |
| `duration` | `number` | `4000` | false | Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. |
| `max` | `number` | `3` | false | Maximum simultaneously visible toasts per corner before the rest queue behind. |
| `expand` | `boolean` | `false` | false | Lay the stack out fully expanded with a gap; when `false` the resting stack overlaps into a peek. |
| `closable` | `boolean` | `false` | false | Show an always-visible close control on every toast; a per-toast `closable` option overrides it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { toast, dismiss } | Optional override for a single toast's body. `toast` is the store entry (`{ id, type, message, description?, action?, actions?, duration }`); `dismiss` dismisses that entry. When omitted, the `Toaster` composes `ToastItem` + `Title`/`Description`/`Action`/`Close` from the entry, rendering one `Action` per entry of `actions` (the first two) or the single `action`. |

## Sub-component imports

- `@aziontech/webkit/toast-item`
- `@aziontech/webkit/toast-title`
- `@aziontech/webkit/toast-description`
- `@aziontech/webkit/toast-action`
- `@aziontech/webkit/toast-close`

## Sub-components

- `toaster.vue` — the mount-once region, at the component root. `<Teleport to="body">` + a fixed-positioned, `position`-anchored container that renders the live `<TransitionGroup>` stack of `ToastItem`s from the injected store, with `aria-live` (`polite`, or `assertive` when an `error` toast is present) and `aria-atomic="false"`. Props `position?: ToastPosition` (default `'bottom-right'`), `duration?: number` (default `4000`, ms — the stack-wide default each toast inherits unless its own `duration` overrides), `max?: number` (cap the number of simultaneously visible toasts; the rest queue behind until a slot frees), `expand?: boolean` (when `false`, the default, stacked toasts overlap into a peek; when `true`, they lay out fully expanded with a gap), `closable?: boolean` (default `false`; when `true`, every toast shows an always-visible close control unless its own `closable` option overrides). Exposes a scoped `default` slot (`{ toast, dismiss }`) for a bespoke body; falls back to composing `ToastItem` from the store entry. This is the public root attached to the compound as `Toast.Toaster`.
- `toast-item/toast-item.vue` — a single notification card (outer flex row, `items-center` so the content and its `trailing` action/close share one centered line; the leading icon and the content column sit in an inner `items-start` group so the typed icon aligns to the title's line — its single line on a one-line toast, the first line on a multi-line one — instead of to the outer row, which the 28px action/close control would otherwise stretch; the `loading` `Spinner` keeps `self-center`. The `trailing` region carries a negative block margin (`-my-(--spacing-xxs)`) so that 28px control does not inflate a one-line card, and a negative inline-end margin (`-mr-(--spacing-xs)`) so the text action's label ends optically flush with the card's padding instead of inset by the button's own padding; height adapts to content). All typography and spacing come from tokens (`text-label-md` / `text-body-xs`, `var(--spacing-*)`) — no raw sizes or line-heights. An optional leading severity icon — a PrimeIcons glyph by `type` sized with the `text-label-md` token to match the title (`pi pi-check` / `pi pi-info-circle` / `pi pi-exclamation-triangle` / `pi pi-exclamation-circle`); the neutral `default` type has **no** icon, and `loading` renders a `Spinner`. Followed by a content column (`Title` + optional `Description`) in the `default` slot, and a right-aligned `trailing` slot for the optional `Action` and the `Close` control. `role="status"` (or `role="alert"` for `error`/`warning`). Props `type?: ToastType` (default `'default'`). Slots: `default` (title/description) and `trailing` (action/close); the `Toaster` fills both, standalone it renders just the shell. Reflects `data-type`.
- `toast-title/toast-title.vue` — the primary line of a toast (`text-body-xs` `var(--text-default)`). Renders its default slot as the title text; standalone markup + testId justify the part.
- `toast-description/toast-description.vue` — the supporting line below the title (`text-body-xs` `var(--text-muted)`). Renders its default slot; standalone markup + testId justify the part.
- `toast-action/toast-action.vue` — the inline action control, rendered as the webkit `Button` (`kind="transparent"`, `size="small"`). Prop `label: string`. Emits `click: [event: MouseEvent]`. Justified because it owns the button wiring + a11y for the action affordance.
- `toast-close/toast-close.vue` — the dismiss control, rendered as the webkit `IconButton` (`pi pi-times`, `kind="transparent"`, `size="small"`, `aria-label="Close notification"`). Emits `click: [event: MouseEvent]`. Justified because it owns its glyph, touch target, focus ring, and a11y label.

The imperative API is backed by a small reactive store composable, declared here (undeclared composables are forbidden):

- `use-toast-store.ts` — a singleton reactive store (one module-level reactive list of toast entries) exposing `add(entry)`, `update(id, patch)`, `dismiss(id?)`, and the reactive `toasts` list. The exported `toast()` function and its shortcuts (`success`/`error`/`info`/`warning`/`loading`/`promise`/`dismiss`) are thin wrappers over `add`/`update`/`dismiss`; the `Toaster` injects the same store to render the stack. Lives beside `injection-key.ts` at the component root (one directory up from each sub-component).

## States

- `data-type` on `ToastItem` (and mirrored on the `Toaster`'s items): `default` | `success` | `info` | `warning` | `error` | `loading`. Drives the leading icon and its severity color (the `-contrast` icon token).
- `data-position` on the `Toaster` container: one of the six `position` values; drives the fixed anchoring (`top`/`bottom` × `left`/`center`/`right`) and the enter/leave translate direction.
- `data-expanded` on the `Toaster` container mirrors the `expand` prop (`true` when expanded).
- The dismiss control (`ToastClose`) renders, and is **always visible**, only when `closable` is set — the per-toast `closable` option, or the Toaster's `closable` default (the per-toast option overrides). When unset, no close control is shown.
- `aria-live` on the region: `polite` by default, `assertive` while an `error` toast is present; `role="status"` per item, `role="alert"` for `error`/`warning`. Focus is never stolen (the region is not focused on mount).
- Visual states on interactive controls (`ToastAction`, `ToastClose`): `default`, `hover`, `focus-visible`, `active` (inherited from `Button` / `IconButton`).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1` on the action and close controls (inherited from `Button` / `IconButton`).
- Keyboard map: `Tab` reaches the action then the close control of each visible toast; `Enter`/`Space` activates them. The region itself is not a focus trap and is not focused on mount, so toasts never steal focus from the current task.
- ARIA: the region carries `aria-live` (`polite`, or `assertive` while an `error` toast is present) and `aria-atomic="false"`; each item is `role="status"` (or `role="alert"` for `error`/`warning`); the close control has an `aria-label`; the severity icon is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted description text and severity icons.
- `motion-reduce:animate-none` on the enter/leave fades and `motion-reduce:transition-none` on the move transition.
- Touch target ≥40×40 px on the action and close controls (from `Button` / `IconButton` `size="small"`).
- Teleported content: each teleported toaster region binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: { label: 'Undo', onClick: () => {} }
    })
</script>

<template>
  <Toaster position="bottom-right" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
```

### Types

```vue
<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Toaster position="bottom-right" />
  <div class="flex flex-wrap justify-center gap-2">
    <Button
      label="Default"
      kind="secondary"
      @click="
        () =>
          toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
    <Button
      label="Success"
      kind="primary"
      @click="
        () =>
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Info"
      kind="outlined"
      @click="
        () =>
          toast.info('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Warning"
      kind="outlined"
      @click="
        () =>
          toast.warning('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Error"
      kind="danger"
      @click="
        () =>
          toast.error('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Loading"
      kind="transparent"
      @click="
        () => toast.loading('Loading…', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
  </div>
</template>
```

### WithDescription

```vue
<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM'
    })
</script>

<template>
  <Toaster position="bottom-right" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
```
