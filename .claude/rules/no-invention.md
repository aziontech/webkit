# Rule: no invention

You are a transcriber, not an author. The spec at `.specs/<name>.md` is the contract. The `.vue`, `package.json`, exports entry, and Storybook story you produce must match the spec **1-to-1** — nothing extra, nothing missing.

## Hard prohibitions

1. **Do not add props** that are not in the spec's Props table.
2. **Do not add events** that are not in the spec's Events table.
3. **Do not add slots** that are not in the spec's Slots table.
4. **Do not add sub-components** that are not in the spec's Sub-components section.
5. **Do not invent imports.** Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve. Every npm package must be installed.
6. **Do not create composables, utilities, or sibling components** unless the task explicitly tells you to.
7. **Do not edit files outside the paths your task names.**
8. **Do not bring artifacts from outside this codebase as-is.** Migrating from another design system, Figma, Base UI/Reka UI/Radix/shadcn/PrimeVue examples, a previous repo, or any inherited `CONTRACT.md`/`README.md` requires **rewriting** to our conventions. See [`migration.md`](./migration.md).
9. **Do not introduce external libs for positioning or animation.** No `floating-ui`, `popper.js`, `tippy`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization. Use CSS + tokens + Vue primitives. Catalog: [`dependencies.md`](./dependencies.md).
10. **Do not improvise animations.** Every `animate-*` / `transition-*` class comes from the catalog. Every motion-bearing class pairs with `motion-reduce:*`. No component-local `@keyframes`. See [`tokens.md`](./tokens.md#animations--semanticanimationsjs).
11. **Do not add Figma references to Storybook stories.** No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.component`, no addon-designs links. The story documents the **component API and behavior**; the Figma file documents the design. They stay separate. See [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../docs/COMPONENT_REQUIREMENTS.md) § 13.x.
12. **Do not create CSS class presets in JavaScript** (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)` that only composes classes). Variants live on `data-*` attributes; styles live as Tailwind utilities on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See [`styling.md`](./styling.md).
13. **NEVER create anything outside the standard.** If the only way to satisfy a request is to deviate from our patterns, that's a spec problem — emit `BLOCKED:` and stop.

## What to do when the spec is incomplete

Emit a single line to stdout:

```
BLOCKED: <one-sentence reason>
```

Then exit with no writes. The orchestrator will surface the message to the user. Common reasons:

- `BLOCKED: spec lists no default for prop "kind" but the type is non-optional`
- `BLOCKED: spec references token .text-foo-md which is not in DESIGN.md`
- `BLOCKED: spec declares structure=composition but no Sub-components section`

## Why this rule exists

Previous runs scaffolded "helpful" extras: a `tone` prop nobody requested, a `useToast` composable nobody asked for, a `@aziontech/webkit/utils/slot` import that does not exist. Every such extra later became a removal task, a code review back-and-forth, or a broken build when a hook caught the phantom path.

Treat the spec as a sealed contract. If something is missing from the spec, fix the spec — not the code you are about to write.
