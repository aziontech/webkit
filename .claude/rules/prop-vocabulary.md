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

| Concept                                      | Canonical                                                              | Type                                                       | Banned aliases                                                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Visual variant (the look)                    | `variant`                                                              | component union                                            | `appearance`, `intent`, `headerVariant`, `mediaKind`, `cardStyle`; _(staged)_ `kind`, `look`, `styleVariant` |
| Sort of part (cell, page button, axis)       | `type`                                                                 | component union                                            | `kind` _(staged, via the look entry)_                                                                        |
| Severity (colour meaning)                    | `severity`                                                             | `neutral · info · success · warning · danger`              | `tone`                                                                                                       |
| Job or step status                           | `status`                                                               | `pending · running · success · error · canceled · skipped` | `state`, `phase`, `outcome`                                                                                  |
| Light-dismiss (outside-click / Esc)          | `dismissible`                                                          | `boolean`                                                  | `dismissable`, `closeable`                                                                                   |
| Explicit close affordance (X)                | `closable`                                                             | `boolean`                                                  | — (a different concept from `dismissible`)                                                                   |
| Primary heading text                         | `title`                                                                | `string`                                                   | `heading`, `header`; _(staged)_ `headline`                                                                   |
| Primary two-way value                        | `modelValue` (`v-model`)                                               | per component                                              | `isToggled`; `v-model:value` for the primary value (review)                                                  |
| Anything that opens                          | `open` (`v-model:open`, seed `defaultOpen`)                            | `boolean`                                                  | `expanded`, `visible`, `show`, `opened`, `shown`                                                             |
| Ids of the parts that are open               | `openKeys` (`v-model:openKeys`)                                        | `string[]`                                                 | `expandedKeys`, `expandedIds`, `openIds`, `expandedItems`                                                    |
| The page or item you are on (`aria-current`) | `active`                                                               | `boolean`                                                  | `current`, `activated`, `isCurrent`                                                                          |
| Picked single key                            | `selected` (`v-model:selected`)                                        | key                                                        | — (review)                                                                                                   |
| Picked keys of a multi-selection             | `selectedKeys` (`v-model:selectedKeys`)                                | `string[]`                                                 | `selectedIds`, `selectedValues`, `checkedKeys`, `selectedItems`                                              |
| Disabled                                     | `disabled`                                                             | `boolean`                                                  | `isDisabled` (prefix rule); _(staged)_ `enabled`                                                             |
| Loading                                      | `loading`                                                              | `boolean`                                                  | `isLoading` (prefix rule)                                                                                    |
| Leading or trailing glyph                    | `icon`                                                                 | `string` (icon name)                                       | _(staged)_ `iconName`, `leadingIcon`, `trailingIcon`                                                         |
| In-page anchor id                            | `anchor`                                                               | `string`                                                   | `anchorId`, `sectionId`, `hash`                                                                              |
| Validation state                             | `invalid`                                                              | `boolean`                                                  | `hasError`, `isInvalid`                                                                                      |
| Read-only                                    | `readonly`                                                             | `boolean`                                                  | `readOnly`, `isReadonly`                                                                                     |
| Outline around the box                       | `bordered`                                                             | `boolean`                                                  | `border`, `hasBorder`                                                                                        |
| Copy affordance                              | `copyable`                                                             | `boolean`                                                  | `showCopy`                                                                                                   |
| Self-advancing media                         | `autoplay`                                                             | `boolean`                                                  | `autoPlay`                                                                                                   |
| Self-advancing interval (ms)                 | `autoplayInterval`                                                     | `number`                                                   | `autoPlayInterval`; `interval`                                                                               |
| Motion on / off                              | `animated`                                                             | `boolean`                                                  | `still`                                                                                                      |
| Short label above a heading                  | `eyebrow`                                                              | `string`                                                   | `overline`; _(staged)_ `kicker`, `tagline`                                                                   |
| Text of a link or call-to-action             | `linkLabel` (`actionLabel` for a button)                               | `string`                                                   | `link`, `cta`                                                                                                |
| Column count below `md`                      | `mobileColumns`                                                        | number union                                               | `mobileCols`                                                                                                 |
| Number of grid columns                       | `columns`                                                              | number union                                               | _(staged)_ `cols`                                                                                            |
| Choices the user picks from                  | `options` (`items` for displayed lists, `data` + `columns` for tables) | array                                                      | _(staged)_ `model`, `choices`                                                                                |
| Identity key                                 | `itemKey` (lists), `rowKey` (tables)                                   | `string`                                                   | `trackBy`, `dataKey`, `keyField`, `idKey`                                                                    |
| Empty-state text                             | `emptyTitle` (+ `emptyDescription`, `emptyActionLabel`)                | `string`                                                   | `emptyText`, `emptyMessage`, `emptyLabel`, `noResultsText`, `noDataText`, `empty`                            |
| Main call-to-action object                   | `primaryAction`                                                        | one shared action type                                     | _(staged)_ `mainAction`, `primaryCta`, `primaryButton`                                                       |
| Second call-to-action object                 | `secondaryAction`                                                      | the same type                                              | _(staged)_ `secondaryCta`, `secondaryButton`                                                                 |
| Heading level of a rendered title            | `headingLevel`                                                         | `1 … 6`                                                    | _(staged)_ `titleLevel`, `headingTag`, `headerLevel`                                                         |
| Where a link opens                           | `target`                                                               | `string`                                                   | `external`, `newTab`, `openInNewTab`, `blank`                                                                |
| More than one may be picked                  | `multiple`                                                             | `boolean`                                                  | `multi`                                                                                                      |
| Accessible name                              | `ariaLabel` (+ `xAriaLabel`)                                           | `string`, `''` default                                     | `aria-label` as a prop (see [`accessibility.md`](./accessibility.md))                                        |

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
| `variant`                      | `primary · secondary · outline · ghost · danger · link`                    | _(staged)_ `outlined`→`outline`, `transparent`→`ghost`, `text`→`ghost`, `destructive`→`danger`, `error`→`danger`                                                                                                       |
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

## Size

`size` takes **`'small' | 'medium' | 'large'`**, in that order; a subset is fine
(`'small' | 'medium'`), a reorder is not. **`tiny`** and **`xlarge`** exist only for a
component that truly needs a 4th step (whether it does is review). Banned tokens: `xs`, `sm`,
`md`, `lg`, `xl`, `2xs`, `2xl`, `xxs`, `xxl` (the scale steps belong to tokens and utilities,
not to props).

House default: **actions and links** (button, icon-button, link, …) default to `large`;
**everything else** to `medium`.

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
- **`value`** — identity, the `v-model` payload, clipboard or display text. `v-model:value` for
  the primary value cannot be blocked by name, so it is review-only.
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
- Do not let the spec's Default column disagree with `withDefaults`.
- Do not edit `prop-vocabulary.md` without editing `lib/prop-vocabulary.mjs` in the same PR
  (and vice-versa) — they are one source in two forms.
