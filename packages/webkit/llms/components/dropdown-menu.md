# Dropdown Menu

> Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `DropdownMenu` owns open/closed state, positioning, focus return, and keyboard navigation; `DropdownMenu.Trigger` wires `aria-haspopup`/`aria-expanded`/`aria-controls` onto whatever element the consumer passes through its slot; `DropdownMenu.Group` groups options under an optional label; `DropdownMenu.Item` (the shadcn / Radix name) is the selectable row with leading/trailing/command affordances, and with `type="checkbox"` or `type="radio"` it becomes a checkable item (`menuitemcheckbox` / `menuitemradio`). `DropdownMenu.Sub`, `DropdownMenu.SubTrigger` and `DropdownMenu.SubContent` nest a sub-menu that opens on hover or with `ArrowRight` and nests to any depth. Replaces and removes the legacy monolithic input `dropdown` and the previous `dropdown-menu` composition — there is one `DropdownMenu` in the project, in `navigation/`.

- Import: `import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'`
- Compound import (dot notation, not tree-shakeable): `import DropdownMenu from '@aziontech/webkit/dropdown-menu'`
- Category: navigation · Surface: app · Structure: composition
- API as JSON: [dropdown-menu.json](dropdown-menu.json)

## When to use

- Use DropdownMenu for a list of actions opened from a button (row actions, kebab, More); for the same actions on right-click or long-press use ContextMenu, and for a searchable palette use Command.
- A menu of actions opened from a button: row actions, an account menu, an overflow ("more") menu.
- Options grouped under section labels, optionally with keyboard-shortcut hints.

## Do

- Give every `DropdownMenu.Item` a unique `value` and handle the root `select` event as `(event, value)`. The panel closes and focus returns to the trigger on its own.
- `selected` is a display flag. The dropdown never sets it, so derive it from your own state.
- Use the `command` prop or the `trailing` slot on an option, not both. A `command` shortcut is live while its option is mounted (inside a group, only while the panel is open). Every menu on the page shares one `window` listener, so a shortcut fires one option only: the one in the open menu, else the one whose trigger has focus, else the first registered.
- Write `DropdownMenu.Item` (also exported as `DropdownMenuItem`); 6.0 removed the `DropdownMenu.Option` alias and the `left` / `right` slots. Items may sit directly in the root: an item outside a group renders inside the panel like a grouped one.
- Add a `label` to each `DropdownMenu.Group` when there is more than one group. Put search in the root `header` slot and footer actions in `footer`; those regions stay outside the scrolling list.
- Nest at most two levels of sub-menus; deeper menus are hard to steer with a pointer. Put the `DropdownMenu.Sub` inside a `DropdownMenu.Group`, and the sub-menu's options inside a `DropdownMenu.Group` in `DropdownMenu.SubContent`, the same way as the top level.
- Use `type="checkbox"` for independent on/off settings and `type="radio"` for one choice among the options of one `DropdownMenu.Group`. Drive `selected` from your own state in the `select` handler; checkable options keep the panel open so several can be toggled in a row.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Don’t

- Choosing a value that a form submits → use `select` (inside a `field` for a label).
- A primary action joined to a menu of alternatives → use `split-button`.
- A searchable palette of commands → use `command`.
- Free-form or interactive content such as forms or filters → use `popover`.
- Vertical application navigation → use `sidebar-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [split-button](split-button.md) — composes `DropdownMenu` for its chevron menu.
- [select](select.md) — form control with a field trigger and a bound value.
- [popover](popover.md) — same trigger and anchoring model, with free-form content instead of option rows.
- [command](command.md) — modal ⌘K palette with search and filtering.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | ``DropdownMenuSide \| 'auto'` (`'top' \| 'bottom' \| 'start' \| 'end'`)` | `'bottom'` | false | Side of the trigger the panel opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. |
| `align` | ``DropdownMenuAlign` (`'start' \| 'center' \| 'end'`)` | `'start'` | false | Alignment along the trigger edge. |
| `sideOffset` | `number` | `4` | false | Pixel gap between the trigger and the panel. |
| `disabled` | `boolean` | `false` | false | Prevents the trigger from opening the panel and applies disabled tokens. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled (`v-model:open` unbound). |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: DropdownMenuItemValue)` | Fires when an enabled option is activated (click, `Enter`/`Space`, or a `command` shortcut). `event` is the activation event; `value` is the activated option's identifier. The panel closes automatically and focus returns to the trigger when activated from inside the open panel, except for `type="checkbox"` / `type="radio"` options, which keep it open. Options inside a sub-menu emit on the same root event. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Place `<DropdownMenu.Trigger>` followed by one or more `<DropdownMenu.Group>`. |
| `header` | — | Sticky region rendered above the scrollable group list (e.g. search input). |
| `footer` | — | Sticky region rendered below the scrollable group list (e.g. footer action). |

## Sub-component imports

- `@aziontech/webkit/dropdown-menu-trigger`
- `@aziontech/webkit/dropdown-menu-group`
- `@aziontech/webkit/dropdown-menu-item`
- `@aziontech/webkit/dropdown-menu-sub`
- `@aziontech/webkit/dropdown-menu-sub-content`
- `@aziontech/webkit/dropdown-menu-sub-trigger`

## Sub-components

- `dropdown-menu-trigger/dropdown-menu-trigger.vue` — as-child trigger. Reads `inject` for `isOpen`, `triggerId`, `panelId`, `setOpen`. Renders a non-interactive inline wrapper (no `role`, no `tabindex`) that carries `data-testid`, `data-state` and `data-disabled` and listens for the bubbling `click` / `keydown`. It gives `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled` (when the root is disabled) and the trigger `id` (unless the control already has one) to the slotted control, which also becomes the positioning anchor and the focus-return target. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. So an `IconButton`, a `Button`, or either wrapped in a `Tooltip` is the one tab stop and the one ARIA owner — no nested interactive control. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"` (`-1` when disabled); for these and for native elements this is in the server HTML too.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The trigger forwards aria + click; the consumer must not bind those props itself.
- `dropdown-menu-group/dropdown-menu-group.vue` — labeled section. Renders a `label` row (`text-label-sm` in `--text-muted`, sentence case) above its default slot and a top divider when it is not the first group inside the panel. The divider runs edge-to-edge across the panel's inner width — the panel carries only vertical padding, and the horizontal inset the option rows need lives on the group's own content wrapper — so the hairline reads like the panel's own border rather than a floated rule. It carries `--spacing-sm` above and `--spacing-xs` below.
  - Props: `label: string` default `''` — section label rendered above the options. Omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<DropdownMenu.Item>`; `header` — inline region rendered between the group label and the options (e.g. a per-section search or description); `footer` — inline region rendered after the options (e.g. a "see all" link).
- `dropdown-menu-item/dropdown-menu-item.vue` — selectable row, attached as `DropdownMenu.Item`. Renders the leading slot, the label, the trailing slot, an optional `command` hint and, when `selected`, a check mark. Calls injected `selectOption(value, event)` on click / `Enter` / `Space`. Every row is `tabindex="-1"`; the root moves focus with the arrows and typeahead. Outside a group the row teleports itself into the panel body (`data-ungrouped`, with the group's horizontal inset).
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when this option is activated.
    - `label: string` default `''` — plain-text label; falls back to the default slot when omitted.
    - `command: string` default `''` — keyboard-shortcut hint rendered on the trailing side (e.g. `'⌘P'`, `'⇧⌘P'`, `'Ctrl+,'`). A module-level registry holds one `window` `keydown` listener for every menu on the page (attached while at least one shortcut is registered); it matches the shortcut against the registered options of enabled menus and emits `select` for one match only (preventing the browser default): an option of the open menu wins, then an option of the menu whose trigger holds focus, then the first registered, so a row menu repeated on every table row fires for the row the person is on. Mutually exclusive with the `trailing` slot.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens.
    - `selected: boolean` default `false` — marks the option as checked: `role="menuitemradio"` with `aria-checked="true"`, the selected background and a trailing `az az-check`.
    - `href: string` default `''` — destination URL; the row renders as an anchor (still `role="menuitem"`) that emits `select` and then follows the link, so it can be opened in a new tab. `Enter` follows it natively; `Space` clicks it.
    - `type: 'default' | 'checkbox' | 'radio'` default `'default'` — item role. `default` renders `role="menuitem"` (`menuitemradio` with `aria-checked="true"` and a trailing check when `selected`) and closes the panel on activation; `checkbox` renders `role="menuitemcheckbox"` and `radio` renders `role="menuitemradio"`, both with a leading check / dot indicator column instead of the trailing check, `aria-checked` mirroring `selected`, and the panel kept open on activation (`select` still fires). Exported as `DropdownMenuItemType`.
    - `severity: 'neutral' | 'danger'` default `'neutral'` — colour meaning of the row. `danger` marks a destructive action (Delete, Remove): the label and leading glyph take `--text-danger` (`data-severity="danger"`) on the same hover fill, so the row reads as destructive before it is activated. Exported as `DropdownMenuItemSeverity` (derived from `Severity`).
  - Events: _none_ (root emits `select`).
  - Slots: `default` (override of the `label` prop, for rich label content), `leading` (icon / avatar before the label), `trailing` (icon / badge after the label; mutually exclusive with `command`).
- `dropdown-menu-sub/dropdown-menu-sub.vue` — sub-menu scope. Owns the open state of one nested menu and shares it with its `SubTrigger` and `SubContent`. Renders a `display: contents` wrapper carrying `data-testid` (`<root>__sub`) and `data-state`. Only one sub-menu per menu level is open at a time: hovering or focusing a sibling item closes it after a 150 ms grace period, so a pointer moving diagonally toward the sub-panel does not close it; entering the sub-panel cancels the close. Closing the root closes every sub-menu.
  - Props: `defaultOpen: boolean` default `false` — opens the sub-menu when the parent panel opens (for documentation and screenshots); the user can still close it.
  - Events: _none_ (activation inside bubbles to the root `select`).
  - Slots: `default` — one `<DropdownMenu.SubTrigger>` followed by one `<DropdownMenu.SubContent>`.
- `dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue` — the row that opens the sub-menu. Same 32 px row as an option, with a trailing chevron (`az az-chevron-right`, mirrored under rtl). `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` pointing at the sub-panel; keeps the hover background while its sub-menu is open (`data-state="open"`). Opens on pointer enter, click, `Enter`, `Space` and `ArrowRight` (`ArrowLeft` under rtl); the keyboard paths move focus to the first sub-menu item.
  - Props: `label: string` default `''` — plain-text label; falls back to the default slot. `disabled: boolean` default `false` — the row cannot open its sub-menu and applies disabled tokens.
  - Events: _none_.
  - Slots: `default` (rich label), `leading` (icon before the label).
- `dropdown-menu-sub-content/dropdown-menu-sub-content.vue` — the nested panel. Teleported to `body` and positioned by the shared `usePlacement` against the sub-trigger at `side="end"` + `align="start"` (the right side in ltr, the left side under rtl), flipping to the other side when it does not fit; the same surface, border, shadow and motion as the top-level panel, `role="menu"` labelled by the sub-trigger. It is its own menu level: `Down` / `Up` / `Home` / `End` move inside it, `ArrowLeft` (`ArrowRight` under rtl) and `Esc` close it and return focus to the sub-trigger, `Tab` closes the whole menu. Clicks inside it never dismiss the menu. When neither side of the parent has room for it (a phone), it is not teleported: it opens inline under its sub-trigger, indented, without border or shadow (`data-inline`), its list a `role="group"` labelled by the sub-trigger inside the parent menu, so it never covers the row that opened it; the keyboard is unchanged.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<DropdownMenu.Group>` (groups render into this panel exactly as they do at the top level), which may hold further `<DropdownMenu.Sub>`.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                                         |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, option activation, `Esc`, outside click). While unbound the menu is uncontrolled and starts at `defaultOpen`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-state` values (root + trigger): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root, trigger, and option
- `data-selected` on option mirrors the `selected` prop
- `data-type` on option mirrors the `type` prop (`default` | `checkbox` | `radio`)
- `data-severity` on option mirrors the `severity` prop (`neutral` | `danger`)
- `data-state` on sub, sub-trigger and sub-panel: `open` | `closed`; `data-disabled` on sub-trigger mirrors its `disabled` prop
- `data-side` / `data-align` on the sub-panel mirror its resolved side and alignment (`end` or `start`, after flipping)
- `data-side` / `data-align` on the root mirror the `side` / `align` props (`'auto'` stays as `'auto'`)
- `data-side` / `data-align` on the panel mirror the resolved side and alignment after flipping
- `start` and `end` follow the text direction: under `dir="rtl"`, `align="start"` lines the panel up with the trigger's right edge and `side="end"` opens on the left

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and option.
- Keyboard map:
  - On the trigger: `Enter` / `Space` opens the panel and focuses the first enabled option; `Down` opens and focuses the first option; `Up` opens and focuses the last option.
  - On a sub-trigger: `ArrowRight` (`ArrowLeft` under rtl), `Enter` or `Space` opens the sub-menu and focuses its first enabled item.
  - Inside a sub-menu: `Down` / `Up` / `Home` / `End` move within it; `ArrowLeft` (`ArrowRight` under rtl) or `Esc` closes it and returns focus to its sub-trigger; `Enter` / `Space` activate; `Tab` closes the whole menu. Tests: `dropdown-menu.test.ts` › sub-menus.
  - Inside the panel: `Down` / `Up` move between enabled options (wrap-around); `Home` / `End` jump to first/last enabled option; a printable character moves to the next enabled option whose label starts with it (typeahead: characters typed within 500 ms accumulate, a repeated character cycles); `Enter` / `Space` activate the focused option; `Esc` closes the panel and returns focus to the trigger; `Tab` closes the panel and lets focus proceed to the next focusable element after the trigger; `Shift+Tab` closes it and returns focus to the trigger. Typing in a search field inside the header slot keeps `Home` / `End` for the caret. Tests: `dropdown-menu.test.ts` › keyboard map (spec).
  - Nested overlays: the open panel joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` activating an option or pressing `Esc` closes only the menu; a pointer-down inside a higher layer (a `Select` list opened from the header slot) does not close the menu.
- ARIA: the slotted control (or the wrapper, when the slot has none) exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, with a single tab stop; the panel's `aria-labelledby` follows the control's `id`; the `role="menu"` element wraps only the groups and options, and the optional header and footer slots (search fields, footers with buttons) sit beside it inside the floating panel, because a `menu` may own only menu items, groups and separators (`aria-required-children`); each group uses `role="group"` + `aria-labelledby` pointing at its label id (when `label` is set); each option uses `role="menuitem"`, `aria-disabled` mirrors `disabled`; a selected option is `role="menuitemradio"` with `aria-checked="true"` and a visible check mark; `type="checkbox"` / `type="radio"` options are `menuitemcheckbox` / `menuitemradio` with `aria-checked` mirroring `selected`; a sub-trigger is a `menuitem` with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`, and its sub-panel is a `role="menu"` labelled by it. The check and chevron glyphs are `aria-hidden`. Options are `tabindex="-1"` (roving focus through the arrows), so `Tab` leaves the menu. While closed, a menu attaches no `document` listener; the outside-`mousedown` listener lives only while the panel is open.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled` token).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/selected states.
- Teleported panel: the `role="menu"` panel binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it lays out and is announced in the provider's direction and language although it renders under `body`.
- Touch target ≥40×40 px on the trigger; option and sub-menu rows are 32 px tall on a fine pointer and 44 px (`pointer-coarse:min-h-11`) on a coarse pointer, full-row click targets whose fills stay inset 1 px so two filled rows never touch.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): renders a plain item.

## Right-to-left

- Layout: logical utilities only (`text-start`, `ps-`/`pe-`, `gap`); the panel and every sub-panel bind `dir` / `lang` from `ConfigProvider`, so they lay out in the provider's direction under `body`.
- Icons: the sub-trigger chevron mirrors (`rtl:-scale-x-100`); the check and radio dot do not.
- Keyboard: under rtl `ArrowLeft` opens a sub-menu and `ArrowRight` closes it; the sub-panel opens on the inline end (the left) and flips to the right when it does not fit. `Up` / `Down` are unchanged.
- User data: none (labels are consumer text).

## Internationalization

No built-in strings: every label comes from the consumer (`label` props and slots).

- Formatting: none.

## Responsive

- Container queries: none; panels are sized between `--container-3xs` and `--container-2xs`, and a sub-panel never wider than the viewport less `--spacing-xs` on each side (its minimum fits a 320px screen).
- Narrow (≤ 640 px or a narrow container): `usePlacement` keeps every panel inside the viewport. A sub-panel tries the trailing side, then the leading side; when neither has room (a phone) it opens below its row (above when below has no room), starting at the row's leading edge and shifted back inside the screen, so it never leaves the viewport and the rows above its trigger stay visible; labels truncate.
- Touch: rows are 44 px on a coarse pointer (32 px on a fine one); a sub-menu opens on tap (click) as well as hover, so nothing is hover-only.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="az az-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuItem
        value="profile"
        label="Profile"
      />
      <DropdownMenuItem
        value="settings"
        label="Settings"
      />
      <DropdownMenuItem
        value="billing"
        label="Billing"
      />
      <DropdownMenuItem
        value="invite"
        label="Invite members"
      />
      <DropdownMenuItem
        value="logs"
        label="Audit log"
      />
      <DropdownMenuItem
        value="signout"
        label="Sign out"
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>
```

### Groups

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="az az-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Account">
      <DropdownMenuItem
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuItem
        value="settings"
        label="Settings"
      />
    </DropdownMenuGroup>
    <DropdownMenuGroup label="Workspace">
      <DropdownMenuItem
        value="invite"
        label="Invite members"
      />
      <DropdownMenuItem
        value="logs"
        label="Audit log"
        selected
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>
```

### States

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="az az-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Option states">
      <DropdownMenuItem
        value="default"
        label="Default"
      />
      <DropdownMenuItem
        value="selected"
        label="Selected"
        selected
      />
      <DropdownMenuItem
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>
```
