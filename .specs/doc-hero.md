---
name: doc-hero
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 12bed284a14a35181c20ee4af5333d9f521110424b1b9415e6b8c09859f7348a
created: 2026-11-12
last_updated: 2026-11-12
---

# DocHero — Component Spec

## Purpose

The masthead of a documentation home: a display-size `h1`, a deck capped at a readable measure, an action row (the primary `Get started`, then `CopyPromptButton`) and one muted note under it that says what the prompt does. It carries the air the home needs — `--spacing-xxl` above and below, `--spacing-xl` between the deck and the actions — so the front door reads as a front door and not as one more article. An article page uses `DocPageHeader` instead.

## When to use

- The top of a documentation home or a docs section landing (`shells/documentation`, variant `Landing`).

## When NOT to use

- On an article or reference page → use `DocPageHeader` (breadcrumb, last updated, page actions).
- On the marketing site → use `Hero` or a page section.

## Related

- `DocPageHeader` — the article masthead.
- `CopyPromptButton` — the second action of the row.
- `DocAgentCard` — the agent card that usually opens the first section under the hero.

## Best practices

- Keep the title short (`Welcome to Azion Docs`) and the deck to one or two sentences.
- Put `Button kind="primary" size="large"` first and `CopyPromptButton` second in `#actions`; say what the prompt does in `#note`.
- Do not wrap it in `DocProse`; it is page chrome (`data-doc-chrome`).

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocHero from '@aziontech/webkit/doc-hero'
</script>

<template>
  <DocHero
    title="Welcome to Azion Docs"
    description="We make every application fast and reliable."
  >
    <template #actions>
      <Button
        label="Get started"
        size="large"
        href="#"
      />
      <CopyPromptButton value="Set up the Azion CLI and link this project." />
    </template>
    <template #note>The prompt hands your coding agent the CLI and live docs.</template>
  </DocHero>
</template>
```

## Props

| Prop          | Type     | Default | Required | JSDoc                                                                    |
| ------------- | -------- | ------- | -------- | ------------------------------------------------------------------------ |
| `title`       | `string` | `''`    | false    | The page title, set at display size as the page's `h1`.                  |
| `description` | `string` | `''`    | false    | The deck under the title: what the docs cover, in one or two sentences.  |

## Events

_none_

## Slots

| Slot      | Props | Notes                                                                 |
| --------- | ----- | --------------------------------------------------------------------- |
| `title`   | —     | Replaces the title text, for a title that is more than a string.      |
| `default` | —     | Replaces the description text.                                        |
| `actions` | —     | The action row: the primary `Button` first, then `CopyPromptButton`.  |
| `note`    | —     | One muted line under the actions that says what the prompt does.      |

## States

- Static; renders only the parts it receives (no deck, no action row, no note when empty).
- Not applicable: `hover`, `focus`, `disabled`, `loading`, `empty`, `error`, `open`/`closed`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
| ------- | ---------------------- | ------------------------------------------------- | ----------------------- |
| _none_  | —                      | —                                                 | —                       |

## Tokens

| Region   | Token (DESIGN.md)                                                                   |
| -------- | ----------------------------------------------------------------------------------- |
| title    | `.text-heading-2xl`, `var(--text-default)`                                          |
| deck     | `.text-body-lg`, `var(--text-muted)`, capped at `var(--container-xl)`               |
| note     | `.text-body-sm`, `var(--text-muted)`                                                |
| rhythm   | `var(--spacing-xxl)` above (from `sm`) and below, `var(--spacing-md)` title to deck, `var(--spacing-xl)` deck to actions, `var(--spacing-lg)` actions to note, `var(--spacing-sm)` between actions |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A `<header>` holding the page's single `h1`; the deck and note are paragraphs.
- No interactive parts of its own; the actions bring their own roles and focus.
- Contrast: muted deck and note ≥ 4.5:1 on the canvas in both themes.

## Internationalization

| Key    | English source | Override prop |
| ------ | -------------- | ------------- |
| _none_ | —              | —             |

- All text is content passed in.

## Right-to-left

- Layout: block flow and `gap-` only; the action row starts at the inline start.

## Responsive

- The title steps 30 → 36 → 48 px with `.text-heading-2xl`; the top space is `--spacing-xl` on a phone and `--spacing-xxl` from `sm`.
- The action row wraps; at 390 px `CopyPromptButton` drops under `Get started`.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 1 KB gzip for `./doc-hero` in `.size-limit.json`.
- Runtime budget: none; static.

## Examples

- Default — the docs-home masthead with `Get started`, `CopyPromptButton` and the note.
- Title only — `title` alone, for a section landing with no actions.

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
