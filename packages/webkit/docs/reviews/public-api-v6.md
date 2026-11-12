# Public API of v6 (M1.11)

Every export path of `@aziontech/webkit` v6 (this branch; `package.json` still reads 5.11.0 until release-please cuts 6.0.0) (`package.json` `exports`, 754 paths) compared with `main`'s 5.11.0 (694 paths). Renames come from `src/cli/migrations/v6.json` `components` (the codemod rewrites them); removals from its `removed` map, each with the replacement `migrate v6` points to. Generated from the two `package.json` files; regenerate it when exports change.

| Status    | Paths |
| --------- | ----- |
| New in v6 | 73    |
| Renamed   | 31    |
| Unchanged | 650   |
| Removed   | 13    |

73 + 31 + 650 = 754 paths in v6; 31 + 650 + 13 = 694 paths in 5.11.0.

## Agreement with the migration check

The three sources agree:

- `package.json` `exports` and `catalog.json` `imports` list the same 754 subpaths (none missing on either side).
- `node scripts/check-migrations.mjs` passes against `scripts/api-snapshot.json` with 0 unrecorded additions. Before M1.11 the snapshot lagged the catalog by 38 additions from M1.9 and M1.10 (exports `property-filter`, `collection-preferences`, `cards`, `use-collection`; props `timeZone` on `chart`/`chart-root`, `keyName` on `kbd`, `density`, `estimateRowHeight`, `exportRows`, `striped`, `virtual`, `wrapLines` on `table`/`table-root`, and the props of the three new collection components); M1.11 recorded them with `--update`. Nothing was removed or renamed without a codemod entry.
- `node scripts/check-migrations.mjs --against origin/main` passes against `main`'s catalog: every one of its 694 exports is still exported, renamed through `v6.json` `components`, or listed in `v6.json` `removed`; every removed or renamed prop and prop value has a `v6-props.json` entry; 440 additions (exports and props).
- `v6.json` `removed` has 15 entries; 13 are the `field-*` exports of 5.11.0 in the table below. The other two, `field-time` and `field-file-upload`, were added on this branch after 5.11.0 and folded into `Field` before release, so they never shipped; the codemod still maps them.

## Assets — illustrations and globe

14 paths: 0 new, 0 renamed, 14 unchanged.

Unchanged: `assets/ai-gateway.svg`, `assets/azion-highlight.svg`, `assets/azion-rest-api.svg`, `assets/branches.svg`, `assets/brand-globe-scene`, `assets/combine-data-and-vector-search.svg`, `assets/ddos-protection.svg`, `assets/distributed-apis-tile.svg`, `assets/personal-tokens.svg`, `assets/quick-start-with-templates.svg`, `assets/real-time-metrics-error-rate.svg`, `assets/real-time-metrics-status-codes.svg`, `assets/spinning-globe`, `assets/usage-chart.svg`.

## Assets — logos

346 paths: 0 new, 0 renamed, 346 unchanged.

Unchanged: `assets/agi-extended-color.svg`, `assets/agibank-extended-color.svg`, `assets/agibank-extended-mono.svg`, `assets/agibank-extended-reversed.svg`, `assets/akamai-extended-color.svg`, `assets/akamai-extended-mono.svg`, `assets/akamai-extended-reversed.svg`, `assets/akamai-symbol-color.svg`, `assets/akamai-symbol-mono.svg`, `assets/akamai-symbol-reversed.svg`, `assets/alpargatas-extended-color.svg`, `assets/alpargatas-extended-mono.svg`, `assets/americamovil-extended-color.svg`, `assets/americanas-extended-color.svg`, `assets/americanas-extended-mono.svg`, `assets/americanas-extended-reversed.svg`, `assets/angeloni-extended-color.svg`, `assets/angular-symbol-mono.svg`, `assets/anthropic-extended-mono.svg`, `assets/arezzo-extended-color.svg`, `assets/arezzo-extended-mono.svg`, `assets/arezzo-extended-reversed.svg`, `assets/astro-symbol-mono.svg`, `assets/aws-extended-color.svg`, `assets/aws-extended-mono.svg`, `assets/aws-extended-reversed.svg`, `assets/axur-extended-color.svg`, `assets/axur-extended-mono.svg`, `assets/axur-extended-reversed.svg`, `assets/ayko-extended-mono.svg`, `assets/azure-symbol-mono.svg`, `assets/b2w-extended-color.svg`, `assets/b2w-extended-mono.svg`, `assets/b2w-extended-reversed.svg`, `assets/banco-de-la-nacion-extended-mono.svg`, `assets/browserless-symbol-mono.svg`, `assets/browserless-symbol-reversed.svg`, `assets/caixa-extended-color.svg`, `assets/caixa-extended-mono.svg`, `assets/caixa-extended-reversed.svg`, `assets/caixa-symbol-color.svg`, `assets/calvinklein-extended-mono.svg`, `assets/calvinklein-extended-reversed.svg`, `assets/ccpa-symbol-color.svg`, `assets/claude-symbol-color.svg`, `assets/client-registry`, `assets/cloudflare-extended-color.svg`, `assets/cloudflare-extended-reversed.svg`, `assets/cloudflare-symbol-color.svg`, `assets/cloudflare-symbol-mono.svg`, `assets/cloudflare-symbol-reversed.svg`, `assets/cobasi-extended-color.svg`, `assets/cocacola-extended-color.svg`, `assets/cocacola-extended-mono.svg`, `assets/cocacola-extended-reversed.svg`, `assets/codex-symbol-mono.svg`, `assets/competitor-registry`, `assets/contabilizei-extended-color.svg`, `assets/contabilizei-extended-mono.svg`, `assets/contabilizei-extended-reversed.svg`, `assets/contabilizei-symbol-color.png`, `assets/copilot-symbol-color.svg`, `assets/cpra-symbol-color.svg`, `assets/crateandbarrel-extended-mono.svg`, `assets/crateandbarrel-extended-reversed.svg`, `assets/crefisa-extended-color.svg`, `assets/crefisa-extended-mono.svg`, `assets/crefisa-extended-reversed.svg`, `assets/csu-digital-extended-color.svg`, `assets/cursor-symbol-mono.svg`, `assets/dafiti-extended-mono.svg`, `assets/dafiti-extended-reversed.svg`, `assets/datadog-symbol-color.svg`, `assets/datadome-extended-mono.svg`, `assets/datadome-extended-reversed.svg`, `assets/digiplus-extended-color.svg`, `assets/digiplus-extended-mono.svg`, `assets/digiplus-extended-reversed.svg`, `assets/docusaurus-symbol-mono.svg`, `assets/drizzle-extended-color.svg`, `assets/elastic-symbol-mono.svg`, `assets/eleventy-symbol-mono.svg`, `assets/embratel-extended-color.svg`, `assets/embratel-extended-mono.svg`, `assets/embratel-extended-reversed.svg`, `assets/equinix-extended-color.svg`, `assets/exame-extended-color.svg`, `assets/exame-extended-mono.svg`, `assets/exame-extended-reversed.svg`, `assets/fam-extended-color.svg`, `assets/fam-extended-mono.svg`, `assets/fam-extended-reversed.svg`, `assets/fastly-extended-color.svg`, `assets/fastly-extended-mono.svg`, `assets/fastly-extended-reversed.svg`, `assets/fastly-symbol-color.svg`, `assets/fastly-symbol-mono.svg`, `assets/fastly-symbol-reversed.svg`, `assets/fauna-extended-color.svg`, `assets/fauna-extended-mono.svg`, `assets/fauna-extended-reversed.svg`, `assets/forrester-extended-color.svg`, `assets/forrester-extended-mono.svg`, `assets/forrester-extended-reversed.svg`, `assets/fourbank-extended-color.svg`, `assets/fourbank-extended-mono.svg`, `assets/fourbank-extended-reversed.svg`, `assets/frost-and-sullivan-extended-color.svg`, `assets/frost-and-sullivan-extended-mono.svg`, `assets/frost-and-sullivan-extended-reversed.svg`, `assets/g2-symbol-color.svg`, `assets/gartner-extended-color.svg`, `assets/gartner-extended-mono.svg`, `assets/gartner-extended-reversed.svg`, `assets/gatsby-symbol-mono.svg`, `assets/gcp-symbol-mono.svg`, `assets/gdpr-symbol-color.svg`, `assets/gemini-symbol-color.svg`, `assets/google-symbol-color.svg`, `assets/getninjas-extended-mono.svg`, `assets/getninjas-extended-reversed.svg`, `assets/gfg-extended-mono.svg`, `assets/gfg-extended-reversed.svg`, `assets/gigaom-extended-color.svg`, `assets/gigaom-extended-mono.svg`, `assets/gigaom-extended-reversed.svg`, `assets/github-symbol-mono.svg`, `assets/gpa-extended-color.svg`, `assets/gpa-extended-mono.svg`, `assets/gpa-extended-reversed.svg`, `assets/gpa-photo.jpg`, `assets/gpa-symbol-color.svg`, `assets/grafana-symbol-mono.svg`, `assets/graphql-symbol-mono.svg`, `assets/grendene-extended-color.svg`, `assets/groq-extended-mono.svg`, `assets/gru-airport-extended-color.svg`, `assets/gruposabemi-extended-color.svg`, `assets/gruposabemi-extended-mono.svg`, `assets/gruposabemi-extended-reversed.svg`, `assets/hdi-extended-color.svg`, `assets/hdi-extended-mono.svg`, `assets/hdi-extended-reversed.svg`, `assets/herospark-extended-color.svg`, `assets/herospark-extended-reversed.svg`, `assets/herospark-symbol-reversed.svg`, `assets/hexo-symbol-mono.svg`, `assets/hono-symbol-mono.svg`, `assets/hugo-symbol-mono.svg`, `assets/ibero-extended-color.svg`, `assets/ibero-extended-mono.svg`, `assets/ibero-extended-reversed.svg`, `assets/ietf-extended-color.svg`, `assets/ifood-extended-color.svg`, `assets/ifood-extended-reversed.svg`, `assets/ifood-symbol-color.svg`, `assets/incognia-extended-color.png`, `assets/infoblox-extended-mono.svg`, `assets/ipiranga-extended-color.svg`, `assets/ipiranga-extended-mono.svg`, `assets/ipiranga-extended-reversed.svg`, `assets/itau-extended-color.svg`, `assets/itau-extended-reversed.webp`, `assets/itau-symbol-color.svg`, `assets/jamstack-symbol-color.svg`, `assets/javascript-symbol-mono.svg`, `assets/jekyll-symbol-mono.svg`, `assets/kafka-extended-mono.svg`, `assets/kalunga-extended-mono.svg`, `assets/kalunga-extended-reversed.svg`, `assets/kroton-extended-color.png`, `assets/lendico-extended-color.svg`, `assets/lendico-extended-mono.svg`, `assets/lendico-extended-reversed.svg`, `assets/lgpd-symbol-color.svg`, `assets/locaweb-extended-color.svg`, `assets/lojadomecanico-extended-color.svg`, `assets/lojadomecanico-extended-mono.svg`, `assets/lojadomecanico-extended-reversed.svg`, `assets/lojaintegrada-extended-color.svg`, `assets/lojaintegrada-extended-reversed.svg`, `assets/madeiramadeira-extended-color.svg`, `assets/madeiramadeira-extended-mono.svg`, `assets/madeiramadeira-extended-reversed.svg`, `assets/madeiramadeira-symbol-color.svg`, `assets/madeiramadeira-symbol-reversed.svg`, `assets/magalu-extended-color.svg`, `assets/magalu-extended-mono.svg`, `assets/magalu-extended-reversed.svg`, `assets/magalu-symbol-color.png`, `assets/marisa-extended-color.svg`, `assets/marisa-extended-mono.svg`, `assets/marisa-extended-reversed.svg`, `assets/meliuz-extended-color.svg`, `assets/mobiauto-extended-color.svg`, `assets/mobiauto-extended-mono.svg`, `assets/mobiauto-extended-reversed.svg`, `assets/monashees-extended-mono.svg`, `assets/monashees-extended-reversed.svg`, `assets/mongodb-symbol-color.svg`, `assets/motorola-extended-color.svg`, `assets/motorola-extended-mono.svg`, `assets/motorola-extended-reversed.svg`, `assets/mysql-symbol-reversed.svg`, `assets/neogrid-extended-color.svg`, `assets/neon-extended-color.svg`, `assets/neon-extended-mono.svg`, `assets/neon-extended-reversed.svg`, `assets/netshoes-extended-color.svg`, `assets/netshoes-extended-reversed.svg`, `assets/netshoes-photo.jpg`, `assets/newbalance-extended-color.svg`, `assets/newbalance-extended-mono.svg`, `assets/newbalance-extended-reversed.svg`, `assets/nextjs-symbol-mono.svg`, `assets/nodejs-symbol-color.svg`, `assets/nuxt-extended-mono.svg`, `assets/nzn-extended-color.svg`, `assets/nzn-extended-mono.svg`, `assets/nzn-extended-reversed.svg`, `assets/omelete-extended-color.svg`, `assets/omelete-extended-mono.svg`, `assets/omelete-extended-reversed.svg`, `assets/omeleteco-extended-mono.svg`, `assets/omeleteco-extended-reversed.svg`, `assets/onnx-symbol-mono.svg`, `assets/openai-symbol-mono.svg`, `assets/opencode-symbol-mono.svg`, `assets/panasonic-extended-color.svg`, `assets/panasonic-extended-mono.svg`, `assets/panasonic-extended-reversed.svg`, `assets/panvel-extended-color.svg`, `assets/panvel-extended-mono.svg`, `assets/panvel-extended-reversed.svg`, `assets/pci-dss-symbol-color.svg`, `assets/pernambucanas-extended-color.svg`, `assets/pernambucanas-extended-mono.svg`, `assets/pernambucanas-extended-reversed.svg`, `assets/petz-extended-color.png`, `assets/petz-extended-mono.svg`, `assets/petz-extended-reversed.svg`, `assets/planetscale-symbol-mono.svg`, `assets/portobello-extended-mono.svg`, `assets/portocred-extended-color.svg`, `assets/portocred-extended-mono.svg`, `assets/portocred-extended-reversed.svg`, `assets/postgresql-symbol-color.svg`, `assets/preact-symbol-mono.svg`, `assets/primevideo-extended-color.svg`, `assets/primevideo-extended-mono.svg`, `assets/primevideo-extended-reversed.svg`, `assets/prisma-symbol-reversed.svg`, `assets/provu-extended-color.svg`, `assets/provu-extended-mono.svg`, `assets/provu-extended-reversed.svg`, `assets/qualcomm-extended-mono.svg`, `assets/qualcomm-extended-reversed.svg`, `assets/queroquero-extended-color.svg`, `assets/queroquero-extended-mono.svg`, `assets/queroquero-extended-reversed.svg`, `assets/qwik-symbol-mono.svg`, `assets/radware-extended-color.svg`, `assets/radware-extended-mono.svg`, `assets/radware-extended-reversed.svg`, `assets/rbs-extended-color.svg`, `assets/rbs-extended-mono.svg`, `assets/rbs-extended-reversed.svg`, `assets/react-symbol-mono.svg`, `assets/redis-symbol-color.svg`, `assets/remix-symbol-mono.svg`, `assets/renner-extended-color.svg`, `assets/renner-extended-mono.svg`, `assets/renner-extended-reversed.svg`, `assets/renner-symbol-reversed.svg`, `assets/resend-extended-mono.svg`, `assets/resend-extended-reversed.svg`, `assets/rico-extended-color.svg`, `assets/rico-extended-mono.svg`, `assets/rico-extended-reversed.svg`, `assets/rocketchat-extended-color.svg`, `assets/rocketchat-extended-mono.svg`, `assets/rocketchat-extended-reversed.svg`, `assets/saffe-extended-color.svg`, `assets/saffe-extended-mono.svg`, `assets/saffe-extended-reversed.svg`, `assets/samsung-extended-color.svg`, `assets/samsung-extended-mono.svg`, `assets/samsung-extended-reversed.svg`, `assets/saraiva-extended-color.svg`, `assets/saraiva-extended-mono.svg`, `assets/saraiva-extended-reversed.svg`, `assets/serverless-symbol-color.svg`, `assets/shoptime-extended-color.svg`, `assets/shoptime-extended-mono.svg`, `assets/shoptime-extended-reversed.svg`, `assets/sky-extended-color.svg`, `assets/sky-extended-mono.svg`, `assets/sky-extended-reversed.svg`, `assets/soc-symbol-color.svg`, `assets/sqlite-symbol-mono.svg`, `assets/stone-extended-color.svg`, `assets/stripe-extended-color.svg`, `assets/stripe-extended-reversed.svg`, `assets/submarino-extended-color.svg`, `assets/submarino-extended-mono.svg`, `assets/submarino-extended-reversed.svg`, `assets/supabase-symbol-color.svg`, `assets/svelte-symbol-mono.svg`, `assets/tc39-symbol-mono.svg`, `assets/telefonica-extended-color.svg`, `assets/telefonica-extended-mono.svg`, `assets/telefonica-extended-reversed.svg`, `assets/terraform-symbol-mono.svg`, `assets/todocartoes-extended-mono.svg`, `assets/todocartoes-extended-reversed.svg`, `assets/topazio-extended-color.svg`, `assets/topazio-extended-mono.svg`, `assets/topazio-extended-reversed.svg`, `assets/tray-symbol-color.svg`, `assets/turso-symbol-mono.svg`, `assets/unicesumar-extended-color.svg`, `assets/unicesumar-extended-mono.svg`, `assets/unicesumar-extended-reversed.svg`, `assets/unicred-extended-color.svg`, `assets/unicred-extended-mono.svg`, `assets/unicred-extended-reversed.svg`, `assets/uninter-extended-color.svg`, `assets/uninter-extended-reversed.svg`, `assets/upstash-symbol-mono.svg`, `assets/vercel-extended-mono.svg`, `assets/vercel-extended-reversed.svg`, `assets/vite-symbol-mono.svg`, `assets/vitepress-symbol-mono.svg`, `assets/vtex-extended-color.svg`, `assets/vtex-extended-mono.svg`, `assets/vtex-extended-reversed.svg`, `assets/vue-symbol-mono.svg`, `assets/vuepress-symbol-mono.svg`, `assets/w3c-symbol-mono.svg`, `assets/walmart-extended-color.svg`, `assets/walmart-extended-mono.svg`, `assets/walmart-extended-reversed.svg`, `assets/webassembly-symbol-mono.svg`, `assets/windsurf-symbol-mono.svg`, `assets/workers-cf-symbol-color.svg`, `assets/zoop-extended-color.svg`.

## Components — actions

7 paths: 0 new, 1 renamed, 6 unchanged.

| Path           | Status  | Note                    |
| -------------- | ------- | ----------------------- |
| `toggle-group` | renamed | from `segmented-button` |

Unchanged: `button`, `button-highlight`, `mini-button`, `copy-button`, `icon-button`, `split-button`.

## Components — chart

25 paths: 25 new, 0 renamed, 0 unchanged.

| Path                       | Status | Note |
| -------------------------- | ------ | ---- |
| `chart`                    | new    |      |
| `chart-root`               | new    |      |
| `chart-area`               | new    |      |
| `chart-axis`               | new    |      |
| `chart-bar`                | new    |      |
| `chart-crosshair`          | new    |      |
| `chart-grid`               | new    |      |
| `chart-legend`             | new    |      |
| `chart-line`               | new    |      |
| `chart-tooltip`            | new    |      |
| `chart-card`               | new    |      |
| `chart-card-root`          | new    |      |
| `chart-card-content`       | new    |      |
| `chart-card-controls`      | new    |      |
| `chart-card-description`   | new    |      |
| `chart-card-drag-handle`   | new    |      |
| `chart-card-footer`        | new    |      |
| `chart-card-header`        | new    |      |
| `chart-card-resize-handle` | new    |      |
| `chart-card-title`         | new    |      |
| `donut-chart`              | new    |      |
| `stat-tile`                | new    |      |
| `bar-list`                 | new    |      |
| `spark-chart`              | new    |      |
| `tracker`                  | new    |      |

## Components — code

5 paths: 0 new, 0 renamed, 5 unchanged.

Unchanged: `log-view`, `log-view-content`, `log-view-footer`, `log-view-header`, `code-block`.

## Components — content

45 paths: 12 new, 1 renamed, 32 unchanged.

| Path                    | Status  | Note            |
| ----------------------- | ------- | --------------- |
| `severity-tag`          | new     |                 |
| `help-panel`            | new     |                 |
| `help-panel-root`       | new     |                 |
| `help-panel-header`     | new     |                 |
| `help-panel-section`    | new     |                 |
| `help-panel-links`      | new     |                 |
| `help-panel-tutorial`   | new     |                 |
| `help-panel-task`       | new     |                 |
| `key-value-pairs`       | new     |                 |
| `key-value-pairs-root`  | new     |                 |
| `key-value-pairs-item`  | new     |                 |
| `key-value-pairs-group` | new     |                 |
| `card`                  | renamed | from `card-box` |

Unchanged: `overline`, `tag`, `avatar`, `badge`, `brand`, `browser-frame`, `accordion`, `accordion-root`, `accordion-item`, `accordion-trigger`, `accordion-content`, `card-pricing`, `item`, `item-root`, `item-group`, `item-list`, `item-separator`, `item-media`, `item-content`, `item-title`, `item-description`, `item-actions`, `item-header`, `item-footer`, `currency`, `illustration`, `product-widget`, `shell-mockup`, `shell-mockup-root`, `shell-mockup-part`, `kbd`, `network-map`.

## Components — data

36 paths: 4 new, 4 renamed, 28 unchanged.

| Path                     | Status  | Note                       |
| ------------------------ | ------- | -------------------------- |
| `property-filter`        | new     |                            |
| `collection-preferences` | new     |                            |
| `cards`                  | new     |                            |
| `tree`                   | new     |                            |
| `pagination`             | renamed | from `paginator`           |
| `pagination-root`        | renamed | from `paginator-root`      |
| `pagination-info`        | renamed | from `paginator-info`      |
| `pagination-page-size`   | renamed | from `paginator-page-size` |

Unchanged: `table`, `table-root`, `table-header`, `table-body`, `table-footer`, `table-caption`, `table-row`, `table-head-cell`, `table-cell`, `table-sort-button`, `table-toolbar`, `table-search`, `table-filter`, `table-applied-filters`, `table-column-selector`, `table-export`, `table-refresh-button`, `pagination-button`, `flow`, `flow-root`, `flow-node`, `flow-parallel`, `flow-anchor`, `pick-list`, `pick-list-root`, `pick-list-source`, `pick-list-target`, `pick-list-controls`.

## Components — documentation

14 paths: 0 new, 0 renamed, 14 unchanged.

Unchanged: `doc-callout`, `doc-card`, `doc-card-group`, `doc-frame`, `doc-item`, `doc-on-this-page`, `doc-page-header`, `doc-pagination`, `doc-prompt`, `doc-prose`, `doc-step`, `doc-steps`, `doc-tooltip`, `doc-update`.

## Components — feedback

12 paths: 0 new, 2 renamed, 10 unchanged.

| Path       | Status  | Note                |
| ---------- | ------- | ------------------- |
| `alert`    | renamed | from `message`      |
| `progress` | renamed | from `progress-bar` |

Unchanged: `empty-state`, `status-indicator`, `toast`, `toast-root`, `toast-item`, `toast-title`, `toast-description`, `toast-action`, `toast-close`, `skeleton`.

## Components — inputs

48 paths: 15 new, 4 renamed, 29 unchanged; 13 removed.

| Path                   | Status  | Note                                                                                                              |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `input-group-input`    | new     |                                                                                                                   |
| `field`                | new     |                                                                                                                   |
| `field-root`           | new     |                                                                                                                   |
| `field-label`          | new     |                                                                                                                   |
| `field-description`    | new     |                                                                                                                   |
| `field-error`          | new     |                                                                                                                   |
| `field-group`          | new     |                                                                                                                   |
| `field-set`            | new     |                                                                                                                   |
| `field-legend`         | new     |                                                                                                                   |
| `field-content`        | new     |                                                                                                                   |
| `field-title`          | new     |                                                                                                                   |
| `field-separator`      | new     |                                                                                                                   |
| `phone-input`          | new     |                                                                                                                   |
| `file-dropzone`        | new     |                                                                                                                   |
| `slider`               | new     |                                                                                                                   |
| `input`                | renamed | from `input-text`                                                                                                 |
| `number-input`         | renamed | from `input-number`                                                                                               |
| `password-input`       | renamed | from `input-password`                                                                                             |
| `radio-cards`          | renamed | from `box-grid-selection`                                                                                         |
| `field-select`         | removed | use Field + FieldLabel + Select (Trigger/Content/Option) + FieldDescription                                       |
| `field-text`           | removed | use Field + FieldLabel + Input + FieldDescription                                                                 |
| `field-input-group`    | removed | use Field + FieldLabel + InputGroup (Addon + InputGroupInput) + FieldDescription                                  |
| `field-text-switch`    | removed | use Field + FieldLabel + InputGroup (InputGroupInput + Addon with Switch) + FieldDescription                      |
| `field-phone-number`   | removed | use Field + FieldLabel + PhoneInput + FieldDescription                                                            |
| `field-password`       | removed | use Field + FieldLabel + PasswordInput + FieldDescription (+ PasswordRequirements for the rules row)              |
| `field-checkbox`       | removed | use Field orientation=horizontal + Checkbox + FieldContent (FieldLabel + FieldDescription)                        |
| `field-checkbox-block` | removed | use FieldLabel wrapping Field orientation=horizontal + Checkbox + FieldContent (FieldTitle + FieldDescription)    |
| `field-radio`          | removed | use Field orientation=horizontal + RadioButton + FieldContent (FieldLabel + FieldDescription)                     |
| `field-radio-block`    | removed | use FieldLabel wrapping Field orientation=horizontal + RadioButton + FieldContent (FieldTitle + FieldDescription) |
| `field-switch`         | removed | use Field orientation=horizontal + Switch + FieldContent (FieldLabel + FieldDescription)                          |
| `field-switch-block`   | removed | use FieldLabel wrapping Field orientation=horizontal + Switch + FieldContent (FieldTitle + FieldDescription)      |
| `field-textarea`       | removed | use Field + FieldLabel + Textarea + FieldDescription                                                              |

Unchanged: `calendar`, `calendar-root`, `calendar-preset`, `calendar-clear`, `input-group`, `input-group-root`, `input-group-addon`, `helper-text`, `hint`, `label`, `password-requirements`, `chip`, `checkbox`, `radio-button`, `switch`, `theme-switcher`, `textarea`, `multi-select`, `multi-select-root`, `multi-select-trigger`, `multi-select-content`, `multi-select-group`, `multi-select-option`, `select`, `select-root`, `select-trigger`, `select-content`, `select-group`, `select-option`.

## Components — layout

21 paths: 5 new, 5 renamed, 11 unchanged.

| Path               | Status  | Note                          |
| ------------------ | ------- | ----------------------------- |
| `page-header`      | new     |                               |
| `section-header`   | new     |                               |
| `settings-section` | new     |                               |
| `setting-row`      | new     |                               |
| `save-bar`         | new     |                               |
| `separator`        | renamed | from `divider`                |
| `resizable`        | renamed | from `resizable-panel`        |
| `resizable-root`   | renamed | from `resizable-panel-root`   |
| `resizable-handle` | renamed | from `resizable-panel-handle` |
| `resizable-pane`   | renamed | from `resizable-panel-pane`   |

Unchanged: `footer`, `footer-root`, `footer-column`, `footer-link`, `frame-box`, `scroll-area`, `global-header`, `sidebar`, `sidebar-group`, `sidebar-header`, `sidebar-footer`.

## Components — marketing

41 paths: 0 new, 0 renamed, 41 unchanged.

Unchanged: `hero-title`, `section-title`, `section-gap`, `band-stack`, `logo-wall`, `media-split`, `ticker`, `bento-grid`, `bento-grid-root`, `bento-grid-cell`, `call-to-action`, `diagram`, `big-numbers`, `carousel`, `carousel-root`, `carousel-item`, `carousel-previous`, `carousel-next`, `banner`, `hero`, `hero-root`, `sticky-stack`, `quote-carousel`, `quote`, `media-tabs`, `embed`, `faq`, `content-columns`, `column-navigation`, `column-navigation-root`, `column-navigation-column`, `column-navigation-item`, `card-grid`, `card-grid-root`, `card-grid-cell`, `texture-material`, `topic`, `section-module`, `section-container`, `media-tile`, `quote-tabs`.

## Components — navigation

25 paths: 7 new, 6 renamed, 12 unchanged.

| Path                    | Status  | Note                    |
| ----------------------- | ------- | ----------------------- |
| `page-tabs`             | new     |                         |
| `stepper`               | new     |                         |
| `stepper-root`          | new     |                         |
| `stepper-step`          | new     |                         |
| `wizard`                | new     |                         |
| `wizard-root`           | new     |                         |
| `wizard-step`           | new     |                         |
| `dropdown-menu`         | renamed | from `dropdown`         |
| `dropdown-menu-root`    | renamed | from `dropdown-root`    |
| `dropdown-menu-trigger` | renamed | from `dropdown-trigger` |
| `dropdown-menu-group`   | renamed | from `dropdown-group`   |
| `dropdown-menu-option`  | renamed | from `dropdown-option`  |
| `tabs`                  | renamed | from `tab-view`         |

Unchanged: `breadcrumb`, `breadcrumb-item`, `link`, `menu`, `menu-root`, `menu-group`, `menu-sub`, `menu-sub-trigger`, `menu-sub-content`, `menu-back`, `menu-item`, `navigation-menu`.

## Components — overlay

39 paths: 1 new, 8 renamed, 30 unchanged.

| Path                | Status  | Note                          |
| ------------------- | ------- | ----------------------------- |
| `confirm-dialog`    | new     |                               |
| `command`           | renamed | from `command-menu`           |
| `command-root`      | renamed | from `command-menu-root`      |
| `command-input`     | renamed | from `command-menu-input`     |
| `command-list`      | renamed | from `command-menu-list`      |
| `command-group`     | renamed | from `command-menu-group`     |
| `command-item`      | renamed | from `command-menu-item`      |
| `command-empty`     | renamed | from `command-menu-empty`     |
| `command-separator` | renamed | from `command-menu-separator` |

Unchanged: `tooltip`, `dialog`, `dialog-close`, `dialog-content`, `dialog-description`, `dialog-overlay`, `dialog-portal`, `dialog-title`, `dialog-trigger`, `drawer`, `drawer-close`, `drawer-content`, `drawer-description`, `drawer-overlay`, `drawer-portal`, `drawer-title`, `drawer-trigger`, `panel`, `panel-content`, `panel-footer`, `panel-header`, `popover`, `popover-root`, `popover-trigger`, `popover-content`, `popover-header`, `popover-title`, `popover-description`, `popover-close`, `popover-footer`.

## Components — sections

49 paths: 0 new, 0 renamed, 49 unchanged.

Unchanged: `architecture-tabs`, `article-body`, `article-cards`, `article-highlight`, `article-index-blog`, `article-index-resource-hub`, `cli-terminal`, `client-mosaic`, `client-mosaic-columns`, `client-quotes`, `closing-call-to-action`, `closing-call-to-action-agents`, `closing-call-to-action-newsletter`, `code-split`, `compare-plans`, `compare-support-tiers`, `comparison-table`, `compliance-badges`, `contact-hub`, `faq-section`, `feature-scroll`, `feature-tabs`, `feature-tiles`, `feature-widgets`, `hero-band`, `hero-copy-on-top-art`, `hero-form`, `hero-with-opening`, `investor-marks`, `listing-browser`, `listing-table`, `logo-wall-quote`, `media-split-band`, `media-split-stack`, `network-section`, `photo-marquee`, `platform-directory`, `pricing-plans`, `recognition-marquee`, `resource-grid`, `site-footer`, `site-nav`, `stats-band`, `sticky-scroll-code`, `story-library`, `subject-library`, `template-gallery`, `use-case-links`, `use-cases`.

## Components — utils

2 paths: 1 new, 0 renamed, 1 unchanged.

| Path              | Status | Note |
| ----------------- | ------ | ---- |
| `webkit-provider` | new    |      |

Unchanged: `spinner`.

## Composables

7 paths: 3 new, 0 renamed, 4 unchanged.

| Path             | Status | Note |
| ---------------- | ------ | ---- |
| `use-direction`  | new    |      |
| `use-locale`     | new    |      |
| `use-collection` | new    |      |

Unchanged: `use-controllable`, `use-focus-trap`, `use-heading-nav`, `use-placement`.

## SVG components

8 paths: 0 new, 0 renamed, 8 unchanged.

Unchanged: `svg/error-403`, `svg/error-404`, `svg/azion/full`, `svg/azion/move-to-the-edge`, `svg/azion/technologies`, `svg/azion/default`, `svg/azion/min`, `svg/illustration-layers`.

## Tooling, styles and utilities

10 paths: 0 new, 0 renamed, 10 unchanged.

Unchanged: `catalog.json`, `package.json`, `docs/STYLEGUIDE.md`, `eslint-plugin`, `stylelint-config`, `styles`, `utils/cn`, `utils/csv`, `styles/country-flags`, `vite`.
