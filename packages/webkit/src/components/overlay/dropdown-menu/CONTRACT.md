# Dropdown Menu — API contract

Source of truth for `@aziontech/webkit/overlay/dropdown-menu*`. Floating panel menu for actions (not the form select at `@aziontech/webkit/inputs/dropdown`).

Positioning and motion follow the same pattern as [`inputs/dropdown`](../../inputs/dropdown/dropdown.vue): fixed coordinates from `getBoundingClientRect` + Vue `<Transition>` with scoped opacity/scale CSS (no `@floating-ui/vue` on this component).

## Anatomy

```text
DropdownMenu (Root)
├── DropdownMenuTrigger
└── DropdownMenuPortal → Teleport body
    └── DropdownMenuContent [role=menu, Transition]
        ├── DropdownMenuGroup
        ├── DropdownMenuItem
        ├── DropdownMenuSeparator
        └── DropdownMenuFromModel
```

## Root

| Prop            | Type      | Default     | Notes                                    |
| --------------- | --------- | ----------- | ---------------------------------------- |
| `open`          | `boolean` | `undefined` | Controlled (`v-model:open`)              |
| `defaultOpen`   | `boolean` | `false`     | Uncontrolled initial state               |
| `closeable`     | `boolean` | `true`      | Escape / outside mousedown close         |
| `closeOnSelect` | `boolean` | `true`      | Item select closes menu                  |
| `sideOffset`    | `number`  | `4`         | Gap below trigger (px)                   |
| `alignOffset`   | `number`  | `0`         | Horizontal offset from trigger left (px) |

## Content

| Behavior   | Detail                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------- |
| Position   | `position: fixed; top: trigger.bottom + sideOffset; left: trigger.left + alignOffset`     |
| Reposition | `resize` + capture `scroll` listeners while open                                          |
| Animation  | `webkit-dropdown-menu-panel` transition (150ms opacity + scale, `motion-reduce` friendly) |
| Keyboard   | ArrowUp/Down, Home/End; Escape closes                                                     |

## Factory

See `@aziontech/webkit/overlay/dropdown-menu-factory`.

## Figma references

- `3750:15346` — DropdownOption
- `3750:15645` — DropdownGroup
- `3775:16746` — DropdownMenu
