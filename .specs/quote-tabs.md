---
name: quote-tabs
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: c637a814bbe9c49a87249efffa70c5439ef8fb38536111cea77a919361fc25a4
figma:
  url: https://www.figma.com/design/aerxJReCkLz3x3z29IERE9/Assets?node-id=2240-47648
  node_id: 2240:47648
created: 2026-09-30
last_updated: 2026-10-01
---

# Quote Tabs — Component Spec

## Purpose

A testimonial band a reader browses by client: the selected client's quotation featured at the top in the client's own colours, and a wall of client cards below it that is the selector itself — clicking a card brings that client's quotation in. It is the band a page reaches for when several customers have one strong sentence each and only one of them should be read at a time.

The band owns the selection and nothing else. The featured quotation is `quote` in its `highlight` register, and every card is the same framed cell `logo-wall` draws, so a quotation and a client card look the same here as everywhere else on the page. The quotation travels sideways in the direction of the choice — a card later in the wall brings its quotation in from the right, an earlier one from the left — so the reader feels the wall as a sequence. Left alone it moves through the clients on its own, the way `media-tabs` does: a hairline along the panel's bottom edge fills toward the next client, and the band holds still while the reader points at it or works it from the keyboard.

## When to use

- To feature one client quotation at a time out of three to twelve peers, with every other client one click away on the wall below.
- As a success-story band where the wall of customers and the quotation are the same content, not two lists.

## When NOT to use

- For one quotation on its own → use `quote` with `kind="highlight"`.
- For several quotations read side by side or swiped through → use `quote-carousel`.
- For a wall whose cards link to each customer's story → use `logo-wall`.
- For a moving strip of marks with no links → use `ticker`.
- For switching a page's content between views → use `tab-view`.

## Related

- `quote` — the `highlight` register this band renders for the selected client.
- `logo-wall` — the same framed client cells, as links out rather than as a selector.
- `card-grid` — the framed grid the cards are laid out on.
- `frame-box` — the registration frame the quotation panel is drawn in, with the same corner marks as the cards below it; also what a page wraps the band in to close its outer edges.
- `quote-carousel` — the same testimonials as a row the reader scrolls through, every one visible.
- `media-tabs` — the same timer and progress hairline, for claims paired with a medium.

## Best practices

- Give the wall a full row: six clients fill it from `lg` up and three from below `sm`, so six or twelve leave no empty cell.
- Give every item a `logo` in the client's own colours; it is drawn as-is on its card and in the featured quotation, so pick artwork that carries its own contrast on both themes. Without one, `mark` names a one-ink mark from the brand registry instead.
- Let `clientName` default to the registry's label for `mark`; set it when the item has only a `logo`, or a client the registry does not carry. It is the card's accessible name, so it is never optional in practice.
- Keep each quotation to one or two sentences, verbatim, without typed quotation marks — `quote` draws its own glyph. The panel holds the tallest quotation's height for all of them and floors the attribution and the `actions` control, so one much longer quotation opens a wide gap under every shorter one.
- Keep each quotation readable inside `autoPlayInterval`; raise the interval before shortening a verbatim quotation, and turn `autoPlay` off when the band sits beside other moving content.

## Usage

```vue
<script setup>
import Button from '@aziontech/webkit/button'
import QuoteTabs from '@aziontech/webkit/quote-tabs'
</script>

<template>
  <QuoteTabs
    aria-label="Client stories"
    :items="[
      {
        logo: '/logos/magalu-color.svg',
        clientName: 'Magalu',
        text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology at Magalu'
      },
      {
        mark: 'dafiti',
        text: 'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
        name: 'Dafiti',
        jobTitle: 'Retail'
      },
      {
        logo: '/logos/itau-color.svg',
        clientName: 'Itaú',
        shape: 'compact',
        text: 'Itaú serves its digital channels from the edge.',
        name: 'Itaú',
        jobTitle: 'Financial services'
      }
    ]"
  >
    <template #actions>
      <Button
        kind="secondary"
        label="See success stories"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
        href="/success-stories"
      />
    </template>
  </QuoteTabs>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `QuoteTabsItem[]` | `[]` | false | The clients, in wall order; each item is `{ logo?, mark?, clientName?, shape?, text, name?, jobTitle?, photo? }` — the URL of the client's colour logo, the registry name of its one-ink mark, its name in prose, how tall its mark sits on the card, the quotation, who said it, their role and their likeness. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the wall of client cards. |
| `autoPlay` | `boolean` | `true` | false | Advances to the next client on a timer; pauses under the pointer or keyboard focus, restarts its count on a selection, and never runs under reduced motion. |
| `autoPlayInterval` | `number` | `5000` | false | Milliseconds each client is held before the band advances. |
| `showProgress` | `boolean` | `true` | false | Advances a hairline along the quotation panel's bottom edge while the timer runs. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `number` | `0` | `update:modelValue` | Index of the selected client, two-way through `defineModel`; left unbound the band keeps its own selection, starting on the first card. A click, an arrow key or the timer writes the new index back. |

## Events

_No plain events — selection flows through `v-model`._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `actions` | — | A trailing control under the featured quotation's attribution, such as a secondary `Button` to the success stories; rendered in `quote`'s own `actions` area, the same for every client. |

## States

- Visual states: `default`, `hover`, `focus-visible` on each card
- The band is two regions: the quotation panel on top, drawn as a `frame-box` with all four corner marks and only its bottom rule — the seam it shares with the wall of client cards below it. The band draws no outer frame of its own, exactly like `logo-wall`: the wall's flush grid pulls its right and bottom rules onto whatever frames the band, so a page places it inside its framed column (a `frame-box` with `borders="y"`, the column supplying the sides) and every edge is a single hairline, never doubled against the page's own rules
- The wall is a `card-grid` of framed cells at 3:2, three columns below `lg` and six from `lg`, drawn from `--border-default`; each cell is one card
- `data-active` marks the selected card; it sits on `--bg-selected` while the others rest on the plain surface
- Hover paints `--bg-hover` as a `::before` ghost layer over a resting card; the selected card shows no ghost. A card reveals no link label — clicking it selects, it never navigates
- The panel renders every item's `quote` with `kind="highlight"` in one shared grid cell; only the selected one is visible, and the others are transparent (`opacity-0`), `inert` and `aria-hidden`. The panel is therefore always as tall as the tallest quotation, so its height never changes between clients or during a change. They are hidden by opacity, never by `visibility: hidden`: a registry mark's SVG clip path is resolved by id from its first copy in the document, and a clip path inside a `visibility: hidden` subtree clips every copy of that mark to nothing
- The visible quotation fills that held height, and `quote` gives the slack to the quotation itself, so the attribution and the `actions` control sit on the same line for every client and a change of client never moves them
- `data-direction` on the panel is `forward` when the new card sits after the previous one in the wall and `back` when it sits before it; an arrow key that wraps keeps its own direction (`ArrowRight` from the last card to the first is `forward`, `ArrowLeft` from the first to the last is `back`). It decides which side the quotations travel to and from
- `data-autoplay` marks the root while the timer runs. It runs when `autoPlay` is on, the band has more than one client and the reader has not asked for reduced motion; it pauses while the pointer rests on the band or keyboard focus (`:focus-visible`) is inside it, and resumes on leave
- Every change of client restarts the count, whether the timer, a click, an arrow key or a bound `modelValue` made it; clicking the selected card restarts it too, and a click keeps the timer running with the pointer still on the band. The timer moves to the next card and wraps from the last to the first, travelling `forward`
- While the timer runs and `showProgress` is on, a `--primary` hairline grows along the panel's bottom edge, across the panel's full width rather than the quotation's padded column, and reaches the right edge as the band advances; it is decorative and `aria-hidden`
- During a change the leaving quotation travels out first and the entering one travels in once it has gone, both within that same cell, so two quotations never overlap and the wall below never moves
- A client's mark resolves in order: its `logo`, drawn as-is in its own colours; else its registry `mark`, drawn in one ink; else its name, in heading type, on the card and in the panel alike
- `shape` on a card's mark is `wide` (the default, 20px tall) or `compact` (28px), matching `logo-wall`
- When the `actions` slot is filled, its content is rendered under the featured quotation's attribution through `quote`'s `actions` slot, and again in each stacked copy so the held height includes it; the stacked copies stay `inert` and `aria-hidden`, so the control is reachable once. When the slot is empty, no actions area is drawn
- `modelValue` past the last item is clamped to the last card, so the band always shows a quotation while it has items
- Empty: when `items` is empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| selection change — quotation entering, after the leaving one has gone | `transition-[translate,opacity] duration-moderate-01 ease-productive-entrance`, from one `--spacing-xl` to the right (`forward`) or left (`back`) at zero opacity | `moderate-01` (150ms) + `productive-entrance` | `motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:translate-x-0` (swaps instantly) |
| selection change — quotation leaving | `transition-[translate,opacity] duration-moderate-01 ease-productive-exit`, to one `--spacing-xl` to the left (`forward`) or right (`back`) at zero opacity | `moderate-01` (150ms) + `productive-exit` | `motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:translate-x-0` (swaps instantly) |
| selection change (card) | `transition-colors duration-moderate-01 ease-out` | `moderate-01` (150ms) | `motion-reduce:transition-none` |
| autoplay progress | `transition-[width] duration-fast-01 ease-linear` on the hairline, its width set from the elapsed share of `autoPlayInterval` | `fast-01` (70ms) + linear | `motion-reduce:transition-none` (and the timer never runs under reduced motion, so no hairline is drawn) |
| hover (card) | `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` on the ghost layer | `fast-02` (110ms) + `productive-entrance` | `motion-reduce:before:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel surface | `var(--bg-canvas)` |
| panel frame, corner marks and card hairlines | `var(--border-default)` |
| resting card surface | `var(--bg-surface)` |
| selected card surface | `var(--bg-selected)` |
| hovered card surface (ghost layer) | `var(--bg-hover)` |
| one-ink mark | `var(--text-default)` |
| progress hairline | `var(--primary)` |
| typography (mark fallback) | `.text-heading-xxs` |
| spacing (card inset, x) | `var(--spacing-md)` |
| spacing (panel inset, every side) | `var(--spacing-xl)` |
| spacing (quotation travel) | `var(--spacing-xl)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each card and the panel carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`, inset so the grid's hairlines never clip the ring.
- Keyboard map: `Tab` reaches the selected card only (roving tabindex); `ArrowRight` / `ArrowLeft` move to the next / previous card in wall order and select it, wrapping at either end; `Home` / `End` select the first / last card; `Shift+Tab` from the wall moves back to the panel.
- ARIA: only the selected quotation is exposed; the others in the panel's cell are `inert` (so never focusable or reachable) and `aria-hidden` (so never announced). The wall is a `role="tablist"` named by `ariaLabel`; each card is a native `<button role="tab">` named by the client's name through `aria-label`, with `aria-selected` and `aria-controls` pointing at the panel; the card's artwork is decorative (`alt=""` or `aria-hidden`), since the name is its label. The panel is `role="tabpanel"` with `tabindex="0"` and `aria-labelledby` pointing at the selected card; its colour logo carries the client name as its alternative text, and a one-ink mark is `aria-hidden` with the quotation's attribution naming the company. Ids come from `useId()`. The leaving quotation stays `aria-hidden` while it travels out, so a screen reader reads one quotation.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): colour logos are logotypes, exempt under WCAG 1.4.11, and are drawn as the consumer supplies them; the name fallback is `var(--text-default)` on both card surfaces.
- `motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:translate-x-0` on the travelling quotation (the zero duration is what lets the out-in swap finish at once instead of waiting out the leave), `motion-reduce:transition-none` on the card surface and `motion-reduce:before:transition-none` on its ghost layer; under reduced motion the band never advances on its own.
- Pause (WCAG 2.2.2): the timer stops while the pointer rests on the band or keyboard focus is inside it, so a reader holds a quotation by pointing at it or reaching the band with `Tab`; `autoPlay` off removes the movement entirely. The panel is not a live region, so a change the timer makes is never announced over the reader.
- Touch target ≥40×40 px: each card is a full 3:2 cell of the wall, well above 40px on every breakpoint.

## Stories (Storybook)

- Default — with a secondary `Button` in the `actions` slot
- Fallback — a client with neither a colour logo nor a registered mark, so its card and its panel write the client's name as the mark (justified: the wordmark is a rendered state no prop toggles, and it is what lets a page add a client before its artwork lands)

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
