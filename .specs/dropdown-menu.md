---
name: dropdown-menu
category: navigation
structure: composition
status: implemented
spec_version: 8
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746&m=dev
  node_id: 3775:16746
checksum: 16b592c257a1d772c7411376db383b304b746699cda66276ddd172b93f55739c
created: 2026-06-26
last_updated: 2026-11-15
---

# DropdownMenu — Component Spec

## Purpose

Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `DropdownMenu` owns open/closed state, positioning, focus return, and keyboard navigation; `DropdownMenu.Trigger` wires `aria-haspopup`/`aria-expanded`/`aria-controls` onto whatever element the consumer passes through its slot; `DropdownMenu.Group` groups options under an optional label; `DropdownMenu.Item` (the shadcn / Radix name) is the selectable row with leading/trailing/command affordances, and with `kind="checkbox"` or `kind="radio"` it becomes a checkable item (`menuitemcheckbox` / `menuitemradio`). `DropdownMenu.Sub`, `DropdownMenu.SubTrigger` and `DropdownMenu.SubContent` nest a sub-menu that opens on hover or with `ArrowRight` and nests to any depth. Replaces and removes the legacy monolithic input `dropdown` and the previous `dropdown-menu` composition — there is one `DropdownMenu` in the project, in `navigation/`.

## When to use

- Use DropdownMenu for a list of actions opened from a button (row actions, kebab, More); for the same actions on right-click or long-press use ContextMenu, and for a searchable palette use Command.
- A menu of actions opened from a button: row actions, an account menu, an overflow ("more") menu.
- Options grouped under section labels, optionally with keyboard-shortcut hints.

## When NOT to use

- Choosing a value that a form submits → use `select` (inside a `field` for a label).
- A primary action joined to a menu of alternatives → use `split-button`.
- A searchable palette of commands → use `command`.
- Free-form or interactive content such as forms or filters → use `popover`.
- Vertical application navigation → use `sidebar-menu`.

## Related

- `split-button` — composes `DropdownMenu` for its chevron menu.
- `select` — form control with a field trigger and a bound value.
- `popover` — same trigger and anchoring model, with free-form content instead of option rows.
- `command` — modal ⌘K palette with search and filtering.

## Best practices

- Give every `DropdownMenu.Item` a unique `value` and handle the root `select` event as `(event, value)`. The panel closes and focus returns to the trigger on its own.
- `selected` is a display flag. The dropdown never sets it, so derive it from your own state.
- Use the `command` prop or the `trailing` slot on an option, not both. A `command` shortcut is live while its option is mounted (inside a group, only while the panel is open). Every menu on the page shares one `window` listener, so a shortcut fires one option only: the one in the open menu, else the one whose trigger has focus, else the first registered.
- Write `DropdownMenu.Item` (also exported as `DropdownMenuItem`); 6.0 removed the `DropdownMenu.Option` alias and the `left` / `right` slots. Items may sit directly in the root: an item outside a group renders inside the panel like a grouped one.
- Add a `label` to each `DropdownMenu.Group` when there is more than one group. Put search in the root `top` slot and footer actions in `bottom`; those regions stay outside the scrolling list.
- Nest at most two levels of sub-menus; deeper menus are hard to steer with a pointer. Put the `DropdownMenu.Sub` inside a `DropdownMenu.Group`, and the sub-menu's options inside a `DropdownMenu.Group` in `DropdownMenu.SubContent`, the same way as the top level.
- Use `kind="checkbox"` for independent on/off settings and `kind="radio"` for one choice among the options of one `DropdownMenu.Group`. Drive `selected` from your own state in the `select` handler; checkable options keep the panel open so several can be toggled in a row.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Usage

```vue
<script setup>
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Button from '@aziontech/webkit/button'

  const onSelect = (event, value) => {
    console.log(value)
  }
</script>

<template>
  <DropdownMenu @select="onSelect">
    <DropdownMenu.Trigger>
      <Button kind="secondary">Open menu</Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Group label="Account">
      <DropdownMenu.Item
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenu.Item
        value="settings"
        label="Settings"
        command="⌘,"
      />
      <DropdownMenu.Item
        value="billing"
        label="Billing"
        disabled
      />
    </DropdownMenu.Group>

    <DropdownMenu.Group label="Workspace">
      <DropdownMenu.Item
        value="invite"
        label="Invite members"
      />
      <DropdownMenu.Item
        value="logs"
        label="Audit log"
        selected
      />
    </DropdownMenu.Group>
  </DropdownMenu>
</template>
```

Tree-shaking alternative — the same sub-components as standalone imports:

```vue
<script setup>
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuSub from '@aziontech/webkit/dropdown-menu-sub'
  import DropdownMenuSubTrigger from '@aziontech/webkit/dropdown-menu-sub-trigger'
  import DropdownMenuSubContent from '@aziontech/webkit/dropdown-menu-sub-content'
</script>
```

Sub-menus and checkable options:

```vue
<template>
  <DropdownMenu @select="onSelect">
    <DropdownMenu.Trigger>
      <Button kind="secondary">View</Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Group label="Columns">
      <DropdownMenu.Item
        value="status"
        label="Status"
        kind="checkbox"
        :selected="columns.status"
      />
    </DropdownMenu.Group>

    <DropdownMenu.Group>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger label="Sort by" />
        <DropdownMenu.SubContent>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="name"
              label="Name"
              kind="radio"
              :selected="sort === 'name'"
            />
            <DropdownMenu.Item
              value="updated"
              label="Last updated"
              kind="radio"
              :selected="sort === 'updated'"
            />
          </DropdownMenu.Group>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Group>
  </DropdownMenu>
</template>
```

## Sub-components

- `dropdown-menu-trigger/dropdown-menu-trigger.vue` — as-child trigger. Reads `inject` for `isOpen`, `triggerId`, `panelId`, `setOpen`. Renders a non-interactive inline wrapper (no `role`, no `tabindex`) that carries `data-testid`, `data-state` and `data-disabled` and listens for the bubbling `click` / `keydown`. It gives `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled` (when the root is disabled) and the trigger `id` (unless the control already has one) to the slotted control, which also becomes the positioning anchor and the focus-return target. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. So an `IconButton`, a `Button`, or either wrapped in a `Tooltip` is the one tab stop and the one ARIA owner — no nested interactive control. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"` (`-1` when disabled); for these and for native elements this is in the server HTML too.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The trigger forwards aria + click; the consumer must not bind those props itself.
- `dropdown-menu-group/dropdown-menu-group.vue` — labeled section. Renders a `label` row (`text-label-sm` in `--text-muted`, sentence case) above its default slot and a top divider when it is not the first group inside the panel. The divider runs edge-to-edge across the panel's inner width — the panel carries only vertical padding, and the horizontal inset the option rows need lives on the group's own content wrapper — so the hairline reads like the panel's own border rather than a floated rule. It carries `--spacing-sm` above and `--spacing-xs` below.
  - Props: `label: string` default `''` — section label rendered above the options. Omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<DropdownMenu.Item>`; `top` — inline region rendered between the group label and the options (e.g. a per-section search or description); `bottom` — inline region rendered after the options (e.g. a "see all" link).
- `dropdown-menu-option/dropdown-menu-option.vue` — selectable row, attached as `DropdownMenu.Item`. Renders the leading slot, the label, the trailing slot, an optional `command` hint and, when `selected`, a check mark. Calls injected `selectOption(value, event)` on click / `Enter` / `Space`. Every row is `tabindex="-1"`; the root moves focus with the arrows and typeahead. Outside a group the row teleports itself into the panel body (`data-ungrouped`, with the group's horizontal inset).
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when this option is activated.
    - `label: string` default `''` — plain-text label; falls back to the default slot when omitted.
    - `command: string` default `''` — keyboard-shortcut hint rendered on the trailing side (e.g. `'⌘P'`, `'⇧⌘P'`, `'Ctrl+,'`). A module-level registry holds one `window` `keydown` listener for every menu on the page (attached while at least one shortcut is registered); it matches the shortcut against the registered options of enabled menus and emits `select` for one match only (preventing the browser default): an option of the open menu wins, then an option of the menu whose trigger holds focus, then the first registered, so a row menu repeated on every table row fires for the row the person is on. Mutually exclusive with the `trailing` slot.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens.
    - `selected: boolean` default `false` — marks the option as checked: `role="menuitemradio"` with `aria-checked="true"`, the selected background and a trailing `pi pi-check`.
    - `href: string` default `''` — destination URL; the row renders as an anchor (still `role="menuitem"`) that emits `select` and then follows the link, so it can be opened in a new tab. `Enter` follows it natively; `Space` clicks it.
    - `kind: 'default' | 'checkbox' | 'radio'` default `'default'` — item role. `default` renders `role="menuitem"` (`menuitemradio` with `aria-checked="true"` and a trailing check when `selected`) and closes the panel on activation; `checkbox` renders `role="menuitemcheckbox"` and `radio` renders `role="menuitemradio"`, both with a leading check / dot indicator column instead of the trailing check, `aria-checked` mirroring `selected`, and the panel kept open on activation (`select` still fires). Exported as `DropdownMenuOptionKind`.
  - Events: _none_ (root emits `select`).
  - Slots: `default` (override of the `label` prop, for rich label content), `leading` (icon / avatar before the label), `trailing` (icon / badge after the label; mutually exclusive with `command`).
- `dropdown-menu-sub/dropdown-menu-sub.vue` — sub-menu scope. Owns the open state of one nested menu and shares it with its `SubTrigger` and `SubContent`. Renders a `display: contents` wrapper carrying `data-testid` (`<root>__sub`) and `data-state`. Only one sub-menu per menu level is open at a time: hovering or focusing a sibling item closes it after a 150 ms grace period, so a pointer moving diagonally toward the sub-panel does not close it; entering the sub-panel cancels the close. Closing the root closes every sub-menu.
  - Props: `defaultOpen: boolean` default `false` — opens the sub-menu when the parent panel opens (for documentation and screenshots); the user can still close it.
  - Events: _none_ (activation inside bubbles to the root `select`).
  - Slots: `default` — one `<DropdownMenu.SubTrigger>` followed by one `<DropdownMenu.SubContent>`.
- `dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue` — the row that opens the sub-menu. Same 32 px row as an option, with a trailing chevron (`pi pi-chevron-right`, mirrored under rtl). `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` pointing at the sub-panel; keeps the hover background while its sub-menu is open (`data-state="open"`). Opens on pointer enter, click, `Enter`, `Space` and `ArrowRight` (`ArrowLeft` under rtl); the keyboard paths move focus to the first sub-menu item.
  - Props: `label: string` default `''` — plain-text label; falls back to the default slot. `disabled: boolean` default `false` — the row cannot open its sub-menu and applies disabled tokens.
  - Events: _none_.
  - Slots: `default` (rich label), `leading` (icon before the label).
- `dropdown-menu-sub-content/dropdown-menu-sub-content.vue` — the nested panel. Teleported to `body` and positioned by the shared `usePlacement` against the sub-trigger at `right-start` (`left-start` under rtl), flipping to the other side when it does not fit; the same surface, border, shadow and motion as the top-level panel, `role="menu"` labelled by the sub-trigger. It is its own menu level: `Down` / `Up` / `Home` / `End` move inside it, `ArrowLeft` (`ArrowRight` under rtl) and `Esc` close it and return focus to the sub-trigger, `Tab` closes the whole menu. Clicks inside it never dismiss the menu.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<DropdownMenu.Group>` (groups render into this panel exactly as they do at the top level), which may hold further `<DropdownMenu.Sub>`.

## Props

| Prop          | Type                                                                   | Default          | Required | JSDoc                                                                                                                       |
| ------------- | ---------------------------------------------------------------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `placement`   | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | false    | Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on viewport space. |
| `offset`      | `number`                                                               | `4`              | false    | Pixel gap between the trigger and the panel.                                                                                |
| `disabled`    | `boolean`                                                              | `false`          | false    | Prevents the trigger from opening the panel and applies disabled tokens.                                                    |
| `defaultOpen` | `boolean`                                                              | `false`          | false    | Initial open state when uncontrolled (`v-model:open` unbound).                                                              |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                                         |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, option activation, `Esc`, outside click). While unbound the menu is uncontrolled and starts at `defaultOpen`. |

## Events

| Event    | Payload                                                                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: DropdownMenuOptionValue)` | Fires when an enabled option is activated (click, `Enter`/`Space`, or a `command` shortcut). `event` is the activation event; `value` is the activated option's identifier. The panel closes automatically and focus returns to the trigger when activated from inside the open panel, except for `kind="checkbox"` / `kind="radio"` options, which keep it open. Options inside a sub-menu emit on the same root event. |

**Types.** `@aziontech/webkit/dropdown-menu` (and `-root`) export `DropdownMenuOptionValue` (`string | number`, the `select` payload and `DropdownMenu.Item`'s `value`), `DropdownMenuPlacement` and `DropdownMenuPlacementInput` (the `placement` prop), so a `select` handler is typed without a local alias.

## Slots

| Slot      | Scope | Notes                                                                          |
| --------- | ----- | ------------------------------------------------------------------------------ |
| `default` | —     | Place `<DropdownMenu.Trigger>` followed by one or more `<DropdownMenu.Group>`. |
| `top`     | —     | Sticky region rendered above the scrollable group list (e.g. search input).    |
| `bottom`  | —     | Sticky region rendered below the scrollable group list (e.g. footer action).   |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-state` values (root + trigger): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root, trigger, and option
- `data-selected` on option mirrors the `selected` prop
- `data-kind` on option mirrors the `kind` prop (`default` | `checkbox` | `radio`)
- `data-state` on sub, sub-trigger and sub-panel: `open` | `closed`; `data-disabled` on sub-trigger mirrors its `disabled` prop
- `data-placement` on the sub-panel mirrors its resolved side (`right-start` | `right-end` | `left-start` | `left-end`)
- `data-placement` on the root mirrors the `placement` prop (`'auto'` stays as `'auto'`)
- `data-placement` on the panel mirrors the resolved placement (`'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`)

## Motion & Animations

| Trigger                        | Animation / Transition                                  | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| panel open                     | `animate-popup-scale-in` (origin from `--popup-origin`) | semantic (`moderate-01` · `productive-entrance`)  | `motion-reduce:animate-none` (instant) |
| panel close                    | `animate-popup-scale-out`                               | semantic (`fast-02` · `productive-exit`)          | `motion-reduce:animate-none` (instant) |
| option hover / selected change | `transition-colors duration-150 ease-out`               | inline (matches catalog)                          | `motion-reduce:transition-none`        |

## Tokens

| Region                          | Token (DESIGN.md)                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| panel surface                   | `var(--bg-surface)`                                                                                                             |
| panel border                    | `var(--border-default)`                                                                                                         |
| panel shape                     | `var(--shape-card)`                                                                                                             |
| panel shadow                    | `var(--shadow-sm)`                                                                                                              |
| panel typography (group label)  | `.text-label-sm` + `text-(--text-muted)`                                                                                        |
| panel typography (option label) | `.text-label-sm` + `text-(--text-default)`                                                                                      |
| option shape                    | `var(--shape-button)`                                                                                                           |
| option spacing.x                | `var(--spacing-sm)`                                                                                                             |
| option spacing.y                | `var(--spacing-xxs)`                                                                                                            |
| option gap                      | `var(--spacing-xs)`                                                                                                             |
| option hover surface            | `var(--bg-hover)`                                                                                                               |
| option selected surface         | `var(--bg-selected)`                                                                                                            |
| option disabled text            | `var(--text-disabled)`                                                                                                          |
| option command text             | `text-(--text-muted)`                                                                                                           |
| checkable indicator             | `pi pi-check` / a `size-1.5` `rounded-full` `bg-current` dot in `text-(--text-default)`, in a `size-4` column                   |
| sub-trigger chevron             | `pi pi-chevron-right` + `text-(--text-muted)`, `rtl:-scale-x-100`                                                               |
| sub-trigger open surface        | `var(--bg-hover)`                                                                                                               |
| group divider                   | `border-t border-(--border-default)`, full-bleed (no horizontal padding on the panel or the group root)                         |
| group divider spacing.above     | `var(--spacing-sm)`                                                                                                             |
| group divider spacing.below     | `var(--spacing-xs)`                                                                                                             |
| group content inset.x           | `var(--spacing-xxs)`                                                                                                            |
| panel spacing.y                 | `var(--spacing-xs)` — the vertical seam is one step up from the row inset so the first/last row does not crowd the panel border |
| focus ring                      | `var(--ring-color)`                                                                                                             |
| popup origin                    | `var(--popup-origin)`                                                                                                           |

## Theme gaps

| Figma variable                  | Temporary primitive | Follow-up                                                           |
| ------------------------------- | ------------------- | ------------------------------------------------------------------- |
| `--bg-surface-raised` (#141414) | `var(--bg-surface)` | `TODO: tokenizar bg-surface-raised como camada acima de bg-surface` |
| `--radius-md` (6px)             | `var(--shape-card)` | `TODO: confirmar se panel deve usar 6px (md) ou herdar shape-card`  |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and option.
- Keyboard map:
  - On the trigger: `Enter` / `Space` opens the panel and focuses the first enabled option; `Down` opens and focuses the first option; `Up` opens and focuses the last option.
  - On a sub-trigger: `ArrowRight` (`ArrowLeft` under rtl), `Enter` or `Space` opens the sub-menu and focuses its first enabled item.
  - Inside a sub-menu: `Down` / `Up` / `Home` / `End` move within it; `ArrowLeft` (`ArrowRight` under rtl) or `Esc` closes it and returns focus to its sub-trigger; `Enter` / `Space` activate; `Tab` closes the whole menu. Tests: `dropdown-menu.test.ts` › sub-menus.
  - Inside the panel: `Down` / `Up` move between enabled options (wrap-around); `Home` / `End` jump to first/last enabled option; a printable character moves to the next enabled option whose label starts with it (typeahead: characters typed within 500 ms accumulate, a repeated character cycles); `Enter` / `Space` activate the focused option; `Esc` closes the panel and returns focus to the trigger; `Tab` closes the panel and lets focus proceed to the next focusable element after the trigger; `Shift+Tab` closes it and returns focus to the trigger. Typing in a search field inside the top slot keeps `Home` / `End` for the caret. Tests: `dropdown-menu.test.ts` › keyboard map (spec).
  - Nested overlays: the open panel joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` activating an option or pressing `Esc` closes only the menu; a pointer-down inside a higher layer (a `Select` list opened from the top slot) does not close the menu.
- ARIA: the slotted control (or the wrapper, when the slot has none) exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, with a single tab stop; the panel's `aria-labelledby` follows the control's `id`; the `role="menu"` element wraps only the groups and options, and the optional top and bottom slots (search fields, footers with buttons) sit beside it inside the floating panel, because a `menu` may own only menu items, groups and separators (`aria-required-children`); each group uses `role="group"` + `aria-labelledby` pointing at its label id (when `label` is set); each option uses `role="menuitem"`, `aria-disabled` mirrors `disabled`; a selected option is `role="menuitemradio"` with `aria-checked="true"` and a visible check mark; `kind="checkbox"` / `kind="radio"` options are `menuitemcheckbox` / `menuitemradio` with `aria-checked` mirroring `selected`; a sub-trigger is a `menuitem` with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`, and its sub-panel is a `role="menu"` labelled by it. The check and chevron glyphs are `aria-hidden`. Options are `tabindex="-1"` (roving focus through the arrows), so `Tab` leaves the menu. While closed, a menu attaches no `document` listener; the outside-`mousedown` listener lives only while the panel is open.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled` token).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/selected states.
- Teleported panel: the `role="menu"` panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it lays out and is announced in the provider's direction and language although it renders under `body`.
- Touch target ≥40×40 px on the trigger; option rows are 32 px tall and are activated by full-row click + keyboard, satisfying the 24×24 px target floor for in-menu items per WCAG 2.5.8.

## Internationalization

No built-in strings: every label comes from the consumer (`label` props and slots).

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`text-start`, `ps-`/`pe-`, `gap`); the panel and every sub-panel bind `dir` / `lang` from `WebkitProvider`, so they lay out in the provider's direction under `body`.
- Icons: the sub-trigger chevron mirrors (`rtl:-scale-x-100`); the check and radio dot do not.
- Keyboard: under rtl `ArrowLeft` opens a sub-menu and `ArrowRight` closes it; the sub-panel opens at `left-start` and flips to `right-start` when it does not fit. `Up` / `Down` are unchanged.
- User data: none (labels are consumer text).

## Responsive

- Container queries: none; panels are sized between `--container-3xs` and `--container-2xs`.
- Narrow (≤ 640 px or a narrow container): `usePlacement` keeps every panel inside the viewport; a sub-panel with no room on either side overlaps the parent panel instead of leaving the screen; labels truncate.
- Touch: rows are 32 px; a sub-menu opens on tap (click) as well as hover, so nothing is hover-only.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./dropdown-menu-root` and the item parts keep their entries in `.size-limit.json`; the sub-menu parts add `./dropdown-menu-sub`, `./dropdown-menu-sub-trigger` and `./dropdown-menu-sub-content`. The shared menu behaviour lives in the internal `use-menu-root` composable, also used by `context-menu`.
- Runtime budget: none beyond the existing menu; a sub-panel renders only while open.
- Heavy parts: none.

## Examples

Canonical layout — composite examples (`types.vue`, `sizes.vue`) render every variant of one axis side-by-side in a single frame; state examples (`loading.vue`, `disabled.vue`) change only the prop they demonstrate.

- Default — one trigger, one group, six options, no leading/trailing affordances.
- Groups — composite story rendering two `<DropdownMenu.Group>` with labels and a divider between them; required because grouping is the central anatomy of this component and is not covered by `Default`.
- States — composite story rendering one panel with options in each option state side-by-side: `default`, `hover` (simulated via `data-state`), `selected`, `disabled`. Required because `DropdownMenu.Item` has no `kind` / `size` axis but a state axis that is the component's visual identity.
- Placements — composite story rendering all four explicit `placement` values (`bottom-start`, `bottom-end`, `top-start`, `top-end`) side-by-side. Required because `placement` is a multi-value prop axis with no other coverage; consumers need to see how each placement anchors against its trigger.
- AutoPlacement — composite story demonstrating `placement="auto"`: four triggers anchored near each viewport corner so the resolver opens the panel toward the corner with the most available space. Required because `'auto'` is the only `placement` value not covered by `Placements` and is the recommended default for consumer-positioned triggers.
- OptionAffordances — composite story rendering options that demonstrate the `command` prop and the `leading` + `trailing` slots in a single panel. Required because these affordances are public Option API surface the existing stories do not exercise, and the spec calls out their mutual exclusivity.
- WithTopAndBottomSlots — single panel forced open showing the root `top` and `bottom` named slots in use (e.g. a search input on top, a footer action on bottom). Required because both slots are public root API documented in the Slots table and have no other coverage.
- GroupsWithTopAndBottomSlots — panel forced open with two `<DropdownMenu.Group>` each using its own `top` (per-section caption) and `bottom` (per-section action) slots. Required because the group-level `top`/`bottom` are public API on `DropdownMenu.Group` and behave differently from the root slots (inline, per-section — not sticky).
- SubMenus — panel forced open with a `DropdownMenu.Sub` open by `defaultOpen`, one nested level holding a second sub-menu. Required because the sub-menu parts are public API with no other coverage.
- CheckableOptions — panel forced open with a group of `kind="checkbox"` options and a group of `kind="radio"` options, wired to local state. Required because `kind` is a public Option axis with no other coverage.
- CustomTriggers — composite story showing the abstract `<DropdownMenu.Trigger>` wrapping different elements (Button, IconButton, plain text). Required because the spec mandates the trigger is abstract and the consumer chooses the inner element; the existing stories only show a `Button`.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
