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

- import paths, including sub-components (`dropdown-trigger` → `dropdown-menu-trigger`), and the
  same paths in any other string (`vi.mock('@aziontech/webkit/…')`, `import('…')`);
- component bindings, in PascalCase and in kebab-case tags (comments keep their words);
- renamed props and prop values on those components (`v-model:value` → `v-model`, `border` →
  `bordered`, `kind="text"` → `kind="transparent"`, …);
- renamed exported types where you import them (`SeverityTagLevel` → `SeverityTagSeverity`,
  `DocCardGroupMobileCols` → `DocCardGroupMobileColumns`, `SegmentedButtonOption` →
  `ToggleGroupOption`, …; the `types` map of `src/cli/migrations/v6.json`).

It prints `MANUAL` for anything it cannot rewrite safely (section 4), and for any import that v6
does not export.

The codemod rewrites v5 code. It reads the version your `package.json` declares (or, once you have
bumped it, recognizes a v3 project by its v3-only imports such as `inputtext` or `plugin`); pass
`--from 3` or `--from 5` to say it yourself. On a v3 project it moves the native components off
their category paths (`actions/button` → `button`, `content/card-box` → `card`,
`actions/segmented-button` → `toggle-group`, …) and lists every PrimeVue-era import (`dropdown`,
`divider`, `inputtext`, `field-text`, `use-toast`, …) as `MANUAL` with its v6 replacement, since the
same path now holds a component with another API. Run it once: a second run on a v3 project lists
the paths it moved onto a name a v3 wrapper also used (`button`, `card`, `dialog`) as `MANUAL` again.

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

## 5. Field report: Azion Console

The codemod ran on a copy of `azion-console-kit` (November 2026). The console declares
`@aziontech/webkit` 3.9.4, the PrimeVue-wrapper generation, so most of what it imports changed meaning
before v6, not in it.

| Measure                                       | Count |
| --------------------------------------------- | ----: |
| Files that reference `@aziontech/webkit`      |   877 |
| Files rewritten                               |    27 |
| Rewrites (path, binding or prop)              |    52 |
| Files with at least one `MANUAL` item         |   853 |
| `MANUAL` items (one per file and import path) | 1,804 |
| Distinct import paths listed as `MANUAL`      |    79 |

What it rewrote: the native v3 components on category paths (`actions/button` in 17 files,
`actions/segmented-button` → `toggle-group` in 6, `content/card-box` → `card` in 4,
`content/currency`, `content/item`, `content/card-pricing`, `feedback/message` → `alert`,
`feedback/status-indicator`, `inputs/box-grid-selection` → `radio-cards`, `actions/icon-button`),
their bindings and tags, `kind="text"` → `kind="transparent"` on the native button, and the matching
`vi.mock` paths in tests.

`MANUAL` items by category:

| Category                                                                                    | Items | Files |
| ------------------------------------------------------------------------------------------- | ----: | ----: |
| PrimeVue services, plugin and directive (`plugin`, `use-toast`, `use-dialog`, `api`, …)     |   453 |   396 |
| Form fields (`field-text`, `field-dropdown`, `field-switch-block`, `label`, … → `Field`)    |   319 |   142 |
| Buttons (PrimeVue `button`, `button-copy`, `button-save`, …)                                |   309 |   298 |
| PrimeVue feedback and content (`inlinemessage`, `skeleton`, `prime-tag`, …)                 |   281 |   229 |
| PrimeVue inputs (`inputtext`, `dropdown` → `Select`, `inputnumber`, `multiselect`, …)       |   223 |   164 |
| PrimeVue overlays, navigation and layout (`dialog`, `tabpanel`, `overlaypanel`, `divider`…) |   192 |   163 |
| Tables (`list-data-table`, `datatable`, `column`)                                           |    25 |    20 |
| Work-in-progress components (`azion-system-status`, `testimonials-carousel`)                |     2 |     2 |

Gaps the first run showed, all fixed in the codemod:

- **Wrong rewrites.** v3 `dropdown` is the PrimeVue select, and the v5 rule turned it into
  `DropdownMenu` in 44 files; `divider` (26 files), `message` (4) and `paginator` (1) moved to v6
  components with another API. v3 projects now get `MANUAL` with the right replacement (`Select`,
  `Separator`, `Alert`, `Pagination`).
- **Comments rewritten.** Identifier renames reached comments (`PrimeVue InputText/DropdownMenu
defaults`); comments are now left alone.
- **Silent misses.** About 80 v3 paths (`inputtext`, `plugin`, `use-toast`, `field-dropdown`, …) and
  the category paths passed without a word; each now has a rewrite or a `MANUAL` hint, and any path
  v6 does not export is `MANUAL`.
- **Test mocks.** `vi.mock('@aziontech/webkit/…')` kept the old path while the import moved; every
  string that names a WebKit path is rewritten with it.
- **Sub-components of a rename into a shorter name.** `command-menu-item`, `resizable-panel-pane`
  and the other parts of `command-menu` and `resizable-panel` were taken for v6 names and never
  renamed (found by `scripts/check-migrations.mjs` against v5).
- **`import type { … }`.** The clause was read as a default import named `type`.

The console does not build after the run, as expected: the `MANUAL` list is the migration plan.

## 6. Unchanged

### Tools that read `catalog.json` directly

The MCP server, the ESLint plugin and the CLI read the new layout; this section matters only for your
own scripts that open `node_modules/@aziontech/webkit/catalog.json`. The file is now metadata only
(1.4 MB, was 7.5 MB); the source code moved next to it into `catalog/`:

| v5 field                       | v6 location                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `patterns[id].sfc`             | `catalog/patterns/<id>.json` → `sfc` (the path is in `patterns[id].file`)                               |
| `patterns[id].variants[i].sfc` | `catalog/patterns/<id>.json` → `variants[i].sfc`; `catalog.json` keeps each variant's `name`, `summary` |
| `patterns[id].guidelines`      | `catalog/patterns/<id>.json` → `guidelines`                                                             |
| `imports[subpath].examples`    | `catalog/examples/<subpath>.json` → `examples` (the path is in `imports[subpath].examplesFile`)         |

Paths in `file` and `examplesFile` are relative to the folder that holds `catalog.json`. The MCP tools
(`get_pattern`, `get_component`, `get_usage_example`) return the same answers as before.

### Performance

- `PhoneInput` loads the flag sprite (about 80 KB) with a dynamic `import()` when the country list
  first opens; until it arrives the flag boxes are blank. Bundles that include `PhoneInput` drop
  about 80 KB gzipped from the initial chunk.
- `Select`, `MultiSelect`, `LogView` and `CodeBlock` mount lists longer than 300 rows in chunks of
  100 as they scroll near view. Tests that count every rendered option, line or log row of a long
  list see only the first chunks; scroll the list, or press an arrow key in a `Select` list, which
  mounts every option.
- `Chart` keeps an even sample of at most 1,000 rows in its visually hidden data table; `tableView`
  still shows every row.

## 5. Unchanged

Theme tokens (apart from the sans stack above), icons, the `init` / `doctor` / `report` / `sync` commands and the flat import style
(`@aziontech/webkit/<name>`) are the same. The AI bundle (`skills/`, `rules/`) is updated by
`npx @aziontech/webkit sync`.
