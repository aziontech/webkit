# Tab View — API contract

Source of truth for `@aziontech/webkit/navigation/tab-view`. Maps Figma **TabView** (`3374:6191`) and **TabViewItem** (`3374:6170`).

## Anatomy

```text
TabView (Root)
├── TabView.List [role=tablist]
│   └── TabView.Item [role=tab, value]
└── TabView.Panel [role=tabpanel, value]
```

## Root

| Prop           | Type                       | Default     | Notes                            |
| -------------- | -------------------------- | ----------- | -------------------------------- |
| `defaultValue` | `string \| number \| null` | `null`      | Uncontrolled initial tab         |
| `value`        | `string \| number \| null` | `undefined` | Controlled tab (`v-model:value`) |

| Emit           | Payload                |
| -------------- | ---------------------- |
| `update:value` | `TabViewValue \| null` |
| `value-change` | `TabViewValue \| null` |

## List

Container for tab triggers. Handles `ArrowLeft` / `ArrowRight` / `Home` / `End` keyboard navigation.

## Item

| Prop       | Type               | Default      | Notes                                |
| ---------- | ------------------ | ------------ | ------------------------------------ |
| `value`    | `string \| number` | `undefined`  | Required inside `TabView`            |
| `label`    | `string`           | `'Tab Item'` | Used when default slot is empty      |
| `selected` | `boolean`          | `false`      | Standalone Highlight state (no Root) |
| `disabled` | `boolean`          | `false`      | Disabled state                       |
| `closable` | `boolean`          | `false`      | Renders close control beside the tab |

| Slot       | Notes         |
| ---------- | ------------- |
| `default`  | Tab label     |
| `leading`  | Leading icon  |
| `trailing` | Trailing icon |

| Emit    | Payload      |
| ------- | ------------ |
| `click` | `MouseEvent` |
| `close` | `MouseEvent` |

State: `data-state="active" | "inactive"`, `data-disabled`, `aria-selected`, roving `tabindex`.

## Panel

| Prop    | Type               | Notes                        |
| ------- | ------------------ | ---------------------------- |
| `value` | `string \| number` | Must match an `TabView.Item` |

Hidden when inactive (`hidden` + `data-state`). Active panel content fades in (`animate-fade-in`, `motion-reduce:animate-none`) on each selection.

## Theme gaps

| Figma token                      | Temporary mapping                |
| -------------------------------- | -------------------------------- |
| `--tabview/tabviewnavbg`         | `bg-transparent`                 |
| `--tabview/tabviewcontentborder` | `border-[var(--border-default)]` |

## WCAG 2.1 AA (tabs pattern)

| Requirement | Implementation                                       |
| ----------- | ---------------------------------------------------- |
| **4.1.2**   | `role="tablist"`, `tab`, `tabpanel`; `aria-selected` |
| **2.1.1**   | Arrow keys, Home/End; button activation              |
| **2.4.7**   | `focus-visible` ring on tab triggers                 |
