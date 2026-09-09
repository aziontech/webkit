---
name: doc-update
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 5afd0c4464485f77fa627321409959e167eab8fe05bbf17e1a75ad7d0c1a6b3b
created: 2026-08-22
last_updated: 2026-08-22
---

# DocUpdate — Component Spec

## Purpose

One entry in a changelog: what shipped, when, and under which version. The release's identity sits in a left column — the date, the version under it, the tags under that — the notes sit on the right, and a rule runs between them for the length of the entry and bridges the block gap to the next one, so a set of entries reads as one continuous timeline rather than a stack of boxes. The label is an `h2` and a link to its own id, because every entry is a URL somebody sends — the id is the label slugified, unless an explicit `anchor` overrides it.

## When to use

- A changelog or release-notes page: one `DocUpdate` per release, newest first, inside `DocProse`.
- Any dated series a reader scans by its left edge — announcements, incident retrospectives, versioned API changes.

## When NOT to use

- For a single dated aside inside a guide — that is a `DocCallout`, not a timeline entry.
- As a styled row inside another section. The label is an `h2`, so every entry claims a slot in the page outline; nesting one under a deeper heading breaks the outline.
- To generate a feed. Mintlify's `rss` prop is deliberately absent — this layer renders pages and generates nothing, so the prop would be inert.

## Related

- `DocProse` — the contract around it: `data-doc-block` takes the block rung of the spacing ladder, and `data-doc-chrome` keeps prose rules off the label column.
- `Tag` — renders the entry's tags row (`severity="secondary"`, small, rounded).
- `use-heading-nav` — the composable the label anchor calls. A page that owns its scroll container provides a scroller-aware handler with `provideHeadingNav`; rendered outside a provider, the injected default is a no-op — never a throw — and the browser's native hash navigation takes over.

## Best practices

- Put the date (or release name) in `label` and the version in `description` — the left edge is what a reader scans, so the label carries the identity.
- Keep headings inside an entry one level below the label: the label is the entry's `h2`.
- Set `anchor` only when two entries share a label; otherwise let the id derive from the label so shared links match what readers see.

## Usage

```vue
<script setup>
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocUpdate
    label="August 19, 2026"
    description="v2.4.0"
    :tags="['Console', 'Edge Functions']"
  >
    <p>
      Rules Engine conditions now match on request headers, so a rule can branch on anything the
      client sends without a function in the path.
    </p>
  </DocUpdate>
</template>
```

## Props

| Prop          | Type       | Default | Required | JSDoc                                                                                              |
| ------------- | ---------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| `label`       | `string`   | `''`    | false    | The entry's name — a date, a release name. Also its anchor.                                        |
| `description` | `string`   | `''`    | false    | Secondary line under the label; usually the version.                                               |
| `tags`        | `string[]` | `[]`    | false    | Short labels categorising the entry: a product, an area, a kind of change.                         |
| `anchor`      | `string`   | `''`    | false    | Anchor override; wins over the slug derived from the label. Set it when two entries share a label. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                  |
| --------- | ----- | ---------------------------------------------------------------------- |
| `default` | —     | The release notes: prose, lists, code, or any documentation component. |

## States

- Visual states: `default`, plus `hover` / `focus-visible` on the label anchor — the label underlines and the chain glyph fades in
- Anchor derivation: an explicit `anchor` prop wins; otherwise the id is the `label` slugified (inline markup stripped, lowercased, kebab-cased). The `h2` takes the same id with a `-label` suffix, and the section's `aria-labelledby` points at it
- Heading navigation degrades gracefully: the anchor calls the handler a page provided via `provideHeadingNav`; outside a provider the injected default is a no-op — activation never throws, and native hash navigation handles the jump
- `data-doc-block` + `data-doc-update` mark the entry for `DocProse` block rhythm and let an entry that follows another bridge the rule through the block gap; `data-doc-chrome` keeps prose rules off the label column
- Below `md` the columns stack and the rule drops; from `md` up the label column sticks (`md:sticky`) while the notes scroll past

## Motion & Animations

| Trigger                                                        | Animation / Transition                     | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------- | ------------------------------- |
| hover / focus-visible on the label anchor (chain-glyph reveal) | `transition-opacity duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                          | Token (DESIGN.md)                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| typography (label)              | `.text-heading-xs`                                                                     |
| typography (description)        | `.text-body-xs`                                                                        |
| typography (chain glyph)        | `.text-label-md`                                                                       |
| text (label)                    | `var(--text-default)`                                                                  |
| text (description, chain glyph) | `var(--text-muted)`                                                                    |
| rule (between the columns)      | `var(--border-default)`                                                                |
| underline (label hover)         | `var(--border-strong)`                                                                 |
| ring (anchor focus)             | `var(--ring-color)`                                                                    |
| shape (anchor focus outline)    | `var(--shape-flat)`                                                                    |
| spacing                         | `var(--spacing-lg)` / `var(--spacing-sm)` / `var(--spacing-xs)` / `var(--spacing-xxs)` |
| tags row                        | `Tag`'s own `severity="secondary"` tokens                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The label is a real `h2` inside a `section` whose `aria-labelledby` points at it, so every entry is a named region and joins the page outline and the "On this page" rail.
- Keyboard map: `Tab` reaches the label anchor; `Enter` follows it — through the page's provided heading-nav handler, or native hash navigation without one. Nothing else in the entry's chrome is interactive.
- Visible focus: the anchor takes `focus-visible:outline-2 focus-visible:outline-offset-2` in the ring token.
- The chain glyph is decorative (`aria-hidden`) and revealed on `focus-visible` as well as hover, so the self-link affordance is not pointer-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the label anchor is a text link on its own line in the label column, with nothing else competing for the hit area.

## Stories (Storybook)

- Default — a single entry inside `DocProse`: label, version, tags, notes.
- Changelog — composite story with three consecutive entries, newest first. Justified in writing here because the rule that bridges the block gap only exists when one entry follows another — no single-entry story can show the timeline reading, or that the first entry's rule does not extend upward.

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
