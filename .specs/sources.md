---
name: sources
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: ca2e3f9c0e9567ef6683647b59d6f19a50ab6d7db8373d6e2145481ff0a0ff96
created: 2026-11-11
last_updated: 2026-11-11
---

# Sources — Component Spec

## Purpose

The list of sources a generative AI response drew on (Cloudscape's sources expandable section, AI
Elements Sources): a disclosure titled `3 sources` that opens an ordered list — number, linked title,
one-line description. Item `n` carries the id `<anchor>-source-<n>`, the target of the `[n]`
citations `StreamingResponse` renders; following a citation opens the list and brings the item into
view.

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## When NOT to use

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with a link; a list of one is noise.

## Related

- `citation` — the inline `[n]` that points here.
- `streaming-response` — renders the citations; share the `anchor`.
- `chat-message` — sources sit inside the assistant message, under the response.

## Best practices

- Order items as the response first cites them, so `[1]` is item 1.
- Use the page title, not the URL, as the title; add the site or section as the description.
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
      { title: 'Real-Time Purge', href: 'https://www.azion.com/en/documentation/', description: 'Azion documentation' },
      { title: 'Cache settings', href: 'https://www.azion.com/en/documentation/' }
    ]"
  />
</template>
```

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `AiSource` (`title`, `href?`, `description?`) from `sources/types.ts`,
shared with `StreamingResponse`._

## Props

| Prop          | Type         | Default     | Required | JSDoc                                                                                                       |
| ------------- | ------------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `items`       | `AiSource[]` | `[]`        | false    | The sources behind the response, in citation order; item `n` is what `[n]` points at.                      |
| `anchor`      | `string`     | `''`        | false    | Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. |
| `title`       | `string`     | `''`        | false    | Heading of the disclosure. Empty uses the locale catalog (`3 sources`).                                    |
| `open`        | `boolean`    | `undefined` | false    | Controlled open state. Use with `v-model:open`.                                                             |
| `defaultOpen` | `boolean`    | `false`     | false    | Initial open state when uncontrolled.                                                                       |

## Events

| Event         | Payload   | When                                                         |
| ------------- | --------- | ------------------------------------------------------------ |
| `update:open` | `boolean` | Expanded or collapsed, by the trigger or by following a citation. |

## Slots

_No slots._

## States

- `data-state="open|closed"`; renders nothing when `items` is empty.
- Following a `#<anchor>-source-<n>` link (`hashchange`) opens the list and scrolls the item into view.

## Motion & Animations

| Trigger            | Animation / Transition                                           | Token     | Reduced-motion fallback         |
| ------------------ | ---------------------------------------------------------------- | --------- | ------------------------------- |
| chevron open/close | `transition-transform duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |
| trigger hover      | `transition-colors`                                              | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region        | Token                                                        |
| ------------- | ------------------------------------------------------------ |
| trigger       | `.text-label-sm`, `var(--text-muted)`                         |
| number chip   | `var(--bg-surface-raised)`, `var(--shape-elements)`, `.text-label-sm` |
| title         | `.text-body-sm`, `var(--text-link)`                           |
| description   | `.text-body-xs`, `var(--text-muted)`                          |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: trigger, links and the targeted item show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` through the links.
- ARIA: `button` with `aria-expanded` / `aria-controls`; the list is an `<ol aria-label="Sources">` so numbers are announced by position; the visual number chip is `aria-hidden`.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Internationalization

| Key             | English source                  | Override prop |
| --------------- | ------------------------------- | ------------- |
| `sources.count` | `{count} source(s)` (plural)    | `title`       |
| `sources.label` | `Sources`                       | —             |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Right-to-left

- Layout: logical utilities; the number chip sits at the inline start.
- Icons: book and chevron-down are not mirrored.
- Keyboard: none.
- User data: titles render with the document direction.

## Responsive

- Container queries: none.
- Narrow: titles and descriptions truncate with an ellipsis.
- Touch: links are text-sized inside 24 px rows.
- Reflow: no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`sources`).
- Runtime budget: static; one `hashchange` listener.
- Heavy parts: none.

## Stories (Storybook)

_Storybook is retired in M2.5; examples in `packages/webkit/examples/sources/`: Default (collapsed), Open._

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
