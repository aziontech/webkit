---
name: popover
category: overlay
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=482-954
  node_id: 482:954
checksum: ca2970514f1e429951a45474de53a0d1bbca36978adf9c0f560e84118231d931
created: 2026-06-30
last_updated: 2026-06-30
---

# Popover — Component Spec

## Purpose

Anchored, **non-modal** overlay that opens from a consumer-supplied trigger and renders rich, interactive content — a header (title + optional description + close), a free-form body, and a footer for actions — in a floating panel anchored to the trigger. Use for inline forms, filter builders, and contextual detail or confirmation that needs interactive children. Unlike `overlay/tooltip` (plain text, non-interactive) and `overlay/dialog` (modal, centered, focus-trapped), the popover leaves the page interactive, anchors to its trigger, and closes on `Esc` or outside-click. It differs from `navigation/dropdown`, which renders a menu of selectable options rather than free-form content.

## Usage

```vue
<script setup>
import Popover from '@aziontech/webkit/popover'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Popover>
    <Popover.Trigger>
      <Button kind="secondary">Open popover</Button>
    </Popover.Trigger>

    <Popover.Content>
      <Popover.Header>
        <Popover.Title>Popover title</Popover.Title>
        <Popover.Close />
      </Popover.Header>

      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">
        Compose any content here — the body is a free-form slot.
      </div>
    </Popover.Content>
  </Popover>
</template>
```

Tree-shaking alternative — the standalone root + each sub-component from its own entry (no `Object.assign` compound pulled in):

```vue
<script setup>
import Popover from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverHeader from '@aziontech/webkit/popover-header'
import PopoverTitle from '@aziontech/webkit/popover-title'
import PopoverDescription from '@aziontech/webkit/popover-description'
import PopoverClose from '@aziontech/webkit/popover-close'
import PopoverFooter from '@aziontech/webkit/popover-footer'
</script>
```

## Sub-components

The root `Popover` owns open/closed state, anchoring/placement, outside-click + `Esc` dismissal, focus return, **and renders the single teleported, animated floating panel** (the panel element carries `role="dialog"`, the surface/border/radius/shadow tokens, the open/close `animate-popup-scale-*`, `--popup-origin`, and `data-state` / `data-placement`). Shared state flows through `provide`/`inject` (`isOpen`, `triggerId`, `contentId`, `titleId`, `descriptionId`, `setOpen`, resolved `placement`, and a panel-body ref the content teleports into), so every sub-component is context-aware and the consumer wires nothing. `Popover.Content` teleports its content into the root's panel — it does not own its own overlay (this mirrors `navigation/dropdown`, where the root owns the floating panel and the sub-components fill it). Member names mirror this component's anatomy; `Trigger` / `Content` are valid here because the popover has a real `data-state="open|closed"`.

- `popover-trigger/popover-trigger.vue` — slot-only abstract wrapper. Reads `inject` for `isOpen`, `triggerId`, `contentId`, `setOpen`. Renders a single inline element that toggles the panel on click and exposes `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`. The popover anchors to this element's bounding box.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The wrapper attaches aria + click; the consumer must not bind those itself.
- `popover-content/popover-content.vue` — the panel's content region. Teleports its default slot into the root's floating panel (via the injected panel-body ref) and arranges it as a flex column: `Popover.Header` (when present), the free-form body, then `Popover.Footer` (when present). The root — not this component — owns the panel element and its surface/border/radius/shadow, `position: fixed` anchoring, `role="dialog"` + `aria-modal="false"`, `aria-labelledby` / `aria-describedby` (from injected `titleId`/`descriptionId`), the open/close `animate-popup-scale-*`, and `data-state` / `data-placement`. `Popover.Content` adds no overlay or animation of its own.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the popover anatomy (`Popover.Header`, body content, `Popover.Footer`).
- `popover-header/popover-header.vue` — full-width header region with a bottom divider and `py var(--spacing-sm)` / `px var(--spacing-md)` padding, laid out as a row with the title/description block on the left and the close affordance on the right.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — `Popover.Title`, optional `Popover.Description`, and `Popover.Close`.
- `popover-title/popover-title.vue` — title text (`.text-body-sm`, `var(--text-default)`). Registers its element id with the injected context so `Popover.Content` can reference it via `aria-labelledby`.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text title.
- `popover-description/popover-description.vue` — supporting description text (`.text-body-xs`, `var(--text-muted)`). Optional — omit it for a title-only header. Registers its element id with the injected context so `Popover.Content` can reference it via `aria-describedby`.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text description.
- `popover-close/popover-close.vue` — close control. Renders an `IconButton` (`pi pi-times`, `aria-label="Close"`) that calls the injected `setOpen(false)` on activation; focus returns to the trigger. Optional — omit when the popover is dismissed only by outside-click / `Esc` / a footer action.
  - Props: _none_.
  - Events: _none_ (root handles `update:open`).
  - Slots: _none_.
- `popover-footer/popover-footer.vue` — full-width footer region with a top divider and `py var(--spacing-sm)` / `px var(--spacing-md)` padding. Renders its default slot as a right-aligned button group (`gap var(--spacing-xs)`). Optional.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — action buttons (e.g. Cancel / Apply).

<!-- Resulting layout (composition, canonical):

  packages/webkit/src/components/overlay/popover/
  ├── popover.vue
  ├── index.ts                    (compound: Object.assign attaches every sub-component; vue-tsc emits index.d.ts)
  ├── injection-key.ts            (shared by every sub-component)
  ├── popover-trigger/popover-trigger.vue
  ├── popover-content/popover-content.vue
  ├── popover-header/popover-header.vue
  ├── popover-title/popover-title.vue
  ├── popover-description/popover-description.vue
  ├── popover-close/popover-close.vue
  └── popover-footer/popover-footer.vue

  The root export (`./popover`) points at `index.ts`; `./popover-root` points at `popover.vue`.
  Sub-component exports stay flat (`./popover-trigger`) and point at their `.vue`. -->

<!-- index.ts
```ts
import Popover from './popover.vue'
import PopoverTrigger from './popover-trigger/popover-trigger.vue'
import PopoverContent from './popover-content/popover-content.vue'
import PopoverHeader from './popover-header/popover-header.vue'
import PopoverTitle from './popover-title/popover-title.vue'
import PopoverDescription from './popover-description/popover-description.vue'
import PopoverClose from './popover-close/popover-close.vue'
import PopoverFooter from './popover-footer/popover-footer.vue'

export default Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Footer: PopoverFooter
})
```
-->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `open` | `boolean` | `undefined` | no | Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled. |
| `placement` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | no | Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on available viewport space. |
| `offset` | `number` | `4` | no | Pixel gap between the trigger and the panel. |
| `disabled` | `boolean` | `false` | no | Prevents the trigger from opening the panel and applies disabled tokens. |
| `width` | `'small' \| 'medium' \| 'large'` | `undefined` | no | Panel width preset mapped to container tokens: `'small'` (`var(--container-xs)`), `'medium'` (`var(--container-sm)`), `'large'` (`var(--container-md)`). When omitted, the panel sizes fluidly between `var(--container-3xs)` and `var(--container-xs)`. |
| `dismissable` | `boolean` | `true` | no | Light-dismiss: when `true`, the panel closes on outside-click, `Esc`, and focus leaving the panel. Set `false` to keep it open until the trigger or `PopoverClose` closes it. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | Fires on every open/closed transition; supports `v-model:open`. Emitted on trigger toggle, `Popover.Close`, `Esc`, and outside-click. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Place `<Popover.Trigger>` followed by `<Popover.Content>`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values (root, trigger, floating panel): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root and trigger
- `data-placement` on the root mirrors the `placement` prop (`'auto'` stays as `'auto'`)
- `data-placement` on the floating panel mirrors the resolved placement (`'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| panel open | `animate-popup-scale-in` (origin from `--popup-origin`) | semantic (`moderate-01` · `productive-entrance`) | `motion-reduce:animate-none` (instant) |
| panel close | `animate-popup-scale-out` | semantic (`fast-02` · `productive-exit`) | `motion-reduce:animate-none` (instant) |
| trigger / close hover / focus | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

`--popup-origin` is set per instance from the resolved `placement` (e.g. `bottom-start` → `top left`).

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel surface | `var(--bg-surface-raised)` |
| panel border | `var(--border-default)` |
| panel shape | `var(--shape-elements)` |
| panel shadow | `var(--shadow-sm)` |
| header / footer divider | `border-[var(--border-default)]` |
| header / footer spacing.y | `var(--spacing-sm)` |
| header / footer spacing.x | `var(--spacing-md)` |
| title typography | `.text-body-sm` |
| title text | `var(--text-default)` |
| description typography | `.text-body-xs` |
| description text | `var(--text-muted)` |
| footer button gap | `var(--spacing-xs)` |
| close button shape | `var(--shape-button)` |
| popup origin | `var(--popup-origin)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Typography/Heading/xss` (14px Sora Regular) | `.text-body-sm` | `TODO: tokenizar` — DESIGN.md documents headings only down to `text-heading-sm` (responsive ≤18px); add a flat-14px heading role if popover titles need a true heading class. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the trigger and the close button.
- Keyboard map:
  - On the trigger: `Enter` / `Space` toggles the panel. When it opens, focus moves into the panel (the first focusable element, else the panel itself).
  - Inside the panel: `Esc` closes the panel and returns focus to the trigger; `Tab` / `Shift+Tab` move through the panel's focusable children in DOM order and, since the popover is **non-modal**, continue past the panel without trapping — moving focus out closes the panel.
  - Outside-click closes the panel; focus is not forced back to the trigger on outside-click.
- ARIA: trigger exposes `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`; the floating panel (rendered by the root) uses `role="dialog"` with `aria-modal="false"`, `aria-labelledby` pointing at the `Popover.Title` id and `aria-describedby` pointing at the `Popover.Description` id (when present); `Popover.Close` is an `IconButton` with `aria-label="Close"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled trigger state (validated via `--text-muted` / `--text-disabled` tokens).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/focus states.
- Touch target ≥40×40 px on the trigger (consumer's element — flagged in docs); the close `IconButton` follows `IconButton`'s own target sizing.

## Stories (Storybook)

Canonical layout — composite stories render every variant of one axis side-by-side in a single frame; state stories use the reusable `Template` with an args delta. Popover is a composition overlay whose visual identity lives in placement and optional regions, not in a `kind`/`size` axis, so the extra stories below are justified per axis.

- Default — one `Button` trigger that opens the popover, and a `Popover.Content` with a `Popover.Header` (`Popover.Title` + `Popover.Close`) and a free-form body. The canonical minimal usage: a button that calls a popover whose contents are composed by part.
- Placements — composite story rendering all four explicit `placement` values (`bottom-start`, `bottom-end`, `top-start`, `top-end`) side-by-side. Required because `placement` is a multi-value prop axis with no other coverage; consumers need to see how each placement anchors against its trigger.
- AutoPlacement — composite story demonstrating `placement="auto"`: triggers anchored near viewport corners so the resolver opens the panel toward the corner with the most available space. Required because `'auto'` is the only `placement` value not covered by `Placements` and is the recommended default for consumer-positioned triggers.
- Anatomy — composite story rendering panels with different region combinations side-by-side: header + body + footer, header (title only, no description) + body, and body-only (no header, no footer). Required because `Popover.Header`, `Popover.Description`, and `Popover.Footer` are optional composition that `Default` does not exercise on its own.
- Disabled — trigger present, panel never opens. Required because the root declares a `disabled` prop.

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
