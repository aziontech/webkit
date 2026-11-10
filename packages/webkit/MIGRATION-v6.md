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

| v5 import | v6 import | v5 component | v6 component |
| --- | --- | --- | --- |
| `@aziontech/webkit/paginator` | `@aziontech/webkit/pagination` | `Paginator` | `Pagination` |
| `@aziontech/webkit/tab-view` | `@aziontech/webkit/tabs` | `TabView` | `Tabs` |
| `@aziontech/webkit/card-box` | `@aziontech/webkit/card` | `CardBox` | `Card` |
| `@aziontech/webkit/message` | `@aziontech/webkit/alert` | `Message` | `Alert` |
| `@aziontech/webkit/divider` | `@aziontech/webkit/separator` | `Divider` | `Separator` |
| `@aziontech/webkit/progress-bar` | `@aziontech/webkit/progress` | `ProgressBar` | `Progress` |
| `@aziontech/webkit/command-menu` | `@aziontech/webkit/command` | `CommandMenu` | `Command` |
| `@aziontech/webkit/dropdown` | `@aziontech/webkit/dropdown-menu` | `Dropdown` | `DropdownMenu` |
| `@aziontech/webkit/input-text` | `@aziontech/webkit/input` | `InputText` | `Input` |
| `@aziontech/webkit/input-number` | `@aziontech/webkit/number-input` | `InputNumber` | `NumberInput` |
| `@aziontech/webkit/input-password` | `@aziontech/webkit/password-input` | `InputPassword` | `PasswordInput` |
| `@aziontech/webkit/box-grid-selection` | `@aziontech/webkit/radio-cards` | `BoxGridSelection` | `RadioCards` |
| `@aziontech/webkit/resizable-panel` | `@aziontech/webkit/resizable` | `ResizablePanel` | `Resizable` |
| `@aziontech/webkit/segmented-button` | `@aziontech/webkit/toggle-group` | `SegmentedButton` | `ToggleGroup` |

The AI tooling knows the old names too: the MCP and `catalog.json#aliases` resolve a retired or
market name (`paginator`, `message`, `modal`, `sheet`, `tiles`, `segmented-control`, …) to the v6
component.

## 3. Renamed props and values

| Component | v5 | v6 |
| --- | --- | --- |
| `accordion` | `value` | `modelValue` |
| `alert` | `severity="error"` | `severity="danger"` |
| `button` | `kind="text"` | `kind="transparent"` |
| `code-block` | `border` | `bordered` |
| `code-block` | `value` | `modelValue` |
| `doc-card` | `overline` | `eyebrow` |
| `doc-card` | `link` | `linkLabel` |
| `doc-card-group` | `mobileCols` | `mobileColumns` |
| `doc-tooltip` | `headline` | `title` |
| `doc-tooltip` | `cta` | `linkLabel` |
| `item` | `kind="outline"` | `kind="outlined"` |
| `log-view` | `border` | `bordered` |
| `log-view` | `showCopy` | `copyable` |
| `media-tabs` | `autoPlay` | `autoplay` |
| `media-tabs` | `autoPlayInterval` | `autoplayInterval` |
| `navigation-menu` | `value` | `modelValue` |
| `quote-tabs` | `autoPlay` | `autoplay` |
| `quote-tabs` | `autoPlayInterval` | `autoplayInterval` |
| `severity-tag` | `level` | `severity` |
| `shell-mockup` | `still="true"` | `animated="false"` |
| `shell-mockup` | `still="false"` | `animated="true"` |
| `table` | `border` | `bordered` |
| `tabs` | `value` | `modelValue` |
| `theme-switcher` | `value` | `modelValue` |

## 4. Manual changes

<!-- FIELD-SECTION -->

<!-- FRAGMENTS-SECTION -->

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

## 5. Unchanged

Theme tokens, icons, the `init` / `doctor` / `report` / `sync` commands and the flat import style
(`@aziontech/webkit/<name>`) are the same. The AI bundle (`skills/`, `rules/`) is updated by
`npx @aziontech/webkit sync`.
