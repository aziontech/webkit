---
name: doc-prose
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 251aa955229c7e4ee3bc908f55cdb7ac789e94895de80c1abbb19e51402b7424
created: 2026-08-21
last_updated: 2026-08-28
---

# DocProse — Component Spec

## Purpose

The typography contract every documentation page inherits. A markdown or MDX pipeline compiles text to plain semantic HTML — `h2`, `p`, `ul`, `table`, `a`, `code` — and this container is what gives that HTML the Azion type scale, the semantic colors and the vertical rhythm, so an author writes markdown and never a class. It styles **descendants** rather than itself, so it works the same over any renderer's output, a slot of hand-written markup, or raw HTML from a CMS.

## When to use

- Wrapping the body of a documentation or changelog page, whatever produced its HTML.
- Giving authored prose inside a documentation block (a step's body, a tab's panel) the same type contract as the page around it.

## When NOT to use

- To cap the reading column — `DocProse` has no measure of its own. The consumer sets the width with `.layout-column-content` (`--layout-measure-content`, 876px).
- To style a webkit component's internals. Those are chrome and are excluded by design; restyle nothing from here.
- For a single run of body copy in an application screen — use the `text-body-*` tokens directly.

## Related

- `DocPageHeader` — the page masthead above this container; its `h1` is chrome, so authored content starts at `h2`.
- `DocCallout` / `DocCard` / `DocSteps` — blocks that sit inside prose and mark themselves `data-doc-chrome` so the contract stops at their edge.

## Best practices

- Mark a documentation component's root `data-doc-chrome` so prose rules stop there, and `data-doc-block` so it takes the block rung of the ladder. A callout is both.
- Do not add per-page overrides. If a rung is wrong, it is wrong for every page and belongs in this contract.
- Keep the consumer's column cap outside this component; it is typography, not layout.

## Usage

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <article class="layout-column-content">
    <DocProse>
      <h2>Deploy an application</h2>
      <p>Templates are ready-made projects that go live in a few clicks.</p>
      <ul>
        <li>A workload bound to its own domain</li>
        <li>A certificate issued and renewed for you</li>
      </ul>
    </DocProse>
  </article>
</template>
```

## Props

| _none_ | — | — | — | Public API is slots-only. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                             |
| --------- | ----- | ----------------------------------------------------------------- |
| `default` | —     | The document body: markdown-rendered HTML or hand-written markup. |

## States

- Visual states: `default`, plus `hover` and `focus-visible` on descendant links
- No `data-state`: the container is static and holds no state of its own
- Reads two descendant contracts: `data-doc-chrome` (every prose rule stops there) and `data-doc-block` (takes the block rung of the ladder)

## Motion & Animations

| Trigger                     | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| descendant link hover/focus | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                         | Token (DESIGN.md)                                                |
| ------------------------------ | ---------------------------------------------------------------- |
| typography (h1)                | `.text-heading-2xl` / `sm:.text-heading-xl`                      |
| typography (h2)                | `.text-heading-xl` / `sm:.text-heading-md`                       |
| typography (h3)                | `.text-heading-lg` / `md:.text-heading-sm`                       |
| typography (h4)                | `.text-heading-xs`                                               |
| typography (body, list item)   | `.text-body-prose-md`                                            |
| typography (inline code)       | `.text-label-code-sm`                                            |
| text                           | `var(--text-default)`                                            |
| text (blockquote, list marker) | `var(--text-muted)`                                              |
| link                           | `var(--text-link)`                                               |
| link.hover                     | `var(--text-link-hover)`                                         |
| surface (inline code)          | `var(--bg-hover)`                                                |
| border (inline code, hr)       | `var(--border-default)`                                          |
| border (blockquote rule)       | `var(--border-strong)`                                           |
| shape (inline code)            | `var(--shape-flat)`                                              |
| spacing (section step)         | `var(--spacing-14)` (open, 56) / `var(--spacing-12)` (close, 48) |
| spacing (block, indent)        | `var(--spacing-lg)`                                              |
| spacing (base rung)            | `var(--spacing-md)`                                              |
| spacing (tightened rungs)      | `var(--spacing-sm)` / `var(--spacing-xs)`                        |
| ring                           | `var(--ring-color)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: descendant links take `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`.
- Keyboard map: `Tab` moves through descendant links; the container itself is not focusable.
- ARIA: none — the container adds no role. The semantics are the author's HTML (`h2`, `ul`, `blockquote`), which is the point of the contract.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons). All prose ink is `--text-default`; `--text-muted` (3.95:1 on surface, under AA) survives only where the quieter voice is the point — a blockquote's body and a list's marker glyphs.
- `motion-reduce:transition-none` on the descendant link transition.
- Touch target: not applicable; the container is not interactive.

## Stories (Storybook)

- Default — the full ladder over semantic HTML: headings, paragraphs, links, inline code, both list kinds, a table, a blockquote, an `hr` and a fenced block. The markup is hand-written, which is also the proof that the contract is not tied to any renderer.
- Chrome boundary — the same prose wrapping a subtree marked `data-doc-chrome`, whose headings and paragraphs keep their own styling. Justified in writing here because "styles descendants, but stops at a component's edge" is the component's other core promise, and it is invisible in the Default story.

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
