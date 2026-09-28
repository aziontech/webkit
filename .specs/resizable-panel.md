---
name: resizable-panel
category: layout
structure: composition
status: implemented
spec_version: 1
checksum: 8374d49fb537f428e776168f6df961dcf245b86aea2b8f8ae491081d7ccd451d
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit
created: 2026-08-16
last_updated: 2026-08-16
---

# Resizable Panel — Component Spec

## Purpose

A group of adjacent regions whose shared edges the reader can drag. It is the layout primitive behind a workspace — an editor with a terminal under it and a preview beside it — where every region is content the reader is working in and the split between them is theirs to set.

It exists because `Sidebar` was being used for both jobs. `Sidebar` is the app's NAVIGATION rail: it collapses to icons, it hides, it is the thing you leave to go somewhere. A terminal, a preview and a code editor are not places you navigate to — they are the work — and dressing two of them as navigation rails made a screen with three "sidebars" and one document, on an axis `Sidebar` does not even have (it has no horizontal edge, so a terminal under an editor had to hand-roll its own splitter). This component owns the EDGE; `Sidebar` goes back to owning navigation.

## When to use

- Two or more content regions share an edge the reader should be able to move (editor + terminal, editor + preview, list + detail).
- The split is a working preference the reader sets many times in a session, not a one-time layout decision.
- A region has to shrink to nothing and come back without losing its state (an editor's undo history, a scroll position).
- The layout needs a horizontal edge — one region above another — which no other component in the package provides.

## When NOT to use

- The panel is the app's navigation rail → use `sidebar`, which owns the icon rail, the collapse and the nav semantics.
- The content is a temporary overlay over the page → use `drawer` (a panel that comes and goes) or `dialog`.
- The regions have a fixed relationship the reader should not change → use plain flex/grid layout with the layout tokens.
- The panel is one scrolling region with no movable edge → use `scroll-area`.

## Related

- `sidebar` — the navigation rail. Collapses to icons, hides, and carries nav semantics; reach for it when the panel is how the reader gets somewhere, not what they work in.
- `scroll-area` — one region that scrolls. A pane usually contains one.
- `drawer` — a panel that arrives over the page and leaves; a resizable pane is always there.

## Best practices

- Give exactly ONE pane in a group no `basis`. That pane absorbs the remaining space, so the group always fills its container and the reader never sees a gap or a scrollbar they did not cause.
- Put the `basis` on the pane whose size the reader cares about (the terminal's height, the preview's width) and let the document be the flexible one.
- Keep the pane's own state alive when it is collapsed — collapse renders it at zero length, it does not unmount it. A code editor that loses its undo history when the reader drags an edge shut has lost the reader's work.
- Give every handle an `ariaLabel` naming the edge it moves ("Resize the terminal"), never the generic default: a screen with three handles otherwise reads as three identical controls.
- A control that reopens a collapsed pane belongs OUTSIDE that pane, in the surrounding chrome. A control that only exists inside the thing it hides cannot bring it back.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ResizablePanel from '@aziontech/webkit/resizable-panel'

  const previewWidth = ref(480)
  const previewCollapsed = ref(false)
</script>

<template>
  <ResizablePanel orientation="horizontal">
    <ResizablePanel.Pane>
      <p>The document — no basis, so it takes whatever is left.</p>
    </ResizablePanel.Pane>

    <ResizablePanel.Handle aria-label="Resize the preview" />

    <ResizablePanel.Pane
      v-model:basis="previewWidth"
      v-model:collapsed="previewCollapsed"
      collapsible
      :min="280"
      :max="720"
    >
      <p>The preview — sized, and the pane the handle beside it moves.</p>
    </ResizablePanel.Pane>
  </ResizablePanel>
</template>
```

Tree-shaking alternative — the standalone root and each sub-component from its own entry:

```vue
<script setup>
  import ResizablePanel from '@aziontech/webkit/resizable-panel-root'
  import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
  import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
</script>
```

## Sub-components

- `resizable-panel-pane/resizable-panel-pane.vue` — one region of the group. Sized along the axis by `basis`, or flexible when `basis` is absent.
- `resizable-panel-handle/resizable-panel-handle.vue` — the movable edge between two panes. A focusable `separator` that publishes its value, so the split is settable without a pointer.

Neither part is an overlay, so neither is named `Trigger` or `Content` and neither carries `data-state="open|closed"`: the names come from this component's own anatomy — a group of PANES divided by HANDLES.

`resizable-panel-pane` props:

- `basis` — `number`, default unset. The pane length in pixels along the group axis, two-way through `v-model:basis`. Leave unset for the pane that absorbs the remaining space.
- `min` — `number`, default `96`. Smallest length in pixels a drag may set.
- `max` — `number`, default `720`. Largest length in pixels a drag may set.
- `collapsed` — `boolean`, default unset. Whether the pane renders at zero length, two-way through `v-model:collapsed`. The pane stays mounted, so its content keeps its state.
- `collapsible` — `boolean`, default `false`. Whether dragging past the minimum collapses the pane instead of stopping at it.
- `ariaLabel` — `string`, default `''`. Accessible name for the region.

`resizable-panel-handle` props:

- `ariaLabel` — `string`, default `'Resize panel'`. Accessible name of the separator; name the edge it moves.
- `disabled` — `boolean`, default `false`. Disables the drag and the keyboard nudge, and removes the separator from the tab order.

`resizable-panel-pane` events: `update:basis` (`number`) on every step of a drag and on a
keyboard nudge, and `update:collapsed` (`boolean`) when a drag past the minimum collapses
the pane or a drag back out restores it. Both are the `v-model` half of the props above.

`resizable-panel-handle` emits nothing: it drives the pane beside it through the group's
context, so a consumer never wires one part to the other.

## Props

The table below is the ROOT's surface. Each sub-component's own props are documented in
the Sub-components section above, beside the part that takes them.

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | false | Axis the panes are laid out on; horizontal places them side by side, vertical stacks them. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the group as a whole. |

## Events

| Event | Payload | Notes |
|---|---|---|

The root emits nothing. The state a group holds is each pane's own length, so it is the
PANE that owns the two-way values (see Sub-components) and the root only carries the axis.

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | On the root, the panes and handles in the order they appear. On a pane, its content. The handle takes no slot. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-orientation`: `horizontal` | `vertical` — on the root, and mirrored onto every pane and handle so each part styles itself off one fact.
- `data-collapsed` mirrors the pane's `collapsed` state
- `data-resizing` on the handle while a drag is in flight
- `data-disabled` mirrors the handle's `disabled` prop

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| handle hover/focus state change | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

A drag itself is deliberately NOT animated. Direct manipulation has to track the pointer exactly; interpolating the pane's length behind the cursor reads as the panel resisting, and the two drift further apart the faster the reader moves.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| handle rail | `var(--border-default)` |
| handle rail (hover) | `var(--border-strong)` |
| handle rail (focus / resizing) | `var(--accent)` |
| handle thickness | `var(--spacing-xxs)` |
| focus ring | `var(--ring-color)` |
| pane surface | `var(--bg-surface)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses each handle; `ArrowLeft`/`ArrowRight` move a handle in a horizontal group and `ArrowUp`/`ArrowDown` in a vertical one, one 24px step per press; `Home` sets the pane to its minimum, `End` to its maximum; `Enter` toggles a collapsible pane.
- ARIA: the handle is `role="separator"` with `aria-orientation` (the PERPENDICULAR of the group's axis — a separator between two side-by-side panes is itself vertical), `aria-valuenow` / `aria-valuemin` / `aria-valuemax` published from the pane it moves, `aria-label` from `ariaLabel`, and `aria-disabled` when disabled. Each pane is `role="group"` with its `ariaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none` on the handle's colour transition
- Touch target: the handle draws a `--spacing-xxs` rail and extends its hit area to 16px across the axis with a pseudo-element, so the edge is grabbable without drawing a thick bar.

## Stories (Storybook)

- Default
- Orientations — composite story rendering a horizontal group and a vertical group side by side. The axis is this component's only variant axis, so it takes the place a `Types` story would.
- Collapsed — the state story for `collapsible` + `collapsed`, showing a pane at zero length and the control outside it that brings it back.
- Disabled — the state story for the handle's `disabled` prop.

There is no `Sizes` story: the component has no `size` prop, because a pane's length is data the reader sets rather than a token the author picks.

## Constraints — DO NOT

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
