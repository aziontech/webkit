---
name: article-highlight
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 61e5c8962f75afc6352c140b0b5f8ce638be4e516d411d78a2a2c3cfa951f244
---
# ArticleHighlight — Component Spec

## Purpose

The band that opens a blog under its hero. One article is shown large — its cover beside its overline, headline, deck, read time and a button into it — over a wall of the highlight articles that acts as its selector. The wall is a tablist and the large article its panel; selecting a title on the wall swaps the panel, and every article is drawn invisibly under the panel so the band keeps the height of its tallest article and never jumps. With four or more articles the wall runs four across. It is a page section — the site places it from a `{ _id: 'article-highlight', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid` and `button`; the selection is local state.

## When to use

- To open a blog or a resource page with its newest or most important articles.

## When NOT to use

- For a closing row of related articles → use `article-cards`.
- For the full list of articles → use `article-index-blog`.

## Related

- `article-cards` — the closing row of related articles.
- `card-grid` — the frame grid the wall of titles sits on.

## Best practices

- Feature three or four articles; four fill the wall four across.
- Give a `highlightImage` cropped for the panel when the cover does not read at that size.

## Usage

```vue
<script setup>
import ArticleHighlight from '@aziontech/webkit/article-highlight'
</script>

<template>
  <ArticleHighlight
    anchor="articles"
    action-label="Read article"
    aria-label="Highlight articles"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: '/media/blog/ship-portfolio-two-commands.png',
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description: 'See how a portfolio site went from template to live URL.',
        readTime: '9 min read'
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `items` | `ArticleHighlightItem[]` | `[]` | false | The highlight articles in wall order, the first selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`. |
| `actionLabel` | `string` | `''` | false | Label of the button into the selected article; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the wall of titles. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a wall title lights, the panel cover scales up), `focus-visible` (inset ring), `selected` (`data-active` on the selected wall title)
- `data-columns` on the wall: four columns with four or more articles, three otherwise
- Empty: when `items` is empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover scale of the panel cover | `transition-[scale] duration-moderate-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover fill of the panel copy | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| selection fill of a wall title | `transition-colors duration-moderate-01 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover wash of a wall title | `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` | inline (matches catalog) | `motion-reduce:before:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel and wall fill | `var(--bg-canvas)`, hover `var(--bg-surface-raised)` / `var(--bg-hover)`, selected `var(--bg-selected)` |
| rules | `var(--border-default)` |
| headline | `text-heading-lg`, wall titles `text-heading-xxs`, `var(--text-default)` |
| overline, deck, read time | `text-overline-sm` / `text-body-md` / `text-body-sm`, `var(--text-muted)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the panel headline link and every wall title show an inset `focus-visible` ring.
- Keyboard map: on the wall, `ArrowRight` / `ArrowDown` select the next title, `ArrowLeft` / `ArrowUp` the previous one (wrapping), `Home` the first and `End` the last; selection follows focus and only the selected title is in the tab order (roving `tabindex`).
- ARIA: the wall is a `tablist` named by `ariaLabel`, each title a `tab` with `aria-selected` and `aria-controls`; the panel is a `tabpanel` labelled by the selected tab; the panel headline is an `h2` whose link covers the article; the invisible sizer is `aria-hidden` and `inert`; covers are decorative (`alt=""`). Ids come from `useId`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every wall title is a full-cell button.

## Stories (Storybook)

- Default

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
