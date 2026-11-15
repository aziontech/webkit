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
  `bordered`, `kind="outlined"` → `variant="outline"`, `<Table.Cell kind="checkbox">` →
  `<Table.Cell type="checkbox">`, …), dot-notation parts included;
- renamed exported types where you import them (`AccordionArrowPosition` → `AccordionIconPosition`,
  `DocCardGroupMobileCols` → `DocCardGroupMobileColumns`, `SegmentedButtonOption` →
  `ToggleGroupOption`, …; the `types` map of `src/cli/migrations/v6.json`);
- PrimeIcons classes, in every source file whether it imports WebKit or not: each `pi pi-<name>`
  pair becomes its Azion twin (`pi pi-check` → `ai ai-check`, `pi pi-minus-circle` →
  `ai ai-circle-minus`, `pi pi-times` → `ai ai-x`, `pi pi-twitter` → `ai ai-x-brand`; the map is
  `src/cli/migrations/v6-icons.json`). A `pi-<name>` outside a pair, and a third-party mark with no
  Azion glyph, is listed to fix by hand;
- renamed Azion icons: each `ai ai-<old>` pair takes its v6 name (`ai ai-times` → `ai ai-x`,
  `ai ai-cog` → `ai ai-settings`, `ai ai-angle-down` → `ai ai-chevron-down`), and the colored base
  class `ai-cor` becomes `ai-color` with its brand names (`ai-cor ai-next` → `ai-color ai-nextjs`).
  The v5 X mark `ai ai-x` becomes `ai ai-x-brand` only when `package.json` shows WebKit 5 (or
  `--from 5`), because `ai-x` is the close glyph in v6; otherwise it is listed to check by hand;
- theme tokens and utilities, in every `.vue`, `.ts`, `.js`, `.css`, `.scss` and `.html` file:
  `--primary-contrast` → `--primary-foreground`, `--spacing-xxs` → `--spacing-2xs`,
  `text-heading-xxs` → `text-heading-2xs`, `animate-slide-in-left` → `animate-slide-in-start`, and
  the `@aziontech/theme/texts` / `layouts` imports (the map is `src/cli/migrations/v6-tokens.json`).
  A removed token (`--line-height-*`, `.azion-dark`, …) is listed to fix by hand;
- renamed WebKit lint rule ids, in every source file (ESLint configs and `eslint-disable` comments):
  `webkit/valid-import-path` → `webkit/no-unknown-import`, … (section 4, "Lint rules renamed"; the
  map is `src/cli/migrations/v6-lint.json`).

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

| v5 import                               | v6 import                            | v5 component         | v6 component      |
| --------------------------------------- | ------------------------------------ | -------------------- | ----------------- |
| `@aziontech/webkit/paginator`           | `@aziontech/webkit/pagination`       | `Paginator`          | `Pagination`      |
| `@aziontech/webkit/tab-view`            | `@aziontech/webkit/tabs`             | `TabView`            | `Tabs`            |
| `@aziontech/webkit/card-box`            | `@aziontech/webkit/card`             | `CardBox`            | `Card`            |
| `@aziontech/webkit/message`             | `@aziontech/webkit/alert`            | `Message`            | `Alert`           |
| `@aziontech/webkit/divider`             | `@aziontech/webkit/separator`        | `Divider`            | `Separator`       |
| `@aziontech/webkit/progress-bar`        | `@aziontech/webkit/progress`         | `ProgressBar`        | `Progress`        |
| `@aziontech/webkit/command-menu`        | `@aziontech/webkit/command`          | `CommandMenu`        | `Command`         |
| `@aziontech/webkit/dropdown`            | `@aziontech/webkit/dropdown-menu`    | `Dropdown`           | `DropdownMenu`    |
| `@aziontech/webkit/input-text`          | `@aziontech/webkit/input`            | `InputText`          | `Input`           |
| `@aziontech/webkit/input-number`        | `@aziontech/webkit/number-input`     | `InputNumber`        | `NumberInput`     |
| `@aziontech/webkit/input-password`      | `@aziontech/webkit/password-input`   | `InputPassword`      | `PasswordInput`   |
| `@aziontech/webkit/box-grid-selection`  | `@aziontech/webkit/radio-group`      | `BoxGridSelection`   | `RadioGroup`      |
| `@aziontech/webkit/calendar`            | `@aziontech/webkit/date-picker`      | `Calendar`           | `DatePicker`      |
| `@aziontech/webkit/pick-list`           | `@aziontech/webkit/transfer-list`    | `PickList`           | `TransferList`    |
| `@aziontech/webkit/radio-cards`         | `@aziontech/webkit/radio-group`      | `RadioCards`         | `RadioGroup`      |
| `@aziontech/webkit/radio-button`        | `@aziontech/webkit/radio-group-item` | `RadioButton`        | `RadioGroup.Item` |
| `@aziontech/webkit/resizable-panel`     | `@aziontech/webkit/resizable`        | `ResizablePanel`     | `Resizable`       |
| `@aziontech/webkit/segmented-button`    | `@aziontech/webkit/toggle-group`     | `SegmentedButton`    | `ToggleGroup`     |
| `@aziontech/webkit/doc-pagination`      | `@aziontech/webkit/doc-prev-next`    | `DocPagination`      | `DocPrevNext`     |
| `@aziontech/webkit/cards`               | `@aziontech/webkit/card-list`        | `Cards`              | `CardList`        |
| `@aziontech/webkit/menu`                | `@aziontech/webkit/sidebar-menu`     | `Menu`               | `SidebarMenu`     |
| `@aziontech/webkit/action-confirmation` | `@aziontech/webkit/tool-approval`    | `ActionConfirmation` | `ToolApproval`    |

The AI tooling knows the old names too: the MCP and `catalog.json#aliases` resolve a retired or
market name (`paginator`, `message`, `modal`, `sheet`, `tiles`, `segmented-control`, …) to the v6
component.

Client logo files spell the brand one word per word, and the codemod rewrites their import paths:
`assets/americamovil-*` → `assets/america-movil-*`, `cocacola` → `coca-cola`, `primevideo` →
`prime-video`, `gfg` → `global-fashion-group`, `calvinklein` → `calvin-klein`, `crateandbarrel` →
`crate-and-barrel`, `gruposabemi` → `grupo-sabemi`, `lojadomecanico` → `loja-do-mecanico`,
`lojaintegrada` → `loja-integrada`, `newbalance` → `new-balance`, `omeleteco` → `omelete-co`,
`queroquero` → `quero-quero`, `rocketchat` → `rocket-chat`, `todocartoes` → `todo-cartoes`,
`getninjas` → `get-ninjas` (each `-extended-*` / `-symbol-*` file).

## 3. Renamed props and values

| Component              | v5                            | v6                        |
| ---------------------- | ----------------------------- | ------------------------- |
| `accordion`            | `value`                       | `modelValue`              |
| `alert`                | `severity="error"`            | `severity="danger"`       |
| `attribute-editor`     | `empty`                       | `emptyTitle`              |
| `badge`                | `severity=default`            | `severity=neutral`        |
| `banner-art`           | `art`, `kind`                 | `variant`                 |
| `button`               | `kind="text"`                 | `variant="ghost"`         |
| `card-pricing`         | `planTitle`                   | `title`                   |
| `checkbox`             | `inputId`                     | `id`                      |
| `code-block`           | `border`                      | `bordered`                |
| `code-block`           | `value`                       | `modelValue`              |
| `combobox`             | `emptyText`                   | `emptyTitle`              |
| `console-layout`       | `v-model:navigation-expanded` | `v-model:navigation-open` |
| `conversation-history` | `label`                       | `ariaLabel`               |
| `doc-card`             | `link`                        | `linkLabel`               |
| `doc-card`             | `overline`                    | `eyebrow`                 |
| `doc-card-group`       | `cols`                        | `columns`                 |
| `doc-card-group`       | `mobileCols`                  | `mobileColumns`           |
| `doc-heading`          | `id`                          | `anchor`                  |
| `file-token-group`     | `alignment`                   | `orientation`             |
| `item`                 | `kind="outline"`              | `variant="outline"`       |
| `log-view`             | `border`                      | `bordered`                |
| `log-view`             | `showCopy`                    | `copyable`                |
| `media-tabs`           | `autoPlayInterval`            | `autoplayInterval`        |
| `media-tabs`           | `autoPlay`                    | `autoplay`                |
| `multi-select`         | `emptyText`                   | `emptyTitle`              |
| `navigation-menu`      | `value`                       | `modelValue`              |
| `overline`             | `showCursor`                  | `cursor`                  |
| `payment-brand`        | `label`                       | `ariaLabel`               |
| `popover`              | `width`                       | `size`                    |
| `progress`             | `shape`, `kind`               | `variant`                 |
| `qr-code`              | `label`                       | `ariaLabel`               |
| `quote-tabs`           | `autoPlayInterval`            | `autoplayInterval`        |
| `quote-tabs`           | `autoPlay`                    | `autoplay`                |
| `response-branches`    | `label`                       | `ariaLabel`               |
| `severity-tag`         | `level`                       | `severity`                |
| `skeleton`             | `kind="shape"`                | `variant="rectangle"`     |
| `split-button`         | `model`                       | `items`                   |
| `table`                | `border`                      | `bordered`                |
| `tabs`                 | `value`                       | `modelValue`              |
| `textarea`             | `resizable`                   | `resize`                  |
| `theme-switcher`       | `value`                       | `modelValue`              |
| `wizard`               | `v-model:activeStep`          | `v-model`                 |

### The look is `variant`, the sort of part is `type`

Every `kind` prop is gone. Where it picked the look it is `variant` (`<Button variant="outline">`,
`ButtonVariant`, `data-variant`); where it picked which sort of part a child is, it is `type`
(`<Table.Cell type="checkbox">`, `<Pagination.Button type="next">`, `<Chart.Axis type="x">`,
`<DonutChart type="pie">`, `PaginationButtonType`, `data-type`). The look values follow the shadcn
and Supabase words, and each component keeps only the ones it draws:

| v5 / 6.0-beta value                      | v6        |
| ---------------------------------------- | --------- |
| `outlined`                               | `outline` |
| `transparent`, `text`                    | `ghost`   |
| `primary`, `secondary`, `danger`, `link` | unchanged |

`type` takes over from `kind` on `pagination-button`, `table-cell`, `table-head-cell`,
`table-filter`, `dropdown-menu-option`, `chart-axis`, `chart-bar`, `field-legend`, `helper-text`,
`donut-chart`, `spark-chart`, `code-block`, `doc-code-group`, `artifact-canvas`,
`sidebar-menu-sub-trigger` and `item-media`; every other `kind` becomes `variant`. Section props
follow suit: `titleKind` → `titleVariant` (`capability-grid`, `console-panel`, `process-scroll`,
`feature-widgets`), `quoteKind` → `quoteVariant` (`logo-wall-quote`), `rowKind` → `rowVariant`
(`article-index`). The codemod rewrites the attributes, their static values and the string
literals inside a bound `:kind="…"`, and every `*Kind` type you import (`ButtonKind` →
`ButtonVariant`, `TableCellKind` → `TableCellType`).

The codemod cannot see data objects, so rename the field by hand where you build one:

| Data                                                                  | v5 / 6.0-beta                     | v6                                   |
| --------------------------------------------------------------------- | --------------------------------- | ------------------------------------ |
| `DataTable` / `useCollection` column                                  | `kind: 'action'`                  | `type: 'action'`                     |
| `SidebarMenu` / `ConsoleLayout` / `DocLayout` navigation node         | `kind: 'drill'`                   | `type: 'drill'`                      |
| `FilterMenu` field                                                    | `kind: 'multiple'`                | `type: 'multiple'`                   |
| `HeroForm` / `JobPosting` field                                       | `kind: 'email'`                   | `type: 'email'`                      |
| `Diagram` node / group                                                | `kind: 'pill'` / `kind: 'dashed'` | `type: 'pill'` / `variant: 'dashed'` |
| section action (`primaryAction`, `secondaryAction`, audience actions) | `kind: 'outlined'`                | `variant: 'outline'`                 |
| `SiteLayout` `footer`                                                 | `kind: 'site'`                    | `variant: 'site'`                    |
| `ConfirmDialog` options of `useUnsavedChanges`                        | `kind: 'danger'`                  | `variant: 'danger'`                  |
| `SitePage` section `props`                                            | `kind: 'title-band'`              | `variant: 'title-band'`              |

### Renamed types

The codemod rewrites these where you import them, together with the component they belong to (the
types this guide names elsewhere are left out):

| v5 type                                | v6 type                                 |
| -------------------------------------- | --------------------------------------- |
| `ArticleIndexBlogAuthor`               | `ArticleIndexAuthor`                    |
| `ArticleIndexBlogEmpty`                | `ArticleIndexEmpty`                     |
| `ArticleIndexBlogMark`                 | `ArticleIndexMark`                      |
| `ArticleIndexBlogRowKind`              | `ArticleIndexRowKind`                   |
| `ArticleIndexBlogSearch`               | `ArticleIndexSearch`                    |
| `ArticleIndexResourceHubEmpty`         | `ArticleIndexEmpty`                     |
| `ArticleIndexResourceHubFacet`         | `ArticleIndexFacet`                     |
| `ArticleIndexResourceHubItem`          | `ArticleIndexItem`                      |
| `ArticleIndexResourceHubMark`          | `ArticleIndexMark`                      |
| `ArticleIndexResourceHubRowKind`       | `ArticleIndexRowKind`                   |
| `BoxGridSelectionItem`                 | `RadioGroupOption`                      |
| `CalendarMonth`                        | `DatePickerMonth`                       |
| `CalendarOrientation`                  | `DatePickerOrientation`                 |
| `CalendarProps`                        | `DatePickerProps`                       |
| `CalendarSize`                         | `DatePickerSize`                        |
| `CalendarValue`                        | `DatePickerValue`                       |
| `CardsItemSlotProps`                   | `CardListItemSlotProps`                 |
| `CardsSelectionMode`                   | `CardListSelectionMode`                 |
| `ClosingCallToActionAgentsAction`      | `ClosingCallToActionAudienceAction`     |
| `ClosingCallToActionAgentsActionKind`  | `ClosingCallToActionAudienceActionKind` |
| `ClosingCallToActionAgentsAudience`    | `ClosingCallToActionAudience`           |
| `ClosingCallToActionAgentsCopy`        | `ClosingCallToActionAudienceCopy`       |
| `ClosingCallToActionTemplatesAction`   | `TemplateGalleryAction`                 |
| `ClosingCallToActionTemplatesTemplate` | `TemplateGalleryTemplate`               |
| `CodeSplitAction`                      | `MediaSplitBandAction`                  |
| `CodeSplitActionKind`                  | `MediaSplitBandActionKind`              |
| `CollectionCardsProps`                 | `CollectionCardListProps`               |
| `CommandMenuContext`                   | `CommandContext`                        |
| `CommandMenuItemValue`                 | `CommandItemValue`                      |
| `CommandMenuRegisteredItem`            | `CommandRegisteredItem`                 |
| `CompareSupportTiersAction`            | `ComparePlansAction`                    |
| `CompareSupportTiersRow`               | `ComparePlansRow`                       |
| `CompareSupportTiersSection`           | `ComparePlansSection`                   |
| `CompareSupportTiersTier`              | `ComparePlansPlan`                      |
| `CompareSupportTiersValue`             | `ComparePlansValue`                     |
| `ContentColumnsItem`                   | `CapabilityGridItem`                    |
| `DocCardGroupCols`                     | `DocCardGroupColumns`                   |
| `DropdownContext`                      | `DropdownMenuContext`                   |
| `DropdownOptionValue`                  | `DropdownMenuOptionValue`               |
| `DropdownPlacement`                    | `DropdownMenuPlacement`                 |
| `DropdownPlacementInput`               | `DropdownMenuPlacementInput`            |
| `HeroCopyOnTopArtAction`               | `HeroBandAction`                        |
| `HeroCopyOnTopArtLevel`                | `HeroBandLevel`                         |
| `HeroCopyOnTopArtNode`                 | `HeroBandNode`                          |
| `HeroWithOpeningAction`                | `HeroBandAction`                        |
| `HeroWithOpeningItem`                  | `HeroBandItem`                          |
| `HeroWithOpeningTitleLength`           | `HeroBandTitleLength`                   |
| `InputNumberSize`                      | `NumberInputSize`                       |
| `InputPasswordAutocomplete`            | `PasswordInputAutocomplete`             |
| `InputTextSize`                        | `InputSize`                             |
| `InputTextType`                        | `InputType`                             |
| `MessageSeverity`                      | `AlertSeverity`                         |
| `MessageSize`                          | `AlertSize`                             |
| `PaginatorContext`                     | `PaginationContext`                     |
| `PickListContext`                      | `TransferListContext`                   |
| `PickListItems`                        | `TransferListItems`                     |
| `PickListSide`                         | `TransferListSide`                      |
| `PickListValue`                        | `TransferListValue`                     |
| `ProgressBarShape`                     | `ProgressKind`                          |
| `ProgressBarSize`                      | `ProgressSize`                          |
| `ResizablePanelContext`                | `ResizableContext`                      |
| `ResizablePanelOrientation`            | `ResizableOrientation`                  |
| `ResizablePanelPaneApi`                | `ResizablePaneApi`                      |
| `ResourceGridAction`                   | `CapabilityGridAction`                  |
| `ResourceGridItem`                     | `CapabilityGridItem`                    |
| `SegmentedButtonSize`                  | `ToggleGroupSize`                       |
| `StickyScrollCodeAction`               | `FeatureScrollAction`                   |
| `StickyScrollCodeActionKind`           | `FeatureScrollActionKind`               |
| `StickyScrollCodeItem`                 | `FeatureScrollItem`                     |
| `StickyScrollCodeSample`               | `FeatureScrollCode`                     |
| `TabViewContext`                       | `TabsContext`                           |
| `TabViewSlideDirection`                | `TabsSlideDirection`                    |
| `TabViewTabRegistration`               | `TabsTabRegistration`                   |
| `TabViewValue`                         | `TabsValue`                             |
| `UseCaseLinksItem`                     | `CapabilityGridItem`                    |

### Old illustration names

`Illustration` still resolves eight old scene names to the renamed scenes, so page data written
before the rename keeps rendering. Write the new name in code:

| Old `name`                                              | Use instead                    |
| ------------------------------------------------------- | ------------------------------ |
| `build-databases-from-code`                             | `sql-sdk-code-cards`           |
| `distributed-sql-for-resilient-global-reads`            | `globe-with-sql-nodes`         |
| `enable-owasp-protection-with-customizable-rules`       | `waf-threat-families-panel`    |
| `reputation-intelligence-for-enhanced-protection`       | `reputation-rings-hub`         |
| `saas-platforms`                                        | `azion-to-commerce-tiles`      |
| `stay-in-control`                                       | `traffic-and-cost-bar-chart`   |
| `stream-security-events-for-investigation-and-response` | `data-stream-destinations-map` |
| `white-gloves-when-it-matters`                          | `chat-and-headset-tiles`       |

### Naming standard: one word per concept

6.0 uses one word for each recurring concept: `status` for a job or step (`pending`, `running`, `success`, `error`, `canceled`, `skipped`), `severity` for colour meaning (`neutral`, `info`, `success`, `warning`, `danger`), `active` for the item you are on, `selected` / `selectedKeys` for picked items, `open` / `openKeys` for anything that opens, `leading` / `trailing` for adornments and in-component positions, `start` / `end` for sides and alignment. The codemod rewrites static attributes, `v-model:*`, listeners and slot templates (`#prefix` → `#leading`) on WebKit tags, including `<Root.Part>` tags; values in bound data, CSS selectors on `data-*` attributes and handlers that read event arguments need a hand edit.

#### Props and values

| Component                                                               | v5                                                                               | v6                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat-message`                                                          | `state`                                                                          | `status` (`complete` → `success`)                                                                                                                                                                                            |
| `prompt-input`                                                          | `state`                                                                          | `status` (`submitted` → `pending`)                                                                                                                                                                                           |
| `tool-approval`                                                         | `state`                                                                          | `status`                                                                                                                                                                                                                     |
| `tool-call`                                                             | `state`                                                                          | `status`                                                                                                                                                                                                                     |
| `stepper-step`                                                          | `state`                                                                          | `status` (`upcoming` → `pending`, `complete` → `success`, `loading` → `running`; the step on screen is derived and renders `data-active`)                                                                                    |
| `upload-progress`                                                       | `v-model:expanded`                                                               | `v-model:open`                                                                                                                                                                                                               |
| `topology-diagram`                                                      | `v-model:expanded`                                                               | `v-model:open-keys` (`openKeys`, `string[]`)                                                                                                                                                                                 |
| `toast-item`                                                            | `type` / `severity="default"`                                                    | `severity="neutral"`; `severity="loading"` → the `loading` boolean prop (manual)                                                                                                                                             |
| `UploadProgressItem.status`                                             | `queued` / `done`                                                                | `pending` / `success` (manual, data)                                                                                                                                                                                         |
| `LogViewStep`                                                           | `key`, `status: 'done' \| 'failed'`                                              | `id`, `status: 'success' \| 'error'` (manual, data)                                                                                                                                                                          |
| `TopologyNode`, `TopologyLevel`                                         | `key`                                                                            | `id` (manual, data); `bind` payload `{ key, value }` → `{ id, value }`                                                                                                                                                       |
| `TraceSpan.status`                                                      | `ok`                                                                             | `success` (manual, data)                                                                                                                                                                                                     |
| `toast()` store entry                                                   | `severity: 'default' \| 'loading'`                                               | `severity: 'neutral'` + `loading: true` (`toast.loading` and `toast.promise` set it)                                                                                                                                         |
| `product-widget`                                                        | `hover`                                                                          | `hovered`                                                                                                                                                                                                                    |
| `product-widget`                                                        | `interval`                                                                       | `autoplayInterval`                                                                                                                                                                                                           |
| `breadcrumb-item`                                                       | `current`                                                                        | `active`                                                                                                                                                                                                                     |
| `breadcrumb`                                                            | `items[].current`                                                                | `items[].active`                                                                                                                                                                                                             |
| `sidebar-menu-item`                                                     | `selected`                                                                       | `active`                                                                                                                                                                                                                     |
| `pagination-button`                                                     | `selected`                                                                       | `active`                                                                                                                                                                                                                     |
| `navigation-menu-list`                                                  | `highlight`                                                                      | `showHighlight`                                                                                                                                                                                                              |
| `navigation-menu-positioner`                                            | `disableAnchorTracking`                                                          | `trackAnchor` (inverted, default `true`)                                                                                                                                                                                     |
| `navigation-menu-positioner`                                            | `side="left"` / `side="right"`                                                   | `side="start"` / `side="end"`                                                                                                                                                                                                |
| `drawer`                                                                | `side="left"` / `side="right"`                                                   | `side="start"` / `side="end"` (default `end`)                                                                                                                                                                                |
| `doc-layout`                                                            | `v-model:navigation-expanded`                                                    | `v-model:navigation-open`                                                                                                                                                                                                    |
| `app-layout`                                                            | `navigationLabel`                                                                | `navigationAriaLabel`                                                                                                                                                                                                        |
| `resizable-pane`                                                        | `v-model:expanded`                                                               | `v-model:open`                                                                                                                                                                                                               |
| `doc-page-header`                                                       | `breadcrumb`                                                                     | `breadcrumbs`                                                                                                                                                                                                                |
| `doc-prev-next`                                                         | `previous.title` / `next.title`                                                  | `previous.label` / `next.label`                                                                                                                                                                                              |
| `setting-row`                                                           | `level`                                                                          | `depth`                                                                                                                                                                                                                      |
| `accordion`                                                             | `arrowPosition="left" \| "right"`                                                | `iconPosition="leading" \| "trailing"`                                                                                                                                                                                       |
| `accordion-trigger`                                                     | `level`                                                                          | `headingLevel`                                                                                                                                                                                                               |
| `code-block`                                                            | `lineNumbers`                                                                    | `showLineNumbers`                                                                                                                                                                                                            |
| `code-editor`                                                           | `lineNumbers`                                                                    | `showLineNumbers`                                                                                                                                                                                                            |
| `command-group`                                                         | `heading`                                                                        | `label`                                                                                                                                                                                                                      |
| `command-page`                                                          | `heading`                                                                        | `title`                                                                                                                                                                                                                      |
| `hint`                                                                  | `text`                                                                           | `content`                                                                                                                                                                                                                    |
| `tooltip`                                                               | `text`                                                                           | `content`                                                                                                                                                                                                                    |
| `badge`                                                                 | `severity="primary"`, `severity="secondary"`                                     | `variant="primary"`, `variant="secondary"` (manual: `severity` now takes only `neutral`, `info`, `success`, `warning`, `danger` and wins over `variant`)                                                                     |
| `chart-bar`                                                             | `labeled`                                                                        | `show-labels`                                                                                                                                                                                                                |
| `tree`                                                                  | `v-model:expanded`                                                               | `v-model:open-keys`                                                                                                                                                                                                          |
| `sidebar-menu`                                                          | `v-model:expanded`                                                               | `v-model:open-keys` (`openKeys`, `string[]`)                                                                                                                                                                                 |
| `tree`                                                                  | `v-model:selected-ids`                                                           | `v-model:selected-keys`                                                                                                                                                                                                      |
| `card-list`                                                             | `track-by`                                                                       | `item-key`                                                                                                                                                                                                                   |
| `card-list`                                                             | `selection-mode="multi"`                                                         | `selection-mode="multiple"`                                                                                                                                                                                                  |
| `transfer-list`                                                         | `data-key` (v5 `PickList`)                                                       | `item-key`                                                                                                                                                                                                                   |
| `property-filter`                                                       | `hide-operations`                                                                | `:show-operations="false"` (default `true`)                                                                                                                                                                                  |
| `data-table`                                                            | `enable-sorting`                                                                 | `sortable`                                                                                                                                                                                                                   |
| `data-table`                                                            | `enable-row-selection`                                                           | `selectable`                                                                                                                                                                                                                 |
| `data-table`                                                            | column `enableSorting` (`TableColumn`)                                           | column `sortable`                                                                                                                                                                                                            |
| `data-grid`                                                             | `enable-row-selection`                                                           | `selectable`                                                                                                                                                                                                                 |
| `table-sort-button`                                                     | `direction`                                                                      | `sort-direction`                                                                                                                                                                                                             |
| `table-sort-button`                                                     | `visible`                                                                        | removed: `class="invisible"` hides it and keeps its space                                                                                                                                                                    |
| `use-collection`                                                        | `selection: { mode: 'multi' }`                                                   | `selection: { mode: 'multiple' }` (manual; `cardListProps` binds `itemKey`, `tableProps` binds `selectable`)                                                                                                                 |
| `filter-menu`                                                           | field `kind: 'multi'`                                                            | field `type: 'multiple'` (manual)                                                                                                                                                                                            |
| `tag`                                                                   | `severity="primary"`, `"accent"`, `"contrast"`, `"highlight"`                    | `variant="primary"` (and `accent`, `contrast`, `highlight`); `severity` now takes only `neutral`, `info`, `success`, `warning`, `danger` and wins over `variant`                                                             |
| `tag`                                                                   | a bound `:severity` that can hold `primary`, `accent`, `contrast` or `highlight` | MANUAL: split the data into a `variant` field (brand look) and a `severity` field (status) and bind both (`:variant="x.variant" :severity="x.severity"`); `TagSeverity` is now only the status scale, `TagVariant` the looks |
| `badge`                                                                 | a bound `:severity` that can hold `primary` or `secondary`                       | MANUAL: same split as `Tag`                                                                                                                                                                                                  |
| `card`                                                                  | badge `{ label, severity: 'primary' }`                                           | MANUAL in data: `{ label, variant: 'primary' }`; `CardBadge` takes `variant?` and `severity?`                                                                                                                                |
| `sidebar-menu-item`                                                     | `tag-severity="primary"`, `tag-severity="accent"`                                | `tag-variant="primary"`, `tag-variant="accent"`; `tagSeverity` takes the status scale and wins; with neither the tag is `info`                                                                                               |
| `architecture-tabs`                                                     | `position="left" \| "right"`                                                     | `tabs-side="start" \| "end"`                                                                                                                                                                                                 |
| `article-body`                                                          | `trail[].current`                                                                | `trail[].active`                                                                                                                                                                                                             |
| `article-cards`                                                         | `kind="left" \| "centered"`                                                      | `variant="start" \| "center"`                                                                                                                                                                                                |
| `article-cards`                                                         | `items[].key`, `items[].external`                                                | `items[].id`, `items[].target="_blank"`                                                                                                                                                                                      |
| `article-index`                                                         | `categoryLabel`                                                                  | `categoryAriaLabel`                                                                                                                                                                                                          |
| `article-index`                                                         | `search="{ placeholder, label }"`                                                | `searchPlaceholder`, `searchAriaLabel`                                                                                                                                                                                       |
| `article-index`                                                         | `empty="{ title, description, action }"`                                         | `emptyTitle`, `emptyDescription`, `emptyActionLabel`                                                                                                                                                                         |
| `article-index`                                                         | `rowKind="centered"`                                                             | `rowKind="center"`                                                                                                                                                                                                           |
| `article-index`                                                         | `items[].key`, `facets[].key`, `items[].external`                                | `items[].id`, `facets[].id`, `items[].target="_blank"`                                                                                                                                                                       |
| `capability-grid`, `console-panel`, `feature-widgets`, `process-scroll` | `titleKind="centered" \| "left" \| "horizontal"`                                 | `titleKind="center" \| "start" \| "split"`                                                                                                                                                                                   |
| `card-pricing`                                                          | `slotPosition`                                                                   | `actionsPosition`                                                                                                                                                                                                            |
| `card-pricing`                                                          | `aligned`                                                                        | `equalHeight`                                                                                                                                                                                                                |
| `closing-call-to-action-newsletter`                                     | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `conversation`                                                          | `alignment`                                                                      | `layout`                                                                                                                                                                                                                     |
| `hero`                                                                  | `align="top" \| "bottom"`                                                        | `align="start" \| "end"`                                                                                                                                                                                                     |
| `hero-band`                                                             | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-band`                                                             | `kind="centered" \| "centered-band"`                                             | `variant="center" \| "center-band"`                                                                                                                                                                                          |
| `hero-form`                                                             | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-form`                                                             | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `hero-title`                                                            | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-title`                                                            | `centered`                                                                       | `align="center"`                                                                                                                                                                                                             |
| `hero-title`                                                            | `mobileCentered`                                                                 | `mobileAlign="center"`                                                                                                                                                                                                       |
| `job-posting`                                                           | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `listing-browser`                                                       | `rows`                                                                           | `data`                                                                                                                                                                                                                       |
| `listing-browser`                                                       | `search="{ placeholder, shortPlaceholder, label }"`                              | `searchPlaceholder`, `searchShortPlaceholder`, `searchAriaLabel`                                                                                                                                                             |
| `listing-browser`                                                       | `empty="{ title, description, clearLabel }"`                                     | `emptyTitle`, `emptyDescription`, `emptyActionLabel`                                                                                                                                                                         |
| `listing-browser`                                                       | `facets[].key`                                                                   | `facets[].id`                                                                                                                                                                                                                |
| `listing-table`                                                         | `rows`                                                                           | `data`                                                                                                                                                                                                                       |
| `media-split`                                                           | `align="top"`                                                                    | `align="start"`                                                                                                                                                                                                              |
| `media-tabs`                                                            | `position="left" \| "right"`                                                     | `tabs-side="start" \| "end"`                                                                                                                                                                                                 |
| `network-section`                                                       | `lead`                                                                           | `claimsEyebrow`                                                                                                                                                                                                              |
| `section-module`                                                        | `kind="centered" \| "left" \| "horizontal"`                                      | `variant="center" \| "start" \| "split"`                                                                                                                                                                                     |
| `section-title`                                                         | `kind="centered" \| "left" \| "horizontal"`                                      | `variant="center" \| "start" \| "split"`                                                                                                                                                                                     |
| `site-footer`                                                           | `columns[].links[].external`                                                     | `columns[].links[].target="_blank"`                                                                                                                                                                                          |
| `story-library`                                                         | `search="{ placeholder, shortPlaceholder, label }"`                              | `searchPlaceholder`, `searchShortPlaceholder`, `searchAriaLabel`                                                                                                                                                             |
| `story-library`                                                         | `empty="{ title, action }"`                                                      | `emptyTitle`, `emptyActionLabel`                                                                                                                                                                                             |
| `story-library`                                                         | `items[].key`, `facets[].key`, `items[].external`                                | `items[].id`, `facets[].id`, `items[].target="_blank"`                                                                                                                                                                       |

#### Slots

| Component              | v5                   | v6                                                                 |
| ---------------------- | -------------------- | ------------------------------------------------------------------ |
| `log-view-header`      | `#left`, `#right`    | `#start`, `#end` (test ids `__left`/`__right` → `__start`/`__end`) |
| `console-layout`       | `#header-start`      | `#header-leading`                                                  |
| `page-header`          | `#breadcrumb`        | `#breadcrumbs`                                                     |
| `doc-page-header`      | `#breadcrumb`        | `#breadcrumbs`                                                     |
| `dropdown-menu`        | `#top` / `#bottom`   | `#header` / `#footer`                                              |
| `dropdown-menu-group`  | `#top` / `#bottom`   | `#header` / `#footer`                                              |
| `alert`                | `#action`            | `#actions`                                                         |
| `button`               | `#prefix`            | `#leading`                                                         |
| `card`                 | `#action`            | `#actions`                                                         |
| `card`                 | `#header-action`     | `#header-actions`                                                  |
| `card`                 | `#content`           | the default slot                                                   |
| `command-item`         | `#prefix`, `#suffix` | `#leading`, `#trailing`                                            |
| `input`                | `#prefix`, `#suffix` | `#leading`, `#trailing`                                            |
| `multi-select-option`  | `#left`              | `#leading`                                                         |
| `multi-select-trigger` | `#prefix`            | `#leading`                                                         |
| `number-input`         | `#prefix`, `#suffix` | `#leading`, `#trailing`                                            |
| `password-input`       | `#prefix`, `#suffix` | `#leading`, `#trailing`                                            |
| `select-option`        | `#left`              | `#leading`                                                         |
| `select-trigger`       | `#prefix`            | `#leading`                                                         |

#### Events

| Component                 | v5                     | v6                    |
| ------------------------- | ---------------------- | --------------------- |
| `tutorial-panel-provider` | `finish`               | `complete`            |
| `navigation-menu`         | `open-change-complete` | `open-transition-end` |
| `doc-page-header`         | `meta-action`          | `action-click`        |
| `code-editor`             | `validate`             | `markers-change`      |
| `phone-input`             | `update:phone`         | `phone-change`        |
| `tree`                    | `item-dblclick`        | `item-double-click`   |
| `data-grid`               | `row-delete`           | `row-remove`          |
| `table-sort-button`       | `toggle`               | `sort`                |
| `sticky-stack`            | `index-change`         | `active-index-change` |

#### Event payloads (handlers that read the arguments need a hand edit)

| Component                | Event                     | v5 payload                       | v6 payload                                                                                                           |
| ------------------------ | ------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `TutorialPanel.Provider` | `start`, `exit`, `finish` | `(id)`                           | `(event, id)` (`finish` is now `complete`)                                                                           |
| `ButtonGroup`            | `toggle`                  | `({ id, pressed })`              | `(event, { id, pressed })`                                                                                           |
| `Alert`                  | `close`                   | `(event?)` (none after `life`)   | `(event)` (an `Event` of type `timeout` after `life`)                                                                |
| `ErrorBoundary`          | `retry`                   | `(event?)` (none for `resetKey`) | `(event)` (`retry` Event when the slot passes none, `reset` Event for `resetKey`)                                    |
| `DataTable`              | `reorder`                 | `(payload)`                      | `(event, payload)`                                                                                                   |
| `Board`                  | `item-move`               | `(payload)`                      | `(event, payload)`                                                                                                   |
| `Board`                  | `item-resize`             | `(payload)`                      | `(event, payload)`                                                                                                   |
| `TransferList`           | `move`                    | `(payload)`                      | `(event, payload)`; the slot and exposed `move(event, direction)` / `moveAll(event, direction)` take the event first |
| `DataTable`              | `refresh`                 | `()`                             | `(event)`: the Table.RefreshButton click, or `new Event('refresh')` from `reload()`                                  |
| `DataTable`              | `export`                  | `(rows)`                         | `(event, rows)`: the Table.Export click, or `new Event('export')` from `exportCsv()`                                 |
| `DataTable`              | `load-more`               | `()`                             | `(event)`: the Load more click, or `new Event('load-more')` when the end of the rows nears the viewport              |

#### Types and data fields (a hand edit where the codemod cannot see the data)

| Component                                                                                                                           | v5                                                                                                                  | v6                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `use-collection`                                                                                                                    | option `trackBy`                                                                                                    | option `itemKey` (manual)                                                                       |
| `ChatMessageState`                                                                                                                  | `ChatMessageStatus`                                                                                                 |
| `PromptInputState`                                                                                                                  | `PromptInputStatus`                                                                                                 |
| `ToolApprovalState`                                                                                                                 | `ToolApprovalStatus`                                                                                                |
| `ToolCallState`                                                                                                                     | `ToolCallStatus`                                                                                                    |
| `StepperStepState`                                                                                                                  | `StepperStepStatus`                                                                                                 |
| `ToastSeverity`                                                                                                                     | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` (no `default`, no `loading`)                            |
| `UploadProgressStatus`                                                                                                              | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled'`                                                      |
| `LogViewStepStatus`                                                                                                                 | `'success' \| 'running' \| 'error' \| 'skipped' \| 'pending'`                                                       |
| `TraceSpanStatus`                                                                                                                   | `'success' \| 'error' \| 'running'`                                                                                 |
| `setting-row`                                                                                                                       | `SettingRowLevel`                                                                                                   | `SettingRowDepth`                                                                               |
| `navigation-menu`                                                                                                                   | `NavigationMenuSide` `'top' \| 'right' \| 'bottom' \| 'left'`                                                       | `'top' \| 'end' \| 'bottom' \| 'start'`                                                         |
| `drawer`                                                                                                                            | `DrawerSide` `'left' \| 'right'`                                                                                    | `'start' \| 'end'`                                                                              |
| `doc-prev-next`                                                                                                                     | `DocPageLink.title`                                                                                                 | `DocPageLink.label`                                                                             |
| `AccordionArrowPosition`                                                                                                            | `AccordionIconPosition`                                                                                             |
| `tag`                                                                                                                               | `TagSeverity` (status scale plus looks)                                                                             | `TagSeverity` (status scale only) + `TagVariant` (`primary`, `accent`, `contrast`, `highlight`) |
| `card`                                                                                                                              | `CardBadgeSeverity` (with looks)                                                                                    | `CardBadgeSeverity` + `CardBadgeVariant`                                                        |
| `sidebar-menu`                                                                                                                      | `SidebarMenuItemTagSeverity` (with `primary`, `accent`)                                                             | `SidebarMenuItemTagSeverity` (status) + `SidebarMenuItemTagVariant` (`primary`, `accent`)       |
| `severity-tag`                                                                                                                      | `SeverityTagSeverity`                                                                                               | `SeverityTagLevel` (the v5 name stays)                                                          |
| `table`                                                                                                                             | `TableColumn.enableSorting`                                                                                         | `TableColumn.sortable`                                                                          |
| `data-table`                                                                                                                        | `sorting`, `rowSelection`, `columnVisibility`, `globalFilter`, `pagination`, `filters`, `state`, `expanded`, `data` | unchanged names, now `defineModel` (same `v-model:*` contract)                                  |
| `CardPricingSlotPosition`                                                                                                           | `CardPricingActionsPosition`                                                                                        |
| `ConversationAlignment`                                                                                                             | `ConversationLayout`                                                                                                |
| `MediaTabsPosition`                                                                                                                 | `MediaTabsSide`                                                                                                     |
| `ArchitectureTabsPosition`                                                                                                          | `ArchitectureTabsSide`                                                                                              |
| `HeroTitleAlign`                                                                                                                    | new                                                                                                                 |
| `ArticleIndexSearch`, `ArticleIndexEmpty`, `ListingBrowserSearch`, `ListingBrowserEmpty`, `StoryLibrarySearch`, `StoryLibraryEmpty` | removed (flat props)                                                                                                |

#### Data attributes and test ids (update CSS selectors and tests by hand)

| Component                                                       | v5                                                                                                  | v6                                                                                                             |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `chat-message`, `prompt-input`, `tool-approval`, `tool-call`    | `data-status` mirrors `state`                                                                       | `data-status` mirrors `status`                                                                                 |
| `stepper-step`                                                  | `data-state="upcoming\|current\|complete\|error\|loading"`                                          | `data-status` + `data-active` (+ `data-completed`)                                                             |
| `stepper`                                                       | `data-current`                                                                                      | `data-active`                                                                                                  |
| `stepper-step`                                                  | `data-step-dot`, `data-step-disc`, `data-step-description`, `data-step-connector`, `data-step-body` | `data-slot="step-dot"` … `data-slot="step-body"`                                                               |
| `upload-progress`                                               | `data-state="running\|done\|failed"`, `data-collapsed`                                              | `data-status="running\|success\|error"`, `data-state="open\|closed"`                                           |
| `trace`                                                         | `data-tone="root\|ok\|error\|running"`                                                              | `data-status="success\|error\|running"` + `data-root`                                                          |
| `log-view`                                                      | `data-border`                                                                                       | `data-bordered`                                                                                                |
| `ai-loading`                                                    | `data-visible`                                                                                      | `data-state="open\|closed"`                                                                                    |
| `toaster` region                                                | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                    |
| `toast-item`                                                    | `data-severity="loading"`                                                                           | `data-loading` (+ `aria-busy`)                                                                                 |
| `tutorial-panel` step row                                       | `data-tutorial-step`                                                                                | `data-slot="tutorial-step"`                                                                                    |
| `breadcrumb-item`                                               | `data-current`                                                                                      | `data-active`                                                                                                  |
| `sidebar-menu-item`                                             | `data-selected`                                                                                     | `data-active`                                                                                                  |
| `pagination-button`                                             | `data-selected`                                                                                     | `data-active`                                                                                                  |
| `hotspot`                                                       | `data-active` (marker shown) / `data-current` (current step)                                        | `data-marker` / `data-active`                                                                                  |
| `navigation-menu` (root, list, icon, content, popup, backdrop)  | `data-open` / `data-closed`                                                                         | `data-state="open\|closed"`                                                                                    |
| `navigation-menu-positioner`, `navigation-menu-arrow`           | `data-side="left\|right"`                                                                           | `data-side="start\|end"`                                                                                       |
| `drawer-content`                                                | `data-side="left\|right"`                                                                           | `data-side="start\|end"`                                                                                       |
| `sidebar`                                                       | `data-collapsed`                                                                                    | `data-state="open\|closed"`                                                                                    |
| `resizable-pane`                                                | `data-collapsed`                                                                                    | `data-state="open\|closed"`                                                                                    |
| `settings-section` (body)                                       | `data-open`                                                                                         | `data-state="open\|closed"`                                                                                    |
| `doc-prompt` (prompt text)                                      | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                    |
| `setting-row`                                                   | `data-level`                                                                                        | `data-depth`                                                                                                   |
| `page-header`                                                   | `__breadcrumb` test id                                                                              | `__breadcrumbs`                                                                                                |
| `dropdown-menu`, `dropdown-menu-group`                          | `__top` / `__bottom` test ids                                                                       | `__header` / `__footer`                                                                                        |
| `alert`                                                         | `data-slot="alert-action"`                                                                          | `data-slot="alert-actions"`                                                                                    |
| `accordion`                                                     | `data-arrow="left\|right"`                                                                          | `data-icon-position="leading\|trailing"`                                                                       |
| `button`, `icon-button`, `highlight-button`                     | `data-inactive`                                                                                     | `data-inert`                                                                                                   |
| `button-group`                                                  | `data-button-group-item="<id>"`                                                                     | `data-slot="button-group-item"` + `data-id="<id>"`                                                             |
| `chip`                                                          | `data-chip-body`                                                                                    | `data-slot="chip-body"`                                                                                        |
| `code-block`                                                    | `data-border`                                                                                       | `data-bordered`                                                                                                |
| `code-block`                                                    | `data-side="left\|right"` (split diff)                                                              | `data-side="start\|end"`                                                                                       |
| `copy-button`                                                   | `data-state="default"`                                                                              | `data-state="idle"`                                                                                            |
| `date-range-picker`                                             | `data-part="trigger"`                                                                               | `data-slot="date-range-picker-trigger"`                                                                        |
| `file-token-group`                                              | `data-file-token-remove`                                                                            | `data-slot="file-token-remove"`                                                                                |
| `input`, `password-input`                                       | `data-has-icon-left`, `data-has-icon-right`                                                         | `data-leading`, `data-trailing`                                                                                |
| `password-input`                                                | `data-visible`                                                                                      | `data-revealed`                                                                                                |
| `card`                                                          | test id `__header-action`, `__action`                                                               | `__header-actions`, `__actions`                                                                                |
| `command-item`                                                  | test id `__prefix`                                                                                  | `__leading`                                                                                                    |
| `command-group`                                                 | test id `__heading`                                                                                 | `__label`                                                                                                      |
| `tag`, `badge`                                                  | `data-severity` with a brand look                                                                   | `data-variant` (`data-severity` only for the status scale)                                                     |
| `table`, `data-table`                                           | `data-border`                                                                                       | `data-bordered`                                                                                                |
| `tree`                                                          | `data-tree-row`, `data-tree-cell`, `data-tree-toggle`, `data-tree-rename`, `data-tree-actions`      | `data-slot="tree-row"` (and `tree-cell`, `tree-toggle`, `tree-rename`, `tree-actions`)                         |
| `data-table`                                                    | `data-tree-gutter`, `data-reorder-cell`                                                             | `data-slot="tree-gutter"`, `data-slot="reorder-cell"`                                                          |
| `filter-menu`                                                   | `data-picked`                                                                                       | `data-selected`                                                                                                |
| `flow`                                                          | `data-flow-kind`, `data-flow-branches`, `data-flow-port`, `data-flow-anchor`                        | `data-slot="flow-node"` / `flow-parallel` / `flow-branches` / `flow-port` / `flow-anchor`, side in `data-side` |
| `tracker`                                                       | readout `data-visible`                                                                              | readout `data-state="open                                                                                      | closed"` |
| `table-sort-button`                                             | `data-direction`, `data-visible`                                                                    | `data-sort`                                                                                                    |
| `card-pricing`                                                  | `data-slot-position`, `data-aligned`                                                                | `data-actions-position`, `data-equal-height`                                                                   |
| `closing-call-to-action-newsletter`, `hero-form`, `job-posting` | `data-error`                                                                                        | `data-failed`                                                                                                  |
| `conversation`                                                  | `data-alignment` (root)                                                                             | `data-layout`                                                                                                  |
| `hero-title`                                                    | `data-centered`, `data-mobile-centered`                                                             | `data-align`, `data-mobile-align`                                                                              |
| `listing-browser`, `story-library` (filter panel)               | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                    |
| `media-tabs`                                                    | `data-position`                                                                                     | `data-tabs-side`                                                                                               |
| `quote` (highlighted phrase)                                    | `data-highlight`                                                                                    | `data-slot="highlight"`                                                                                        |
| `sticky-stack`                                                  | `data-complete`                                                                                     | `data-completed`                                                                                               |

## 4. Manual changes

### Icons: the Azion set replaces PrimeIcons, with Lucide names

Every WebKit component, default `icon` and example now draws `ai ai-<name>` from `@aziontech/icons`;
no component renders a PrimeIcons (`pi pi-*`) class, and `@aziontech/icons` no longer ships the
PrimeIcons font or its `@aziontech/icons/primeicons` entry. If your app still renders one of the
third-party marks the codemod lists (`pi-apple`, `pi-paypal`, …), draw your own SVG or install the
`primeicons` package.

The Azion glyphs take the [Lucide](https://lucide.dev/icons) names, and `migrate v6` rewrites them
(every pair is in the `azionicons` and `color` maps of `src/cli/migrations/v6-icons.json`):

- close and status: `ai-times` → `ai-x`, `ai-times-circle` → `ai-circle-x`, `ai-check-circle` →
  `ai-circle-check`, `ai-info-circle` → `ai-circle-info`, `ai-question-circle` → `ai-circle-help`,
  `ai-exclamation-circle` → `ai-circle-alert`, `ai-exclamation-triangle` → `ai-triangle-alert`,
  `ai-check-square` → `ai-square-check`; every `ai-<x>-circle` is `ai-circle-<x>`
  (`ai-plus-circle` → `ai-circle-plus`, `ai-arrow-circle-up` → `ai-circle-arrow-up`, …);
- Font Awesome words: `ai-bars` → `ai-menu`, `ai-cog` → `ai-settings`, `ai-th-large` and
  `ai-objects-column` → `ai-layout-grid`, `ai-ellipsis-h` / `-v` → `ai-ellipsis` /
  `ai-ellipsis-vertical`, `ai-sliders-h` / `-v` → `ai-sliders-horizontal` / `-vertical`,
  `ai-arrows-h` / `-v` / `-alt` → `ai-move-horizontal` / `ai-move-vertical` / `ai-move`,
  `ai-share-alt` → `ai-share`, `ai-directions-alt` → `ai-signpost`, `ai-map-marker` →
  `ai-map-pin`, `ai-sign-in` / `-out` → `ai-log-in` / `ai-log-out`, `ai-pen-to-square` →
  `ai-square-pen`, `ai-user-edit` → `ai-user-pen`, `ai-file-edit` → `ai-file-pen`,
  `ai-envelope` → `ai-mail`, `ai-hashtag` → `ai-hash`, `ai-thumbtack` → `ai-pin`,
  `ai-search-plus` / `-minus` → `ai-zoom-in` / `ai-zoom-out`, `ai-calendar-times` →
  `ai-calendar-x`, `ai-arrow-right-arrow-left` → `ai-arrow-right-left`, the two long
  `ai-arrow-…-center` names → `ai-minimize` / `ai-maximize`;
- `-slash` is `-off`: `ai-eye-off`, `ai-bell-off`, `ai-filter-off`, `ai-sort-off`;
- one glyph, one name: `ai-angle-*` → `ai-chevron-*`, `ai-angle-double-*` → `ai-chevrons-*`,
  `ai-file-o` → `ai-file`, `ai-filter-alt` → `ai-filter`, `ai-sort-alt` → `ai-sort`,
  `ai-sort-up` / `-down` → `ai-arrow-up` / `ai-arrow-down`, `ai-clone` → `ai-copy`, `ai-branch`
  → `ai-git-branch`, `ai-unlock` → `ai-lock-open`, `ai-step-backward-alt` / `ai-step-forward-alt`
  → `ai-fast-backward` / `ai-fast-forward`, `ai-step-backward` → `ai-step-back`;
- sort order in the name: `ai-sort-alpha-down` → `ai-arrow-down-a-z` (`-alt` → `ai-arrow-down-z-a`),
  `ai-sort-numeric-down` → `ai-arrow-down-0-1`, `ai-sort-amount-down` → `ai-arrow-down-wide-narrow`,
  and the same for `-up`;
- spelling and brands: `ai-pratices-review` → `ai-practices-review`, `ai-scizors` → `ai-scissors`,
  `ai-open` → `ai-openai`, `ai-next` → `ai-nextjs`, `ai-mcp-logo` → `ai-mcp`, the X mark `ai-x` →
  `ai-x-brand`;
- colored icons: the base class `ai-cor` is `ai-color` (`<i class="ai-color ai-google">`), and
  `ai-open`, `ai-next`, `ai-js`, `ai-ts`, `ai-azuredevops`, `ai-x` are `ai-openai`, `ai-nextjs`,
  `ai-javascript`, `ai-typescript`, `ai-azure-devops`, `ai-x-brand`.

The brand mark `workers-cloudflare` (`Ticker` `marks`, `QuoteTabs` `mark`, `ClientQuotes` `mark`,
`HeroBand` `carouselMarks`) is `cloudflare-workers`; rename the string by hand.

The RTL mirror of `@aziontech/webkit/styles` targets the `ai` names (`ai-chevron-left`,
`ai-arrow-right`, `ai-log-out`, …).

### `@aziontech/theme` is a peer dependency

v5 listed `@aziontech/theme@^4` as a dependency, so an app on theme 5 got a second, nested theme
copy under `@aziontech/webkit/node_modules`. v6 declares it as a peer (`^5.2.2`): install it next to
WebKit (`npm install @aziontech/theme@^5.2.2`; `npx @aziontech/webkit init` adds it). `webkit doctor`
fails when a nested copy is left or the installed theme misses the range. `init` now writes caret
ranges for every dependency it adds, never `latest`. The `@aziontech/icons` peer accepts
`^4.4.0 || ^5.0.0`, so the icons major that drops PrimeIcons from its default entry installs as is.

### Theme: dark mode follows the device, fonts are a separate import, unused variables are gone

The theme that ships with WebKit 6 changes three things your app can see:

- **Dark mode follows the device.** With no theme pinned, a user whose device is set to dark now gets
  the dark tokens (before, a page without `data-theme` was always light). It is CSS only, so there is
  no flash. An app that never checked its screens in dark keeps the old look with one attribute:
  `<html data-theme="light">`. `data-theme="dark"` pins dark; `ThemeSwitcher` and `useColorMode()`
  already default to `system`.
- **Fonts are their own file.** `@import '@aziontech/theme'` no longer loads the Azion fonts from
  `fonts.azion.com`. Add `@import '@aziontech/theme/fonts.css';` next to it (or
  `import '@aziontech/theme/fonts.css'` in `main.ts`) to keep them; leave it out if your app hosts its
  own fonts. `npx @aziontech/webkit init` writes the line.
- **Removed variables** (nothing in WebKit read them). Replace any use in your own CSS:

  | Removed                                            | Use instead                                                                     |
  | -------------------------------------------------- | ------------------------------------------------------------------------------- |
  | `--surface-0` … `--surface-950`                    | a semantic role (`--bg-surface`, `--border-default`…) or `--color-gray-<step>`  |
  | `--color-surface-*` (and `bg-surface-*` utilities) | the same step of `--color-gray-*` (`--color-surface-0` is `--color-base-white`) |
  | `--height-<n>`                                     | `h-<n>` or `calc(var(--spacing) * <n>)`                                         |
  | `--width-3xs` … `--width-7xl`                      | `--container-3xs` … `--container-7xl`                                           |
  | `--z-input-popup`                                  | `--z-control-overlay`                                                           |
  | `surfacePrimitives` (`@aziontech/theme/colors`)    | `primitives.gray`                                                               |

- **Renamed tokens** (same values; `webkit migrate` rewrites them in `.vue`, `.css`, `.scss`, `.html`,
  `.ts` and `.js` files, from `src/cli/migrations/v6-tokens.json`):

  | Old                                                                                                                         | New                                                             |
  | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
  | `--<role>-contrast` (primary, secondary, accent, success, warning, danger, info) and `bg-`/`text-`/`border-<role>-contrast` | `--<role>-foreground`, `bg-`/`text-`/`border-<role>-foreground` |
  | `--spacing-xxs`, `--spacing-xxl`                                                                                            | `--spacing-2xs`, `--spacing-2xl`                                |
  | `text-heading-xxs`, `text-body-xxs`                                                                                         | `text-heading-2xs`, `text-body-2xs`                             |
  | `--code-sintax-*`                                                                                                           | `--code-syntax-*`                                               |
  | `--border-0` … `--border-4` (widths)                                                                                        | `--border-width-0` … `--border-width-4`                         |
  | `--shape-elements`                                                                                                          | `--shape-control`                                               |
  | `--z-input-field`, `--z-input-overlay`                                                                                      | `--z-control`, `--z-control-overlay`                            |
  | `animate-slide-in-left`, `-out-left`, `-in-right`, `-out-right`                                                             | `animate-slide-in-start`, `-out-start`, `-in-end`, `-out-end`   |
  | `@aziontech/theme/texts` (`textsData`)                                                                                      | `@aziontech/theme/typography` (`typography`)                    |
  | `@aziontech/theme/layouts` (`layoutsData`, `layoutsUtilities`)                                                              | `@aziontech/theme/layout` (`layout`, `layoutUtilities`)         |

  The slide animations now flip in right-to-left pages, so drop any `rtl:` class that swapped them by
  hand (the codemod warns). `--bg-contrast` / `--text-contrast` keep their names.

- **Also removed:** `--line-height-*` (use `--leading-*` or a `rem` length), `--container-px`,
  `--container-py`, `--container-max-width` and the `.px-container`, `.py-container`,
  `.max-container-width` helpers (use the `--layout-*` tokens and `layout-column*` utilities), and
  the `.azion.azion-light` / `.azion.azion-dark` theme classes (set `data-theme` on `<html>`; `.dark`
  still works). The stylesheet moved from `dist/v4/` to `dist/`: import `@aziontech/theme` and
  `@aziontech/theme/fonts.css`, never a `dist/` path.

Two additions need nothing from you: `--border-input` is the outline token of every form field (same
value as `--border-default`), and dark mode has its own, visible elevation shadows (`--shadow-*`).

### TypeScript reads declarations

Every `@aziontech/webkit/<name>` export now has a `types` condition that points at a declaration
under `types/` (`{ "types": "./types/…/x.vue.d.ts", "default": "./src/…/x.vue" }`), so a fresh
Vite `vue-ts` app builds with its default `vue-tsc -b && vite build`: no more TS2307 on a `.vue`
export, and no WebKit source in your program, so `skipLibCheck` covers WebKit and your compiler
options never type-check it. `@aziontech/theme` and `@aziontech/icons` declare their CSS entries
the same way. Remove any local `declare module '@aziontech/webkit/…'` or
`declare module '@aziontech/icons'` shim you added as a workaround. Bundlers still load the `.vue`
and `.ts` sources (`default`).

Keep `vue-tsc` off 3.3.14: that release types every template expression after a static attribute
containing `//` on a component (`href="https://…"`) as a ref ("Property 'value' does not exist").
`webkit init` pins `vue-tsc` to 3.3.13 when your range admits 3.3.14, and `webkit doctor` warns
when 3.3.14 is installed.

### `vee-validate` is no longer a dependency; `@aziontech/webkit/vite` is removed

Nothing in WebKit imports `vee-validate`, so v6 drops it from `dependencies`. An app that uses it
installs it itself (`npm install vee-validate@^4`). `@aziontech/webkit/vite` (`webkitViteConfig`),
which only pre-bundled `vee-validate`, is removed (the codemod lists the import as `MANUAL`): put
`optimizeDeps: { include: ['vee-validate'] }` in your own Vite config, or drop the import if you do
not use `vee-validate`.

### The MCP server is its own package: `@aziontech/webkit-mcp`

v5 shipped the MCP server inside `@aziontech/webkit` (bin `webkit-mcp`), so every app downloaded
`@modelcontextprotocol/sdk`, `zod` and their HTTP libraries (about 90 packages). v6 moves it to
`@aziontech/webkit-mcp`; `@aziontech/webkit` no longer has the `webkit-mcp` bin. Point `.mcp.json`
at the new package: `{ "command": "npx", "args": ["-y", "@aziontech/webkit-mcp"] }` (re-running
`npx @aziontech/webkit init` rewrites the v5 entry for you; `webkit doctor` fails until it is fixed).
The block tools are renamed, with no alias: `search_patterns` → `search_blocks`, `get_pattern` →
`get_block`, and `suggest_component` answers a screen with `recommendation: "block"` and `block` /
`blockAlternatives` (was `"pattern"`, `pattern`, `patternAlternatives`). The other tools are unchanged.

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

| Removed                                  | Use instead                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `@aziontech/webkit/field-text`           | Field + FieldLabel + Input + FieldDescription                                                              |
| `@aziontech/webkit/field-textarea`       | Field + FieldLabel + Textarea + FieldDescription                                                           |
| `@aziontech/webkit/field-select`         | Field + FieldLabel + Select (Trigger/Content/Option) + FieldDescription                                    |
| `@aziontech/webkit/field-password`       | Field + FieldLabel + PasswordInput + FieldDescription (+ PasswordRequirements for the rules row)           |
| `@aziontech/webkit/field-phone-number`   | Field + FieldLabel + PhoneInput + FieldDescription                                                         |
| `@aziontech/webkit/field-time`           | Field + FieldLabel + Input + FieldDescription                                                              |
| `@aziontech/webkit/field-file-upload`    | Field + FieldLabel + FileDropzone + FieldDescription                                                       |
| `@aziontech/webkit/field-input-group`    | Field + FieldLabel + InputGroup (Addon + InputGroupInput) + FieldDescription                               |
| `@aziontech/webkit/field-text-switch`    | Field + FieldLabel + InputGroup (InputGroupInput + Addon with Switch) + FieldDescription                   |
| `@aziontech/webkit/field-checkbox`       | Field orientation=horizontal + Checkbox + FieldContent (FieldLabel + FieldDescription)                     |
| `@aziontech/webkit/field-radio`          | RadioGroup v-model with a RadioGroup.Item per option (description on the item)                             |
| `@aziontech/webkit/field-switch`         | Field orientation=horizontal + Switch + FieldContent (FieldLabel + FieldDescription)                       |
| `@aziontech/webkit/field-checkbox-block` | FieldLabel wrapping Field orientation=horizontal + Checkbox + FieldContent (FieldTitle + FieldDescription) |
| `@aziontech/webkit/field-radio-block`    | RadioGroup variant="card" with a RadioGroup.Item per option (description on the item)                      |
| `@aziontech/webkit/field-switch-block`   | FieldLabel wrapping Field orientation=horizontal + Switch + FieldContent (FieldTitle + FieldDescription)   |

New pieces that came out of the old wrappers: `PhoneInput` (`@aziontech/webkit/phone-input`),
`PasswordRequirements` (`@aziontech/webkit/password-requirements`) and `InputGroup.Input`
(`@aziontech/webkit/input-group-input`). `HelperText` and `Hint` remain; `Label` is removed (use `Field.Label`, or `FieldLabel` with `for` and `required` beside its control).

### Preview-only names

These shipped only in the 6.0 previews (`feat/webkit-ai-ready`), never in 5.x; they are gone in 6.0.

- `DocCta` (`@aziontech/webkit/doc-cta`) → `DocCallToAction` (`@aziontech/webkit/doc-call-to-action`):
  `primary-label` / `primary-href` become `:primary-action="{ label, href }"`, `secondary-label` /
  `secondary-href` become `:secondary-action="{ label, href }"`. The codemod lists the import as `MANUAL`.
- `CapabilityGrid` and `ConsolePanel`: `actions` → `primaryAction` and `secondaryAction` (one object
  each, same `{ label, href, trailing?, target?, variant? }` shape). The codemod lists it as `MANUAL`.
- `UploadProgress`: `v-model:collapsed` → `v-model:open`, inverted (`open = !collapsed`).
- `ConsoleLayout`: `v-model:navigation-expanded` → `v-model:navigation-open` (same value);
  `Wizard`: `v-model:activeStep` → `v-model`; the codemod rewrites both.
- `DocPrompt`: the default `icon` is `ai ai-sparkles` (was `pi pi-sparkles`), like every icon in
  the Azion set above.

### Documentation components

`doc-tooltip` is removed. A glossed term in a docs page is a `HoverCard`: in MDX, `DocMarkdown`
renders the `<Tooltip tip title linkLabel href>` tag as one, so Markdown sources need no change. In
an SFC, compose `<HoverCard><HoverCard.Trigger>…</HoverCard.Trigger><HoverCard.Content>…</HoverCard.Content></HoverCard>`.
The codemod lists the import as `MANUAL`.

`DocCardGroup` takes `columns` (was `cols`); in Markdown, `DocMarkdown` still reads
`<CardGroup cols>` as `columns`, so existing docs sources render unchanged.

`doc-pagination` is now `doc-prev-next` (`DocPrevNext`); the codemod rewrites it. Its locale catalog
key and test id moved with it: override `docPrevNext.*` instead of `docPagination.*`, and select
`documentation-doc-prev-next` instead of `documentation-doc-pagination`.

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

### Data-driven tables are `DataTable`

`Table` is now the markup-only root of the table parts, so a hand-composed table no longer bundles
the `@tanstack/vue-table` engine (`table-root` is about 2 KB, down from 56 KB). Everything that
takes `data` + `columns` moved to `DataTable`:

```diff
- import Table from '@aziontech/webkit/table'
- import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
+ import Table from '@aziontech/webkit/table' // still the parts: Table.Search, Table.CellStatus, …
+ import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'

- <Table :data="rows" :columns="columns" paginated>
+ <DataTable :data="rows" :columns="columns" paginated>
    <template #toolbar><Table.Search /></template>
- </Table>
+ </DataTable>
```

- Every prop, event, slot, `v-model` and the `TableExposed` ref API of the data-driven mode is on
  `DataTable` unchanged; `useCollection().tableProps` binds to it the same way.
- The types (`TableColumn`, `TableExposed`, `TableStateSnapshot`, the slot scopes) come from
  `@aziontech/webkit/data-table` or `@aziontech/webkit/table`; `@aziontech/webkit/table-root` no
  longer exports them.
- `Table` keeps `maxHeight`, `bordered`, `density`, `wrapLines` and the `default`, `title`,
  `toolbar` and `footer` slots. Its `toolbar` slot has no scope.
- Test ids: DataTable's root is `data-data-table` (its parts `data-data-table__row`, …); a
  hand-composed `Table` keeps `data-table`.
- Removed with no alias: `headerKind` (use `density`, which also compacts the rows),
  `rowsPerPageOptions` (use `pageSizeOptions`, now `[10, 25, 50, 100]` by default) and
  `Table.Header`'s `kind` (use `density`). `useCollection().tableProps` now binds `pageSizeOptions`.
- The codemod cannot tell a data-driven `<Table>` from a composed one; move the tags that pass
  `:data`, `:columns` or `v-bind="tableProps"` by hand.

### Two table filters and one column chooser

A table filters with one of two components, picked by the shape of the data, and chooses its
columns in one place:

- `Table.Filter` is only the toolbar slot that hosts them, wired to the DataTable's `filters`:
  `type="menu"` (the default) renders `FilterMenu` (facets picked from known values) and
  `type="property"` renders `PropertyFilter` (typed conditions with operators, combined with AND).
  The field / operator / value builder (`kind="builder"`, the old default) is removed with its
  `count` prop, its `default` and `trigger` slots and its `clear` event. A `<Table.Filter>` with no
  `type` now opens the menu: write `type="property"` to keep operator conditions (the codemod
  rewrites `kind="builder"`). For a query language of your own, bind `PropertyFilter` in `query`
  mode.
- `Table.AppliedFilters` (`./table-applied-filters`) is removed. Put `<FilterMenu.Chips />` with no
  `fields` in the DataTable `filters` slot: it reads the table's filter fields and filters, and its
  chips reopen the menu or remove the filter (`filter-remove`). The property type shows its own
  tokens and needs no chips.
- `Table.ColumnSelector` (`./table-column-selector`) is removed. Put `<CollectionPreferences
:sections="['columns']" />` with no `columns` in the DataTable toolbar: it lists the table's
  columns (a `hideable: false` one locked) with their order, and Confirm writes the visibility and
  the order back to the table. Bound to `useCollection`, keep `v-bind="preferencesProps"`.
- `PropertyFilter` gains `show-operations` (default `true`); `:show-operations="false"` hides the Match all / Match any toggle.

### `v-model` everywhere

`Accordion`, `Tabs`, `NavigationMenu`, `CodeBlock`, `ThemeSwitcher` and `PageTabs` bind `v-model`
(`modelValue`), no longer `v-model:value`. The codemod rewrites the usual forms; check custom
`:value` / `@update:value` wiring by hand.

### Activation events pass the DOM event first

Every event that fires because someone activated something (a click, a select, a remove, a submit)
now passes the DOM event as its first argument, and the item it concerns second. The codemod does
not rewrite handlers: a handler that ignores its arguments (`@retry="reload"`,
`@confirm="save()"`) keeps working; a handler that reads them needs the new signature.

| Component               | Event               | v5 payload                       | v6 payload                                          |
| ----------------------- | ------------------- | -------------------------------- | --------------------------------------------------- |
| `SuggestionGroup`       | `select`            | `(item)`                         | `(event, item)`                                     |
| `ConversationHistory`   | `remove`            | `(id)`                           | `(event, id)`                                       |
| `PromptInput`           | `submit`            | `(value, references)`            | `(event, { value, references })`                    |
| `PromptInput`           | `stop`              | `()`                             | `(event)`                                           |
| `ToolApproval`          | `approve`, `deny`   | `()`                             | `(event)`                                           |
| `ArtifactCanvas`        | `close`             | `()`                             | `(event)` (a `KeyboardEvent` when Escape closes it) |
| `ArtifactPreview`       | `open`              | `()`                             | `(event)`                                           |
| `ChatMessage`           | `retry`             | `()`                             | `(event)`                                           |
| `Reasoning`             | `skip`              | `()`                             | `(event)`                                           |
| `FeedbackReasonDialog`  | `submit`            | `(payload)`                      | `(event, payload)`                                  |
| `TopologyDiagram`       | `remove`            | `(key)`                          | `(event, key)`                                      |
| `TopologyDiagram`       | `create`            | `(key)`                          | `(event, key)`                                      |
| `TopologyDiagram`       | `bind`              | `(key, value)`                   | `(event, { key, value })`                           |
| `DataTable`             | `filter-apply`      | `(filters)`                      | `(event, filters)`                                  |
| `DataTable`             | `filter-remove`     | `(filter)`                       | `(event, filter)`                                   |
| `Table.Filter`          | `apply`             | `(filters)`                      | `(event, filters)`                                  |
| `CollectionPreferences` | `confirm`           | `(value)`                        | `(event, value)`                                    |
| `CollectionPreferences` | `cancel`            | `()`                             | `(event)`                                           |
| `PropertyFilter`        | `submit`            | `(payload)`                      | `(event, payload)`                                  |
| `ButtonGroup`           | `click`             | `({ id })`                       | `(event, id)`                                       |
| `UploadProgress`        | `cancel`, `retry`   | `(id?)`                          | `(event, id?)`                                      |
| `UploadProgress`        | `close`             | `()`                             | `(event)`                                           |
| `ConfirmDialog`         | `confirm`, `cancel` | `()`                             | `(event)`                                           |
| `FileTokenGroup`        | `remove`            | `(index, item)`                  | `(event, { index, item })`                          |
| `AttributeEditor`       | `add`               | `({ index, groupIndex? })`       | `(event, { index, groupIndex? })`                   |
| `AttributeEditor`       | `remove`            | `({ index, item, groupIndex? })` | `(event, { index, item, groupIndex? })`             |
| `Combobox`              | `create`            | `(value)`                        | `(event, value)`                                    |
| `DatePicker`            | `apply`             | `(value)`                        | `(event, value)`                                    |
| `CopyButton`            | `copy`              | `(value)`                        | `(event, value)`                                    |
| `CopyPromptButton`      | `copy`              | `(value)`                        | `(event, value)`                                    |
| `CodeBlock`             | `copy`              | `(code)`                         | `(event, code)`                                     |
| `LogView`               | `copy`              | `(value)`                        | `(event, value)`                                    |
| `ArtifactCanvas`        | `copy`              | `(value)`                        | `(event, value)`                                    |
| `ArtifactPreview`       | `copy`              | `(value)`                        | `(event, value)`                                    |
| `DocAgentCard`          | `copy`              | `(value)`                        | `(event, value)`                                    |

```vue
<!-- v5 -->
<SuggestionGroup :items="items" @select="(item) => send(item.label)" />
<PromptInput v-model="draft" @submit="(value, references) => send(value, references)" />
<FileTokenGroup :items="files" @dismiss="(index) => removeFile(index)" />
<ButtonGroup :items="actions" @click="({ id }) => run(id)" />

<!-- v6 -->
<SuggestionGroup :items="items" @select="(event, item) => send(item.label)" />
<PromptInput v-model="draft" @submit="(event, { value, references }) => send(value, references)" />
<FileTokenGroup :items="files" @remove="(event, { index }) => removeFile(index)" />
<ButtonGroup :items="actions" @click="(event, id) => run(id)" />
```

A slot function changed with them: the `AttributeEditor` `row` and `row-actions` slots pass
`remove(event)`. Bind them to a click
(`@click="remove"`) or pass the event on (`@click="(event) => apply(event)"`).

The `AttributeEditor` `row` slot also passes `move(event, offset)` for reorderable lists
(`reorderable`); a slot that ignores it needs no change.

### `Item` drops `asChild`: set `href` or `clickable`

`Item` no longer merges its row onto a slotted child. It renders its own root: an anchor when
`href` is set, a native button when `clickable` is set, a `div` otherwise. Move the child's
attributes and listeners onto the `Item` and drop the wrapper element. The codemod does not
rewrite this, because the replacement depends on whether the child was a link or a button.

```vue
<!-- v5 -->
<Item as-child>
  <a href="https://example.com/docs">
    <Item.Content><Item.Title>Docs</Item.Title></Item.Content>
  </a>
</Item>
<Item as-child kind="option">
  <button type="button" :aria-pressed="picked" @click="pick">
    <Item.Content><Item.Title>workload_01</Item.Title></Item.Content>
  </button>
</Item>

<!-- v6 -->
<Item href="https://example.com/docs">
  <Item.Content><Item.Title>Docs</Item.Title></Item.Content>
</Item>
<Item clickable variant="option" :aria-pressed="picked" @click="pick">
  <Item.Content><Item.Title>workload_01</Item.Title></Item.Content>
</Item>
```

### Removed in 6.0: feedback, content, code and chart names

These names are removed in 6.0, with no alias. The codemod rewrites
the prop renames of section 3 (`skeleton` `kind="shape"`, `progress` `shape`, `badge`
`severity="default"`, `overline` `showCursor`, `card-pricing` `planTitle`, `flow-anchor` `type`, `toast-item` `type`) and the type names; the rest need a
hand edit.

| Component         | Removed                                                 | Use instead                                                   |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `toast-item`      | `type` (and the value `error`)                          | `severity` (`danger`)                                         |
| `toast`           | `ToastType`, store entry `type`, `data-type`            | `ToastSeverity`, entry `severity`, `data-severity`            |
| `progress`        | `shape`, `ProgressShape`, `data-shape`                  | `variant`, `ProgressVariant`, `data-variant`                  |
| `skeleton`        | `kind="shape"`                                          | `variant="rectangle"`                                         |
| `badge`           | `severity="default"`                                    | `severity="neutral"`                                          |
| `overline`        | `showCursor`                                            | `cursor`                                                      |
| `card-pricing`    | `planTitle` (and its built-in `Pro`)                    | `title`, set on every card                                    |
| `flow-anchor`     | `type`, `FlowAnchorType`                                | `side`, `FlowAnchorSide`                                      |
| `log-view`        | `v-model:warnings-only`, `data-warnings-only`           | `v-model:level` set to `'warn'`                               |
| `log-view`        | line `type: 'warning'`                                  | line `type: 'text', level: 'warn'`                            |
| `gauge-chart`     | threshold `color`, `GaugeChartThreshold`, `data-status` | threshold `severity`, `ChartThreshold`, `data-severity`       |
| `chart-reference` | `ChartReferenceSeverity`                                | `ChartThresholdSeverity` (now also takes the findings levels) |

`Badge` is for counts only (`12`, `99+`): a status word goes to `StatusIndicator` (the state of a
resource) or `Tag` (a category or outcome word). `CodeEditor`'s plain diff mode now marks added and
removed lines in its gutters with the same line diff `CodeBlock` draws. `LogView.Steps`
(`@aziontech/webkit/log-view-steps`) is the one pipeline of steps for a build or deploy run.

### Overlay and feedback behaviour

`ConfirmDialog` opens with focus on Cancel and has no close button (an alert
dialog is answered with Cancel, the confirm button or `Esc`). `Popover` moves focus to its first
control on open, and `Tab` past its last control closes it and moves on.

Behaviour that changed with them: `ConfirmDialog` renders `role="alertdialog"`; `StatusIndicator` is
no longer a `role="status"` live region (announce a change you need heard through a toast);
`Toaster` announces through two hidden live regions: a `danger` toast (`toast.error`) interrupts
(assertive), every other kind is polite; the visible stack is no longer `aria-live`;
`Drawer` widths come from container tokens (`small` 408px, `medium` 644px, `large` 1024px instead of
384 / 672 / 1024 px); `Alert` `close` and `ErrorBoundary` `retry` now pass the triggering event
(handlers that take no argument keep working).

### `Dialog` and `Drawer`: overlay and close button by default

A dialog or drawer used to need four hand-assembled pieces (`DialogPortal`, `DialogOverlay`,
`DialogContent`, `DialogClose`), and leaving out the overlay left the page behind clickable. In v6
`DialogContent` / `DrawerContent` is the whole modal: it teleports to `body`, renders the dimmed
overlay, traps focus and locks page scroll. `dialog-portal`, `dialog-overlay`, `drawer-portal` and
`drawer-overlay` are removed (the codemod lists them as `MANUAL`), and so are `Dialog.Portal`,
`Dialog.Overlay`, `Drawer.Portal` and `Drawer.Overlay` on the compounds.

- Delete the `<DialogPortal>` / `<DrawerPortal>` wrapper (keep what it held) and the
  `<DialogOverlay />` / `<DrawerOverlay />` element.
- `closable` now defaults to `true` on `Dialog` and `Drawer` and means "show the close (X) button":
  the content's `PanelHeader` gets it at its end on its own. Delete a `<DialogClose />` /
  `<DrawerClose />` you placed in the header, or you get two. `:closable="false"` removes it;
  `DialogClose` / `DrawerClose` stay for a custom header and always close.
- `dismissible` gates only `Esc` and the overlay click; it no longer disables the close button. To
  lock a dialog while it saves, write `:closable="!saving"` next to `:dismissible="!saving"`.
- A drawer that must leave the page beside it usable (an assistant next to the page it talks about)
  takes `:modal="false"`: no overlay, no focus trap, no scroll lock, `aria-modal="false"`.

### Test ids

Test ids follow the component name: `feedback-message` → `feedback-alert`, `layout-divider` →
`layout-separator`, `navigation-dropdown` → `navigation-dropdown-menu`, `input-box-grid-selection` →
`input-radio-group`, `input-calendar` → `input-date-picker`, `data-pick-list` → `data-transfer-list`, and so on for every renamed component. Update end-to-end selectors that use
`data-testid`. `NavigationMenu` moves from `navigation-menu` (the id `Menu` also uses) to
`navigation-navigation-menu`, and its parts from `navigation-menu__*` to
`navigation-navigation-menu__*`.

Every input takes the `input-<name>` id, also when its name already says input: `input` →
`input-input`, `input-group` → `input-input-group` (its parts `input-input-group-addon` and
`input-input-group-input`), `number-input` → `input-number-input`, `otp-input` →
`input-otp-input`, `password-input` → `input-password-input` and `phone-input` →
`input-phone-input`, with their parts (`otp-input__box` → `input-otp-input__box`, and so on).

A child test id joins its root with two underscores, never a hyphen. These moved:

| Component                     | v5                                       | v6                                         |
| ----------------------------- | ---------------------------------------- | ------------------------------------------ |
| `Button`                      | `actions-button-loading`                 | `actions-button__loading`                  |
| `IconButton`                  | `actions-icon-button-loading`            | `actions-icon-button__loading`             |
| `ButtonHighlight`             | `actions-button-highlight-loading`       | `actions-button-highlight__loading`        |
| `RadioGroup.Item` (the radio) | `input-radio-group__item-control`        | `input-radio-group__item__control`         |
| `Flow.Parallel` (branch list) | `data-flow__parallel-branches`           | `data-flow__parallel__branches`            |
| `KeyValuePairs.Item`          | `content-key-value-pairs-item`           | `content-key-value-pairs__item`            |
| `KeyValuePairs.Group`         | `content-key-value-pairs-group`          | `content-key-value-pairs__group`           |
| `Tree` row / chevron          | `data-tree-item` / `data-tree-toggle`    | `data-tree__item` / `data-tree__toggle`    |
| `Tree` rename / loading       | `data-tree-rename` / `data-tree-loading` | `data-tree__rename` / `data-tree__loading` |
| `Toaster` region              | `feedback-toast-<position>`              | `feedback-toast__<position>`               |
| `Chart` legend entry          | `chart-chart__legend-item`               | `chart-chart__legend__item`                |
| `Board.Item`                  | `layout-board-item`                      | `layout-board__item`                       |
| `DocProse` copy tip           | `documentation-doc-prose-copy-tip`       | `documentation-doc-prose__copy-tip`        |

The same applies under a root id you pass yourself (`my-tree-item` → `my-tree__item`).

### Default sizes follow the house rule

Actions default to `large` and everything else to `medium`. These defaults moved; pass the old
`size` to keep the old look:

| Component       | v5 default | v6 default |
| --------------- | ---------- | ---------- |
| `CopyButton`    | `small`    | `large`    |
| `ButtonGroup`   | `medium`   | `large`    |
| `Progress`      | `small`    | `medium`   |
| `ConfirmDialog` | `small`    | `medium`   |
| `Currency`      | `small`    | `medium`   |
| `HeroTitle`     | `large`    | `medium`   |

### Tag and StatusIndicator colours

`Tag` `severity="secondary"` is removed: it drew the same bordered look as `neutral`, which takes
its place. `Menu.Item` `tag-severity="secondary"` follows. `StatusIndicator` `severity="alt"` is
removed: its dot was the brand orange, outside the shared severity scale; `neutral` (a muted dot)
takes its place, or `info` if the orange marked something to notice. The codemod rewrites all three
to `neutral`.

### Navigation defaults

Defaults that showed placeholder content now default to empty: `Link` (`href`, `icon`: a same-tab
link shows no trailing icon unless `icon` is set), `SidebarMenu.Item` (`label`, `icon`, `tagValue`: no
home glyph on an item without `icon`), `Tabs.Item` (`label`) and `Breadcrumb.Item` (`label`, `href`).
`SidebarMenu.SubTrigger` `click` now also passes `{ label, href }` as its second argument.

`Select` now follows the `input-<name>` rule like the rest of the inputs category: `select` →
`input-select`, and its parts `select-trigger`, `select-content`, `select-option` and `select-group`
→ `input-select-trigger`, `input-select-content`, `input-select-option` and `input-select-group`
(part ids follow, `select-trigger__value` → `input-select-trigger__value`). A `data-testid` you
pass yourself still wins.

### Pagination ellipsis

The `more` item of `Pagination` is now decorative (`aria-hidden`, not focusable, no `click`). Code
that listened to its click had no effect before and can be removed.

### Account blocks

The card-brand plate in the account blocks is monochrome (theme tokens instead of a fixed hex). If
you copied those blocks, copy them again or keep your version.

### Block ids

Blocks are grouped by job, one folder level under `blocks/`: `account/*`, `ai/*`, `auth/*`,
`create/*`, `dashboard/*`, `detail/*`, `edit/*`, `settings/*`, `state/*`, `view/*`, `shell/*` and
`top-bar/*`. There is no surface folder (`platform/`, `shells/`, `top-bars/` are gone): the surface
is `block.json#surface` (`app`, `docs` or `site`), and the catalog and the MCP `surface` filter
use the same words (`product` → `app`, `marketing` → `site`).

Every 5.x id moved up one level (`platform/view/table-view` → `view/table-view`,
`platform/states/*` → `state/*`, `shells/*` → `shell/*`, `top-bars/*` → `top-bar/*`). These were
also renamed:

| 5.x id                                     | 6.0 id                          |
| ------------------------------------------ | ------------------------------- |
| `platform/auth`                            | `auth/sign-in`                  |
| `platform/account/build-deployment`        | `account/deployment-settings`   |
| `platform/account/mfa-management`          | `account/mfa-settings`          |
| `platform/account/manage-resources`        | `account/account-hierarchy`     |
| `platform/account/tokens`                  | `account/personal-tokens`       |
| `platform/create/create-in-drawer`         | `create/create-drawer`          |
| `platform/create/multipage-create`         | `create/create-wizard`          |
| `platform/create/single-page-create`       | `create/create-page`            |
| `platform/dashboard/composition-dashboard` | `dashboard/breakdown-dashboard` |
| `platform/delete/delete-with-confirmation` | `edit/delete-dialog`            |
| `platform/detail/details-page`             | `detail/resource-detail`        |
| `platform/detail/record-table`             | `detail/dns-zone-detail`        |
| `platform/states/page-wires`               | `state/page-skeleton`           |
| `platform/view/rules-list`                 | `view/rule-list`                |
| `shells/documentation`                     | `shell/docs`                    |
| `shells/website`                           | `shell/site`                    |

Variant states use one word set, `loading`, `empty`, `error`, `success`, written
`<subject>-<state>`: `Failed` → `Error`, `<Subject>Failed` → `<Subject>Error` (`LoadFailed` →
`LoadError`, `SaveFailed` → `SaveError`, …), `FailedCompleteView` → `CompleteViewError`,
`PartialFailure` → `PartialError`, `Succeeded` → `Success`, `LoadingRepositories` →
`RepositoriesLoading`, `LoadingSettings` → `SettingsLoading`, query-editor's `EmptyDatabase` →
`NoTables`, production-checklist's `Complete` → `Completed` and delete-dialog's `LabelledField` →
`SettingsRow`. A `#variant` fragment and `add --variant` take the variant file name
(`view/table-view#error`); the PascalCase name still works. Your `webkit.blocks.json` keeps the old
ids: `add <old id>` resolves them with a note.

Blocks that did the same job
are one block whose states are variants: the drawer forms are `create/create-drawer`,
the save strategies are `settings/settings-form`, the two details pages are
`detail/resource-detail`, the labelled delete dialog is a variant of
`edit/delete-dialog`, the server rejection is a variant of
`state/form-validation` and the sectioned Import from Git form is a variant of
`create/deploy-template`.

One block per job (6.0):

- Starting a project is one flow, `create/create-hub` then
  `create/deploy-template`. `source-wizard` is removed: its Where it runs chooser and
  its integration install step are the deploy-template variants `WhereItRuns` and
  `InstallIntegration`; create-page drops `ImportFromGit` and `ImportFromGitSubmitted`
  (deploy-template's `ImportFromGit`).
- `create/create-wizard` runs on `Wizard`; `provision-wizard` is its
  `CreateAndDeploy` variant. `onboarding-form` keeps its frame and uses `Wizard` for its steps.
- `platform/account/profile` is the settings-form variants `Profile`, `ProfileLoading` and
  `ProfileError`.
- `platform/states/form-error` is the form-validation variants `SectionRejected`,
  `SectionReloading` and `SectionReloaded`.
- `platform/create/deployment-flow` is the deployment-logs variants `InCreateFlow` and
  `InCreateFlowError`; resource-detail's `DeploymentDetail`, `DeploymentError` and
  `DeploymentQueued` moved to `detail/deployment-logs`, and its `Invocation` variant is
  `detail/invocations`. Every phased deploy log composes `LogView.Steps`.
- `view/marketplace` lists integrations only (its `Integrations` state is now the
  default); templates live in `view/template-browser`, and its `TemplatesNoMatch` and
  `TemplatePage` variants are template-browser's `NoMatch` and deploy-template's `Form`.
- `data-dashboard` is analytics-dashboard's `Usage` (its RealUser page is health-score-dashboard's
  `RealUser`); `activity-outcomes-dashboard` is security-dashboard's `ByActor`;
  `project-status-dashboard` and `funnel-cohort-dashboard` are removed (off-domain for the console).
- `headers/site-header`, `headers/docs-header` and `headers/resource-header` are removed: SiteLayout,
  DocLayout and ConsoleLayout already draw those bars (`shell/*`). The other two are renamed:
  `headers/auth-header` → `top-bar/auth-bar`, `headers/creation-header` → `top-bar/creation-bar`.
- `platform/edit/attribute-editor` → `edit/variables` and `platform/edit/code-editor` →
  `edit/function-editor` (the names belonged to the components they compose).
- `resource-picker`, `payment-method-card`, `get-started`, `production-checklist` and
  `attached-resources` carry `kind: "fragment"`: cards placed inside a page, not screens.

Every old id, and every renamed state of a removed block, is in
[`src/cli/migrations/v6-blocks.json`](./src/cli/migrations/v6-blocks.json); `get_block` still
answers an old id with the new block and a `note`. Code you already copied does not change.

### Marketing section defaults

Some marketing sections render differently with the same props. Pass the old value where you need
the old look.

- `FeatureWidgets`: `columns` defaults to `2` (was `3`).
- `NetworkSection`: a `claims` entry can be a string, as before, or a `NetworkSectionClaim`
  object; string claims render as they did.
- `FeatureTabs`: the title sits beside the tabs on one row, the tabs are `medium`, and the action is
  a `Button`.
- `MediaSplitBand`: at the medium breakpoint the copy aligns to the top of the media, and a lone
  action is `outlined`.
- `MediaSplitStack`: band headings are `h3` under the section title.
- `SitePage`: no trailing gap after a closing band.
- `ClientMosaic`: a cell mark on a `white` or `primary` fill defaults to `logoTreatment: 'knockout'`
  (set `'as-is'` to keep its colours).
- `ArticleBody`: the share group's copy link button copies the page URL (`location.href`, then
  `article.href`).
- `ArticleIndex`, `StoryLibrary`: with `moreLabel` set the list pages
  by `pageSize` (default `12`), and the load-more button shows only while more remain.

### Marketing names removed in 6.0

These names are removed in 6.0, with no alias. `webkit migrate` rewrites the prop
renames marked with a codemod; move the rest by hand.

| Component                | Removed                                      | Use                                    | Codemod |
| ------------------------ | -------------------------------------------- | -------------------------------------- | ------- |
| `architecture-tabs`      | `interval`                                   | `autoplayInterval` (and `autoplay`)    | yes     |
| `compare-plans`          | section `link`                               | section `action`                       | no      |
| `feature-tabs`           | `interval`                                   | `autoplayInterval` (and `autoplay`)    | yes     |
| `hero`                   | `carousel`, `carouselMarks`, `carouselLabel` | `ticker`, `tickerMarks`, `tickerLabel` | yes     |
| `hero-band`, `hero-form` | `carouselMarks`, `carouselLabel`             | `tickerMarks`, `tickerLabel`           | yes     |
| `media-tabs`             | `@tab-change`                                | `v-model` (`update:modelValue`)        | no      |
| `logo-wall` (types)      | `LogoItem`, `LogoShape`                      | `LogoWallItem`, `LogoWallShape`        | yes     |
| `big-numbers` (type)     | `BigNumberItem`                              | `BigNumbersItem`                       | yes     |

Site JSON must use the new keys: an old key such as `carouselMarks` or `interval` is ignored now, so
the band renders without its client strip or with the default hold. `media-tabs`, `quote-tabs`,
`ticker`, `article-highlight` (with `autoplay`) and the sections that compose them draw a visible
pause control while they move (WCAG 2.2.2); `recognition-marquee` and `photo-marquee` now draw it
too, through the marquee loop they share with `ticker`.

### Marketing sections merged

Sections that did the same job as another were folded into it. The old import is gone (the codemod
lists it as manual work); page JSON that still names the old `_id` keeps rendering, because
`SitePage` maps it to its successor and rewrites its props.

| Removed                               | Use                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `hero-copy-on-top-art`                | `hero-band` with `variant="copy-on-top-art"` and the same `levels`                        |
| `hero-with-opening`                   | `hero-band` with `size="large"` and the same `items`                                      |
| `closing-call-to-action-agents`       | `closing-call-to-action` with `variant="primary"` and `audiences`                         |
| `closing-call-to-action-templates`    | `template-gallery` with `closing`                                                         |
| `banner`                              | `call-to-action` with `variant="announcement"`; the `aside` slot is the default slot      |
| `customer-spotlight`                  | `client-mosaic-columns` with `reveal="hover"`; `items` → `cells`, `description` → `story` |
| `sticky-carousel`                     | `process-scroll` with `pinned` and `title-variant="centered"`; `items` → `steps`          |
| `quote-carousel`                      | `client-quotes`, or `Quote` cards in a `CardCarousel`                                     |
| `compare-support-tiers`               | `compare-plans`; `tiers` → `plans`                                                        |
| `article-index-blog`                  | `article-index` (`filters="category-search"`, the default)                                |
| `article-index-resource-hub`          | `article-index` with `filters="facets"`                                                   |
| `use-case-links`                      | `capability-grid` with `title-variant="left"`; items keep `href`                          |
| `resource-grid`                       | `capability-grid` with `title-variant="horizontal"`; items keep `href`                    |
| `content-columns`                     | `capability-grid`; `columns` is `3` or `4`                                                |
| `code-split`                          | `media-split-band` with the same `codeTabs`, `defaultFile` and actions                    |
| `sticky-scroll-code`                  | `feature-scroll`; each item keeps its `code`                                              |
| `shell-mockup` (and `-root`, `-part`) | internal to `product-widget`; show a console screen with `ProductWidget`                  |

Their exported types map to the survivor's (`ArticleIndexBlogItem` → `ArticleIndexItem`,
`CodeSplitTab` → `MediaSplitBandCodeTab`, …); `webkit migrate` rewrites them.
`sticky-carousel`'s header offset now follows `--layout-header-height` instead of a fixed `3.5rem`.

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
  follows changes. Tabs, ToggleGroup, Slider, Pagination, NavigationMenu, Menu
  submenus, Tree, DatePicker, Resizable, Carousel, QuoteTabs, Tracker and CodeBlock tabs already use
  it: under `rtl`, ArrowLeft moves to the next item.
- **Icons.** Arrows, chevrons, carets and log-in/log-out glyphs mirror under `rtl`
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
  `Wizard` hides its rail below `@2xl` of the wizard (was: the `md` viewport). `SettingRow` keeps its two
  columns at every width and top-aligns the copy with the control (was: centred); set `stackable`
  to move a `field` control under its copy below `@md` of the row. `Alert` moves its action to its own line,
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
- **Container sizes are the theme's.** The theme now declares its `--container-*` scale in
  `@theme`, so the container variants in your own markup (`@sm:` … `@7xl:`, `@max-sm:` …, named
  ones such as `@md/card:`) switch at the theme sizes instead of Tailwind's defaults. Before, the
  variables existed but Tailwind compiled the variants from its own scale. `@3xs` is unchanged;
  every other step now switches later:

  | Variant | Was (Tailwind default) | Now (theme) | Variant | Was     | Now     |
  | ------- | ---------------------- | ----------- | ------- | ------- | ------- |
  | `@2xs`  | 288 px                 | 300 px      | `@2xl`  | 672 px  | 752 px  |
  | `@xs`   | 320 px                 | 348 px      | `@3xl`  | 768 px  | 876 px  |
  | `@sm`   | 384 px                 | 408 px      | `@4xl`  | 896 px  | 1024 px |
  | `@md`   | 448 px                 | 472 px      | `@5xl`  | 1024 px | 1192 px |
  | `@lg`   | 512 px                 | 552 px      | `@6xl`  | 1152 px | 1388 px |
  | `@xl`   | 576 px                 | 644 px      | `@7xl`  | 1280 px | 1620 px |

  Up to `@xl` the shift is at most 68 px, but it can still cross a phone: a 390 px phone gives a
  padded box about 326 px wide, which is past the old `@xs` (320) and short of the new one (348),
  so `@2xs:` is the step that keeps a row on that phone. From `@2xl` up, check each use: a step that has to
  happen inside a page column (at most 1388 px on the site, 1620 px in the console) may now never
  happen. Move it to the nearest step that still fits (`@6xl:` → `@5xl:`, `@7xl:` → `@6xl:`)
  rather than writing a raw `@min-[…]:`. Width utilities (`max-w-md`, `w-2xl`,
  `max-w-(--container-md)`) already read the theme values and do not change. In WebKit itself
  `Hero.Title` keeps its actions in a row from `@2xs`, the wide `Diagram` layout now starts at
  `@5xl` and `CardList` shows four columns from `@6xl`; the `get-started` steps (`detail/get-started`, the Overview of
  `detail/resource-detail`) sit side by side from `@4xl` (1024 px), so a 1280 px console
  window stacks them.

- **Stacked table (opt-in).** A data-driven `Table` keeps its horizontally scrolling grid at
  every width, as before. Set `stackable` to render each row as a card of label / value lines
  when the table is narrower than `--container-lg` (552 px); the column headers stay for screen
  readers. Give a column `label` when its header is a slot.
- **Sheets.** Below `sm` a `Dialog` or `Drawer` is a full-height, full-width sheet (it was an
  80 dvh bottom sheet, which it still is between `sm` and `md`). `PanelFooter` stretches its direct
  children to equal widths and keeps the safe-area inset clear on phones.
- **Touch and hover.** `Button`, `IconButton`, `Checkbox`, `RadioGroup.Item` and `Switch` keep their
  drawn size but get a 24 px hit area, 44 px on a coarse pointer; `Pagination` buttons grow to
  44 px on a coarse pointer. `Button` and `IconButton` render one more child, an empty
  `[data-slot=touch-target]` span; update DOM snapshots. The copy-link of `SectionHeader` and
  `SettingsSection`, the `Card` header action and the `Table` sort affordance stay visible on
  devices without hover.
- **Reflow.** `ToggleGroup`, `DatePicker`, `RadioGroup` cards, `Overline`, the `Accordion` trigger and
  `Resizable` no longer overflow a 320 px box (they truncate, wrap or clip instead). A
  `singleLine` `Overline` wraps below `sm`.

### Languages

v6 adds `WebkitProvider` (`@aziontech/webkit/webkit-provider`). Mount it once at the app root with the
user's locale:

```vue
<script setup>
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
  >
    <App />
  </WebkitProvider>
</template>
```

Every built-in string (close buttons, pagination, empty states, sort state, assistive labels) now
comes from a message catalog in English, Brazilian Portuguese or Spanish, and dates, numbers, file
sizes, relative times and plurals format with `Intl` for the locale. The root carries `lang` and
`dir`; `dir` defaults to `auto`, which turns Arabic, Hebrew, Persian and Urdu right-to-left.

English is built into the provider. Portuguese and Spanish are separate entries,
`@aziontech/webkit/locales/pt-BR` and `@aziontech/webkit/locales/es`, so an app that runs only in
English does not download them: import the ones your app offers and pass them through `catalogs`
(`{ 'pt-BR': ptBR, es }`). A `pt-BR` or `es` locale with no registered catalog renders English and
warns once in development. v5 had no provider, so there is nothing to rewrite and no codemod step.

Dates, numbers and relative times follow the person's device by default: with no provider, or a
provider with no `locale`, they format for `navigator.language` (and read its catalog when you
registered one). The server render and hydration use `en-US`, and the device locale applies right
after mount. Pass `locale="en"` to keep v5's English output, or the user's saved choice. Only what
people read changes: send the `v-model` value to your server (DatePicker a `Date`, DateRangePicker ISO
8601 instants, TagEditor `key`/`value` pairs), never a printed label. Label props you already pass
still win. Props whose default was an English string (`ariaLabel: 'Close'`, `confirmLabel: 'Confirm'`,
`emptyTitle: 'No data available'`, `placeholder: 'Search'`…) now default to `''` and fall back to the
catalog, so an empty string no longer removes the label; `HelpPanel.Links` `title` defaults to
`undefined` and still hides its heading when you pass `''`. The pagination line formats its numbers
(`1,200`, `1.200` in Portuguese). `useLocale()` from `@aziontech/webkit/use-locale` gives your own
components the same locale, `t()` and `Intl` helpers.

### Layout: one name for the rail and the pane state

`Resizable.Pane` drops `v-model:collapsed`: bind `v-model:open` instead, with the value inverted
(`open = !collapsed`). The codemod lists it as `MANUAL`, because the bound value inverts.

The navigation rail now has one name across the layouts: `open` on `Sidebar` and `navigationOpen`
on `AppLayout` and `ConsoleLayout`. `@aziontech/webkit/sidebar` is now the compound
(`Sidebar.Header`, `Sidebar.Footer`); `@aziontech/webkit/sidebar-root` is the
standalone root. `SidebarGroup` (`@aziontech/webkit/sidebar-group`, `Sidebar.Group`) is removed:
group the rows with `SidebarMenu.Group` inside a `SidebarMenu` (`label`, rows as
`SidebarMenu.Item`).

### Changed defaults in the input and action controls

- `TagEditor` reserves no key prefix by default (`reservedPrefix` was `'azion:'`). Pass
  `reserved-prefix="azion:"` where the platform reserves it.

Optional text props that defaulted to `undefined` now default to `''`, and an empty string means
"not set", so the rendered output does not change. Code that reads the prop, or compares it with
`undefined`, sees `''` instead:

- `Avatar`: `src`, `alt` and `label` default to `''`; an empty `src` draws the initials or the icon.
- `Kbd`: `keyName` defaults to `''`; an empty `keyName` draws no named key, only the modifiers and the slot.
- `OverflowCount`: `noun` defaults to `''`; an empty `noun` uses the catalog (`item` / `items`).
- `Tag`: `icon` defaults to `''`; an empty `icon` draws no glyph.
- `FileDropzone`: `icon` defaults to `''` and still draws `ai ai-cloud-upload`; pass an icon class
  to change it, as before.
- `StatTile`: `trend` accepts `null` entries (`(number | null)[]`) for gaps in the sparkline. Arrays
  of numbers keep working; a typed `number[]` variable still assigns to it.

Two behaviour changes need a hand edit:

- `SplitButton`: read or restore the mirrored action with `v-model:selected`.
- `ToggleGroup`: a disabled option no longer shows the lock by itself; set `locked: true` on the
  options a plan or a permission blocks.

### Actions, navigation and overlay: one component per job

The codemod rewrites the renamed paths and bindings and prints `MANUAL` for a removed one.

- `menu` → `sidebar-menu` (`Menu` → `SidebarMenu`, every part `menu-*` → `sidebar-menu-*`, types
  `MenuNode` → `SidebarMenuNode`, …): it is only the navigation tree of `Sidebar`, `ConsoleLayout`
  and `DocLayout`. Test ids follow: `navigation-menu-*` → `navigation-sidebar-menu-*`.
  `SidebarMenu.Item` drops `kind="group"`: put the title on `SidebarMenu.Group label`.
- `HelpPanel.Tutorial` and `HelpPanel.Task` are removed (`help-panel-tutorial`, `help-panel-task`,
  the `HelpPanelTaskStatus` type): a tutorial is `TutorialPanel` inside `TutorialPanel.Provider`,
  with its tasks and steps as data and a `Hotspot` on each real control.
- `action-confirmation` → `tool-approval` (`ActionConfirmation` → `ToolApproval`, types
  `ToolApprovalState`, `ToolApprovalKind`, test id `ai-tool-approval`, locale key `toolApproval.*`):
  it is only an agent's request to run a tool; a person confirming their own action uses `ConfirmDialog`.
- Removed names (no alias): `Link` `showIcon` (set `icon`), `Tabs.Item` `selected`
  (`ToggleGroup`), `SplitButton` `model` (`items`), `DropdownMenu.Option` (`DropdownMenu.Item`) and
  the item `#left` / `#right` slots (`#leading` / `#trailing`), `NavigationMenu.Trigger`
  `native-button`, `Tooltip` `@show` / `@hide` (`@update:open`), `Popover` `width` and `PopoverWidth`
  (`size`, `PopoverSize`), `Sidebar` `v-model:collapsed` (`v-model:open`, inverted) and
  `GlobalHeader.Left` / `.Middle` / `.Nav` / `.Right` (`.Start` / `.Center` / `.End`, test ids
  `__start` / `__center` / `__end`), and `Tabs.Content` without a `value` (wrap the panels in a
  plain element; `Tabs.Content value="…"` is the panel).
- `Tree` with an `actions` slot renders as a `treegrid`: rows are `role="row"` with a label and an
  actions `gridcell`, the row buttons are reached with the arrow keys, and the tree stays one tab
  stop. Without `actions` it is the same `tree` as before.
- `Breadcrumb.Item` moved into the breadcrumb folder; its import `@aziontech/webkit/breadcrumb-item`
  is unchanged.
- `MiniButton` is removed. A text link that navigates → `<Link label href icon>` (it takes the
  link colour); a text action with no `href` → `<Button variant="link">`.

### Input controls: one name per job

6.0 removes the second names the input controls carried. The codemod rewrites the imports and
bindings and prints `MANUAL` for everything below that it cannot rewrite.

- **Removed aliases.** `Checkbox` drops `binary`, `inputId` and the `tabindex` prop (a boolean
  `v-model` needs no flag; pass `id` and `tabindex` as attributes). `Input`, `PasswordInput`,
  `Select.Trigger` and `MultiSelect.Trigger` drop the `#iconLeft` / `#iconRight` slots (use
  `#prefix` / `#suffix`). `Switch` drops `focused` (use `autofocus`) and the `SwitchType` type (use
  `SwitchKind`). `Textarea` drops `resizable` (use `resize`).
- **`Select` picks one value.** `multiple` is gone: `<Select multiple v-model="arr">` becomes
  `<MultiSelect v-model="arr">` with the same options. `Select` no longer sets `data-mode`.
- **`Label` is removed.** Wrap the control in `Field` and use `Field.Label`; for a label set apart
  from its control, use `FieldLabel` with `for`, and its new `required` prop for the Required marker.
- **`Calendar` → `DatePicker`, for one date.** `DatePicker` (`@aziontech/webkit/date-picker`,
  `-root`, `DatePicker.Clear`) picks one date, optionally with a time. `mode`, `period`,
  `presets` (and `Calendar.Preset`, the `#presets` slot), `showTimeZone`, `timeZones` and the
  `showTimezone` / `timezones` / `v-model:timezone` / `horizontal` aliases are gone; the
  `CalendarRange`, `CalendarMode` and `CalendarPresetItem` types too. A `mode="range"` or `period`
  picker becomes `DateRangePicker`, which owns every range: relative or absolute, and whole days
  with `range-selector-mode="absolute-only" :show-time="false"`. Its `v-model` is
  `{ type: 'absolute', start, end }` with ISO instants instead of `{ start, end }` Dates.
  `DateRangePicker` now formats in `WebkitProvider`'s `time-zone` when its own is unbound. The
  locale catalog group `calendar` is renamed `datePicker`, and its placeholder reads "Select a date".
- **Radios are one `RadioGroup`.** `RadioButton` and `RadioCards` are removed. Every radio is a
  `RadioGroup.Item` (`@aziontech/webkit/radio-group-item`) inside a `RadioGroup` that holds the
  `v-model`: `<RadioGroup v-model="plan"><RadioGroup.Item value="pro">Pro</RadioGroup.Item></RadioGroup>`.
  A hand-built `Field.Label` choice card with a radio becomes `variant="card"` with `description` on
  the item. `<RadioCards v-model :items>` becomes
  `<RadioGroup v-model variant="card" orientation="horizontal" :options>` (the codemod renames
  `items`); its `#default="{ item }"` slot is `#option="{ option }"` and `#tag="{ item }"` is
  `#tag="{ option }"`. `RadioCardsItem` → `RadioGroupOption`.
- **`PickList` → `TransferList`.** `@aziontech/webkit/pick-list` and its parts become
  `transfer-list` (`TransferList.Source`, `.Target`, `.Controls`), the test id
  `data-transfer-list`, the catalog group `transferList`; `dataKey` is gone (the
  codemod writes `itemKey`).

### AI skills renamed

Four skills in the AI bundle have plain names. `npx @aziontech/webkit sync` writes them under the
new folders and reports the old ones as orphans; delete the old folders in `.claude/skills/`.

| 5.x skill                  | 6.0 skill              |
| -------------------------- | ---------------------- |
| `webkit-ds-adoption`       | `webkit-adoption`      |
| `webkit-genai`             | `webkit-ai-surfaces`   |
| `webkit-baseline-ui`       | `webkit-quick-cleanup` |
| `webkit-impeccable-polish` | `webkit-final-polish`  |

### Lint rules renamed

Every rule of `@aziontech/webkit/eslint-plugin` starts with a `no-`, `prefer-` or `require-` verb.
The old ids are gone, so a config or `eslint-disable` comment that names one reports an unknown rule;
`migrate v6` rewrites them. Only `valid-import-path` shipped in 5.x; the other four existed only in
6.0 previews.

| Old rule                       | 6.0 rule                          |
| ------------------------------ | --------------------------------- |
| `webkit/accessible-name`       | `webkit/require-accessible-name`  |
| `webkit/container-needs-width` | `webkit/require-container-width`  |
| `webkit/header-search-trigger` | `webkit/require-header-search`    |
| `webkit/menu-node-href`        | `webkit/prefer-href-in-menu-node` |
| `webkit/valid-import-path`     | `webkit/no-unknown-import`        |

### Component CSS variables carry the component name

A CSS variable a component reads is named `--<component>-<part>-<property>`. The one you may set
yourself changed: a sticky bar above a `Hero` declares its height as `--hero-banner-offset`
(was `--banner-offset`), so a `variant="screen"` band still measures one screen beneath it.

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
their bindings and tags, `kind="text"` → `variant="ghost"` on the native button, and the matching
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

## 6. Other changes

### Tools that read `catalog.json` directly

The MCP server, the ESLint plugin and the CLI read the new layout; this section matters only for your
own scripts that open `node_modules/@aziontech/webkit/catalog.json`. The file is now metadata only
(1.0 MB, was 7.5 MB); the source code and the component prose moved next to it into `catalog/`:

| v5 field                                                                       | v6 location                                                                                           |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `patterns`, `patternAliases`                                                   | `blocks`, `blockAliases` (same shape)                                                                 |
| `patterns[id].sfc`                                                             | `catalog/blocks/<id>.json` → `sfc` (the path is in `blocks[id].file`)                                 |
| `patterns[id].variants[i].sfc`                                                 | `catalog/blocks/<id>.json` → `variants[i].sfc`; `catalog.json` keeps each variant's `name`, `summary` |
| `patterns[id].guidelines`                                                      | `catalog/blocks/<id>.json` → `guidelines`                                                             |
| `imports[subpath].examples`                                                    | `catalog/examples/<subpath>.json` → `examples` (the path is in `imports[subpath].examplesFile`)       |
| `imports[subpath].purpose`, `useWhen`, `avoidWhen`, `related`, `bestPractices` | `catalog/components/<subpath>.json` (the path is in `imports[subpath].docsFile`)                      |

Paths in `file`, `examplesFile` and `docsFile` are relative to the folder that holds `catalog.json`. The MCP tools
(`get_block`, `get_component`, `get_usage_example`) return the same answers as before. The asset
lists are `catalog/assets/<kind>.json` in kebab-case (`line-figures.json`, `brand-marks.json`).

### Example files renamed

The first example of every component is `default.vue`, and the others are named after what they
show. A tool that opens an example by path or name (`get_usage_example`, `/example?path=`) uses the
new names: `table/composition` → `table/default`, `footer/default-footer` → `footer/default`,
`*/read-only` → `*/readonly`, `*/grouped` and `*/with-groups` → `*/groups`, `*/kinds` →
`*/variants`, `input-group/with-addon-left|right` → `with-addon-start|end`, `*/failed` →
`*/error`, `select/transparent` → `select/ghost`. The full list is in `examples.json` of each
folder.

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

### Collections

v6 adds `useCollection` (`@aziontech/webkit/use-collection`) and three components that bind to it:
`PropertyFilter` (`@aziontech/webkit/property-filter`), `CollectionPreferences`
(`@aziontech/webkit/collection-preferences`) and `CardList` (`@aziontech/webkit/card-list`). Nothing is
removed, and the codemod changes nothing here: this is the shape a list page moves to when you touch it.
`Cards` is now `CardList`: the codemod renames the import and the tag; rename `cardsProps` to
`cardListProps` (from `useCollection`) and any locale override of `cards.*` to `cardList.*` by hand.

A list that kept its own `search`, `filters`, `pagination` and `columnVisibility` refs, filtered `:data`
in a `computed` and rewound the page in a `watch` becomes one call:

```vue
<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import DataTable from '@aziontech/webkit/data-table'
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
  <DataTable v-bind="tableProps" />
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
- The `view/table-view` block runs on `useCollection` with `PropertyFilter` and
  `CollectionPreferences`; `view/card-view` is new. Copy them again through the MCP
  (`get_block`) to pick the change up.

## 7. Unchanged

Theme tokens (apart from the sans stack, the container variants above and the theme changes in section 4), icons, the `init` / `doctor` / `report` / `sync` commands and the flat import style
(`@aziontech/webkit/<name>`) are the same. The theme's removed variables, fonts entry and device-default dark mode are in section 4. The AI bundle (`skills/`, `rules/`) is updated by
`npx @aziontech/webkit sync`.
