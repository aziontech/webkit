---
name: doc-page-header
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 5eb0164634afd249432faf5550da0238f124372dcaf064404687f1075b5950bd
created: 2026-08-22
last_updated: 2026-08-22
---

# DocPageHeader — Component Spec

## Purpose

The masthead of a documentation page: where the reader is (the breadcrumb), what the page is (the title), what they can do with it (a Copy Page control that hands the page to an AI tool), the deck that says what they will have by the end, and when the content last changed. It closes on a rule spanning the column, which is what gives every `h2` below it something to be subordinate to.

## When to use

- At the top of any documentation or changelog page, above `DocProse`.

## When NOT to use

- For an application screen's title — that is `PageHeading`, which carries console actions rather than a Copy Page control.
- For a section heading inside a page — the content's own `h2` does that, and the masthead's `h1` is chrome.

## Related

- `DocProse` — the body below it. The masthead's `h1` is chrome, so authored content starts at `h2`.
- `DocOnThisPage` — the rail beside the body, which lists those `h2`s.
- `SplitButton` — the Copy Page control's shape: a primary action plus attached alternatives.

## Best practices

- Give `source` the page's markdown so the primary action copies something a model can read.
- Let `lastUpdated` come from the page's own frontmatter. It is the author's claim that the content changed, not the file's mtime.
- Put the current page last in `breadcrumb`; it is marked as current for you.

## Usage

```vue
<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Go from a template to a live edge application in a few clicks."
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
    last-updated="2026-06-30"
    :source="markdown"
    @copy="(event, source) => toast('Page copied')"
    @action="(event, item) => openIn(item.value)"
  />
</template>
```

## Props

| Prop          | Type         | Default | Required | JSDoc                                                                   |
| ------------- | ------------ | ------- | -------- | ----------------------------------------------------------------------- |
| `title`       | `string`     | `''`    | false    | The page title.                                                         |
| `description` | `string`     | `''`    | false    | The deck under the title.                                               |
| `breadcrumb`  | `DocCrumb[]` | `[]`    | false    | Ancestor trail, current page last.                                      |
| `copyable`    | `boolean`    | `true`  | false    | Shows the Copy Page control.                                            |
| `source`      | `string`     | `''`    | false    | The markdown handed to the clipboard by the primary action.             |
| `lastUpdated` | `string`     | `''`    | false    | When the page's content last changed. ISO date, or a ready-made string. |

## Events

| Event    | Payload                                                                         | Notes                                                                                                        |
| -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `copy`   | `(event: MouseEvent, source: string)`                                           | Fired when the primary Copy Page action runs, after the copy resolves. Event first, per `event-payloads.md`. |
| `action` | `(event: MouseEvent \| KeyboardEvent, item: { label: string; value?: string })` | Fired when one of the attached AI actions is chosen; `item` is the entry that was picked.                    |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`. The masthead holds no interactive state of its own; the Copy Page control owns its own open/closed menu.
- `copyable: false` removes the control entirely rather than disabling it — a page with nothing to copy should not advertise the action.
- Each region renders only when it has content: no breadcrumb, deck, or "last updated" line appears empty.

## Motion & Animations

_none_

## Tokens

| Region                    | Token (DESIGN.md)                          |
| ------------------------- | ------------------------------------------ |
| typography (title)        | `.text-heading-lg`                         |
| typography (deck)         | `.text-body-md`                            |
| typography (last updated) | `.text-label-sm`                           |
| text                      | `var(--text-default)`                      |
| text (last updated)       | `var(--text-muted)`                        |
| border (the closing rule) | `var(--border-default)`                    |
| spacing                   | `var(--spacing-lg)` / `var(--spacing-xxs)` |

## Theme gaps

| Figma variable         | Temporary primitive    | Follow-up                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text-heading-lg` ramp | keep `text-heading-lg` | Theme-owned type inversion: between 640 and 767px the page title (`text-heading-lg`, 18/18/30) renders **smaller** than the prose `h2` below it (`text-heading-md`, 16/20/24) — measured 18 against 20. `text-heading-xl` (20/30/36) is the monotonic replacement but moves the desktop title from 30 to 36, so it is a theme decision rather than a component fix. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: inherited from `Breadcrumb` and `SplitButton`; the masthead adds no focusable element of its own.
- Keyboard map: `Tab` reaches the breadcrumb links and the Copy Page control; the control owns its own menu keyboard model.
- ARIA: the root is a `header`. The title is the page's single `h1`, so authored content must start at `h2`. The "last updated" glyph is decorative (`aria-hidden`) because the words "Last updated" sit beside it, and the date is wrapped in `<time datetime>` so the machine-readable value survives formatting.
- The ISO date is parsed and rendered in **UTC** on purpose: read as local time, a bare `2026-06-30` becomes the 29th for every reader west of Greenwich.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the Copy Page control is a standard button; nothing else is interactive.

## Stories (Storybook)

- Default — the full masthead: breadcrumb, title, Copy Page, deck and last-updated line.
- Regions — composite story showing the masthead with each optional region absent (no breadcrumb, no deck, `copyable: false`, no date), which is the only way to see that the layout closes up rather than leaving gaps. Justified in writing here because every region is independently optional and no single-arg story shows that.

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
