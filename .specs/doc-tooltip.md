---
name: doc-tooltip
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: e58149c28516bd67b80943f115b49091462a14537ed271a63461139b7ce51059
created: 2026-08-22
last_updated: 2026-08-22
---

# DocTooltip — Component Spec

## Purpose

The inline gloss: a term in running prose that carries its own definition, shown when the reader hovers or focuses it. The trigger is a real button marked with a dotted underline — the convention print has used for a glossed term for a century — so the definition is reachable by keyboard and not only by pointer.

## When to use

- A term a page uses in passing but cannot stop to define — a product name, an acronym, a unit.
- A definition worth one or two sentences, optionally closing on a "read more" link to the page that does stop to define it.

## When NOT to use

- To label an icon button or any control — that is `Tooltip`, the webkit hover hint: one line, on the contrast surface, `pointer-events-none`.
- For an aside the reader must not miss — a gloss is opt-in and easy to never open. Use `DocCallout`.
- For content longer than a couple of sentences, or anything with more than one link — that is a page, not a gloss.

## Related

- `Tooltip` — the webkit hover hint on a control. A different object: one line, unable to hold a link the reader must travel to. The name collision is why this component keeps the `Doc` prefix.
- `DocProse` — the prose this sits inside; the gloss marks itself `data-doc-chrome` so prose rules stop at its edge.
- `Link` — the call-to-action inside an interactive panel.

## Best practices

- Gloss the term where the reader first meets it, not every time it appears.
- Give `headline` the term itself and `tip` the definition; that pairing is also what names the panel for assistive tech.
- Add `cta` only with an `href`. A call to action needs somewhere to go, and its presence is what turns the panel into a dialog the reader can enter.

## Usage

```vue
<script setup>
  import DocTooltip from '@aziontech/webkit/doc-tooltip'
</script>

<template>
  <p>
    Deploys run on an
    <DocTooltip
      headline="Edge Application"
      tip="The build that runs at the edge, close to the people using it."
      cta="Read the guide"
      href="/docs/edge-application"
    >
      edge application
    </DocTooltip>
    built from your config.
  </p>
</template>
```

## Props

| Prop        | Type                          | Default | Required | JSDoc                                                              |
| ----------- | ----------------------------- | ------- | -------- | ------------------------------------------------------------------ |
| `tip`       | `string`                      | `''`    | false    | The definition shown inside the panel.                             |
| `headline`  | `string`                      | `''`    | false    | Bold lead-in above the definition — usually the term itself.       |
| `cta`       | `string`                      | `''`    | false    | Label for the panel's call-to-action link. Needs `href`.           |
| `href`      | `string`                      | `''`    | false    | Destination for the call-to-action link.                           |
| `placement` | `'top' \| 'bottom' \| 'auto'` | `'top'` | false    | Where the panel opens; `'auto'` picks the side with the most room. |
| `delay`     | `number`                      | `150`   | false    | Hover-open delay in milliseconds.                                  |
| `label`     | `string`                      | `''`    | false    | Fallback trigger text when the default slot is empty.              |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                              |
| --------- | ----- | -------------------------------------------------- |
| `default` | —     | The glossed term, rendered inline in the sentence. |

## States

- Visual states: `default`, `hover`, `focus-visible`, and `open`
- `data-state` on both the trigger and the panel: `open` | `closed`
- `data-interactive` is present only when the panel carries a call to action, which is what makes it a dialog rather than a tooltip
- `data-placement` on the panel records the side the placement composable resolved
- `data-doc-chrome` on both parts is the `DocProse` contract

## Motion & Animations

| Trigger                         | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| panel open                      | `animate-popup-scale-in`                  | semantic                                          | `motion-reduce:animate-none`    |
| panel close                     | `animate-popup-scale-out`                 | semantic                                          | `motion-reduce:animate-none`    |
| trigger underline on hover/open | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                            | Token (DESIGN.md)                                                |
| --------------------------------- | ---------------------------------------------------------------- |
| typography (headline, definition) | `.text-body-sm`                                                  |
| text (trigger, headline)          | `var(--text-default)`                                            |
| text (definition)                 | `var(--text-muted)`                                              |
| underline (rest)                  | `var(--border-strong)`                                           |
| underline (hover, open)           | `var(--text-default)`                                            |
| surface (panel)                   | `var(--bg-surface-raised)`                                       |
| border (panel)                    | `var(--border-default)`                                          |
| shadow (panel)                    | `var(--shadow-sm)`                                               |
| shape (panel)                     | `var(--shape-elements)`                                          |
| shape (trigger)                   | `var(--shape-flat)`                                              |
| measure (panel)                   | `var(--container-2xs)`                                           |
| spacing                           | `var(--spacing-sm)` / `var(--spacing-xs)` / `var(--spacing-xxs)` |
| ring                              | `var(--ring-color)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on the trigger.
- **The call to action splits the contract in two, and the component follows the shape it actually has.** With no CTA the panel is a real `role="tooltip"` and the trigger takes `aria-describedby`. With a CTA it is a small `role="dialog"`, announced through `aria-expanded` + `aria-controls`, and named by its headline (or by the definition when there is none) so it is never an unlabelled group. A `role="tooltip"` holding a link is a trap: the link is unreachable to anyone not using a mouse.
- Keyboard map: `Tab` focuses the term and opens the panel; from the trigger, `Tab` enters an interactive panel; `Tab` or `Shift+Tab` inside the panel closes it and returns focus to the term, so the next `Tab` simply moves on; `Escape` closes and returns focus; `Enter` / `Space` toggles.
- Closing and returning focus is one move, not two: focusing the term fires `focusin`, which is the event that opens the panel, so a naive close-then-focus re-opened it and trapped the reader on the glossed word. One focus event is deliberately made inert to break that loop.
- Leaving an interactive panel is deferred by one short beat, because the pointer has to cross the offset gap to reach the CTA; closing on the first `mouseleave` makes that link unclickable. A passive panel has nothing to travel to and closes at once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the trigger is inline text, sized by the prose around it; tapping toggles rather than hovers.

## Stories (Storybook)

- Default — one glossed term in a sentence, closed. The reader opens it.
- Kinds — the passive gloss and the interactive one side by side, which is the only way to see the two a11y contracts (`tooltip` vs `dialog`) against each other. Justified in writing here because the role change is the component's central decision and is invisible in a single story.

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
