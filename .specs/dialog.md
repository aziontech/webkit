---
name: dialog
category: overlay
structure: composition
status: implemented
spec_version: 10
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=482-935
  node_id: 482:935
checksum: 834dfaab902519f0fca71c25b18791eb56708f029af8f88dcf791e8eb3d14843
created: 2026-05-22
last_updated: 2026-11-17
---

# Dialog — Component Spec

## Purpose

Modal surface above the page, built on the shared Panel shell. `Dialog.Content` is the whole modal: it teleports to `body`, renders the dimmed overlay behind the panel, traps focus and scroll-locks the page, so the page behind cannot be clicked, scrolled or tabbed to while the dialog is open. The consumer composes a trigger and the panel regions (header, body, footer); the header gets the close (X) button on its own unless `closable` is false; the body is the only region that scrolls. Below `md` it renders as a full-width bottom sheet.

## When to use

- A focused, blocking modal task or confirmation that should sit centered over the page and trap focus.
- The interaction must be completed or dismissed before returning to the page.

## When NOT to use

- The content is a side panel or a long form that should slide from an edge, over the screen that owns it → use `drawer` (nothing inside a drawer navigates; a destination of its own is a page).
- It is small contextual content anchored to a trigger (a menu, info bubble, picker) → use a popover / `dropdown-menu`.

## Related

- `drawer` — edge-anchored panel for secondary tasks / long content.
- `dropdown-menu` — trigger-anchored menu for actions/options.

## Best practices

- Do not add an overlay, a portal or a close button by hand: `Dialog.Content` renders the overlay and the portal, and the header renders the close button while `closable` is true (the default). Set `:closable="false"` only when the dialog must be answered through its footer actions.
- While an action is in flight, set `:dismissible="false"` and `:closable="false"` together so neither Escape, the overlay nor the close button can close it.
- One clear primary action; keep the body scannable.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Usage

The compound import leads: every part hangs off the root (`Dialog.Trigger`, `Dialog.Content`, …), and `Dialog.Header`, `Dialog.Body` and `Dialog.Footer` are the shared Panel regions, so one import builds the whole dialog.

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <Dialog.Trigger>
      <Button
        label="Delete domain"
        variant="outline"
      />
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete domain</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>
          The domain stops serving traffic immediately. This action cannot be undone.
        </Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          label="Cancel"
          variant="outline"
          @click="open = false"
        />
        <Button
          label="Delete"
          variant="danger"
        />
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
</template>
```

Tree-shaking: `@aziontech/webkit/dialog-root` is the root alone (nothing attached), and every part keeps its own path (`@aziontech/webkit/dialog-trigger`, `-content`, `-title`, `-description`, `-close`, and `@aziontech/webkit/dialog-header`, `dialog-body`, `dialog-footer` for the regions, which resolve to the shared Panel files). There is no portal or overlay part: `dialog-content` renders both.

## Sub-components

- `index.ts` — the compound: the root with every part attached by `Object.assign` (`Dialog.Trigger`, `.Content`, `.Title`, `.Description`, `.Close`), plus the shared Panel regions as `Dialog.Header`, `Dialog.Body` and `Dialog.Footer`, each importable on its own as `@aziontech/webkit/dialog-header`, `dialog-body` and `dialog-footer` (the same `panel-header`, `panel-body` and `panel-footer` files). It adds no component of its own. Exported at `@aziontech/webkit/dialog`; the root alone is `@aziontech/webkit/dialog-root`. The parts stay in the root folder (flat).
- `dialog-close.vue` — Public sub-component `dialog-close`: the close (X) `IconButton`. `Dialog.Content` puts one at the end of its `PanelHeader` while `closable` is true, so a consumer places it by hand only in a custom header with `:closable="false"`. It always closes the dialog.
- `dialog-content.vue` — Public sub-component `dialog-content`: the modal itself. It teleports to `body` (kept mounted through the exit transition), renders the overlay (`aria-hidden`, `__backdrop` test id; a click on it closes the dialog when `dismissible`) and the `role="dialog"` panel, traps focus, scroll-locks the page and restores focus on close.
- `dialog-description.vue` — Public sub-component `dialog-description`.
- `dialog-title.vue` — Public sub-component `dialog-title`.
- `dialog-trigger.vue` — Public sub-component `dialog-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the dialog on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

## Props

| Prop          | Type         | Default    | Required | JSDoc                                                                                                                              |
| ------------- | ------------ | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen` | `boolean`    | `false`    | false    | Initial open state when uncontrolled.                                                                                              |
| `closable`    | `boolean`    | `true`     | false    | Shows the close (X) button at the end of the dialog header. False removes it; Escape and overlay click still follow `dismissible`. |
| `dismissible` | `boolean`    | `true`     | false    | Light-dismiss: when true, overlay click and Escape close the dialog. It does not govern the close button; see `closable`.          |
| `size`        | `DialogSize` | `'medium'` | false    | Panel max-width preset passed to the inner Panel.                                                                                  |

- Two close paths: `dismissible` gates the light-dismiss paths (`Esc`, overlay click); `closable` shows or removes the close (X) button, as Radix and the prop vocabulary separate them. `Dialog.Close` and the context `close()` always close. `:dismissible="false"` with the default `closable` is a dialog that only its close button or a footer action closes. Tests: `dialog.test.ts` › closable.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, `Dialog.Close`, `Esc`, overlay click). While unbound the dialog is uncontrolled and starts at `defaultOpen`. |

## Events

_No events of its own: `update:open` comes from `v-model:open` (see v-model above)._

## Slots

| Slot      | Scope | Notes |
| --------- | ----- | ----- |
| `default` | —     | —     |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- `data-size` on the motion wrapper mirrors `size`, reactively (a later `size` change resizes an open dialog).
- Attributes: the `Dialog` root forwards every consumer attribute (`id`, `class`, `aria-*`, `data-*`) to its root element; `DialogContent` forwards its attributes to the `role="dialog"` element.

### Mobile sheet, height and scroll

- Below `md` the dialog is a bottom sheet, capped at 80% of the **visible** viewport (`dvh`, not `vh`: on mobile browsers `vh` is the largest viewport with the toolbars retracted, so a `vh` sheet can extend under the URL bar with its footer off-screen).
- Exactly one element caps the sheet (the panel) and exactly one element scrolls (`panel-body`), so the title and footer actions stay reachable while the body scrolls. The motion wrapper only positions and animates; it declares no cap and no scroll of its own.
- The page behind the overlay is scroll-locked while the dialog is open, and the lock is released on close.
- Phones: below `md` the panel is a bottom sheet (full width, 80 dvh); below `sm` it becomes a full-height, full-width sheet (`h-dvh`, no radius, no border). The `PanelFooter` stays pinned under the scrolling content, its direct children stretch to equal widths and it keeps `env(safe-area-inset-bottom)` clear.
- Server render and hydration: the phone layout and its motion timing are CSS breakpoints (`max-md:` / `md:` utilities), so the server HTML and the hydrated DOM are identical at every width.

## Motion & Animations

| Trigger              | Animation / Transition                                                                                                                                                                                                        | Token                                                                                                                      | Reduced-motion fallback                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| panel open / close   | `transition-[translate,scale,opacity]`, from `md` up: `md:duration-moderate-01 md:ease-productive-entrance`, closing `md:data-[state=closed]:ease-productive-exit`                                                            | `duration['moderate-01']` + `curve['productive-entrance']` / `curve['productive-exit']` from `@aziontech/theme/animations` | `motion-reduce:transition-none` (no inline `transition`, so the class wins) |
| overlay open / close | `transition-opacity` with the same breakpoint split as the panel                                                                                                                                                              | `duration['moderate-01']` (from `md`), `duration['slow-01']` / `duration['slow-02']` below `md`                            | `motion-reduce:transition-none`                                             |
| below `md`           | the panel enters as a bottom sheet with the drawer's timing: `max-md:duration-slow-02 max-md:ease-expressive-entrance`, closing `max-md:data-[state=closed]:duration-slow-01 max-md:data-[state=closed]:ease-expressive-exit` | `duration['slow-02']` / `duration['slow-01']` + `curve['expressive-entrance']` / `curve['expressive-exit']`                | `motion-reduce:transition-none`                                             |

No element sets an inline `transition` (an inline style beats `motion-reduce:transition-none`, see `styling.md`); the panel width is `data-size` on the motion wrapper (`data-[size=small]:md:max-w-(--container-sm)`, `medium` `--container-xl`, `large` `--container-2xl`), not a JS class map.

## Tokens

| Region         | Token (DESIGN.md)                                                |
| -------------- | ---------------------------------------------------------------- |
| title          | `.text-title-lg` (medium weight), `var(--text-default)`          |
| description    | `.text-body-sm`, `var(--text-muted)`                             |
| body           | `PanelBody`: `.text-body-sm`, `var(--spacing-lg)`, `min-h-24`    |
| header, footer | `PanelHeader` / `PanelFooter`: `var(--spacing-md)` block padding |
| surface        | `var(--bg-surface)`                                              |
| ring           | `var(--ring-color)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Enter`/`Space` on the trigger opens the dialog and moves focus to its first focusable control. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it (unless the consumer blocks dismissal) and focus returns to the trigger; when the dialog was opened without a `Dialog.Trigger` (controlled `v-model:open`), focus returns to whatever element held it when the dialog opened. Tests: `dialog.test.ts` › keyboard map (spec).
- ARIA: the panel is `role="dialog"` with `aria-modal="true"`, `aria-labelledby` on the `DialogTitle` id, and `aria-describedby` on the `DialogDescription` id **only while a `DialogDescription` is mounted** (it registers itself, as in `Popover`), so the dialog never references a missing id. A consumer `role` passed to `DialogContent` (for example `role="alertdialog"` from `ConfirmDialog`) replaces `dialog`.
- Nested overlays: every open `DialogContent` joins the shared overlay layer stack (`composables/use-overlay-layer`). Only the top layer handles `Escape` and `Tab` trapping, so `Escape` in a dialog opened from a `Drawer` closes the dialog only, and a `Popover` teleported out of a dialog keeps its own `Tab` containment. Tests: `dialog.test.ts` › nested overlays.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on every animated element; nothing sets the transition inline. Tests: `dialog-motion.test.ts`.
- Touch target ≥40×40 px where the control is interactive.
- Overlay: every open dialog renders its overlay; there is no way to open a dialog without one, so the page behind is never clickable while it is open. Tests: `dialog.test.ts` › overlay.
- Teleported content: the portal wraps its content (overlay and panel) in a `display: contents` element that binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

- Default
- Sizes — the `size` axis (`small` | `medium` | `large`), one composite story.
- ScrollContent — body taller than the dialog, centered above the page. Justified beyond the canonical set because the scrolling body is documented behaviour of this component.
- ScrollContentMobile — the same body below `md`, where the dialog is a bottom sheet with a different cap and position (`max-md:` classes), not merely a narrower canvas. Both scroll stories open from the trigger: a dialog that mounts open would cover the autodocs page.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
