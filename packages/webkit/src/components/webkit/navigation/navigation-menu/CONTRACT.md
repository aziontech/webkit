# Navigation Menu — API contract

Source of truth for `@aziontech/webkit/navigation-menu`. Mirrors [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu) with Vue `as` prop instead of React `render`.

## Anatomy

```text
NavigationMenu (Root)
├── NavigationMenu.List
│   └── NavigationMenu.Item [value?]
│       ├── NavigationMenu.Trigger [nativeButton?, as]
│       │   └── NavigationMenu.Icon
│       ├── NavigationMenu.Content [keepMounted?]
│       │   └── ul
│       │       └── NavigationMenu.Item [layout="entry", href, description?, featured?, closeOnClick?, active?]
│       │           ├── #icon (optional)
│       │           └── default slot (title)
│       └── NavigationMenu.Link (top-level item)
└── NavigationMenu.Portal [container?, keepMounted?]
    ├── NavigationMenu.Backdrop (optional)
    └── NavigationMenu.Positioner [side, align, offsets, collision*]
        └── NavigationMenu.Popup
            ├── NavigationMenu.Arrow
            └── NavigationMenu.Viewport
```

## Root

| Prop           | Type                         | Default        | Notes                                  |
| -------------- | ---------------------------- | -------------- | -------------------------------------- |
| `defaultValue` | `string \| number \| null`   | `null`         | Uncontrolled initial open item         |
| `value`        | `string \| number \| null`   | `undefined`    | Controlled open item (`v-model:value`) |
| `delay`        | `number`                     | `50`           | Hover-open delay (ms)                  |
| `closeDelay`   | `number`                     | `300`          | Hover-close delay (ms)                 |
| `orientation`  | `'horizontal' \| 'vertical'` | `'horizontal'` |                                        |
| `class`        | `string`                     | `''`           | Theme classes                          |
| `ariaLabel`    | `string`                     | `'Main'`       | Root `<nav>` label                     |
| `as`           | `string \| Component`        | `'nav'`        | Polymorphic root element               |

| Emit                   | Payload               |
| ---------------------- | --------------------- |
| `update:value`         | `value, eventDetails` |
| `value-change`         | same                  |
| `open-change-complete` | `open: boolean`       |

| Expose | `{ unmount }` |
| State (`data-*`) | `data-open`, `data-orientation` on root |

**Change reasons:** `trigger-press`, `trigger-hover`, `outside-press`, `list-navigation`, `focus-out`, `escape-key`, `link-press`, `none`

**Event details:** `{ reason, event, trigger, cancel(), allowPropagation(), isCanceled, isPropagationAllowed }`

## List / Item / Trigger / Icon / Content / Link

| Part        | Key props                                                                                                                                           | Element                            | State attributes                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| **List**    | `class`, `as`                                                                                                                                       | `<ul>`                             | `data-open`                                             |
| **Item**    | `layout` (`'root'` \| `'entry'`, default `'root'`), `value?`, `class`, `as`; entry: `href`, `description?`, `featured?`, `closeOnClick?`, `active?` | `<li>`; entry: `<li><a>…</a></li>` | entry anchor: `data-active`, `data-featured`            |
| **Trigger** | `nativeButton` (default `true`), `class`, `as`                                                                                                      | `<button>`                         | `data-popup-open`, `data-pressed`                       |
| **Icon**    | `class`, `as`                                                                                                                                       | wrapper                            | `data-open`                                             |
| **Content** | `keepMounted`, `class`, `as`                                                                                                                        | teleported panel                   | `data-open`, `data-closed`, `data-activation-direction` |
| **Link**    | `closeOnClick`, `active`, `class`, `as`                                                                                                             | `<a>`                              | `data-active`, `aria-current="page"` when active        |

### Item (`layout="entry"`)

Panel rows inside `NavigationMenu.Content` (Figma `HeaderNavigationMenuItem`).

| Prop           | Type                | Default     | Notes                                   |
| -------------- | ------------------- | ----------- | --------------------------------------- |
| `layout`       | `'root' \| 'entry'` | `'root'`    | `entry` renders Figma panel row         |
| `href`         | `string`            | —           | Required when `layout="entry"`          |
| `description`  | `string`            | `undefined` | Muted secondary line                    |
| `featured`     | `boolean`           | `false`     | Brand-colored title (e.g. “Ver todas”)  |
| `closeOnClick` | `boolean`           | `false`     | Closes menu on click                    |
| `active`       | `boolean`           | `false`     | `data-active`, `aria-current` on anchor |

| Slot    | Notes                                         |
| ------- | --------------------------------------------- |
| `icon`  | Optional leading icon (`aria-hidden` wrapper) |
| default | Title text                                    |

## Portal / Backdrop / Positioner / Popup / Viewport / Arrow

| Part           | Key props                                                                                                                          | Notes                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Portal**     | `container`, `keepMounted`, `class`                                                                                                | Teleport to `body` by default              |
| **Backdrop**   | `class`, `as`                                                                                                                      | `data-open`, `data-closed`                 |
| **Positioner** | `side`, `align`, `sideOffset`, `alignOffset`, `arrowPadding`, `collisionPadding`, `sticky`, `disableAnchorTracking`, `class`, `as` | CSS vars on positioner                     |
| **Popup**      | `class`, `as`                                                                                                                      | `<nav>`; `--popup-width`, `--popup-height` |
| **Viewport**   | `class`, `as`                                                                                                                      | Content teleport target                    |
| **Arrow**      | `class`, `as`                                                                                                                      | `data-side`, `data-align`                  |

## Animation presets

| Preset ID             | Targets | Behavior                                             |
| --------------------- | ------- | ---------------------------------------------------- |
| `popup.fadeScale`     | Popup   | opacity + scale; opacity required for unmount timing |
| `content.directional` | Content | slide on `activationDirection`                       |
| `instant`             | All     | skip when `data-instant` on Positioner               |

Defined in `presets/animations.js`.

## WCAG 2.2 AA (Disclosure Navigation Menu)

| Requirement | Implementation                                                               |
| ----------- | ---------------------------------------------------------------------------- |
| **1.3.1**   | Root `<nav aria-label>`; list structure preserved                            |
| **2.1.1**   | Enter/Space on triggers; arrows between triggers; Escape closes              |
| **2.4.3**   | Focus returns to trigger on close                                            |
| **2.4.7**   | `focus-visible` on triggers/links (theme `border-primary`)                   |
| **4.1.2**   | `aria-expanded`, `aria-haspopup` on triggers; `aria-current` on active links |
| **1.4.13**  | `delay` / `closeDelay`; pointer-safe `sideOffset`                            |

## Out of scope (follow-up)

- Nested submenu stories (nested Root inside Content)
- Nested inline submenus (no Portal)
- Scroll Area integration for overflow
