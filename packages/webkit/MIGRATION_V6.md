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
  pair becomes its Azion twin (`pi pi-check` → `az az-check`, `pi pi-minus-circle` →
  `az az-circle-minus`, `pi pi-times` → `az az-x`, `pi pi-twitter` → `az az-x-brand`; the map is
  `src/cli/migrations/v6-icons.json`). A `pi-<name>` outside a pair, and a third-party mark with no
  Azion glyph, is listed to fix by hand;
- Azion icons: the base classes are `az` and `az-color` (`ai ai-<name>` → `az az-<name>`,
  `ai-cor ai-<name>` → `az-color az-<name>`), product icons take today's product names
  (`ai ai-edge-functions` → `az az-functions`, `ai ai-edge-application` → `az az-applications`,
  `ai ai-edge-storage` → `az az-object-storage`, `ai ai-edge-sql` → `az az-sql-database`), and
  glyphs take their v6 name (`ai ai-times` → `az az-x`, `ai ai-cog` → `az az-settings`,
  `ai ai-angle-down` → `az az-chevron-down`; colour logos `ai-cor ai-next` → `az-color az-nextjs`).
  The v5 X mark `ai ai-x` becomes `az az-x-brand` only when `package.json` shows WebKit 5 (or
  `--from 5`), because `az-x` is the close glyph in v6; otherwise it becomes `az az-x` and is
  listed to check by hand;
- theme tokens and utilities, in every `.vue`, `.ts`, `.js`, `.css`, `.scss` and `.html` file:
  `--primary-contrast` → `--primary-foreground`, `--spacing-xxs` → `--spacing-2xs`,
  `text-heading-xxs` → `text-heading-2xs`, `animate-slide-in-left` → `animate-slide-in-start`, and
  the `@aziontech/theme/texts` / `layouts` imports (the map is `src/cli/migrations/v6-tokens.json`).
  A removed token (`--line-height-*`, `.azion-dark`, …) is listed to fix by hand;
- renamed WebKit lint rule ids, in every source file (ESLint configs and `eslint-disable` comments):
  `webkit/valid-import-path` → `webkit/no-unknown-import`, … (section 4, "Lint rules renamed"; the
  map is `src/cli/migrations/v6-lint.json`).

It prints `MANUAL` for anything it cannot rewrite safely (section 4), and for any import that v6
does not export. A renamed value is rewritten in a static attribute (`severity="error"`) and in a
bound single literal (`:severity="'error'"`). A bound expression whose strings are all v6 values
(`:severity="ok ? 'success' : 'neutral'"`) is left alone; one that holds an old value
(`:severity="ok ? 'info' : 'error'"`) is listed as `MANUAL`, because its strings may be your own
values; one with no strings at all (`:severity="level"`) is listed once to review, and
`webkit check` reports it as a warning. Put `<!-- webkit-migrate-ok -->` on the line above the tag
once you have checked it (also for an old value kept only in a comparison, such as
`x === 'error' ? 'danger' : 'info'`), and neither `migrate` nor `check` lists it again.

The codemod rewrites v5 code. It reads the version your `package.json` declares: a semver range,
the version in an `aziontech-webkit-<version>.tgz` tarball name, or the installed copy in
`node_modules` for a `file:`, `link:` or `workspace:` dependency (or, once you have bumped it,
recognizes a v3 project by its v3-only imports such as `inputtext` or `plugin`). When it cannot
tell, it says so; pass `--from 3` or `--from 5` to say it yourself. On a v3 project it moves the native components off
their category paths (`actions/button` → `button`, `content/card-box` → `card`,
`actions/segmented-button` → `toggle-group`, …) and lists every PrimeVue-era import (`dropdown`,
`divider`, `inputtext`, `field-text`, `use-toast`, …) as `MANUAL` with its v6 replacement, since the
same path now holds a component with another API. Run it once: a second run on a v3 project lists
the paths it moved onto a name a v3 wrapper also used (`button`, `card`, `dialog`) as `MANUAL` again.

## 2. Renamed components

| v5 import                               | v6 import                                  | v5 component         | v6 component           |
| --------------------------------------- | ------------------------------------------ | -------------------- | ---------------------- |
| `@aziontech/webkit/paginator`           | `@aziontech/webkit/pagination`             | `Paginator`          | `Pagination`           |
| `@aziontech/webkit/tab-view`            | `@aziontech/webkit/tabs`                   | `TabView`            | `Tabs`                 |
| `@aziontech/webkit/card-box`            | `@aziontech/webkit/card`                   | `CardBox`            | `Card`                 |
| `@aziontech/webkit/message`             | `@aziontech/webkit/alert`                  | `Message`            | `Alert`                |
| `@aziontech/webkit/divider`             | `@aziontech/webkit/separator`              | `Divider`            | `Separator`            |
| `@aziontech/webkit/progress-bar`        | `@aziontech/webkit/progress`               | `ProgressBar`        | `Progress`             |
| `@aziontech/webkit/command-menu`        | `@aziontech/webkit/command`                | `CommandMenu`        | `Command`              |
| `@aziontech/webkit/dropdown`            | `@aziontech/webkit/dropdown-menu`          | `Dropdown`           | `DropdownMenu`         |
| `@aziontech/webkit/input-text`          | `@aziontech/webkit/input`                  | `InputText`          | `Input`                |
| `@aziontech/webkit/input-number`        | `@aziontech/webkit/number-input`           | `InputNumber`        | `NumberInput`          |
| `@aziontech/webkit/input-password`      | `@aziontech/webkit/password-input`         | `InputPassword`      | `PasswordInput`        |
| `@aziontech/webkit/box-grid-selection`  | `@aziontech/webkit/radio-group`            | `BoxGridSelection`   | `RadioGroup`           |
| `@aziontech/webkit/calendar`            | `@aziontech/webkit/date-picker`            | `Calendar`           | `DatePicker`           |
| `@aziontech/webkit/pick-list`           | `@aziontech/webkit/transfer-list`          | `PickList`           | `TransferList`         |
| `@aziontech/webkit/radio-cards`         | `@aziontech/webkit/radio-group`            | `RadioCards`         | `RadioGroup`           |
| `@aziontech/webkit/radio-button`        | `@aziontech/webkit/radio-group-item`       | `RadioButton`        | `RadioGroup.Item`      |
| `@aziontech/webkit/resizable-panel`     | `@aziontech/webkit/resizable`              | `ResizablePanel`     | `Resizable`            |
| `@aziontech/webkit/segmented-button`    | `@aziontech/webkit/toggle-group`           | `SegmentedButton`    | `ToggleGroup`          |
| `@aziontech/webkit/doc-pagination`      | `@aziontech/webkit/doc-previous-next`      | `DocPagination`      | `DocPreviousNext`      |
| `@aziontech/webkit/cards`               | `@aziontech/webkit/card-list`              | `Cards`              | `CardList`             |
| `@aziontech/webkit/menu`                | `@aziontech/webkit/sidebar-menu`           | `Menu`               | `SidebarMenu`          |
| `@aziontech/webkit/action-confirmation` | `@aziontech/webkit/tool-approval`          | `ActionConfirmation` | `ToolApproval`         |
| `@aziontech/webkit/hotspot`             | `@aziontech/webkit/tutorial-panel-hotspot` | `Hotspot`            | `TutorialPanelHotspot` |

### Naming standard: renamed components

One name per job, the same word across the catalog. `webkit migrate` rewrites each import, the
component binding, its parts (`Flow.Node` → `FlowDiagram.Node`, `@aziontech/webkit/log-view-header`
→ `@aziontech/webkit/log-viewer-header`) and its exported types (`LogViewLine` → `LogViewerLine`,
`BoardLayoutItem` → `DashboardGridLayoutItem`).

| Old import                                            | New import                                         | Old component                        | New component                                      |
| ----------------------------------------------------- | -------------------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| `@aziontech/webkit/global-header`                     | `@aziontech/webkit/app-header`                     | `GlobalHeader`                       | `AppHeader`                                        |
| `@aziontech/webkit/table-export`                      | `@aziontech/webkit/table-export-button`            | `TableExport`                        | `TableExportButton`                                |
| `@aziontech/webkit/overline`                          | `@aziontech/webkit/eyebrow`                        | `Overline`                           | `Eyebrow`                                          |
| `@aziontech/webkit/card-pricing`                      | `@aziontech/webkit/pricing-card`                   | `CardPricing`                        | `PricingCard`                                      |
| `@aziontech/webkit/button-highlight`                  | `@aziontech/webkit/highlight-button`               | `ButtonHighlight`                    | `HighlightButton`                                  |
| `@aziontech/webkit/site-nav`                          | `@aziontech/webkit/site-header-section`            | `SiteNav`                            | `SiteHeaderSection`                                |
| `@aziontech/webkit/setting-row`                       | `@aziontech/webkit/settings-row`                   | `SettingRow`                         | `SettingsRow`                                      |
| `@aziontech/webkit/hero-band`                         | `@aziontech/webkit/hero-section`                   | `HeroBand`                           | `HeroSection`                                      |
| `@aziontech/webkit/stats-band`                        | `@aziontech/webkit/stats-section`                  | `StatsBand`                          | `StatsSection`                                     |
| `@aziontech/webkit/media-split-band`                  | `@aziontech/webkit/media-split-section`            | `MediaSplitBand`                     | `MediaSplitSection`                                |
| `@aziontech/webkit/logo-wall-quote`                   | `@aziontech/webkit/logo-wall-section`              | `LogoWallQuote`                      | `LogoWallSection`                                  |
| `@aziontech/webkit/band-stack`                        | `@aziontech/webkit/section-stack`                  | `BandStack`                          | `SectionStack`                                     |
| `@aziontech/webkit/big-numbers`                       | `@aziontech/webkit/stats`                          | `BigNumbers`                         | `Stats`                                            |
| `@aziontech/webkit/closing-call-to-action-newsletter` | `@aziontech/webkit/newsletter-section`             | `ClosingCallToActionNewsletter`      | `NewsletterSection`                                |
| `@aziontech/webkit/ticker`                            | `@aziontech/webkit/marquee`                        | `Ticker`                             | `Marquee`                                          |
| `@aziontech/webkit/texture-material`                  | `@aziontech/webkit/texture`                        | `TextureMaterial`                    | `Texture`                                          |
| `@aziontech/webkit/banner-art`                        | `@aziontech/webkit/backdrop`                       | `BannerArt`                          | `Backdrop`                                         |
| `@aziontech/webkit/frame-box`                         | `@aziontech/webkit/registration-frame`             | `FrameBox`                           | `RegistrationFrame`                                |
| `@aziontech/webkit/board`                             | `@aziontech/webkit/dashboard-grid`                 | `Board`                              | `DashboardGrid`                                    |
| `@aziontech/webkit/flow`                              | `@aziontech/webkit/flow-diagram`                   | `Flow`                               | `FlowDiagram`                                      |
| `@aziontech/webkit/currency`                          | `@aziontech/webkit/currency-amount`                | `Currency`                           | `CurrencyAmount`                                   |
| `@aziontech/webkit/doc-update`                        | `@aziontech/webkit/doc-changelog-entry`            | `DocUpdate`                          | `DocChangelogEntry`                                |
| `@aziontech/webkit/doc-accordion-item`                | `@aziontech/webkit/doc-accordion`                  | `DocAccordionItem`                   | `DocAccordion`                                     |
| `@aziontech/webkit/console-panel`                     | `@aziontech/webkit/console-showcase-section`       | `ConsolePanel`                       | `ConsoleShowcaseSection`                           |
| `@aziontech/webkit/compare-plans`                     | `@aziontech/webkit/plan-comparison-section`        | `ComparePlans`                       | `PlanComparisonSection`                            |
| `@aziontech/webkit/comparison-table`                  | `@aziontech/webkit/competitor-comparison-section`  | `ComparisonTable`                    | `CompetitorComparisonSection`                      |
| `@aziontech/webkit/compliance-badges`                 | `@aziontech/webkit/compliance-logos-section`       | `ComplianceBadges`                   | `ComplianceLogosSection`                           |
| `@aziontech/webkit/section-command`                   | `@aziontech/webkit/copy-command-section`           | `SectionCommand`                     | `CopyCommandSection`                               |
| `@aziontech/webkit/client-mosaic-columns`             | `@aziontech/webkit/client-story-columns-section`   | `ClientMosaicColumns`                | `ClientStoryColumnsSection`                        |
| `@aziontech/webkit/story-library`                     | `@aziontech/webkit/story-index-section`            | `StoryLibrary`                       | `StoryIndexSection`                                |
| `@aziontech/webkit/listing-browser`                   | `@aziontech/webkit/listing-index-section`          | `ListingBrowser`                     | `ListingIndexSection`                              |
| `@aziontech/webkit/subject-library`                   | `@aziontech/webkit/subject-grid-section`           | `SubjectLibrary`                     | `SubjectGridSection`                               |
| `@aziontech/webkit/feature-list`                      | `@aziontech/webkit/plan-feature-list`              | `FeatureList`                        | `PlanFeatureList`                                  |
| `@aziontech/webkit/topic`                             | `@aziontech/webkit/feature-item`                   | `Topic`                              | `FeatureItem`                                      |
| `@aziontech/webkit/column-navigation`                 | `@aziontech/webkit/link-directory`                 | `ColumnNavigation`                   | `LinkDirectory`                                    |
| `@aziontech/webkit/product-widget`                    | `@aziontech/webkit/console-mockup`                 | `ProductWidget`                      | `ConsoleMockup`                                    |
| `@aziontech/webkit/log-view`                          | `@aziontech/webkit/log-viewer`                     | `LogView`                            | `LogViewer`                                        |
| `@aziontech/webkit/ai-loading`                        | `@aziontech/webkit/response-loading`               | `AiLoading`                          | `ResponseLoading`                                  |
| `@aziontech/webkit/outcome-mark`                      | `@aziontech/webkit/outcome-icon`                   | `OutcomeMark`                        | `OutcomeIcon`                                      |
| `@aziontech/webkit/use-cases`                         | `@aziontech/webkit/customer-use-cases-section`     | `UseCases`                           | `CustomerUseCasesSection`                          |
| `@aziontech/webkit/hero-form`                         | `@aziontech/webkit/hero-form-section`              | `HeroForm`                           | `HeroFormSection`                                  |
| `@aziontech/webkit/media-split-stack`                 | `@aziontech/webkit/media-split-stack-section`      | `MediaSplitStack`                    | `MediaSplitStackSection`                           |
| `@aziontech/webkit/doc-prev-next`                     | `@aziontech/webkit/doc-previous-next`              | `DocPrevNext`                        | `DocPreviousNext`                                  |
| `@aziontech/webkit/use-heading-nav`                   | `@aziontech/webkit/use-heading-navigation`         | `useHeadingNav`, `provideHeadingNav` | `useHeadingNavigation`, `provideHeadingNavigation` |
| `@aziontech/webkit/architecture-tabs`                 | `@aziontech/webkit/architecture-tabs-section`      | `ArchitectureTabs`                   | `ArchitectureTabsSection`                          |
| `@aziontech/webkit/article-body`                      | `@aziontech/webkit/article-body-section`           | `ArticleBody`                        | `ArticleBodySection`                               |
| `@aziontech/webkit/article-cards`                     | `@aziontech/webkit/article-cards-section`          | `ArticleCards`                       | `ArticleCardsSection`                              |
| `@aziontech/webkit/article-highlight`                 | `@aziontech/webkit/article-highlight-section`      | `ArticleHighlight`                   | `ArticleHighlightSection`                          |
| `@aziontech/webkit/article-index`                     | `@aziontech/webkit/article-index-section`          | `ArticleIndex`                       | `ArticleIndexSection`                              |
| `@aziontech/webkit/capability-grid`                   | `@aziontech/webkit/capability-grid-section`        | `CapabilityGrid`                     | `CapabilityGridSection`                            |
| `@aziontech/webkit/card-carousel`                     | `@aziontech/webkit/card-carousel-section`          | `CardCarousel`                       | `CardCarouselSection`                              |
| `@aziontech/webkit/cli-terminal`                      | `@aziontech/webkit/cli-terminal-section`           | `CliTerminal`                        | `CliTerminalSection`                               |
| `@aziontech/webkit/client-mosaic`                     | `@aziontech/webkit/client-mosaic-section`          | `ClientMosaic`                       | `ClientMosaicSection`                              |
| `@aziontech/webkit/client-quotes`                     | `@aziontech/webkit/client-quotes-section`          | `ClientQuotes`                       | `ClientQuotesSection`                              |
| `@aziontech/webkit/client-story-columns`              | `@aziontech/webkit/client-story-columns-section`   | `ClientStoryColumns`                 | `ClientStoryColumnsSection`                        |
| `@aziontech/webkit/closing-call-to-action`            | `@aziontech/webkit/closing-call-to-action-section` | `ClosingCallToAction`                | `ClosingCallToActionSection`                       |
| `@aziontech/webkit/competitor-comparison`             | `@aziontech/webkit/competitor-comparison-section`  | `CompetitorComparison`               | `CompetitorComparisonSection`                      |
| `@aziontech/webkit/compliance-logos`                  | `@aziontech/webkit/compliance-logos-section`       | `ComplianceLogos`                    | `ComplianceLogosSection`                           |
| `@aziontech/webkit/console-showcase`                  | `@aziontech/webkit/console-showcase-section`       | `ConsoleShowcase`                    | `ConsoleShowcaseSection`                           |
| `@aziontech/webkit/contact-hub`                       | `@aziontech/webkit/contact-hub-section`            | `ContactHub`                         | `ContactHubSection`                                |
| `@aziontech/webkit/copy-command`                      | `@aziontech/webkit/copy-command-section`           | `CopyCommand`                        | `CopyCommandSection`                               |
| `@aziontech/webkit/customer-use-cases`                | `@aziontech/webkit/customer-use-cases-section`     | `CustomerUseCases`                   | `CustomerUseCasesSection`                          |
| `@aziontech/webkit/feature-scroll`                    | `@aziontech/webkit/feature-scroll-section`         | `FeatureScroll`                      | `FeatureScrollSection`                             |
| `@aziontech/webkit/feature-tabs`                      | `@aziontech/webkit/feature-tabs-section`           | `FeatureTabs`                        | `FeatureTabsSection`                               |
| `@aziontech/webkit/feature-tiles`                     | `@aziontech/webkit/feature-tiles-section`          | `FeatureTiles`                       | `FeatureTilesSection`                              |
| `@aziontech/webkit/feature-widgets`                   | `@aziontech/webkit/feature-widgets-section`        | `FeatureWidgets`                     | `FeatureWidgetsSection`                            |
| `@aziontech/webkit/investor-marks`                    | `@aziontech/webkit/investor-marks-section`         | `InvestorMarks`                      | `InvestorMarksSection`                             |
| `@aziontech/webkit/job-posting`                       | `@aziontech/webkit/job-posting-section`            | `JobPosting`                         | `JobPostingSection`                                |
| `@aziontech/webkit/listing-index`                     | `@aziontech/webkit/listing-index-section`          | `ListingIndex`                       | `ListingIndexSection`                              |
| `@aziontech/webkit/listing-table`                     | `@aziontech/webkit/listing-table-section`          | `ListingTable`                       | `ListingTableSection`                              |
| `@aziontech/webkit/photo-marquee`                     | `@aziontech/webkit/photo-marquee-section`          | `PhotoMarquee`                       | `PhotoMarqueeSection`                              |
| `@aziontech/webkit/plan-comparison`                   | `@aziontech/webkit/plan-comparison-section`        | `PlanComparison`                     | `PlanComparisonSection`                            |
| `@aziontech/webkit/platform-directory`                | `@aziontech/webkit/platform-directory-section`     | `PlatformDirectory`                  | `PlatformDirectorySection`                         |
| `@aziontech/webkit/pricing-plans`                     | `@aziontech/webkit/pricing-plans-section`          | `PricingPlans`                       | `PricingPlansSection`                              |
| `@aziontech/webkit/process-scroll`                    | `@aziontech/webkit/process-scroll-section`         | `ProcessScroll`                      | `ProcessScrollSection`                             |
| `@aziontech/webkit/recognition-marquee`               | `@aziontech/webkit/recognition-marquee-section`    | `RecognitionMarquee`                 | `RecognitionMarqueeSection`                        |
| `@aziontech/webkit/site-footer`                       | `@aziontech/webkit/site-footer-section`            | `SiteFooter`                         | `SiteFooterSection`                                |
| `@aziontech/webkit/site-header`                       | `@aziontech/webkit/site-header-section`            | `SiteHeader`                         | `SiteHeaderSection`                                |
| `@aziontech/webkit/story-index`                       | `@aziontech/webkit/story-index-section`            | `StoryIndex`                         | `StoryIndexSection`                                |
| `@aziontech/webkit/subject-grid`                      | `@aziontech/webkit/subject-grid-section`           | `SubjectGrid`                        | `SubjectGridSection`                               |
| `@aziontech/webkit/template-gallery`                  | `@aziontech/webkit/template-gallery-section`       | `TemplateGallery`                    | `TemplateGallerySection`                           |

Every marketing page section ends in `-section` (`hero-band` → `hero-section`, `client-quotes` →
`client-quotes-section`, `site-header` → `site-header-section`, …). The section's exported types
move with it (`ClientQuotesItem` → `ClientQuotesSectionItem`; the codemod rewrites them; rename
`JobPostingSection` → `JobPostingSectionSection` and `PlanComparisonSection` →
`PlanComparisonSectionSection` by hand, as those old type names are now the component names), its
test id is the new name, and its locale namespace follows (`siteHeader.*` → `siteHeaderSection.*`,
`listingIndex.*` → `listingIndexSection.*`, … in a `ConfigProvider` `messages` override). Site page
JSON that still names an old `_id` keeps rendering: `SitePage` maps every old section id in the
table to its new one, and translates the renamed props and values of every section in `v6-props.json`
(`{ _id: 'hero-band', props: { kind: 'centered' } }` renders `hero-section` with `variant: 'center'`);
write the new `_id` and props in new pages. Hero, hero-section
and hero-form-section call their client strip `marquee` (`marquee`, `marqueeMarks`,
`marqueeLabel`), after the component.

`HelperText` (`@aziontech/webkit/helper-text`) is removed. Use `FieldDescription` (`Field.Description`)
for guidance and `FieldError` (`Field.Error`) for a validation message; both work outside a `Field`,
and inside one they wire `aria-describedby` for you. `type="helper"` → `FieldDescription`;
`type="invalid"` or `type="required"` → `FieldError`; `label="…"` becomes the default slot.

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

| Component              | v5                            | v6                               |
| ---------------------- | ----------------------------- | -------------------------------- |
| `accordion`            | `value`                       | `modelValue`                     |
| `alert`                | `severity="error"`            | `severity="danger"`              |
| `attribute-editor`     | `empty`                       | `emptyTitle`                     |
| `badge`                | `severity=default`            | `severity=neutral`               |
| `backdrop`             | `art`, `kind`                 | `variant`                        |
| `button`               | `kind="text"`                 | `variant="ghost"`                |
| `pricing-card`         | `planTitle`                   | `title`                          |
| `checkbox`             | `inputId`                     | `id`                             |
| `code-block`           | `border`                      | `bordered`                       |
| `code-block`           | `value`                       | `modelValue`                     |
| `combobox`             | `emptyText`                   | `emptyTitle`                     |
| `console-layout`       | `v-model:navigation-expanded` | `v-model:navigation-open`        |
| `conversation-history` | `label`                       | `ariaLabel`                      |
| `doc-card`             | `link`                        | `linkLabel`                      |
| `doc-card`             | `overline`                    | `eyebrow`                        |
| `doc-card-group`       | `cols`                        | `columns`                        |
| `doc-card-group`       | `mobileCols`                  | `mobileColumns`                  |
| `doc-heading`          | `id`                          | `anchor`                         |
| `dropdown-menu`        | `placement`, `offset`         | `side` + `align`, `sideOffset`   |
| `file-token-group`     | `alignment`                   | `orientation`                    |
| `hint`                 | `placement`                   | `side`                           |
| `hover-card`           | `placement`, `offset`         | `side` + `align`, `sideOffset`   |
| `item`                 | `kind="outline"`              | `variant="outline"`              |
| `log-viewer`           | `border`                      | `bordered`                       |
| `log-viewer`           | `showCopy`                    | `copyable`                       |
| `media-tabs`           | `autoPlayInterval`            | `autoplayInterval`               |
| `media-tabs`           | `autoPlay`                    | `autoplay`                       |
| `multi-select`         | `emptyText`                   | `emptyTitle`                     |
| `navigation-menu`      | `value`                       | `modelValue`                     |
| `overline`             | `showCursor`                  | `cursor`                         |
| `payment-brand`        | `label`                       | `ariaLabel`                      |
| `popover`              | `placement`, `offset`         | `side` + `align`, `sideOffset`   |
| `popover`              | `width`                       | `size`                           |
| `progress`             | `shape`, `kind`               | `variant`                        |
| `qr-code`              | `label`                       | `ariaLabel`                      |
| `quote-tabs`           | `autoPlayInterval`            | `autoplayInterval`               |
| `quote-tabs`           | `autoPlay`                    | `autoplay`                       |
| `response-branches`    | `label`                       | `ariaLabel`                      |
| `severity-tag`         | `level`                       | `severity`                       |
| `skeleton`             | `kind="shape"`                | `variant="rectangle"`            |
| `split-button`         | `model`                       | `items`                          |
| `table`                | `border`                      | `bordered`                       |
| `tabs`                 | `value`                       | `modelValue`                     |
| `textarea`             | `resizable`                   | `resize`                         |
| `theme-switcher`       | `value`                       | `modelValue`                     |
| `tooltip`              | `placement`                   | `side` (+ `align`, `sideOffset`) |
| `wizard`               | `v-model:activeStep`          | `v-model`                        |

### Overlays: `side` and `align` replace `placement`

Every anchored overlay takes the same three props, shaped like Radix and shadcn: `side`
(`top · bottom · start · end`, or `auto` for the side with the most room), `align`
(`start · center · end`) and `sideOffset` (the gap in px). `Tooltip`, `Hint`, `Popover`,
`HoverCard`, `DropdownMenu` and `NavigationMenu.Viewport` share them, and Select, Combobox,
MultiSelect, the date pickers, PropertyFilter, ContextMenu and DropdownMenu sub-menus anchor
through the same engine (`usePlacement`). The codemod splits the old value:
`placement="bottom-end"` becomes `side="bottom" align="end"`, `placement="right-start"` becomes
`side="end" align="start"`, `placement="left"` becomes `side="start"`, and `offset` becomes
`sideOffset`. A bound `:placement` is renamed to `:side`, and a bound single literal (`:placement="'left'"`) is
mapped; any other expression (`:placement="open ? 'top-end' : 'bottom'"`) is listed as `MANUAL` for
you to split.

`start` and `end` follow the text direction. Under `dir="rtl"` `side="end"` opens on the left and
`align="start"` lines the panel up with the trigger's right edge, so a panel that was
`placement="bottom-start"` now opens from the right edge of its trigger in a right-to-left page
(it stayed on the left in v5). Drop any `dir === 'rtl' ? 'left' : 'right'` you wrote to fix
this by hand: write `side="end"`. The panels render `data-side` and `data-align` (the resolved,
logical values) instead of `data-placement`. The types follow: `TooltipSide`, `PopoverSide`,
`HoverCardSide`, `DropdownMenuSide` and `HintSide` (`top · bottom · start · end`; the prop is
`XSide | 'auto'`) plus `PopoverAlign`, `HoverCardAlign`, `DropdownMenuAlign` and `TooltipAlign`
replace `*Placement` and `*PlacementSide`. `usePlacement` from `@aziontech/webkit/use-placement`
takes `side`, `align`, `sideOffset`, `alignOffset`, `autoSides` and an optional `dir`, and returns
`resolvedSide` and `resolvedAlign` instead of `resolvedPlacement`.

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
`table-filter`, `dropdown-menu-option`, `chart-axis`, `chart-bar`, `field-legend`,
`donut-chart`, `spark-chart`, `code-block`, `doc-code-group`, `artifact-canvas`,
`sidebar-menu-sub-trigger` and `item-media`; every other `kind` becomes `variant`. Section props
follow suit: `titleKind` → `titleAlign` (`capability-grid-section`, `console-showcase-section`, `process-scroll-section`,
`feature-widgets-section`; it only ever aligned the title, so it is not a look), `kind` → `align` on
`section-title`, `section-module` and `article-cards-section`, `quoteKind` → `quoteVariant` (`logo-wall-section`), `rowKind` → `rowVariant`
(`article-index-section`). The codemod rewrites the attributes, their static values and a bound single literal
(`:kind="'text'"`; other bound expressions are listed as `MANUAL`), and every `*Kind` type you import (`ButtonKind` →
`ButtonVariant`, `TableCellKind` → `TableCellType`).

The codemod cannot see data objects, so rename the field by hand where you build one:

| Data                                                                  | v5 / 6.0-beta                     | v6                                   |
| --------------------------------------------------------------------- | --------------------------------- | ------------------------------------ |
| `DataTable` / `useCollection` column                                  | `kind: 'action'`                  | `type: 'action'`                     |
| `SidebarMenu` / `ConsoleLayout` / `DocLayout` navigation node         | `kind: 'drill'`                   | `type: 'drill'`                      |
| `FilterMenu` field                                                    | `kind: 'multiple'`                | `type: 'multiple'`                   |
| `HeroFormSection` / `JobPostingSection` field                         | `kind: 'email'`                   | `type: 'email'`                      |
| `Diagram` node / group                                                | `kind: 'pill'` / `kind: 'dashed'` | `type: 'pill'` / `variant: 'dashed'` |
| section action (`primaryAction`, `secondaryAction`, audience actions) | `kind: 'outlined'`                | `variant: 'outline'`                 |
| `SiteLayout` `footer`                                                 | `kind: 'site'`                    | `variant: 'site'`                    |
| `ConfirmDialog` options of `useUnsavedChanges`                        | `kind: 'danger'`                  | `variant: 'danger'`                  |
| `SitePage` section `props`                                            | `kind: 'title-band'`              | `variant: 'title-band'`              |

### Renamed types

The codemod rewrites these where you import them, together with the component they belong to (the
types this guide names elsewhere are left out):

Props and events whose type is only renamed keep their shape: `Sources` `items` and `StreamingResponse`
`sources` take `SourcesItem[]` (was `AiSource[]`); `DocOnThisPage` `items`, `groups` and the `select`
payload take `DocOnThisPageItem` / `DocOnThisPageGroup` (was `DocTocItem` / `DocTocGroup`);
`ContextMenu` and `ContextMenuRoot` `select` pass a `DropdownMenuItemValue` (was
`DropdownMenuOptionValue`); `CliTerminalSection` `primaryAction` is a `SectionTitleAction` (was
`CliTerminalAction`).

| v5 type                                | v6 type                                        |
| -------------------------------------- | ---------------------------------------------- |
| `AppliedFilter`                        | `TableAppliedFilter`                           |
| `ArchitectureTabsAction`               | `SectionTitleAction`                           |
| `ArticleBodyCrumb`                     | `BreadcrumbItemData`                           |
| `ArticleCardsMark`                     | `ThirdPartyLogoMark`                           |
| `ArticleIndexBlogAuthor`               | `ArticleIndexSectionAuthor`                    |
| `ArticleIndexBlogEmpty`                | `ArticleIndexSectionEmpty`                     |
| `ArticleIndexBlogMark`                 | `ThirdPartyLogoMark`                           |
| `ArticleIndexBlogRowKind`              | `ArticleIndexSectionRowKind`                   |
| `ArticleIndexBlogSearch`               | `ArticleIndexSectionSearch`                    |
| `ArticleIndexResourceHubEmpty`         | `ArticleIndexSectionEmpty`                     |
| `ArticleIndexResourceHubFacet`         | `ArticleIndexSectionFacet`                     |
| `ArticleIndexResourceHubItem`          | `ArticleIndexSectionItem`                      |
| `ArticleIndexResourceHubMark`          | `ThirdPartyLogoMark`                           |
| `ArticleIndexResourceHubRowKind`       | `ArticleIndexSectionRowKind`                   |
| `BoxGridSelectionItem`                 | `RadioGroupOption`                             |
| `CalendarMonth`                        | `DatePickerMonth`                              |
| `CalendarOrientation`                  | `DatePickerOrientation`                        |
| `CalendarProps`                        | `DatePickerProps`                              |
| `CalendarSize`                         | `DatePickerSize`                               |
| `CalendarValue`                        | `DatePickerValue`                              |
| `CardsItemSlotProps`                   | `CardListItemSlotProps`                        |
| `CardsSelectionMode`                   | `CardListSelectionMode`                        |
| `ClientMosaicColumnsLogoTreatment`     | `ThirdPartyLogoTreatment`                      |
| `ClientMosaicLogoTreatment`            | `ThirdPartyLogoTreatment`                      |
| `ClientQuotesAction`                   | `SectionTitleAction`                           |
| `CliTerminalAction`                    | `SectionTitleAction`                           |
| `ClosingCallToActionAction`            | `SectionTitleAction`                           |
| `ClosingCallToActionAgentsAction`      | `ClosingCallToActionSectionAudienceAction`     |
| `ClosingCallToActionAgentsActionKind`  | `ClosingCallToActionSectionAudienceActionKind` |
| `ClosingCallToActionAgentsAudience`    | `ClosingCallToActionSectionAudience`           |
| `ClosingCallToActionAgentsCopy`        | `ClosingCallToActionSectionAudienceCopy`       |
| `ClosingCallToActionTemplatesAction`   | `SectionTitleAction`                           |
| `ClosingCallToActionTemplatesTemplate` | `TemplateGallerySectionTemplate`               |
| `CodeSplitAction`                      | `MediaSplitSectionAction`                      |
| `CodeSplitActionKind`                  | `MediaSplitSectionActionKind`                  |
| `CollectionCardsProps`                 | `CollectionCardListProps`                      |
| `CommandMenuContext`                   | `CommandContext`                               |
| `CommandMenuItemValue`                 | `CommandItemValue`                             |
| `CommandMenuRegisteredItem`            | `CommandRegisteredItem`                        |
| `ComparePlansAction`                   | `SectionTitleAction`                           |
| `CompareSupportTiersAction`            | `SectionTitleAction`                           |
| `CompareSupportTiersRow`               | `PlanComparisonSectionRow`                     |
| `CompareSupportTiersSection`           | `PlanComparisonSectionSection`                 |
| `CompareSupportTiersTier`              | `PlanComparisonSectionPlan`                    |
| `CompareSupportTiersValue`             | `PlanComparisonSectionValue`                   |
| `ComplianceBadgesAction`               | `SectionTitleAction`                           |
| `ContactHubAction`                     | `SectionTitleAction`                           |
| `ContentColumnsItem`                   | `CapabilityGridSectionItem`                    |
| `Country`                              | `PhoneInputCountry`                            |
| `DocCardGroupCols`                     | `DocCardGroupColumns`                          |
| `DocCrumb`                             | `BreadcrumbItemData`                           |
| `DocPageAction`                        | `DocPageHeaderAction`                          |
| `DocPageLink`                          | `DocPreviousNextLink`                          |
| `DocTocGroup`                          | `DocOnThisPageGroup`                           |
| `DocTocItem`                           | `DocOnThisPageItem`                            |
| `DocTocLink`                           | `DocOnThisPageLink`                            |
| `DropdownContext`                      | `DropdownMenuContext`                          |
| `DropdownOptionValue`                  | `DropdownMenuOptionValue`                      |
| `DropdownPlacement`                    | `DropdownMenuSide`                             |
| `DropdownPlacementInput`               | `DropdownMenuSide`                             |
| `FeatureTabsAction`                    | `SectionTitleAction`                           |
| `FeatureWidgetsAction`                 | `SectionTitleAction`                           |
| `FilterField`                          | `TableFilterField`                             |
| `FilterOperator`                       | `TableFilterOperator`                          |
| `FilterValue`                          | `TableFilterValue`                             |
| `HeroBandAction`                       | `SectionTitleAction`                           |
| `HeroCopyOnTopArtAction`               | `SectionTitleAction`                           |
| `HeroCopyOnTopArtLevel`                | `HeroSectionLevel`                             |
| `HeroCopyOnTopArtNode`                 | `HeroSectionNode`                              |
| `HeroWithOpeningAction`                | `SectionTitleAction`                           |
| `HeroWithOpeningItem`                  | `HeroSectionItem`                              |
| `HeroWithOpeningTitleLength`           | `HeroSectionTitleLength`                       |
| `InputNumberSize`                      | `NumberInputSize`                              |
| `InputPasswordAutocomplete`            | `PasswordInputAutocomplete`                    |
| `InputTextSize`                        | `InputSize`                                    |
| `InputTextType`                        | `InputType`                                    |
| `ListingTableAction`                   | `SectionTitleAction`                           |
| `LogoWallQuoteAction`                  | `SectionTitleAction`                           |
| `LogoWallQuoteLogoTreatment`           | `ThirdPartyLogoTreatment`                      |
| `MediaSplitStackAction`                | `SectionTitleAction`                           |
| `MessageSeverity`                      | `AlertSeverity`                                |
| `MessageSize`                          | `AlertSize`                                    |
| `MoveDirection`                        | `TransferListMoveDirection`                    |
| `NetworkSectionLogoTreatment`          | `ThirdPartyLogoTreatment`                      |
| `PaginatorContext`                     | `PaginationContext`                            |
| `PasswordRequirement`                  | `PasswordRequirementsRule`                     |
| `PhoneNumber`                          | `PhoneInputValue`                              |
| `PickListContext`                      | `TransferListContext`                          |
| `PickListItems`                        | `TransferListItems`                            |
| `PickListSide`                         | `TransferListSide`                             |
| `PickListValue`                        | `TransferListValue`                            |
| `PopoverPlacementInput`                | `PopoverSide`                                  |
| `PricingPlansAction`                   | `SectionTitleAction`                           |
| `ProgressBarShape`                     | `ProgressKind`                                 |
| `ProgressBarSize`                      | `ProgressSize`                                 |
| `ResizablePanelContext`                | `ResizableContext`                             |
| `ResizablePanelOrientation`            | `ResizableOrientation`                         |
| `ResizablePanelPaneApi`                | `ResizablePaneApi`                             |
| `ResourceGridAction`                   | `CapabilityGridSectionAction`                  |
| `ResourceGridItem`                     | `CapabilityGridSectionItem`                    |
| `SegmentedButtonSize`                  | `ToggleGroupSize`                              |
| `SortDirection`                        | `TableSortDirection`                           |
| `StickyScrollCodeAction`               | `FeatureScrollSectionAction`                   |
| `StickyScrollCodeActionKind`           | `FeatureScrollSectionActionKind`               |
| `StickyScrollCodeItem`                 | `FeatureScrollSectionItem`                     |
| `StickyScrollCodeSample`               | `FeatureScrollSectionCode`                     |
| `StoryLibraryClient`                   | `ThirdPartyLogoMark`                           |
| `SubjectLibraryAction`                 | `SectionTitleAction`                           |
| `TabViewContext`                       | `TabsContext`                                  |
| `TabViewSlideDirection`                | `TabsSlideDirection`                           |
| `TabViewTabRegistration`               | `TabsTabRegistration`                          |
| `TabViewValue`                         | `TabsValue`                                    |
| `TemplateGalleryAction`                | `SectionTitleAction`                           |
| `TooltipPlacementInput`                | `TooltipSide`                                  |
| `UseCaseLinksItem`                     | `CapabilityGridSectionItem`                    |
| `UseCasesAction`                       | `SectionTitleAction`                           |

Every exported type starts with its component's name, and a shape several components shared is one
type now, exported by the component that owns it: a section's `primaryAction` / `secondaryAction`
is `SectionTitleAction` (`@aziontech/webkit/section-title`), a breadcrumb entry is
`BreadcrumbItemData`, a client mark `{ name, logo }` is `ThirdPartyLogoMark` and a mark's ink is
`ThirdPartyLogoTreatment` (`@aziontech/webkit/third-party-logo`). Each section still re-exports the shared type, so an
import the codemod rewrote keeps its path. `ThirdPartyLogoTreatment` uses the `ThirdPartyLogo` words: `as-is` is
`color`, and `logoTreatment: 'invert-light'` on a `LogoWallSection` mark is `artwork: 'light'`
(change those values by hand). The overlay position types are `TooltipSide`, `PopoverSide`,
`HoverCardSide`, `DropdownMenuSide` and `HintSide`, with `*Align` beside them (see "Overlays:
`side` and `align` replace `placement`"). Every root and public part exports its
props as `<Component>Props` (`ButtonProps`, `TableSearchProps`), re-exported by its compound entry;
there is no bare `Props` export.

### Old illustration names

Eight scenes are renamed for what they draw, and the old names no longer resolve: an old name renders
the placeholder frame and logs a warning. The codemod rewrites a static `name` on `Illustration` and
`illustration` on `HeroSection` and `MediaSplitSection`; rename the value by hand in page data and in
section item arrays (`items[].illustration`):

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

| Component                                                                                                  | v5                                                                               | v6                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat-message`                                                                                             | `state`                                                                          | `status` (`complete` → `success`)                                                                                                                                                                                            |
| `prompt-input`                                                                                             | `state`                                                                          | `status` (`submitted` → `pending`)                                                                                                                                                                                           |
| `tool-approval`                                                                                            | `state`                                                                          | `status`                                                                                                                                                                                                                     |
| `tool-call`                                                                                                | `state`                                                                          | `status`                                                                                                                                                                                                                     |
| `stepper-step`                                                                                             | `state`                                                                          | `status` (`upcoming` → `pending`, `complete` → `success`, `loading` → `running`; the step on screen is derived and renders `data-active`)                                                                                    |
| `upload-progress`                                                                                          | `v-model:expanded`                                                               | `v-model:open`                                                                                                                                                                                                               |
| `topology-diagram`                                                                                         | `v-model:expanded`                                                               | `v-model:open-keys` (`openKeys`, `string[]`)                                                                                                                                                                                 |
| `toast-item`                                                                                               | `type` / `severity="default"`                                                    | `severity="neutral"`; `severity="loading"` → the `loading` boolean prop (manual)                                                                                                                                             |
| `UploadProgressItem.status`                                                                                | `queued` / `done`                                                                | `pending` / `success` (manual, data)                                                                                                                                                                                         |
| `LogViewerStep`                                                                                            | `key`, `status: 'done' \| 'failed'`                                              | `id`, `status: 'success' \| 'error'` (manual, data)                                                                                                                                                                          |
| `TopologyNode`, `TopologyLevel`                                                                            | `key`                                                                            | `id` (manual, data); `bind` payload `{ key, value }` → `{ id, value }`                                                                                                                                                       |
| `TraceSpan.status`                                                                                         | `ok`                                                                             | `success` (manual, data)                                                                                                                                                                                                     |
| `toast()` store entry                                                                                      | `severity: 'default' \| 'loading'`                                               | `severity: 'neutral'` + `loading: true` (`toast.loading` and `toast.promise` set it)                                                                                                                                         |
| `console-mockup`                                                                                           | `hover`                                                                          | `hovered`                                                                                                                                                                                                                    |
| `console-mockup`                                                                                           | `interval`                                                                       | `autoplayInterval`                                                                                                                                                                                                           |
| `breadcrumb-item`                                                                                          | `current`                                                                        | `active`                                                                                                                                                                                                                     |
| `breadcrumb`                                                                                               | `items[].current`                                                                | `items[].active`                                                                                                                                                                                                             |
| `sidebar-menu-item`                                                                                        | `selected`                                                                       | `active`                                                                                                                                                                                                                     |
| `pagination-button`                                                                                        | `selected`                                                                       | `active`                                                                                                                                                                                                                     |
| `navigation-menu-list`                                                                                     | `highlight`                                                                      | `showHighlight`                                                                                                                                                                                                              |
| `navigation-menu-positioner`                                                                               | `disableAnchorTracking`                                                          | `trackAnchor` (inverted, default `true`)                                                                                                                                                                                     |
| `navigation-menu-positioner`                                                                               | `side="left"` / `side="right"`                                                   | `side="start"` / `side="end"`                                                                                                                                                                                                |
| `drawer`                                                                                                   | `side="left"` / `side="right"`                                                   | `side="start"` / `side="end"` (default `end`)                                                                                                                                                                                |
| `doc-layout`                                                                                               | `v-model:navigation-expanded`                                                    | `v-model:navigation-open`                                                                                                                                                                                                    |
| `app-layout`                                                                                               | `navigationLabel`                                                                | `navigationAriaLabel`                                                                                                                                                                                                        |
| `resizable-pane`                                                                                           | `v-model:expanded`                                                               | `v-model:open`                                                                                                                                                                                                               |
| `doc-page-header`                                                                                          | `breadcrumb`                                                                     | `breadcrumbs`                                                                                                                                                                                                                |
| `doc-previous-next`                                                                                        | `previous.title` / `next.title`                                                  | `previous.label` / `next.label`                                                                                                                                                                                              |
| `settings-row`                                                                                             | `level`                                                                          | `depth`                                                                                                                                                                                                                      |
| `accordion`                                                                                                | `arrowPosition="left" \| "right"`                                                | `iconPosition="leading" \| "trailing"`                                                                                                                                                                                       |
| `accordion-trigger`                                                                                        | `level`                                                                          | `headingLevel`                                                                                                                                                                                                               |
| `code-block`                                                                                               | `lineNumbers`                                                                    | `showLineNumbers`                                                                                                                                                                                                            |
| `code-editor`                                                                                              | `lineNumbers`                                                                    | `showLineNumbers`                                                                                                                                                                                                            |
| `command-group`                                                                                            | `heading`                                                                        | `label`                                                                                                                                                                                                                      |
| `help-panel-group`                                                                                         | `title`                                                                          | `label` (a group part names its header text `label`)                                                                                                                                                                         |
| `key-value-list-group`                                                                                     | `title`                                                                          | `label` (a group part names its header text `label`)                                                                                                                                                                         |
| `command-page`                                                                                             | `heading`                                                                        | `title`                                                                                                                                                                                                                      |
| `hint`                                                                                                     | `text`                                                                           | `content`                                                                                                                                                                                                                    |
| `tooltip`                                                                                                  | `text`                                                                           | `content`                                                                                                                                                                                                                    |
| `badge`                                                                                                    | `severity="primary"`, `severity="secondary"`                                     | `variant="primary"`, `variant="secondary"` (manual: `severity` now takes only `neutral`, `info`, `success`, `warning`, `danger` and wins over `variant`)                                                                     |
| `chart-bar`                                                                                                | `labeled`                                                                        | `show-labels`                                                                                                                                                                                                                |
| `tree`                                                                                                     | `v-model:expanded`                                                               | `v-model:open-keys`                                                                                                                                                                                                          |
| `sidebar-menu`                                                                                             | `v-model:expanded`                                                               | `v-model:open-keys` (`openKeys`, `string[]`)                                                                                                                                                                                 |
| `tree`                                                                                                     | `v-model:selected-ids`                                                           | `v-model:selected-keys`                                                                                                                                                                                                      |
| `card-list`                                                                                                | `track-by`                                                                       | `item-key`                                                                                                                                                                                                                   |
| `card-list`                                                                                                | `selection-mode="multi"`                                                         | `selection-mode="multiple"`                                                                                                                                                                                                  |
| `transfer-list`                                                                                            | `data-key` (v5 `PickList`)                                                       | `item-key`                                                                                                                                                                                                                   |
| `property-filter`                                                                                          | `hide-operations`                                                                | `:show-operations="false"` (default `true`)                                                                                                                                                                                  |
| `data-table`                                                                                               | `enable-sorting`                                                                 | `sortable`                                                                                                                                                                                                                   |
| `data-table`                                                                                               | `enable-row-selection`                                                           | `selectable`                                                                                                                                                                                                                 |
| `data-table`                                                                                               | column `enableSorting` (`TableColumn`)                                           | column `sortable`                                                                                                                                                                                                            |
| `data-grid`                                                                                                | `enable-row-selection`                                                           | `selectable`                                                                                                                                                                                                                 |
| `table-sort-button`                                                                                        | `direction`                                                                      | `sort-direction`                                                                                                                                                                                                             |
| `table-sort-button`                                                                                        | `visible`                                                                        | removed: `class="invisible"` hides it and keeps its space                                                                                                                                                                    |
| `use-collection`                                                                                           | `selection: { mode: 'multi' }`                                                   | `selection: { mode: 'multiple' }` (manual; `cardListProps` binds `itemKey`, `tableProps` binds `selectable`)                                                                                                                 |
| `filter-menu`                                                                                              | field `kind: 'multi'`                                                            | field `type: 'multiple'` (manual)                                                                                                                                                                                            |
| `tag`                                                                                                      | `severity="primary"`, `"accent"`, `"contrast"`, `"highlight"`                    | `variant="primary"` (and `accent`, `contrast`, `highlight`); `severity` now takes only `neutral`, `info`, `success`, `warning`, `danger` and wins over `variant`                                                             |
| `tag`                                                                                                      | a bound `:severity` that can hold `primary`, `accent`, `contrast` or `highlight` | MANUAL: split the data into a `variant` field (brand look) and a `severity` field (status) and bind both (`:variant="x.variant" :severity="x.severity"`); `TagSeverity` is now only the status scale, `TagVariant` the looks |
| `badge`                                                                                                    | a bound `:severity` that can hold `primary` or `secondary`                       | MANUAL: same split as `Tag`                                                                                                                                                                                                  |
| `integration-card`                                                                                         | badge `{ label, severity: 'primary' }`                                           | MANUAL in data: `{ label, variant: 'primary' }`; `IntegrationCardBadge` takes `variant?` and `severity?`                                                                                                                     |
| `sidebar-menu-item`                                                                                        | `tag-severity="primary"`, `tag-severity="accent"`                                | `tag-variant="primary"`, `tag-variant="accent"`; `tagSeverity` takes the status scale and wins; with neither the tag is `info`                                                                                               |
| `architecture-tabs-section`                                                                                | `position="left" \| "right"`                                                     | `tabs-side="start" \| "end"`                                                                                                                                                                                                 |
| `article-body-section`                                                                                     | `trail[].current`                                                                | `trail[].active`                                                                                                                                                                                                             |
| `article-cards-section`                                                                                    | `kind="left" \| "centered"`                                                      | `variant="start" \| "center"`                                                                                                                                                                                                |
| `article-cards-section`                                                                                    | `items[].key`, `items[].external`                                                | `items[].id`, `items[].target="_blank"`                                                                                                                                                                                      |
| `article-index-section`                                                                                    | `categoryLabel`                                                                  | `categoryAriaLabel`                                                                                                                                                                                                          |
| `article-index-section`                                                                                    | `search="{ placeholder, label }"`                                                | `searchPlaceholder`, `searchAriaLabel`                                                                                                                                                                                       |
| `article-index-section`                                                                                    | `empty="{ title, description, action }"`                                         | `emptyTitle`, `emptyDescription`, `emptyActionLabel`                                                                                                                                                                         |
| `article-index-section`                                                                                    | `rowKind="centered"`                                                             | `rowKind="center"`                                                                                                                                                                                                           |
| `article-index-section`                                                                                    | `items[].key`, `facets[].key`, `items[].external`                                | `items[].id`, `facets[].id`, `items[].target="_blank"`                                                                                                                                                                       |
| `capability-grid-section`, `console-showcase-section`, `feature-widgets-section`, `process-scroll-section` | `titleKind="centered" \| "left" \| "horizontal"`                                 | `titleAlign="center" \| "start" \| "split"`                                                                                                                                                                                  |
| `pricing-card`                                                                                             | `slotPosition`                                                                   | `actionsPosition`                                                                                                                                                                                                            |
| `pricing-card`                                                                                             | `aligned`                                                                        | `equalHeight`                                                                                                                                                                                                                |
| `newsletter-section`                                                                                       | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `conversation`                                                                                             | `alignment`                                                                      | `layout`                                                                                                                                                                                                                     |
| `hero`                                                                                                     | `align="top" \| "bottom"`                                                        | `align="start" \| "end"`                                                                                                                                                                                                     |
| `hero-section`                                                                                             | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-section`                                                                                             | `kind="centered" \| "centered-band"`                                             | `variant="center" \| "center-band"`                                                                                                                                                                                          |
| `hero-form-section`                                                                                        | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-form-section`                                                                                        | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `hero-title`                                                                                               | `highlight`                                                                      | `titleHighlight`                                                                                                                                                                                                             |
| `hero-title`                                                                                               | `centered`                                                                       | `align="center"`                                                                                                                                                                                                             |
| `hero-title`                                                                                               | `mobileCentered`                                                                 | `mobileAlign="center"`                                                                                                                                                                                                       |
| `job-posting-section`                                                                                      | `error` (boolean)                                                                | `failed`                                                                                                                                                                                                                     |
| `listing-index-section`                                                                                    | `rows`                                                                           | `data`                                                                                                                                                                                                                       |
| `listing-index-section`                                                                                    | `search="{ placeholder, shortPlaceholder, label }"`                              | `searchPlaceholder`, `searchShortPlaceholder`, `searchAriaLabel`                                                                                                                                                             |
| `listing-index-section`                                                                                    | `empty="{ title, description, clearLabel }"`                                     | `emptyTitle`, `emptyDescription`, `emptyActionLabel`                                                                                                                                                                         |
| `listing-index-section`                                                                                    | `facets[].key`                                                                   | `facets[].id`                                                                                                                                                                                                                |
| `listing-table-section`                                                                                    | `rows`                                                                           | `data`                                                                                                                                                                                                                       |
| `media-split`                                                                                              | `align="top"`                                                                    | `align="start"`                                                                                                                                                                                                              |
| `media-tabs`                                                                                               | `position="left" \| "right"`                                                     | `tabs-side="start" \| "end"`                                                                                                                                                                                                 |
| `network-section`                                                                                          | `lead`                                                                           | `claimsEyebrow`                                                                                                                                                                                                              |
| `section-module`                                                                                           | `kind="centered" \| "left" \| "horizontal"`                                      | `align="start" \| "center" \| "split"`                                                                                                                                                                                       |
| `section-title`                                                                                            | `kind="centered" \| "left" \| "horizontal"`                                      | `align="start" \| "center" \| "split"`                                                                                                                                                                                       |
| `article-cards-section`                                                                                    | `kind="left" \| "centered"`                                                      | `align="start" \| "center"`                                                                                                                                                                                                  |
| `site-footer-section`                                                                                      | `columns[].links[].external`                                                     | `columns[].links[].target="_blank"`                                                                                                                                                                                          |
| `story-index-section`                                                                                      | `search="{ placeholder, shortPlaceholder, label }"`                              | `searchPlaceholder`, `searchShortPlaceholder`, `searchAriaLabel`                                                                                                                                                             |
| `story-index-section`                                                                                      | `empty="{ title, action }"`                                                      | `emptyTitle`, `emptyActionLabel`                                                                                                                                                                                             |
| `story-index-section`                                                                                      | `items[].key`, `facets[].key`, `items[].external`                                | `items[].id`, `facets[].id`, `items[].target="_blank"`                                                                                                                                                                       |
| `data-table`                                                                                               | `v-model:row-selection` (record)                                                 | `v-model:selected-keys` (`string[]` of row keys)                                                                                                                                                                             |
| `data-grid`                                                                                                | `v-model:row-selection` (record)                                                 | `v-model:selected-keys` (`string[]` of row keys)                                                                                                                                                                             |
| `data-table`                                                                                               | `v-model:expanded` (`ExpandedState`)                                             | `v-model:open-keys` (`string[]` of row ids)                                                                                                                                                                                  |
| `data-table`                                                                                               | `v-model:pagination` (`{ pageIndex, pageSize }`, from 0)                         | `v-model:page` (from 1) + `v-model:page-size`                                                                                                                                                                                |
| `data-table`                                                                                               | `v-model:state`, `initial-state`                                                 | `v-model:snapshot`, `default-snapshot`                                                                                                                                                                                       |
| `map-chart`                                                                                                | `v-model:active-id`                                                              | `v-model:active-key`                                                                                                                                                                                                         |
| `tutorial-panel-provider`                                                                                  | `v-model:active`                                                                 | `v-model:active-key`                                                                                                                                                                                                         |
| `tree`, `trace`, `split-button`                                                                            | `v-model:selected` (an id)                                                       | `v-model:selected-key`                                                                                                                                                                                                       |
| `command`                                                                                                  | `v-model:page` (a page name)                                                     | `v-model:page-key`                                                                                                                                                                                                           |
| `tool-approval`                                                                                            | `kind="default"`                                                                 | `variant="primary"` (the default)                                                                                                                                                                                            |

#### Compound parts

A part name comes from one closed list (Trigger, Content, Header, Body, Footer, Title, Description, Close, Item, Group, Label, Separator, List) plus the domain parts a component declares, and every part is importable on its own as `@aziontech/webkit/<root>-<part>`. The codemod rewrites the dot-notation (`<Tabs.Item>` → `<Tabs.Trigger>`), the standalone import paths and the named imports (`SelectOption` → `SelectItem`).

| v5                                                                                                 | v6                                                                                                                         |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Tabs.Item`, `Tabs.Panel`, `Tabs.Root`                                                             | `Tabs.Trigger`, `Tabs.Content`, `Tabs` (types `TabsRootProps` → `TabsProps`)                                               |
| `Select.Option` · `select-option` · `SelectOption`                                                 | `Select.Item` · `select-item` · `SelectItem` (`SelectOptionProps` → `SelectItemProps`)                                     |
| `MultiSelect.Option` · `multi-select-option` · `MultiSelectOption`                                 | `MultiSelect.Item` · `multi-select-item` · `MultiSelectItem`                                                               |
| `dropdown-option` · `dropdown-menu-option` · `DropdownMenuOption`                                  | `dropdown-menu-item` · `DropdownMenuItem` (`DropdownMenuOptionKind` / `Value` → `DropdownMenuItemKind` / `Value`)          |
| `Panel.Content` · `panel-content` · `PanelContent`                                                 | `Panel.Body` · `panel-body` · `PanelBody` (the part `Dialog.Body` and `Drawer.Body` already were)                          |
| `key-value-pairs` · `KeyValuePairs` (`.Item`, `.Group`)                                            | `key-value-list` · `KeyValueList` (`.Item`, `.Group`; types `KeyValueListColumns`, `KeyValueListKind`)                     |
| `FilterMenu.Chips` · `filter-menu-chips`                                                           | `FilterMenu.ChipGroup` · `filter-menu-chip-group`                                                                          |
| `HelpPanel.Section`, `HelpPanel.Links`                                                             | `HelpPanel.Group` (`help-panel-group`), `HelpPanel.Footer` (`help-panel-footer`)                                           |
| `Pagination.Info` · `paginator-info` · `pagination-info`                                           | `Pagination.Description` · `pagination-description`                                                                        |
| `ConsoleLayout.Breadcrumbs` · `console-layout-breadcrumbs`                                         | `ConsoleLayout.Breadcrumb` · `console-layout-breadcrumb`                                                                   |
| `Toast.Toaster`, `Breadcrumb.Root`                                                                 | `Toast` (or the named `Toaster`), `Breadcrumb`                                                                             |
| `NavigationMenu.Portal` > `Positioner` > `Popup` > `Arrow` > `Viewport`, `NavigationMenu.Backdrop` | one `<NavigationMenu.Viewport>` with the positioner props, `kind`, `arrow` and `backdrop` (manual: the codemod reports it) |
| `NavigationMenu.Icon` inside a trigger                                                             | delete it: `NavigationMenu.Trigger` renders its own chevron (manual: the codemod reports it)                               |

New standalone paths: `tabs-list`, `tabs-trigger`, `tabs-content`, `dialog-header`, `dialog-body`, `dialog-footer`, `drawer-header`, `drawer-body`, `drawer-footer`, `navigation-menu-list`, `-item`, `-trigger`, `-content`, `-link` and `-viewport`. Test ids follow the part file names (`input-select-option` → `select-item`, `navigation-tabs-item` → `tabs-trigger`, `content-key-value-pairs` → `key-value-list`, `data-filter-menu-chips` → `filter-menu-chip-group`, `content-help-panel-section` / `-links` → `help-panel-group` / `-footer`).

#### Slots

| Component              | v5                   | v6                                                                                                                                         |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `log-viewer-header`    | `#left`, `#right`    | `#start`, `#end` (test ids `__left`/`__right` → `__start`/`__end`)                                                                         |
| `console-layout`       | `#header-start`      | `#header-leading`                                                                                                                          |
| `page-header`          | `#breadcrumb`        | `#breadcrumbs`                                                                                                                             |
| `doc-page-header`      | `#breadcrumb`        | `#breadcrumbs`                                                                                                                             |
| `dropdown-menu`        | `#top` / `#bottom`   | `#header` / `#footer`                                                                                                                      |
| `dropdown-menu-group`  | `#top` / `#bottom`   | `#header` / `#footer`                                                                                                                      |
| `alert`                | `#action`            | `#actions`                                                                                                                                 |
| `button`               | `#prefix`            | `#leading`                                                                                                                                 |
| `card`                 | `#action`            | `#actions`                                                                                                                                 |
| `card`                 | `#header-action`     | `#header-actions`                                                                                                                          |
| `card`                 | `#content`           | the default slot                                                                                                                           |
| `command-item`         | `#prefix`, `#suffix` | `#leading`, `#trailing`                                                                                                                    |
| `input`                | `#prefix`, `#suffix` | `#leading`, `#trailing`                                                                                                                    |
| `multi-select-item`    | `#left`              | `#leading`                                                                                                                                 |
| `multi-select-trigger` | `#prefix`            | `#leading`                                                                                                                                 |
| `number-input`         | `#prefix`, `#suffix` | `#leading`, `#trailing`                                                                                                                    |
| `password-input`       | `#prefix`, `#suffix` | `#leading`, `#trailing`                                                                                                                    |
| `select-item`          | `#left`              | `#leading`                                                                                                                                 |
| `select-trigger`       | `#prefix`            | `#leading`                                                                                                                                 |
| `footer`               | `#tagline`           | removed with the signature band: put the brand in `#brand`, which now leads the bottom bar; test ids `__signature` and `__gutter` are gone |

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
| `DashboardGrid`          | `item-move`               | `(payload)`                      | `(event, payload)`                                                                                                   |
| `DashboardGrid`          | `item-resize`             | `(payload)`                      | `(event, payload)`                                                                                                   |
| `TransferList`           | `move`                    | `(payload)`                      | `(event, payload)`; the slot and exposed `move(event, direction)` / `moveAll(event, direction)` take the event first |
| `DataTable`              | `refresh`                 | `()`                             | `(event)`: the Table.RefreshButton click, or `new Event('refresh')` from `reload()`                                  |
| `DataTable`              | `export`                  | `(rows)`                         | `(event, rows)`: the Table.Export click, or `new Event('export')` from `exportCsv()`                                 |
| `DataTable`              | `load-more`               | `()`                             | `(event)`: the Load more click, or `new Event('load-more')` when the end of the rows nears the viewport              |

#### Types and data fields (a hand edit where the codemod cannot see the data)

| Component                                                                                                                                                             | v5                                                                                       | v6                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `use-collection`                                                                                                                                                      | option `trackBy`                                                                         | option `itemKey` (manual)                                                                       |
| `ChatMessageState`                                                                                                                                                    | `ChatMessageStatus`                                                                      |
| `PromptInputState`                                                                                                                                                    | `PromptInputStatus`                                                                      |
| `ToolApprovalState`                                                                                                                                                   | `ToolApprovalStatus`                                                                     |
| `ToolCallState`                                                                                                                                                       | `ToolCallStatus`                                                                         |
| `StepperStepState`                                                                                                                                                    | `StepperStepStatus`                                                                      |
| `ToastSeverity`                                                                                                                                                       | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` (no `default`, no `loading`) |
| `UploadProgressStatus`                                                                                                                                                | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled'`                           |
| `LogViewerStepStatus`                                                                                                                                                 | `'success' \| 'running' \| 'error' \| 'skipped' \| 'pending'`                            |
| `TraceSpanStatus`                                                                                                                                                     | `'success' \| 'error' \| 'running'`                                                      |
| `settings-row`                                                                                                                                                        | `SettingsRowLevel`                                                                       | `SettingsRowDepth`                                                                              |
| `navigation-menu`                                                                                                                                                     | `NavigationMenuSide` `'top' \| 'right' \| 'bottom' \| 'left'`                            | `'top' \| 'end' \| 'bottom' \| 'start'`                                                         |
| `drawer`                                                                                                                                                              | `DrawerSide` `'left' \| 'right'`                                                         | `'start' \| 'end'`                                                                              |
| `doc-previous-next`                                                                                                                                                   | `DocPageLink.title`                                                                      | `DocPageLink.label`                                                                             |
| `AccordionArrowPosition`                                                                                                                                              | `AccordionIconPosition`                                                                  |
| `tag`                                                                                                                                                                 | `TagSeverity` (status scale plus looks)                                                  | `TagSeverity` (status scale only) + `TagVariant` (`primary`, `accent`, `contrast`, `highlight`) |
| `integration-card`                                                                                                                                                    | `CardBadgeSeverity` (with looks)                                                         | `IntegrationCardBadgeSeverity` + `IntegrationCardBadgeVariant`                                  |
| `sidebar-menu`                                                                                                                                                        | `SidebarMenuItemTagSeverity` (with `primary`, `accent`)                                  | `SidebarMenuItemTagSeverity` (status) + `SidebarMenuItemTagVariant` (`primary`, `accent`)       |
| `table`                                                                                                                                                               | `TableColumn.enableSorting`                                                              | `TableColumn.sortable`                                                                          |
| `data-table`                                                                                                                                                          | `sorting`, `columnVisibility`, `globalFilter`, `filters`, `data`                         | unchanged names, now `defineModel` (same `v-model:*` contract)                                  |
| `data-table`                                                                                                                                                          | `TableStateSnapshot.pagination`                                                          | `TableStateSnapshot.page` (from 1) + `pageSize`                                                 |
| `data-table`                                                                                                                                                          | `TableExposed.getState()` / `setState()`                                                 | `getSnapshot()` / `setSnapshot()`                                                               |
| `use-collection`                                                                                                                                                      | `tableProps.pagination` / `rowSelection`                                                 | `tableProps.page` / `pageSize` / `selectedKeys`                                                 |
| `code-editor`                                                                                                                                                         | `CodeEditorMarker.severity` `'error'`                                                    | `'danger'` (`data-severity="danger"`)                                                           |
| `chart`                                                                                                                                                               | `ChartStatus`                                                                            | `ChartSemanticSeverity`                                                                         |
| `PricingCardSlotPosition`                                                                                                                                             | `PricingCardActionsPosition`                                                             |
| `ConversationAlignment`                                                                                                                                               | `ConversationLayout`                                                                     |
| `MediaTabsPosition`                                                                                                                                                   | `MediaTabsSide`                                                                          |
| `ArchitectureTabsSectionPosition`                                                                                                                                     | `ArchitectureTabsSide`                                                                   |
| `HeroTitleAlign`                                                                                                                                                      | new                                                                                      |
| `ArticleIndexSectionSearch`, `ArticleIndexSectionEmpty`, `ListingIndexSectionSearch`, `ListingIndexSectionEmpty`, `StoryIndexSectionSearch`, `StoryIndexSectionEmpty` | removed (flat props)                                                                     |

#### Data attributes and test ids (update CSS selectors and tests by hand)

| Component                                                                                                       | v5                                                                                                  | v6                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `chat-message`, `prompt-input`, `tool-approval`, `tool-call`                                                    | `data-status` mirrors `state`                                                                       | `data-status` mirrors `status`                                                                                                         |
| `section-title`, `section-module`, `article-cards-section`                                                      | `data-kind`                                                                                         | `data-align`                                                                                                                           |
| `stepper-step`                                                                                                  | `data-state="upcoming\|current\|complete\|error\|loading"`                                          | `data-status` + `data-active` (+ `data-completed`)                                                                                     |
| `stepper`                                                                                                       | `data-current`                                                                                      | `data-active`                                                                                                                          |
| `stepper-step`                                                                                                  | `data-step-dot`, `data-step-disc`, `data-step-description`, `data-step-connector`, `data-step-body` | `data-slot="step-dot"` … `data-slot="step-body"`                                                                                       |
| `upload-progress`                                                                                               | `data-state="running\|done\|failed"`, `data-collapsed`                                              | `data-status="running\|success\|error"`, `data-state="open\|closed"`                                                                   |
| `trace`                                                                                                         | `data-tone="root\|ok\|error\|running"`                                                              | `data-status="success\|error\|running"` + `data-root`                                                                                  |
| `log-viewer`                                                                                                    | `data-border`                                                                                       | `data-bordered`                                                                                                                        |
| `tooltip`, `popover`, `hover-card-content`, `dropdown-menu`, `context-menu`, `date-picker`, `date-range-picker` | `data-placement="bottom-start"`                                                                     | `data-side="bottom"` + `data-align="start"` (logical: `start`/`end`, never `left`/`right`)                                             |
| `response-loading`                                                                                              | `data-visible`                                                                                      | `data-state="open\|closed"`                                                                                                            |
| `toaster` region                                                                                                | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                                            |
| `toast-item`                                                                                                    | `data-severity="loading"`                                                                           | `data-loading` (+ `aria-busy`)                                                                                                         |
| `tutorial-panel` step row                                                                                       | `data-tutorial-step`                                                                                | `data-slot="tutorial-step"`                                                                                                            |
| `breadcrumb-item`                                                                                               | `data-current`                                                                                      | `data-active`                                                                                                                          |
| `sidebar-menu-item`                                                                                             | `data-selected`                                                                                     | `data-active`                                                                                                                          |
| `pagination-button`                                                                                             | `data-selected`                                                                                     | `data-active`                                                                                                                          |
| `tutorial-panel-hotspot`                                                                                        | `data-active` (marker shown) / `data-current` (current step)                                        | `data-marker` / `data-active`                                                                                                          |
| `navigation-menu` (root, list, icon, content, popup, backdrop)                                                  | `data-open` / `data-closed`                                                                         | `data-state="open\|closed"`                                                                                                            |
| `navigation-menu-positioner`, `navigation-menu-arrow`                                                           | `data-side="left\|right"`                                                                           | `data-side="start\|end"`                                                                                                               |
| `drawer-content`                                                                                                | `data-side="left\|right"`                                                                           | `data-side="start\|end"`                                                                                                               |
| `sidebar`                                                                                                       | `data-collapsed`                                                                                    | `data-state="open\|closed"`                                                                                                            |
| `resizable-pane`                                                                                                | `data-collapsed`                                                                                    | `data-state="open\|closed"`                                                                                                            |
| `settings-section` (body)                                                                                       | `data-open`                                                                                         | `data-state="open\|closed"`                                                                                                            |
| `doc-prompt` (prompt text)                                                                                      | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                                            |
| `settings-row`                                                                                                  | `data-level`                                                                                        | `data-depth`                                                                                                                           |
| `page-header`                                                                                                   | `__breadcrumb` test id                                                                              | `__breadcrumbs`                                                                                                                        |
| `dropdown-menu`, `dropdown-menu-group`                                                                          | `__top` / `__bottom` test ids                                                                       | `__header` / `__footer`                                                                                                                |
| `alert`                                                                                                         | `data-slot="alert-action"`                                                                          | `data-slot="alert-actions"`                                                                                                            |
| `accordion`                                                                                                     | `data-arrow="left\|right"`                                                                          | `data-icon-position="leading\|trailing"`                                                                                               |
| `button`, `icon-button`, `highlight-button`                                                                     | `data-inactive`                                                                                     | `data-inert`                                                                                                                           |
| `button-group`                                                                                                  | `data-button-group-item="<id>"`                                                                     | `data-slot="button-group-item"` + `data-id="<id>"`                                                                                     |
| `chip`                                                                                                          | `data-chip-body`                                                                                    | `data-slot="chip-body"`                                                                                                                |
| `code-block`                                                                                                    | `data-border`                                                                                       | `data-bordered`                                                                                                                        |
| `code-block`                                                                                                    | `data-side="left\|right"` (split diff)                                                              | `data-side="start\|end"`                                                                                                               |
| `copy-button`                                                                                                   | `data-state="default"`                                                                              | `data-state="idle"`                                                                                                                    |
| `date-range-picker`                                                                                             | `data-part="trigger"`                                                                               | `data-slot="date-range-picker-trigger"`                                                                                                |
| `file-token-group`                                                                                              | `data-file-token-remove`                                                                            | `data-slot="file-token-remove"`                                                                                                        |
| `input`, `password-input`                                                                                       | `data-has-icon-left`, `data-has-icon-right`                                                         | `data-leading`, `data-trailing`                                                                                                        |
| `password-input`                                                                                                | `data-visible`                                                                                      | `data-revealed`                                                                                                                        |
| `card`                                                                                                          | test id `__header-action`, `__action`                                                               | `__header-actions`, `__actions`                                                                                                        |
| `command-item`                                                                                                  | test id `__prefix`                                                                                  | `__leading`                                                                                                                            |
| `command-group`                                                                                                 | test id `__heading`                                                                                 | `__label`                                                                                                                              |
| `tag`, `badge`                                                                                                  | `data-severity` with a brand look                                                                   | `data-variant` (`data-severity` only for the status scale)                                                                             |
| `table`, `data-table`                                                                                           | `data-border`                                                                                       | `data-bordered`                                                                                                                        |
| `tree`                                                                                                          | `data-tree-row`, `data-tree-cell`, `data-tree-toggle`, `data-tree-rename`, `data-tree-actions`      | `data-slot="tree-row"` (and `tree-cell`, `tree-toggle`, `tree-rename`, `tree-actions`)                                                 |
| `data-table`                                                                                                    | `data-tree-gutter`, `data-reorder-cell`                                                             | `data-slot="tree-gutter"`, `data-slot="reorder-cell"`                                                                                  |
| `filter-menu`                                                                                                   | `data-picked`                                                                                       | `data-selected`                                                                                                                        |
| `flow`                                                                                                          | `data-flow-kind`, `data-flow-branches`, `data-flow-port`, `data-flow-diagram-anchor`                | `data-slot="flow-diagram-node"` / `flow-diagram-parallel` / `flow-branches` / `flow-port` / `flow-diagram-anchor`, side in `data-side` |
| `tracker`                                                                                                       | readout `data-visible`                                                                              | readout `data-state="open                                                                                                              | closed"` |
| `table-sort-button`                                                                                             | `data-direction`, `data-visible`                                                                    | `data-sort`                                                                                                                            |
| `pricing-card`                                                                                                  | `data-slot-position`, `data-aligned`                                                                | `data-actions-position`, `data-equal-height`                                                                                           |
| `newsletter-section`, `hero-form-section`, `job-posting-section`                                                | `data-error`                                                                                        | `data-failed`                                                                                                                          |
| `conversation`                                                                                                  | `data-alignment` (root)                                                                             | `data-layout`                                                                                                                          |
| `hero-title`                                                                                                    | `data-centered`, `data-mobile-centered`                                                             | `data-align`, `data-mobile-align`                                                                                                      |
| `listing-index-section`, `story-index-section` (filter panel)                                                   | `data-expanded`                                                                                     | `data-state="open\|closed"`                                                                                                            |
| `media-tabs`                                                                                                    | `data-position`                                                                                     | `data-tabs-side`                                                                                                                       |
| `quote` (highlighted phrase)                                                                                    | `data-highlight`                                                                                    | `data-slot="highlight"`                                                                                                                |
| `sticky-stack`                                                                                                  | `data-complete`                                                                                     | `data-completed`                                                                                                                       |

## 4. Manual changes

### Icons: `az` classes, product names, Lucide names, no PrimeIcons

Every WebKit component, default `icon` and example now draws `az az-<name>` from `@aziontech/icons`;
no component renders a PrimeIcons (`pi pi-*`) class, and `@aziontech/icons` no longer ships the
PrimeIcons font or its `@aziontech/icons/primeicons` entry. If your app still renders one of the
third-party marks the codemod lists (`pi-apple`, `pi-paypal`, …), draw your own SVG or install the
`primeicons` package.

The base classes are `az` (was `ai`, which read as "artificial intelligence") and `az-color` (was
`ai-cor`). Product icons take the product names WebKit uses, and the other glyphs take the
[Lucide](https://lucide.dev/icons) names. `migrate v6` rewrites them all (the `base`, `azionicons`
and `color` maps of `src/cli/migrations/v6-icons.json`); every icon, with what it stands for, is
listed in `@aziontech/icons/manifest` and `ICONS.md` in the icons package:

- products: `ai-edge-functions` → `az-functions`, `ai-edge-application` → `az-applications`,
  `ai-edge-firewall` → `az-firewall`, `ai-edge-storage` → `az-object-storage`, `ai-edge-sql` →
  `az-sql-database`, `ai-edge-kv` → `az-kv-store`, `ai-edge-connectors` → `az-connectors`,
  `ai-edge-ai` → `az-ai-inference`, `ai-waf-rules` → `az-waf`, `ai-app-accelerator` →
  `az-application-accelerator`, `ai-store` → `az-store-pillar`, `ai-origin-accelerator` →
  `az-application-accelerator`; Edge DNS, Edge Pulse and Edge Orchestrator (with `az-edge-nodes`,
  `az-edge-services`, `az-edge-libraries`) keep `edge-`; `ai-tiered-cache` → `az-tiered-cache`, now a
  feature of the new `az-cache`; new product icons `az-cache`, `az-network-shield`,
  `az-ddos-protection` and `az-secure-internet-access`;
- one drawing, one name: `ai-digital-certificates` → `az-verified`, `ai-instructor` →
  `az-graduation-cap`, `ai-ai-pillar` → `az-sparkles`,
  `ai-window-maximize` → `az-app-window`; and names that say the drawing: `ai-datasheet` → `az-sheet`, `ai-column` →
  `az-columns-3`, `ai-gateway` (the winding path, not AI Gateway) → `az-route`, `ai-eject` →
  `az-arrow-up-from-line`, `ai-fast-backward` / `ai-fast-forward` → `az-skip-back` /
  `az-skip-forward`;
- close and status: `ai-times` → `az-x`, `ai-times-circle` → `az-circle-x`, `ai-check-circle` →
  `az-circle-check`, `ai-info-circle` → `az-circle-info`, `ai-question-circle` → `az-circle-help`,
  `ai-exclamation-circle` → `az-circle-alert`, `ai-exclamation-triangle` → `az-triangle-alert`,
  `ai-check-square` → `az-square-check`; every `ai-<x>-circle` is `az-circle-<x>`
  (`ai-plus-circle` → `az-circle-plus`, `ai-arrow-circle-up` → `az-circle-arrow-up`, …);
- Font Awesome words: `ai-bars` → `az-menu`, `ai-cog` → `az-settings`, `ai-th-large` and
  `ai-objects-column` → `az-layout-grid`, `ai-ellipsis-h` / `-v` → `az-ellipsis` /
  `az-ellipsis-vertical`, `ai-sliders-h` / `-v` → `az-sliders-horizontal` / `-vertical`,
  `ai-arrows-h` / `-v` / `-alt` → `az-move-horizontal` / `az-move-vertical` / `az-move`,
  `ai-share-alt` → `az-share`, `ai-directions-alt` → `az-signpost`, `ai-map-marker` →
  `az-map-pin`, `ai-sign-in` / `-out` → `az-log-in` / `az-log-out`, `ai-pen-to-square` →
  `az-square-pen`, `ai-user-edit` → `az-user-pen`, `ai-file-edit` → `az-file-pen`,
  `ai-envelope` → `az-mail`, `ai-hashtag` → `az-hash`, `ai-thumbtack` → `az-pin`,
  `ai-search-plus` / `-minus` → `az-zoom-in` / `az-zoom-out`, `ai-calendar-times` →
  `az-calendar-x`, `ai-arrow-right-arrow-left` → `az-arrow-right-left`, the two long
  `ai-arrow-…-center` names → `az-minimize` / `az-maximize`;
- `-slash` is `-off`: `az-eye-off`, `az-bell-off`, `az-filter-off`, `az-sort-off`;
- one glyph, one name: `ai-angle-*` → `az-chevron-*`, `ai-angle-double-*` → `az-chevrons-*`,
  `ai-file-o` → `az-file`, `ai-filter-alt` → `az-filter`, `ai-sort-alt` → `az-sort`,
  `ai-sort-up` / `-down` → `az-arrow-up` / `az-arrow-down`, `ai-clone` → `az-copy`, `ai-branch`
  → `az-git-branch`, `ai-unlock` → `az-lock-open`, `ai-step-backward-alt` / `ai-step-forward-alt`
  → `az-skip-back` / `az-skip-forward`, `ai-step-backward` → `az-step-back`;
- sort order in the name: `ai-sort-alpha-down` → `az-arrow-down-a-z` (`-alt` → `az-arrow-down-z-a`),
  `ai-sort-numeric-down` → `az-arrow-down-0-1`, `ai-sort-amount-down` → `az-arrow-down-wide-narrow`,
  and the same for `-up`;
- spelling and brands: `ai-pratices-review` → `az-practices-review`, `ai-scizors` → `az-scissors`,
  `ai-open` → `az-openai`, `ai-next` → `az-nextjs`, `ai-mcp-logo` → `az-mcp`, the X mark `ai-x` →
  `az-x-brand`;
- colored icons: the base class `ai-cor` is `az-color` (`<i class="az-color az-google">`), and
  `ai-open`, `ai-next`, `ai-js`, `ai-ts`, `ai-azuredevops`, `ai-x` are `az-openai`, `az-nextjs`,
  `az-javascript`, `az-typescript`, `az-azure-devops`, `az-x-brand`.

The brand mark `workers-cloudflare` (`Marquee` `marks`, `QuoteTabs` `mark`, `ClientQuotesSection` `mark`,
`HeroSection` `carouselMarks`) is `cloudflare-workers`; rename the string by hand.

The RTL mirror of `@aziontech/webkit/styles` targets the `az` names (`az-chevron-left`,
`az-arrow-right`, `az-log-out`, …).

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
- **Fonts are their own file, and they ship in the package.** `@import '@aziontech/theme'` no longer
  loads the Azion fonts. Add `@import '@aziontech/theme/fonts.css';` next to it (or
  `import '@aziontech/theme/fonts.css'` in `main.ts`) to keep them; leave it out if your app hosts its
  own fonts. `npx @aziontech/webkit init` writes the line. The woff2 files now come from
  `@aziontech/theme/fonts/` (your bundler copies them), not from `fonts.azion.com` or jsDelivr, so
  drop those hosts from your Content Security Policy's `font-src`. `fonts.css` declares only the faces
  the tokens use: Rubik, Roboto Mono and Noto Sans Arabic. The `Roboto`, `Roboto Condensed` and
  `Titillium Web` faces are gone; an app that still sets them declares its own `@font-face`. Proto Mono,
  first in the display stack, is a commercial face the package cannot redistribute: an app licensed
  for it declares its own `@font-face`, and every other app renders display text in Roboto Mono.
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
  | `--text-primary` (a peach orange in dark, a brown orange in light)                                                          | `--text-brand`, the logo orange `#F3652B` in both themes        |
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
- **Chart colors.** `--chart-series-1` is blue, no longer the brand orange, and every series,
  sequential (now indigo) and diverging (orange to blue) value changes. There are eight series
  slots (`--chart-series-7`, `-8` are new): a `Chart` keeps eight series before folding the rest
  into Other (`cap` defaults to `8`), and `ChartSlot` takes `1` to `8`. `DonutChart` still keeps six
  slices. Pass `:cap="6"` to a `Chart` to keep the old fold.

- **One orange.** Brand text is the logo orange `#F3652B` in both themes: `--text-primary` is gone
  (the codemod rewrites it to `--text-brand`), and the `Quote` name, `LinkDirectory` column titles,
  the `HeroTitle` highlight, `Stats` prefixes, the `FieldLabel` asterisk, `Tag variant="highlight"`
  text and a hovered linked `FeatureItem` now render it. In light it is about 3:1 on white, an
  accepted brand exception; a screen that needs AA brand text in light puts the label on a
  `--primary` fill with `--primary-foreground` instead. The default `Avatar` pattern `colors` are
  now `['var(--primary)', 'var(--warning)', 'var(--brand-blue)']`, and the dark code syntax function
  colour is the logo orange.

Two additions need nothing from you: `--border-input` is the outline token of every form field (same
value as `--border-default`), and dark mode has its own, visible elevation shadows (`--shadow-*`).

### CSS: the app compiles only the WebKit files it imports

In v5, `@aziontech/theme` and `@aziontech/webkit/styles` both pointed Tailwind at the whole WebKit
source, so every app shipped the classes of every component (77 KB gzipped of CSS for a Button-only
app). In v6 neither scans WebKit: `src/webkit.css` imports `./webkit.sources.css`, a generated list
with one `@source` per WebKit file the app imports, and the Button-only app ships about 10 KB.

- Run `npx @aziontech/webkit init` again: an untouched v5 `src/webkit.css` is replaced with the
  v6 one, and an edited one keeps your edits and gets only the lines it lacks (the
  `./webkit.sources.css` import and the three `@source not` lines). Or by hand add
  `@import './webkit.sources.css';` to `src/webkit.css` after `@import '@aziontech/webkit/styles';`,
  and `webkit()` from `@aziontech/webkit/vite-plugin` to the `plugins` of `vite.config`. The plugin
  writes the list on every dev start and build. Without Vite, run `npx @aziontech/webkit css` after
  adding or removing a WebKit import. `webkit doctor` fails while the list is stale.
- `@aziontech/webkit/styles` now holds only the base rules (right-to-left icon mirroring). An app
  that imported just `@aziontech/theme` (no `webkit.css`) renders every component unstyled until it
  imports the list.
- An app that really renders every component (a catalogue, a playground) imports
  `@aziontech/webkit/styles/all` instead of the list.
- Tailwind 4.1 or later: the stylesheet `init` writes keeps the AI guidance files out of the scan
  with `@source not '../.claude'` (and `CLAUDE.md`, `AGENTS.md`).

### TypeScript reads declarations

Every `@aziontech/webkit/<name>` export now has a `types` condition that points at a declaration
under `types/` (`{ "types": "./types/…/x.vue.d.ts", "default": "./src/…/x.vue" }`), so a fresh
Vite `vue-ts` app builds with its default `vue-tsc -b && vite build`: no more TS2307 on a `.vue`
export, and no WebKit source in your program, so `skipLibCheck` covers WebKit and your compiler
options never type-check it. `@aziontech/theme` and `@aziontech/icons` declare their CSS entries
the same way. Remove any local `declare module '@aziontech/webkit/…'` or
`declare module '@aziontech/icons'` shim you added as a workaround. Bundlers still load the `.vue`
and `.ts` sources (`default`).

Keep `vue-tsc` off 3.3.12 to 3.3.14: in those releases a static attribute containing `//` on a
component (`href="https://…"`) inside a `v-for` drops the loop variable from type-checking
(TS2304), and 3.3.14 also types later template expressions as refs ("Property 'value' does not
exist"); upstream tracks it in vuejs/language-tools#6240. `webkit init` leaves your `vue-tsc`
version as it is and prints the pin (`npm i -D vue-tsc@3.3.11`) when your range admits an affected
release, and `webkit doctor` warns when one is installed. Binding the value from a script constant
avoids it on every release.

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

<!-- snippet: partial -->

```vue
<!-- v5 -->
<FieldText v-model="name" label="Name" helper-text="Shown on invoices." required />
```

```vue
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
(`@aziontech/webkit/input-group-input`). `Hint` remains (`HelperText` is removed, see [Naming standard: renamed components](#naming-standard-renamed-components)); `Label` is removed (use `Field.Label`, or `FieldLabel` with `for` and `required` beside its control).

### Preview-only names

These shipped only in the 6.0 previews (`feat/webkit-ai-ready`), never in 5.x; they are gone in 6.0.

- `DocCta` (`@aziontech/webkit/doc-cta`) → `DocCallToAction` (`@aziontech/webkit/doc-call-to-action`):
  `primary-label` / `primary-href` become `:primary-action="{ label, href }"`, `secondary-label` /
  `secondary-href` become `:secondary-action="{ label, href }"`. The codemod lists the import as `MANUAL`.
- `CapabilityGridSection` and `ConsoleShowcaseSection`: `actions` → `primaryAction` and `secondaryAction` (one object
  each, same `{ label, href, trailing?, target?, variant? }` shape). The codemod lists it as `MANUAL`.
- `WebkitProvider` (`@aziontech/webkit/webkit-provider`) → `ConfigProvider`
  (`@aziontech/webkit/config-provider`), the name Reka UI, Element Plus, Naive UI and Ant Design
  use for the same job. Same props (`locale`, `catalogs`, `messages`, `dir`, `now`, `time-zone`);
  the test id is `config-provider`. The codemod rewrites the import, the tag and
  `WebkitProviderProps` → `ConfigProviderProps`.
- `UploadProgress`: `v-model:collapsed` → `v-model:open`, inverted (`open = !collapsed`).
- `ConsoleLayout`: `v-model:navigation-expanded` → `v-model:navigation-open` (same value);
  `Wizard`: `v-model:activeStep` → `v-model`; the codemod rewrites both.
- `DocPrompt`: the default `icon` is `az az-sparkles` (was `pi pi-sparkles`), like every icon in
  the Azion set above.

### Documentation components

`doc-tooltip` is removed. A glossed term in a docs page is a `HoverCard`: in MDX, `DocMarkdown`
renders the `<Tooltip tip title linkLabel href>` tag as one, so Markdown sources need no change. In
an SFC, compose `<HoverCard><HoverCard.Trigger>…</HoverCard.Trigger><HoverCard.Content>…</HoverCard.Content></HoverCard>`.
The codemod lists the import as `MANUAL`.

`doc-tabs` and `doc-tab` are removed: they drew the same strip as `Tabs` and added no behaviour.
In MDX, `DocMarkdown` renders the `<Tabs><Tab title>` tags as `Tabs`, so Markdown sources need no
change. In an SFC, give each old `DocTab` a value and write
`<Tabs default-value="console"><Tabs.List><Tabs.Trigger value="console" label="Console" /></Tabs.List><Tabs.Content value="console">…</Tabs.Content></Tabs>`;
inside `DocProse`, put `data-doc-block` on `Tabs`. The test ids
are `tabs`, `tabs-list`, `tabs-trigger` and `tabs-content` (were `doc-tabs` and `doc-tab`). The
codemod lists the imports as `MANUAL`.

`DocStep` is now `DocSteps.Step`: `@aziontech/webkit/doc-steps` is a compound and `doc-step` has
no standalone export, since a step only renders inside `DocSteps`. Drop the `doc-step` import and
write `<DocSteps.Step title>`; Markdown sources (`<Steps><Step>`) need no change. The step's test id
is `doc-steps-step` (was `documentation-doc-step`). The codemod rewrites each `<DocStep>` that sits
inside a `DocSteps` to `<DocSteps.Step>` and swaps the import for `doc-steps`; it lists the import as
`MANUAL` only when a step is outside a `DocSteps` or the binding is used in the script.

`DocCardGroup` takes `columns` (was `cols`); in Markdown, `DocMarkdown` still reads
`<CardGroup cols>` as `columns`, so existing docs sources render unchanged.

`doc-pagination` is now `doc-previous-next` (`DocPreviousNext`); the codemod rewrites it. Its locale catalog
key and test id moved with it: override `docPreviousNext.*` instead of `docPagination.*`, and select
`doc-previous-next` instead of `documentation-doc-pagination`.

`DocLayout` drops `outline`: the page fills the "On this page" rail itself. Every `DocHeading` with an
`anchor` at level 2 or 3, and every `DocChangelogEntry`, rendered in the layout's default slot
registers with the layout in document order, so compose `DocLayout` once in `App.vue` and delete the
`:outline` binding and the hand-kept list; a heading without `anchor` stays out of the rail. The end
rail, and the `aside` slot with it, now renders only on a page that has an outline. A custom heading
joins the rail with `useHeadingOutline(el, { id, text, depth })` from `use-heading-navigation`. The
codemod lists `outline` as `MANUAL`.

The `shell/docs` variants (Article, Reference, Landing, AgentSetup, AgentGuide) are page bodies: only
the `<article>`, with no `DocLayout`, header, rail or footer. Keep the shell (`shell/docs`, the
primary) as `App.vue` with `<RouterView />` in its slot and route to the copied page; a page copied
from an earlier version that still renders its own `DocLayout` keeps only its `<article>`. The
Landing headings carry no `anchor`, so the docs home shows no outline rail.

### Page fragments are components now

Markup that every screen used to copy is now a component. Screens copied from v5 keep working; replace
the copied markup when you touch them.

| Component         | Import                               | Replaces                                                     |
| ----------------- | ------------------------------------ | ------------------------------------------------------------ |
| `PageHeader`      | `@aziontech/webkit/page-header`      | the h1 + description + actions row of every page             |
| `SectionHeader`   | `@aziontech/webkit/section-header`   | the h2 + description (+ copy-link anchor) of a section       |
| `PageTabs`        | `@aziontech/webkit/page-tabs`        | the full-bleed tab strip under a resource header (`v-model`) |
| `SettingsSection` | `@aziontech/webkit/settings-section` | a titled settings band (collapsible)                         |
| `SettingsRow`     | `@aziontech/webkit/settings-row`     | one settings row: title, description, control                |
| `SaveBar`         | `@aziontech/webkit/save-bar`         | the floating or docked save / discard bar                    |
| `ConfirmDialog`   | `@aziontech/webkit/confirm-dialog`   | a confirm / discard / delete dialog                          |

The screens (blocks) that were only these fragments are gone from the catalog:
`platform/page/page-header`, `platform/page/section-header`, `platform/page/page-tabs`,
`platform/page/settings-section`, `platform/forms/settings-row` and `platform/overlays/confirm-dialog`.

### Blocks take their data through props

Every console block now takes its records, `loading` and `error` as typed props and emits its
actions; it fetches nothing and fakes no request. Its sample records live in a `sample.ts` beside
it, and each state variant imports the primary instead of copying it. Blocks copied from v5 keep
working as they are. To move one to live data, copy it again (`npx @aziontech/webkit add <block-id> --force`,
which also copies `<name>.sample.ts` and any API adapter), render it from the routed page that owns
the request, pass the data as props (the block's `## Data` guidelines list them) and delete the
`.sample.ts` once real data flows.

### Data-driven tables are `DataTable`

`Table` is now the markup-only root of the table parts, so a hand-composed table no longer bundles
the `@tanstack/vue-table` engine (`table-root` is about 2 KB, down from 56 KB). Everything that
takes `data` + `columns` moved to `DataTable`:

```diff
- import Table from '@aziontech/webkit/table'
- import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
+ import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
+ import TableSearch from '@aziontech/webkit/table-search'

- <Table :data="rows" :columns="columns" paginated>
+ <DataTable :data="rows" :columns="columns" paginated>
-   <template #toolbar><Table.Search /></template>
+   <template #toolbar><TableSearch /></template>
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
- Test ids: DataTable's root is `data-table` (its parts `data-table__row`, …); a
  hand-composed `Table` keeps `data-table`.
- Removed with no alias: `headerKind` (use `density`, which also compacts the rows),
  `rowsPerPageOptions` (use `pageSizeOptions`, now `[10, 25, 50, 100]` by default) and
  `Table.Header`'s `kind` (use `density`). `useCollection().tableProps` now binds `pageSizeOptions`.
- The codemod cannot tell a data-driven `<Table>` from a composed one; move the tags that pass
  `:data`, `:columns` or `v-bind="tableProps"` by hand.
- The cell presets and toolbar controls are no longer attached to the `Table` compound, which now
  carries only the structural parts (`Header`, `Body`, `Footer`, `Caption`, `Row`, `HeadCell`,
  `Cell`, `SortButton`, `Toolbar`), so `import Table from '@aziontech/webkit/table'` costs what its
  parts cost (6.7 KB gzip, down from 39 KB). Import each preset or control from its own entry; the
  codemod rewrites the tags and `h()` calls, adds the imports and drops a `Table` import nothing
  uses any more:

  | v5                                                                                                            | v6                                                                                                                                              |
  | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
  | `Table.CellStatus`, `Table.CellLink`, `Table.CellId`, `Table.CellTime`, `Table.CellTags`, `Table.CellActions` | `TableCellStatus` (`@aziontech/webkit/table-cell-status`), `TableCellLink`, `TableCellId`, `TableCellTime`, `TableCellTags`, `TableCellActions` |
  | `Table.Search`, `Table.Filter`, `Table.Export`, `Table.RefreshButton`, `Table.LiveButton`                     | `TableSearch` (`@aziontech/webkit/table-search`), `TableFilter`, `TableExportButton`, `TableRefreshButton`, `TableLiveButton`                   |

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

DataTable's page is counted from 1 now, like `Pagination` (`v-model:page`; `pageIndex + 1` →
`page`), and its selection and open rows are key arrays (`selectedKeys`, `openKeys`) instead of
TanStack records: `{ a: true }` → `['a']`.

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
| `PromptInput`           | `submit`            | `(value, references)`            | `(event, { value, references, files })`             |
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
| `LogViewer`             | `copy`              | `(value)`                        | `(event, value)`                                    |
| `ArtifactCanvas`        | `copy`              | `(value)`                        | `(event, value)`                                    |
| `ArtifactPreview`       | `copy`              | `(value)`                        | `(event, value)`                                    |
| `DocAgentCard`          | `copy`              | `(value)`                        | `(event, value)`                                    |

<!-- snippet: partial -->

```vue
<!-- v5 -->
<SuggestionGroup :items="items" @select="(item) => send(item.label)" />
<PromptInput v-model="draft" @submit="(value, references) => send(value, references)" />
<FileTokenGroup :items="files" @dismiss="(index) => removeFile(index)" />
<ButtonGroup :items="actions" @click="({ id }) => run(id)" />
```

```vue
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

<!-- snippet: partial -->

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
```

```vue
<!-- v6 -->
<Item href="https://example.com/docs">
  <Item.Content><Item.Title>Docs</Item.Title></Item.Content>
</Item>
<Item clickable variant="option" :aria-pressed="picked" @click="pick">
  <Item.Content><Item.Title>workload_01</Item.Title></Item.Content>
</Item>
```

### `LineFigure` is removed

`LineFigure` (`@aziontech/webkit/line-figure`) and its line figures are removed, with no
replacement: delete the import and the `<LineFigure>` element. The `lineFigures` kind is gone from
`catalog.assets`, the MCP `list_assets` and the llms foundation pages. The codemod lists the import
as `MANUAL`.

### The Azion mark is `Brand`; the loose `svg/azion/*` files are removed

`Brand` (`@aziontech/webkit/brand`) is the one way to draw the Azion mark. The loose drawings
`@aziontech/webkit/svg/azion/*` are no longer exported:

| Removed import                                 | Write instead                  |
| ---------------------------------------------- | ------------------------------ |
| `@aziontech/webkit/svg/azion/default`          | `<Brand />`                    |
| `@aziontech/webkit/svg/azion/min`              | `<Brand variant="reduced" />`  |
| `@aziontech/webkit/svg/azion/technologies`     | `<Brand variant="extended" />` |
| `@aziontech/webkit/svg/azion/full`             | no replacement (see below)     |
| `@aziontech/webkit/svg/azion/move-to-the-edge` | no replacement (see below)     |

The two lockups with the "Move to the Edge" tagline are retired: remove them, or use
`<Brand variant="extended" />` (AZION technologies) where a tagline lockup stood. The codemod
rewrites `svg/azion/default` to `Brand` and lists the other imports as `MANUAL`. Another company's
mark (a client, a competitor, a coding agent) is `ThirdPartyLogo` (`@aziontech/webkit/third-party-logo`),
never `Brand`.

### Removed in 6.0: feedback, content, code and chart names

These names are removed in 6.0, with no alias. The codemod rewrites
the prop renames of section 3 (`skeleton` `kind="shape"`, `progress` `shape`, `badge`
`severity="default"`, `overline` `showCursor`, `pricing-card` `planTitle`, `flow-diagram-anchor` `type`, `toast-item` `type`) and the type names; the rest need a
hand edit.

| Component             | Removed                                                 | Use instead                                                   |
| --------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `toast-item`          | `type` (and the value `error`)                          | `severity` (`danger`)                                         |
| `toast`               | `ToastType`, store entry `type`, `data-type`            | `ToastSeverity`, entry `severity`, `data-severity`            |
| `progress`            | `shape`, `ProgressShape`, `data-shape`                  | `variant`, `ProgressVariant`, `data-variant`                  |
| `skeleton`            | `kind="shape"`                                          | `variant="rectangle"`                                         |
| `badge`               | `severity="default"`                                    | `severity="neutral"`                                          |
| `overline`            | `showCursor`                                            | `cursor`                                                      |
| `pricing-card`        | `planTitle` (and its built-in `Pro`)                    | `title`, set on every card                                    |
| `flow-diagram-anchor` | `type`, `FlowDiagramAnchorType`                         | `side`, `FlowDiagramAnchorSide`                               |
| `log-viewer`          | `v-model:warnings-only`, `data-warnings-only`           | `v-model:level` set to `'warn'`                               |
| `log-viewer`          | line `type: 'warning'`                                  | line `type: 'text', level: 'warn'`                            |
| `gauge-chart`         | threshold `color`, `GaugeChartThreshold`, `data-status` | threshold `severity`, `ChartThreshold`, `data-severity`       |
| `chart-reference`     | `ChartReferenceSeverity`                                | `ChartThresholdSeverity` (now also takes the findings levels) |

`Badge` is for counts only (`12`, `99+`): a status word goes to `StatusIndicator` (the state of a
resource) or `Tag` (a category or outcome word). `CodeEditor`'s plain diff mode now marks added and
removed lines in its gutters with the same line diff `CodeBlock` draws. `LogViewer.Steps`
(`@aziontech/webkit/log-viewer-steps`) is the one pipeline of steps for a build or deploy run.

### `Card` has one layout; the catalog tile is `IntegrationCard`

`Card variant="integration"` is now its own component, `IntegrationCard`
(`@aziontech/webkit/integration-card`), with the same props (`title`, `logo`, `vendor`,
`description`, `badges`, `installed`, `href`, `featured`), the `select` event and the `logo`,
`actions` and default slots. `Card` keeps `title`, `padded` and its `header`, `header-actions`,
default and `footer` slots, and drops `variant`. Swap the tag and drop `variant="integration"`:
`<IntegrationCard title="Request Signer" vendor="Acme Inc." @select="open" />`. The types are
`IntegrationCardBadge`, `IntegrationCardBadgeSeverity` and `IntegrationCardBadgeVariant` (were
`CardBadge*`), the test ids `integration-card__*` (were `card__*`) and the locale keys
`integrationCard.byVendor` and `integrationCard.installed` (were `card.*`). The codemod lists the old
props as `MANUAL`.

### Overlay and feedback behaviour

`ConfirmDialog` opens with focus on Cancel and has no close button (an alert
dialog is answered with Cancel, the confirm button or `Esc`). `Popover` moves focus to its first
control on open, and `Tab` past its last control closes it and moves on.

Behaviour that changed with them: `ConfirmDialog` renders `role="alertdialog"`; `StatusIndicator` is
no longer a `role="status"` live region (announce a change you need heard through a toast);
`Toaster` announces through two hidden live regions: a `danger` toast (`toast.error`) interrupts
(assertive), every other kind is polite; the visible stack is no longer `aria-live`;
`Drawer` widths changed (`small` 408px; `medium` 30% of the screen, at least 472px; `large`, now the
default, 40% of the screen, at least 552px; instead of 384 / 672 / 1024 px); `Alert` `close` and `ErrorBoundary` `retry` now pass the triggering event
(handlers that take no argument keep working).

`Alert` has a `title` prop: it draws a bold heading line over the copy. A `title="…"` you set to get
the browser's hover tooltip now shows on the alert instead; move hover text to a `Tooltip`.

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

A test id is the component's own kebab name, with no category: `actions-button` → `button`,
`input-chip` → `chip`, `feedback-alert` → `alert`, `navigation-navigation-menu` →
`navigation-menu`. A sub-component's root uses its own name instead of its parent's id:
`content-item__title` → `item-title`, `feedback-toast__action` → `toast-action`,
`data-table__row` → `table-row`, `overlay-popover__trigger` → `popover-trigger`. Inner parts keep
`${testId}__<part>` under the new root (`actions-button__loading` → `button__loading`), so a root id
you pass yourself still prefixes them. Because a sub-component no longer derives its id from the
root, a `data-testid` you set on the root no longer renames its sub-components: scope the query
(`within(getByTestId('signup-dialog')).getByTestId('dialog-header')`) or set `data-testid` on the
part.

`webkit migrate` rewrites the old ids in test files (`*.test.*`, `*.spec.*`, `e2e/`, `tests/`,
`cypress/`, `playwright/`) from the full map in
[`src/cli/migrations/v6-testids.json`](./src/cli/migrations/v6-testids.json). Ids built in code
(`` `${prefix}-button` ``) and CSS selectors outside test files need a hand edit.

Inner parts use one word per concept:

| Component                                                                                     | v5                                                   | v6                                                               |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| `TutorialPanelHotspot`                                                                        | `__dismiss`                                          | `__close`                                                        |
| `Chart`, `BarList`, `DonutChart`, `GaugeChart`, `MapChart`, `StatTile`, `Tracker`, `CardList` | `__skeleton`                                         | `__loading`                                                      |
| `StatusIndicator`                                                                             | `__spinner`                                          | `__loading`                                                      |
| `TutorialPanel`, `CommandInput`, `FilterMenu`                                                 | `__back`                                             | `__previous`                                                     |
| `SidebarMenu.SubTrigger`                                                                      | `__arrow`                                            | `__chevron`                                                      |
| `ListingIndexSection`, `StoryIndexSection`                                                    | `__filter-button`                                    | `__filter`                                                       |
| `ChartReference` band, line, label                                                            | `-band`, `-line`, `-label`                           | `__band`, `__line`, `__label`                                    |
| `ChartAxis`                                                                                   | `chart-chart__axis-x`                                | `chart-axis` with `data-type="x"`                                |
| `Table` toolbar buttons                                                                       | `__refresh-button`, `__live-button`, `__sort-button` | `table-refresh-button`, `table-live-button`, `table-sort-button` |

### Default sizes follow the house rule

Actions default to `large` and everything else to `medium`. These defaults moved; pass the old
`size` to keep the old look:

| Component        | v5 default | v6 default |
| ---------------- | ---------- | ---------- |
| `CopyButton`     | `small`    | `large`    |
| `ButtonGroup`    | `medium`   | `large`    |
| `Progress`       | `small`    | `medium`   |
| `ConfirmDialog`  | `small`    | `medium`   |
| `CurrencyAmount` | `small`    | `medium`   |
| `HeroTitle`      | `large`    | `medium`   |
| `Drawer`         | `medium`   | `large`    |

`Drawer` is the one exception to the house rule: the first drawer of a flow is the large one, so a
bare `<Drawer>` now opens at `large`. A drawer stacked on top of another (or the AI assistant
drawer) passes `size="medium"`.

### Tag and StatusIndicator colours

`Tag` `severity="secondary"` is removed: it drew the same bordered look as `neutral`, which takes
its place. `Menu.Item` `tag-severity="secondary"` follows. `StatusIndicator` `severity="alt"` is
removed: its dot was the brand orange, outside the shared severity scale; `neutral` (a muted dot)
takes its place, or `info` if the orange marked something to notice. The codemod rewrites all three
to `neutral`.

### Navigation defaults

Defaults that showed placeholder content now default to empty: `Link` (`href`, `icon`: a same-tab
link shows no trailing icon unless `icon` is set), `SidebarMenu.Item` (`label`, `icon`, `tagValue`: no
home glyph on an item without `icon`), `Tabs.Trigger` (`label`) and `Breadcrumb.Item` (`label`, `href`).
`SidebarMenu.SubTrigger` `click` now also passes `{ label, href }` as its second argument.

`Select` now follows the `input-<name>` rule like the rest of the inputs category: `select` →
`select`, and its parts `select-trigger`, `select-content`, `select-option` and `select-group`
→ `select-trigger`, `select-content`, `select-item` and `select-group`
(part ids follow, `select-trigger__value` → `select-trigger__value`). A `data-testid` you
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
| `platform/detail/attached-resources`       | `detail/domains-card`           |
| `platform/states/not-found`                | `state/error-page`              |
| `platform/states/page-wires`               | `state/page-skeleton`           |
| `platform/view/rules-list`                 | `view/rule-list`                |
| `platform/view/split-view`                 | `view/events-explorer`          |
| `shells/documentation`                     | `shell/docs`                    |
| `shells/website`                           | `shell/site`                    |

Variant states use one word set, `loading`, `empty`, `error`, `success`, written
`<subject>-<state>`: `Failed` → `Error`, `<Subject>Failed` → `<Subject>Error` (`LoadFailed` →
`LoadError`, `SaveFailed` → `SaveError`, …), `CompleteView` → `ContinuousLog`, `FailedCompleteView` → `ContinuousLogError`,
`PartialFailure` → `PartialError`, `Succeeded` → `Success`, `LoadingRepositories` →
`RepositoriesLoading`, `LoadingSettings` → `SettingsLoading`, query-editor's `EmptyDatabase` →
`NoTables`, production-checklist's `Complete` → `Success` and delete-dialog's `LabelledField` →
`SettingsRow`. A `#variant` fragment and `add --variant` take the variant file name
(`view/table-view#error`); the PascalCase name still works. Your `webkit.blocks.json` keeps the old
ids: `add <old id>` resolves them with a note. `add` now writes kebab-case files named after the
block: `create-hub.vue`, and `create-hub-connected.vue` for a variant (was `CreateHub.vue` and
`CreateHubConnected.vue`); a PascalCase `--dest` file keeps its casing.

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
  `detail/invocations`. Every phased deploy log composes `LogViewer.Steps`.
- `view/marketplace` lists integrations only (its `Integrations` state is now the
  default); templates live in `view/template-browser`, and its `TemplatesNoMatch` and
  `TemplatePage` variants are template-browser's `NoMatch` and deploy-template's `Form`.
- `data-dashboard` is analytics-dashboard's `Usage` (its RealUser page is health-score-dashboard's
  `RealUser`); `activity-outcomes-dashboard` is security-dashboard's `ByActor`;
  `project-status-dashboard` and `funnel-cohort-dashboard` are removed (off-domain for the console).
- `headers/site-header-section`, `headers/docs-header` and `headers/resource-header` are removed: SiteLayout,
  DocLayout and ConsoleLayout already draw those bars (`shell/*`). The other two are renamed:
  `headers/auth-header` → `top-bar/auth-bar`, `headers/creation-header` → `top-bar/creation-bar`.
- `platform/edit/attribute-editor` → `edit/variables` and `platform/edit/code-editor` →
  `edit/function-editor` (the names belonged to the components they compose).
- `resource-picker`, `payment-method-card`, `get-started`, `production-checklist` and
  `domains-card` carry `kind: "fragment"`: cards placed inside a page, not screens.

Every old id, and every renamed state of a removed block, is in
[`src/cli/migrations/v6-blocks.json`](./src/cli/migrations/v6-blocks.json); `get_block` still
answers an old id with the new block and a `note`. Code you already copied does not change.

### Marketing section defaults

Some marketing sections render differently with the same props. Pass the old value where you need
the old look.

- `FeatureWidgetsSection`: `columns` defaults to `2` (was `3`).
- `NetworkSection`: a `claims` entry can be a string, as before, or a `NetworkSectionClaim`
  object; string claims render as they did.
- `FeatureTabsSection`: the title sits beside the tabs on one row, the tabs are `medium`, and the action is
  a `Button`.
- `MediaSplitSection`: at the medium breakpoint the copy aligns to the top of the media, and a lone
  action is `outlined`.
- `MediaSplitStackSection`: band headings are `h3` under the section title.
- `SitePage`: no trailing gap after a closing band.
- `ClientMosaicSection`: a cell mark on a `white` or `primary` fill defaults to `logoTreatment: 'knockout'`
  (set `'as-is'` to keep its colours).
- `ArticleBodySection`: the share group's copy link button copies the page URL (`location.href`, then
  `article.href`).
- `ArticleIndexSection`, `StoryIndexSection`: with `moreLabel` set the list pages
  by `pageSize` (default `12`), and the load-more button shows only while more remain.

### Marketing names removed in 6.0

These names are removed in 6.0, with no alias. `webkit migrate` rewrites the prop
renames marked with a codemod; move the rest by hand.

| Component                           | Removed                                      | Use                                       | Codemod |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------- | ------- |
| `architecture-tabs-section`         | `interval`                                   | `autoplayInterval` (and `autoplay`)       | yes     |
| `plan-comparison-section`           | section `link`                               | section `action`                          | no      |
| `feature-tabs-section`              | `interval`                                   | `autoplayInterval` (and `autoplay`)       | yes     |
| `hero`                              | `carousel`, `carouselMarks`, `carouselLabel` | `marquee`, `marqueeMarks`, `marqueeLabel` | yes     |
| `hero-section`, `hero-form-section` | `carouselMarks`, `carouselLabel`             | `marqueeMarks`, `marqueeLabel`            | yes     |
| `media-tabs`                        | `@tab-change`                                | `v-model` (`update:modelValue`)           | no      |
| `logo-wall` (types)                 | `LogoItem`, `LogoShape`                      | `LogoWallItem`, `LogoWallShape`           | yes     |
| `stats` (type)                      | `BigNumberItem`                              | `StatsItem`                               | yes     |

Site JSON must use the new keys: an old key such as `carouselMarks` or `interval` is ignored now, so
the band renders without its client strip or with the default hold. `media-tabs`, `quote-tabs`,
`marquee`, `article-highlight-section` (with `autoplay`) and the sections that compose them draw a visible
pause control while they move (WCAG 2.2.2); `recognition-marquee-section` and `photo-marquee-section` now draw it
too, through the marquee loop they share with `marquee`.

### Marketing sections merged

Sections that did the same job as another were folded into it. The old import is gone (the codemod
lists it as manual work); page JSON that still names the old `_id` keeps rendering, because
`SitePage` maps it to its successor and rewrites its props.

| Removed                               | Use                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `hero-copy-on-top-art`                | `hero-section` with `variant="copy-on-top-art"` and the same `levels`                            |
| `hero-with-opening`                   | `hero-section` with `size="large"` and the same `items`                                          |
| `closing-call-to-action-agents`       | `closing-call-to-action-section` with `variant="primary"` and `audiences`                        |
| `closing-call-to-action-templates`    | `template-gallery-section` with `closing`                                                        |
| `banner`                              | `call-to-action` with `variant="announcement"`; the `aside` slot is the default slot             |
| `customer-spotlight`                  | `client-story-columns-section` with `reveal="hover"`; `items` → `cells`, `description` → `story` |
| `sticky-carousel`                     | `process-scroll-section` with `pinned` and `title-variant="centered"`; `items` → `steps`         |
| `quote-carousel`                      | `client-quotes-section`, or `Quote` cards in a `CardCarouselSection`                             |
| `compare-support-tiers`               | `plan-comparison-section`; `tiers` → `plans`                                                     |
| `article-index-blog`                  | `article-index-section` (`filters="category-search"`, the default)                               |
| `article-index-resource-hub`          | `article-index-section` with `filters="facets"`                                                  |
| `use-case-links`                      | `capability-grid-section` with `title-variant="left"`; items keep `href`                         |
| `resource-grid`                       | `capability-grid-section` with `title-variant="horizontal"`; items keep `href`                   |
| `content-columns`                     | `capability-grid-section`; `columns` is `3` or `4`                                               |
| `code-split`                          | `feature-scroll-section`, one item per file with its `code` (a media band shows no code)         |
| `sticky-scroll-code`                  | `feature-scroll-section`; each item keeps its `code`                                             |
| `shell-mockup` (and `-root`, `-part`) | internal to `console-mockup`; show a console screen with `ConsoleMockup`                         |

Their exported types map to the survivor's (`ArticleIndexBlogItem` → `ArticleIndexSectionItem`, …);
`webkit migrate` rewrites them. `CodeSplitTab` and `MediaSplitBandCodeTab` have no successor (code left
the media band): type the files as `FeatureScrollSectionCode`.
`sticky-carousel`'s header offset now follows `--layout-header-height` instead of a fixed `3.5rem`.

### Marketing layouts and media removed in 6.0

The owner's site review (round 2) removed layouts no page uses and limited what a media band shows.
`webkit migrate` rewrites the values it can and lists the rest as MANUAL; page JSON keeps rendering,
because `SitePage` translates each old entry as the table says.

| Component                        | Removed                                                                            | Use                                                                                                                       | Codemod                          | Old page JSON renders as                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `hero-section`                   | `variant="pixel-floor"`                                                            | `variant="title-band"` (every product page opens on the title band)                                                       | yes                              | `title-band`                                                                      |
| `closing-call-to-action-section` | `variant="split"` (it was the default) and `titleMuted`                            | `variant="panel"`, now the default; write the whole headline in `title`                                                   | `split` yes, `titleMuted` MANUAL | `panel`, with `titleMuted` joined onto `title`                                    |
| `media-split-stack-section`      | `variant` (`media-end`, `alternating`)                                             | nothing: every picture sits at the closing end                                                                            | MANUAL (drop the attribute)      | the run, every picture at the end                                                 |
| `media-split-section`            | `codeTabs`, `defaultFile`, `copyAriaLabel`; type `MediaSplitSectionCodeTab`        | `feature-scroll-section`, one item per file with `code: { fileName, code, language?, fileIcon?, copyAriaLabel? }`         | MANUAL                           | `feature-scroll-section`, one step per file, the first carrying the band's action |
| `media-split-section`            | `diagram`                                                                          | `console-showcase-section` with `variant="diagram"` and the `Diagram` in its `scene` slot, or an illustration in the band | MANUAL                           | `console-showcase-section` `variant: 'diagram'`, the diagram in its `scene` slot  |
| `media-split-stack-section`      | band `diagram`                                                                     | give the band an illustration, a widget or a scene                                                                        | MANUAL (data)                    | the band without its picture (a development warning names it)                     |
| `media-split-section`            | `image` (`{ src, alt?, width?, height?, framed? }`); type `MediaSplitSectionImage` | `illustration`, a name of the illustration registry, with `illustrationAriaLabel`                                         | MANUAL                           | the band without its picture (a development warning names it)                     |
| `media-split-stack-section`      | band `image`, `imageAlt`, `imageFramed`; type `MediaSplitStackSectionImageMedia`   | band `illustration`, a registry name, with `illustrationLabel`                                                            | MANUAL (data)                    | the band without its picture (a development warning names it)                     |
| `feature-tiles-section`          | tile `image`, `alt`                                                                | tile `illustration`, a registry name                                                                                      | MANUAL (data)                    | the tile without its picture                                                      |
| `network-section`                | an optional benefit `icon`                                                         | `NetworkSectionBenefit.icon` is required: give every benefit an Azion icon class                                          | MANUAL (data)                    | unchanged; a benefit with no icon draws no glyph                                  |

- A media band's picture is required and is a drawn asset: an illustration or a registered scene
  (the console `widget` is one). `MediaSplitStackSectionBand` is now a union that requires one;
  `MediaSplitSection` keeps flat props, so a band with no media (or only a `Diagram` scene) logs a
  development warning.
- The sections take art from the illustration registry only, as on main since 5.13: the picture URL
  field is gone from `FeatureTilesSection` (tile `image`, `alt`), `MediaSplitSection` (`image`, with
  its `framed` plate) and `MediaSplitStackSection` (band `image`, `imageAlt`, `imageFramed`). Name a
  registry scene in `illustration` instead (`llms/foundations/illustrations.md`, MCP `list_assets`);
  the scenes that shipped only as files (`branches`, `personal-tokens`, `usage-chart`) are
  registered. A tile or band left without an illustration renders
  without its picture, and `webkit migrate` reports an `image` attribute on `MediaSplitSection`.
- `CapabilityGridSection` icons are all or none: a benefits grid gives every item an icon, a resource
  list or text columns none. A grid that mixes them logs a development warning.

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
- **Toast.** `Toaster` `position` and the per-toast `position` option take
  `top-start | top-center | top-end | bottom-start | bottom-center | bottom-end` (`bottom-right` →
  `bottom-end`, `top-left` → `top-start`, …; the default is `bottom-end`). Under `rtl` `bottom-end`
  sits at the bottom left. The codemod rewrites the attribute; a `position` in a `toast()` call or in
  `app.use(ToastPlugin, { … })` options needs a hand edit.
- **Overlays.** `side` and `align` take `start` / `end` and follow the direction (see "Overlays:
  `side` and `align` replace `placement`"): menus, popovers, list boxes and date panels anchored at
  the start edge open from the trigger's right edge under `rtl`.
- **User data.** `Input`, `Textarea`, `NumberInput` and `PasswordInput` render `dir="auto"` unless
  you pass `dir`; `CodeBlock` lines, `Kbd`, `LogViewer` timestamps and the `BrowserFrame` address are
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
  `Wizard` hides its rail below `@2xl` of the wizard (was: the `md` viewport). `SettingsRow` keeps its two
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
- **Reflow.** `ToggleGroup`, `DatePicker`, `RadioGroup` cards, `Eyebrow`, the `Accordion` trigger and
  `Resizable` no longer overflow a 320 px box (they truncate, wrap or clip instead). A
  `singleLine` `Eyebrow` wraps below `sm`.

### Languages

v6 adds `ConfigProvider` (`@aziontech/webkit/config-provider`). Mount it once at the app root with the
user's locale:

```vue
<script setup>
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import ConfigProvider from '@aziontech/webkit/config-provider'
</script>

<template>
  <ConfigProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
  >
    <App />
  </ConfigProvider>
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

`messages` overrides use the catalog's `group.key`: the group is the component's camelCase name
(`sidebarMenu`, `feedbackReasonDialog`, `dataTable`), a part's keys carry the part (`promptInput.menuResults`,
`copyButton.fallbackTitle`), and strings several components share are in `common` (`common.copy`,
`common.copied`, `common.newTab`, the autoplay pause and resume labels). A search miss is `noMatch`
and a no-data title `emptyTitle` in every group. The catalogs live in `src/locales/<bcp47>.ts`, the
files behind `@aziontech/webkit/locales/pt-BR` and `/locales/es`.

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
- `PhoneInput` opens on the United States (`country` was `'BR'`). Seed the ref you bind to
  `v-model:country` with `'BR'` (or the person's country) where the field should start elsewhere.

Optional text props that defaulted to `undefined` now default to `''`, and an empty string means
"not set", so the rendered output does not change. Code that reads the prop, or compares it with
`undefined`, sees `''` instead:

- `Avatar`: `src`, `alt` and `label` default to `''`; an empty `src` draws the initials or the icon.
- `Kbd`: `keyName` defaults to `''`; an empty `keyName` draws no named key, only the modifiers and the slot.
- `OverflowCount`: `noun` defaults to `''`; an empty `noun` uses the catalog (`item` / `items`).
- `Tag`: `icon` defaults to `''`; an empty `icon` draws no glyph.
- `FileDropzone`: `icon` defaults to `''` and still draws `az az-cloud-upload`; pass an icon class
  to change it, as before.
- `StatTile`: `trend` accepts `null` entries (`(number | null)[]`) for gaps in the sparkline. Arrays
  of numbers keep working; a typed `number[]` variable still assigns to it.

Two behaviour changes need a hand edit:

- `SplitButton`: read or restore the mirrored action with `v-model:selected`.
- `ToggleGroup`: a disabled option no longer shows the lock by itself; set `locked: true` on the
  options a plan or a permission blocks.

### `Hotspot` is a part of `TutorialPanel`

`Hotspot` (`@aziontech/webkit/hotspot`, from the 6.0 previews) is `TutorialPanelHotspot`
(`@aziontech/webkit/tutorial-panel-hotspot`): it only works inside `TutorialPanel.Provider`, so it
lives with it. It is a companion part, imported on its own (no `TutorialPanel.Hotspot`). The codemod
rewrites the import and the tag. Its type is `TutorialPanelHotspotSide`, its test id
`tutorial-panel-hotspot`, and its locale keys moved into the `tutorialPanel` group
(`hotspot.label` → `tutorialPanel.hotspotLabel`, `hotspot.stepOf` → `tutorialPanel.hotspotStepOf`,
`hotspot.previous` / `next` / `finish` → `tutorialPanel.hotspotPrevious` / `hotspotNext` /
`hotspotFinish`). Only one tutorial step is open on a page at a time: when a second
`TutorialPanel.Provider` starts a tutorial, the first one's open step closes and its marker stays.

### Actions, navigation and overlay: one component per job

The codemod rewrites the renamed paths and bindings and prints `MANUAL` for a removed one.

- `menu` → `sidebar-menu` (`Menu` → `SidebarMenu`, every part `menu-*` → `sidebar-menu-*`, types
  `MenuNode` → `SidebarMenuNode`, …): it is only the navigation tree of `Sidebar`, `ConsoleLayout`
  and `DocLayout`. Test ids follow: `navigation-menu-*` → `navigation-sidebar-menu-*`.
  `SidebarMenu.Item` drops `kind="group"`: put the title on `SidebarMenu.Group label`.
- `HelpPanel.Tutorial` and `HelpPanel.Task` are removed (`help-panel-tutorial`, `help-panel-task`,
  the `HelpPanelTaskStatus` type): a tutorial is `TutorialPanel` inside `TutorialPanel.Provider`,
  with its tasks and steps as data and a `TutorialPanelHotspot` on each real control.
- `action-confirmation` → `tool-approval` (`ActionConfirmation` → `ToolApproval`, types
  `ToolApprovalState`, `ToolApprovalKind`, test id `tool-approval`, locale key `toolApproval.*`):
  it is only an agent's request to run a tool; a person confirming their own action uses `ConfirmDialog`.
- Removed names (no alias): `Link` `showIcon` (set `icon`), `Tabs.Item` `selected`
  (`ToggleGroup`), `SplitButton` `model` (`items`), `DropdownMenu.Option` (`DropdownMenu.Item`) and
  the item `#left` / `#right` slots (`#leading` / `#trailing`), `NavigationMenu.Trigger`
  `native-button`, `Tooltip` `@show` / `@hide` (`@update:open`), `Popover` `width` and `PopoverWidth`
  (`size`, `PopoverSize`), `Sidebar` `v-model:collapsed` (`v-model:open`, inverted) and
  `AppHeader.Left` / `.Middle` / `.Nav` / `.Right` (`.Start` / `.Center` / `.End`, test ids
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
  `DateRangePicker` now formats in `ConfigProvider`'s `time-zone` when its own is unbound. The
  locale catalog group `calendar` is renamed `datePicker`, and its placeholder reads "Select a date".
- **`DateRangePicker` hides its time zone selector by default.** `showTimeZone` now defaults to
  `false`: the panel names the zone in a read-only line (`Times in UTC−08:00 · Los Angeles`). A page
  that lets people switch zones adds `show-time-zone` (with `v-model:time-zone`). The start and end
  time fields also list the day in 30-minute steps; typing a time still works.
- **`DateRangePicker` opens on Absolute, calendar first, and offers Refresh every.** The tabs read
  `Absolute` then `Relative`; the panel opens on Absolute unless the value is relative. The Absolute
  tab shows the month grid before the start and end fields. `showRefresh` now defaults to `true`:
  a Refresh every select (Off, 10 seconds … 1 hour) sets `v-model:refresh-interval`, and the picker
  fires `@refresh` on each tick. Run your query on `@refresh`, or pass `:show-refresh="false"` where
  the page cannot re-run it. (DateRangePicker is new in 6.0, so no 5.x app needs a change.)
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
  `transfer-list`, the catalog group `transferList`; `dataKey` is gone (the
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

The Claude Code agent `webkit-expert` is `webkit-advisor` (an agent name ends in an agent noun):
`sync` writes `.claude/agents/webkit-advisor.md`; delete the old `webkit-expert.md`.

### Lint rules renamed

Every rule of `@aziontech/webkit/eslint-plugin` starts with a `no-`, `prefer-` or `require-` verb.
The old ids are gone, so a config or `eslint-disable` comment that names one reports an unknown rule;
`migrate v6` rewrites them. `valid-import-path` and `authoring-standards` shipped in 5.x; the others
existed only in 6.0 previews.

| Old rule                            | 6.0 rule                                    |
| ----------------------------------- | ------------------------------------------- |
| `webkit/authoring-standards`        | `webkit/require-authoring-standards`        |
| `webkit/composable-readonly-return` | `webkit/require-readonly-composable-return` |
| `webkit/composable-scope-cleanup`   | `webkit/require-composable-scope-cleanup`   |
| `webkit/accessible-name`            | `webkit/require-accessible-name`            |
| `webkit/container-needs-width`      | `webkit/require-container-width`            |
| `webkit/header-search-trigger`      | `webkit/require-header-search`              |
| `webkit/menu-node-href`             | `webkit/prefer-href-in-menu-node`           |
| `webkit/valid-import-path`          | `webkit/no-unknown-import`                  |

### Component CSS variables carry the component name

A CSS variable a component reads is named `--<component>-<part>-<property>`. The one you may set
yourself changed: a sticky bar above a `Hero` declares its height as `--hero-banner-offset`
(was `--banner-offset`), so a `variant="screen"` band still measures one screen beneath it. The
other `Hero` variables follow (`--banner-top-height`, `--banner-floor-bg`, `--banner-z-top`… →
`--hero-banner-top-height`, `--hero-banner-floor-bg`, `--hero-banner-z-top`…), the console
mockup fades a host sets are `--console-mockup-fade-start` / `-end` / `-edge` / `-color` (was
`--mockup-fade-*`), and the sidebar menu's focus-ring offsets are `--sidebar-menu-ring-offset` /
`--sidebar-menu-item-ring-offset` (was `--menu-ring-offset` / `--menu-item-ring-offset`).
`migrate v6` rewrites all of them. A page section's own variables carry its `-section` name
(`--process-scroll-section-offset`, `--console-showcase-section-crop`, …).

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

Component categories are singular and match the source folders: `actions` → `action`, `inputs` →
`input`, `sections` → `section`, `documentation` → `docs`, and `utils` is gone (`spinner` is
`feedback`, `config-provider` is `provider`). The `category` of every `imports` entry and the
`title` of every example (`Components/Action/Button`, was `Components/Primitives/Actions/Button`)
follow.

Paths in `file`, `examplesFile` and `docsFile` are relative to the folder that holds `catalog.json`. The MCP tools
(`get_block`, `get_component`, `get_usage_example`) return the same answers as before. The asset
lists are `catalog/assets/<kind>.json` in kebab-case (`brand-marks.json`, `icons.json`).

### Example files renamed

The first example of every component is `default.vue`, and the others are named after what they
show. A tool that opens an example by path or name (`get_usage_example`, `/example?path=`) uses the
new names: `table/composition` → `table/default`, `footer/default-footer` → `footer/default`,
`*/read-only` → `*/readonly`, `*/grouped` and `*/with-groups` → `*/groups`, `*/kinds` →
`*/variants`, `input-group/with-addon-left|right` → `with-addon-start|end`, `*/failed` →
`*/error`, `select/transparent` → `select/ghost`. The full list is in `examples.json` of each
folder.

### Performance

- `PhoneInput` loads the flag sprite (a 74 KB WebP) with a dynamic `import()` after the field
  mounts in the browser, so it stays out of the initial chunk; until it arrives the flag boxes are
  blank. The closed field shows the selected country's flag, name and dial code.
- `PhoneInput` offers every country and territory with a calling code (245, from Google's
  libphonenumber metadata), with the United States first; set `default-country` to start on another.
- The flag sprite behind `@aziontech/webkit/styles/country-flags` is now
  `src/images/country-flags.webp` (it was a PNG) and covers 252 flags. Its `.flag-an`, `.flag-tp`,
  `.flag-ty` and `.flag-zr` classes are removed (Netherlands Antilles, East Timor and Zaire no longer
  exist; use `.flag-cw`/`.flag-sx`/`.flag-bq`, `.flag-tl` and `.flag-cd`); `.flag-ac`, `.flag-ax`,
  `.flag-bl`, `.flag-bq`, `.flag-cw`, `.flag-gg`, `.flag-im`, `.flag-je`, `.flag-mf`, `.flag-ps`,
  `.flag-sx`, `.flag-ta`, `.flag-xk` and `.flag-yt` are new.
- `Select`, `MultiSelect`, `LogViewer` and `CodeBlock` mount lists longer than 300 rows in chunks of
  100 as they scroll near view. Tests that count every rendered option, line or log row of a long
  list see only the first chunks; scroll the list, or press an arrow key in a `Select` list, which
  mounts every option.
- A `Tree` of more than 300 nodes renders its visible rows as one flat list (no `role="group"`;
  each treeitem keeps `aria-level`, `aria-setsize` and `aria-posinset`) and mounts them in chunks
  of 100 as they scroll near view. Tests of a large tree see the first chunk and the tab stop's
  row; scroll the tree, or move focus with the keyboard, which mounts the target row.
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
