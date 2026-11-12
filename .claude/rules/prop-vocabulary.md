# Rule: prop vocabulary — one name, one type, one default per concept

The same concept must ship under the **same prop name, type, and default** on every component. When one component calls it `variant` and another `kind`, or one spells it `closeable` and another `closable`, the consumer relearns the API per component and the AI guesses wrong. This rule fixes the canonical name for each recurring concept and makes it machine-enforced — on component **creation and on every edit**.

The single source of truth is [`.claude/hooks/_lib/prop-vocabulary.mjs`](../hooks/_lib/prop-vocabulary.mjs). This document is its human-readable form; the two must agree. `build-catalog.mjs` also stamps the vocabulary into `catalog.json` so the MCP steers AI-generated consumer code toward the canonical names.

## The dictionary

| Concept | Canonical prop | Type | Default | Banned aliases (blocked) |
|---|---|---|---|---|
| Visual/structural variant | `kind` | component-specific string union | component-specific | `variant`, `appearance`, `intent`, `headerVariant`, `mediaKind`, `cardStyle` |
| Severity / status color | `severity` | one shared union | per family | `status` |
| Size | `size` | `'small' \| 'medium' \| 'large'` (this order; a subset is fine) | `large` for actions/links, else `medium` | any of `xs`/`sm`/`md`/`lg`/`xl`, or a reordered union |
| Light-dismiss (closes on outside-click / Esc) | `dismissible` | `boolean` | overlay-specific | `dismissable`, `closeable` |
| Explicit close affordance (X button) | `closable` | `boolean` | `false` | — (distinct concept; not an alias of `dismissible`) |
| Primary heading text | `title` | `string` | `''` | `heading`, `header` (as a **prop**) |
| Primary two-way value | `modelValue` (default `v-model`) | component-specific | per component | `isToggled`; `v-model:value` for the primary value† |
| Overlay open state | `open` (+ `v-model:open`), seed `defaultOpen` | `boolean` | `undefined` (controlled) | `visible`, `show`, `opened` |
| Disabled | `disabled` | `boolean` | `false` | `isDisabled`, `enabled` |
| Loading | `loading` | `boolean` | `false` | `isLoading` |
| Leading/trailing glyph | `icon` | `string` (icon name) | `''` | `iconName`, `leadingIcon`, `trailingIcon` |
| Validation state† | `invalid` | `boolean` | `false` | `error` / `hasError` as a validation flag (an `error` *message* string, or a send-failed state on a form band, is a different concept) |
| Read-only† | `readonly` | `boolean` | `false` | `readOnly`, `isReadonly` |
| Outline around the box† | `bordered` | `boolean` | per component | `border` (boolean), `hasBorder` |
| Copy affordance† | `copyable` | `boolean` | per component | `showCopy` |
| Self-advancing media† | `autoplay` (+ `autoplayInterval`, ms) | `boolean` | per component | `autoPlay`, `autoPlayInterval` |
| Motion on / off† | `animated` | `boolean` | per component | `still` (negative polarity) |
| Short label above a heading† | `eyebrow` | `string` | `''` | `overline` (as a prop) |
| Text of a link or call-to-action† | `linkLabel` (`actionLabel` for a button) | `string` | `''` | `link` / `cta` as the text |
| Column count below `md`† | `mobileColumns` | number union | `1` | `mobileCols` |
| Accessible name | `ariaLabel` (+ prefixed `xAriaLabel`) | `string` | per component | `aria-label` as a prop |
| In-page anchor (the `id` a `#hash` link targets, set by the component on its landmark) | `anchor` | `string` | `''` | `anchorId`, `sectionId`, `hash` |
| Boolean (any) | no `is`/`has` prefix; **positive polarity** | `boolean` | `false` | `isX`, `hasX`; negatives `hidden`→`visible`, `closed`→`open`, `inactive`→`active`, `invisible`→`visible`, `collapsed`→`expanded` (`disabled`/`readonly` are accepted exceptions) |
| Value change signal | `v-model` / `update:<x>` (no separate echo) | — | — | **`<x>-change` when `update:<x>` exists** (redundant echo — blocked). A genuinely distinct commit event (e.g. commit-on-blur) is a bare `change`, never `<x>-change`. |

## Shared values

Value names are shared too. The same look gets the same token on every component:

| Idea | Value | Prop | Banned values |
|---|---|---|---|
| Bordered surface, no fill | `outlined` | `kind` | `outline` |
| No surface until hover | `transparent` | `kind` | `text`, `ghost` |
| Error / destructive color | `danger` | `severity`, `kind` | `error`, `destructive` |
| Size tokens | `small`, `medium`, `large` | `size` | `xs`, `sm`, `md`, `lg`, `xl` |

`kind` and `small | medium | large` stay as they are in v6. shadcn and Radix call these `variant` and
`sm | md | lg`; webkit already ships `kind` and the long tokens on every component, so a rename
would break every consumer for no gain. Code ported from shadcn maps `variant` → `kind`,
`ghost` → `transparent`, `destructive` → `danger`, `outline` → `outlined`.

## v6 renames (M1.2 item 2.6)

Every prop that drifted from this table is renamed in v6. The full map, with value renames,
is `packages/webkit/src/cli/migrations/v6-props.json` (`{ "<subpath>": { "<old>": "<new>" } }`).
The `field-*` wrappers are not in it: v6 replaces them with a single `Field`.

| Component | Before | After |
|---|---|---|
| `accordion`, `tabs`, `navigation-menu`, `code-block`, `theme-switcher` | `v-model:value` | `v-model` (`modelValue`) |
| `alert` | `severity="error"` | `severity="danger"` |
| `button` | `kind="text"` | `kind="transparent"` |
| `item` | `kind="outline"` | `kind="outlined"` |
| `severity-tag` | `level` | `severity` |
| `code-block`, `log-view`, `table` | `border` | `bordered` |
| `log-view` | `showCopy` | `copyable` |
| `media-tabs`, `quote-tabs` | `autoPlay`, `autoPlayInterval` | `autoplay`, `autoplayInterval` |
| `shell-mockup` | `still` | `animated` (inverted) |
| `doc-card` | `overline`, `link` | `eyebrow`, `linkLabel` |
| `doc-card-group` | `mobileCols` | `mobileColumns` |
| `doc-tooltip` | `headline`, `cta` | `title`, `linkLabel` |

† Added in v6. [`_lib/prop-vocabulary.mjs`](../hooks/_lib/prop-vocabulary.mjs) enforces them: the aliases are in `CONCEPTS` and the banned values of the shared-values table are in `VALUES` (checked against a `kind` / `severity` union). `error` stays allowed as a prop name (a message string or a send-failed state is a different concept), and `v-model:value` cannot be blocked by name because `value` is a legitimate prop, so those two are review-only.

**Not banned — legitimate competing uses:**

- `type` — native `<input type>` and similar pass-throughs are fine. Only a *variant* named `type` is wrong (rename to `kind`).
- `value` — identity, the `v-model` payload, and clipboard/display text are all legitimate. Use `label` (not `value`) only for **slot-fallback display text**.

## The `size` house default

`size` uses the same three tokens everywhere; the **default** follows one predictable rule instead of being decided per component:

- **actions / links** (button, icon-button, link, …) default to `large`.
- **everything else** defaults to `medium`.

A component that supports only a subset declares the tokens in canonical order (`'small' | 'medium'`, never `'large' | 'medium'`) and notes the subset in its spec.

## What is enforced, and where

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** (PostToolUse on `Write|Edit|MultiEdit`) blocks a root `.vue` whose `defineProps` uses a banned alias, an `is`/`has` boolean prefix, a non-canonical/reordered `size` union, or a camelCase event; and flags **default drift** (spec Props "Default" column ≠ `withDefaults`). This runs on creation **and every edit**, so a component cannot drift off-vocabulary later.
- **[`_schema.json`](../../.specs/_schema.json)** + the `spec-validate` skill reject the same aliases at spec-authoring time (belt-and-suspenders).
- **`catalog.json` `vocabulary`** carries the dictionary to the MCP (`get_component` / usage guidance) so AI-written consumer code uses `kind`, not `variant`.

## Migration

Per [`migration.md`](./migration.md), a name inherited from another design system (`variant`, `sm/md/lg`, `onValueChange`) is rewritten to ours — never carried over. Legacy components on the [`legacy-components.json`](../hooks/_lib/legacy-components.json) whitelist bypass the hook until they are migrated; migrating one includes bringing its props onto this vocabulary.

## Hard prohibitions

- Do not introduce a prop whose concept already has a canonical name under a different name.
- Do not use `xs`/`sm`/`md`/`lg`/`xl` for `size`; do not reorder the `size` union.
- Do not prefix a boolean with `is`/`has`.
- Do not let the spec's Default column disagree with `withDefaults`.
- Do not edit `prop-vocabulary.md` without editing `_lib/prop-vocabulary.mjs` in the same PR (and vice-versa) — they are one source in two forms.
