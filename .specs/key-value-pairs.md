---
name: key-value-pairs
category: content
structure: composition
status: implemented
checksum: 31a060a930f0e3951252219cccd35402182560614ae519444f023c15d45e3671
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# KeyValuePairs — Component Spec

## Purpose

A grid of labelled facts about one subject: each pair is a key (the term) and its value, which may be plain text or a composed component such as a `Link`, `Tag`, `CopyButton` or `StatusIndicator`. It renders a native description list laid out in 1 to 4 responsive columns, optionally split into titled groups, and owns its loading and empty-value surfaces. It replaces the hand-rolled label/value grids the resource detail templates (`ResourceSummary`, the detail Overview tabs) draw today.

## When to use

- The facts band of a resource detail or Overview page: ID, status, region, created at, domain.
- A read-only summary of settings before a confirm step (review step, deploy summary).
- Any set of named attributes of a single subject where the reader scans keys to find a value.
- Facts that fall into named clusters (General, Networking, Source) shown side by side as titled columns.

## When NOT to use

- Rows of many subjects compared attribute by attribute → use `table`.
- Editable fields → use the form field components (`field-text`, `field-select`, …); this component is read-only.
- A single headline figure with a trend → use `stat-tile`.
- A list of items with no key/value relation → use a plain list or `item`.

## Related

- `table` — many subjects, one row each; KeyValuePairs describes one subject.
- `card` — the surface a KeyValuePairs usually sits in; KeyValuePairs brings no surface of its own.
- `copy-button` — the trailing copy affordance for IDs and keys inside a value.
- `status-indicator`, `tag` — status and category values.
- `link` — a value that navigates (a domain, a linked resource).
- `hint` — the info glyph composed into an Item's `info` slot.
- `skeleton` — rendered in place of each value while the root is `loading`.

## Best practices

- Keep keys short nouns in sentence case ("Created", "Region"), never sentences or trailing colons.
- Order pairs by what the reader looks for first: identity, status, then the rest.
- Use `columns` for width, not for grouping; use `KeyValuePairs.Group` when the facts form named clusters, one group per column.
- Do not mix bare Items and Groups at the same level; pick one shape per instance.
- Leave the value slot out (or render nothing in it) when a value is absent; the component shows the em dash and its accessible "Not set". Do not type your own "-", "N/A" or "None".
- Put a `CopyButton` after an ID or key, never in place of the visible value.
- Use the `info` slot for a short `Hint` that explains the key; long explanations belong in the page, not in a tooltip.
- Drive `loading` from the data request so the labels stay in place and only the values shimmer.

## Usage

```vue
<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValuePairs
    :columns="2"
    aria-label="Workload details"
  >
    <KeyValuePairs.Group title="General">
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
    </KeyValuePairs.Group>
    <KeyValuePairs.Group title="Networking">
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">
        <template #info>
          <Hint text="Where the workload was first provisioned." />
        </template>
        South America (São Paulo)
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Custom certificate" />
    </KeyValuePairs.Group>
  </KeyValuePairs>
</template>
```

Tree-shaking alternative — the standalone root plus each sub-component from its own entry:

```vue
<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs-root'
  import KeyValuePairsItem from '@aziontech/webkit/key-value-pairs-item'
  import KeyValuePairsGroup from '@aziontech/webkit/key-value-pairs-group'
</script>
```

## Sub-components

The root `key-value-pairs.vue` renders a `<dl>` that is the grid. It provides a context (`injection-key.ts` + `composables/use-key-value-pairs-context.ts`) holding the root test id and the `loading` state, read-only. Every part throws a clear error when used outside `<KeyValuePairs>`.

Markup is valid HTML in both shapes: an Item is a `<div>` wrapping one `<dt>` and one `<dd>` (allowed as a direct child of `<dl>`). A Group is also a `<div>` child of the root `<dl>`: its title is the `<dt>`, and its `<dd>` holds a nested `<dl>` with the group's Items — a term whose description is a list of pairs. A heading element is not used for the group title because `<dt>` does not allow heading content.

- `key-value-pairs.vue` — the root: the `<dl>` grid, the `columns` layout, `aria-label`, `aria-busy`, the context.
- `key-value-pairs-item/key-value-pairs-item.vue` — one pair: `<div>` → `<dt>` (label + `info`) + `<dd>` (value).
  - Props: `label: string` (required — the key, rendered in the `<dt>`).
  - Events: _none_.
  - Slots: `default` — the value (text or composed components); fallback is the empty-value marker (`<span aria-hidden="true">—</span><span class="sr-only">Not set</span>`), shown when the slot is omitted or renders nothing. `info` — optional affordance after the label text inside the `<dt>`, such as a `Hint`.
  - While the root is `loading`, the `<dd>` renders a `Skeleton` in place of the value; the label stays visible.
  - `data-testid` fallback `${rootTestId}-item`; a consumer `data-testid` on the Item wins.
- `key-value-pairs-group/key-value-pairs-group.vue` — a titled column: `<div>` → `<dt>` (title) + `<dd>` → nested `<dl>` stacking its Items in one column.
  - Props: `title: string` (required — the group's term, shown above its Items).
  - Events: _none_.
  - Slots: `default` — the group's `KeyValuePairs.Item` children.
  - Occupies one cell of the root grid, so `columns` sets how many groups sit side by side.
  - `data-testid` fallback `${rootTestId}-group`; a consumer `data-testid` on the Group wins.

<!-- Resulting layout:

  packages/webkit/src/components/content/key-value-pairs/
  ├── key-value-pairs.vue
  ├── key-value-pairs.test.ts
  ├── index.ts
  ├── injection-key.ts
  ├── composables/use-key-value-pairs-context.ts
  ├── key-value-pairs-item/key-value-pairs-item.vue
  └── key-value-pairs-group/key-value-pairs-group.vue

  Exports: "./key-value-pairs" → index.ts, "./key-value-pairs-root" → key-value-pairs.vue,
  "./key-value-pairs-item", "./key-value-pairs-group" → their .vue files. -->

## Props

| Prop        | Type               | Default | Required | JSDoc                                                                                            |
| ----------- | ------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------ |
| `columns`   | `1 \| 2 \| 3 \| 4` | `1`     | false    | Columns at full width; collapses to one column below `md` and to two at `md` when set to 3 or 4. |
| `loading`   | `boolean`          | `false` | false    | Replaces every value with a skeleton while the data loads; labels stay visible.                  |
| `ariaLabel` | `string`           | `''`    | false    | Accessible name of the list when no visible heading names it.                                    |

## Events

| _none_ | — | — |

Read-only display; interactive values (links, copy buttons) emit their own events.

## Slots

| Slot      | Scope | Notes                                                                                      |
| --------- | ----- | ------------------------------------------------------------------------------------------ |
| `default` | —     | `KeyValuePairs.Item` children, or `KeyValuePairs.Group` children — one shape per instance. |

## States

- Visual states: `default`, `loading`, empty value (per Item)
- `data-columns` on the root mirrors `columns` and drives the grid template through `data-[columns=n]:` variants
- `data-loading` on the root mirrors `loading`; `aria-busy="true"` while loading
- Empty value: the Item's `<dd>` shows `—` (`aria-hidden`) plus a visually hidden "Not set"
- Responsive columns (viewport breakpoints):

  | `columns` | below `md` | `md` | `lg` and up |
  | --------- | ---------- | ---- | ----------- |
  | 1         | 1          | 1    | 1           |
  | 2         | 1          | 2    | 2           |
  | 3         | 1          | 2    | 3           |
  | 4         | 1          | 2    | 4           |

- No `disabled`, `invalid`, `readonly`, `error`, `open` states: the component is read-only and fetches nothing. An error loading the facts is the page's surface (e.g. `message`), not this component's.

## Motion & Animations

_none_

The loading shimmer belongs to the composed `Skeleton`, which already suppresses it under reduced motion; KeyValuePairs adds no animation or transition of its own.

## Tokens

| Region                                        | Token (DESIGN.md)                          |
| --------------------------------------------- | ------------------------------------------ |
| key (`<dt>`)                                  | `.text-body-sm`, `var(--text-muted)`       |
| value (`<dd>`)                                | `.text-body-sm`, `var(--text-default)`     |
| empty-value marker                            | `.text-body-sm`, `var(--text-muted)`       |
| group title                                   | `.text-heading-xxs`, `var(--text-default)` |
| grid gap (column / row)                       | `var(--spacing-lg)` / `var(--spacing-md)`  |
| key → value gap                               | `var(--spacing-xxs)`                       |
| inline value components gap                   | `var(--spacing-xs)`                        |
| group title → items gap; items inside a group | `var(--spacing-sm)`                        |
| info slot gap after label                     | `var(--spacing-xxs)`                       |

Layout notes: the `<dd>` is `flex flex-wrap items-center` with `min-w-0` and `break-words`, so composed values line up on one row and long unbroken IDs or URLs wrap instead of overflowing the cell. No surface, border or shape tokens — the container (`card`, a page band) supplies them.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Native description list: root `<dl>`, each Item `<div>` → `<dt>` + `<dd>`; each Group `<div>` → `<dt>` + `<dd>` → nested `<dl>`. Screen readers announce term/definition pairs with no ARIA roles added.
- `ariaLabel` is applied as `aria-label` on the root `<dl>` only when non-empty; when a visible heading precedes the list, the consumer names it with `aria-labelledby` through `$attrs` instead.
- Loading: `aria-busy="true"` on the root; each `Skeleton` is decorative (`aria-hidden`), so assistive tech reads the labels and waits for the values.
- Empty value: `—` is `aria-hidden="true"`; a `sr-only` "Not set" gives the `<dd>` an announced value.
- Keyboard map: the component itself has no tab stop. Focus moves only through interactive values and `info` affordances (`Link`, `CopyButton`, `Hint`) in reading order, each with its own focus ring and key handling.
- Reading order follows source order: row by row across the grid, top to bottom inside a group.
- Contrast: `var(--text-muted)` keys and `var(--text-default)` values at ≥4.5:1 on `var(--bg-surface)` and `var(--bg-canvas)` in both themes.
- No motion of its own; the composed `Skeleton` carries `motion-reduce:animate-none`.
- Touch targets belong to the composed interactive values; the component adds none.

## Stories (Storybook)

- Default — a resource details list: Workload ID with a `CopyButton`, Status with a `StatusIndicator`, Created at, Region, and Domain with a `Link`, at `columns: 1` with controls driving `columns` and `loading`.
- Columns — composite: the same facts at `columns` 2, 3 and 4 stacked in one frame (the `Types` equivalent for the `columns` axis).
- Groups — two to three `KeyValuePairs.Group` columns (General, Networking, Source) with an `info` `Hint` on one key and one empty value.
- Loading — `loading: true` on the Default facts.

Justification: KeyValuePairs has no `kind` / `size` axis; its axes are `columns` (shown as the composite `Columns` story) and the Group shape, a distinct anatomy the consumer must see composed. `Loading` is the state story for the declared `loading` prop.

## Decisions and open questions

Decisions taken while drafting (non-interactive run):

- **Group markup.** A heading inside the root `<dl>` is invalid HTML, so a Group is a `<dt>` title + `<dd>` holding a nested `<dl>`. The group title is therefore not in the document heading outline. Open: is a heading outline for groups required (it would mean the root renders a `<div>` instead of a `<dl>` when grouped)?
- **Loading shape.** Labels stay visible and only values become `Skeleton`s, because the labels are known before the data arrives and keeping them avoids a layout jump. Open: should labels also skeleton (the brief said "Skeleton label/value pairs")?
- **Empty value.** Fallback inside the default slot: `—` hidden from assistive tech plus a `sr-only` "Not set". The announced text is a fixed English string; open: expose it for localisation (an `emptyLabel` prop would need a spec revision).
- **Key typography.** Keys use `.text-body-sm` muted per the brief; the `ResourceSummary` template this replaces uses `.text-label-sm` muted. Open: confirm which one, since migrating the templates will shift the key style otherwise.
- **Responsive columns use viewport breakpoints** (`md`, `lg`) per the brief. Open: a KeyValuePairs inside a drawer or a narrow card on a wide screen would keep 3–4 columns; container queries would need a wrapper element around the `<dl>`.
- **Repeated test ids.** Every Item shares `${rootTestId}-item` (as table rows share theirs); tests target one by text or by a consumer-supplied `data-testid`.
- **`aria-label` on `<dl>`.** Verify in the axe test that naming a `<dl>` passes; if axe flags it, fall back to `aria-labelledby` from a visible heading.

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
