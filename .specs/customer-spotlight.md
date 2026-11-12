---
name: customer-spotlight
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 514745c7dadef996cadb2e28cd4c1d68f55051c669cab377f298cdc3009b446e
created: 2026-11-11
last_updated: 2026-11-12
---

# CustomerSpotlight — Component Spec

## Purpose

A row of client cards, each painted in the client's own colours with its reversed logo; the hovered or focused card opens to reveal its story line and a "Read story" cue, and the whole card links to the success story. Below the large breakpoint the cards stack and stay open. From the design sample's site `CustomerSpotlight`.

## When to use

- Three or four flagship customer stories on a landing page.

## When NOT to use

- For many clients — use `ClientMosaic` or `LogoWallQuote`.
- For a quotation — use `ClientQuotes` or `LogoWallQuote` `kind="quote"`.

## Related

- `ClientMosaic`, `ClientQuotes`, `LogoWallQuote`.
- `FrameBox`.

## Best practices

- Three or four cards.
- Use the client's reversed (white) logo; the face paints the client's brand colours.
- Leave `brand` out for a client the client registry knows (`clientBrand(name)` from `@aziontech/webkit/assets/client-registry`): the card reads its colours by `name`. Add a missing client to the registry rather than writing its hex colours into the page. Pass `brand` only for a one-off client the registry does not carry; a card with neither paints a black face.
- One sentence per story line.

## Usage

```vue
<script setup>
  import agibankLogo from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'
</script>

<template>
  <CustomerSpotlight
    :cards="[
      {
        name: 'Agibank',
        logo: agibankLogo,
        href: '/customers/agibank',
        description: 'Agibank moved its digital bank to a platform that scales with every campaign.'
      }
    ]"
  />
</template>
```

## Props

| Prop         | Type                      | Default | Required | JSDoc                                                                                                                                               |
| ------------ | ------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cards`      | `CustomerSpotlightCard[]` | `[]`    | false    | The cards, in reading order; each is `{ name, logo, logoWidth?, href, description, brand? }`; `brand` (`{ base, glow }`) defaults to the client registry's colours for `name`. A card opens while hovered or focused. |
| `ariaLabel`  | `string`                  | `''`    | false    | Accessible name of the list; empty uses the built-in "Customer stories".                                                                            |
| `storyLabel` | `string`                  | `''`    | false    | Label revealed under the description while the card is open; empty uses the built-in "Read story".                                                  |
| `anchor`     | `string`                  | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                                            |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without cards.
- Each item carries `data-state=open|closed`; one is open at a time on large screens.

## Motion & Animations

The logo rises and the story panel slides in with `duration-moderate-02 ease-productive-entrance`; every transition has `motion-reduce:transition-none`.

## Tokens

| Region      | Token (DESIGN.md)                                  |
| ----------- | -------------------------------------------------- |
| story panel | `var(--bg-canvas)`                                 |
| copy        | `.text-body-lg`, `var(--text-default)`             |
| cue         | `.text-overline-md`                                |
| frame       | From `FrameBox`                                    |
| focus       | `var(--ring-color)`                                |
| face        | Client colours passed as data (content, not theme) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A list of links; each link name is "<story label>, <client>: <story line>", so the logo image is decorative (`alt=""`).
- Focus opens the card the same way hover does; the focus ring is drawn inside the card.
- Contrast of the story line: `--text-default` on `--bg-canvas`.

## Internationalization

| Key                       | English source     | Override prop |
| ------------------------- | ------------------ | ------------- |
| `customerSpotlight.list`  | `Customer stories` | `ariaLabel`   |
| `customerSpotlight.story` | `Read story`       | `storyLabel`  |

- Client names, logos and story lines are content passed through `cards`.

## Right-to-left

- Layout: logical utilities; the first card is flush at the inline start.
- Icons: `pi-arrow-up-right` is mirrored.
- Keyboard: unchanged.

## Responsive

- Below large: cards stack, open, with the logo above the story line.
- From large: one row, open on hover or focus.

## Performance

- One `ResizeObserver` for the panel heights.
- Bundle budget: 5.5 KB for `./customer-spotlight` gzip in `.size-limit.json` (measured + ~0.5 KB).

## Examples

- Default — four client cards.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
