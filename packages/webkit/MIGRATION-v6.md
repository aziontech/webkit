# Migrating to `@aziontech/webkit` v6

v6 aligns WebKit's names with the vocabulary of shadcn/ui and Radix — the names AI agents and most
developers already know — removes duplicated components, and settles one name per prop idea. Most of
it is mechanical: run the codemod, then do the few manual steps it lists.

## 1. Run the codemod

```bash
pnpm add @aziontech/webkit@^6 @aziontech/theme@latest
npx @aziontech/webkit migrate v6 --dry-run   # see every change first
npx @aziontech/webkit migrate v6             # rewrite the project
npx @aziontech/webkit doctor
```

It rewrites, in every `.vue`, `.ts` and `.js` file outside `node_modules` and `dist` that imports from
`@aziontech/webkit`:

- import paths, including sub-components (`dropdown-trigger` → `dropdown-menu-trigger`);
- component bindings, in PascalCase and in kebab-case tags;
- renamed props and prop values on those components (`v-model:value` → `v-model`, `border` →
  `bordered`, `kind="text"` → `kind="transparent"`, …).

It prints `MANUAL` for anything it cannot rewrite safely (section 4).

## 2. Renamed components

| v5 import                              | v6 import                          | v5 component       | v6 component    |
| -------------------------------------- | ---------------------------------- | ------------------ | --------------- |
| `@aziontech/webkit/paginator`          | `@aziontech/webkit/pagination`     | `Paginator`        | `Pagination`    |
| `@aziontech/webkit/tab-view`           | `@aziontech/webkit/tabs`           | `TabView`          | `Tabs`          |
| `@aziontech/webkit/card-box`           | `@aziontech/webkit/card`           | `CardBox`          | `Card`          |
| `@aziontech/webkit/message`            | `@aziontech/webkit/alert`          | `Message`          | `Alert`         |
| `@aziontech/webkit/divider`            | `@aziontech/webkit/separator`      | `Divider`          | `Separator`     |
| `@aziontech/webkit/progress-bar`       | `@aziontech/webkit/progress`       | `ProgressBar`      | `Progress`      |
| `@aziontech/webkit/command-menu`       | `@aziontech/webkit/command`        | `CommandMenu`      | `Command`       |
| `@aziontech/webkit/dropdown`           | `@aziontech/webkit/dropdown-menu`  | `Dropdown`         | `DropdownMenu`  |
| `@aziontech/webkit/input-text`         | `@aziontech/webkit/input`          | `InputText`        | `Input`         |
| `@aziontech/webkit/input-number`       | `@aziontech/webkit/number-input`   | `InputNumber`      | `NumberInput`   |
| `@aziontech/webkit/input-password`     | `@aziontech/webkit/password-input` | `InputPassword`    | `PasswordInput` |
| `@aziontech/webkit/box-grid-selection` | `@aziontech/webkit/radio-cards`    | `BoxGridSelection` | `RadioCards`    |
| `@aziontech/webkit/resizable-panel`    | `@aziontech/webkit/resizable`      | `ResizablePanel`   | `Resizable`     |
| `@aziontech/webkit/segmented-button`   | `@aziontech/webkit/toggle-group`   | `SegmentedButton`  | `ToggleGroup`   |

The AI tooling knows the old names too: the MCP and `catalog.json#aliases` resolve a retired or
market name (`paginator`, `message`, `modal`, `sheet`, `tiles`, `segmented-control`, …) to the v6
component.

## 3. Renamed props and values

| Component         | v5                 | v6                   |
| ----------------- | ------------------ | -------------------- |
| `accordion`       | `value`            | `modelValue`         |
| `alert`           | `severity="error"` | `severity="danger"`  |
| `button`          | `kind="text"`      | `kind="transparent"` |
| `code-block`      | `border`           | `bordered`           |
| `code-block`      | `value`            | `modelValue`         |
| `doc-card`        | `overline`         | `eyebrow`            |
| `doc-card`        | `link`             | `linkLabel`          |
| `doc-card-group`  | `mobileCols`       | `mobileColumns`      |
| `doc-tooltip`     | `headline`         | `title`              |
| `doc-tooltip`     | `cta`              | `linkLabel`          |
| `item`            | `kind="outline"`   | `kind="outlined"`    |
| `log-view`        | `border`           | `bordered`           |
| `log-view`        | `showCopy`         | `copyable`           |
| `media-tabs`      | `autoPlay`         | `autoplay`           |
| `media-tabs`      | `autoPlayInterval` | `autoplayInterval`   |
| `navigation-menu` | `value`            | `modelValue`         |
| `quote-tabs`      | `autoPlay`         | `autoplay`           |
| `quote-tabs`      | `autoPlayInterval` | `autoplayInterval`   |
| `severity-tag`    | `level`            | `severity`           |
| `shell-mockup`    | `still="true"`     | `animated="false"`   |
| `shell-mockup`    | `still="false"`    | `animated="true"`    |
| `table`           | `border`           | `bordered`           |
| `tabs`            | `value`            | `modelValue`         |
| `theme-switcher`  | `value`            | `modelValue`         |

## 4. Manual changes

### Form fields: one `Field` replaces the `field-*` family

The codemod lists every `field-*` import as `MANUAL`. Replace each one with `Field` around the plain
control (shadcn/ui anatomy). `Field` carries `orientation` (`vertical`, `horizontal`, `responsive`),
`invalid`, `disabled` and `required`, and the control inside picks up its id, `aria-describedby` and
state on its own.

```vue
<!-- v5 -->
<FieldText v-model="name" label="Name" helper-text="Shown on invoices." required />

<!-- v6 -->
<Field required>
  <Field.Label>Name</Field.Label>
  <Input v-model="name" />
  <Field.Description>Shown on invoices.</Field.Description>
</Field>
```

| Removed                                  | Use instead                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `@aziontech/webkit/field-text`           | Field + FieldLabel + Input + FieldDescription                                                                 |
| `@aziontech/webkit/field-textarea`       | Field + FieldLabel + Textarea + FieldDescription                                                              |
| `@aziontech/webkit/field-select`         | Field + FieldLabel + Select (Trigger/Content/Option) + FieldDescription                                       |
| `@aziontech/webkit/field-password`       | Field + FieldLabel + PasswordInput + FieldDescription (+ PasswordRequirements for the rules row)              |
| `@aziontech/webkit/field-phone-number`   | Field + FieldLabel + PhoneInput + FieldDescription                                                            |
| `@aziontech/webkit/field-time`           | Field + FieldLabel + Input + FieldDescription                                                                 |
| `@aziontech/webkit/field-file-upload`    | Field + FieldLabel + FileDropzone + FieldDescription                                                          |
| `@aziontech/webkit/field-input-group`    | Field + FieldLabel + InputGroup (Addon + InputGroupInput) + FieldDescription                                  |
| `@aziontech/webkit/field-text-switch`    | Field + FieldLabel + InputGroup (InputGroupInput + Addon with Switch) + FieldDescription                      |
| `@aziontech/webkit/field-checkbox`       | Field orientation=horizontal + Checkbox + FieldContent (FieldLabel + FieldDescription)                        |
| `@aziontech/webkit/field-radio`          | Field orientation=horizontal + RadioButton + FieldContent (FieldLabel + FieldDescription)                     |
| `@aziontech/webkit/field-switch`         | Field orientation=horizontal + Switch + FieldContent (FieldLabel + FieldDescription)                          |
| `@aziontech/webkit/field-checkbox-block` | FieldLabel wrapping Field orientation=horizontal + Checkbox + FieldContent (FieldTitle + FieldDescription)    |
| `@aziontech/webkit/field-radio-block`    | FieldLabel wrapping Field orientation=horizontal + RadioButton + FieldContent (FieldTitle + FieldDescription) |
| `@aziontech/webkit/field-switch-block`   | FieldLabel wrapping Field orientation=horizontal + Switch + FieldContent (FieldTitle + FieldDescription)      |

New pieces that came out of the old wrappers: `PhoneInput` (`@aziontech/webkit/phone-input`),
`PasswordRequirements` (`@aziontech/webkit/password-requirements`) and `InputGroup.Input`
(`@aziontech/webkit/input-group-input`). `HelperText`, `Label` and `Hint` remain.

### Page fragments are components now

Markup that every screen used to copy is now a component. Screens copied from v5 keep working; replace
the copied markup when you touch them.

| Component         | Import                               | Replaces                                                     |
| ----------------- | ------------------------------------ | ------------------------------------------------------------ |
| `PageHeader`      | `@aziontech/webkit/page-header`      | the h1 + description + actions row of every page             |
| `SectionHeader`   | `@aziontech/webkit/section-header`   | the h2 + description (+ copy-link anchor) of a section       |
| `PageTabs`        | `@aziontech/webkit/page-tabs`        | the full-bleed tab strip under a resource header (`v-model`) |
| `SettingsSection` | `@aziontech/webkit/settings-section` | a titled settings band (collapsible)                         |
| `SettingRow`      | `@aziontech/webkit/setting-row`      | one settings row: title, description, control                |
| `SaveBar`         | `@aziontech/webkit/save-bar`         | the floating or docked save / discard bar                    |
| `ConfirmDialog`   | `@aziontech/webkit/confirm-dialog`   | a confirm / discard / delete dialog                          |

The screens (blocks) that were only these fragments are gone from the catalog:
`platform/page/page-header`, `platform/page/section-header`, `platform/page/page-tabs`,
`platform/page/settings-section`, `platform/forms/setting-row` and `platform/overlays/confirm-dialog`.

### `v-model` everywhere

`Accordion`, `Tabs`, `NavigationMenu`, `CodeBlock`, `ThemeSwitcher` and `PageTabs` bind `v-model`
(`modelValue`), no longer `v-model:value`. The codemod rewrites the usual forms; check custom
`:value` / `@update:value` wiring by hand.

### Test ids

Test ids follow the component name: `feedback-message` → `feedback-alert`, `layout-divider` →
`layout-separator`, `navigation-dropdown` → `navigation-dropdown-menu`, `input-box-grid-selection` →
`input-radio-cards`, and so on for every renamed component. Update end-to-end selectors that use
`data-testid`.

### Pagination ellipsis

The `more` item of `Pagination` is now decorative (`aria-hidden`, not focusable, no `click`). Code
that listened to its click had no effect before and can be removed.

### Account blocks

The card-brand plate in the account blocks is monochrome (theme tokens instead of a fixed hex). If
you copied those blocks, copy them again or keep your version.

### Block ids

Product blocks are grouped by task: `platform/auth`, `platform/account/*`, `platform/create/*`,
`platform/view/*`, `platform/detail/*`, `platform/edit/*`, `platform/delete/*`,
`platform/settings/*`, `platform/states/*` and `platform/dashboard/*`. Blocks that did the same job
are one block whose states are variants: the drawer forms are `platform/create/create-in-drawer`,
the save strategies are `platform/settings/settings-form`, the two details pages are
`platform/detail/details-page`, the labelled delete dialog is a variant of
`platform/delete/delete-with-confirmation`, the server rejection is a variant of
`platform/states/form-validation` and the sectioned Import from Git form is a variant of
`platform/create/single-page-create`. Every old id, and every renamed state, is in
[`src/cli/migrations/v6-blocks.json`](./src/cli/migrations/v6-blocks.json); `get_pattern` still
answers an old id with the new block and a `note`. Code you already copied does not change.

### Right-to-left

Components, blocks and examples use logical utilities only, so a page under `dir="rtl"` mirrors:
`ml-`/`mr-` became `ms-`/`me-`, `pl-`/`pr-` became `ps-`/`pe-`, `left-`/`right-` became
`start-`/`end-`, `text-left`/`text-right` became `text-start`/`text-end`, `border-l`/`border-r`
became `border-s`/`border-e` and `rounded-l`/`rounded-tr`… became `rounded-s`/`rounded-se`…. The
`left-1/2 -translate-x-1/2` centering pair is the one physical form kept. Copied blocks keep working;
copy them again to get the mirrored version.

- **Lint.** The ESLint presets add `webkit/no-physical-direction` (error, autofix). Run
  `npx eslint --fix .` once to rewrite your own `ml-`/`pr-`/`left-`/`text-right` classes; it skips
  the centering pair.
- **`useDirection`.** `import { useDirection, logicalArrowKey } from '@aziontech/webkit/use-direction'`
  returns a reactive `'ltr' | 'rtl'` read from the closest `[dir]` ancestor (or `<html dir>`), and
  follows changes. Tabs, ToggleGroup, RadioCards, Slider, Pagination, NavigationMenu, Menu
  submenus, Tree, Calendar, Resizable, Carousel, QuoteTabs, Tracker and CodeBlock tabs already use
  it: under `rtl`, ArrowLeft moves to the next item.
- **Icons.** Arrows, chevrons, carets and sign-in/sign-out glyphs mirror under `rtl`
  (`@aziontech/webkit/styles` and the `icon` props of Button, IconButton, Link, Breadcrumb and
  MenuItem); external-link arrows, media controls and logos do not. Add `rtl:-scale-x-100` to a
  directional glyph you draw yourself.
- **User data.** `Input`, `Textarea`, `NumberInput` and `PasswordInput` render `dir="auto"` unless
  you pass `dir`; `CodeBlock` lines, `Kbd`, `LogView` timestamps and the `BrowserFrame` address are
  `dir="ltr"`. Snapshot tests of those components see the new attribute.
- **Theme.** The sans stack is `Rubik, 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif`,
  with Noto Sans Arabic loaded only for Arabic code points, and `:lang(ar)`, `:lang(fa)` and
  `:lang(ur)` get a taller default line height. Set `lang` with `dir`.

See the `webkit-direction` rule for the full standard.

### Devices

Components that live in panels now lay out for **their own box**, not the window, through
container queries (Tailwind v4 `@container`, the `--container-*` scale; see the theme README,
"Breakpoints and container sizes"). On a full-width page nothing moves much; inside a drawer, a
split view or a card these change:

- **Container-aware components.** `PageHeader` and `SectionHeader` drop their actions under the
  title below `@md` of the header (was: below the `md` viewport). `SaveBar` puts message and actions
  on one row from `@xl` of the bar (was: the `lg` viewport); `plain` stacks its actions below `@md`.
  `Wizard` hides its rail below `@2xl` of the wizard (was: the `md` viewport). `SettingRow` moves a
  `field` control under its copy below `@md` of the row. `Alert` moves its action to its own line,
  `EmptyState` stretches its actions and `Pagination` keeps only previous / current / next in a
  narrow box. `KeyValuePairs` picks its column count from its own width (a cell never gets narrower
  than `--container-3xs`) instead of the `md`/`lg` viewport. `Field orientation="responsive"`
  follows the nearest container (a Card, a dialog or drawer body, a `Field.Group`), not only a
  `Field.Group`. If you relied on the old viewport switch, check those screens in a drawer.
- **Containers you can use.** `Card` content (`@container/card`), the dialog and drawer body
  (`PanelContent`, `@container/panel`), `SettingsSection` body, `HelpPanel`, `ChartCard`,
  `StatTile` and `Table` (`@container/table`) are containers: `@md:` utilities in your own markup
  inside them follow that box. A `Card` used as a shrink-to-fit flex item now needs a width
  (`flex-1`, `w-full` or a grid track).
- **Stacked table.** A data-driven `Table` narrower than `--container-lg` (552 px) renders each row
  as a card of label / value lines instead of scrolling sideways. The column headers stay for
  screen readers. Set `:stackable="false"` to keep the old grid; give a column `label` when its
  header is a slot.
- **Sheets.** Below `sm` a `Dialog` or `Drawer` is a full-height, full-width sheet (it was an
  80 dvh bottom sheet, which it still is between `sm` and `md`). `PanelFooter` stretches its direct
  children to equal widths and keeps the safe-area inset clear on phones.
- **Touch and hover.** `Button`, `IconButton`, `Checkbox`, `RadioButton` and `Switch` keep their
  drawn size but get a 24 px hit area, 44 px on a coarse pointer; `Pagination` buttons grow to
  44 px on a coarse pointer. `Button` and `IconButton` render one more child, an empty
  `[data-slot=touch-target]` span; update DOM snapshots. The copy-link of `SectionHeader` and
  `SettingsSection`, the `Card` header action and the `Table` sort affordance stay visible on
  devices without hover.
- **Reflow.** `ToggleGroup`, `Calendar`, `RadioCards`, `Overline`, the `Accordion` trigger and
  `Resizable` no longer overflow a 320 px box (they truncate, wrap or clip instead). A
  `singleLine` `Overline` wraps below `sm`.

### Languages

v6 adds `WebkitProvider` (`@aziontech/webkit/webkit-provider`). Mount it once at the app root with the
user's locale:

```vue
<script setup>
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider locale="pt-BR">
    <App />
  </WebkitProvider>
</template>
```

Every built-in string (close buttons, pagination, empty states, sort state, assistive labels) now
comes from a message catalog in English, Brazilian Portuguese or Spanish, and dates, numbers, file
sizes, relative times and plurals format with `Intl` for the locale. The root carries `lang` and
`dir`; `dir` defaults to `auto`, which turns Arabic, Hebrew, Persian and Urdu right-to-left.

Without a provider nothing changes: components default to English. Label props you already pass still
win. Props whose default was an English string (`ariaLabel: 'Close'`, `confirmLabel: 'Confirm'`,
`emptyTitle: 'No data available'`, `placeholder: 'Search'`…) now default to `''` and fall back to the
catalog, so an empty string no longer removes the label; `HelpPanel.Links` `title` defaults to
`undefined` and still hides its heading when you pass `''`. The pagination line formats its numbers
(`1,200`, `1.200` in Portuguese). `useLocale()` from `@aziontech/webkit/use-locale` gives your own
components the same locale, `t()` and `Intl` helpers.

### Collections

v6 adds `useCollection` (`@aziontech/webkit/use-collection`) and three components that bind to it:
`PropertyFilter` (`@aziontech/webkit/property-filter`), `CollectionPreferences`
(`@aziontech/webkit/collection-preferences`) and `Cards` (`@aziontech/webkit/cards`). Nothing is
removed, and the codemod changes nothing here: this is the shape a list page moves to when you touch it.

A list that kept its own `search`, `filters`, `pagination` and `columnVisibility` refs, filtered `:data`
in a `computed` and rewound the page in a `watch` becomes one call:

```vue
<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { tableProps, propertyFilterProps, preferencesProps } = useCollection({
    items: rows,
    columns,
    propertyFiltering: { properties },
    pagination: { pageSize: 10 },
    preferences: { storageKey: 'resources-table' },
    url: true
  })
</script>

<template>
  <PropertyFilter v-bind="propertyFilterProps" />
  <CollectionPreferences v-bind="preferencesProps" />
  <Table v-bind="tableProps" />
</template>
```

- A server-side list passes `fetch({ filteringText, filter, sort, page, pageSize, signal })` returning
  `{ items, total }` instead of `items`, and drops its own `manualSorting` / `manualPagination` /
  `rowCount` wiring: `tableProps` sets them.
- The chip filter bar of the `webkit-lists` skill (a `{ fieldId: values[] }` state behind one Popover)
  becomes `PropertyFilter` tokens: each field is a property with `options`, each picked value a
  `property = value` token, and values of one field are combined with Match any.
- The search field beside it goes: a token without a property searches the text fields.
- `Table` keeps its API. It gains `density`, `wrapLines`, `striped`, `virtual` and
  `estimateRowHeight` (all off by default), and in the stacked layout its select-all is a visible
  checkbox above the rows instead of a screen-reader-only header cell.
- The `platform/view/table-view` block runs on `useCollection` with `PropertyFilter` and
  `CollectionPreferences`; `platform/view/card-view` is new. Copy them again through the MCP
  (`get_pattern`) to pick the change up.

## 5. Unchanged

Theme tokens (apart from the sans stack above), icons, the `init` / `doctor` / `report` / `sync` commands and the flat import style
(`@aziontech/webkit/<name>`) are the same. The AI bundle (`skills/`, `rules/`) is updated by
`npx @aziontech/webkit sync`.
