---
name: doc-prompt
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 3c66a5a919cee561da365cf8be282a455e95735b67b78121387185631c3d3bc5
created: 2026-08-22
last_updated: 2026-08-22
---

# DocPrompt — Component Spec

## Purpose

DocPrompt renders text the reader is meant to **run, not read** — the block a documentation page uses when the next step is "say this to your agent". It is the one component in this layer whose payload is addressed to a machine, so it is the one that ships an affordance for handing it to one: a copy control wired to the exact string on screen. It is deliberately **not** a code block — a prompt is a sentence, so it carries no language, no gutter, and no syntax highlighting, and it is set in the mono face only to say "this is the literal text, copy it as it stands".

## When to use

- A documentation step, onboarding screen, or empty state whose next action is "paste this into your agent".
- A short list of example prompts a reader can try, under a heading that has already said what they are.
- Anywhere a literal string must be copied verbatim and the reader is the one who decides where it goes.

## When NOT to use

- The payload is source code, a shell command, or configuration → use a code viewer, which owns languages, gutters, and highlighting; a prompt has none of them.
- The payload is a short inline token (a key, a flag, a variable name) → use `kbd` or inline code in prose.
- The block needs to run the prompt itself, or route it to a named vendor → out of scope; this component only puts the text on the clipboard.

## Related

- `copy-button` — the control DocPrompt composes. Reach for it directly when the value being copied has no block of its own.
- `DocCallout` — draws attention to prose the reader should _read_; DocPrompt is for text the reader should _use_.
- `DocProse` — the contract around it. The prompt marks itself `data-doc-chrome`, so prose rules stop at its edge, and `data-doc-block`, so it takes the block rung of the ladder.

## Best practices

- Write the prompt once, in the default slot. It is both the visible text and the copied string, so the two cannot drift.
- Give `title` only when the surrounding page has not already said what the block is. Three one-line prompts under a "Prompts to try" heading want the bare shape.
- Use `kind="line"` for a single instruction and `kind="block"` for a priming paragraph. A one-sentence prompt broken across three lines reads as three instructions.
- Keep the prompt in the imperative and free of placeholders the reader must fill silently — if a value must be substituted, name it in the prose above.

## Usage

```vue
<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <DocPrompt title="AI Assistant">
    Deploy this repository to Azion and show me the edge URL when it is live.
  </DocPrompt>
</template>
```

## Props

| Prop    | Type                | Default            | Required | JSDoc                                                                          |
| ------- | ------------------- | ------------------ | -------- | ------------------------------------------------------------------------------ |
| `kind`  | `'block' \| 'line'` | `'block'`          | false    | Wrapping paragraph capped at four lines, or one line that scrolls sideways.    |
| `title` | `string`            | `''`               | false    | What the block is, in a word or two. Renders as a titled row above the prompt. |
| `icon`  | `string`            | `'pi pi-sparkles'` | false    | PrimeIcons class for the glyph beside the title.                               |
| `label` | `string`            | `''`               | false    | Fallback prompt text when the default slot is empty.                           |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                               |
| --------- | ----- | --------------------------------------------------------------------------------------------------- |
| `default` | —     | The prompt itself: one or more sentences of literal text. Also the string the copy control carries. |

## States

- Visual states: `default`, `focus-visible` (on the `line` shape, which is a scroll container)
- `data-kind` mirrors the `kind` prop: `block` | `line`
- `data-expanded` — present on the prompt text when a capped `block` has been opened by the reader
- `data-capped` — present on the root when a `block` prompt is taller than its four-line cap; absent when it fits, so a prompt that fits earns no disclosure control
- `data-overflow` — on the `line` shape: `start` | `end` | `both`, whichever edge has text scrolled behind it; absent when the line fits
- `data-doc-block` + `data-doc-chrome` are the `DocProse` contract (block rung; prose stops here)
- Empty: an empty slot with an empty `label` renders the shell with no prompt text and no copy control

## Motion & Animations

| Trigger                         | Animation / Transition                                                                                                                                                                                                                 | Token (see `.claude/docs/DESIGN.md` § Animations)                                                                            | Reduced-motion fallback                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| disclosure open/close (`block`) | `transition-[max-height]` between the four-line cap and the prompt's own measured content height (pin the current height, commit it across two `requestAnimationFrame`s, set the far end, hand the cap back to CSS on `transitionend`) | `duration-moderate-02` · `ease-productive-entrance` opening / `ease-productive-exit` closing (DESIGN.md § Motion primitives) | skipped entirely under `prefers-reduced-motion` (the height snaps); `motion-reduce:transition-none` |
| cap fade leaving (`block`)      | `transition-opacity` on the bottom gradient, so it leaves with the move it belongs to instead of being cut on the first frame                                                                                                          | `duration-moderate-01` · `ease-productive-exit` (DESIGN.md § Motion primitives)                                              | `motion-reduce:transition-none`                                                                     |

<!-- The disclosure is a measured height, not a keyframe: one end is a real length
     (the cap) and the other is the prompt's own content height — a runtime fact,
     different on every instance and every viewport — so no catalogued `animate-*`
     could be right for more than the one prompt it was authored against. The
     timing and the curves are the catalogued tokens. -->

## Tokens

| Region                      | Token (DESIGN.md)       |
| --------------------------- | ----------------------- |
| root surface                | `var(--bg-surface)`     |
| root border                 | `var(--border-default)` |
| root shape                  | `var(--shape-card)`     |
| title typography            | `.text-label-md`        |
| title ink                   | `var(--text-default)`   |
| title glyph ink             | `var(--primary)`        |
| prompt typography           | `.text-body-code-sm`    |
| prompt ink                  | `var(--text-default)`   |
| prompt row surface (titled) | `var(--bg-canvas)`      |
| divider under the title row | `var(--border-default)` |
| spacing.x                   | `var(--spacing-md)`     |
| spacing.y                   | `var(--spacing-sm)`     |
| gap                         | `var(--spacing-sm)`     |
| fade extent                 | `var(--spacing-lg)`     |
| line shape                  | `var(--shape-elements)` |
| focus ring                  | `var(--ring-color)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

<!-- `text-body-code-sm` — the code face's body register (mono family, xs size, relaxed
     line height) — already ships in the theme on this stack and is documented in
     DESIGN.md § Available text styles. The `text-label-code-*` set collapses its line
     height entirely, correct for one-row-per-line code (the row's own padding does the
     spacing) and wrong for a mono paragraph that wraps, whose lines then touch.
     Line-height overrides are forbidden in components (`.claude/rules/styling.md`), so
     the register lives in the token, not in a class override here. -->

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on the `line` shape
- Keyboard map: the `line` shape takes a tab stop because it is a scroll container — a scroll container holding no focusable child is unreachable by keyboard (and an axe `scrollable-region-focusable` violation); arrow keys then scroll it. The `block` shape scrolls nothing, so it takes no tab stop. `Tab` reaches the disclosure control and the copy control; `Enter` / `Space` activate them.
- ARIA: the full prompt text is in the DOM in every state, so the cap hides nothing from a screen reader — the disclosure is a visual convenience and the state it reports is the change in its own label (`Show more` / `Show less`). Every fade gradient is `aria-hidden="true"`; the title glyph is `aria-hidden="true"`. The copy control carries its own accessible name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the prompt is `--text-default`, not the muted body ink, because the prompt IS the payload and everything around it is chrome
- `motion-reduce:transition-none` on both animated states; the disclosure move is skipped rather than shortened
- Touch target ≥40×40 px on both controls (both are `size="small"` webkit controls, which meet the floor)

## Stories (Storybook)

- Default
- Kinds — composite story rendering `block` and `line` side by side. This is the component's only variant axis; it stands in for the template's `Types` story.
- Capped — a `block` prompt long enough to earn its disclosure control, which is the state the four-line cap exists for and the only one that renders the `Show more` button. Justified as a state story: `capped` is measured at runtime, not a prop, so no args delta can reach it from `Default`.
- Bare — no `title`, the shape a "Prompts to try" list uses, where the heading above has already said what the prompts are. Justified: the bare anatomy (no title row, no divided surface) is a rendered-structure variant a `Default` args delta cannot show beside the titled shape.

<!-- No `Sizes` story: the component has no `size` prop. No `Loading` / `Disabled`
     stories: it has neither prop. -->

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
