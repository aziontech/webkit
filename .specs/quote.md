---
name: quote
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: c4beb0d077e1f1303d5b190989ddd8d35990cf365e23ef18a3de2269327ec2b6
created: 2026-09-22
last_updated: 2026-09-24
---

# Quote — Component Spec

## Purpose

A single customer testimonial: the quotation, who said it, and optionally the mark of the company they said it for. It is the smallest unit of social proof on a marketing page, and it is deliberately one quote — a wall of them is a layout built from several of these, not a prop on one.

Three registers, one component. `inline` is the quiet unit that sits inside a cell of a larger band — the mark small above the words, the attribution one muted line under them. `signed` is the band-sized register a product page gives a client: the mark above, the quotation at heading weight, and the attribution split into the speaker's name in the accent beside their role. `highlight` is the featured register — the quotation set largest, the speaker carried by their likeness (or their initials), and the company mark floated on a textured plate.

The register changes the weight and the arrangement, never the anatomy: every register is one `figure` holding one `blockquote` and one `figcaption`, so the quotation and its attribution stay paired at the depth HTML requires.

## When to use

- To carry one customer statement inside a marketing section.
- Whenever a claim the page makes is better made by the customer who verified it.
- As the repeated unit of a testimonial row or grid, one instance per quote — in `inline`, where every cell carries equal weight.
- In `signed`, as a product page's own client sentence, usually beside that page's client marks.
- In `highlight`, for the one quotation a page features above the others.

## When NOT to use

- For a measured figure rather than a statement → use `big-numbers`.
- For an inline aside or callout inside documentation → use `doc-callout`.
- For a dismissible or status message → use `message`.
- For a logo row with no quotation → compose the marks directly; a `quote` without `text` is not a logo wall.

## Related

- `big-numbers` — the numeric form of the same proof band.
- `card-grid` — the uniform grid a row of peer quotes is laid out on; `bento-grid` when one quote is given more weight than its neighbours.
- `avatar` — the person's likeness, composed by the `highlight` register.
- `overline` — the speaker's name in the `signed` register's attribution.

## Best practices

- Keep `text` to one or two sentences. A testimonial that needs a paragraph is a case study, and belongs behind a link.
- Give `name` the speaker and `job-title` their title and company. The registers set the two differently, so passing one joined string collapses that distinction.
- Quote verbatim. Do not add quotation marks to `text` — every register opens on the component's own quotation glyph, sized to that register's measure, so a typed `"` doubles it.
- Give `logo` a company mark only. A person's likeness is `photo`, which only `highlight` draws.
- Give `logo` a mark that carries its own contrast. It is drawn as-is — no filter, one URL, no per-theme swap — so a mark drawn in a single ink reads on one theme and disappears on the other. Use the `mark` slot instead when the mark is a component that owns its own theming.
- Put a trailing control in `actions` rather than beside the quote. The band floors it, which is what keeps a row of quotes aligned on their controls whatever each quotation's length.

## Usage

```vue
<script setup>
import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Quote
    text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
    name="Allan Monteiro"
    job-title="CISO & Head of Technology at Magalu"
    logo="/logos/magalu.svg"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `text` | `string` | `—` | true | The quotation itself, rendered as the `blockquote` body; overridden by the default slot. |
| `name` | `string` | `''` | false | Who said it — the attribution's lead, and the source of the initials fallback in `highlight`. |
| `jobTitle` | `string` | `''` | false | Their role and company, as one line — the attribution's second part. Named `jobTitle`, not `role`, because `role` is the ARIA attribute and a prop of that name reads as one to both tooling and the consumer. |
| `photo` | `string` | `''` | false | URL of the person's likeness, drawn by `highlight`; without one that register shows their initials. |
| `logo` | `string` | `''` | false | URL of the company mark; ignored when the `mark` slot is filled. |
| `logoAlt` | `string` | `''` | false | Alternative text for the mark; falls back to `jobTitle` when empty. |
| `kind` | `QuoteKind` | `'inline'` | false | Register of the quote: `inline` is the quiet unit inside a larger band, `signed` the band-sized client sentence, `highlight` the featured one. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Quotation body; replaces the `text` prop when provided. |
| `mark` | — | The company mark; replaces the image built from `logo`, for a mark that owns its own theming. |
| `actions` | — | A trailing control under the attribution, floored so a row of quotes aligns on it. |

## States

- Visual states: `default`
- Register: `data-kind="inline" | "signed" | "highlight"` on the root
- No mark is rendered when neither `logo` nor the `mark` slot is given, and the quotation moves up to lead the block
- In `highlight`, an absent `photo` falls back to the speaker's initials rather than an empty likeness
- Every register leads with the quotation glyph; it is decorative and `aria-hidden`, so the `blockquote`'s accessible text stays the quotation alone

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (quotation, `inline`) | `.text-body-lg` |
| typography (quotation, `signed`) | `.text-heading-md` |
| typography (quotation, `highlight`) | `.text-heading-lg` |
| typography (attribution, `inline`) | `.text-body-sm` |
| typography (attribution, `signed`) | `.text-overline-md` |
| typography (attribution, `highlight`) | `.text-body-md` / `.text-body-sm` |
| quotation text | `var(--text-default)` |
| quotation glyph | `var(--text-muted)` |
| attribution text (`inline`, `highlight` job title) | `var(--text-muted)` |
| attribution text (`signed` job title) | `var(--text-default)` |
| band rules | `var(--border-default)` |
| spacing (stack, `inline`) | `var(--spacing-sm)` |
| spacing (stack, `signed` / `highlight`) | `var(--spacing-xl)` |
| spacing (mark to quotation) | `var(--spacing-md)` |
| spacing (glyph to quotation, `inline`) | `var(--spacing-xs)` |
| spacing (glyph to quotation, `signed` / `highlight`) | `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the quote is static copy and holds no interactive control.
- Keyboard map: none of its own; the block contains no focusable element and is skipped by `Tab`.
- ARIA: the quotation is a real `blockquote` inside a `figure`, and the attribution is its `figcaption`, so the statement and its source are announced as one unit; the mark carries `logoAlt`, falling back to `jobTitle`, and is never left with an empty accessible name while it conveys the company.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the quotation is `var(--text-default)`; the attribution uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the block is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Stories (Storybook)

- Default
- Types — the `inline`, `signed` and `highlight` registers
- WithoutLogo — the quotation leading the block with no company mark (mutually-exclusive rendered state of the `logo` prop)

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
