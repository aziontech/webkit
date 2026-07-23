---
name: command-menu
category: overlay
structure: composition
status: implemented
spec_version: 1
checksum: f50f99e261bca417ba3d448ead73c41cd65bc242d392ebb5cfd4c009f5c3ca16
created: 2026-07-23
last_updated: 2026-07-23
---

# Command Menu — Component Spec

## Purpose

Command Menu is a ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the `Dialog` primitive for its panel, backdrop, focus trap, scroll-lock, and Escape handling, and adds the palette chrome on top — a search `Input`, a scrollable `List` of `Item`s organized into optional `Group`s, an `Empty` state, and `Separator`s. The root owns open/closed state (controlled or uncontrolled), a global open shortcut (⌘K / Ctrl+K), the substring filter, and roving active-item navigation. It differs from `dropdown` (a small trigger-anchored menu) and `select` (a form value picker): Command Menu is a full-screen search-first launcher for actions, not a positioned menu or an input control.

## When to use

- Provide a global ⌘K launcher for navigating to pages or running actions across an app.
- Let users filter a large, grouped list of commands by typing, then activate with the keyboard.

## When NOT to use

- A small menu anchored to a trigger button → use `dropdown`.
- Picking a value for a form field → use `select` / `multi-select`.
- A confirmation or content modal without search/list semantics → use `dialog` directly.

## Related

- `dialog` — the overlay primitive Command Menu wraps for panel, backdrop, focus trap, and Escape.
- `kbd` — renders each item's keyboard-shortcut hint and the ⌘K affordance.
- `dropdown` — trigger-anchored menu; reach for it when the list is short and positioned by a trigger.

## Best practices

- Write items as Title Case verb phrases describing an action ("Deploy Project"), not navigation labels.
- Keep the palette controlled via `v-model:open` so the app can open it from a button and from the global ⌘K shortcut.
- Group related actions with `<CommandMenu.Group heading="…">` and separate distinct sections with `<CommandMenu.Separator>`.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import CommandMenu from '@aziontech/webkit/command-menu'

const open = ref(false)
function run(action) {
  // navigate / execute the selected action
}
</script>

<template>
  <CommandMenu v-model:open="open" shortcut="meta+k" @select="(event, value) => run(value)">
    <CommandMenu.Input placeholder="Search commands…" />
    <CommandMenu.List>
      <CommandMenu.Group heading="Actions">
        <CommandMenu.Item value="deploy" shortcut="meta+d">Deploy Project</CommandMenu.Item>
        <CommandMenu.Item value="new-app" shortcut="meta+n">Create Application</CommandMenu.Item>
      </CommandMenu.Group>
      <CommandMenu.Separator />
      <CommandMenu.Group heading="Navigation">
        <CommandMenu.Item value="settings">Go to Settings</CommandMenu.Item>
      </CommandMenu.Group>
      <CommandMenu.Empty>No commands found.</CommandMenu.Empty>
    </CommandMenu.List>
  </CommandMenu>
</template>
```

Tree-shaking alternative — the standalone root + each sub-component from its own entry:

```vue
<script setup>
import CommandMenu from '@aziontech/webkit/command-menu-root'
import CommandMenuInput from '@aziontech/webkit/command-menu-input'
import CommandMenuList from '@aziontech/webkit/command-menu-list'
import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
import CommandMenuItem from '@aziontech/webkit/command-menu-item'
import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'
import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
</script>
```

## Sub-components

The root ships a compound API via `index.ts` (`Object.assign` attaches every sub-component; vue-tsc emits `index.d.ts`). Root binding is PascalCase `CommandMenu`. Folder layout, one folder per part:

```
packages/webkit/src/components/overlay/command-menu/
├── command-menu.vue          (root — wraps Dialog, provides context)
├── index.ts                  (compound Object.assign)
├── injection-key.ts          (CommandMenuContext + useCommandMenuContext())
├── command-menu.test.ts
├── command-menu-input/command-menu-input.vue
├── command-menu-list/command-menu-list.vue
├── command-menu-group/command-menu-group.vue
├── command-menu-item/command-menu-item.vue
├── command-menu-empty/command-menu-empty.vue
└── command-menu-separator/command-menu-separator.vue
```

- `command-menu-input/command-menu-input.vue` — the search field. Context-aware: reads and writes the injected `query` (no consumer `v-model`). Renders a leading search icon and a bare `<input role="combobox">`. Autofocuses when the palette opens. Delegates `ArrowDown`/`ArrowUp`/`Enter`/`Home`/`End` to the context's roving navigation.
  - Props: `placeholder: string` default `''` — input placeholder text.
  - Events: _none_ (the query lives in the injected context).
  - Slots: _none_.
- `command-menu-list/command-menu-list.vue` — the scrollable results region. `role="listbox"`; wraps the groups/items and renders the `Empty` part when the filter yields no visible items.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<CommandMenu.Group>` / `<CommandMenu.Item>` / `<CommandMenu.Separator>`, plus an optional `<CommandMenu.Empty>`.
- `command-menu-group/command-menu-group.vue` — labeled section. Renders an uppercase `heading` row above its items; hides itself entirely when all of its items are filtered out.
  - Props: `heading: string` default `''` — uppercase section label; omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<CommandMenu.Item>`.
- `command-menu-item/command-menu-item.vue` — a selectable command row. `role="option"`. Registers itself with the context (value + searchable text) so the root can filter and track the active item. Activated by click, `Enter` while active, or a full-row pointer; activation calls the context, which emits the root `select` and closes the palette. Shows an optional keyboard-shortcut hint rendered with `Kbd`.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when the item is activated; also part of the searchable text.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens; the item is skipped by roving navigation and never activates.
    - `shortcut: string` default `''` — a `'+'`-delimited shortcut hint (e.g. `'meta+d'`, `'meta+shift+p'`, `'esc'`) rendered on the right via `Kbd`. Modifier tokens (`meta`/`ctrl`/`shift`/`alt`) map to `Kbd` modifier props; the final token is the key. Display only — it does not register a global keybinding.
  - Events: _none_ (root emits `select`).
  - Slots: `default` — the item label (rich content allowed); `prefix` — leading icon/avatar; `suffix` — trailing content (mutually exclusive with `shortcut`).
- `command-menu-empty/command-menu-empty.vue` — the no-results state, shown only when the filter produces zero visible items. Fallback copy lives inside the slot.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the empty-state message (falls back to "No results found." when empty).
- `command-menu-separator/command-menu-separator.vue` — a thin divider between sections. `role="separator"`, `aria-hidden`.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `open` | `boolean` | `undefined` | no | Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the palette is uncontrolled. |
| `defaultOpen` | `boolean` | `false` | no | Initial open state when uncontrolled. |
| `dismissible` | `boolean` | `true` | no | When true, backdrop click and Escape close the palette. |
| `shortcut` | `string` | `'meta+k'` | no | Global `'+'`-delimited keyboard shortcut that toggles the palette open (e.g. `'meta+k'`); matched against Ctrl on non-macOS platforms. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | Fires on every open/closed transition; supports `v-model:open`. |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fires when an enabled item is activated (click or `Enter`). `event` is the activation event; `value` is the item's identifier. The palette closes automatically and focus returns to the element that was focused before opening. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The palette content: a `<CommandMenu.Input>` followed by a `<CommandMenu.List>`. Rendered inside the teleported dialog panel. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (roving highlight), `disabled`, `empty`
- `data-state` values (root): `open` | `closed` (inherited from the wrapped `Dialog`)
- `data-active` on an item mirrors the roving active item (keyboard/hover highlight)
- `data-disabled` on an item mirrors its `disabled` prop
- `empty`: when the filter yields no visible items, the `Empty` part renders in place of the list rows

## Motion & Animations

The palette panel's open/close scale animation is owned by the wrapped `Dialog` (its `DialogContent`/`DialogPortal`), including its reduced-motion escape — Command Menu renders no panel animation of its own. The only motion this component's own markup introduces is the item hover/active color transition:

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| item hover / active change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel surface / border / shape / shadow | inherited from `Dialog` (`var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)`, `var(--shadow-sm)`) |
| input divider | `border-b border-[var(--border-default)]` |
| input text | `var(--text-default)` |
| input placeholder / search icon | `var(--text-muted)` |
| group heading typography | `.text-overline-sm` + `text-[var(--text-muted)]` |
| item label typography | `.text-label-sm` + `text-[var(--text-default)]` |
| item shape | `var(--shape-button)` |
| item spacing.x | `var(--spacing-sm)` |
| item spacing.y | `var(--spacing-xxs)` |
| item gap | `var(--spacing-xs)` |
| item active surface | `var(--bg-selected)` |
| item hover surface | `var(--bg-hover)` |
| item disabled text | `var(--text-disabled)` |
| separator | `border-t border-[var(--border-default)]` |
| empty-state text | `.text-label-sm` + `text-[var(--text-muted)]` |
| focus ring | `var(--ring-color)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the input; items use the roving `data-active` highlight (the input keeps DOM focus).
- Keyboard map:
  - Global: the `shortcut` combo (⌘K / Ctrl+K) toggles the palette open from anywhere.
  - Inside the palette: `ArrowDown` / `ArrowUp` move the active item (skipping disabled, wrap-around); `Home` / `End` jump to first/last enabled item; `Enter` activates the active item; `Esc` closes (via `Dialog`); `Tab` is trapped within the panel (via `Dialog`).
- ARIA: the panel is `role="dialog"` (from `Dialog`) with an accessible name via a visually-hidden title; the input is `role="combobox"` with `aria-expanded` and `aria-controls` pointing at the list; the list is `role="listbox"`; each group is `role="group"` with `aria-labelledby` referencing its heading id; each item is `role="option"` with `aria-selected` mirroring the active state and `aria-disabled` mirroring `disabled`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled`).
- `motion-reduce:animate-none` on the inherited `animate-popup-scale-*`; `motion-reduce:transition-none` on item `transition-colors`.
- Focus management: opening moves focus to the input; closing returns focus to the element focused before the palette opened. Focus trap and scroll-lock are inherited from `Dialog`.
- Touch target: item rows are full-width click targets ≥32 px tall, satisfying the in-overlay 24×24 px floor (WCAG 2.5.8).

## Stories (Storybook)

Composition component with no `kind`/`size` axis; stories forced open (`open` arg) so the teleported panel renders, matching the `dialog` story pattern.

- Default — a controlled palette with one input, one group, and several items (no shortcuts).
- Grouped — composite story with two `<CommandMenu.Group>` separated by a `<CommandMenu.Separator>`. Required because grouping + separators are central anatomy not covered by `Default`.
- WithShortcuts — items carrying `shortcut` hints rendered via `Kbd`. Required because the `shortcut` prop and its `Kbd` rendering are public Item API with no other coverage.
- Empty — the palette with a query that matches nothing, showing the `<CommandMenu.Empty>` state. Required because the empty state is a distinct visual state (the `empty` state in the States table) with no other coverage.
- Disabled — a group containing a disabled item alongside enabled ones. Required because `disabled` is public Item API and the disabled row is a distinct state.

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
