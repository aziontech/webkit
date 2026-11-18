# Rule: prop vocabulary — one name, one type, one value set per concept

The same concept ships under the **same prop name, type, value set and default** on every
component. When one component calls it `variant` and another `kind`, or one says `state` and
another `status`, the consumer relearns the API per component and the AI guesses wrong. This
rule fixes the canonical word for each recurring concept, and it is machine-enforced on
component **creation and on every edit**. It is the prop part of the naming standard
([`naming.md`](./naming.md), decisions N1–N7 and finding api-76).

The single source of truth is [`.claude/hooks/lib/prop-vocabulary.mjs`](../hooks/lib/prop-vocabulary.mjs).
This document is its human-readable form; the two must agree. `build-catalog.mjs` stamps the
vocabulary into `catalog.json` so the MCP steers AI-written consumer code toward the canonical
names.

## Two stages

Every banned name or value is in one of two stages:

- **Enforced** (`aliases`, `VALUES`, the `enforced` `VALUE_PATTERNS`, `PATTERNS`, `SLOTS`,
  `EVENT_WORDS`) — blocked today by `validate-spec-compliance` (write time) and the
  `check-authoring` ratchet (CI). The naming check reports them too.
- **Staged** (`staged`, `STAGED_VALUES`, the other `VALUE_PATTERNS`, `GROUP_LABEL`,
  `DATA_ATTRIBUTES`) — the rest of the 6.0 standard, still being applied by the rename lanes.
  The naming check (`check:naming`, rules `prop-name`, `prop-value`, `event-name`,
  `slot-name`, `data-attribute`) reports them now and blocks them once the lead sets
  `NAMING_STAGED_BLOCKS` to `true` in `packages/webkit/scripts/lib/naming-rules.mjs`.

In the tables below, staged entries are marked _(staged)_.

## The dictionary

| Concept                                      | Canonical                                                              | Type                                                       | Banned aliases                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Visual variant (the look)                    | `variant`                                                              | component union                                            | `appearance`, `intent`, `headerVariant`, `mediaKind`, `cardStyle`, `kind`, `look`, `styleVariant` |
| Sort of part (cell, page button, axis)       | `type`                                                                 | component union                                            | `kind` (via the look entry)                                                                       |
| Severity (colour meaning)                    | `severity`                                                             | `neutral · info · success · warning · danger`              | `tone`                                                                                            |
| Job or step status                           | `status`                                                               | `pending · running · success · error · canceled · skipped` | `state`, `phase`, `outcome`                                                                       |
| Light-dismiss (outside-click / Esc)          | `dismissible`                                                          | `boolean`                                                  | `dismissable`, `closeable`                                                                        |
| Explicit close affordance (X)                | `closable`                                                             | `boolean`                                                  | — (a different concept from `dismissible`)                                                        |
| Primary heading text                         | `title`                                                                | `string`                                                   | `heading`, `header`; _(staged)_ `headline`                                                        |
| Primary two-way value                        | `modelValue` (`v-model`)                                               | per component                                              | `isToggled`; `v-model:value` (`model-shape`)                                                      |
| Anything that opens                          | `open` (`v-model:open`, seed `defaultOpen`)                            | `boolean`                                                  | `expanded`, `visible`, `show`, `opened`, `shown`                                                  |
| Ids of the parts that are open               | `openKeys` (`v-model:openKeys`)                                        | `string[]`                                                 | `expandedKeys`, `expandedIds`, `openIds`, `expandedItems`                                         |
| The page or item you are on (`aria-current`) | `active`                                                               | `boolean`                                                  | `current`, `activated`, `isCurrent`                                                               |
| Picked flag on an item                       | `selected` (`v-model:selected`)                                        | `boolean`                                                  | a string `selected` (that is `selectedKey`)                                                       |
| Picked single key                            | `selectedKey` (`v-model:selectedKey`)                                  | `string` or `string \| null`                               | `selected` as a string, `selectedId`                                                              |
| Picked keys of a multi-selection             | `selectedKeys` (`v-model:selectedKeys`)                                | `string[]`                                                 | `selectedIds`, `selectedValues`, `checkedKeys`, `selectedItems`, `rowSelection`                   |
| The item you are on, by id                   | `activeKey` (`v-model:activeKey`)                                      | `string \| null`                                           | `activeId`, a string `active`                                                                     |
| Current page                                 | `page` (`v-model:page`, 1-based) + `pageSize`                          | `number`                                                   | `pagination`, `pageIndex`, `currentPage`                                                          |
| Disabled                                     | `disabled`                                                             | `boolean`                                                  | `isDisabled` (prefix rule); _(staged)_ `enabled`                                                  |
| Loading                                      | `loading`                                                              | `boolean`                                                  | `isLoading` (prefix rule)                                                                         |
| Leading or trailing glyph                    | `icon`                                                                 | `string` (icon name)                                       | _(staged)_ `iconName`, `leadingIcon`, `trailingIcon`                                              |
| In-page anchor id                            | `anchor`                                                               | `string`                                                   | `anchorId`, `sectionId`, `hash`                                                                   |
| Side an anchored overlay opens on            | `side` (+ `align`, `sideOffset`)                                       | `top · bottom · start · end` (+ `auto`)                    | `placement`; `offset` for the gap                                                                 |
| Validation state                             | `invalid`                                                              | `boolean`                                                  | `hasError`, `isInvalid`                                                                           |
| Read-only                                    | `readonly`                                                             | `boolean`                                                  | `readOnly`, `isReadonly`                                                                          |
| Outline around the box                       | `bordered`                                                             | `boolean`                                                  | `border`, `hasBorder`                                                                             |
| Copy affordance                              | `copyable`                                                             | `boolean`                                                  | `showCopy`                                                                                        |
| Self-advancing media                         | `autoplay`                                                             | `boolean`                                                  | `autoPlay`                                                                                        |
| Self-advancing interval (ms)                 | `autoplayInterval`                                                     | `number`                                                   | `autoPlayInterval`; `interval`                                                                    |
| Motion on / off                              | `animated`                                                             | `boolean`                                                  | `still`                                                                                           |
| Short label above a heading                  | `eyebrow`                                                              | `string`                                                   | `overline`; _(staged)_ `kicker`, `tagline`                                                        |
| Text of a link or call-to-action             | `linkLabel` (`actionLabel` for a button)                               | `string`                                                   | `link`, `cta`                                                                                     |
| Column count below `md`                      | `mobileColumns`                                                        | number union                                               | `mobileCols`                                                                                      |
| Number of grid columns                       | `columns`                                                              | number union                                               | _(staged)_ `cols`                                                                                 |
| Choices the user picks from                  | `options` (`items` for displayed lists, `data` + `columns` for tables) | array                                                      | _(staged)_ `model`, `choices`                                                                     |
| Identity key                                 | `itemKey` (lists), `rowKey` (tables)                                   | `string`                                                   | `trackBy`, `dataKey`, `keyField`, `idKey`                                                         |
| Empty-state text                             | `emptyTitle` (+ `emptyDescription`, `emptyActionLabel`)                | `string`                                                   | `emptyText`, `emptyMessage`, `emptyLabel`, `noResultsText`, `noDataText`, `empty`                 |
| Main call-to-action object                   | `primaryAction`                                                        | one shared action type                                     | _(staged)_ `mainAction`, `primaryCta`, `primaryButton`                                            |
| Second call-to-action object                 | `secondaryAction`                                                      | the same type                                              | _(staged)_ `secondaryCta`, `secondaryButton`                                                      |
| Heading level of a rendered title            | `headingLevel`                                                         | `1 … 6`                                                    | _(staged)_ `titleLevel`, `headingTag`, `headerLevel`                                              |
| Where a link opens                           | `target`                                                               | `string`                                                   | `external`, `newTab`, `openInNewTab`, `blank`                                                     |
| More than one may be picked                  | `multiple`                                                             | `boolean`                                                  | `multi`                                                                                           |
| Accessible name                              | `ariaLabel` (+ `xAriaLabel`)                                           | `string`, `''` default                                     | `aria-label` as a prop (see [`accessibility.md`](./accessibility.md))                             |

**Group header text.** On a part whose name ends in `-group`, the header text is `label`
(like `DropdownMenu.Group`, `Select.Group`) — _(staged)_ `title`, `heading`, `header`,
`groupLabel` are banned there (`GROUP_LABEL`).

**Accessible name — the attribute the consumer writes.** The prop is `ariaLabel`, but
templates pass `aria-label="…"`. vue-tsc does not camelize `aria-*` attributes onto props, so
an `ariaLabel` prop is always optional with a `''` default; `webkit/require-accessible-name` enforces a
mandatory name.

## Booleans

- No `is` / `has` prefix (enforced).
- Positive polarity (enforced): `hidden` → `show<Part>`, `invisible` → `show<Part>`,
  `closed` → `open`, `inactive` → `active`, `collapsed` → `open`. `disabled` and `readonly`
  are the accepted exceptions.
- Shapes that read backwards (`PATTERNS`): `hide<X>` → `show<X>`; `enable<X>` → the
  `-able` adjective (`enableSorting` → `sortable`); `disable<X>` → the positive form.
- A toggle that renders an optional part is `show<Part>` (`showHeader`, `showLineNumbers`); a
  toggle that turns on a capability is an `-able` adjective (`copyable`, `closable`,
  `sortable`).

## Shared values

The same look gets the same token on every component. A prop's string-literal union is checked
against its value map.

| Prop                           | Canonical values                                                           | Banned values                                                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                      | `primary · secondary · outline · ghost · danger · link`                    | `outlined`→`outline`, `transparent`→`ghost`, `text`→`ghost`, `destructive`→`danger`, `error`→`danger`                                                                                                                  |
| `severity`                     | `neutral · info · success · warning · danger`                              | `error`→`danger`, `destructive`→`danger`; `default`, `secondary`, `alt` → `neutral`                                                                                                                                    |
| `status`                       | `pending · running · success · error · canceled · skipped` (+ `streaming`) | `done`, `ok`, `complete`, `completed`, `succeeded`, `finished` → `success`; `failed`, `failure`, `errored` → `error`; `cancelled` → `canceled`; `queued`, `waiting` → `pending`; `in-progress`, `progress` → `running` |
| any `*Position`                | `leading · trailing`                                                       | `left`, `start`, `before`, `prefix` → `leading`; `right`, `end`, `after`, `suffix` → `trailing`                                                                                                                        |
| `align`, `alignment`, `*Align` | `start · center · end`                                                     | `left`, `top` → `start`; `right`, `bottom` → `end`; `centered` → `center`                                                                                                                                              |
| `side`, `*Side`                | `start · end` (+ `top · bottom` for block sides)                           | `left` → `start`, `right` → `end`                                                                                                                                                                                      |
| `selectionMode`, `*Mode`       | `none · single · multiple`                                                 | `multi` → `multiple`                                                                                                                                                                                                   |
| `treatment`, `*Treatment`      | `color · monochrome · knockout`                                            | _(staged)_ `as-is`, `original` → `color`; `invert-light` → `knockout`                                                                                                                                                  |

> `outline`, `ghost` and `link` are the shadcn and Supabase words. `danger` stays over
> shadcn's `destructive` because it matches our colour names. Code ported from shadcn maps
> `destructive` → `danger`; from Material, `outlined` → `outline`, `text` → `ghost`.

## Closed value sets

The banned-value maps above catch the known wrong words. On top of them, five axes are a
**closed set**: every member of the union (resolved through local and imported aliases,
`Exclude<…>` and `Extract<…>`) is a shared value or an extra the component documents in the
machine source (`VARIANT_EXTRAS`, `SEVERITY_EXTRAS`, `STATUS_EXTRAS`, `ORIENTATION_EXTRAS` in
`lib/prop-vocabulary.mjs`, keyed by the component, its root, or `<component>.<prop>`). The
axis is the prop name or its `*<Axis>` suffix (`titleVariant`, `tagSeverity`).

| Axis          | Shared set                                                             | Documented extras (component → values)                                                                                                    |
| ------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`     | `primary · secondary · outline · ghost · danger · link`                | the component's own looks, e.g. `avatar` circle·square, `chip` filled·dashed, `tag` accent·contrast·highlight, `texture` dots·grid·lines… |
| `severity`    | `neutral · info · success · warning · danger`                          | `severity-tag` critical·high·medium·low (a security level); `chart` the `severity-*` palette                                              |
| `status`      | `pending · running · success · error · canceled · skipped · streaming` | `prompt-input` ready; `tool-approval` approved·denied·expired; `tool-call` denied                                                         |
| `orientation` | `horizontal · vertical`                                                | `field` responsive; `scroll-area` both                                                                                                    |
| `size`        | `tiny · small · medium · large · xlarge`, ordered subset (see Size)    | none                                                                                                                                      |

- **A `variant` union made only of alignment words** (`start`, `center`, `end`, `split`) is
  the `align` axis, never a look: `module-header` is `align="start|center|split"`.
- **An exported `*Severity` type derives from `Severity`** (`packages/webkit/src/utils/severity.ts`)
  — `Severity`, `Exclude<Severity, …>` or `Extract<Severity, …>` — instead of re-listing the
  values. An exported `*Status` / `*Orientation` type stays inside its set too.
- **A union a file declares for an axis prop is named `<Component><Axis>`**
  (`DateRangePickerSize`, `ModuleHeaderAlign`); reusing another component's exported union is
  fine.
- Adding an extra is an API decision: one line in the machine source and the table above, in
  the same PR.

## Two-way models

`defineModel` declarations are checked like props (names, booleans, value sets) and against
one shape per concept, so the same idea binds the same type on every component (`model-shape`):

| Model                                | Type                      | Not                                                |
| ------------------------------------ | ------------------------- | -------------------------------------------------- |
| primary value                        | default model (`v-model`) | `v-model:value`                                    |
| `open`, `*Open`                      | `boolean`                 | a string or object                                 |
| `selected`, `active`                 | `boolean`                 | a string id (that is `selectedKey` / `activeKey`)  |
| `*Key`                               | `string` (or `\| null`)   | `*Id`                                              |
| `*Keys` (`selectedKeys`, `openKeys`) | `string[]`                | a record (`Record<string, boolean>`), `*Ids`       |
| `page`, `pageSize`                   | `number`, page 1-based    | `pagination` (`{ pageIndex }`), a string page name |
| `*Index`                             | `number` (or `\| null`)   | —                                                  |

- **An id is a key**: a model named `*Id` / `*Ids` is reported with its `*Key` / `*Keys` name.
- **A seed is `default<Model>`** (`defaultOpen`, `defaultValue`, `defaultSnapshot`); an
  `initial<X>` prop is reported.
- **Templates** (examples, blocks, apps) never bind `v-model:value` or a banned model name
  (`v-model:row-selection`, `v-model:expanded`, `v-model:pagination`).

## Size

`size` takes **`'small' | 'medium' | 'large'`**, in that order; a subset is fine
(`'small' | 'medium'`), a reorder is not. **`tiny`** and **`xlarge`** exist only for a
component that truly needs a 4th step (whether it does is review). Banned tokens: `xs`, `sm`,
`md`, `lg`, `xl`, `2xs`, `2xl`, `xxs`, `xxl` (the scale steps belong to tokens and utilities,
not to props).

House default: **actions and links** (button, icon-button, link, …) default to `large`;
**everything else** to `medium`. One exception: `drawer` defaults to `large`, because the
first drawer of a flow is the large one and only a nested drawer steps down to `medium`.

`closable` house default: `true` on `dialog` and `drawer` (modal overlays always show a way
out), `false` everywhere else.

## Slots

Slots are kebab-case. Adornments before and after the content are `leading` / `trailing`;
sides of a bar are `start` / `end`.

| Banned          | Use               |
| --------------- | ----------------- |
| `prefix`        | `leading`         |
| `suffix`        | `trailing`        |
| `left`          | `leading`         |
| `right`         | `trailing`        |
| `prepend`       | `leading`         |
| `append`        | `trailing`        |
| `icon-left`     | `leading`         |
| `icon-right`    | `trailing`        |
| `header-start`  | `header-leading`  |
| `header-end`    | `header-trailing` |
| `action`        | `actions`         |
| `header-action` | `header-actions`  |
| `breadcrumb`    | `breadcrumbs`     |

## Events

- kebab-case (enforced); an `update:<prop>` model event is exempt.
- **No redundant echo** (enforced): no `<x>-change` when `update:<x>` exists. A distinct commit
  event (commit-on-blur) is a bare `change`.
- **Event words** (`EVENT_WORDS`), matched per `-`-segment: `dblclick` →
  `double-click`, `finish` / `finished` / `done` → `complete`, `failed` / `fail` → `error`,
  `dismiss` → `close`, `delete` → `remove`.

## Data attributes _(staged)_

`data-*` names are kebab-case and mirror the prop.

| Banned                                                                       | Use                                                |
| ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `data-kind`                                                                  | `data-variant` (look) or `data-type` (sort)        |
| `data-open`, `data-expanded`, `data-collapsed`, `data-shown`, `data-visible` | `data-state="open\|closed"`                        |
| `data-current`                                                               | `data-active`                                      |
| `data-border`                                                                | `data-bordered`                                    |
| `data-tone`                                                                  | `data-status` or `data-severity`                   |
| `data-has-icon-left` / `data-has-icon-right`                                 | `data-leading` / `data-trailing`                   |
| `data-inactive`                                                              | `data-disabled` or `data-inert`                    |
| `data-part`                                                                  | `data-slot`                                        |
| `data-focus`, `data-hover`, `data-highlight`                                 | `data-focused`, `data-hovered`, `data-highlighted` |

## Not banned — legitimate uses

- **`type`** — native pass-throughs (`<input type>`, `<button type>`) **and** the sort of part
  (`<Table.Cell type="checkbox">`, `<Pagination.Button type="next">`). Only a _look_ named
  `type` is wrong (that is `variant`).
- **`value`** — identity, the `v-model` payload, clipboard or display text. As a model name
  it is blocked: the primary value is the default model.
- **`error`** — a message string, or a send-failed state on a form band, is a different concept
  from the `invalid` flag.
- **`level`** — on `doc-heading`, which _is_ a heading; everywhere else a heading level is
  `headingLevel`.
- **`label`** — the header text of a group part, and slot-fallback display text.
- **`state`** — only as the `data-state` attribute for open/closed, checked/unchecked; as a
  prop for a job it is `status`.

## Migration

Per [`migration.md`](./migration.md), a name inherited from another system (`kind`,
`sm/md/lg`, `onValueChange`, `prefix`) is rewritten to ours, never carried over. The full
old → new map, with value renames, is `packages/webkit/src/cli/migrations/v6-props.json`
(`{ "<subpath>": { "<old>": "<new>" } }`; a `#<slot>` key renames a slot, an
`@<event>` key a listener, and a rule's `moves` sends a static value to another prop);
`webkit migrate` applies it to apps and
`webkit/no-deprecated-name` flags what is left.

## What is enforced, and where

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** (PostToolUse on
  `Write|Edit|MultiEdit`) blocks a root `.vue` whose `defineProps` uses an enforced alias, an
  `is`/`has` boolean, a negative boolean, an enforced banned value, a non-canonical or
  reordered `size` union, a camelCase event, a redundant echo, an enforced event word or an
  enforced slot name; and flags default drift (spec
  Props "Default" column ≠ `withDefaults`). The `check-authoring` CI ratchet runs the same
  engine repo-wide.
- **The naming check** (`check:naming`, `.claude/hooks/validate-naming.mjs`) runs the vocabulary
  with `{ stage: 'all' }` over every spec and `.vue`, reporting enforced and staged entries (see
  [`naming.md`](./naming.md)).
- **[`_schema.json`](../../.specs/_schema.json)** + the `spec-validate` skill reject aliases at
  spec-authoring time.
- **`catalog.json` `vocabulary`** carries the full 6.0 dictionary to the MCP.
- **`webkit/no-deprecated-name`** (consumer ESLint) flags a renamed prop on a WebKit tag from
  `v6-props.json`.

## Hard prohibitions

- Do not introduce a prop whose concept already has a canonical name under a different name.
- Do not use `xs`/`sm`/`md`/`lg`/`xl` for `size`; do not reorder the `size` union.
- Do not prefix a boolean with `is`/`has`, and do not name it negatively or as `hide*`.
- Do not use `left`/`right` for a position, side or alignment value.
- Do not put a value in a `variant` / `severity` / `status` / `orientation` union that is
  neither shared nor a documented extra of that component.
- Do not bind a two-way value with a shape its concept does not take (a record of ids, a
  0-based page, a string `selected`).
- Do not let the spec's Default column disagree with `withDefaults`.
- Do not edit `prop-vocabulary.md` without editing `lib/prop-vocabulary.mjs` in the same PR
  (and vice-versa) — they are one source in two forms.
