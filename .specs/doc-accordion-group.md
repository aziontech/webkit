---
name: doc-accordion-group
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 1c3fbf87e75e99ab8827ddcaf8d718cdc7b8dae1d4b4f9835e0d9a6b31c76ebc
created: 2026-11-11
last_updated: 2026-11-11
---

# DocAccordionGroup — Component Spec

## Purpose

The FAQ and "expand for detail" block of a documentation page. It reads the `title` of each `DocAccordionItem` child to build the triggers and renders the child body in the panel, so an author writes only titles and prose. It always ships as a card (surface, outer rule, radius) so a run of rows reads as one closed group in an open prose column. Built on `Accordion` at `size="large"`.

## When to use

- A list of questions with answers at the end of a guide.
- Optional detail that would interrupt the main path of a page (edge cases, troubleshooting).

## When NOT to use

- For steps the reader must follow in order — use `DocSteps`.
- For alternative paths through the same instruction — use `DocTabs`.
- Inside an application screen — use `Accordion` directly.

## Related

- `DocAccordionItem` — the entry it reads.
- `Accordion` — the design-system surface it renders on.
- `Faq` — the marketing FAQ band.

## Best practices

- Write each title as the full question the reader would ask.
- Keep answers short; link out for anything longer than a few paragraphs.
- Open at most one entry by default.

## Usage

```vue
<script setup>
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordionItem title="Why does my first request miss the cache?">
      Each location warms up on its own first request.
    </DocAccordionItem>
  </DocAccordionGroup>
</template>
```

## Props

| Prop   | Type         | Default     | Required   | JSDoc |
| ------ | ------------ | ----------- | ---------- | ----- |
| `type` | `'single' \\ | 'multiple'` | `'single'` | false | Whether one or several entries can be open at once. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                                                              |
| --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The `DocAccordionItem` children, in order. Each child's `title` and `defaultOpen` are read; its body is rendered inside the panel. |

## States

- Each row mirrors `Accordion` `data-state=open|closed`.
- The last row drops its own bottom rule while closed so it does not double the card edge.
- `data-doc-block` puts the group on the block rung of `DocProse`.

## Motion & Animations

The panel height transition comes from `Accordion` and is off under reduced motion.

## Tokens

| Region        | Token (DESIGN.md)                         |
| ------------- | ----------------------------------------- |
| surface       | `var(--bg-surface)`                       |
| border        | `var(--border-default)`                   |
| shape         | `var(--shape-card)`                       |
| trigger type  | `.text-heading-xs`                        |
| panel padding | `var(--spacing-sm)` / `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Each trigger is a button inside an `h3`, with `aria-expanded` and `aria-controls` from `Accordion`.
- Keyboard: `Tab` between triggers, `Enter`/`Space` toggles (from `Accordion`).
- The focus ring is drawn inside the button (`ring-inset`) so the card clipping does not cut it.
- Contrast: `--text-default` on `--bg-surface` in both themes.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Responsive

- Fills its column; triggers wrap with `text-wrap-style: pretty` so a wrapped question keeps its chevron at the inline end.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 14.2 KB gzip for `./doc-accordion-group` in `.size-limit.json` (Accordion included).
- Heavy parts: none.

## Stories (Storybook)

- Default — three questions, the first open.
- Multiple — `type="multiple"` with two entries open.

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
