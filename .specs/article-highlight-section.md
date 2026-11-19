---
name: article-highlight-section
category: section
structure: monolithic
status: implemented
spec_version: 5
template: 2
created: 2026-11-05
last_updated: 2026-11-16
checksum: c3e3540d684a74fac9c718a042adbda1939dd62dcd6110cab759786132c67109
---

# ArticleHighlightSection — Component Spec

## Purpose

The band that opens a blog under its hero. One article is shown large — its cover beside its overline, headline, deck, read time and a button into it — over a wall of the highlight articles that acts as its selector. The wall is a tablist and the large article its panel; selecting a title on the wall swaps the panel with a short slide in the direction of travel, and every article is drawn invisibly under the panel so the band keeps the height of its tallest article and never jumps. With four or more articles the wall runs four across. It is a page section — the site places it from a `{ _id: 'article-highlight-section', props }` entry and binds `props` straight onto it — and it composes `module`, `registration-frame`, `card-grid` and `button`; the selection is local state. With `autoplay` the band advances on its own every `autoplayInterval`, drawing a primary progress line at the panel's foot, and pauses while the pointer is over it or keyboard focus is inside it; it never autoplays under reduced motion or with one article. With `fill`, from `lg` the band fills the first viewport under the sticky site header.

## When to use

- To open a blog or a resource page with its newest or most important articles.

## When NOT to use

- For a closing row of related articles → use `article-cards-section`.
- For the full list of articles → use `article-index-section`.

## Related

- `article-cards-section` — the closing row of related articles.
- `card-grid` — the frame grid the wall of titles sits on.

## Best practices

- Feature three to five articles; the wall sets one column per article from `lg`, so five sit in one row of five as on azion.com's blog.
- Give a `highlightImage` cropped for the panel when the cover does not read at that size.
- Bind `v-model` (the selected index) to open on an article other than the first; the band never advances on its own, so it holds whatever the reader or the page picked.

## Usage

```vue
<script setup>
  import ArticleHighlightSection from '@aziontech/webkit/article-highlight-section'
</script>

<template>
  <ArticleHighlightSection
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

| Prop               | Type                            | Default | Required | JSDoc                                                                                                                                                                                          |
| ------------------ | ------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`           | `string`                        | `''`    | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                 |
| `items`            | `ArticleHighlightSectionItem[]` | `[]`    | false    | The highlight articles in wall order, the one at the bound index (the first by default) selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`. |
| `actionLabel`      | `string`                        | `''`    | false    | Label of the button into the selected article; the button is omitted when empty.                                                                                                               |
| `ariaLabel`        | `string`                        | `''`    | false    | Accessible name of the wall of titles.                                                                                                                                                         |
| `autoplay`         | `boolean`                       | `false` | false    | Advances to the next article every `autoplayInterval`, with a visible pause control, pausing under hover and keyboard focus; off under reduced motion and with one article.                    |
| `autoplayInterval` | `number`                        | `6000`  | false    | Milliseconds each article is held before the band advances.                                                                                                                                    |
| `fill`             | `boolean`                       | `false` | false    | From `lg` up, the band fills the first viewport under the sticky site header.                                                                                                                  |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                           |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` | `0`     | `update:modelValue` | Index of the selected article; left unbound the band starts on the first one. A click or an arrow key writes the new index back; an index past the ends is clamped to the wall. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a wall title lights, the panel cover scales up), `focus-visible` (inset ring), `selected` (`data-active` on the selected wall title)
- `data-columns` on the wall: one column per article from `lg`, three at least and five at most
- Empty: when `items` is empty the band renders nothing
- Without `autoplay` the band has no timer: the selected article changes only on a click, an arrow key or a bound `modelValue`
- Autoplay: with `autoplay`, more than one article and no reduced-motion preference, the band advances (wrapping to the first) every `autoplayInterval` ms after mount and writes the index back through `v-model`; `data-autoplay` is set while it runs; an outlined `IconButton` at the band's top end pauses and resumes it, and `data-paused` marks the band while the reader holds it; a progress line (`var(--primary)`, `aria-hidden`) grows along the panel's foot from the inline start; pointer hover over the band or a `:focus-visible` element inside it pauses it, and leaving resumes it; any selection restarts the count
- Direction: `data-direction` on the panel is `forward` or `back` (from the arrow key, the autoplay step, or the index change) and drives an out-in slide of the panel's article, mirrored under `rtl`
- Fill: `data-fill` is set; from `lg` the band's height is the viewport minus `var(--layout-header-height)` and the section gaps, the panel takes the free height and its cover drops its fixed aspect; under 50 rem of viewport height the copy tightens and the deck hides
- Reflow: the hidden layout sizer is `min-w-0`, so the panel never grows past a 320 px box.
- A wall title clamps to two lines (`line-clamp-2`); the clamp is visual only, so the full title stays the tab's accessible name, with no `title` attribute.

## Motion & Animations

| Trigger                             | Animation / Transition                                                              | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| hover scale of the panel cover      | `transition-[scale] duration-moderate-02 ease-productive-entrance`                  | inline (matches catalog)                          | `motion-reduce:transition-none`        |
| hover fill of the panel copy        | `transition-colors duration-fast-02 ease-productive-entrance`                       | inline (matches catalog)                          | `motion-reduce:transition-none`        |
| selection fill of a wall title      | `transition-colors duration-moderate-01 ease-out`                                   | inline (matches catalog)                          | `motion-reduce:transition-none`        |
| hover wash of a wall title          | `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` | inline (matches catalog)                          | `motion-reduce:before:transition-none` |
| panel article entering on selection | `transition-[translate,opacity] duration-moderate-01 ease-productive-entrance`      | inline (matches catalog)                          | `motion-reduce:transition-none`        |
| panel article leaving on selection  | `transition-[translate,opacity] duration-moderate-01 ease-productive-exit`          | inline (matches catalog)                          | `motion-reduce:transition-none`        |
| autoplay progress line              | `transition-[width] duration-fast-01 ease-linear`                                   | inline (matches catalog)                          | `motion-reduce:transition-none`        |

## Tokens

| Region                    | Token (DESIGN.md)                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| panel and wall fill       | `var(--bg-canvas)`, hover `var(--bg-surface-raised)` / `var(--bg-hover)`, selected `var(--bg-selected)` |
| rules                     | `var(--border-default)`                                                                                 |
| headline                  | `text-heading-lg`, wall titles `text-heading-2xs`, `var(--text-default)`                                |
| overline, deck, read time | `text-overline-sm` / `text-body-md` / `text-body-sm`, `var(--text-muted)`                               |
| focus ring                | `var(--ring-color)`                                                                                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Autoplay (WCAG 2.2.2): off by default; when on, a visible pause control ("Pause rotation" / "Resume rotation") stops and resumes it for touch and screen-reader users, and it also pauses while the pointer is over the band or keyboard focus is inside it, never runs under `prefers-reduced-motion: reduce`, and the panel is not a live region, so an advance is never announced.
- Visible focus: the panel headline link and every wall title show an inset `focus-visible` ring.
- Keyboard map: on the wall, `ArrowRight` / `ArrowDown` select the next title, `ArrowLeft` / `ArrowUp` the previous one (wrapping), `Home` the first and `End` the last; selection follows focus and only the selected title is in the tab order (roving `tabindex`).
- ARIA: the wall is a `tablist` named by `ariaLabel`, each title a `tab` with `aria-selected` and `aria-controls`; the panel is a `tabpanel` labelled by the selected tab; the panel headline is an `h2` whose link covers the article; the invisible sizer is `aria-hidden` and `inert`; covers are decorative (`alt=""`). Ids come from `useId`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every wall title is a full-cell button.
- Link safety: every `href` from props or data goes through the shared `safeHref` check (`src/utils/safe-href.ts`). A `javascript:`, `data:`, `vbscript:` or other script URL, a protocol-relative `//host` URL, and the same hidden behind mixed case, spaces, tabs or HTML entities is dropped: the link renders without an `href`, so it is not a link and not focusable. `http`, `https`, `mailto`, `tel`, relative and `#` links are kept.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move between the highlighted articles, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: article titles in another script keep their own direction.

## Internationalization

| Key                     | English source    | Override prop |
| ----------------------- | ----------------- | ------------- |
| `common.pauseRotation`  | `Pause rotation`  | —             |
| `common.resumeRotation` | `Resume rotation` | —             |

- Every other visible string arrives through props.
- Formatting: none; dates and read times arrive pre-formatted.

## Right-to-left

- Layout: logical utilities only (`border-e`, `start-0`, `text-start`); the progress line grows from the inline start.
- Icons: the button's chevron mirrors (owned by `button`).
- Keyboard: arrow keys follow the reading direction through `logicalArrowKey` (`ArrowLeft` is next under `rtl`); the slide direction mirrors with `rtl:`.
- User data: none.

## Responsive

- Container queries: none; from `lg` the panel splits cover and copy and the wall runs one column per article (three to five).
- Narrow (< `lg`): the cover stacks over the copy and the wall stacks to one column; `fill` has no effect.
- Touch: every wall title is a full-cell button; autoplay pauses only under hover or keyboard focus, and a tap selects.
- Reflow: no horizontal scroll at 320 px; the hidden sizer is `min-w-0`.

## Performance

- Bundle budget: the `./article-highlight-section` entry in `.size-limit.json`.
- Runtime budget: the autoplay marquee runs every 100 ms only while autoplay runs, and stops on pause and unmount.
- Heavy parts: none.

## Examples

- Default
- Selected — `v-model` opens the band on the second article.
- Autoplay — `autoplay` with `fill`: the band advances on its own with its progress line and fills the first viewport from `lg` (the blog's opening layout).

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
