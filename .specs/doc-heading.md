---
name: doc-heading
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 0efe45db56b083d88c7994fc4b206efefbadcfb31b00546eadbf8e76c87e450c
created: 2026-11-11
last_updated: 2026-11-11
---

# DocHeading — Component Spec

## Purpose

A documentation section heading that is also the link to itself. The whole text links to its own `id`, so a reader can copy the URL to the section; a rule under the text and a chain glyph after it appear on hover and keyboard focus without taking layout. The click goes through `useHeadingNav`, so the page decides how to scroll; with no page it falls back to the native hash jump. MDX renderers and hand-composed pages both render headings through it, so the two authoring paths cannot drift.

## When to use

- Every `h2`–`h4` on a docs page that the page rail lists.
- Section headings on a designed docs page composed in Vue.

## When NOT to use

- For the page title — use `DocPageHeader`.
- On marketing pages — use `SectionTitle`.

## Related

- `DocOnThisPage` — the rail that points at the ids.
- `useHeadingNav` — the page-provided scroll handler.
- `DocProse` — skips `[data-doc-anchor]` in its link rules.

## Best practices

- Give every heading a stable, slug-like `id`.
- Without an `id` the heading renders plain text with no anchor — a link to nowhere is never drawn.

## Usage

```vue
<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
</script>

<template>
  <DocHeading
    :level="2"
    id="purge-by-url"
    >Purge by URL</DocHeading
  >
</template>
```

## Props

| Prop    | Type     | Default | Required | JSDoc                                                                                                      |
| ------- | -------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `level` | `1 \\    | 2 \\    | 3 \\     | 4`                                                                                                         | `2` | false | Heading level; drives the tag and the prose type scale. |
| `id`    | `string` | `''`    | false    | Anchor id: what the page rail entry and the copied URL point at. Empty renders the heading without a link. |
| `label` | `string` | `''`    | false    | Fallback text when the default slot is empty.                                                              |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes             |
| --------- | ----- | ----------------- |
| `default` | —     | The heading text. |

## States

- `data-doc-heading` mirrors `level` for the `DocProse` type scale.
- Hover and focus-visible reveal the underline and the link glyph.

## Motion & Animations

The glyph fades in with `transition-opacity duration-150`; `motion-reduce:transition-none`.

## Tokens

| Region        | Token (DESIGN.md)                     |
| ------------- | ------------------------------------- |
| underline     | `var(--border-strong)`                |
| glyph         | `var(--text-muted)`, `.text-label-md` |
| focus         | `var(--ring-color)`                   |
| scroll margin | `var(--spacing-lg)`                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A real `h1`–`h4`; the link name is the heading text (the glyph is `aria-hidden`).
- Keyboard: `Tab` reaches the link, `Enter` follows it; the focus outline is visible.
- The glyph meets 3:1 as a non-text indicator only when shown; the text keeps the heading colour.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: the glyph sits at the inline end (`ms-*`).
- Icons: `pi-link` is not mirrored.
- Keyboard: unchanged.

## Responsive

- Plain inline flow, so a long heading wraps with the glyph trailing the last word.

## Performance

- Bundle budget: 1.5 KB gzip for `./doc-heading` in `.size-limit.json`.

## Stories (Storybook)

- Default — an `h2` with an id.
- Levels — `h1` to `h4`.

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
