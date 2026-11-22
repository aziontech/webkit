---
name: sources
category: ai
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: 606148a14e7f1f4229a5c8ef75725eff1f615c8eb29f50452a97ff995b4159e4
created: 2026-11-11
last_updated: 2026-11-22
---

# Sources — Component Spec

## Purpose

The sources a generative AI response drew on (Cloudscape's sources section, AI Elements Sources): a
small `Sources` button with the overlapping marks of up to three sources (the item's `icon` or its
site's first letter) that opens an ordered list — mark, linked title, description or site. It ends
the message's action row (`ChatMessage.Actions` `#trailing`). Item `n` has the id
`<anchor>-source-<n>`, the target of `StreamingResponse`'s `[n]` citations; following one opens
the list and brings the item into view.

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## When NOT to use

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with a link; a list of one is noise.

## Related

- `citation` — the inline `[n]` that points here.
- `streaming-response` — renders the citations; share the `anchor`.
- `chat-message` — the pill goes in the `#trailing` slot of `ChatMessage.Actions`, after the icon actions.

## Best practices

- Order items as the response first cites them, so `[1]` is item 1.
- Use the page title, not the URL, as the title; the site shows on its own from `href`, so the description is for the section (`Azion documentation · Cache`).
- Give `icon` only for a site whose glyph is in the icon set (`az az-github`).
- Keep the list collapsed by default; the inline citations are the primary path.

## Usage

```vue
<script setup>
  import Sources from '@aziontech/webkit/sources'
</script>

<template>
  <Sources
    anchor="answer-1"
    :items="[
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation'
      },
      { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion', icon: 'az az-github' }
    ]"
  />
</template>
```

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `SourcesItem` (`title`, `href?`, `description?`, `icon?`) from `sources/types.ts`,
shared with `StreamingResponse`. A private part, `parts/sources-mark.vue`, draws one round mark._

## Props

| Prop          | Type            | Default | Required | JSDoc                                                                                                                       |
| ------------- | --------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`       | `SourcesItem[]` | `[]`    | false    | The sources behind the response, in citation order; item `n` is what `[n]` points at.                                       |
| `anchor`      | `string`        | `''`    | false    | Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. |
| `title`       | `string`        | `''`    | false    | Label of the pill that opens the list. Empty shows `Sources` and names the pill with the count (`3 sources`).               |
| `defaultOpen` | `boolean`       | `false` | false    | Initial open state when uncontrolled.                                                                                       |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Expanded or collapsed, by the trigger or by following a citation. Unbound, the state is local and starts from `defaultOpen`. |

## Events

_No events._

## Slots

_No slots._

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents`, so in a wrapping row (`ChatMessage.Actions`) the pill sits in the row and the open list takes the full width under it.
- Following a `#<anchor>-source-<n>` link (`hashchange`) opens the list and scrolls the item into view.

## Motion & Animations

| Trigger    | Animation / Transition                                        | Token     | Reduced-motion fallback         |
| ---------- | ------------------------------------------------------------- | --------- | ------------------------------- |
| pill hover | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region      | Token                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| pill        | `.text-label-md`, `var(--text-muted)`, hover and open `var(--bg-hover)` / `var(--text-default)`, `var(--shape-control)`, height 32 px |
| mark        | `var(--bg-surface-raised)`, `var(--border-default)`, `rounded-full`, `.text-label-sm`; overlap ring `var(--bg-canvas)`                |
| list        | `var(--border-default)`, `var(--shape-card)`, padding `var(--spacing-2xs)`; rows `var(--shape-control)`                               |
| title       | `.text-body-sm`, `var(--text-default)`, underline on hover                                                                            |
| description | `.text-body-xs`, `var(--text-muted)`                                                                                                  |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: trigger, links and the targeted item show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` through the links.
- ARIA: `button` with `aria-expanded` / `aria-controls`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the list is an `<ol aria-label="Sources">` so numbers are announced by position.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): shows the title as plain text.

## Internationalization

| Key             | English source               | Override prop |
| --------------- | ---------------------------- | ------------- |
| `sources.count` | `{count} source(s)` (plural) | `title`       |
| `sources.label` | `Sources`                    | `title`       |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`), the mark sits at the inline start of each row.
- Icons: site glyphs are not mirrored.
- Keyboard: none.
- User data: titles render with the document direction.

## Responsive

- Container queries: none.
- Narrow: titles and descriptions truncate with an ellipsis.
- Touch: the pill has a 44 px hit area on coarse pointers; list rows are 40 px tall.
- Reflow: no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`sources`).
- Runtime budget: static; one `hashchange` listener.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/sources/`: Default (the pill, collapsed), Open._

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
