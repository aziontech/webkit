# Context Menu

> Menu of actions that opens at the pointer when the user right-clicks an area, presses `Shift+F10` or the context-menu key inside it, or long-presses it on touch. It is the right-click twin of `DropdownMenu`: the root `ContextMenu` owns open state, the pointer anchor, positioning and focus return through the same internal menu core, `ContextMenu.Trigger` marks the area that listens, and the item parts are DropdownMenu's own (`Group`, `Item` with its checkbox and radio kinds, `Sub`, `SubTrigger`, `SubContent`), attached to the compound so the two menus look and behave the same.

- Import: `import ContextMenuRoot from '@aziontech/webkit/context-menu-root'`
- Compound import (dot notation, not tree-shakeable): `import ContextMenu from '@aziontech/webkit/context-menu'`
- Category: navigation · Surface: app · Structure: composition
- API as JSON: [context-menu.json](https://github.com/aziontech/webkit/blob/main/.specs/context-menu.json)

## When to use

- Use ContextMenu for the same actions as a DropdownMenu, opened by right-click or long-press on an item; opened from a button use DropdownMenu.
- Secondary actions on an object the user is pointing at: a table row, a file in a browser, a tree node, a canvas.
- Power-user shortcuts that also exist elsewhere in the interface.

## Do

- Wrap the object, not the page: one `ContextMenu.Trigger` around the table body, the file grid or the tree, and read which row was targeted from your own state (for example the row the `contextmenu` came from, captured with a native `@contextmenu` on the row).
- Mirror the visible row-actions menu; a context menu adds speed, never exclusive actions.
- Keep it short (under about ten items), group with `ContextMenu.Group`, and put destructive actions in their own last group.
- Give the panel a name with `aria-label` when the target is not obvious from focus (for example `aria-label="Actions for production"`).
- disabled` gives the area back to the browser's native menu.

## Don’t

- The only way to reach an action. Right-click is invisible; every action in a context menu must also be reachable from a visible control (a row-actions `DropdownMenu`, a toolbar button).
- A menu opened from a button → use `dropdown-menu`.
- A searchable palette of commands → use `command`.
- Free-form content such as forms → use `popover`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dropdown-menu](dropdown-menu.md) — same panel, items and keyboard model, opened from a trigger button; `ContextMenu` reuses its item parts.
- [popover](popover.md) — free-form floating content on the same `usePlacement` positioning.
- [table](table.md) — row actions usually pair a visible `DropdownMenu` with a `ContextMenu` around the rows.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | false | Leaves the area to the browser's native context menu and never opens the panel. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the menu panel; when empty the panel has no name of its own. |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: DropdownMenuOptionValue)` | Fires when an enabled option is activated, at any sub-menu depth. The panel closes and focus returns to the element that was focused in the area, except for checkbox and radio options. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Place `<ContextMenu.Trigger>` (the area) followed by one or more `<ContextMenu.Group>`. |

## Sub-component imports

- `@aziontech/webkit/context-menu-trigger`

## Sub-components

- `context-menu-trigger/context-menu-trigger.vue` — the area that opens the menu. Renders a block `div` that carries `data-testid` (`navigation-context-menu__trigger`), `data-state` and `data-disabled` and receives the consumer's attributes. It is not focusable itself and has no role; the focusable content inside it (rows, buttons, links) keeps its own semantics. It listens for `contextmenu` (opens at the pointer and prevents the native menu), `keydown` `Shift+F10` and the `ContextMenu` key from any focused descendant (opens at the inline-start bottom corner of the focused element), and a 500 ms touch long-press that does not move more than 10 px (opens at the touch point). When the root is disabled it does nothing and the native menu appears.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the area's content.
- Item parts, shared with `DropdownMenu` and attached to the compound under the same names: `ContextMenu.Group` (`dropdown-menu-group`), `ContextMenu.Item` (`dropdown-menu-option`, including `kind="checkbox"` / `kind="radio"` and `command`), `ContextMenu.Sub`, `ContextMenu.SubTrigger` and `ContextMenu.SubContent` (`dropdown-menu-sub*`). Their props, slots and behaviour are specified in `.specs/dropdown-menu.md`; inside a `ContextMenu` they emit through this root's `select`.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                              |
| -------------- | --------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`. While unbound the menu is uncontrolled and starts closed. Opened from the model without a pointer position, the panel anchors at the trigger area's inline-start top corner. |

## States

- Visual states of the items: as `dropdown-menu` (`default`, `hover`, `focus-visible`, `selected`, `disabled`, checked).
- `data-state` values (root, trigger, panel): `open` | `closed`.
- `data-disabled` on root and trigger mirrors `disabled`.
- `data-placement` on the panel mirrors the resolved corner (`bottom-start` | `bottom-end` | `top-start` | `top-end`).
- `loading`, `empty`, `error`, `readonly`, `invalid`: not states of this component; it renders the items the consumer passes.

## Accessibility

- Visible focus: the items carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)` (shared parts).
- Keyboard map:
  - Inside the trigger area: `Shift+F10` or the `ContextMenu` key opens the panel at the focused element and focuses the first enabled item.
  - Inside the panel: `Down` / `Up` move between enabled items (wrap-around); `Home` / `End` jump to the first / last; `Enter` / `Space` activate; `ArrowRight` (`ArrowLeft` under rtl) opens a sub-menu; `Esc` closes and returns focus to the element that was focused in the area; `Tab` closes. Tests: `context-menu.test.ts` › keyboard.
- ARIA: the panel is `role="menu"` named by `aria-label` when set; items are `menuitem` / `menuitemcheckbox` / `menuitemradio` (shared parts). The trigger area keeps no role: it is a region of content, and the context menu is a shortcut layer over controls that are reachable on their own.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled items (`--text-disabled`).
- `motion-reduce:animate-none` on `animate-popup-scale-*`.
- Teleported panel: binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`).
- Touch target: items are 32 px rows, above the 24 px floor of WCAG 2.5.8.

## Right-to-left

- Layout: logical utilities only (`text-start`, `ps-`/`pe-`); the panel binds `dir` from `WebkitProvider`.
- Icons: the sub-trigger chevron mirrors (shared part); no other icon.
- Keyboard: a keyboard-opened panel anchors at the inline-start bottom corner of the focused element (its right edge under rtl) and prefers opening toward the inline end; `ArrowLeft` opens a sub-menu under rtl. Pointer opens anchor at the pointer in both directions.
- User data: none (labels are consumer text).

## Internationalization

No built-in strings: item labels and the panel's `aria-label` come from the consumer.

- Formatting: none.

## Responsive

- Container queries: none; the panel is sized between `--container-3xs` and `--container-2xs`.
- Narrow (≤ 640 px or a narrow container): `usePlacement` picks the corner with room and keeps the panel inside the viewport; labels truncate.
- Touch: a 500 ms long-press opens the menu at the touch point, so the right-click has a touch path; rows are 32 px.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu'
  import { ref } from 'vue'

  const resources = ['production', 'staging', 'docs-site']
  const target = ref('')
  const last = ref('')

  const onSelect = (event, value) => {
    last.value = `${value} · ${target.value}`
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-sm)">
    <ContextMenu
      :aria-label="target ? `Actions for ${target}` : 'Resource actions'"
      @select="onSelect"
    >
      <ContextMenu.Trigger>
        <ul
          class="flex flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
        >
          <li
            v-for="name in resources"
            :key="name"
            tabindex="0"
            class="flex h-10 items-center border-b border-(--border-default) px-(--spacing-md) text-body-sm text-(--text-default) outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-(--ring-color)"
            @contextmenu="target = name"
            @focus="target = name"
          >
            {{ name }}
          </li>
        </ul>
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
        <ContextMenu.Item
          value="duplicate"
          label="Duplicate"
        />
      </ContextMenu.Group>
      <ContextMenu.Group>
        <ContextMenu.Item
          value="delete"
          label="Delete"
        />
      </ContextMenu.Group>
    </ContextMenu>

    <p class="text-body-sm text-(--text-muted)">
      Right-click a row, press Shift+F10 on a focused row, or long-press it on touch.
      <span v-if="last">Last action: {{ last }}</span>
    </p>
  </div>
</template>
```

### WithSubMenu

```vue
<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu'
  import { reactive } from 'vue'

  const view = reactive({ hidden: false, grid: true })

  const onSelect = (event, value) => {
    if (value in view) view[value] = !view[value]
  }
</script>

<template>
  <ContextMenu
    :open="true"
    aria-label="File actions"
    @select="onSelect"
  >
    <ContextMenu.Trigger>
      <div
        class="flex h-40 w-full max-w-(--container-sm) items-center justify-center rounded-(--shape-card) border border-dashed border-(--border-default) text-body-sm text-(--text-muted)"
      >
        site-assets
      </div>
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
      <ContextMenu.Sub default-open>
        <ContextMenu.SubTrigger label="Move to" />
        <ContextMenu.SubContent>
          <ContextMenu.Group>
            <ContextMenu.Item
              value="production"
              label="production"
            />
            <ContextMenu.Item
              value="staging"
              label="staging"
            />
          </ContextMenu.Group>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </ContextMenu.Group>

    <ContextMenu.Group label="View">
      <ContextMenu.Item
        value="hidden"
        label="Show hidden files"
        kind="checkbox"
        :selected="view.hidden"
      />
      <ContextMenu.Item
        value="grid"
        label="Grid layout"
        kind="checkbox"
        :selected="view.grid"
      />
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

### Disabled

```vue
<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu'
</script>

<template>
  <ContextMenu
    disabled
    aria-label="File actions"
  >
    <ContextMenu.Trigger>
      <div
        class="flex h-40 w-full max-w-(--container-sm) items-center justify-center rounded-(--shape-card) border border-dashed border-(--border-default) text-body-sm text-(--text-muted)"
      >
        Right-click shows the browser menu
      </div>
    </ContextMenu.Trigger>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="open"
        label="Open"
      />
    </ContextMenu.Group>
  </ContextMenu>
</template>
```
