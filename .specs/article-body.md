---
name: article-body
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: cc98318cb7f3014ba2e80fe72c0b93eb0b9001ce27c5329c12654a797a5d9ea1
---
# ArticleBody — Component Spec

## Purpose

The reading page of an article. A brand banner sits over a three-column grid: the share, community and copy-page rail on the left; the breadcrumb, headline, byline and prose down the middle at a reading measure; and the "On this page" outline on the right. Both rails stick under the header and fold away below `lg`, leaving the column alone. The section opens the page itself, so it carries its own `section-container` instead of sitting in the page column. The prose arrives as markdown: blank-line separated blocks render as `##` / `###` headings (each with an id slugged from its text, feeding the outline), `-` lists and paragraphs. It is a page section — the site places it from a `{ _id: 'article-body', props }` entry and binds `props` straight onto it — and it composes `section-container`, `section-module`, `frame-box`, `breadcrumb`, `hero-title`, `divider`, `doc-prose`, `tooltip`, `icon-button`, `split-button` and `doc-on-this-page`; copying to the clipboard is local behaviour.

## When to use

- To open every blog post and every success story page.

## When NOT to use

- For a list of articles → use `article-index-blog`.
- For a closing row of related articles → use `article-cards`.

## Related

- `doc-prose` — the reading-measure typography the body renders in.
- `doc-on-this-page` — the outline rail fed by the body's headings.

## Best practices

- Write the body as plain blocks — headings, paragraphs and `-` lists separated by blank lines; inline markdown is rendered as text.
- Mark the last breadcrumb entry `current`.

## Usage

```vue
<script setup>
import ArticleBody from '@aziontech/webkit/article-body'
</script>

<template>
  <ArticleBody
    eyebrow="Blog"
    banner="/media/blog/banner.svg"
    body="## Challenge&#10;&#10;Magalu is the most innovative retail company in LATAM."
    :article="{
      title: 'Magalu Ensures High Availability at Scale with Azion',
      description: 'Explore how Magalu enhances cybersecurity with Azion.',
      date: 'FEB 4, 2022',
      readTime: '5 min read',
      href: 'https://www.azion.com/en/success-case/magalu/'
    }"
    :trail="[
      { label: 'Success cases', href: '/success-cases' },
      { label: 'Magalu Ensures High Availability at Scale with Azion', current: true }
    ]"
    :share="{ title: 'Share this article', copyLink: 'Copy link', shareX: 'Share on X', shareLinkedIn: 'Share on LinkedIn' }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `article` | `ArticleBodyArticle` | `—` | true | The piece being read: its `title` (the page h1), `description`, `date`, `readTime` and canonical `href`. |
| `trail` | `ArticleBodyCrumb[]` | `[]` | false | The breadcrumb over the headline, each a `label` and an `href`, the last one marked `current`. |
| `body` | `string` | `''` | false | The article as markdown; its `##` and `###` headings feed the outline. |
| `banner` | `string` | `''` | false | URL of the image over the masthead; the banner frame is omitted when empty. |
| `share` | `ArticleBodyShare` | `undefined` | false | Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`; the group is omitted when absent. |
| `community` | `ArticleBodyCommunity` | `undefined` | false | The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent. |
| `copyPage` | `ArticleBodyCopyPage` | `undefined` | false | The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on every link and button
- The outline lists the body's headings, the first one active; it is omitted when the body has none
- The left rail renders only the groups that are set, and is omitted when none is
- Copying: the copy-link button and the `link` menu entry copy `article.href`; the split button's main action copies the body; a failed clipboard write is ignored

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover colour of a community link | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| banner fill | `var(--bg-canvas)` |
| rail headings | `text-heading-xs`, `var(--text-default)` |
| byline and community links | `text-body-sm`, `var(--text-muted)`, hover `var(--text-default)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every link and button shows a `focus-visible` ring.
- Keyboard map: `Tab` moves through the breadcrumb, the rails and the prose links; the split button owns its menu keyboard map.
- ARIA: the root is a plain `div` so the page keeps its own landmarks; the headline is the page `h1` (from `hero-title`); the prose is an `article`; the two rails are `aside` landmarks, the left one named by the share title, the right one by the outline's own navigation; the share and community groups are named `section`s; icon-only share buttons are named by their labels and carry a tooltip; the banner is decorative (`aria-hidden`, `alt=""`); heading ids are slugged from their text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — owned by `icon-button` and `split-button`.

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
