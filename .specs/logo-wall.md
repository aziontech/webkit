---
name: logo-wall
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: dab394db994e88139a67a87b1b5547595bf9a4184648083e9f4d4318755dce77
created: 2026-09-22
last_updated: 2026-09-30
---

# Logo Wall — Component Spec

## Purpose

The customer-proof band of a marketing page: a framed grid of square cells, one company mark to a cell, each one optionally linked to that customer's story, under one accessible group name. It is deliberately a static grid rather than an auto-scrolling strip — moving content needs a pause control to meet WCAG 2.2.2, and a wall a reader can scan beats one they have to wait for.

The cells are `card-grid` frame cells, so the wall draws the same hairlines and registration marks as every other framed band on the page. A linked cell is the whole square: on hover and focus a wash rises behind it, the mark lifts, and a `Read story` label slides in under it, so the wall doubles as the way into the case studies. Fill the `aside` slot and the band splits from `lg` up — the wall on the start edge, one of those customers speaking on the end edge on a padded canvas panel — and the wall narrows from six columns to three to sit in half the width at the same cell size. Every cell is a perfect square in every layout, and the wall alone sets the band's height: the `aside` panel is size-contained from `lg` up, so its content never stretches a row, and the statement sits centred in it. Between `lg` and `xl` the wall is two columns wide, so its three rows are tall enough for a client sentence; from `xl` it is three columns, two rows. Set `kind` to `rectangle` and every cell becomes a 3:2 rectangle instead: beside `aside` the wall holds three columns from `lg`, so nine rectangles take exactly the height six squares do, and below `sm` it keeps three columns so nine marks never leave a ragged row.

## When to use

- To show who already uses the product, as the proof band under a hero or section, with each mark leading to that customer's success case.
- Wherever a set of partner, customer or certification marks is the message.
- When the marks are recognisable enough that names are unnecessary.
- To set one customer's statement beside the crowd that backs it, by filling `aside` with a `quote`.

## When NOT to use

- For a measured claim rather than a set of names → use `big-numbers`.
- For one customer's statement → use `quote`.
- For a single brand mark, such as the product's own → use `brand`.
- For a grid of described features rather than marks → use `topic` in a `card-grid`.
- For a moving strip of many small marks, such as a tool stack → use `ticker`.

## Related

- `card-grid` — the frame register the wall is built on; its cells draw the rules and marks.
- `quote` — one named customer's statement; the wall shows many without words.
- `big-numbers` — the numeric form of the same proof band.
- `brand` — the product's own mark, not a customer's.

## Best practices

- Place the wall inside a `frame-box` (in a `section-module`, as every framed band is). The grid is `card-grid`'s `flush` frame: the surrounding frame draws the outer rules and the cells lay their right and bottom rules onto it.
- Supply marks that read on the page's own surface. The component applies no colour filter, so a mark that only works on one theme will not work on both; brand-colour marks read on either. When the marks come from a registry that already places them per theme, render them through the `mark` slot and keep `items` as the list they are drawn from.
- Set `shape: 'compact'` on a mark that is close to square (a roundel, a monogram) so it sits taller than the wordmarks beside it and all of them read at one visual weight.
- Give every mark a real `alt` — the company name. A linked cell is announced as `linkLabel`, then that name ("Read story, Magalu").
- Set `ariaLabel` so the group announces its purpose ("Clients running on Azion") instead of reading as an unnamed region.
- Link a mark with `href` only when there is somewhere worth going, such as a case study; a wall of links to nowhere costs a reader a tab stop per cell. In an app with a client-side router, handle `item-click`: call `event.preventDefault()` and push `item.href`.
- Put one statement in `aside`, not a second grid. The band's argument is *many customers, one of them talking*; two things of equal weight leave a reader with neither.
- Give the wall exactly six marks when `aside` is filled — two full rows of three squares beside the statement, and three rows of two between `lg` and `xl` — and a multiple of six when it is not, so the last row is never ragged.
- Reach for `kind: 'rectangle'` when the band names nine customers beside `aside`: three rows of three 3:2 cells at the height of the six-square wall. Nine is the count the rectangle wall is drawn for; without `aside` it runs six to a row like the square wall.

## Usage

```vue
<script setup>
import LogoWall from '@aziontech/webkit/logo-wall'
import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <LogoWall
    aria-label="Clients running on Azion"
    :items="[
      { src: '/logos/magalu.svg', alt: 'Magalu', href: '/customers/magalu' },
      { src: '/logos/ifood.svg', alt: 'iFood', href: '/customers/ifood', shape: 'compact' },
      { src: '/logos/stone.svg', alt: 'Stone', href: '/customers/stone' },
      { src: '/logos/netshoes.svg', alt: 'Netshoes', href: '/customers/netshoes' },
      { src: '/logos/nzn.svg', alt: 'NZN', href: '/customers/nzn' },
      { src: '/logos/itau.svg', alt: 'Itaú', href: '/customers/itau', shape: 'compact' }
    ]"
  >
    <template #aside>
      <Quote
        kind="signed"
        logo="/logos/herospark.svg"
        logo-alt="HeroSpark"
        text="Azion transformed our operations, reducing costs and improving performance."
        name="Mateus Leonardi"
        job-title="CTO at HeroSpark"
      />
    </template>
  </LogoWall>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `LogoWallKind` | `'square'` | false | The cell's proportion; `rectangle` sets every cell at 3:2, keeps three columns below `sm`, and holds three columns beside `aside` from `lg`. |
| `items` | `LogoItem[]` | `[]` | false | The marks rendered in the grid, in order; each item is `{ src, alt, href?, shape? }` where `src` is the mark's URL, `alt` names the company, `href` links the cell to that customer's story, and `shape` sets a near-square mark taller than a wordmark. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the group of marks, announced instead of an unnamed region. |
| `linkLabel` | `string` | `'Read story'` | false | Words revealed under a linked mark on hover and focus, and the lead of that link's accessible name. |

`LogoItem` is `{ src: string; alt: string; href?: string; shape?: LogoShape }`, `LogoShape` is `'wide' | 'compact'` (`wide` when omitted), and `LogoWallKind` is `'square' | 'rectangle'`. All three types are exported.

## Events

| Event | Payload | Notes |
|---|---|---|
| `item-click` | `(event: MouseEvent, item: LogoItem)` | Fired when a linked cell is activated; `item` is the matched `items` entry. The anchor still navigates unless the handler calls `event.preventDefault()`, which is how a client-side router takes over. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `aside` | — | Content set beside the wall from `lg` up, centred in a panel that never sets the band's height (keep it short enough to fit two rows of squares from `xl`), such as one customer's `quote`, on a `--bg-canvas` panel padded by `--spacing-xl`; its child fills the panel's width. When it is empty the wall spans the full width. |
| `mark` | `{ item: LogoItem; index: number }` | One cell's mark, replacing the image built from the item — for a mark that owns its own theming (a per-theme asset swap, a silhouette filter). The slotted content carries its own alternative text and sits in a 28px-tall box; on a linked cell it lifts with the built image's motion. |

## States

- Visual states: an unlinked cell is static; a linked cell on `hover` / `focus-visible` raises a `--bg-hover` wash behind the whole square, lifts the mark by `--spacing-sm`, and fades the `linkLabel` in beneath it with a trailing arrow
- `data-aside` is present when the `aside` slot is filled; from `lg` up it splits the band into two columns and narrows the wall from six columns to two, and to three from `xl`, so a cell is the same size in both layouts
- `data-kind` on the root is `square` or `rectangle`; `rectangle` sets every cell at 3:2 instead of 1:1
- Columns: two below `sm`, three from `sm`, six from `lg` (with `aside`: two from `lg`, three from `xl`); a `rectangle` wall is three below `sm` and three from `lg` beside `aside`
- `data-shape` on the built image is `wide` or `compact`; `compact` sets the mark 28px tall instead of 20px
- A cell's mark is the `mark` slot's content when it is filled, and the image built from the item otherwise
- Empty: when `items` is empty the wall renders no grid, so a page with no customers to name shows nothing rather than an empty frame — an `aside` given without items still renders, since a statement stands on its own

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus on a linked cell — the wash | `before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance` | `duration-moderate-01` + `ease-productive-entrance` | `motion-reduce:before:transition-none` |
| hover / focus on a linked cell — the mark lift | `transition-[translate] duration-moderate-01 ease-productive-entrance` | `duration-moderate-01` + `ease-productive-entrance` | `motion-reduce:transition-none` |
| hover / focus on a linked cell — the label reveal | `transition-[opacity,translate] duration-moderate-01 ease-productive-entrance` | `duration-moderate-01` + `ease-productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| cell fill | `var(--bg-surface)` (via `card-grid` cell `surface`) |
| cell rules + marks | `var(--border-default)` (via `card-grid` frame) |
| hover wash | `var(--bg-hover)` |
| mark lift | `var(--spacing-sm)` |
| cell inline padding | `var(--spacing-md)` |
| label | `text-overline-md`, `var(--text-default)` |
| label ↔ mark gap | `var(--spacing-xs)` |
| label ↔ arrow gap | `var(--spacing-xxs)` |
| aside panel | `var(--bg-canvas)`, padded by `var(--spacing-xl)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked cell carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`, inset so the ring stays inside the cell's rules; focus also lifts the mark and reveals the label, exactly as hover does. An unlinked cell is not focusable.
- Keyboard map: `Tab` reaches each linked cell in DOM order; `Enter` follows it. Unlinked cells are skipped. No arrow-key model — this is a list, not a composite widget.
- ARIA: the grid is `role="list"` of `role="listitem"` cells so the count is announced, inside a `section` named by `ariaLabel` when set. A linked cell's name is `"<linkLabel>, <alt>"`; the visible label is `aria-hidden` so it is not read twice. An unlinked cell's `alt` carries the company name. A mark supplied through the `mark` slot owns that name itself on an unlinked cell — the component cannot add it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the label is `--text-default` on `--bg-hover` over `--bg-surface`. The marks are consumer-supplied images; WCAG 1.4.11 exempts logotypes from the contrast minimum, and the component adds no colour filter, so a mark must carry its own legibility against `var(--bg-surface)`. Anything in `aside` is ordinary content and is bound by the minimum in full.
- `motion-reduce:transition-none` / `motion-reduce:before:transition-none` on every hover transition. The band never auto-scrolls, so WCAG 2.2.2 (pause, stop, hide) does not apply.
- Touch target ≥40×40 px — a linked cell's anchor is its whole square.

## Stories (Storybook)

- Default — six linked marks beside a `quote`, the Web Apps band (justified: this is the composition the component exists for, and the `aside` split, the three-column wall and the canvas panel only exist when the slot is filled, which no arg can produce)
- Wall — the same marks with no `aside`, six to a row (justified: the full-width six-column wall is the other layout the component has)
- Rectangle — nine linked marks beside a `quote` in 3:2 cells (justified: the rectangle cell and its three-column wall beside `aside` only exist with `kind: 'rectangle'` and nine items, which the square Default cannot show)
- Unlinked — marks with no `href` (justified: the static cell, with no wash, lift, label or tab stop, only exists without an `href`, and every other story links its marks)

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
