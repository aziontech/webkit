# Dropdown Menu

> Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `DropdownMenu` owns open/closed state, positioning, focus return, and keyboard navigation; `DropdownMenu.Trigger` wires `aria-haspopup`/`aria-expanded`/`aria-controls` onto whatever element the consumer passes through its slot; `DropdownMenu.Group` groups options under an optional label; `DropdownMenu.Option` is the selectable row with left/right/command affordances. Replaces and removes the legacy monolithic input `dropdown` and the previous `dropdown-menu` composition — there is one `DropdownMenu` in the project, in `navigation/`.

- Import: `import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'`
- Compound import (dot notation, not tree-shakeable): `import DropdownMenu from '@aziontech/webkit/dropdown-menu'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [dropdown-menu.json](https://github.com/aziontech/webkit/blob/main/.specs/dropdown-menu.json)

## When to use

- A menu of actions opened from a button: row actions, an account menu, an overflow ("more") menu.
- Options grouped under section labels, optionally with keyboard-shortcut hints.

## Do

- Give every `DropdownMenu.Option` a unique `value` and handle the root `select` event as `(event, value)`. The panel closes and focus returns to the trigger on its own.
- selected` is a display flag. The dropdown never sets it, so derive it from your own state.
- Use the `command` prop or the `right` slot on an option, not both. A `command` shortcut is live only while the panel is open.
- Add a `label` to each `DropdownMenu.Group` when there is more than one group. Put search in the root `top` slot and footer actions in `bottom`; those regions stay outside the scrolling list.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Don’t

- Choosing a value that a form submits → use `select` (inside a `field` for a label).
- A primary action joined to a menu of alternatives → use `split-button`.
- A searchable palette of commands → use `command`.
- Free-form or interactive content such as forms or filters → use `popover`.
- Vertical application navigation → use `menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [split-button](split-button.md) — composes `DropdownMenu` for its chevron menu.
- [select](select.md) — form control with a field trigger and a bound value.
- [popover](popover.md) — same trigger and anchoring model, with free-form content instead of option rows.
- [command](command.md) — modal ⌘K palette with search and filtering.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placement` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | false | Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on viewport space. |
| `offset` | `number` | `4` | false | Pixel gap between the trigger and the panel. |
| `disabled` | `boolean` | `false` | false | Prevents the trigger from opening the panel and applies disabled tokens. |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: DropdownMenuOptionValue)` | Fires when an enabled option is activated (click, `Enter`/`Space`, or a `command` shortcut). `event` is the activation event; `value` is the activated option's identifier. The panel closes automatically and focus returns to the trigger when activated from inside the open panel. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Place `<DropdownMenu.Trigger>` followed by one or more `<DropdownMenu.Group>`. |
| `top` | — | Sticky region rendered above the scrollable group list (e.g. search input). |
| `bottom` | — | Sticky region rendered below the scrollable group list (e.g. footer action). |

## Sub-component imports

- `@aziontech/webkit/dropdown-menu-trigger`
- `@aziontech/webkit/dropdown-menu-group`
- `@aziontech/webkit/dropdown-menu-option`

## Sub-components

- `dropdown-menu-trigger/dropdown-menu-trigger.vue` — as-child trigger. Reads `inject` for `isOpen`, `triggerId`, `panelId`, `setOpen`. Renders a non-interactive inline wrapper (no `role`, no `tabindex`) that carries `data-testid`, `data-state` and `data-disabled` and listens for the bubbling `click` / `keydown`. It gives `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled` (when the root is disabled) and the trigger `id` (unless the control already has one) to the slotted control, which also becomes the positioning anchor and the focus-return target. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. So an `IconButton`, a `Button`, or either wrapped in a `Tooltip` is the one tab stop and the one ARIA owner — no nested interactive control. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"` (`-1` when disabled); for these and for native elements this is in the server HTML too.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The trigger forwards aria + click; the consumer must not bind those props itself.
- `dropdown-menu-group/dropdown-menu-group.vue` — labeled section. Renders a `label` row (`text-label-sm` in `--text-muted`, sentence case) above its default slot and a top divider when it is not the first group inside the panel. The divider runs edge-to-edge across the panel's inner width — the panel carries only vertical padding, and the horizontal inset the option rows need lives on the group's own content wrapper — so the hairline reads like the panel's own border rather than a floated rule. It carries `--spacing-sm` above and `--spacing-xs` below.
  - Props: `label: string` default `''` — section label rendered above the options. Omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<DropdownMenu.Option>`; `top` — inline region rendered between the group label and the options (e.g. a per-section search or description); `bottom` — inline region rendered after the options (e.g. a "see all" link).
- `dropdown-menu-option/dropdown-menu-option.vue` — selectable row. Renders the left slot, the label, the right slot, and an optional `command` hint. Calls injected `selectOption(value, event)` on click / `Enter` / `Space`.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when this option is activated.
    - `label: string` default `''` — plain-text label; falls back to the default slot when omitted.
    - `command: string` default `''` — keyboard-shortcut hint rendered on the right side (e.g. `'⌘P'`, `'⇧⌘P'`, `'Ctrl+,'`). While the panel is open the root listens for `window` `keydown`, matches the shortcut against every mounted option, and emits `select` for the matching option (preventing the browser default). Shortcuts are active only while the panel is open, since options are only mounted then. Mutually exclusive with the `right` slot.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens.
    - `selected: boolean` default `false` — marks the option as currently selected (background + checkmark).
  - Events: _none_ (root emits `select`).
  - Slots: `default` (override of the `label` prop, for rich label content), `left` (left icon / avatar), `right` (right icon / badge; mutually exclusive with `command`).

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                               |
| -------------- | --------- | ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, option activation, `Esc`, outside click). While unbound the menu is uncontrolled and starts closed. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-state` values (root + trigger): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root, trigger, and option
- `data-selected` on option mirrors the `selected` prop
- `data-placement` on the root mirrors the `placement` prop (`'auto'` stays as `'auto'`)
- `data-placement` on the panel mirrors the resolved placement (`'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`)

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and option.
- Keyboard map:
  - On the trigger: `Enter` / `Space` opens the panel and focuses the first enabled option; `Down` opens and focuses the first option; `Up` opens and focuses the last option.
  - Inside the panel: `Down` / `Up` move between enabled options (wrap-around); `Home` / `End` jump to first/last enabled option; `Enter` / `Space` activate the focused option; `Esc` closes the panel and returns focus to the trigger; `Tab` closes the panel and lets focus proceed to the next focusable element after the trigger; `Shift+Tab` closes it and returns focus to the trigger. Typing in a search field inside the top slot keeps `Home` / `End` for the caret. Tests: `dropdown-menu.test.ts` › keyboard map (spec).
- ARIA: the slotted control (or the wrapper, when the slot has none) exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, with a single tab stop; the panel's `aria-labelledby` follows the control's `id`; the `role="menu"` element wraps only the groups and options, and the optional top and bottom slots (search fields, footers with buttons) sit beside it inside the floating panel, because a `menu` may own only menu items, groups and separators (`aria-required-children`); each group uses `role="group"` + `aria-labelledby` pointing at its label id (when `label` is set); each option uses `role="menuitem"`, `aria-disabled` mirrors `disabled`; selected option uses `aria-current="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled` token).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/selected states.
- Teleported panel: the `role="menu"` panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it lays out and is announced in the provider's direction and language although it renders under `body`.
- Touch target ≥40×40 px on the trigger; option rows are 32 px tall and are activated by full-row click + keyboard, satisfying the 24×24 px target floor for in-menu items per WCAG 2.5.8.

## Examples

### Default

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption
        value="profile"
        label="Profile"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />
      <DropdownMenuOption
        value="billing"
        label="Billing"
      />
      <DropdownMenuOption
        value="invite"
        label="Invite members"
      />
      <DropdownMenuOption
        value="logs"
        label="Audit log"
      />
      <DropdownMenuOption
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
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Account">
      <DropdownMenuOption
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />
    </DropdownMenuGroup>
    <DropdownMenuGroup label="Workspace">
      <DropdownMenuOption
        value="invite"
        label="Invite members"
      />
      <DropdownMenuOption
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
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot :open="true">
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Option states">
      <DropdownMenuOption
        value="default"
        label="Default"
      />
      <DropdownMenuOption
        value="selected"
        label="Selected"
        selected
      />
      <DropdownMenuOption
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>
```
