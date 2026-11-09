---
name: code-split
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: aa1c1344907c152d9193467787e2be303aec4cbe8bee3ead579f78d48f4580e2
---
# CodeSplit — Component Spec

## Purpose

The claim-beside-its-code band of a product page: a framed media split whose copy states the claim, with one or two large buttons under it, and whose media is a code sample on the pixelate texture, cut off by the frame's bottom rule. It is a page section — the site places it from a `{ _id: 'code-split', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `code-block` and `button`. One tab draws a filename bar; several draw a tab strip, and a tab that carries an `icon` shows that mark beside its label.

## When to use

- When the argument of a product page is a config file or a handler a developer can read, like Functions, Application Accelerator or AI Gateway.

## When NOT to use

- For a terminal session under a headline → use `cli-terminal`.
- For a run of capabilities, each with its own sample, pinned while the page scrolls → use `sticky-scroll-code`.

## Related

- `media-split` — the copy-beside-media band this section renders through.
- `code-block` — the tabbed code sample in the media cell.

## Best practices

- Keep the sample short enough to read in the cell; the frame cuts off whatever runs past it.
- Give every tab a `code`; a tab without one is skipped.
- Use `primaryAction` alone for one destination, and add `secondaryAction` only for a second, distinct one.

## Usage

```vue
<script setup>
import CodeSplit from '@aziontech/webkit/code-split'
</script>

<template>
  <CodeSplit
    title="From basic caching to advanced acceleration"
    description="Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content."
    copy-aria-label="Copy the cache settings sample"
    :code-tabs="[
      { label: 'cache-settings.json', value: 'cache-settings', language: 'json', code: '{ }', fileName: 'cache-settings.json', fileIcon: 'ai ai-json' }
    ]"
    :primary-action="{ label: 'Learn more', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `codeTabs` | `CodeSplitTab[]` | `[]` | false | The files of the code sample, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark drawn beside the tab label. A tab without `code` is skipped. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the sample's copy button; empty keeps the code block's own. |
| `primaryAction` | `CodeSplitAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. |
| `secondaryAction` | `CodeSplitAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the tab strip, copy button and buttons own their hover and focus states
- Empty: when `title` is empty the band renders nothing; when no tab carries `code` the media cell is left out
- One tab draws a filename bar, several draw a tab strip; a tab mark renders only when some tab carries an `icon`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| sample fill | `var(--bg-surface)` |
| sample rules | `var(--border-default)` |
| sample shape | `var(--shape-elements)` |
| sample shadow | `var(--shadow-sm)` |
| sample bleed | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `code-block` (tabs, copy button) and `button`.
- Keyboard map: `Tab` reaches the tabs, the copy button and the buttons; arrow keys move between tabs (owned by `code-block`); `Enter` follows a button.
- ARIA: the band is a plain `div`; the named landmark is `media-split`'s own section (labelled by `title`), so no second landmark is added; tab marks are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split`, `code-block` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the sample's line entrance is owned by `code-block`.
- Touch target ≥40×40 px: the large buttons.

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
