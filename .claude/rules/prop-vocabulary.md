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
| Primary two-way value | `modelValue` (default `v-model`) | component-specific | per component | `isToggled` |
| Overlay open state | `open` (+ `v-model:open`), seed `defaultOpen` | `boolean` | `undefined` (controlled) | `visible`, `show`, `opened` |
| Disabled | `disabled` | `boolean` | `false` | `isDisabled`, `enabled` |
| Loading | `loading` | `boolean` | `false` | `isLoading` |
| Leading/trailing glyph | `icon` | `string` (PrimeIcons) | `''` | `iconName`, `leadingIcon`, `trailingIcon` |
| Accessible name | `ariaLabel` (+ prefixed `xAriaLabel`) | `string` | per component | `aria-label` as a prop |
| Boolean (any) | no `is`/`has` prefix | `boolean` | `false` | `isX`, `hasX` |
| "Value changed" convenience event | `<model>-change` (e.g. `value-change`) | `[value]` | — | bare `change` |

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
