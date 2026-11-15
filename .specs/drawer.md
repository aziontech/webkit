---
name: drawer
category: overlay
structure: composition
status: implemented
spec_version: 6
checksum: 13c83d0072cec17355a804886a7762112ffdd139969c400396729985cbb3b404
created: 2026-05-22
last_updated: 2026-11-15
---

# Drawer — Component Spec

## Purpose

A panel that slides in from an edge of the screen and keeps the page behind it in view. It holds secondary work that is too large or too long-lived for a dialog: filters, a long form, the details of a row, a navigation list. `Drawer.Content` is the whole modal: it teleports to `body`, renders the dimmed overlay, traps focus and scroll-locks the page, so the page behind cannot be clicked or tabbed to while it is open. The header gets the close (X) button on its own unless `closable` is false. It closes on Escape and on an overlay click when `dismissible`, and returns focus to its trigger. `:modal="false"` is the one opt-out: no overlay, no focus trap, no scroll lock, for a side panel that works next to the page it talks about (as Radix `modal={false}`).

## When to use

- A panel that slides in from a screen edge to add or edit one item of the screen behind it (a rule, an origin, a record inside a resource), while keeping that screen in view.
- The reader already stands on the screen that owns the item: the drawer is the last step of the path (rail, list, resource page, tab), never the first.
- A form needs a resource that does not exist yet (the certificate of a workload being created): the field offers to create it, and the drawer holds that resource's create form over the form, then selects it. Use it every time; never send the reader away to create it.
- The content is too large or persistent for a centered modal.

## When NOT to use

- It is a short, focused confirmation/task best centered and fully blocking → use `dialog`.
- It is a small overlay anchored to a trigger → use a popover / `dropdown`.
- It opens, configures or edits a product or a resource (Configure, Settings, Edit) → navigate to the resource's page, on its settings tab.
- It needs tabs, a breadcrumb or its own navigation, or a third drawer would stack → it is a page.

## Related

- `dialog` — centered, blocking modal for focused tasks/confirmations.
- `sidebar` — persistent (non-overlay) side navigation.

## Best practices

- Pick the edge (side) intentionally and keep it consistent across the app.
- Set `size="large"` on the first drawer of a flow. A nested drawer stacked on it is `size="medium"`, at most one, never a third. The AI assistant drawer is the one `medium` first drawer.
- Do not add an overlay, a portal or a close button by hand: `Drawer.Content` renders the overlay and the portal, and the header renders the close button while `closable` is true (the default).
- Keep the drawer modal (the default). Use `:modal="false"` only when the reader must keep reading or using the page beside the drawer, such as an assistant that answers questions about the page.
- While an action is in flight, set `:dismissible="false"` and `:closable="false"` together so nothing can close it.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Usage

The compound import leads: every part hangs off the root (`Drawer.Trigger`, `Drawer.Content`, …), and `Drawer.Header`, `Drawer.Body` and `Drawer.Footer` are the shared Panel regions, so one import builds the whole drawer.

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    side="end"
    size="medium"
  >
    <Drawer.Trigger>
      <Button
        label="Add origin"
        kind="primary"
      />
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Add origin</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Drawer.Description>
          Point the application at the server that holds the original content.
        </Drawer.Description>
      </Drawer.Body>
      <Drawer.Footer>
        <Button
          label="Cancel"
          kind="outlined"
          @click="open = false"
        />
        <Button
          label="Save"
          kind="primary"
        />
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
</template>
```

Tree-shaking: `@aziontech/webkit/drawer-root` is the root alone (nothing attached), and every part keeps its own path (`@aziontech/webkit/drawer-trigger`, `-content`, `-title`, `-description`, `-close`, and `@aziontech/webkit/panel-header`, `panel-content`, `panel-footer` for the regions). There is no portal or overlay part: `drawer-content` renders both.

## Sub-components

- `index.ts` — the compound: the root with every part attached by `Object.assign` (`Drawer.Trigger`, `.Content`, `.Title`, `.Description`, `.Close`), plus the shared Panel regions as `Drawer.Header` (`panel-header`), `Drawer.Body` (`panel-content`) and `Drawer.Footer` (`panel-footer`). It adds no component of its own. Exported at `@aziontech/webkit/drawer`; the root alone is `@aziontech/webkit/drawer-root`. The parts stay in the root folder (flat).
- `drawer-close.vue` — Public sub-component `drawer-close`: the close (X) `IconButton`. `Drawer.Content` puts one at the end of its `PanelHeader` while `closable` is true, so a consumer places it by hand only in a custom header with `:closable="false"`. It always closes the drawer.
- `drawer-content.vue` — Public sub-component `drawer-content`: the drawer itself. It teleports to `body` (kept mounted through the exit transition), renders the overlay while `modal` (`aria-hidden`, `__backdrop` test id; a click on it closes the drawer when `dismissible`) and the `role="dialog"` panel, traps focus and scroll-locks the page while `modal`, and restores focus on close.
- `drawer-description.vue` — Public sub-component `drawer-description`.
- `drawer-title.vue` — Public sub-component `drawer-title`.
- `drawer-trigger.vue` — Public sub-component `drawer-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the drawer on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

## Props

| Prop          | Type         | Default    | Required | JSDoc                                                                                                                                                                                                                         |
| ------------- | ------------ | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen` | `boolean`    | `false`    | false    | Initial open state when uncontrolled.                                                                                                                                                                                         |
| `closable`    | `boolean`    | `true`     | false    | Shows the close (X) button at the end of the drawer header. False removes it; Escape and overlay click still follow `dismissible`.                                                                                            |
| `dismissible` | `boolean`    | `true`     | false    | Light-dismiss: when true, overlay click and Escape close the drawer. It does not govern the close button; see `closable`.                                                                                                     |
| `modal`       | `boolean`    | `true`     | false    | Renders the overlay, traps focus and locks page scroll. False leaves the page beside the drawer usable: no overlay, no focus trap, no scroll lock, `aria-modal` false; Escape, the close button and focus restore still work. |
| `side`        | `DrawerSide` | `'end'`    | false    | Edge the drawer panel slides from, in reading direction (`start` or `end`).                                                                                                                                                   |
| `size`        | `DrawerSize` | `'medium'` | false    | Panel max-width preset (`small` `--container-sm`, `medium` `--container-xl`, `large` `--container-4xl`). Height is always 100% viewport.                                                                                      |

- Two close paths: `dismissible` gates the light-dismiss paths (`Esc`, overlay click); `closable` shows or removes the close (X) button, as Radix and the prop vocabulary separate them. `Drawer.Close` and the context `close()` always close. Tests: `drawer.test.ts` › closable.
- `modal` (default `true`) is the only way to drop the overlay. Tests: `drawer.test.ts` › modal.

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
- Server render and hydration: the phone layout is CSS breakpoints only (`max-md:` / `md:`), so the server HTML and the hydrated DOM are identical at every width.
- `data-side` and `data-size` on the `role="dialog"` element mirror `side` and `size`, reactively; `side`, `size` and `dismissible` are read live from the root, so `:dismissible="!saving"` locks an open drawer while it saves. The width comes from container tokens (`data-[size=small]:md:max-w-(--container-sm)`, `medium` `--container-xl`, `large` `--container-4xl`), not a JS map or an inline `max-width`.
- Attributes: the `Drawer` root forwards every consumer attribute to its root element; `DrawerContent` forwards its attributes to the `role="dialog"` element.

## Motion & Animations

| Trigger              | Animation / Transition                                                                                                                                      | Token                                                                                                       | Reduced-motion fallback         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| panel open / close   | `transition-[translate] duration-slow-02 ease-expressive-entrance`, closing `data-[state=closed]:duration-slow-01 data-[state=closed]:ease-expressive-exit` | `duration['slow-02']` / `duration['slow-01']` + `curve['expressive-entrance']` / `curve['expressive-exit']` | `motion-reduce:transition-none` |
| overlay open / close | `transition-opacity duration-slow-01 ease-productive-entrance`, closing `data-[state=closed]:duration-slow-02 data-[state=closed]:ease-productive-exit`     | `duration['slow-01']` / `duration['slow-02']` + `curve['productive-entrance']` / `curve['productive-exit']` | `motion-reduce:transition-none` |

No element sets an inline `transition`, so `motion-reduce:transition-none` wins and the panel appears in place under `prefers-reduced-motion` (pinned by `dialog-motion.test.ts`).

- From `md` up the panel slides in from its `side` edge (`translate-x`) and out to it. `side` is logical (`start` | `end`) and the panel anchors on that edge (`start-0` / `end-0`), so under `dir="rtl"` the slide mirrors with it (`rtl:` variants): a `start` drawer sits on the right and leaves to the right.

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
- Keyboard map: `Enter`/`Space` on the trigger opens the drawer and moves focus to its first focusable control. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it and focus returns to the trigger, or, when opened without a `Drawer.Trigger`, to the element that held focus when it opened. Tests: `drawer.test.ts` › keyboard map (spec).
- ARIA: the panel is `role="dialog"` with `aria-modal="true"` (`false` with `:modal="false"`, where focus moves in on open but `Tab` is not trapped), `aria-labelledby` on the `DrawerTitle` id, and `aria-describedby` on the `DrawerDescription` id only while a `DrawerDescription` is mounted.
- Nested overlays: every open `DrawerContent` joins the shared overlay layer stack, so only the top layer handles `Escape` and `Tab` trapping: `Escape` in a `ConfirmDialog` opened from the drawer closes the confirm and leaves the drawer open. Tests: `drawer.test.ts` › nested overlays.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on every animated element.
- Touch target ≥40×40 px where the control is interactive.
- Overlay: a modal drawer (the default) always renders its overlay, so the page behind is never clickable while it is open. Tests: `drawer.test.ts` › overlay.
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
