# Rule: naming — one standard for every name, old names never come back

Every name in WebKit follows one written standard: components, parts, blocks, examples, props
and their values, events, slots, types, data attributes, test ids, i18n keys, internal code,
tokens, icons, files, scripts, CLI and MCP names, lint rules, the AI bundle and CI. The owner
approved it on 2026-11-15 as decisions N1–N18 of the 6.0 naming change. 6.0 is the one clean
break: a renamed name is removed outright, `webkit migrate` rewrites apps from the
`packages/webkit/src/cli/migrations/v6*.json` maps, and the naming check makes sure the old
name never comes back.

The standard reuses the words people and AI assistants already type. When a word is open, we
take the one Supabase and shadcn use (`variant`, `outline`, `ghost`, the part words,
`-foreground`, "block"), and keep our own only where it reads better and nothing would break
(`small | medium | large`, `danger`).

## The rule

> A thing has **one name**. The **kebab-case** form is canonical and every other form derives
> from it. Words come from the **closed lists** below; an abbreviation, a plural spelling, a
> synonym or a retired v6 name is a naming bug, and the naming check reports it.

## 1. Components — one name on every surface

The kebab name is the single source. Six surfaces must agree:

| Surface                                     | Form                     | Example (`empty-state`)                                  |
| ------------------------------------------- | ------------------------ | -------------------------------------------------------- |
| spec file + `name:` frontmatter             | kebab                    | `.specs/empty-state.md`, `name: empty-state`             |
| component folder + `.vue` file              | kebab                    | `content/empty-state/empty-state.vue`                    |
| export subpath in `package.json#exports`    | kebab, flat              | `"./empty-state"`                                        |
| `defineOptions({ name })`                   | PascalCase               | `name: 'EmptyState'`                                     |
| `data-testid` fallback                      | the kebab name itself    | `'empty-state'`                                          |
| import binding + tag in examples and blocks | PascalCase of the export | `import EmptyState from '@aziontech/webkit/empty-state'` |

- **English, singular, whole words.** `chip`, not `chips`; `navigation`, not `nav`; `button`,
  not `btn`. A container of many is a different component (`chip-group`), never a plural.
- **Modifier first, noun last.** `pricing-card`, `highlight-button`, `icon-button` — every card
  ends in `card`, every button in `button`. This holds for components; a block names its group
  first (§ 3), and every list shows the full name (§ 25).
- **Every marketing page section ends in `-section`.** Each component in
  `src/components/section/` is named `<what>-section` (`hero-section`, `client-quotes-section`,
  `site-footer-section`), and that name is the `_id` the site writes in a page's `sections[]`;
  the building pieces in `src/components/marketing/` keep the bare name (`hero`, `stats`).
  `-band`, `-stack` and the other wrapper words are not used.
- **Only a page section says "section".** The word marks one thing: a whole band of a marketing
  page, at the end of its name. Nothing else carries it, first or last: the frame a page is built
  from is `container`, `module`, `module-header`, `spacer` and `split-stack`, a console band
  heading is `subheader`, a settings band is `settings-group` (WN-S01, WN-S02).
- **No synonym of an existing export.** One overlay is `dialog` (never `modal`), the side panel
  is `drawer` (never `sheet`), the moving strip is `marquee` (never `ticker`).

| ✅                    | ❌                                       |
| --------------------- | ---------------------------------------- |
| `pricing-card`        | `card-pricing` (noun first)              |
| `site-header-section` | `site-nav-section` (abbreviation)        |
| `eyebrow`             | `overline` (banned word)                 |
| `marquee`             | `ticker` (synonym of an existing family) |
| `key-value-list`      | `key-value-pairs` (plural root)          |
| `hero-section`        | `hero-band` (sections end in `-section`) |

Near-duplicate words the check knows (`ABBREVIATIONS` and `SYNONYMS` in the engine):
abbreviations `btn`→`button`, `img`/`pic`→`image`, `nav`→`navigation`, `cols`/`col`→`columns`,
`desc`→`description`, `msg`→`message`, `prev`→`previous`, `num`→`number`, `txt`→`text`,
`dlg`→`dialog`, `ctx`→`context`, `attr(s)`→`attribute(s)`, `sel`→`select`, `util`/`utils`→`lib`,
`regen`, `genai`, `ds`; synonyms `modal`→`dialog`, `sheet`→`drawer`, `popup`→`popover`,
`snackbar`/`notification`→`toast`, `loader`→`spinner`, `ticker`→`marquee`, `overline`→`eyebrow`,
`helper`→`description`; and an export that is the plural of another export (`chips` next to
`chip`; `tabs`, `settings`, `stats` are the allowed plural roots). The whole-name market aliases
(`modal`, `sheet`, `callout`, `kebab`…) are `MARKET_ALIASES` in `scripts/lib/naming.mjs`.

> Supabase and shadcn name atoms with one plain singular noun from the WAI-ARIA vocabulary.
> Supabase also shows the cost of not doing it: `Modal` next to `Dialog` for one overlay.

## 2. Parts — a closed list of part words

A part is `<Root><Part>` (file and export `<root>-<part>`), and the part word comes from one
closed list, the shadcn set:

**Trigger, Content, Header, Body, Footer, Title, Description, Close, Item, Group, Label,
Separator, List**

plus the domain parts a root declares in `DOMAIN_PARTS` (in the engine), where the anatomy
really is a table, a chart or a field: `table` declares Row, Cell, Body, Caption, Toolbar,
Search, Filter, Export…; `chart` declares Axis, Legend, Tooltip, Grid, Line, Area, Bar…;
`input-group` declares Addon and Input; `resizable` Handle and Pane; `stepper` and `wizard`
Step. A new domain part is a one-line entry in `DOMAIN_PARTS`, reviewed like any API change.
The check reads the part's last word (`table-head-cell` → `cell`, `table-sort-button` →
`button`).

- **Every part is importable on its own** — `dialog-header` next to `Dialog.Header`.
- **`Body` only for the scrolling middle** of `dialog`, `drawer` and `panel`.
- **Tabs has List, Trigger, Content only.** Select, MultiSelect and DropdownMenu say `Item`.
- **Removed words:** `Option` → `Item`, `Panel` → `Content` (Tabs) or `Body` (overlays),
  `Overlay` and `Portal` are gone (Content renders both), `Tabs.Item` → `Tabs.Trigger`.

| ✅                             | ❌                                           |
| ------------------------------ | -------------------------------------------- |
| `Select.Item` · `select-item`  | `Select.Option` · `select-option`            |
| `Tabs.Trigger`, `Tabs.Content` | `Tabs.Item`, `Tabs.Panel`                    |
| `Dialog.Body` · `dialog-body`  | `Dialog.Body` that is a file `panel-content` |
| `Table.SortButton`             | `Table.Trigger` (opens nothing)              |

A `Trigger` exists only on a part that opens a paired `Content` (`data-state="open|closed"`);
see [`compound-api.md`](./compound-api.md).

> Supabase reuses the same dozen part words across Dialog, Drawer and Popover, so knowing one
> teaches the rest. Material's part names vary per component — the thing we avoid.

## 3. Blocks and block groups

"Block" is the only word for a copyable screen — never "pattern" or "template": folder
`packages/webkit/blocks/`, `catalog.json#blocks`, `blockAliases`, `catalog/blocks/`, MCP
`search_blocks` / `get_block`, titles `Blocks/<Group>/<Name>`.

- **Path:** `blocks/<group>/<block>/` — two levels, no surface level. The surface (`app`,
  `docs`, `site`) is a `surface` field in `block.json` and the catalog.
- **Groups are singular job words, from a closed list:** `account`, `ai`, `auth`, `create`,
  `dashboard`, `detail`, `edit`, `settings`, `state`, `view`, `shell`, `top-bar`.
- **The block id is its folder path** (`create/create-hub`), kebab, English.
- **The block name starts with its group word, once** (WN07): `<group>/<group>-<what>`
  (`dashboard/dashboard-alerts`, `view/view-table`, `top-bar/top-bar-auth`). The `<what>` drops
  the group word and its forms (`edit/edit-function`, not `edit/edit-function-editor`;
  `detail/detail-dns-zone`, not `detail/detail-dns-zone-detail`). The name travels alone: the file
  `webkit add` copies into an app (`dashboard-alerts.vue`), its route and its component name
  (`DashboardAlerts`), so it keeps the group word, and the docs list shows it whole (§ 25).

| ✅                                  | ❌                                                    |
| ----------------------------------- | ----------------------------------------------------- |
| `blocks/create/create-hub`          | `blocks/platform/create/create-hub` (surface level)   |
| `blocks/state/state-async-submit`   | `blocks/platform/states/async-submit` (plural group)  |
| `blocks/shell/shell-console`        | `blocks/shells/console`                               |
| `blocks/dashboard/dashboard-alerts` | `blocks/dashboard/alerts-dashboard` (group word last) |
| `blocks/account/account-billing`    | `blocks/account/billing` (no group word)              |
| `search_blocks`                     | `search_patterns`                                     |
| `Blocks/Create/CreateHub`           | `Templates/Platform/Create/CreateHub`                 |

### Block variant states

A variant file is named after the state it shows: **`loading`, `empty`, `error`, `success`**,
or `<subject>-<state>` (`deploy-error`, `repositories-loading`), or `no-<thing>` for a
specific empty (`no-invoices`). Banned: `failed`, `failure`, `fail`, `done`, `finished`,
`succeeded`, `ok`, `complete`, `completed`.

| ✅                     | ❌                                    |
| ---------------------- | ------------------------------------- |
| `variants/error.vue`   | `variants/failed.vue`                 |
| `repositories-loading` | `loading-repositories` (state first)  |
| `#deploy-error`        | `#DeployFailed` (PascalCase fragment) |

## 4. Example files

The first example of every component is **`default.vue`**; the others are named after what
they show, usually the prop: `variants.vue`, `sizes.vue`, `severities.vue`, `statuses.vue`,
`disabled.vue`, `readonly.vue`, `loading.vue`, `empty.vue`, `error.vue`, `groups.vue`,
`with-<thing>.vue` (`with-addon-start.vue`). A marketing section's `site-<example>.json` and
`site-<example>.vue` mirror `<example>.vue` and take its name (see
[`SECTIONS.md`](../docs/SECTIONS.md)).

Banned file names: `types`, `kinds`, `basic`, `overview`, `playground`, `demo`, `sample`,
`example`, `usage`, `simple`, `read-only` (→ `readonly`), `grouped` (→ `groups`), `levels`
(→ `severities`), and any file word that is a retired vocabulary word: `kind`, `outlined`,
`transparent`, `prefix`, `suffix`, `left`, `right`, `current`, `expanded`, `failed`. The one
exception is a prop the component really has: `types.vue` shows a `type` prop (the sort of part:
`donut-chart`, `spark-chart`, `sidebar-menu`), `levels.vue` a `level` prop (`doc-heading`,
`log-viewer`).

| ✅                     | ❌                                        |
| ---------------------- | ----------------------------------------- |
| `default.vue` first    | `default-footer.vue` / `inline.vue` first |
| `variants.vue`         | `types.vue`, `kinds.vue`                  |
| `with-addon-start.vue` | `with-addon-left.vue`                     |
| `readonly.vue`         | `read-only.vue`                           |

## 5. Props

The full dictionary (concept → canonical name, banned aliases, values) is
[`prop-vocabulary.md`](./prop-vocabulary.md), with its machine side
`.claude/hooks/lib/prop-vocabulary.mjs`. The decisions it encodes:

- **The look is `variant`** (N1). Where `kind` meant "which sort of part" (a table cell that is
  a checkbox, a page button that means "next", a chart axis), it is `type`.
- **Job and step status is `status`** (N5); colour meaning stays `severity`.
- **`active`** = the page or item you are on (renders `aria-current`); **`selected`** = a
  picked item (a boolean); **`open`** = anything that opens. An id is a **key**: one id is
  `v-model:selectedKey` / `v-model:activeKey`, a list is `v-model:selectedKeys` /
  `v-model:openKeys` (`string[]`). No `current`, `activated`, `expanded`, `visible`, `show`,
  `opened`, `*Id`, `rowSelection` (N6).
- **Two-way values are `defineModel`** with one shape per concept: the primary value is the
  default model (never `v-model:value`), `open` is a boolean seeded by `defaultOpen`, `page` is a
  1-based number with `pageSize`, and a seed is always `default<Model>` (never `initial<X>`). The
  table is in [`prop-vocabulary.md`](./prop-vocabulary.md) § Two-way models.
- **`<part>Position`** takes `leading | trailing` (`iconPosition`); sides and alignment take
  `start | end` (`align: 'start' | 'center' | 'end'`) (N7). No public prop union holds a
  physical side (`left`, `right`, `top-left`, `bottom-right`, …), whatever the prop is called.
- **Picture edges are the one exception.** A prop that names an edge of a picture keeps
  `left` / `right`, because the picture does not mirror in right-to-left: its left edge is still
  its left edge. The allowlist is closed — `NetworkMapFade`, `ConsoleMockupShellFade` and
  `RegistrationFrameSide` (owner decision, 2026-11-16), plus the unions that describe the same
  pictures: `NetworkMapPosition` (where the map parks, paired with its fade), `TextureFade` (the
  texture `ConsoleMockupShell` fades), and the frame's corners `RegistrationFrameCorner` /
  `RegistrationFrameMarks`. A new type joins it only with an owner decision. The list is
  `PHYSICAL_EDGE_TYPES` in [`naming-rules.mjs`](../../packages/webkit/scripts/lib/naming-rules.mjs).
- **Booleans are positive and unprefixed**: no `is`/`has`, no `hide*` (→ `show<Part>`), no
  `enable*` (→ the `-able` adjective: `sortable`), no `disable*` except `disabled`.
- **camelCase** in `defineProps`; consumers write kebab attributes (`aria-label`, `icon-position`).

| ✅                                | ❌                                |
| --------------------------------- | --------------------------------- |
| `variant="outline"`               | `kind="outlined"`                 |
| `<Pagination.Button type="next">` | `<Pagination.Button kind="next">` |
| `status="running"`                | `state="running"`                 |
| `<NavigationMenu.Link active>`    | `<NavigationMenu.Link current>`   |
| `v-model:open`                    | `v-model:expanded`                |
| `icon-position="trailing"`        | `icon-position="right"`           |
| `showOperations`                  | `hideOperations`                  |

> Supabase and shadcn both call the look `variant`; people and AI type it by habit, which is
> why our old check had to ban it. Material splits it four ways (element per look,
> `appearance`, `color`, `variant`) — the drift we end.

## 6. Value sets

| Concept          | Values                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------- |
| Look (`variant`) | `primary · secondary · outline · ghost · danger · link` (+ documented extras)          |
| Size (`size`)    | `small · medium · large`; `tiny` / `xlarge` only for a real 4th step                   |
| Severity         | `neutral · info · success · warning · danger`                                          |
| Status           | `pending · running · success · error · canceled · skipped` (+ `streaming` for AI text) |
| Position         | `leading · trailing`                                                                   |
| Side, align      | `start · center · end`                                                                 |
| Orientation      | `horizontal · vertical`                                                                |
| Overlay side     | `top · bottom · start · end` (+ `auto`); `start`/`end` follow the text direction       |
| Selection mode   | `none · single · multiple`                                                             |
| Logo treatment   | `color · monochrome · knockout`                                                        |
| Scale steps      | `2xs · xs · sm · md · lg · xl · 2xl · 3xl` (tokens and utilities only)                 |

Five axes are **closed**: a `variant`, `severity`, `status`, `orientation` or `size` union holds
only shared values or extras the component documents in the vocabulary (see
[`prop-vocabulary.md`](./prop-vocabulary.md) § Closed value sets). A `variant` made only of
alignment words is `align`; an exported `*Severity` type derives from `Severity`.

| ✅                               | ❌                                                           |
| -------------------------------- | ------------------------------------------------------------ |
| `'outline' \| 'ghost'`           | `'outlined' \| 'transparent' \| 'text'`                      |
| `'danger'`                       | `'destructive'`, `'error'` as a look or severity             |
| `'success'`                      | `'done' \| 'ok' \| 'complete' \| 'completed' \| 'succeeded'` |
| `'canceled'`                     | `'cancelled'`                                                |
| `'small' \| 'medium' \| 'large'` | `'sm' \| 'md' \| 'lg'`, a reordered union                    |
| `'multiple'`                     | `'multi'`                                                    |

> `outline`, `ghost` and `link` are the shadcn and Supabase words. We keep `danger` over
> shadcn's `destructive`: it matches our colour names. We keep whole size words like
> Supabase (`tiny … xlarge`) instead of shadcn's `sm | lg`.

## 7. Events

- **kebab-case**, typed tuple `defineEmits` ([`emits.md`](./emits.md)); `update:<prop>` for a
  model; no `<x>-change` echo of `update:<x>`.
- **Present-tense words shared with the status values:** `complete` (never `finish`,
  `finished`, `done`), `error` (never `failed`, `fail`), `close` (never `dismiss`), `remove`
  (never `delete`), `double-click` (never `dblclick`).

| ✅                  | ❌              |
| ------------------- | --------------- |
| `item-click`        | `itemClick`     |
| `item-double-click` | `item-dblclick` |
| `row-remove`        | `row-delete`    |
| `complete`          | `finished`      |

## 8. Slots

kebab-case, typed `defineSlots` ([`slots.md`](./slots.md)). Adornments before and after the
content are **`leading` / `trailing`**; sides of a bar are **`start` / `end`**. Plural slots
for plural content (`actions`, `breadcrumbs`).

| ✅                      | ❌                                         |
| ----------------------- | ------------------------------------------ |
| `#leading`, `#trailing` | `#prefix`, `#suffix`, `#left`, `#right`    |
| `#header-actions`       | `#header-action`                           |
| `#breadcrumbs`          | `#breadcrumb`                              |
| `#header-leading`       | `#header-start` (an adornment, not a side) |

> Material uses leading/trailing for in-component positions and start/end for sides, and both
> flip correctly in right-to-left; `left`/`right` do not.

## 9. Types

- **`<Component>Variant`**, **`<Component>Type`**, **`<Component>Size`**,
  **`<Component>Props`** — every exported type starts with its component's PascalCase name.
- Never a `*Kind` type, never a bare exported `Props`.

| ✅                            | ❌                         |
| ----------------------------- | -------------------------- |
| `ButtonVariant`               | `ButtonKind`               |
| `TableFilterField`            | `FilterField` (from table) |
| `export interface FieldProps` | `export interface Props`   |

## 10. Data attributes

kebab-case and mirror the prop (see [`styling.md`](./styling.md)): `data-variant`,
`data-type`, `data-size`, `data-status`, `data-severity`, `data-bordered`. Disclosure state is
one attribute, `data-state="open|closed"`. Part markers are `data-slot="<part>"`. Transient
states are past participles: `data-focused`, `data-hovered`, `data-highlighted`.

| ✅                       | ❌                                                                           |
| ------------------------ | ---------------------------------------------------------------------------- |
| `data-variant="outline"` | `data-kind="outlined"`                                                       |
| `data-state="open"`      | `data-open`, `data-expanded`, `data-collapsed`, `data-shown`, `data-visible` |
| `data-active`            | `data-current`                                                               |
| `data-bordered`          | `data-border`                                                                |
| `data-leading`           | `data-has-icon-left`                                                         |
| `data-slot="tree-row"`   | `data-part="tree-row"`                                                       |

> shadcn v4 marks every part with `data-slot`; Supabase does the same (`page-header-title`).

## 11. Test ids

The `data-testid` fallback is **the component's own kebab name**, no category: `button`,
`dialog`, `dialog-header` (a part is its own component). Inner elements a test must reach are
`${testId}__<part>` (two underscores). The consumer's `data-testid` always wins
([`testid.md`](./testid.md)).

| ✅                       | ❌                                         |
| ------------------------ | ------------------------------------------ |
| `'button'`               | `'actions-button'` (category prefix)       |
| `'dialog-header'`        | the parent's `'dialog'` reused on the part |
| `` `${testId}__label` `` | `` `${testId}-label` `` (single dash)      |

Moving a component between category folders no longer changes its test id — the same reason
imports are flat ([`imports.md`](./imports.md)).

## 12. Category folders

Singular, from a closed list: `action`, `ai`, `chart`, `code`, `content`, `data`,
`docs`, `feedback`, `input`, `layout`, `marketing`, `navigation`, `overlay`,
`section`, `provider`. `utils` dissolves (spinner → `feedback`, config-provider →
`provider`). The category never appears in an export key or a test id.

| ✅                              | ❌                               |
| ------------------------------- | -------------------------------- |
| `src/components/action/button/` | `src/components/actions/button/` |
| `"./button"`                    | `"./action/button"`              |

## 13. i18n keys

The namespace is the **camelCase component name** (`feedbackReasonDialog` for
`feedback-reason-dialog`); keys are **camelCase**, and a part's keys carry the part as a prefix
(`promptInput.menuResults`, `copyButton.fallbackTitle`), because a key is always `group.key`.
Strings several components share live in the one shared namespace, **`common`** (`common.copy`,
`common.copied`, `common.newTab`, the autoplay pause and resume labels). One key per message: a
search or filter miss is `noMatch`, a no-data state is `emptyTitle` / `emptyDescription`, the
keys mirror the props they default (`emptyTitle`, `noMatch`). Locale catalogs live in
`src/locales/<bcp47>.ts`, the same path as the `./locales/<bcp47>` export.

| ✅                           | ❌                                                               |
| ---------------------------- | ---------------------------------------------------------------- |
| `kbd.arrowUp`                | `kbd['arrow-up']`                                                |
| `feedbackReasonDialog.title` | `feedbackReason.title` (not the component)                       |
| `articleBody.linkCopied`     | `articleBody.copiedLink` next to `linkCopied` elsewhere (review) |

## 14. Internal code — composables, injection keys, handlers, refs, helpers

| Thing            | Shape                                                             | ✅                                      | ❌                                                             |
| ---------------- | ----------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Composable       | file `use-x.ts` exporting `useX`                                  | `use-toast-store.ts` → `useToastStore`  | `useToastStore.ts`, `toast-store.ts` exporting `useToastStore` |
| Injection key    | `<Component>[<Part>]InjectionKey = Symbol('<Component>[<Part>]')` | `SelectInjectionKey = Symbol('Select')` | `selectContextKey`, `Symbol('SelectContext')`                  |
| Event handler    | `onX`, Vue's DOM casing                                           | `onClick`, `onKeydown`, `onPointerdown` | `handleClick`, `onKeyDown`, `onPointerDown`                    |
| DOM template ref | `xEl` (one) / `xEls` (list)                                       | `triggerEl`, `optionEls`                | `triggerRef`, `trigger`, `options`                             |
| Private helper   | a module in the component's `lib/`                                | `navigation-menu/lib/css-dimensions.ts` | `_lib/`, `utils/`, `helpers/` inside a component               |

Composables live in the component's `composables/` (or `src/composables/use-x/` when shared) —
see [`composables.md`](./composables.md).

## 15. CSS variables

A component's own custom property is **`--<component>-<part>-<property>`**, whole words.

| ✅                    | ❌                 |
| --------------------- | ------------------ |
| `--texture-row`       | `--row`            |
| `--card-grid-columns` | `--card-grid-cols` |
| `--trace-tick-at`     | `--tick-at`        |

## 16. Tokens and utilities

- Scale steps `2xs`, `2xl`, `3xl` — never `xxs`, `xxl`, `xxxl` (`--spacing-2xs`,
  `text-heading-2xs`).
- Every fill colour has a **`-foreground`** text pair: `--primary` / `--primary-foreground`.
  The `-contrast` suffix is gone.
- Correct English: `code-syntax`, never `code-sintax`.

| ✅                      | ❌                      |
| ----------------------- | ----------------------- |
| `--spacing-2xs`         | `--spacing-xxs`         |
| `--primary-foreground`  | `--primary-contrast`    |
| `--code-syntax-keyword` | `--code-sintax-keyword` |

> `X` / `X-foreground` is the shadcn and Supabase pair; Material writes the same idea as
> `primary` / `on-primary`. Tailwind writes `2xs` / `2xl`.

## 17. Icons

The class is `az az-<name>`; the colour set is `az-color az-<name>` (owner, 2026-11-17: `ai` read as
"artificial intelligence", so the base class is `az`). Names come from the icons package
(`packages/icons/src/svg-raw/az`, colour set `az-color`, documented one by one in
`packages/icons/src/icons.json`): interface glyphs are Lucide-style words, an Azion product icon
is the product's name as WebKit spells it (`functions`, `sql-database`; `edge-` only for Edge DNS,
Edge Pulse and Edge Orchestrator), and brands are spelled out.

| ✅                   | ❌                                      |
| -------------------- | --------------------------------------- |
| `az az-x`            | `ai ai-x`, `ai ai-times`, `pi pi-times` |
| `az az-menu`         | `ai ai-bars`                            |
| `az az-settings`     | `ai ai-cog`                             |
| `az az-chevron-down` | `ai ai-angle-down`                      |
| `az-color az-openai` | `ai-cor ai-open`, `ai-color ai-openai`  |
| `az az-scissors`     | `ai ai-scizors` (typo)                  |

The old `pi` icon set and the `ai` / `ai-cor` / `ai-color` base classes are removed; `v6-icons.json`
maps every old name and base class.

> Supabase uses Lucide (`x`, `menu`, `settings`); Material says `close` — we follow Lucide
> because that is the set agents and designers reach for.

## 18. Files and folders

kebab-case everywhere, apps included. Allowed exceptions: `UPPER_SNAKE.md` docs (`README.md`,
`MIGRATION_V6.md`), dotfiles, and the config names tools require (`vite.config.ts`,
`package.json`, `tsconfig.json`).

| ✅                 | ❌                |
| ------------------ | ----------------- |
| `api-table.vue`    | `ApiTable.vue`    |
| `brand-marks.json` | `brandMarks.json` |

## 19. Scripts

`package.json` scripts read **`<verb>:<target>`**. Verbs: `build`, `check`, `test`, `lint`,
`format`, `dev`, `preview`, `serve`, `clean`, `update`, `generate`, `release`, `publish`,
`pack`, `sync`, `run`, `deploy`, `typecheck`, `start`, `watch` (and `gates`, the one script
that runs every gate). A bare npm lifecycle name is fine (`prepare`,
`prepack`, `postpack`, `prepublishOnly`, `preinstall`, `install`, `postinstall`, `pretest`,
`posttest`, `start`, `test`, `build`, `dev`, `lint`, `format`, `clean`, `release`, `preview`).
A script that runs `node scripts/<file>.mjs` with no arguments is named after the file
(`check:naming` runs `check-naming.mjs`). `pnpm --filter` takes the full package name.

| ✅                                     | ❌                                  |
| -------------------------------------- | ----------------------------------- |
| `build:catalog`, `check:catalog`       | `catalog:build`, `catalog:check`    |
| `check:naming` → `check-naming.mjs`    | `naming:check` → `check-naming.mjs` |
| `pnpm --filter @aziontech/webkit test` | `pnpm --filter webkit test`         |

> Supabase and Material both write `build:catalog`-style verb-first scripts.

## 20. CLI and MCP names

- CLI commands are one lowercase word: `add`, `check`, `diff`, `doctor`, `migrate`, `search`.
- MCP tools are snake_case `<verb>_<noun>` with verbs `list`, `get`, `search`, `suggest`,
  `check`, `validate`, `explain`; never "pattern" or "template".

| ✅                           | ❌                               |
| ---------------------------- | -------------------------------- |
| `search_blocks`, `get_block` | `search_patterns`, `get_pattern` |
| `list_components`            | `components`, `listComponents`   |

## 21. ESLint rules

A rule name starts with a verb prefix: `no-`, `prefer-`, `require-`, `valid-` or
`consistent-`.

| ✅                               | ❌                       |
| -------------------------------- | ------------------------ |
| `webkit/require-accessible-name` | `webkit/accessible-name` |
| `webkit/no-deprecated-name`      | `webkit/deprecated-name` |

## 22. Skills, agents, hooks

- **Internal skills and commands:** kebab, object first, verb last (`<object>-<verb>`):
  `component-create`, `spec-validate`, `baselines-regenerate`, `branch-create`. The verb comes
  from `SKILL_VERBS` in the engine (add, audit, create, decide, extract, fix, map, new, open,
  regenerate, report, review, scaffold, validate, verify, write…). Whole words only (no `ds`,
  `genai`, `regen`).
- **Consumer skills:** `webkit-<kebab>`, whole words.
- **Agents:** end in an agent noun (`-er` / `-or`), the skill they run plus the suffix:
  `figma-extract` → `figma-extractor`, `spec-create` → `spec-creator`.
- **Hooks:** `validate-<x>.mjs` (checks content), `enforce-<x>.mjs` (requires a step) or
  `check-<x>.mjs`; a data module is not a hook and lives in `.claude/hooks/lib/`.

| ✅                        | ❌                      |
| ------------------------- | ----------------------- |
| `webkit-adoption`         | `webkit-ds-adoption`    |
| `baselines-regenerate`    | `regen-baselines`       |
| `figma-extractor` (agent) | `figma-extract` (agent) |
| `validate-naming.mjs`     | `naming-hook.mjs`       |

Frontmatter is governed by [`authoring-docs.md`](./authoring-docs.md).

## 23. CI workflows and jobs

- Workflow files are lowercase kebab `.yml` and say what they do (`publish-webkit.yml`).
- Workflow, job and step names are **sentence case**, with no milestone codes (`G1`, `2.7`,
  `M1.3`) and no Storybook or Chromatic words.
- **Required status checks keep their display names:** "OSSF Scorecard" and "Governance Gate"
  are referenced by the branch ruleset and are exempt.

| ✅                                 | ❌                                      |
| ---------------------------------- | --------------------------------------- |
| `Publish @aziontech/icons to npm`  | `Publish @aziontech/icons to NPM`       |
| `Naming`                           | `Naming (2.7) — kebab-case English ids` |
| `Blocks — every block has intents` | `Patterns (G1) — every template story`  |

## 24. Website components — docs, marketing and page sections

The website-facing components sit in three folders, and the name shape says which one a component
is in. The namespace is flat (`@aziontech/webkit/<name>`), and the plain names (`tabs`,
`accordion`, `card`, `hero`, `pagination`) already belong to other components, so the surface or
the level goes into the name only where it has to.

| Folder       | What it holds                                           | Name shape                                                                          | Example                                                                                |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `docs/`      | pieces of the documentation site                        | `doc-<thing>`; the `<thing>` is the MDX tag `DocMarkdown` renders, otherwise a noun | `doc-callout` (`<Callout>`), `doc-card-group` (`<CardGroup>`), `doc-table-of-contents` |
| `marketing/` | marketing-site pieces composed by hand, with slots      | the plain noun                                                                      | `hero`, `faq`, `quote`, `media-tabs`, `logo-wall`                                      |
| `section/`   | whole marketing bands placed from page JSON, props only | `<what>-section`, the same string as the page `_id`                                 | `faq-section`, `hero-section`                                                          |

- **The prefix covers the whole docs folder.** Every docs piece starts with `doc-`, even where the
  plain name is free (`doc-prose`, `doc-code-group`); a docs piece never drops it, and nothing
  outside `docs/` takes it.
- **A name carries a noun**, never the label a reader sees or a behaviour: `doc-table-of-contents`,
  not `doc-on-this-page`; `media-scroll`, not `sticky-stack`.
- **A generic piece leaves the website folders.** A grid, a carousel, an embed or a texture that an
  app or the docs site uses too lives in `layout/` or `content/`, under its plain name; the
  catalog still marks its surface `site` where it is styled for the site.
- **The page frame is layout.** The pieces a page is framed with live in `layout/` beside
  `registration-frame`, under the market's plain words: `container` (the framed column),
  `spacer` (the hatched gap between bands), `module` (a band you compose: a header row over a
  body), `module-header` (that header row, also used alone) and `split-stack` (bands that pin as
  the page scrolls). Their catalog surface stays `site`.
- **A section pairs with the piece it builds on** where one exists: `faq` / `faq-section`,
  `media-tabs` / `feature-tabs-section`, `media-scroll` / `feature-scroll-section`.

| ✅                      | ❌                                      |
| ----------------------- | --------------------------------------- |
| `doc-steps`             | `steps` in `docs/` (no prefix)          |
| `doc-table-of-contents` | `doc-on-this-page` (the heading's text) |
| `media-scroll`          | `sticky-stack` (a behaviour)            |
| `layout/card-grid`      | `marketing/card-grid` (a generic grid)  |

> Docusaurus prefixes its doc-page parts with `Doc` because one theme serves the docs and the
> blog; Fumadocs (`DocsPage`) and VitePress (`VPDoc`) do the same. Tailwind Plus splits Marketing
> into Elements and Page Sections, the same split as `marketing/` and `section/`. The review is
> `packages/webkit/docs/reviews/website-components-naming.md`.

## 25. Group words — in the name once, the full name in every list

A name that belongs to a group says its group once, and every list shows that full name: the
menu label, the page heading, the import and the id are one string. One rule, three cases:

| Family        | Code name (import, id, `_id`, file) | Where the group word sits | Shown under its group as                          |
| ------------- | ----------------------------------- | ------------------------- | ------------------------------------------------- |
| Blocks        | `dashboard/dashboard-alerts`        | first (§ 3)               | **Dashboard Alerts** under _Dashboard_            |
| Docs pieces   | `doc-callout`                       | first (§ 24)              | **DocCallout** under _Docs_                       |
| Page sections | `architecture-tabs-section`         | last (N12, § 1)           | **ArchitectureTabsSection** under _Page sections_ |

- **The code name keeps the group word.** It travels without its list: into an app (`webkit add`
  copies `dashboard-alerts.vue`), into page JSON (`_id: 'hero-section'`), into an import
  (`DocCallout`). The bare word is often taken too (`hero`, `faq`, `callout`, `tabs`).
- **The list shows the full name** (WN09, reversed 2026-11-18). The docs sidebar, the component
  and block indexes, search and breadcrumbs show exactly what the page heading shows: the
  PascalCase component name (`HeroSection`, `DocCallout`, `ThirdPartyLogo`) or the block's
  `block.json` title (`Dashboard Alerts`). The group is a heading above the list, never cut out
  of a label. A person or an agent then searches, reads and imports one word, and `Hero` (the
  building piece) never reads the same as `HeroSection`.
- **Page sections keep the word last.** "Hero section", "pricing section" is how Tailwind Plus,
  Shopify and Mantine UI say it, and every `_id` is stored in page data outside this repo, so the
  `-section` suffix stays (N12, WN08). No other component carries the word (WN-S01), so the
  _Page sections_ list holds every name that says "section" and nothing else.
- **Components are not a family here.** A component name reads modifier first, noun last
  (`icon-button`, `pricing-card`); the category is a folder and a sidebar heading, never a word in
  the name (WN10).

| ✅                                          | ❌                                                         |
| ------------------------------------------- | ---------------------------------------------------------- |
| sidebar _Dashboard_ → `Dashboard Alerts`    | `Alerts` (a label that is not the title or the id)         |
| sidebar _Page sections_ → `HeroFormSection` | `Hero Form` (reads like the `Hero` building piece)         |
| `dashboard/dashboard-alerts`                | `dashboard/alerts` (the copied file would be `alerts.vue`) |

> shadcn, Primer, MUI, Carbon, Supabase, Mantine and Chakra all list the exact component name in
> their navigation, so the label a reader clicks is the name they import. shadcn names its blocks
> group first (`dashboard-01`, `sidebar-07`, `login-03`) and files them under a group tab. The
> analysis is in `packages/webkit/docs/reviews/website-components-naming.md` § Group-first naming.

## How it is checked

One engine checks every rule that a machine can decide, and every rule blocks: the four
`enforced` rules from the start, the `staged` ones since the rename lanes merged
(`NAMING_STAGED_BLOCKS` is `true`). The write-time hook blocks a violation a write adds, and
`check:naming` fails CI on any violation in the tree.

| Rule id             | Checks                                                                                     | Decision       |
| ------------------- | ------------------------------------------------------------------------------------------ | -------------- |
| `export-kebab`      | export subpaths and block ids are kebab-case English                                       | N18            |
| `block-id`          | a block's `id` equals its folder path                                                      | N9             |
| `export-synonym`    | no export is a market alias or synonym of another export                                   | N12            |
| `export-retired`    | no retired v6 name (`v6.json`) comes back as an export                                     | N12            |
| `near-duplicate`    | abbreviations, plurals and synonyms in exports, blocks, folders, examples                  | N12, N18       |
| `export-category`   | no category segment in an export key                                                       | N11            |
| `category-folder`   | category folders are singular and in the closed list                                       | N11            |
| `block-path`        | `blocks/<group>/<block>/`, group in the closed list, no surface level                      | N9             |
| `block-word`        | "block", never "pattern" or "template", in titles, catalog keys and MCP tools              | N9             |
| `block-state`       | block variant names use the state words                                                    | N10            |
| `part-word`         | part suffix in the closed list or a declared domain part; `Body` placement                 | N8             |
| `part-export`       | every part folder has its `<root>-<part>` export                                           | N8             |
| `block-group-first` | a block's name starts with its group word, once (`dashboard/dashboard-alerts`)             | WN07           |
| `section-suffix`    | every component in `src/components/section/` ends in `-section`, and no other has the word | N12, WN-S01    |
| `docs-prefix`       | every component in `src/components/docs/` starts with `doc-`, and only those do            | WN04           |
| `example-file`      | first example is `default.vue`; no banned example file names                               | N13            |
| `prop-name`         | prop names against the vocabulary (specs and `.vue`)                                       | N1, N5, N6     |
| `prop-value`        | value sets, `Severity`-derived types, `left`/`right` only in `PHYSICAL_EDGE_TYPES`         | N2, N3, N5, N7 |
| `model-shape`       | `defineModel` names and types per concept, `default<Model>` seeds, template `v-model:`     | N6             |
| `event-name`        | kebab events, no echo, the shared event words                                              | N5             |
| `slot-name`         | kebab slots; `leading`/`trailing`, never `prefix`/`suffix`/`left`/`right`                  | N7             |
| `type-name`         | no `*Kind` type, no bare `Props`, exported types prefixed, `<Component><Axis>` unions      | N1             |
| `data-attribute`    | kebab `data-*`, no banned attributes                                                       | N1, N6, N7     |
| `testid`            | fallback is the own name; inner parts `__part`; no category prefix                         | N11            |
| `i18n-key`          | camelCase namespaces and keys                                                              | N16            |
| `injection-key`     | `<Component>[<Part>]InjectionKey` and its `Symbol` description                             | N16            |
| `composable-file`   | `use-x.ts` exports `useX`                                                                  | N16            |
| `handler-name`      | `onX` handlers in Vue DOM casing, no `handleX`                                             | N16            |
| `dom-ref-name`      | element refs end in `El` / `Els`                                                           | N16            |
| `private-folder`    | a component's private helpers in `lib/`, never `_lib`, `utils`, `helpers`                  | N16            |
| `css-variable`      | component CSS variables carry the component prefix, no abbreviations                       | N16            |
| `token-name`        | `2xs`/`2xl`, `-foreground`, `code-syntax`, every fill has a foreground pair                | N4, N15        |
| `icon-name`         | used icon names exist in the icons package; no legacy or `pi` names                        | N14            |
| `file-name`         | kebab files and folders in packages and apps                                               | N18            |
| `script-name`       | `<verb>:<target>` scripts named after their script file                                    | N17            |
| `filter-name`       | `pnpm --filter` with the full package name                                                 | N17            |
| `workflow-name`     | kebab workflow files; sentence-case names without milestone codes or Storybook             | N17            |
| `eslint-rule-name`  | lint rule names start with a verb prefix                                                   | N18            |
| `tooling-name`      | skills, agents and hooks name shapes                                                       | N18            |
| `cli-name`          | CLI commands one word; MCP tools `<verb>_<noun>`                                           | N9, N18        |

## Review-only

These cannot be decided by a machine; the reviewer holds them.

- **Look or sort of part** (`variant` vs `type`) — both are string unions; only the meaning
  tells whether the value changes the look or the kind of part.
- **Severity or status** — `success` and `error` are valid in both sets; whether the value is a
  colour or a job outcome is a meaning question.
- **`active` or `selected`** — "you are here" and "picked" are both booleans on an item.
- **A 4th size step** — `tiny` / `xlarge` are allowed tokens; whether the component truly needs
  one is design judgment.
- **An example name says what it shows** — the check bans the known bad words, not every vague
  one.
- **The subject word of a block variant** (`deploy-error` vs `build-error`) — domain language.
- **i18n leaf synonyms** (`copiedLink` vs `linkCopied`) — both are valid camelCase.
- **A new component name's meaning** — a synonym not yet in the near-duplicate list passes
  until someone adds it; add it to the list when review finds one.
- **Sentence case beyond the heuristic** — proper nouns and acronyms (npm, OSSF, MCP) keep their
  case; the check only flags obvious Title Case.

## Hard prohibitions

- Do not introduce a name that breaks a rule above, and do not bring back a retired v6 name.
- Do not rename a component on one surface only; the six surfaces change together.
- Do not add a part word outside the closed list without declaring it as a domain part in the
  engine, in the same PR.
- Do not keep an old name as an alias: 6.0 removes it and maps it in `v6*.json`.
- Do not rename the required status checks "OSSF Scorecard" and "Governance Gate" here; they
  change only together with the ruleset.
- Do not edit this rule without the engine (and vice versa): the lists here and in
  `naming-rules.mjs` are one source in two forms.

## Enforcement

- **One engine**, `packages/webkit/scripts/lib/naming-rules.mjs`: the rule registry (id,
  decision, stage) and every check above.
- **CI:** `packages/webkit/scripts/check-naming.mjs` (`check:naming`, gate `naming` in
  `scripts/gates.mjs`, the `toolkit` job). It fails on `enforced` rules and reports `staged`
  ones; `--strict` blocks staged rules too; `--rule <id> --all` lists one rule; `--json` prints
  every violation.
- **Write time:** `.claude/hooks/validate-naming.mjs` (PreToolUse on `Write|Edit|MultiEdit`)
  runs the same engine on the file being written and blocks only violations the write adds.
  It fails open on any error.
- **Vocabulary:** prop, value, event, slot and data-attribute words live in
  `.claude/hooks/lib/prop-vocabulary.mjs`, shared with `validate-spec-compliance` (see
  [`prop-vocabulary.md`](./prop-vocabulary.md)).
- **Consumers:** the ESLint rule `webkit/no-deprecated-name` reads
  `src/cli/migrations/v6*.json` and flags retired component imports, renamed props on WebKit
  tags and retired icon classes; `npx @aziontech/webkit migrate` rewrites them.
- **The switch:** `NAMING_STAGED_BLOCKS` in `naming-rules.mjs` is `false` while the rename
  lanes land; the lead sets it to `true` after they merge, and every staged rule blocks.
- **Old → new pairs** come from the `v6*.json` maps, so the check and `webkit migrate` always
  agree on what a name became.

## Why this rule exists

The same idea had drifted into several names at once: `kind` and `variant` for the look,
`state` and `status` for a job, `current`, `active` and `selected` for "you are here",
`expanded`, `data-open` and `open` for "open", `prefix`, `leading` and `left` for an
adornment, `xxs` next to `2xl`, `handleX` next to `onX`, `catalog:build` next to
`build:tokens`, and "block", "pattern" and "template" for one kind of thing. Every pair made a
person or an agent guess. The old check covered export ids only, so everything else drifted
unseen. One written standard with a machine check for every rule that can be checked keeps
6.0 clean after the rename, and keeps it clean on the next component.
