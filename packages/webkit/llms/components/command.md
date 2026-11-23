# Command

> Command Menu is a ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the `Dialog` primitive for its panel, backdrop, focus trap, scroll-lock, and Escape handling, and adds the palette chrome on top — a search `Input`, a scrollable `List` of `Item`s organized into optional `Group`s, an `Empty` state, and `Separator`s. The root owns open/closed state (controlled or uncontrolled), a global open shortcut (⌘K / Ctrl+K), the ranked filter, nested pages, and roving active-item navigation. The filter is fuzzy and ranked: an item matches on its label (prefix, then word start, then anywhere, then an in-order abbreviation such as `dpl` for "Deploy"), its `value`, or its extra `keywords` (a keyword equal to the query, then one that starts with it, then one that contains it, all below any match in the label and above an abbreviation, since the reader cannot see why a keyword matched); better matches rise to the top of their group, groups rise by their best item, and while any label matches the query a group shows at most three matches that come only from its values or keywords (its best three), so a strong label match in a later group is not pushed under a run of hidden-keyword matches, and the matched characters of a plain-text label are emphasized. An item can open a `Page` — a nested list such as "Switch project" — with a back control in the search bar. It differs from `dropdown` (a small trigger-anchored menu) and `select` (a form value picker): Command Menu is a full-screen search-first launcher for actions, not a positioned menu or an input control.

- Import: `import CommandRoot from '@aziontech/webkit/command-root'`
- Compound import (dot notation, not tree-shakeable): `import Command from '@aziontech/webkit/command'`
- Category: overlay · Surface: app · Structure: composition
- API as JSON: [command.json](command.json)

## When to use

- Use Command for the searchable ⌘K palette of actions and destinations; a short list of actions opened from a button is a DropdownMenu.
- Provide a global ⌘K launcher for navigating to pages or running actions across an app.
- Let users filter a large, grouped list of commands by typing, then activate with the keyboard.

## Do

- Write items as Title Case verb phrases describing an action ("Deploy Project"), not navigation labels.
- Keep the palette controlled via `v-model:open` so the app can open it from a button and from the global ⌘K shortcut.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.
- Group related actions with `<Command.Group label="…">` and separate distinct sections with `<Command.Separator>`.
- Give an item `keywords` for the words people type that are not in its label (`['org', 'team']` on "Switch organization"). Keywords match, they are never shown.
- Use a `Page` for a choice that needs its own list ("Switch project", "Change theme"), not for a deep tree: pages are one stack, and every page is one Backspace away from the previous one.

## Don’t

- A small menu anchored to a trigger button → use `dropdown-menu`.
- Picking a value for a form field → use `select` / `multi-select`.
- A confirmation or content modal without search/list semantics → use `dialog` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — the overlay primitive Command Menu wraps for panel, backdrop, focus trap, and Escape.
- [kbd](kbd.md) — renders each item's keyboard-shortcut hint and the ⌘K affordance.
- [dropdown-menu](dropdown-menu.md) — trigger-anchored menu; reach for it when the list is short and positioned by a trigger.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `dismissible` | `boolean` | `true` | false | When true, backdrop click and Escape close the palette. |
| `shortcut` | `string` | `'meta+k'` | false | Global `'+'`-delimited keyboard shortcut that toggles the palette open (e.g. `'meta+k'`); matched against Ctrl on non-macOS platforms. |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |
| `pageKey` | `string` | `''` | false | Two-way value (`v-model:pageKey`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
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
- `@aziontech/webkit/command-page`

## Sub-components

The root ships a compound API via `index.ts` (`Object.assign` attaches every sub-component; vue-tsc emits `index.d.ts`). Root binding is PascalCase `Command`. Folder layout, one folder per part:

```
packages/webkit/src/components/overlay/command/
├── command.vue          (root — wraps Dialog, provides context)
├── index.ts                  (compound Object.assign)
├── injection-key.ts          (CommandContext + useCommandMenuContext())
├── command-match.ts          (pure ranked fuzzy matcher, no Vue)
├── command.test.ts
├── command-input/command-input.vue
├── command-list/command-list.vue
├── command-group/command-group.vue
├── command-item/command-item.vue
├── command-empty/command-empty.vue
├── command-separator/command-separator.vue
└── command-page/command-page.vue
```

- `command-input/command-input.vue` — the search field. Context-aware: reads and writes the injected `query` (no consumer `v-model`). Builds on the `Input` field (`size="large"`, full-width) with a leading search icon in its `iconLeft` slot and a decorative `Esc` `Kbd` hint (`key-name="escape"`, text from the locale catalog) in its `iconRight` slot, so the focus ring sits on the whole bar; the inner `<input>` carries `role="combobox"`. Autofocuses when the palette opens. Delegates `ArrowDown`/`ArrowUp`/`Enter`/`Home`/`End` to the context's roving navigation. On a nested page it renders a back control before the field: a `chevron-left` glyph (mirrored under `dir="rtl"`) and the page's `heading`, as a native `<button>` named `Back from <heading>` from the locale catalog (`command.back`); activating it returns to the previous page. `Backspace` in an empty field and `Esc` also return to the previous page while one is open (`Esc` closes the palette only from the first page).
  - Props: `placeholder: string` default `''` — input placeholder text; empty uses the locale catalog (`Search everything` in English). `ariaLabel: string` default `''` — accessible name for the search field; when empty it falls back to `placeholder`, so the field keeps its name after the placeholder disappears on the first keystroke.
  - Events: _none_ (the query lives in the injected context).
  - Slots: _none_.
- `command-list/command-list.vue` — the scrollable results region. `role="listbox"` while at least one item is visible; with no visible item it drops the role (an empty listbox fails `aria-required-children`) and shows the `Empty` part. While the query is not empty it carries `data-ranked` and becomes a flex column, so groups and ungrouped items take their rank as a CSS `order`, and the root also moves the visible groups and rows in the DOM into that ranked order (nothing is re-created), so a screen reader reads the results in the order they are seen (WCAG 1.3.2). When the query empties, every moved node goes back to its original place.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Group>` / `<Command.Item>` / `<Command.Separator>`, plus an optional `<Command.Empty>`.
- `command-group/command-group.vue` — labeled section. Renders a `label` row (`text-label-sm` in `--text-muted`, sentence case) above its items; hides itself entirely when all of its items are filtered out. Carries `--spacing-sm` above itself when it follows another group, and deliberately **not** when it follows a `<Command.Separator>` — the separator owns the space around itself, so the two rules are mutually exclusive and never stack. While ranked (`data-ranked`) the group is ordered by its best item and its items by their own score, the heading staying first; every group but the leading one carries `--spacing-sm` above itself (`data-leading` marks the first).
  - Props: `label: string` default `''` — section label; omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Item>`.
- `command-item/command-item.vue` — a selectable command row. `role="option"`. Registers itself with the context (value + searchable text + score) so the root can filter, rank and track the active item. Activated by click, `Enter` while active, or a full-row pointer; activation calls the context, which emits the root `select` and closes the palette — or, when the item names a `page`, opens that page instead (no `select`, the palette stays open). Shows an optional keyboard-shortcut hint rendered with `Kbd`, or a trailing `chevron-right` (mirrored under `dir="rtl"`) when it opens a page. When the label is plain text and the query matches it, the matched characters render in `<mark>` with `font-semibold` on a transparent fill (weight, not color, so the emphasis survives the active row's `--bg-selected` and forced colors); a rich label (elements in the slot) still filters and ranks but is not highlighted.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when the item is activated; also part of the searchable text.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens; the item is skipped by roving navigation and never activates.
    - `keywords: string[]` default `[]` — extra search terms matched as substrings of the query (never shown), e.g. `['preferences', 'account']`.
    - `page: string` default `''` — the `name` of a `<Command.Page>` this item opens instead of selecting.
    - `shortcut: string` default `''` — a `'+'`-delimited shortcut hint (e.g. `'meta+d'`, `'meta+shift+p'`, `'esc'`) rendered on the right via `Kbd`. Modifier tokens (`meta`/`ctrl`/`shift`/`alt`) map to `Kbd` modifier props; the final token is the key. A named final token (`esc`/`escape`, `enter`/`return`, `space`, `tab`, `backspace`, `delete`/`del`) is printed from the locale catalog through `Kbd` `key-name` (`Esc`, `Enter`, `Espaço`…); any other key is upper-cased. Display only — it does not register a global keybinding.
  - Events: _none_ (root emits `select`).
  - Slots: `default` — the item label (rich content allowed); `leading` — leading icon/avatar; `trailing` — trailing content (mutually exclusive with `shortcut`).
  - **The icon box belongs to the item that has an icon.** An item renders the leading box only when it actually supplies a `leading`; an icon-less item puts no empty element in the DOM and pays no indent, so a list that mixes iconed and icon-less rows lets each label start at the row inset it earns rather than every label inheriting the widest row's indent. The box is a fixed `size-4` — the same glyph size a `SidebarMenu` row uses — so an oversized icon cannot widen the row and pull its own label out of line with the iconed rows around it.
- `command-empty/command-empty.vue` — the no-results state, shown only when the filter produces zero visible items. Fallback copy lives inside the slot.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the empty-state message (falls back to "No results found." when empty).
- `command-separator/command-separator.vue` — a thin divider between sections. `role="separator"`, `aria-hidden`. Hidden while the query is not empty (ranking reorders the sections it sits between) and on any page other than its own.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `command-page/command-page.vue` — a nested list the palette swaps in when an item with a matching `page` is activated (or when `v-model:pageKey` is set to its `name`). Renders its content only while it is the current page, inside a `display: contents` wrapper so its groups and items rank like top-level ones; every item, group and separator outside any page belongs to the first page and hides while a nested page is open. Pages are siblings inside the list; opening one pushes onto a single stack, and going back pops it. Registers its `heading` with the root so the input's back control can name it.
  - Props: `name: string` (required) — the identifier items open with `page="…"`. `title: string` default `''` — the page title shown in the back control; empty falls back to `name`.
  - Events: _none_.
  - Slots: `default` — the page's `<Command.Group>` / `<Command.Item>` / `<Command.Separator>`.

## v-model

| Model             | Type      | Default     | Emits            | Notes                                                                                                                                                                                                                                                                                                                         |
| ----------------- | --------- | ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open`    | `boolean` | `undefined` | `update:open`    | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, the `shortcut`, item activation, `Esc`, backdrop click). While unbound the palette is uncontrolled and starts at `defaultOpen`.               |
| `v-model:pageKey` | `string`  | `''`        | `update:pageKey` | The current page via `defineModel('pageKey')`; `''` is the first page. Item activation with `page`, the back control, `Backspace` in an empty field and `Esc` on a nested page update it. Set it before opening to open straight on a page; otherwise each opening starts on the first page. Changing pages clears the query. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (roving highlight), `disabled`, `empty`
- `data-state` values (root): `open` | `closed` (inherited from the wrapped `Dialog`)
- `data-active` on an item mirrors the roving active item (keyboard/hover highlight)
- `data-disabled` on an item mirrors its `disabled` prop
- `data-ranked` on the list and on each group while the query is not empty; `data-leading` on the group ranked first
- `data-page` on the input bar names the open nested page (absent on the first page)
- `empty`: when the filter yields no visible items, the `Empty` part renders in place of the list rows
- Position: from `md` up the panel is anchored near the top of the viewport (`md:items-start md:pt-[15dvh]` on the Dialog content, horizontally centred), not centred vertically, so its top edge and the search field stay put while the list grows and shrinks as you type. Below `md` the panel is the Dialog's sheet.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the input; items use the roving `data-active` highlight (the input keeps DOM focus).
- Keyboard map:
  - Global: the `shortcut` combo (⌘K / Ctrl+K) toggles the palette open from anywhere.
  - Inside the palette: `ArrowDown` / `ArrowUp` move the active item in the order the list shows (ranked order while searching; skipping disabled, wrap-around); `Home` / `End` jump to first/last enabled item; `Enter` activates the active item (opening its page when it names one); `Backspace` in an empty field returns to the previous page; `Esc` returns to the previous page on a nested page and closes (via `Dialog`) on the first; `Tab` is trapped within the panel (via `Dialog`) and reaches the back control.
- ARIA: the panel is `role="dialog"` (from `Dialog`) with an accessible name via a visually-hidden title; the input is `role="combobox"` with `aria-expanded` and `aria-controls` pointing at the list, and carries its own accessible name via `aria-label` (`ariaLabel`, falling back to `placeholder`) so the name survives the first keystroke; the list is `role="listbox"` (no role while nothing matches); each group is `role="group"` with `aria-labelledby` referencing its heading id; each item is `role="option"` with a stable `id` (`useId`), `aria-selected` mirroring the active state and `aria-disabled` mirroring `disabled`. With DOM focus on the input, the input's `aria-activedescendant` points at the active item's `id` (absent while no item is active), so a screen reader announces each row as `ArrowUp` / `ArrowDown` / `Home` / `End` move; and the active row is scrolled into view (`scrollIntoView({ block: 'nearest' })`) whenever it changes, so it never drops below the fold of the scrolling list (WCAG 4.1.2, 2.4.11). Tests: `command.test.ts` › active option is announced and kept in view.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled`).
- `motion-reduce:animate-none` on the inherited `animate-popup-scale-*`; `motion-reduce:transition-none` on item `transition-colors`.
- Ranked order is visual (CSS `order`) while the DOM keeps the consumer's order; the roving active item, `aria-selected` and `Enter` follow the visual order, so keyboard users get the ranked sequence. Highlighted characters are a `<mark>` inside the option, so the option's accessible name stays its full label.
- Focus management: opening moves focus to the input; changing pages keeps focus in the input; closing returns focus to the element focused before the palette opened. Focus trap and scroll-lock are inherited from `Dialog`.
- Touch target: item rows are full-width click targets, at least 32 px tall on a fine pointer and 44 px (`pointer-coarse:min-h-11`) on a coarse pointer.

## Right-to-left

- Layout: logical utilities only (`text-start`, `gap-*`, `px-*`), so the bar, the back control and each row mirror under `dir="rtl"`.
- Icons: the back `chevron-left` and the item page `chevron-right` mirror (`rtl:-scale-x-100`); the search glyph and `Kbd` keycaps do not.
- Keyboard: navigation is vertical only (`ArrowUp` / `ArrowDown`), so no arrow logic flips.

## Internationalization

| Key                   | English source      | Override prop         |
| --------------------- | ------------------- | --------------------- |
| `command.title`       | `Command menu`      | —                     |
| `command.placeholder` | `Search everything` | `placeholder` (Input) |
| `command.noMatch`     | `No results found.` | default slot (Empty)  |
| `command.back`        | `Back from {page}`  | —                     |

- Item labels, keywords, group and page headings are consumer copy.
- Matching is case-insensitive with `toLowerCase()`; it does not fold accents, so a consumer adds unaccented spellings as `keywords` when people type them.

## Responsive

- The panel width and max height come from `Dialog`; the list scrolls inside `max-h-[24rem]`. From `md` up the panel sits 15% of the viewport height from the top (`15dvh`, a viewport-relative offset no spacing token expresses), so typing never moves its top edge; below `md` it is the Dialog's sheet.
- The back control truncates a long page heading (`truncate`, `max-w-[40%]`) so the field keeps room to type.
- Touch: rows are full-width, 44 px tall on a coarse pointer; the back control is 32px tall. No hover-only affordance: the highlight follows the active row and taps activate.

## Examples

### Default

```vue
<script setup>
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <SearchTrigger @open="open = true" />

  <CommandRoot
    v-model:open="open"
    shortcut="meta+k"
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Suggestions">
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
        <CommandItem value="settings">Go to Settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup label="Commands">
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
  </CommandRoot>
</template>
```

### Groups

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open grouped palette"
    variant="primary"
    @click="open = true"
  />

  <CommandRoot
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Actions">
        <CommandItem value="deploy">
          <template #leading
            ><i
              class="az az-cloud-upload"
              aria-hidden="true"
          /></template>
          Deploy Project
        </CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup label="Navigation">
        <CommandItem value="settings">
          <template #leading
            ><i
              class="az az-settings"
              aria-hidden="true"
          /></template>
          Go to Settings
        </CommandItem>
        <CommandItem value="billing">Go to Billing</CommandItem>
      </CommandGroup>
      <CommandGroup label="Account">
        <CommandItem value="profile">
          <template #leading
            ><i
              class="az az-user"
              aria-hidden="true"
          /></template>
          View Profile
        </CommandItem>
        <CommandItem value="logout">Log Out</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandRoot>
</template>
```

### WithShortcuts

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    variant="primary"
    @click="open = true"
  />

  <CommandRoot
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Actions">
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
  </CommandRoot>
</template>
```
