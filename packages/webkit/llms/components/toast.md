# Toast

> Use Toast for a short confirmation after an action that disappears on its own; a persistent message on a page or section (a banner, a notice) is an Alert. A transient, non-blocking notification system: mount the `<Toaster>` region **once** near the application root, then raise notifications imperatively from anywhere via the exported `toast()` function (`toast('Saved')`) and its type shortcuts (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.loading`, `toast.progress`, `toast.promise`, `toast.dismiss`). Each notification is a self-dismissing card that stacks in a corner, animates in and out, and is announced to assistive technology — without stealing focus. Unlike the sibling [`Alert`](alert.md), which is an **inline** banner the consumer places in the document flow and controls with `v-model`-style props, Toast is a **transient overlay** stack driven by an imperative call and a shared reactive store, so the call site needs no local visibility state and no markup of its own. The card surface, typography, and severity icons follow the Figma design (see `figma` in the frontmatter). The interaction model follows the established mount-once toast pattern (a single anchored region + imperative trigger + auto-dismiss stack that groups collapsed and expands on hover), built on our tokens, our semantic animation utilities, and our composition/compound-API conventions per [`.claude/rules/migration.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/migration.md); nothing is inherited from any external library. Each severity tints only its leading **icon** via the matching `-contrast` token (`var(--success-foreground)` / `var(--warning-foreground)` / `var(--danger-foreground)` / `var(--info-foreground)`) over the shared `var(--bg-surface-raised)` surface.

- Import: `import ToastRoot from '@aziontech/webkit/toast-root'`
- Compound import (dot notation, not tree-shakeable): `import Toast from '@aziontech/webkit/toast'`
- Category: feedback · Surface: app · Structure: composition
- API as JSON: [toast.json](toast.json)

## Setup

One-time app-level wiring before the first toast() call — service (recommended): import { ToastPlugin } from '@aziontech/webkit/toast' and chain .use(ToastPlugin) onto createApp() in the app entry; the plugin mounts the toast region automatically. Alternative: mount a Toaster component once near the app root. `webkit doctor` flags toast usage with no wired region.

## When to use

- Confirming the result of an action that finished out of view or in the background: saved, deployed, copied.
- Following an async operation from start to finish with `toast.promise`, or `toast.loading` plus a dismiss by id.
- Following an operation whose completion is known (an upload, an import, a migration) with `toast.progress`: a bar and its percentage, updated in place by id, with a Cancel action.
- A short notice that is not tied to one place on the page and can disappear on its own.

## Do

- Mount `Toaster` once at the app root (in `App.vue`, before the layout or `RouterView`), or install `ToastPlugin`. Never render a `Toaster` in a page, a view or a page-body block: only the first `Toaster` to mount is active and it gives the role up when it unmounts, so a page's copy is either inert or, when it mounted first, silences every toast in the app once the user leaves that page. A page only imports `toast`. A full page routed outside the console layout is still a route of the same app, not a root. `check:blocks` fails a block outside `blocks/shells/` that renders one.
- Use the typed shortcuts (`toast.success`, `toast.error`, …). The type sets the icon and how it is announced: `toast.error` (severity `danger`) interrupts the screen reader through the Toaster's assertive live region, every other type waits its turn in the polite one. Both regions are fixed, so no region ever switches between polite and assertive (switching made screen readers drop or repeat the stack).
- Keep the message text to one line and move detail to `description`. Offer at most two actions: one `action`, or `actions` with two entries when a failure has two ways forward (**Edit** and **Redeploy**).
- A toast with an `action` (or `actions`) stays at least 10 s unless it sets its own `duration`, so a keyboard or screen-reader user has time to reach the action.
- `duration: 0` keeps a toast until it is dismissed. Keep the returned id and call `toast.dismiss(id)`, or pass the same `id` to update the toast in place.
- Use `toast.progress(message, value, { id })` when the percentage is known; keep calling it with the same `id` as the value moves (the card updates in place, no new announcement per step), and finish with `toast.success` or `toast.error` on that `id`. Use `toast.loading` when it is not known. Give a long operation a Cancel `action`.
- Don't make a toast the only path to an important action. It auto-dismisses and never takes focus.

## Don’t

- The message must stay visible next to the content it concerns → use `alert`.
- The user must decide something before continuing → use `dialog`.
- Validation feedback for a single field → use `field-error`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [alert](alert.md) — inline severity banner placed in the page flow; it stays until it is closed.
- [dialog](dialog.md) — blocking modal for decisions and confirmations.
- [spinner](spinner.md) — rendered while a toast is `loading`.
- [progress](progress.md) — rendered under the copy of a `toast.progress` toast.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `position` | `'top-start' \| 'top-center' \| 'top-end' \| 'bottom-start' \| 'bottom-center' \| 'bottom-end'` | `'bottom-end'` | false | Corner (or edge-center) the stack is anchored to; `start` and `end` follow the reading direction. |
| `duration` | `number` | `4000` | false | Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. |
| `max` | `number` | `3` | false | Maximum simultaneously visible toasts per corner before the rest queue behind. |
| `expand` | `boolean` | `false` | false | Lay the stack out fully expanded with a gap; when `false` the resting stack overlaps into a peek. |
| `closable` | `boolean` | `false` | false | Show an always-visible close control on every toast; a per-toast `closable` option overrides it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { toast, dismiss } | Optional override for a single toast's body. `toast` is the store entry (`{ id, severity, loading?, message, description?, action?, actions?, duration, progress? }`); `dismiss` dismisses that entry. When omitted, the `Toaster` composes `ToastItem` + `Title`/`Description`/`Action`/`Close` from the entry, rendering one `Action` per entry of `actions` (the first two) or the single `action`, and a `Progress` row when the entry has `progress`. |

## Sub-component imports

- `@aziontech/webkit/toast-item`
- `@aziontech/webkit/toast-title`
- `@aziontech/webkit/toast-description`
- `@aziontech/webkit/toast-action`
- `@aziontech/webkit/toast-close`

## Sub-components

- `toast.vue` — the mount-once region, at the component root. `<Teleport to="body">` + a fixed-positioned, `position`-anchored container that renders the live `<TransitionGroup>` stack of `ToastItem`s from the injected store; a region for each of the six positions is in the DOM (empty, zero height) before the first toast. The visible regions are not live regions: next to them the Toaster keeps two visually hidden live regions, `__live-polite` (`role="status"`, `aria-live="polite"`) and `__live-assertive` (`role="alert"`, `aria-live="assertive"`), both `aria-atomic="true"` and in the DOM before the first toast. When a toast arrives, or its message, description or severity changes, its text (message, then description) is written to `__live-assertive` for `danger` and to `__live-polite` for every other severity; progress steps and other in-place updates are not announced. A region that holds toasts is `role="region"` named `Notifications (Alt+T)` from the locale catalog (`toast.region`); an empty one has no role, so empty corners add no landmarks. Props `position?: ToastPosition` (default `'bottom-end'`), `duration?: number` (default `4000`, ms — the stack-wide default each toast inherits unless its own `duration` overrides), `max?: number` (cap the number of simultaneously visible toasts; the rest queue behind until a slot frees), `expand?: boolean` (when `false`, the default, stacked toasts overlap into a peek; when `true`, they lay out fully expanded with a gap), `closable?: boolean` (default `false`; when `true`, every toast shows an always-visible close control unless its own `closable` option overrides). Exposes a scoped `default` slot (`{ toast, dismiss }`) for a bespoke body; falls back to composing `ToastItem` from the store entry. This is the public root attached to the compound as `Toast`.
- `toast-item/toast-item.vue` — a single notification card (outer flex row, `items-center` so the content and its `trailing` action/close share one centered line; the leading icon and the content column sit in an inner `items-start` group so the typed icon aligns to the title's line — its single line on a one-line toast, the first line on a multi-line one — instead of to the outer row, which the 28px action/close control would otherwise stretch; the `loading` `Spinner` keeps `self-center`. The `trailing` region carries a negative block margin (`-my-(--spacing-2xs)`) so that 28px control does not inflate a one-line card, and a negative inline-end margin (`-mr-(--spacing-xs)`) so the text action's label ends optically flush with the card's padding instead of inset by the button's own padding; height adapts to content). All typography and spacing come from tokens (`text-label-md` / `text-body-xs`, `var(--spacing-*)`) — no raw sizes or line-heights. An optional leading severity icon — an Azion glyph by `severity` sized with the `text-label-md` token to match the title (`az az-check` / `az az-circle-info` / `az az-triangle-alert` / `az az-circle-alert`); the `neutral` severity has **no** icon, and a `loading` toast renders a `Spinner` in its place. Followed by a content column (`Title` + optional `Description`) in the `default` slot, and a right-aligned `trailing` slot for the optional `Action` and the `Close` control. `role="status"` (or `role="alert"` for `danger`). Props `severity?: ToastSeverity` (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`, default `'neutral'`) and `loading?: boolean` (default `false`; a spinner replaces the leading icon, `aria-busy`). Slots: `default` (title/description) and `trailing` (action/close); the `Toaster` fills both, standalone it renders just the shell. Reflects `data-severity` and `data-loading`.
- `toast-title/toast-title.vue` — the primary line of a toast (`text-body-xs` `var(--text-default)`). Renders its default slot as the title text; standalone markup + testId justify the part.
- `toast-description/toast-description.vue` — the supporting line below the title (`text-body-xs` `var(--text-muted)`). Renders its default slot; standalone markup + testId justify the part.
- `toast-action/toast-action.vue` — the inline action control, rendered as the webkit `Button` (`variant="ghost"`, `size="small"`). Prop `label: string`. Emits `click: [event: MouseEvent]`. Justified because it owns the button wiring + a11y for the action affordance.
- `toast-close/toast-close.vue` — the dismiss control, rendered as the webkit `IconButton` (`az az-x`, `variant="ghost"`, `size="small"`, `aria-label="Close notification"`). Emits `click: [event: MouseEvent]`. Justified because it owns its glyph, touch target, focus ring, and a11y label.

The imperative API is backed by a small reactive store composable, declared here (undeclared composables are forbidden):

- `composables/use-toast-store.ts` — a singleton reactive store (one module-level reactive list of toast entries) exposing `add(entry)`, `update(id, patch)`, `dismiss(id?)`, and the reactive `toasts` list. The exported `toast()` function and its shortcuts (`success`/`error`/`info`/`warning`/`loading`/`progress`/`promise`/`dismiss`) are thin wrappers over `add`/`update`/`dismiss`; the `Toaster` injects the same store to render the stack. Lives in the component's `composables/` folder, beside `injection-key.ts`.

## States

- `data-severity` on `ToastItem` (and mirrored on the `Toaster`'s items): `neutral` | `info` | `success` | `warning` | `danger`. Drives the leading icon and its severity color (the `-foreground` icon token).
- `data-loading` on `ToastItem` while the toast is `loading` (`toast.loading`, a pending `toast.promise`); the spinner replaces the icon.
- `toast.error()` keeps its Sonner-style name and raises a `danger` toast.
- `data-removing` on a `Toaster` item while its exit transition runs (switches the transition to the exit token).
- Progress: an entry with `progress` (set by `toast.progress(message, value, options?)`, which defaults `duration` to `0`) renders `__progress` under the copy: a rounded `Progress` bar named by the toast message (`role="progressbar"`, `aria-valuenow` clamped to 0–100) and the percentage formatted with `Intl.NumberFormat` (`style: 'percent'`) in the provider's locale, `aria-hidden` so the region does not announce every step. A later call with the same `id` replaces the entry in place; a typed toast with that `id` drops the bar.
- `data-position` on the `Toaster` container: one of the six `position` values; drives the fixed anchoring (`top`/`bottom` × `start`/`center`/`end`, where `start` is the left edge under `ltr` and the right edge under `rtl`) and the enter/leave translate direction.
- `data-state="open|closed"` on each `Toaster` region: `open` while the stack is laid out expanded (the `expand` prop, hover or focus), `closed` while it overlaps into a peek.
- The dismiss control (`ToastClose`) renders, and is **always visible**, only when `closable` is set — the per-toast `closable` option, or the Toaster's `closable` default (the per-toast option overrides). When unset, no close control is shown.
- Announcements go through the two hidden live regions: `danger` to `__live-assertive`, every other severity to `__live-polite`; items inside a Toaster carry no role of their own and the visible regions are not live, so each toast is announced once and never twice. A `ToastItem` rendered outside a Toaster keeps `role="status"` (or `role="alert"` for `danger`). Focus is never stolen (the region is not focused on mount). Tests: `toast.test.ts` › live region (spec), Escape dismisses the focused toast.
- Visual states on interactive controls (`ToastAction`, `ToastClose`): `default`, `hover`, `focus-visible`, `active` (inherited from `Button` / `IconButton`).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1` on the action and close controls (inherited from `Button` / `IconButton`).
- Keyboard map: `Alt+T` (the Sonner hotkey, matched on `event.code` so it works on every layout) moves focus to the front toast's first control (its action, else its close control, else the card itself); `Escape` while focus is inside a toast dismisses that toast and returns focus to the control that had it before `Alt+T`; `Tab` reaches the action then the close control of each visible toast; `Enter`/`Space` activates them. The region itself is not a focus trap and is not focused on mount, so toasts never steal focus from the current task.
- Timing (WCAG 2.2.1): auto-dismiss pauses while the pointer is over a region **and** while focus is inside it, and resumes when both leave; a toast with an action stays at least 10 s unless it sets its own `duration`.
- ARIA: `danger` toasts are announced assertively (`__live-assertive`, `role="alert"`), every other severity politely (`__live-polite`, `role="status"`); items inside a Toaster have no role (a standalone `ToastItem` is `role="status"`, or `role="alert"` for `danger`); the close control has an `aria-label`; the severity icon is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted description text and severity icons.
- `motion-reduce:animate-none` on the enter/leave fades and `motion-reduce:transition-none` on the move transition.
- Touch target ≥40×40 px on the action and close controls (from `Button` / `IconButton` `size="small"`).
- Progress: the bar is a `progressbar` named by the toast message; only the toast's arrival is announced, not each percentage step (the visible percentage is `aria-hidden`; the bar's value is read when the user reaches it).
- Teleported content: each teleported toaster region binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Right-to-left

- Layout: logical utilities only (`-me-`, `start-`, `gap`); each teleported region binds the provider's `dir`, and the `start`/`end` positions resolve against it (the provider's `dir`, else the document's), so `bottom-end` sits at the bottom right under `ltr` and the bottom left under `rtl`; the icon leads, the controls trail and the progress bar fills from the start edge under `dir="rtl"`.
- Icons: severity glyphs and the close `×` are not mirrored.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

| Key           | English source       | Override prop |
| ------------- | -------------------- | ------------- |
| `toast.close` | `Close notification` | —             |

- Formatting: the `toast.progress` percentage uses `Intl.NumberFormat` (`style: 'percent'`, no decimals) with the locale from `WebkitProvider`; messages, descriptions and action labels come from the consumer.

## Responsive

- Container queries: none; each region is 356 px wide, capped at `100vw` minus the edge inset.
- Narrow (≤ 640 px or a narrow container): the card fills the capped width; the copy wraps and the progress bar narrows.
- Touch: the action and close keep the `Button` / `IconButton` `small` sizes; the stack expands on hover and stays readable without it.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: { label: 'Undo', onClick: () => {} }
    })
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
```

### Severities

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'
</script>

<template>
  <Toaster position="bottom-end" />
  <div class="flex flex-wrap justify-center gap-2">
    <Button
      label="Default"
      variant="secondary"
      @click="
        () =>
          toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
    <Button
      label="Success"
      variant="primary"
      @click="
        () =>
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Info"
      variant="outline"
      @click="
        () =>
          toast.info('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Warning"
      variant="outline"
      @click="
        () =>
          toast.warning('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Error"
      variant="danger"
      @click="
        () =>
          toast.error('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Loading"
      variant="ghost"
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
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM'
    })
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
```
