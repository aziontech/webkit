# Command

> Command Menu is a ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the `Dialog` primitive for its panel, backdrop, focus trap, scroll-lock, and Escape handling, and adds the palette chrome on top — a search `Input`, a scrollable `List` of `Item`s organized into optional `Group`s, an `Empty` state, and `Separator`s. The root owns open/closed state (controlled or uncontrolled), a global open shortcut (⌘K / Ctrl+K), the substring filter, and roving active-item navigation. It differs from `dropdown` (a small trigger-anchored menu) and `select` (a form value picker): Command Menu is a full-screen search-first launcher for actions, not a positioned menu or an input control.

- Import: `import CommandRoot from '@aziontech/webkit/command-root'`
- Compound import (dot notation, not tree-shakeable): `import Command from '@aziontech/webkit/command'`
- Category: overlay · Surface: product · Structure: composition
- API as JSON: [command.json](https://github.com/aziontech/webkit/blob/main/.specs/command.json)

## When to use

- Provide a global ⌘K launcher for navigating to pages or running actions across an app.
- Let users filter a large, grouped list of commands by typing, then activate with the keyboard.

## Do

- Write items as Title Case verb phrases describing an action ("Deploy Project"), not navigation labels.
- Keep the palette controlled via `v-model:open` so the app can open it from a button and from the global ⌘K shortcut.
- Group related actions with `<Command.Group heading="…">` and separate distinct sections with `<Command.Separator>`.

## Don’t

- A small menu anchored to a trigger button → use `dropdown`.
- Picking a value for a form field → use `select` / `multi-select`.
- A confirmation or content modal without search/list semantics → use `dialog` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — the overlay primitive Command Menu wraps for panel, backdrop, focus trap, and Escape.
- [kbd](kbd.md) — renders each item's keyboard-shortcut hint and the ⌘K affordance.
- dropdown` — trigger-anchored menu; reach for it when the list is short and positioned by a trigger.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the palette is uncontrolled. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `dismissible` | `boolean` | `true` | false | When true, backdrop click and Escape close the palette. |
| `shortcut` | `string` | `'meta+k'` | false | Global `'+'`-delimited keyboard shortcut that toggles the palette open (e.g. `'meta+k'`); matched against Ctrl on non-macOS platforms. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` | Fires on every open/closed transition; supports `v-model:open`. |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fires when an enabled item is activated (click or `Enter`). `event` is the activation event; `value` is the item's identifier. The palette closes automatically and focus returns to the element that was focused before opening. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The palette content: a `<Command.Input>` followed by a `<Command.List>`. Rendered inside the teleported dialog panel. |

## Sub-component imports

- `@aziontech/webkit/command-input`
- `@aziontech/webkit/command-list`
- `@aziontech/webkit/command-group`
- `@aziontech/webkit/command-item`
- `@aziontech/webkit/command-empty`
- `@aziontech/webkit/command-separator`

## Sub-components

The root ships a compound API via `index.ts` (`Object.assign` attaches every sub-component; vue-tsc emits `index.d.ts`). Root binding is PascalCase `Command`. Folder layout, one folder per part:

```
packages/webkit/src/components/overlay/command/
├── command.vue          (root — wraps Dialog, provides context)
├── index.ts                  (compound Object.assign)
├── injection-key.ts          (CommandContext + useCommandMenuContext())
├── command.test.ts
├── command-input/command-input.vue
├── command-list/command-list.vue
├── command-group/command-group.vue
├── command-item/command-item.vue
├── command-empty/command-empty.vue
└── command-separator/command-separator.vue
```

- `command-input/command-input.vue` — the search field. Context-aware: reads and writes the injected `query` (no consumer `v-model`). Builds on the `Input` field (`size="large"`, full-width) with a leading search icon in its `iconLeft` slot and a decorative `Esc` `Kbd` hint (`key-name="escape"`, text from the locale catalog) in its `iconRight` slot, so the focus ring sits on the whole bar; the inner `<input>` carries `role="combobox"`. Autofocuses when the palette opens. Delegates `ArrowDown`/`ArrowUp`/`Enter`/`Home`/`End` to the context's roving navigation.
  - Props: `placeholder: string` default `''` — input placeholder text; empty uses the locale catalog (`Search everything` in English). `ariaLabel: string` default `''` — accessible name for the search field; when empty it falls back to `placeholder`, so the field keeps its name after the placeholder disappears on the first keystroke.
  - Events: _none_ (the query lives in the injected context).
  - Slots: _none_.
- `command-list/command-list.vue` — the scrollable results region. `role="listbox"` while at least one item is visible; with no visible item it drops the role (an empty listbox fails `aria-required-children`) and shows the `Empty` part.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Group>` / `<Command.Item>` / `<Command.Separator>`, plus an optional `<Command.Empty>`.
- `command-group/command-group.vue` — labeled section. Renders a `heading` row (`text-label-sm` in `--text-muted`, sentence case) above its items; hides itself entirely when all of its items are filtered out. Carries `--spacing-sm` above itself when it follows another group, and deliberately **not** when it follows a `<Command.Separator>` — the separator owns the space around itself, so the two rules are mutually exclusive and never stack.
  - Props: `heading: string` default `''` — section label; omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Item>`.
- `command-item/command-item.vue` — a selectable command row. `role="option"`. Registers itself with the context (value + searchable text) so the root can filter and track the active item. Activated by click, `Enter` while active, or a full-row pointer; activation calls the context, which emits the root `select` and closes the palette. Shows an optional keyboard-shortcut hint rendered with `Kbd`.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when the item is activated; also part of the searchable text.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens; the item is skipped by roving navigation and never activates.
    - `shortcut: string` default `''` — a `'+'`-delimited shortcut hint (e.g. `'meta+d'`, `'meta+shift+p'`, `'esc'`) rendered on the right via `Kbd`. Modifier tokens (`meta`/`ctrl`/`shift`/`alt`) map to `Kbd` modifier props; the final token is the key. A named final token (`esc`/`escape`, `enter`/`return`, `space`, `tab`, `backspace`, `delete`/`del`) is printed from the locale catalog through `Kbd` `key-name` (`Esc`, `Enter`, `Espaço`…); any other key is upper-cased. Display only — it does not register a global keybinding.
  - Events: _none_ (root emits `select`).
  - Slots: `default` — the item label (rich content allowed); `prefix` — leading icon/avatar; `suffix` — trailing content (mutually exclusive with `shortcut`).
  - **The icon box belongs to the item that has an icon.** An item renders the leading box only when it actually supplies a `prefix`; an icon-less item puts no empty element in the DOM and pays no indent, so a list that mixes iconed and icon-less rows lets each label start at the row inset it earns rather than every label inheriting the widest row's indent. The box is a fixed `size-4` — the same glyph size a `Menu` row uses — so an oversized icon cannot widen the row and pull its own label out of line with the iconed rows around it.
- `command-empty/command-empty.vue` — the no-results state, shown only when the filter produces zero visible items. Fallback copy lives inside the slot.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the empty-state message (falls back to "No results found." when empty).
- `command-separator/command-separator.vue` — a thin divider between sections. `role="separator"`, `aria-hidden`.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (roving highlight), `disabled`, `empty`
- `data-state` values (root): `open` | `closed` (inherited from the wrapped `Dialog`)
- `data-active` on an item mirrors the roving active item (keyboard/hover highlight)
- `data-disabled` on an item mirrors its `disabled` prop
- `empty`: when the filter yields no visible items, the `Empty` part renders in place of the list rows

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the input; items use the roving `data-active` highlight (the input keeps DOM focus).
- Keyboard map:
  - Global: the `shortcut` combo (⌘K / Ctrl+K) toggles the palette open from anywhere.
  - Inside the palette: `ArrowDown` / `ArrowUp` move the active item (skipping disabled, wrap-around); `Home` / `End` jump to first/last enabled item; `Enter` activates the active item; `Esc` closes (via `Dialog`); `Tab` is trapped within the panel (via `Dialog`).
- ARIA: the panel is `role="dialog"` (from `Dialog`) with an accessible name via a visually-hidden title; the input is `role="combobox"` with `aria-expanded` and `aria-controls` pointing at the list, and carries its own accessible name via `aria-label` (`ariaLabel`, falling back to `placeholder`) so the name survives the first keystroke; the list is `role="listbox"` (no role while nothing matches); each group is `role="group"` with `aria-labelledby` referencing its heading id; each item is `role="option"` with `aria-selected` mirroring the active state and `aria-disabled` mirroring `disabled`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled`).
- `motion-reduce:animate-none` on the inherited `animate-popup-scale-*`; `motion-reduce:transition-none` on item `transition-colors`.
- Focus management: opening moves focus to the input; closing returns focus to the element focused before the palette opened. Focus trap and scroll-lock are inherited from `Dialog`.
- Touch target: item rows are full-width click targets ≥32 px tall, satisfying the in-overlay 24×24 px floor (WCAG 2.5.8).

## Examples

### Default

```vue
<script setup>
  import Command from '@aziontech/webkit/command'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <SearchTrigger @open="open = true" />

  <Command
    v-model:open="open"
    shortcut="meta+k"
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup heading="Suggestions">
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
        <CommandItem value="settings">Go to Settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Commands">
        <CommandItem
          value="search"
          shortcut="meta+k"
          >Search everything</CommandItem
        >
        <CommandItem
          value="new-app-cmd"
          shortcut="meta+n"
          >New Application</CommandItem
        >
        <CommandItem
          value="toggle-theme"
          shortcut="meta+shift+l"
          >Toggle Theme</CommandItem
        >
      </CommandGroup>
    </CommandList>
  </Command>
</template>
```

### Grouped

```vue
<script setup>
  import { ref } from 'vue'
  import Command from '@aziontech/webkit/command'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open grouped palette"
    kind="primary"
    @click="open = true"
  />

  <Command
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup heading="Actions">
        <CommandItem value="deploy">
          <template #prefix
            ><i
              class="pi pi-cloud-upload"
              aria-hidden="true"
          /></template>
          Deploy Project
        </CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Navigation">
        <CommandItem value="settings">
          <template #prefix
            ><i
              class="pi pi-cog"
              aria-hidden="true"
          /></template>
          Go to Settings
        </CommandItem>
        <CommandItem value="billing">Go to Billing</CommandItem>
      </CommandGroup>
      <CommandGroup heading="Account">
        <CommandItem value="profile">
          <template #prefix
            ><i
              class="pi pi-user"
              aria-hidden="true"
          /></template>
          View Profile
        </CommandItem>
        <CommandItem value="logout">Log Out</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
```

### WithShortcuts

```vue
<script setup>
  import { ref } from 'vue'
  import Command from '@aziontech/webkit/command'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    kind="primary"
    @click="open = true"
  />

  <Command
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup heading="Actions">
        <CommandItem
          value="command"
          shortcut="meta+k"
          >Open Command Menu</CommandItem
        >
        <CommandItem
          value="command-palette"
          shortcut="meta+shift+p"
          >Open Command Palette</CommandItem
        >
        <CommandItem
          value="close"
          shortcut="esc"
          >Close Overlay</CommandItem
        >
      </CommandGroup>
    </CommandList>
  </Command>
</template>
```
