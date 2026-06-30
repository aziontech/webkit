---
name: toast
category: feedback
structure: composition
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-938
  node_id: 478:938
checksum: c68746e63dc5815cf542ed26f75b33bbec3b7749fb196ea5e8d78ac605ce5689
created: 2026-06-23
last_updated: 2026-06-29
---

# Toast — Component Spec

## Purpose

A transient, non-blocking notification system: mount the `<Toaster>` region **once** near the application root, then raise notifications imperatively from anywhere via the exported `toast()` function (`toast('Saved')`) and its type shortcuts (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.loading`, `toast.promise`, `toast.dismiss`). Each notification is a self-dismissing card that stacks in a corner, animates in and out, and is announced to assistive technology — without stealing focus. Unlike the sibling [`Message`](./message.md), which is an **inline** banner the consumer places in the document flow and controls with `v-model`-style props, Toast is a **transient overlay** stack driven by an imperative call and a shared reactive store, so the call site needs no local visibility state and no markup of its own.

The card surface, typography, and severity icons follow the Figma design (see `figma` in the frontmatter). The interaction model follows the established mount-once toast pattern (a single anchored region + imperative trigger + auto-dismiss stack that groups collapsed and expands on hover), built on our tokens, our semantic animation utilities, and our composition/compound-API conventions per [`.claude/rules/migration.md`](../.claude/rules/migration.md); nothing is inherited from any external library. Each severity tints only its leading **icon** via the matching `-contrast` token (`var(--success-contrast)` / `var(--warning-contrast)` / `var(--danger-contrast)` / `var(--info-contrast)`) over the shared `var(--bg-surface-raised)` surface.

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
  <Toaster position="bottom-right" :duration="4000" />

  <!-- Raise a toast from anywhere -->
  <Button label="Save" @click="() => toast.success('Saved', { description: 'Your changes are live.' })" />
</template>
```

**2. Service (install once in main.js)** — `app.use(ToastPlugin)` registers `<Toaster>` as a global component and exposes the imperative API as `this.$toast` (Options API / templates) and through `inject`; inside `setup` use `useToast()` to get the same API:

```ts
// main.js
import { ToastPlugin } from '@aziontech/webkit/toast'
app.use(ToastPlugin)
```

```vue
<script setup>
import { useToast } from '@aziontech/webkit/toast'
const toast = useToast()
</script>
```

The root is also reachable through the compound default export (`import Toast from '@aziontech/webkit/toast'` → `<Toast.Toaster>`, `<Toast.Item>`, …) for the per-part composition shown at the end of this section.

The imperative surface — `toast(message, options?)` returns the toast `id` (a string); the shortcuts share the same signature and the store auto-dismisses each entry after `duration` (per-toast `duration` overrides the Toaster default; `duration: 0` keeps it until dismissed):

```ts
import { toast } from '@aziontech/webkit/toast'

const id = toast('Saved')                                  // default type
toast.success('Deployed', { description: 'edge-01 live' }) // typed shortcut
toast.error('Failed', { action: { label: 'Retry', onClick: () => retry() } })
toast.loading('Uploading…', { duration: 0 })               // persists until dismissed
toast('Heads up', { position: 'top-center' })              // anchor this toast to a corner (overrides Toaster)
toast('Saved', { closable: true })                         // always-visible close control (overrides Toaster)
toast('Saved', { onClose: () => track('dismissed') })      // callback fired when the toast is dismissed
toast.promise(deploy(), { loading: 'Deploying…', success: 'Deployed', error: 'Failed' })
toast.dismiss(id)                                          // dismiss one; toast.dismiss() clears all
```

Each toast can override the Toaster's anchor with its own `position`; the Toaster groups toasts by corner and renders one fixed stack per corner in use.

Each part is also a standalone import (`import ToastItem from '@aziontech/webkit/toast-item'`, …) — the tree-shaking path. Consumers rarely compose the item parts by hand; the `Toaster` renders them from the store. The sub-components are exposed for advanced cases that render a bespoke toast body via the `Toaster`'s `default` slot.

```vue
<script setup>
import Toast from '@aziontech/webkit/toast'
</script>

<template>
  <Toast.Toaster position="top-center">
    <template #default="{ toast: t, dismiss }">
      <Toast.Item :type="t.type">
        <Toast.Title>{{ t.message }}</Toast.Title>
        <Toast.Description v-if="t.description">{{ t.description }}</Toast.Description>
        <Toast.Action v-if="t.action" :label="t.action.label" @click="t.action.onClick" />
        <Toast.Close @click="dismiss" />
      </Toast.Item>
    </template>
  </Toast.Toaster>
</template>
```

## Sub-components

<!-- Each sub-component lives in its own folder under the root, with its own package.json.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Toaster element).
     Compound API: index.ts (Object.assign; vue-tsc emits index.d.ts) attaches every sub-component
     to the root as `Toast.Toaster` / `Toast.Item` / `Toast.Title` / … (PascalCase root required),
     and ALSO re-exports the imperative `toast` function (named export) + the reactive store.
     See `.claude/rules/compound-api.md`.
     There is NO `Trigger` / `Content`: a toast has no disclosure open/closed state — its lifecycle
     is presence in the stack, expressed via `data-type` and enter/leave transitions. -->

- `toaster/toaster.vue` — the mount-once region. `<Teleport to="body">` + a fixed-positioned, `position`-anchored container that renders the live `<TransitionGroup>` stack of `ToastItem`s from the injected store, with `aria-live` (`polite`, or `assertive` when an `error` toast is present) and `aria-atomic="false"`. Props `position?: ToastPosition` (default `'bottom-right'`), `duration?: number` (default `4000`, ms — the stack-wide default each toast inherits unless its own `duration` overrides), `max?: number` (cap the number of simultaneously visible toasts; older ones drop when exceeded), `expand?: boolean` (when `false`, the default, stacked toasts overlap into a peek; when `true`, they lay out fully expanded with a gap), `closable?: boolean` (default `false`; when `true`, every toast shows an always-visible close control unless its own `closable` option overrides). Exposes a scoped `default` slot (`{ toast, dismiss }`) for a bespoke body; falls back to composing `ToastItem` from the store entry. This is the public root attached to the compound as `Toast.Toaster`.
- `toast-item/toast-item.vue` — a single notification card (flex row, `items-center` so a single-line toast and its `trailing` action/close share one centered line; the typed leading icon takes `self-start` so on a multi-line toast it rises to the title's first line instead of centering on the block, while the `loading` `Spinner` stays centered; height adapts to content). All typography and spacing come from tokens (`text-label-md` / `text-body-xs`, `var(--spacing-*)`) — no raw sizes or line-heights. An optional leading severity icon — a PrimeIcons glyph by `type` sized with the `text-label-md` token to match the title (`pi pi-check` / `pi pi-info-circle` / `pi pi-exclamation-triangle` / `pi pi-exclamation-circle`); the neutral `default` type has **no** icon, and `loading` renders a `Spinner`. Followed by a content column (`Title` + optional `Description`) in the `default` slot, and a right-aligned `trailing` slot for the optional `Action` and the `Close` control. `role="status"` (or `role="alert"` for `error`/`warning`). Props `type?: ToastType` (default `'default'`). Slots: `default` (title/description) and `trailing` (action/close); the `Toaster` fills both, standalone it renders just the shell. Reflects `data-type`.
- `toast-title/toast-title.vue` — the primary line of a toast (`text-body-xs` `var(--text-default)`). Renders its default slot as the title text; standalone markup + testId justify the part.
- `toast-description/toast-description.vue` — the supporting line below the title (`text-body-xs` `var(--text-muted)`). Renders its default slot; standalone markup + testId justify the part.
- `toast-action/toast-action.vue` — the inline action control, rendered as the webkit `Button` (`kind="text"`, `size="small"`). Prop `label: string`. Emits `click: [event: MouseEvent]`. Justified because it owns the button wiring + a11y for the action affordance.
- `toast-close/toast-close.vue` — the dismiss control, rendered as the webkit `IconButton` (`pi pi-times`, `kind="transparent"`, `size="small"`, `aria-label="Close notification"`). Emits `click: [event: MouseEvent]`. Justified because it owns its glyph, touch target, focus ring, and a11y label.

The imperative API is backed by a small reactive store composable, declared here (undeclared composables are forbidden):

- `use-toast-store.ts` — a singleton reactive store (one module-level reactive list of toast entries) exposing `add(entry)`, `update(id, patch)`, `dismiss(id?)`, and the reactive `toasts` list. The exported `toast()` function and its shortcuts (`success`/`error`/`info`/`warning`/`loading`/`promise`/`dismiss`) are thin wrappers over `add`/`update`/`dismiss`; the `Toaster` injects the same store to render the stack. Lives beside `injection-key.ts` at the component root (one directory up from each sub-component).

<!-- Resulting layout:

  packages/webkit/src/components/feedback/toast/
  ├── toaster.vue            (root region — Teleport + TransitionGroup + aria-live)
  ├── index.ts               (compound: Object.assign attaches sub-components + re-exports `toast`; vue-tsc emits index.d.ts)
  ├── package.json           (main/module → ./index.ts, types → ./index.d.ts)
  ├── injection-key.ts       (shared provide/inject key for the store)
  ├── use-toast-store.ts      (singleton reactive store backing toast())
  ├── toast-item/            { toast-item.vue, package.json }
  ├── toast-title/           { toast-title.vue, package.json }
  ├── toast-description/     { toast-description.vue, package.json }
  ├── toast-action/          { toast-action.vue, package.json }
  └── toast-close/           { toast-close.vue, package.json }

  Public exports stay flat: ./feedback/toast (→ index.ts), ./feedback/toast-item, ./feedback/toast-title,
  ./feedback/toast-description, ./feedback/toast-action, ./feedback/toast-close (each → its .vue).
  The root binding for dot-notation is PascalCase `Toast`; `Toast.Toaster` is the mount-once region. -->

## Props

<!-- Root <Toaster> element only (reached as `Toast.Toaster`). Sub-component props are listed in the Sub-components section.
     The imperative `toast()` function and its options object are documented in Usage and Sub-components. -->

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | no | Corner (or edge-center) the stack is anchored to. |
| `duration` | `number` | `4000` | no | Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. |
| `max` | `number` | `3` | no | Maximum simultaneously visible toasts per corner before the rest queue behind. |
| `expand` | `boolean` | `false` | no | Lay the stack out fully expanded with a gap; when `false` the resting stack overlaps into a peek. |
| `closable` | `boolean` | `false` | no | Show an always-visible close control on every toast; a per-toast `closable` option overrides it. |

## Events

<!-- The Toaster has no DOM events of its own: it is driven by the imperative store, not by consumer-bound listeners.
     Item-level events (action click, close) live on the sub-components (see Sub-components). -->

| Event | Payload | Notes |
|---|---|---|
| _none_ | — | The `Toaster` is store-driven; it raises no events. Item actions emit from `ToastAction` / `ToastClose`. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | `{ toast, dismiss }` | Optional override for a single toast's body. `toast` is the store entry (`{ id, type, message, description?, action?, duration }`); `dismiss` dismisses that entry. When omitted, the `Toaster` composes `ToastItem` + `Title`/`Description`/`Action`/`Close` from the entry. |

## States

- `data-type` on `ToastItem` (and mirrored on the `Toaster`'s items): `default` | `success` | `info` | `warning` | `error` | `loading`. Drives the leading icon and its severity color (the `-contrast` icon token).
- `data-position` on the `Toaster` container: one of the six `position` values; drives the fixed anchoring (`top`/`bottom` × `left`/`center`/`right`) and the enter/leave translate direction.
- `data-expanded` on the `Toaster` container mirrors the `expand` prop (`true` when expanded).
- The dismiss control (`ToastClose`) renders, and is **always visible**, only when `closable` is set — the per-toast `closable` option, or the Toaster's `closable` default (the per-toast option overrides). When unset, no close control is shown.
- `aria-live` on the region: `polite` by default, `assertive` while an `error` toast is present; `role="status"` per item, `role="alert"` for `error`/`warning`. Focus is never stolen (the region is not focused on mount).
- Visual states on interactive controls (`ToastAction`, `ToastClose`): `default`, `hover`, `focus-visible`, `active` (inherited from `Button` / `IconButton`).

## Motion & Animations

Toast motion reads its **speeds and curves only from the foundation** (`duration` / `curve` in `packages/theme/src/tokens/primitives/animations/animate.js`, imported as `@aziontech/theme/animations`) through `toast/presets/transitions.ts`, and applies them as **inline `transition` styles** — the same pattern the sibling [`Message`](./message.md) and the overlay `Dialog` / `Drawer` use, because Tailwind does not emit dynamic `duration-[…]` / curve classes. No ad-hoc `duration-300` / `ease-out` utilities, no component-local `@keyframes`.

| Trigger | Animation / Transition | Token (foundation, via `presets/transitions.ts`) | Reduced-motion fallback |
|---|---|---|---|
| toast enters the stack | inline `transition` on `transform` + `opacity` + `height`: slides in from the anchored edge (off-edge `translateY` → `0`) while fading in | `duration['moderate-02']` + `curve['productive-entrance']` | `motion-reduce:transition-none` (instant) |
| toast leaves the stack | inline `transition` on `transform` + `opacity` + `height`: slides back off the anchored edge while fading out; DOM unmount deferred (`TOAST_UNMOUNT_MS`) until the exit finishes | `duration['slow-01']` + `curve['productive-exit']` | `motion-reduce:transition-none` (instant) |
| stack reflows when a toast is added / removed / expanded | inline `transition` on the region container (`height`) and each resting card (`transform` / `height`) | `duration['moderate-02']` + `curve['productive-entrance']` | `motion-reduce:transition-none` |

<!-- Enter/leave/reflow apply the foundation `duration`/`curve` tokens as inline `transition` styles (the
     geometry — directional translate + scale + height — is computed inline so the slide reads correctly from
     any of the six anchor positions); every motion-bearing element pairs with `motion-reduce:transition-none`
     on its class string (Tailwind's `important: true` lets the reduced-motion class override the inline
     transition). The loading-type toast renders the webkit `Spinner` component (a continuous rotation with its
     own reduced-motion fallback) inside the `toast-item` sub-component. -->

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| toast surface | `var(--bg-surface-raised)` |
| toast border | `var(--border-default)` |
| border width | `var(--border-width-default)` |
| elevation | `var(--shadow-sm)` |
| shape | `var(--shape-elements)` |
| title typography | `.text-label-md` |
| description typography | `.text-body-xs` |
| title text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| success icon | `var(--success-contrast)` |
| info icon | `var(--info-contrast)` |
| warning icon | `var(--warning-contrast)` |
| error icon | `var(--danger-contrast)` |
| padding | `var(--spacing-sm)` |
| gap | `var(--spacing-xs)` |
| stack inset (viewport edge) | `var(--spacing-md)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| directional slide-in/out for toasts (no `slide-up`/`slide-left`/`slide-right` in the semantic catalogue) | inline `transform` (computed geometry) + inline `transition` bound to the foundation `duration` / `curve` tokens via `presets/transitions.ts` (enter / leave / reflow) | `TODO: add directional toast slide utilities to packages/theme/src/tokens/semantic/animations.js` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1` on the action and close controls (inherited from `Button` / `IconButton`).
- Keyboard map: `Tab` reaches the action then the close control of each visible toast; `Enter`/`Space` activates them. The region itself is not a focus trap and is not focused on mount, so toasts never steal focus from the current task.
- ARIA: the region carries `aria-live` (`polite`, or `assertive` while an `error` toast is present) and `aria-atomic="false"`; each item is `role="status"` (or `role="alert"` for `error`/`warning`); the close control has an `aria-label`; the severity icon is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted description text and severity icons.
- `motion-reduce:animate-none` on the enter/leave fades and `motion-reduce:transition-none` on the move transition.
- Touch target ≥40×40 px on the action and close controls (from `Button` / `IconButton` `size="small"`).

## Stories (Storybook)

This component has no `kind`/`size` on its root, and it is driven imperatively rather than by props, so the canonical Types/Sizes/state stories do not apply to the root. Each story renders `<Toast.Toaster />` once plus button(s) that call `toast(…)`, so the docs "Show code" is copy-paste runnable. Every story justifies its existence below.

- Default — a single `<Toast.Toaster />` plus a button calling `toast('…')`; justified because it documents the minimal mount-once + imperative-call usage that is the component's whole point.
- Types — buttons triggering each `type` (`toast.success` / `toast.info` / `toast.warning` / `toast.error` / `toast.loading` / default); justified because the severity icons are a distinct axis (the equivalent of a composite Types story for an imperative API).
- WithDescription — a button raising a toast with the `description` option; justified because the two-line body (title + description) is a distinct layout the API explicitly supports.
- WithAction — a button raising a toast with the `action` option (label + `onClick`); justified because the inline action affordance (`ToastAction`) is a distinct behavior the API explicitly supports.
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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
