---
name: context-menu
category: navigation
structure: composition
status: implemented
spec_version: 5
template: 2
checksum: fccca6d967dcbcf3f4a4db0ab13dbcab2869d6629de59534c74a4530037bde59
created: 2026-11-14
last_updated: 2026-11-17
---

# ContextMenu — Component Spec

## Purpose

Menu of actions that opens at the pointer when the user right-clicks an area, presses `Shift+F10` or the context-menu key inside it, or long-presses it on touch. It is the right-click twin of `DropdownMenu`: the root `ContextMenu` owns open state, the pointer anchor, positioning and focus return through the same internal menu core, `ContextMenu.Trigger` marks the area that listens, and the item parts are DropdownMenu's own (`Group`, `Item` with its checkbox and radio variants, `Sub`, `SubTrigger`, `SubContent`), attached to the compound so the two menus look and behave the same.

## When to use

- Use ContextMenu for the same actions as a DropdownMenu, opened by right-click or long-press on an item; opened from a button use DropdownMenu.
- Secondary actions on an object the user is pointing at: a table row, a file in a browser, a tree node, a canvas.
- Power-user shortcuts that also exist elsewhere in the interface.

## When NOT to use

- The only way to reach an action. Right-click is invisible; every action in a context menu must also be reachable from a visible control (a row-actions `DropdownMenu`, a toolbar button).
- A menu opened from a button → use `dropdown-menu`.
- A searchable palette of commands → use `command`.
- Free-form content such as forms → use `popover`.

## Related

- `dropdown-menu` — same panel, items and keyboard model, opened from a trigger button; `ContextMenu` reuses its item parts.
- `popover` — free-form floating content on the same `usePlacement` positioning.
- `table` — row actions usually pair a visible `DropdownMenu` with a `ContextMenu` around the rows.

## Best practices

- Wrap the object, not the page: one `ContextMenu.Trigger` around the table body, the file grid or the tree, and read which row was targeted from your own state (for example the row the `contextmenu` came from, captured with a native `@contextmenu` on the row).
- Mirror the visible row-actions menu; a context menu adds speed, never exclusive actions.
- Keep it short (under about ten items), group with `ContextMenu.Group`, and put destructive actions in their own last group.
- Give the panel a name with `aria-label` when the target is not obvious from focus (for example `aria-label="Actions for production"`).
- `disabled` gives the area back to the browser's native menu.

## Usage

```vue
<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu'

  const onSelect = (event, value) => {
    console.log(value)
  }
</script>

<template>
  <ContextMenu
    aria-label="File actions"
    @select="onSelect"
  >
    <ContextMenu.Trigger>
      <FileGrid />
    </ContextMenu.Trigger>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="open"
        label="Open"
      />
      <ContextMenu.Item
        value="rename"
        label="Rename"
        command="F2"
      />
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger label="Move to" />
        <ContextMenu.SubContent>
          <ContextMenu.Group>
            <ContextMenu.Item
              value="production"
              label="production"
            />
          </ContextMenu.Group>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </ContextMenu.Group>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="delete"
        label="Delete"
      />
    </ContextMenu.Group>
  </ContextMenu>
</template>
```

Tree-shaking alternative — the root and trigger as standalone imports, with the item parts from `dropdown-menu`:

```vue
<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu-root'
  import ContextMenuTrigger from '@aziontech/webkit/context-menu-trigger'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
</script>
```

## Sub-components

- `context-menu-trigger/context-menu-trigger.vue` — the area that opens the menu. Renders a block `div` that carries `data-testid` (`context-menu-trigger`), `data-state` and `data-disabled` and receives the consumer's attributes. It is not focusable itself and has no role; the focusable content inside it (rows, buttons, links) keeps its own semantics. It listens for `contextmenu` (opens at the pointer and prevents the native menu), `keydown` `Shift+F10` and the `ContextMenu` key from any focused descendant (opens at the inline-start bottom corner of the focused element), and a 500 ms touch long-press that does not move more than 10 px (opens at the touch point). When the root is disabled it does nothing and the native menu appears.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the area's content.
- Item parts, shared with `DropdownMenu` and attached to the compound under the same names: `ContextMenu.Group` (`dropdown-menu-group`), `ContextMenu.Item` (`dropdown-menu-item`, including `type="checkbox"` / `type="radio"` and `command`), `ContextMenu.Sub`, `ContextMenu.SubTrigger` and `ContextMenu.SubContent` (`dropdown-menu-sub*`). Their props, slots and behaviour are specified in `.specs/dropdown-menu.md`; inside a `ContextMenu` they emit through this root's `select`.

## Props

| Prop        | Type      | Default | Required | JSDoc                                                                           |
| ----------- | --------- | ------- | -------- | ------------------------------------------------------------------------------- |
| `disabled`  | `boolean` | `false` | false    | Leaves the area to the browser's native context menu and never opens the panel. |
| `ariaLabel` | `string`  | `''`    | false    | Accessible name of the menu panel; when empty the panel has no name of its own. |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                              |
| -------------- | --------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`. While unbound the menu is uncontrolled and starts closed. Opened from the model without a pointer position, the panel anchors at the trigger area's inline-start top corner. |

## Events

| Event    | Payload                                                              | Notes                                                                                                                                                                                    |
| -------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: DropdownMenuItemValue)` | Fires when an enabled option is activated, at any sub-menu depth. The panel closes and focus returns to the element that was focused in the area, except for checkbox and radio options. |

## Slots

| Slot      | Scope | Notes                                                                                   |
| --------- | ----- | --------------------------------------------------------------------------------------- |
| `default` | —     | Place `<ContextMenu.Trigger>` (the area) followed by one or more `<ContextMenu.Group>`. |

## States

- Visual states of the items: as `dropdown-menu` (`default`, `hover`, `focus-visible`, `selected`, `disabled`, checked).
- `data-state` values (root, trigger, panel): `open` | `closed`.
- `data-disabled` on root and trigger mirrors `disabled`.
- `data-side` / `data-align` on the panel mirror the resolved side (`bottom` | `top`) and alignment (`start`, or `end` once it flips to fit); `start` is the pointer's inline-start, so under `rtl` the panel's right edge sits on the pointer.
- `loading`, `empty`, `error`, `readonly`, `invalid`: not states of this component; it renders the items the consumer passes.

## Motion & Animations

| Trigger     | Animation / Transition                                  | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ----------- | ------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| panel open  | `animate-popup-scale-in` (origin from `--popup-origin`) | semantic (`moderate-01` · `productive-entrance`)  | `motion-reduce:animate-none` (instant) |
| panel close | `animate-popup-scale-out`                               | semantic (`fast-02` · `productive-exit`)          | `motion-reduce:animate-none` (instant) |

## Tokens

| Region          | Token (DESIGN.md)                      |
| --------------- | -------------------------------------- |
| panel surface   | `var(--bg-surface)`                    |
| panel border    | `var(--border-default)`                |
| panel shape     | `var(--shape-card)`                    |
| panel shadow    | `var(--shadow-sm)`                     |
| panel spacing.y | `var(--spacing-xs)`                    |
| panel width     | `--container-3xs` to `--container-2xs` |
| popup origin    | `var(--popup-origin)`                  |
| item rows       | as `dropdown-menu` (shared parts)      |

## Theme gaps

_none_ — the panel uses the same tokens as `dropdown-menu`.

## Accessibility (WCAG 2.1 AA)

- Visible focus: the items carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)` (shared parts).
- Keyboard map:
  - Inside the trigger area: `Shift+F10` or the `ContextMenu` key opens the panel at the focused element and focuses the first enabled item.
  - Inside the panel: `Down` / `Up` move between enabled items (wrap-around); `Home` / `End` jump to the first / last; `Enter` / `Space` activate; `ArrowRight` (`ArrowLeft` under rtl) opens a sub-menu; `Esc` closes and returns focus to the element that was focused in the area; `Tab` closes. Tests: `context-menu.test.ts` › keyboard.
- ARIA: the panel is `role="menu"` named by `aria-label` when set; items are `menuitem` / `menuitemcheckbox` / `menuitemradio` (shared parts). The trigger area keeps no role: it is a region of content, and the context menu is a shortcut layer over controls that are reachable on their own.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled items (`--text-disabled`).
- `motion-reduce:animate-none` on `animate-popup-scale-*`.
- Teleported panel: binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`).
- Touch target: items are 32 px rows, above the 24 px floor of WCAG 2.5.8.

## Internationalization

No built-in strings: item labels and the panel's `aria-label` come from the consumer.

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`text-start`, `ps-`/`pe-`); the panel binds `dir` from `ConfigProvider`.
- Icons: the sub-trigger chevron mirrors (shared part); no other icon.
- Keyboard: a keyboard-opened panel anchors at the inline-start bottom corner of the focused element (its right edge under rtl) and prefers opening toward the inline end; `ArrowLeft` opens a sub-menu under rtl. Pointer opens anchor at the pointer in both directions.
- User data: none (labels are consumer text).

## Responsive

- Container queries: none; the panel is sized between `--container-3xs` and `--container-2xs`.
- Narrow (≤ 640 px or a narrow container): `usePlacement` picks the corner with room and keeps the panel inside the viewport; labels truncate.
- Touch: a 500 ms long-press opens the menu at the touch point, so the right-click has a touch path; rows are 32 px.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./context-menu-root` (root with the shared menu core) and `./context-menu-trigger` have their own entries in `.size-limit.json`; `./context-menu` carries the root, the trigger and the shared DropdownMenu item parts.
- Runtime budget: one listener set on the area regardless of how many rows it wraps, so wrapping a 1,000-row table adds no per-row cost; the panel renders only while open.
- Heavy parts: none.

## Examples

Canonical layout — composite examples (`types.vue`, `sizes.vue`) render every variant of one axis side-by-side in a single frame; state examples (`loading.vue`, `disabled.vue`) change only the prop they demonstrate.

- Default — a list of resources inside `ContextMenu.Trigger`; right-click, `Shift+F10` or long-press a row to open the menu.
- WithSubMenu — panel forced open (`:open="true"`) showing groups, a `command` hint, checkbox items and an open sub-menu. Required because the forced-open panel is the only way to show the menu's anatomy without a pointer, and the shared sub-menu and checkable parts need coverage inside this root.
- Disabled — the same area with `disabled`; the browser's native menu appears.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
