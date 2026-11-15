---
name: toast
category: feedback
structure: composition
status: implemented
spec_version: 12
template: 2
setup: "One-time app-level wiring before the first toast() call — service (recommended): import { ToastPlugin } from '@aziontech/webkit/toast' and chain .use(ToastPlugin) onto createApp() in the app entry; the plugin mounts the toast region automatically. Alternative: mount a Toaster component once near the app root. `webkit doctor` flags toast usage with no wired region."
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-938
  node_id: 478:938
checksum: f3b6ca4beb927e6694f541d3bb2291b30700871805627284fbf1534a46a34b7c
created: 2026-06-23
last_updated: 2026-11-15
---

# Toast — Component Spec

## Purpose

Use Toast for a short confirmation after an action that disappears on its own; a persistent message on a page or section (a banner, a notice) is an Alert.

A transient, non-blocking notification system: mount the `<Toaster>` region **once** near the application root, then raise notifications imperatively from anywhere via the exported `toast()` function (`toast('Saved')`) and its type shortcuts (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.loading`, `toast.progress`, `toast.promise`, `toast.dismiss`). Each notification is a self-dismissing card that stacks in a corner, animates in and out, and is announced to assistive technology — without stealing focus. Unlike the sibling [`Alert`](./alert.md), which is an **inline** banner the consumer places in the document flow and controls with `v-model`-style props, Toast is a **transient overlay** stack driven by an imperative call and a shared reactive store, so the call site needs no local visibility state and no markup of its own.

The card surface, typography, and severity icons follow the Figma design (see `figma` in the frontmatter). The interaction model follows the established mount-once toast pattern (a single anchored region + imperative trigger + auto-dismiss stack that groups collapsed and expands on hover), built on our tokens, our semantic animation utilities, and our composition/compound-API conventions per [`.claude/rules/migration.md`](../.claude/rules/migration.md); nothing is inherited from any external library. Each severity tints only its leading **icon** via the matching `-contrast` token (`var(--success-foreground)` / `var(--warning-foreground)` / `var(--danger-foreground)` / `var(--info-foreground)`) over the shared `var(--bg-surface-raised)` surface.

## When to use

- Confirming the result of an action that finished out of view or in the background: saved, deployed, copied.
- Following an async operation from start to finish with `toast.promise`, or `toast.loading` plus a dismiss by id.
- Following an operation whose completion is known (an upload, an import, a migration) with `toast.progress`: a bar and its percentage, updated in place by id, with a Cancel action.
- A short notice that is not tied to one place on the page and can disappear on its own.

## When NOT to use

- The message must stay visible next to the content it concerns → use `alert`.
- The user must decide something before continuing → use `dialog`.
- Validation feedback for a single field → use `helper-text`.

## Related

- `alert` — inline severity banner placed in the page flow; it stays until it is closed.
- `dialog` — blocking modal for decisions and confirmations.
- `spinner` — rendered while a toast is `loading`.
- `progress` — rendered under the copy of a `toast.progress` toast.

## Best practices

- Mount `Toaster` once at the app root (in `App.vue`, before the layout or `RouterView`), or install `ToastPlugin`. Never render a `Toaster` in a page, a view or a page-body block: only the first `Toaster` to mount is active and it gives the role up when it unmounts, so a page's copy is either inert or, when it mounted first, silences every toast in the app once the user leaves that page. A page only imports `toast`. A full page routed outside the console layout is still a route of the same app, not a root. `check:blocks` fails a block outside `blocks/shells/` that renders one.
- Use the typed shortcuts (`toast.success`, `toast.error`, …). The type sets the icon and how it is announced: `toast.error` (severity `danger`) interrupts the screen reader through the Toaster's assertive live region, every other type waits its turn in the polite one. Both regions are fixed, so no region ever switches between polite and assertive (switching made screen readers drop or repeat the stack).
- Keep the message text to one line and move detail to `description`. Offer at most two actions: one `action`, or `actions` with two entries when a failure has two ways forward (**Edit** and **Redeploy**).
- A toast with an `action` (or `actions`) stays at least 10 s unless it sets its own `duration`, so a keyboard or screen-reader user has time to reach the action.
- `duration: 0` keeps a toast until it is dismissed. Keep the returned id and call `toast.dismiss(id)`, or pass the same `id` to update the toast in place.
- Use `toast.progress(message, value, { id })` when the percentage is known; keep calling it with the same `id` as the value moves (the card updates in place, no new announcement per step), and finish with `toast.success` or `toast.error` on that `id`. Use `toast.loading` when it is not known. Give a long operation a Cancel `action`.
- Don't make a toast the only path to an important action. It auto-dismisses and never takes focus.

## Usage

Two interchangeable usage styles drive the **same** singleton stack — use whichever fits the call site.

**1. Direct** — mount `<Toaster>` once near the app root, then `import { toast }` and call it from anywhere (a component, a Pinia store, a plain util):

```vue
<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <!-- Mount the region ONCE, near the app root -->
  <Toaster
    position="bottom-right"
    :duration="4000"
  />

  <!-- Raise a toast from anywhere -->
  <Button
    label="Save"
    @click="() => toast.success('Saved', { description: 'Your changes are live.' })"
  />
</template>
```

**2. Service (install once in main.js)** — `app.use(ToastPlugin)` mounts the toast region automatically on a dedicated host element (no manual `<Toaster />` needed; the vnode shares the app's context, and the host is torn down on `app.unmount()`), registers `<Toaster>` as a global component, and exposes the imperative API as `this.$toast` (Options API / templates) and through `inject`; inside `setup` use `useToast()` to get the same API. Region defaults (position, duration, …) ride the plugin options. The plugin's region mounts at install, before any component, so it is the active one; a second `<Toaster />` anywhere else is inert at best, and when the app has no plugin, a page's `Toaster` that mounts before the root one takes the role and drops it on unmount, leaving the app with no region. SSR-safe: without a DOM the auto-mount is skipped, and `toast()` / `update` are no-ops on the server, so the module-scope store never holds entries or timers shared across server requests:

```ts
// main.js
import { ToastPlugin } from '@aziontech/webkit/toast'
app.use(ToastPlugin, { position: 'bottom-right' })
```

```vue
<script setup>
  import { useToast } from '@aziontech/webkit/toast'
  const toast = useToast()
</script>
```

The root is also reachable through the compound default export (`import Toast from '@aziontech/webkit/toast'` → `<Toast>`, `<Toast.Item>`, …) for the per-part composition shown at the end of this section.

**Public API.** Raise toasts with `toast()` (and its shortcuts) from anywhere, or with `useToast()` inside `setup` (it returns the same `toast`); mount the region once with `ToastPlugin` or one `<Toaster>`. That is the whole consumer surface. `toastStore` / `useToastStore` are the internal store the `Toaster` renders from: they stay exported for compatibility, but they are not part of the documented API, and `toast(message, { id })` (update in place) plus `toast.dismiss(id?)` cover every change a consumer needs.

The imperative surface — `toast(message, options?)` returns the toast `id` (a string); the shortcuts share the same signature and the store auto-dismisses each entry after `duration` (per-toast `duration` overrides the Toaster default; `duration: 0` keeps it until dismissed):

```ts
import { toast } from '@aziontech/webkit/toast'

const id = toast('Saved') // neutral severity
toast.success('Deployed', { description: 'edge-01 live' }) // typed shortcut
toast.error('Failed', { action: { label: 'Retry', onClick: () => retry() } })
toast.error('Deploy failed', {
  actions: [
    { label: 'Edit', onClick: () => edit() },
    { label: 'Redeploy', onClick: () => redeploy() }
  ]
}) // up to two actions; `actions` wins over `action`
toast.loading('Uploading…', { duration: 0 }) // persists until dismissed
toast('Heads up', { position: 'top-center' }) // anchor this toast to a corner (overrides Toaster)
toast('Saved', { closable: true }) // always-visible close control (overrides Toaster)
toast('Saved', { onClose: () => track('dismissed') }) // callback fired when the toast is dismissed
const upload = toast.progress('Uploading site-assets.zip', 40, {
  description: '19 of 48 MB',
  action: { label: 'Cancel', onClick: () => cancel() }
}) // persists; call again with { id: upload } to move the bar in place
toast.success('site-assets.zip uploaded', { id: upload }) // finishes the same toast
toast.promise(deploy(), { loading: 'Deploying…', success: 'Deployed', error: 'Failed' })
toast.dismiss(id) // dismiss one; toast.dismiss() clears all
```

Each toast can override the Toaster's anchor with its own `position`; the Toaster groups toasts by corner and renders one fixed stack per corner in use.

Each part is also a standalone import (`import ToastItem from '@aziontech/webkit/toast-item'`, …) — the tree-shaking path. Consumers rarely compose the item parts by hand; the `Toaster` renders them from the store. The sub-components are exposed for advanced cases that render a bespoke toast body via the `Toaster`'s `default` slot.

```vue
<script setup>
  import Toast from '@aziontech/webkit/toast'
</script>

<template>
  <Toast position="top-center">
    <template #default="{ toast: t, dismiss }">
      <Toast.Item :severity="t.severity">
        <Toast.Title>{{ t.message }}</Toast.Title>
        <Toast.Description v-if="t.description">{{ t.description }}</Toast.Description>
        <Toast.Action
          v-if="t.action"
          :label="t.action.label"
          @click="t.action.onClick"
        />
        <Toast.Close @click="dismiss" />
      </Toast.Item>
    </template>
  </Toast>
</template>
```

## Sub-components

<!-- Each sub-component lives in its own folder under the root.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Toaster element).
     Compound API: index.ts (Object.assign; vue-tsc emits index.d.ts) attaches every sub-component
     to the root as `Toast` / `Toast.Item` / `Toast.Title` / … (PascalCase root required),
     and ALSO re-exports the imperative `toast` function (named export) + the reactive store.
     See `.claude/rules/compound-api.md`.
     There is NO `Trigger` / `Content`: a toast has no disclosure open/closed state — its lifecycle
     is presence in the stack, expressed via `data-severity` and enter/leave transitions. -->

- `toast.vue` — the mount-once region, at the component root. `<Teleport to="body">` + a fixed-positioned, `position`-anchored container that renders the live `<TransitionGroup>` stack of `ToastItem`s from the injected store; a region for each of the six positions is in the DOM (empty, zero height) before the first toast. The visible regions are not live regions: next to them the Toaster keeps two visually hidden live regions, `__live-polite` (`role="status"`, `aria-live="polite"`) and `__live-assertive` (`role="alert"`, `aria-live="assertive"`), both `aria-atomic="true"` and in the DOM before the first toast. When a toast arrives, or its message, description or severity changes, its text (message, then description) is written to `__live-assertive` for `danger` and to `__live-polite` for every other severity; progress steps and other in-place updates are not announced. A region that holds toasts is `role="region"` named `Notifications (Alt+T)` from the locale catalog (`toast.region`); an empty one has no role, so empty corners add no landmarks. Props `position?: ToastPosition` (default `'bottom-right'`), `duration?: number` (default `4000`, ms — the stack-wide default each toast inherits unless its own `duration` overrides), `max?: number` (cap the number of simultaneously visible toasts; the rest queue behind until a slot frees), `expand?: boolean` (when `false`, the default, stacked toasts overlap into a peek; when `true`, they lay out fully expanded with a gap), `closable?: boolean` (default `false`; when `true`, every toast shows an always-visible close control unless its own `closable` option overrides). Exposes a scoped `default` slot (`{ toast, dismiss }`) for a bespoke body; falls back to composing `ToastItem` from the store entry. This is the public root attached to the compound as `Toast`.
- `toast-item/toast-item.vue` — a single notification card (outer flex row, `items-center` so the content and its `trailing` action/close share one centered line; the leading icon and the content column sit in an inner `items-start` group so the typed icon aligns to the title's line — its single line on a one-line toast, the first line on a multi-line one — instead of to the outer row, which the 28px action/close control would otherwise stretch; the `loading` `Spinner` keeps `self-center`. The `trailing` region carries a negative block margin (`-my-(--spacing-2xs)`) so that 28px control does not inflate a one-line card, and a negative inline-end margin (`-mr-(--spacing-xs)`) so the text action's label ends optically flush with the card's padding instead of inset by the button's own padding; height adapts to content). All typography and spacing come from tokens (`text-label-md` / `text-body-xs`, `var(--spacing-*)`) — no raw sizes or line-heights. An optional leading severity icon — an Azion glyph by `severity` sized with the `text-label-md` token to match the title (`ai ai-check` / `ai ai-circle-info` / `ai ai-triangle-alert` / `ai ai-circle-alert`); the `neutral` severity has **no** icon, and a `loading` toast renders a `Spinner` in its place. Followed by a content column (`Title` + optional `Description`) in the `default` slot, and a right-aligned `trailing` slot for the optional `Action` and the `Close` control. `role="status"` (or `role="alert"` for `danger`). Props `severity?: ToastSeverity` (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`, default `'neutral'`) and `loading?: boolean` (default `false`; a spinner replaces the leading icon, `aria-busy`). Slots: `default` (title/description) and `trailing` (action/close); the `Toaster` fills both, standalone it renders just the shell. Reflects `data-severity` and `data-loading`.
- `toast-title/toast-title.vue` — the primary line of a toast (`text-body-xs` `var(--text-default)`). Renders its default slot as the title text; standalone markup + testId justify the part.
- `toast-description/toast-description.vue` — the supporting line below the title (`text-body-xs` `var(--text-muted)`). Renders its default slot; standalone markup + testId justify the part.
- `toast-action/toast-action.vue` — the inline action control, rendered as the webkit `Button` (`kind="transparent"`, `size="small"`). Prop `label: string`. Emits `click: [event: MouseEvent]`. Justified because it owns the button wiring + a11y for the action affordance.
- `toast-close/toast-close.vue` — the dismiss control, rendered as the webkit `IconButton` (`ai ai-x`, `kind="transparent"`, `size="small"`, `aria-label="Close notification"`). Emits `click: [event: MouseEvent]`. Justified because it owns its glyph, touch target, focus ring, and a11y label.

The imperative API is backed by a small reactive store composable, declared here (undeclared composables are forbidden):

- `composables/use-toast-store.ts` — a singleton reactive store (one module-level reactive list of toast entries) exposing `add(entry)`, `update(id, patch)`, `dismiss(id?)`, and the reactive `toasts` list. The exported `toast()` function and its shortcuts (`success`/`error`/`info`/`warning`/`loading`/`progress`/`promise`/`dismiss`) are thin wrappers over `add`/`update`/`dismiss`; the `Toaster` injects the same store to render the stack. Lives in the component's `composables/` folder, beside `injection-key.ts`.

<!-- Resulting layout:

  packages/webkit/src/components/feedback/toast/
  ├── toast.vue            (root region — Teleport + TransitionGroup + polite and assertive live regions)
  ├── index.ts               (compound: Object.assign attaches sub-components + re-exports `toast`; vue-tsc emits index.d.ts)
  ├── injection-key.ts       (shared provide/inject key for the store)
  ├── composables/           { use-toast-store.ts — singleton reactive store backing toast() }
  ├── toast-item/            { toast-item.vue }
  ├── toast-title/           { toast-title.vue }
  ├── toast-description/     { toast-description.vue }
  ├── toast-action/          { toast-action.vue }
  └── toast-close/           { toast-close.vue }

  Public exports stay flat: ./toast (→ index.ts), ./toast-root (→ toast.vue), ./toast-item, ./toast-title,
  ./toast-description, ./toast-action, ./toast-close (each → its .vue).
  The root binding for dot-notation is PascalCase `Toast`; the same component is the named export `Toaster`, the mount-once region (6.0 removed its `Toaster` member, a second name for the root). -->

## Props

<!-- Root <Toaster> element only (reached as `Toast`). Sub-component props are listed in the Sub-components section.
     The imperative `toast()` function and its options object are documented in Usage and Sub-components. -->

| Prop       | Type                                                                                              | Default          | Required | JSDoc                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------- | ---------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | false    | Corner (or edge-center) the stack is anchored to.                                                                                  |
| `duration` | `number`                                                                                          | `4000`           | false    | Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. |
| `max`      | `number`                                                                                          | `3`              | false    | Maximum simultaneously visible toasts per corner before the rest queue behind.                                                     |
| `expand`   | `boolean`                                                                                         | `false`          | false    | Lay the stack out fully expanded with a gap; when `false` the resting stack overlaps into a peek.                                  |
| `closable` | `boolean`                                                                                         | `false`          | false    | Show an always-visible close control on every toast; a per-toast `closable` option overrides it.                                   |

## Events

<!-- The Toaster has no DOM events of its own: it is driven by the imperative store, not by consumer-bound listeners.
     Item-level events (action click, close) live on the sub-components (see Sub-components). -->

| Event  | Payload | Notes                                                                                                    |
| ------ | ------- | -------------------------------------------------------------------------------------------------------- |
| _none_ | —       | The `Toaster` is store-driven; it raises no events. Item actions emit from `ToastAction` / `ToastClose`. |

## Slots

| Slot      | Scope                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | `{ toast, dismiss }` | Optional override for a single toast's body. `toast` is the store entry (`{ id, severity, loading?, message, description?, action?, actions?, duration, progress? }`); `dismiss` dismisses that entry. When omitted, the `Toaster` composes `ToastItem` + `Title`/`Description`/`Action`/`Close` from the entry, rendering one `Action` per entry of `actions` (the first two) or the single `action`, and a `Progress` row when the entry has `progress`. |

## States

- `data-severity` on `ToastItem` (and mirrored on the `Toaster`'s items): `neutral` | `info` | `success` | `warning` | `danger`. Drives the leading icon and its severity color (the `-foreground` icon token).
- `data-loading` on `ToastItem` while the toast is `loading` (`toast.loading`, a pending `toast.promise`); the spinner replaces the icon.
- `toast.error()` keeps its Sonner-style name and raises a `danger` toast.
- `data-removing` on a `Toaster` item while its exit transition runs (switches the transition to the exit token).
- Progress: an entry with `progress` (set by `toast.progress(message, value, options?)`, which defaults `duration` to `0`) renders `__progress` under the copy: a rounded `Progress` bar named by the toast message (`role="progressbar"`, `aria-valuenow` clamped to 0–100) and the percentage formatted with `Intl.NumberFormat` (`style: 'percent'`) in the provider's locale, `aria-hidden` so the region does not announce every step. A later call with the same `id` replaces the entry in place; a typed toast with that `id` drops the bar.
- `data-position` on the `Toaster` container: one of the six `position` values; drives the fixed anchoring (`top`/`bottom` × `left`/`center`/`right`) and the enter/leave translate direction.
- `data-state="open|closed"` on each `Toaster` region: `open` while the stack is laid out expanded (the `expand` prop, hover or focus), `closed` while it overlaps into a peek.
- The dismiss control (`ToastClose`) renders, and is **always visible**, only when `closable` is set — the per-toast `closable` option, or the Toaster's `closable` default (the per-toast option overrides). When unset, no close control is shown.
- Announcements go through the two hidden live regions: `danger` to `__live-assertive`, every other severity to `__live-polite`; items inside a Toaster carry no role of their own and the visible regions are not live, so each toast is announced once and never twice. A `ToastItem` rendered outside a Toaster keeps `role="status"` (or `role="alert"` for `danger`). Focus is never stolen (the region is not focused on mount). Tests: `toast.test.ts` › live region (spec), Escape dismisses the focused toast.
- Visual states on interactive controls (`ToastAction`, `ToastClose`): `default`, `hover`, `focus-visible`, `active` (inherited from `Button` / `IconButton`).

## Motion & Animations

Toast motion reads its **speeds and curves only from the foundation** (`duration` / `curve` in `packages/theme/src/tokens/primitives/animations/animate.js`, imported as `@aziontech/theme/animations`) as the `duration-*` / `ease-*` utilities (`duration-moderate-02`, `duration-slow-01`, `ease-productive-entrance`, `ease-productive-exit`). The transition is a class, never an inline `transition` style, so `motion-reduce:transition-none` on the same element wins under `prefers-reduced-motion`. Only the geometry (translate, scale, height) is inline. `toast/presets/transitions.ts` keeps the exit duration for the deferred unmount (`TOAST_UNMOUNT_MS`). No component-local `@keyframes`.

| Trigger                                                  | Animation / Transition                                                                                                                                                                                                               | Token (foundation utility)                                 | Reduced-motion fallback                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------- |
| toast enters the stack                                   | `transition-[transform,opacity,height]` on `transform` + `opacity` + `height`: slides in from the anchored edge (off-edge `translateY` → `0`) while fading in                                                                        | `duration['moderate-02']` + `curve['productive-entrance']` | `motion-reduce:transition-none` (instant) |
| toast leaves the stack                                   | `data-[removing]:duration-slow-01 data-[removing]:ease-productive-exit` on `transform` + `opacity` + `height`: slides back off the anchored edge while fading out; DOM unmount deferred (`TOAST_UNMOUNT_MS`) until the exit finishes | `duration['slow-01']` + `curve['productive-exit']`         | `motion-reduce:transition-none` (instant) |
| stack reflows when a toast is added / removed / expanded | `transition-[height]` on the region container and `transition-[transform,opacity,height]` on each resting card                                                                                                                       | `duration['moderate-02']` + `curve['productive-entrance']` | `motion-reduce:transition-none`           |

<!-- Enter/leave/reflow apply the foundation `duration`/`curve` tokens as utilities (the
     geometry — directional translate + scale + height — is computed inline so the slide reads correctly from
     any of the six anchor positions); every motion-bearing element pairs with `motion-reduce:transition-none`
     on its class string, and no element sets an inline `transition`. A loading toast renders the webkit `Spinner` component (a continuous rotation with its
     own reduced-motion fallback) inside the `toast-item` sub-component. -->

## Tokens

| Region                      | Token (DESIGN.md)                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| toast surface               | `var(--bg-surface-raised)`                                                                           |
| toast border                | `var(--border-default)`                                                                              |
| border width                | `var(--border-width-default)`                                                                        |
| elevation                   | `var(--shadow-sm)`                                                                                   |
| shape                       | `var(--shape-control)`                                                                              |
| title typography            | `.text-label-md`                                                                                     |
| description typography      | `.text-body-xs`                                                                                      |
| title text                  | `var(--text-default)`                                                                                |
| description text            | `var(--text-muted)`                                                                                  |
| progress bar                | `Progress` (`kind="rounded"`, `size="small"`): `var(--bg-placeholder)` track, `var(--primary)` fill |
| progress percentage         | `.text-body-xs` · `var(--text-muted)` · `tabular-nums`                                               |
| progress row gap            | `var(--spacing-xs)`; `var(--spacing-2xs)` above                                                      |
| success icon                | `var(--success-foreground)`                                                                            |
| info icon                   | `var(--info-foreground)`                                                                               |
| warning icon                | `var(--warning-foreground)`                                                                            |
| error icon                  | `var(--danger-foreground)`                                                                             |
| padding                     | `var(--spacing-sm)`                                                                                  |
| gap                         | `var(--spacing-xs)`                                                                                  |
| stack inset (viewport edge) | `var(--spacing-md)`                                                                                  |
| ring                        | `var(--ring-color)`                                                                                  |

## Theme gaps

| Figma variable                                                                                           | Temporary primitive                                                                                                                           | Follow-up                                                                                         |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| directional slide-in/out for toasts (no `slide-up`/`slide-left`/`slide-right` in the semantic catalogue) | inline `transform` (computed geometry) + `duration-*` / `ease-*` transition utilities bound to the foundation tokens (enter / leave / reflow) | `TODO: add directional toast slide utilities to packages/theme/src/tokens/semantic/animations.js` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1` on the action and close controls (inherited from `Button` / `IconButton`).
- Keyboard map: `Alt+T` (the Sonner hotkey, matched on `event.code` so it works on every layout) moves focus to the front toast's first control (its action, else its close control, else the card itself); `Escape` while focus is inside a toast dismisses that toast and returns focus to the control that had it before `Alt+T`; `Tab` reaches the action then the close control of each visible toast; `Enter`/`Space` activates them. The region itself is not a focus trap and is not focused on mount, so toasts never steal focus from the current task.
- Timing (WCAG 2.2.1): auto-dismiss pauses while the pointer is over a region **and** while focus is inside it, and resumes when both leave; a toast with an action stays at least 10 s unless it sets its own `duration`.
- ARIA: `danger` toasts are announced assertively (`__live-assertive`, `role="alert"`), every other severity politely (`__live-polite`, `role="status"`); items inside a Toaster have no role (a standalone `ToastItem` is `role="status"`, or `role="alert"` for `danger`); the close control has an `aria-label`; the severity icon is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted description text and severity icons.
- `motion-reduce:animate-none` on the enter/leave fades and `motion-reduce:transition-none` on the move transition.
- Touch target ≥40×40 px on the action and close controls (from `Button` / `IconButton` `size="small"`).
- Progress: the bar is a `progressbar` named by the toast message; only the toast's arrival is announced, not each percentage step (the visible percentage is `aria-hidden`; the bar's value is read when the user reaches it).
- Teleported content: each teleported toaster region binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Internationalization

| Key           | English source       | Override prop |
| ------------- | -------------------- | ------------- |
| `toast.close` | `Close notification` | —             |

- Formatting: the `toast.progress` percentage uses `Intl.NumberFormat` (`style: 'percent'`, no decimals) with the locale from `WebkitProvider`; messages, descriptions and action labels come from the consumer.

## Right-to-left

- Layout: logical utilities only (`-me-`, `start-`, `gap`); each teleported region binds the provider's `dir`, so the icon leads, the controls trail and the progress bar fills from the start edge under `dir="rtl"`.
- Icons: severity glyphs and the close `×` are not mirrored.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: none; each region is 356 px wide, capped at `100vw` minus the edge inset.
- Narrow (≤ 640 px or a narrow container): the card fills the capped width; the copy wraps and the progress bar narrows.
- Touch: the action and close keep the `Button` / `IconButton` `small` sizes; the stack expands on hover and stays readable without it.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 9.95 KB gzip for `toast` (the compound `index.ts`) in `.size-limit.json`, `Progress` included.
- Runtime budget: an in-place `toast.progress` update re-renders one card; the stack never re-measures more than the cards whose height changed.
- Heavy parts: none.

## Examples

This component has no `kind`/`size` on its root, and it is driven imperatively rather than by props, so the canonical Types/Sizes/state stories do not apply to the root. Each story renders `<Toast />` once plus button(s) that call `toast(…)`, so the docs "Show code" is copy-paste runnable. Every story justifies its existence below.

- Default — a single `<Toast />` plus a button calling `toast('…')`; justified because it documents the minimal mount-once + imperative-call usage that is the component's whole point.
- Types — buttons triggering each `type` (`toast.success` / `toast.info` / `toast.warning` / `toast.error` / `toast.loading` / default); justified because the severity icons are a distinct axis (the equivalent of a composite Types story for an imperative API).
- WithDescription — a button raising a toast with the `description` option; justified because the two-line body (title + description) is a distinct layout the API explicitly supports.
- WithAction — a button raising a toast with the `action` option (label + `onClick`); justified because the inline action affordance (`ToastAction`) is a distinct behavior the API explicitly supports.
- Progress — a button starting a simulated upload followed with `toast.progress` and a Cancel action, finished with `toast.success` on the same id; justified because the progress row and the in-place update are a distinct layout and behavior the API exposes.
- Closable — a button raising a toast with the `closable` option; justified because the always-visible dismiss control (`ToastClose`) is a distinct affordance the API exposes (off by default).
- Positions — buttons that mount the stack at each of the six `position` values; justified because the anchoring is a distinct presentation axis (six mutually-exclusive corners) that the `position` prop exposes.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
