---
name: panel
category: overlay
structure: composition
status: implemented
spec_version: 6
checksum: 88ed6bede39471dfead73b9830eacfe141a46c613d86cfc352c4806bb39f7e00
created: 2026-05-22
last_updated: 2026-11-15
---

# Panel — Component Spec

## Purpose

The shell inside an overlay: a sized surface with a header for the title and the close control, a body that scrolls and a footer for the actions. `DialogContent` and `DrawerContent` lay their regions out with it, and a page can render it on its own as a static preview of an overlay.

## When to use

- Laying out the regions inside `DialogContent` or `DrawerContent`: `PanelHeader` for the title (the overlay adds its close control), `PanelContent` for the body that scrolls, `PanelFooter` for the actions.
- A static preview of an overlay surface outside a live overlay, for example a frozen dialog on a docs or marketing page.

## When NOT to use

- The surface has to open over the page and trap focus → use `dialog`.
- The surface slides in from a screen edge → use `drawer`.
- Rich content anchored to a trigger that leaves the page interactive → use `popover`.
- A card in the page layout, with header, content and footer slots → use `card`.

## Related

- `dialog` — renders a `Panel` inside `DialogContent`; compose the `Panel*` regions directly in it.
- `drawer` — renders a `Panel` inside `DrawerContent`; there `PanelContent` scrolls through a `ScrollArea`.
- `card` — in-page card with header, content and footer slots. `Panel` is the elevated overlay shell, with a large shadow and max-width presets.

## Best practices

- Inside a dialog or drawer, use only `PanelHeader`, `PanelContent` and `PanelFooter`. The overlay already renders the `Panel` root, so a second `Panel` inside it nests two shells.
- Put long content in `PanelContent`. It is the only region that scrolls; the header and footer stay in place.
- `size` caps the max width (`small`, `medium`, `large` map to the `--container-sm` / `--container-xl` / `--container-2xl` tokens). `sizeAtMd` applies that cap from `md` up only and is meant for the dialog's mobile bottom sheet.
- `Panel` has no open state, no dismissal and no focus management. Don't use it alone as a modal.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Panel from '@aziontech/webkit/panel'
</script>

<template>
  <Panel size="medium">
    <Panel.Header>
      <h2 class="text-heading-sm text-(--text-default)">Cache settings</h2>
    </Panel.Header>
    <Panel.Content>
      <p class="text-body-sm text-(--text-muted)">
        Objects are cached at the edge for the TTL set on each rule.
      </p>
    </Panel.Content>
    <Panel.Footer>
      <Button
        label="Cancel"
        variant="outline"
      />
      <Button
        label="Save"
        variant="primary"
      />
    </Panel.Footer>
  </Panel>
</template>
```

Tree-shaking: `@aziontech/webkit/panel-root` is the root alone, and `panel-header`, `panel-content` and `panel-footer` keep their own paths.

## Sub-components

- `index.ts` — the compound: `Panel` with `Panel.Header`, `Panel.Content` and `Panel.Footer` attached by `Object.assign`, exported at `@aziontech/webkit/panel`; the root alone is `@aziontech/webkit/panel-root`.
- `panel-content.vue` — Public sub-component `panel-content`.
- `panel-footer.vue` — Public sub-component `panel-footer`.
- `panel-header.vue` — Public sub-component `panel-header`. Inside `DialogContent` / `DrawerContent` it appends the overlay's close button after its content (the content then sits in one flex row that keeps its own start/end spread), while the overlay's `closable` is true; a `PanelHeader` of a nested `Panel` gets nothing. Standalone it renders only its slot.

## Props

| Prop       | Type        | Default    | Required | JSDoc                                                                                   |
| ---------- | ----------- | ---------- | -------- | --------------------------------------------------------------------------------------- |
| `size`     | `PanelSize` | `'medium'` | false    | Max width of the panel shell.                                                           |
| `sizeAtMd` | `boolean`   | `false`    | false    | When true, the `size` max-width applies from `md` up only (dialog mobile bottom sheet). |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes |
| --------- | ----- | ----- |
| `default` | —     | —     |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- `data-width` on the root carries the resolved width: `small` | `medium` | `large`, the same with `-md` when `sizeAtMd` is set, or `fluid` when the internal `data-fluid` attribute is passed (Drawer). Tailwind `data-[width=…]:` variants map it to the container tokens; there is no JS class map.
- Responsive: `PanelContent` is the `@container/panel`, so the content of a dialog or a drawer lays out for the panel width. Below `sm` the `PanelFooter` wraps, stretches its direct children to equal widths (`max-sm:*:flex-1`) and pads the bottom by `env(safe-area-inset-bottom)`.

## Motion & Animations

_none_

## Tokens

| Region     | Token (DESIGN.md)      |
| ---------- | ---------------------- |
| typography | .text-body-sm          |
| surface    | `var(--bg-surface)`    |
| text       | `var(--text-default)`  |
| spacing    | `var(--spacing-3)`     |
| shape      | `var(--shape-control)` |
| ring       | `var(--ring-color)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Scroll region: when `PanelContent` (outside a drawer's `ScrollArea`) overflows and holds nothing focusable, it takes `tabindex="0"` with an inset focus ring, so a keyboard user can scroll it (WCAG 2.1.1, axe `scrollable-region-focusable`); it is measured on resize and on content changes.

## Examples

- Default

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
