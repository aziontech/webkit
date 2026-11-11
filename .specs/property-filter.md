---
name: property-filter
category: data
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: b59ea62e0bfe63dc460278c44c1e8961e847deb1876bcc83f9fe53c8e295de61
created: 2026-11-11
last_updated: 2026-11-11
---

# PropertyFilter — Component Spec

## Purpose

One field that filters a collection by properties and free text, after Cloudscape's property filter. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Active`); text typed without a property becomes a free-text token. Two or more tokens combine with Match all (and) or Match any (or). It edits a `PropertyFilterQuery` and never filters anything itself: `useCollection` (or the server) applies the query, and `propertyFilterProps` binds the query, the properties and the match count in one `v-bind`.

## When to use

- A list or table that people narrow by several fields at once (status, region, owner) and by text.
- Any collection driven by `useCollection`, client or server mode.
- Filters that must survive a reload or a shared link: the query serializes into the URL through `useCollection`.

## When NOT to use

- A single text search over a short list → use `input` bound to `filterProps`.
- A few fixed choices always on screen → use `toggle-group` or `chip` filters.
- A structured filter builder with its own panel inside a table toolbar → use `table-filter`.

## Related

- `use-collection` — applies the query; `propertyFilterProps` is the binding.
- `table` — the collection it usually filters.
- `cards` — the card form of a collection.
- `collection-preferences` — the panel that sits beside it in the controls row.

## Best practices

- Give every property with a closed set of values its `options`, so values are suggested and tokens print labels.
- Set `type: 'number'` or `type: 'date'` on ordered properties to offer `>`, `<`, `>=`, `<=`.
- Bind `totalCount` so people hear how many items match after each change.
- Name the field after the collection (`aria-label="Filter resources"`).

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

## Props

| Prop          | Type                   | Default                               | Required | JSDoc                                                                           |
| ------------- | ---------------------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `query`       | `PropertyFilterQuery`  | undefined                             | false    | The tokens and how they combine. Supports v-model:query.                        |
| `properties`  | `FilteringProperty[]`  | `[]`                                  | false    | Properties the suggestions offer, with their operators and values.              |
| `totalCount`  | `number`               | undefined                             | false    | Items that match the query, announced next to the tokens. Hidden when unset.    |
| `placeholder` | `string`               | `''`                                  | false    | Placeholder of the field. Empty uses the locale catalog.                        |
| `ariaLabel`   | `string`               | `''`                                  | false    | Accessible name of the field. Empty uses the locale catalog.                    |
| `freeText`    | `boolean`              | `true`                                | false    | Accepts typed text with no property as a free-text token.                       |
| `disabled`    | `boolean`              | `false`                               | false    | Disables the field and the tokens.                                              |

Types (from `@aziontech/webkit/use-collection`): `PropertyFilterQuery = { tokens: PropertyFilterToken[]; operation: 'and' | 'or' }`; `PropertyFilterToken = { propertyKey?: string; operator: '=' | '!=' | ':' | '!:' | '^' | '!^' | '>' | '<' | '>=' | '<='; value: string }`; `FilteringProperty = { key: string; label: string; operators?: PropertyFilterOperator[]; options?: { value: string; label?: string }[]; type?: 'text' | 'number' | 'date' }`.

## Events

| Event          | Payload               | Notes                                                                 |
| -------------- | --------------------- | --------------------------------------------------------------------- |
| `update:query` | `PropertyFilterQuery` | A token was added or removed, the operation changed, or all cleared. |

## Slots

_none_ — the field, the suggestions and the tokens are fixed parts.

## States

- Visual states: `default`, `focus-visible`, `open` (suggestions shown), `disabled`
- `aria-expanded` on the field mirrors the open suggestions; `data-active` marks the active option
- `data-disabled` mirrors the `disabled` prop

## Motion & Animations

| Trigger            | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------ | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| suggestions open   | `animate-popup-scale-in`                  | semantic (150ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| suggestions close  | `animate-popup-scale-out`                 | semantic (110ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| option hover       | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region              | Token (DESIGN.md)           |
| ------------------- | --------------------------- |
| suggestions surface | `var(--bg-surface-raised)`  |
| suggestions border  | `var(--border-default)`     |
| suggestions shadow  | `var(--shadow-xs)`          |
| active option       | `var(--bg-hover)`           |
| muted text          | `var(--text-muted)`         |
| gaps                | `var(--spacing-xs)`         |
| shape               | `var(--shape-elements)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the field's own `focus-within` ring (from `input`); tokens and buttons keep theirs.
- Keyboard map: typing opens the suggestions; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option or commits the typed text; `Escape` closes the suggestions, then clears the text; `Backspace` in an empty field removes the last token.
- ARIA: the field is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`); the suggestions are a named `listbox` of `option`s with `aria-selected` on the active one; the tokens sit in a named `group`; each token's remove button is named `Remove <token>`; the match count is a `status` region.
- Option targets are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Internationalization

| Key                                 | English source                 | Override prop |
| ----------------------------------- | ------------------------------ | ------------- |
| `propertyFilter.label`              | Filter                         | `ariaLabel`   |
| `propertyFilter.placeholder`        | Filter by property or text     | `placeholder` |
| `propertyFilter.suggestions`        | Suggestions                    | —             |
| `propertyFilter.useText`            | Use: “{text}”                  | —             |
| `propertyFilter.properties`         | Properties                     | —             |
| `propertyFilter.values`             | Values                         | —             |
| `propertyFilter.tokens`             | Applied filters                | —             |
| `propertyFilter.operation`          | Combine filters                | —             |
| `propertyFilter.matchAll` / `matchAny` | Match all / Match any       | —             |
| `propertyFilter.and` / `or`         | and / or                       | —             |
| `propertyFilter.clear`              | Clear filters                  | —             |
| `propertyFilter.matches`            | {count} match / {count} matches (plural) | —   |
| `propertyFilter.equals` … `lessOrEqual` | operator names (Equals, Contains, …) | —   |

- Formatting: the match count goes through the plural rules and number format of the active locale (`Intl.PluralRules`, `Intl.NumberFormat`).

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`, `ps-`/`pe-` from `input`); the suggestions anchor to the start edge of the field.
- Icons: the filter glyph is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent.
- User data: suggestion labels sit in `<bdi>` so a value in another script does not reorder the line.

## Responsive

- Container queries: `@container/property-filter` on the root; the token row wraps.
- Narrow (≤ 640 px or a narrow container): the field takes the full width, tokens wrap onto several lines, the count moves to the end of the last line.
- Touch: options are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long tokens truncate inside the chip.

## Performance

- Bundle budget: 28 KB gzip for `./property-filter` (it carries `input`, `chip`, `button`, `toggle-group` and the placement composable) in `.size-limit.json`.
- Runtime budget: suggestions recompute per keystroke over the properties and their options (hundreds of options stay under one frame).
- Heavy parts: none; the suggestions are teleported and positioned by `usePlacement`.

## Stories (Storybook)

- Default — tokens, operation and count.
- WithCollection — bound to `useCollection` and a `Table`; justified because the binding is the main use.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
