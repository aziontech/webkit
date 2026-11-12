---
name: drawer
category: overlay
structure: composition
status: implemented
spec_version: 1
checksum: 71d69d8ea9dbd72db080b5d25aa04f63176dedec06f54beb99d71302303c215b
created: 2026-05-22
last_updated: 2026-11-12
---

# Drawer — Component Spec

## Purpose

Layered surface above the page (modal, drawer, menu). Lives at `packages/webkit/src/components/overlay/drawer/`.

## When to use

- A panel that slides in from a screen edge for secondary tasks, filters, long forms, or navigation, while keeping page context.
- The content is too large or persistent for a centered modal.

## When NOT to use

- It is a short, focused confirmation/task best centered and fully blocking → use `dialog`.
- It is a small overlay anchored to a trigger → use a popover / `dropdown`.

## Related

- `dialog` — centered, blocking modal for focused tasks/confirmations.
- `sidebar` — persistent (non-overlay) side navigation.

## Best practices

- Pick the edge (side) intentionally and keep it consistent across the app.
- Trap focus while open and provide an obvious close affordance.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    side="right"
    size="medium"
  >
    <DrawerTrigger>
      <Button
        label="Add origin"
        kind="primary"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader>
          <DrawerTitle>Add origin</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <DrawerDescription>
            Point the application at the server that holds the original content.
          </DrawerDescription>
        </PanelContent>
        <PanelFooter>
          <Button
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            label="Save"
            kind="primary"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```

## Sub-components

- `drawer-close.vue` — Public sub-component `drawer-close`.
- `drawer-content.vue` — Public sub-component `drawer-content`.
- `drawer-description.vue` — Public sub-component `drawer-description`.
- `drawer-overlay.vue` — Public sub-component `drawer-overlay`.
- `drawer-portal.vue` — Public sub-component `drawer-portal`.
- `drawer-title.vue` — Public sub-component `drawer-title`.
- `drawer-trigger.vue` — Public sub-component `drawer-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the drawer on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

## Props

| Prop          | Type         | Default    | Required | JSDoc                                                                                                   |
| ------------- | ------------ | ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `defaultOpen` | `boolean`    | `false`    | false    | Initial open state when uncontrolled.                                                                   |
| `dismissible` | `boolean`    | `true`     | false    | When true, overlay click and Escape close the drawer.                                                   |
| `side`        | `DrawerSide` | `'right'`  | false    | Edge the drawer panel slides from.                                                                      |
| `size`        | `DrawerSize` | `'medium'` | false    | Panel max-width preset (`small` 384px, `medium` 672px, `large` 1024px). Height is always 100% viewport. |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Controlled open state through `defineModel('open')`, the single declaration of `open`, so `@update:open` is typed `(value: boolean) => void`, as on `dialog` and `popover`. Fires once per transition. While unbound the drawer is uncontrolled and starts at `defaultOpen`. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes |
| --------- | ----- | ----- |
| `default` | —     | —     |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- Phones: below `md` the drawer is a bottom sheet (full width, 80 dvh); below `sm` it becomes a full-height, full-width sheet (`top-0`, `h-dvh`, no radius, no border). The `PanelFooter` stays pinned under the scrolling content with full-width actions.
- Server render and hydration: the phone layout reads the viewport only after mount (`use-overlay-mobile` gates the media query on `useMounted`), so a drawer rendered open on the server hydrates with the desktop panel and switches to the phone sheet in the same tick as mount, before paint.

## Motion & Animations

- From `md` up the panel slides in from its `side` edge (`translate-x`) and out to it. `side` names the physical edge of a left-to-right page and the panel anchors on the logical one (`start-0` / `end-0`), so under `dir="rtl"` the slide mirrors with it (`rtl:` variants): a `left` drawer sits on the right and leaves to the right.

## Tokens

| Region     | Token (DESIGN.md)       |
| ---------- | ----------------------- |
| typography | .text-body-sm           |
| surface    | `var(--bg-surface)`     |
| text       | `var(--text-default)`   |
| spacing    | `var(--spacing-3)`      |
| shape      | `var(--shape-elements)` |
| ring       | `var(--ring-color)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Enter`/`Space` on the trigger opens the drawer and moves focus to its first focusable control. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it and focus returns to the trigger, or, when opened without a `Drawer.Trigger`, to the element that held focus when it opened. Tests: `drawer.test.ts` › keyboard map (spec).
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Teleported content: the portal wraps its content (overlay and panel) in a `display: contents` element that binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

- Default
- Sizes
- ScrollContent — long `PanelContent` scrolls inside `ScrollArea`; header and footer stay in the panel flex layout (not sticky).

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
