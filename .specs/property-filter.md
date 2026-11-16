---
name: property-filter
category: data
structure: monolithic
status: implemented
spec_version: 7
template: 2
checksum: 3a55e40d2829b169c90547bc0ad7354ce22aa4bd65b25d81918c7c1922072f66
created: 2026-11-11
last_updated: 2026-11-16
---

# PropertyFilter — Component Spec

## Purpose

One field that filters a collection by properties and free text, after Cloudscape's property filter. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Active`); text typed without a property becomes a free-text token. Two or more tokens combine with Match all (and) or Match any (or). With `mode="query"` the same field edits one query string instead (`level = Error AND method = GET`), after the Console Kit events query bar: suggestions follow the word at the caret (a field, an operator, a value, then AND or OR), a check explains what is wrong under the field, and Enter submits the text with its flat token list. Since spec v4, tokens mode also builds one level of nested conditions (`grouped`: each group has its own Match all / Match any, and the groups combine with the query's operation — `(Status = Active or Status = Paused) and (Region = US East or Region = EU West)`), fetches the values of a property as the person types (`loadValues`, with a loading and an error row and a count per value), groups the operator suggestions (Equality, Comparison, Text match), and hands the value of a property marked `customValue` to the `value` slot (a date picker, a number range). It edits a `PropertyFilterQuery` and never filters anything itself: `useCollection` (or the server) applies the query, and `propertyFilterProps` binds the query, the properties and the match count in one `v-bind`.

## When to use

- Use PropertyFilter when people type queries with operators (Status = Active, Requests > 100) or free text they want to keep.
- A list or table that people narrow by several fields at once (status, region, owner) and by text.
- Any collection driven by `useCollection`, client or server mode.
- Filters that must survive a reload or a shared link: the query serializes into the URL through `useCollection`.
- With `mode="query"`: an explorer (events, logs) whose users type queries by hand, keep and reuse them as text, or need a grammar of the product (pass `validate` and `suggest`).

## When NOT to use

- A single text search over a short list → use `input` bound to `filterProps`.
- A few fixed choices always on screen → use `toggle-group` or `chip` filters.
- Inside a DataTable toolbar, `TableFilter type="property"` renders this field wired to the table's filters; bind PropertyFilter to `useCollection` yourself only for OR queries or free text.
- Faceted picks from a known set of values per field (status, region, owner), shown as chips → use `filter-menu`. PropertyFilter is for expression search: typed tokens, operators, free text and a query people keep as text.

## Related

- `use-collection` — applies the query; `propertyFilterProps` is the binding.
- `table` — the collection it usually filters.
- `card-list` — the card form of a collection.
- `collection-preferences` — the panel that sits beside it in the controls row.

## Best practices

- Give every property with a closed set of values its `options`, so values are suggested and tokens print labels.
- Set `type: 'number'` or `type: 'date'` on ordered properties to offer `>`, `<`, `>=`, `<=`.
- Bind `totalCount` so people hear how many items match after each change.
- Turn on `grouped` only when people need both and and or in one filter; most filters read better flat.
- Use `loadValues` when a property has too many values to ship (hostnames, users); return at most a few dozen per call, already filtered by the typed text, with `count` when the server knows it.
- Mark a property `customValue` when its value is easier to pick than to type (a date), and render the editor in the `value` slot; call `apply` with the value text.
- Name the field after the collection (`aria-label="Filter resources"`).
- In query mode, fields are written by `key` (no spaces); quote values that hold spaces or operator characters (`"edge cache"`). Apply the `query` of `submit` when it is not null; keep the `text` for saved and recent queries.
- A product grammar (`like`, `between`, parentheses) passes `validate` and `suggest`; `submit` then carries `query: null` for text the built-in grammar cannot flatten, and the product parses `text` itself.

## Usage

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { ref } from 'vue'

  const properties = [
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]
  const query = ref({ tokens: [], operation: 'and' })
</script>

<template>
  <PropertyFilter
    v-model:query="query"
    :properties="properties"
    :total-count="12"
  />
</template>
```

Groups, async values and a custom value editor:

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { ref } from 'vue'

  const properties = [
    { key: 'host', label: 'Host' },
    { key: 'created', label: 'Created', type: 'date', customValue: true }
  ]
  const query = ref({ tokens: [], operation: 'and' })
  const loadValues = async (property, text) => {
    const response = await fetch(`/api/values?key=${property.key}&q=${encodeURIComponent(text)}`)
    return response.json()
  }
</script>

<template>
  <PropertyFilter
    v-model:query="query"
    :properties="properties"
    :load-values="loadValues"
    grouped
  >
    <template #value="{ property, apply }">
      <input
        v-if="property.key === 'created'"
        type="date"
        aria-label="Created"
        @change="apply($event.target.value)"
      />
    </template>
  </PropertyFilter>
</template>
```

Query mode:

```vue
<template>
  <PropertyFilter
    v-model:text="text"
    mode="query"
    :properties="properties"
    @submit="(event, { query }) => query && (applied = query)"
  />
</template>
```

## Props

| Prop             | Type                                                                             | Default    | Required | JSDoc                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `properties`     | `FilteringProperty[]`                                                            | `[]`       | false    | Properties the suggestions offer, with their operators and values.                                                                                    |
| `totalCount`     | `number`                                                                         | undefined  | false    | Items that match the query, announced next to the tokens. Hidden when unset.                                                                          |
| `placeholder`    | `string`                                                                         | `''`       | false    | Placeholder of the field. Empty uses the locale catalog.                                                                                              |
| `ariaLabel`      | `string`                                                                         | `''`       | false    | Accessible name of the field. Empty uses the locale catalog.                                                                                          |
| `freeText`       | `boolean`                                                                        | `true`     | false    | Accepts typed text with no property as a free-text token.                                                                                             |
| `disabled`       | `boolean`                                                                        | `false`    | false    | Disables the field and the tokens.                                                                                                                    |
| `mode`           | `'tokens' \| 'query'`                                                            | `'tokens'` | false    | `tokens` turns each choice into a token; `query` edits one query string.                                                                              |
| `validate`       | `(text: string) => string`                                                       | undefined  | false    | Checks the query string in query mode: '' when valid, else the message shown under the field. Replaces the built-in check.                            |
| `suggest`        | `(text: string, caret: number) => PropertyFilterQuerySuggestion[]`               | undefined  | false    | Suggestions for the word at the caret in query mode. Replaces the built-in field, operator, value and AND / OR suggestions.                           |
| `grouped`        | `boolean`                                                                        | `false`    | false    | Tokens mode: tokens go into groups with their own Match all / Match any; Add group starts the next one.                                               |
| `showOperations` | `boolean`                                                                        | `true`     | false    | Shows the Match all / Match any toggle; false keeps the tokens combined with AND (a model that holds only AND conditions, such as a table's filters). |
| `loadValues`     | `(property: FilteringProperty, text: string) => Promise<PropertyFilterOption[]>` | undefined  | false    | Fetches the values of a property for the typed text, after the operator. Replaces its `options` in the suggestions.                                   |

Types (from `@aziontech/webkit/use-collection`): `PropertyFilterQuery = { tokens: PropertyFilterToken[]; operation: 'and' | 'or' }`; `PropertyFilterToken = { propertyKey?: string; operator: '=' | '!=' | ':' | '!:' | '^' | '!^' | '>' | '<' | '>=' | '<='; value: string }`; `FilteringProperty = { key: string; label: string; operators?: PropertyFilterOperator[]; options?: PropertyFilterOption[]; type?: 'text' | 'number' | 'date'; customValue?: boolean }`; `PropertyFilterOption = { value: string; label?: string; count?: number }`. Since v4, `PropertyFilterQuery` may carry `groups?: PropertyFilterTokenGroup[]` (`{ tokens, operation }`): each group is one condition next to the tokens, combined with the query's `operation`; `useCollection` matches it, sends it to `fetch` and keeps it in the URL (`groups` key). From `@aziontech/webkit/property-filter`: `PropertyFilterQuerySuggestion = { label: string; insert: string; description?: string }` (`insert` replaces the word at the caret); `PropertyFilterSubmit = { text: string; query: PropertyFilterQuery | null }`.

Built-in query grammar: `clause (AND | OR clause)*`, where a clause is `<property key> <operator> <value>` or a lone value (free text, when `freeText`). Operators are the token operators (`=`, `!=`, `:`, `!:`, `^`, `!^`, `>`, `<`, `>=`, `<=`), limited to those of the property; values are a word or a quoted string (`"…"` or `'…'`); AND and OR are case-insensitive. Errors, first one wins: unknown field, operator that does not apply, missing operator, missing value, missing AND / OR, dangling AND / OR, unclosed quote. `query` in `submit` is the token list when every connective is the same (AND gives `and`, OR gives `or`), `{ tokens: [], operation }` for an empty text, and `null` when AND and OR mix or the text does not parse.

## v-model

| Model           | Type                  | Default                            | Emits          | Notes                                                                                                                                                       |
| --------------- | --------------------- | ---------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:query` | `PropertyFilterQuery` | `{ tokens: [], operation: 'and' }` | `update:query` | Via `defineModel('query')`. A token was added or removed, the operation changed, or all cleared. Tokens mode only. Unbound, the field keeps its own tokens. |
| `v-model:text`  | `string`              | `''`                               | `update:text`  | Via `defineModel('text')`. The query string changed (typing, a suggestion, Escape clearing). Query mode only. Unbound, the field keeps its own text.        |

## Events

| Event    | Payload                                                 | Notes                                                                                             |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `submit` | `(event: KeyboardEvent, payload: PropertyFilterSubmit)` | Enter with no active suggestion and a valid query; `event` is the Enter keydown. Query mode only. |

## Slots

| Slot    | Scope                                                                                               | Notes                                                                                                                                                                                      |
| ------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value` | `{ property: FilteringProperty, operator: PropertyFilterOperator, apply: (value: string) => void }` | Tokens mode. Rendered under the field, in a named `group`, once the typed text has a property marked `customValue` and an operator; `apply` adds the token and returns focus to the field. |

## States

- Visual states: `default`, `focus-visible`, `open` (suggestions shown), `disabled`, `invalid` (query mode: after Enter or blur on a query that fails the check, then live until it passes or is cleared)
- `data-mode` on the field wrapper mirrors `mode`; query mode sets the typed text in the code type (`text-label-code-sm`)
- `aria-expanded` on the field mirrors the open suggestions; `data-active` marks the active option
- `data-disabled` mirrors the `disabled` prop; while disabled nothing is added, removed or submitted (no `update:query`, no `submit`)
- `loading` (values): a `Loading values` row with a spinner in the suggestions while `loadValues` is pending, `aria-busy` on the listbox; `error`: a `Could not load values` row when it rejects. A newer call wins over a stale one.
- Grouped (`grouped`): each group is a bordered `group` (`data-testid="…__group"`); a pending new group shows a dashed `New group` chip until its first token.

## Motion & Animations

| Trigger           | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ----------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| suggestions open  | `animate-popup-scale-in`                  | semantic (150ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| suggestions close | `animate-popup-scale-out`                 | semantic (110ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| option hover      | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |
| values loading    | inherits from `Spinner`                   | inherits from `Spinner`                           | inherits from `Spinner`         |

## Tokens

| Region              | Token (DESIGN.md)                                                 |
| ------------------- | ----------------------------------------------------------------- |
| suggestions surface | `var(--bg-surface-raised)`                                        |
| suggestions border  | `var(--border-default)`                                           |
| suggestions shadow  | `var(--shadow-xs)`                                                |
| active option       | `var(--bg-hover)`                                                 |
| muted text          | `var(--text-muted)`                                               |
| gaps                | `var(--spacing-xs)`                                               |
| shape               | `var(--shape-control)`                                            |
| group border        | `var(--border-default)`                                           |
| group padding       | `var(--spacing-2xs)` / `var(--spacing-xs)`                        |
| value count         | `.text-label-sm` + `var(--text-muted)`, `tabular-nums`            |
| section heading     | `.text-label-sm` + `var(--text-muted)`                            |
| error row icon      | `var(--danger)`                                                   |
| value editor        | `var(--border-default)`, `var(--bg-surface)`, `var(--spacing-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the field's own `focus-within` ring (from `input`); tokens and buttons keep theirs.
- Keyboard map (query mode): typing opens the suggestions for the word at the caret; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option (it replaces the word and moves the caret after it) or submits the query; `Escape` closes the suggestions, then clears the text; `ArrowLeft`/`ArrowRight`, `Home`/`End` and clicks move the caret and the suggestions follow it; `Backspace` only edits text.
- In query mode an invalid query sets `aria-invalid` on the field and `aria-describedby` to the message, which sits in a polite live region under the field; the token group is not rendered.
- Keyboard map (tokens mode): typing opens the suggestions; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option or commits the typed text; `Escape` closes the suggestions, then clears the text; `Backspace` in an empty field removes the last token (with `grouped`: cancels a pending new group first, then removes the last token of the last group).
- Operator suggestions sit in named `group`s (Equality, Comparison, Text match) inside the listbox; the arrows move across groups as one list.
- `grouped`: each group is a `group` named `Filter group <n>`; its Match all / Match any toggle is named `Combine filters in group <n>`; Add group is a button that returns focus to the field.
- `value` slot: its wrapper is a `group` named `Value of <property>`; the editor inside owns its own keyboard.
- ARIA: the field is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`); the suggestions are a named `listbox` of `option`s with `aria-selected` on the active one; the tokens sit in a named `group`; each token's remove button is named `Remove <token>`; the match count is a `status` region.
- Option targets are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Internationalization

| Key                                                    | English source                                                                                | Override prop |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------- |
| `propertyFilter.label`                                 | Filter                                                                                        | `ariaLabel`   |
| `propertyFilter.placeholder`                           | Filter by property or text                                                                    | `placeholder` |
| `propertyFilter.suggestions`                           | Suggestions                                                                                   | —             |
| `propertyFilter.useText`                               | Use: “{text}”                                                                                 | —             |
| `propertyFilter.properties`                            | Properties                                                                                    | —             |
| `propertyFilter.values`                                | Values                                                                                        | —             |
| `propertyFilter.tokens`                                | Applied filters                                                                               | —             |
| `propertyFilter.operation`                             | Combine filters                                                                               | —             |
| `propertyFilter.matchAll` / `matchAny`                 | Match all / Match any                                                                         | —             |
| `propertyFilter.and` / `or`                            | and / or                                                                                      | —             |
| `propertyFilter.clear`                                 | Clear filters                                                                                 | —             |
| `propertyFilter.matches`                               | {count} match / {count} matches (plural)                                                      | —             |
| `propertyFilter.equals` … `lessOrEqual`                | operator names (Equals, Contains, …)                                                          | —             |
| `propertyFilter.equality` / `comparison` / `textMatch` | Equality / Comparison / Text match (operator groups)                                          | —             |
| `propertyFilter.addGroup` / `newGroup`                 | Add group / New group                                                                         | —             |
| `propertyFilter.group`                                 | Filter group {index}                                                                          | —             |
| `propertyFilter.groupOperation`                        | Combine filters in group {index}                                                              | —             |
| `propertyFilter.loadingValues` / `valuesError`         | Loading values / Could not load values                                                        | —             |
| `propertyFilter.valueEditor`                           | Value of {property}                                                                           | —             |
| `propertyFilter.queryLabel`                            | Query                                                                                         | `ariaLabel`   |
| `propertyFilter.queryPlaceholder`                      | Type a query, for example status = Active AND requests > 10                                   | `placeholder` |
| `propertyFilter.queryFields`                           | Fields                                                                                        | —             |
| `propertyFilter.queryAll` / `queryAny`                 | Every condition matches / Any condition matches (AND / OR)                                    | —             |
| `propertyFilter.unknownField` … `unclosedQuote`        | the built-in check messages (`{field}`, `{operator}`, `{word}`, `{connective}`, `{position}`) | `validate`    |

- Formatting: value counts use `Intl.NumberFormat` of the active locale; the match count goes through the plural rules and number format of the active locale (`Intl.PluralRules`, `Intl.NumberFormat`).

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`, `ps-`/`pe-` from `input`); the suggestions anchor to the start edge of the field.
- Icons: the filter glyph is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent.
- User data: suggestion labels sit in `<bdi>` so a value in another script does not reorder the line.
- Query mode: the query string keeps `dir="auto"` from `input`, so a Latin query stays left-to-right inside a right-to-left page; the message sits at the start and the match count at the end (`ms-auto`).
- Teleported content: the teleported suggestions listbox binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Responsive

- Container queries: `@container/property-filter` on the root; the token row wraps.
- Narrow (≤ 640 px or a narrow container): the field takes the full width, tokens wrap onto several lines, the count moves to the end of the last line.
- Touch: options are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long tokens truncate inside the chip.

## Performance

- Bundle budget: 31.5 KB gzip for `./property-filter` (it carries `input`, `chip`, `button`, `toggle-group`, `spinner` and the placement composable) in `.size-limit.json`.
- Query mode: the lexer and the checker run once per keystroke over the text (linear in its length); no editor library.
- Runtime budget: suggestions recompute per keystroke over the properties and their options, and the list renders at most 100 rows (the typed-text row always stays last), so a property with thousands of values stays responsive; typing narrows the rest. The `PropertyFilter with 1k values` scenario of `performance.test.ts` measures it.
- `loadValues`: one call per keystroke at the value step; stale responses are dropped by a request id. Debounce in the consumer when the server needs it.
- Groups: matching is linear in tokens; `useCollection` evaluates each group once per item.
- Heavy parts: none; the suggestions are teleported and positioned by `usePlacement`.

## Examples

- Default — tokens, operation and count.
- WithCollection — bound to `useCollection` and a `Table`; justified because the binding is the main use.
- QueryMode — `mode="query"` with a match count; justified because the mode changes the whole interaction.
- Disabled — applied tokens shown read-only; justified because `disabled` locks every control and the state must be visible.
- Groups — `grouped` with two groups bound to `useCollection`; justified because nested and / or is a separate interaction (Add group, per-group toggle).
- AsyncValues — `loadValues` with counts, the loading row and an error, plus a `customValue` date property in the `value` slot; justified because neither the async states nor the slot are reachable from another example.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
