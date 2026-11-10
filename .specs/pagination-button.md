---
name: pagination-button
category: data
structure: monolithic
status: implemented
spec_version: 1
checksum: 72c7769fab381d465cab8fb43236aa71bb0c2da6c8a94173964218286aa8ca94
created: 2026-11-10
last_updated: 2026-11-10
---

# PaginationButton — Component Spec

## Purpose

PaginationButton is one segment of the paginator's numbers strip: a 28px-tall native `button` that renders a page number, a Previous / Next chevron or an overflow ellipsis, selected by `kind`. It is the part `paginator` renders in data-driven mode and the one consumers compose by hand in composition mode, where it is reached as `Paginator.Button` (or imported standalone from `@aziontech/webkit/pagination-button`). It owns the segment's surface, current-page (`selected`) and `disabled` treatment, but not the strip's frame, border or the page state, which belong to the `paginator` root and the consumer.

## When to use

- Compose a custom page strip inside `paginator`'s default slot (composition mode), one button per Previous, page number, overflow and Next.
- Render the current page of a hand-wired paginator with `selected`, and the unavailable Previous / Next ends with `disabled`.

## When NOT to use

- You know the item count → pass `total` to `paginator` and bind `v-model:page`; it renders and wires every PaginationButton itself.
- The rows live in a data-driven `table` → set `paginated` on the table instead.
- The control is a previous / next link between documentation pages → use `doc-pagination`.
- It is a standalone action outside a paginator strip → use `button` or `icon-button`; this button has no radius or frame of its own except at the strip's ends.
- It is a "Load more" control at the end of a list → use `button`.

## Related

- `paginator` — the root that frames the strip and, in data-driven mode, renders these buttons; re-exports this component as `Paginator.Button`.
- `paginator-info` — the page-info text that sits beside the strip.
- `paginator-page-size` — the rows-per-page selector placed in the paginator's `controls` slot.
- `icon-button` — a standalone icon-only action with its own frame and radius.

## Best practices

- Place it only inside `paginator`'s default slot: the strip's border and frame come from the root, and the outer radius is applied through `first:` / `last:`, so only the first and last buttons of the strip round their corners.
- Pass `aria-label` on every `previous`, `next` and `more` button: those kinds render an `aria-hidden` icon only and have no accessible name otherwise.
- Put the page number in the default slot of `kind="number"` only; the other kinds ignore the slot.
- Set `selected` on exactly one number button (it sets `aria-current="page"`), and `disabled` on Previous at the first page and Next at the last.
- In composition mode you own every click: listen to `click` and update the page yourself; a `disabled` button never emits it.

## Usage

```vue
<script setup>
  import Paginator from '@aziontech/webkit/paginator'
  import PaginationButton from '@aziontech/webkit/pagination-button'
</script>

<template>
  <Paginator>
    <PaginationButton
      kind="previous"
      aria-label="Previous page"
      disabled
    />
    <PaginationButton
      kind="number"
      selected
      >1</PaginationButton
    >
    <PaginationButton kind="number">2</PaginationButton>
    <PaginationButton
      kind="more"
      aria-label="More pages"
    />
    <PaginationButton
      kind="next"
      aria-label="Next page"
    />
  </Paginator>
</template>
```

## Props

| Prop       | Type                                         | Default    | Required | JSDoc                                                   |
| ---------- | -------------------------------------------- | ---------- | -------- | ------------------------------------------------------- |
| `kind`     | `'previous' \| 'next' \| 'number' \| 'more'` | `'number'` | false    | Button role within the paginator.                       |
| `selected` | `boolean`                                    | `false`    | false    | Marks the current page (filled surface + aria-current). |
| `disabled` | `boolean`                                    | `false`    | false    | Disables interaction and applies disabled tokens.       |

## Events

| Event   | Payload      | Notes                                                                                               |
| ------- | ------------ | --------------------------------------------------------------------------------------------------- |
| `click` | `MouseEvent` | Fires on activation. Not emitted while `disabled` (the native `disabled` attribute also blocks it). |

## Slots

| Slot      | Scope | Notes                                                   |
| --------- | ----- | ------------------------------------------------------- |
| `default` | —     | The page number. Rendered only when `kind` is `number`. |

## States

- Visual states: `default`, `hover`, `active`, `focus-visible`, `selected`, `disabled`.
- Root: a native `button` with `type="button"`; attributes (including `aria-label` and `class`) are forwarded to it (`inheritAttrs: false` + `v-bind="$attrs"`).
- `data-kind` mirrors `kind` (`previous` | `next` | `number` | `more`). `previous` renders `pi pi-chevron-left`, `next` renders `pi pi-chevron-right`, `more` renders `pi pi-ellipsis-h`; only `number` renders the default slot. `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own.
- `hover` and `active` are two stacked pseudo-element layers (`before:` hover, `after:` active) and are mutually exclusive: pressing hides the hover layer and shows the active layer alone.
- `data-selected` is present when `selected` is set; it adds `var(--bg-selected)` and a `var(--border-default)` border, and sets `aria-current="page"`.
- `data-disabled` is present when `disabled` is set; the button also gets the native `disabled` attribute and `aria-disabled="true"`, mutes the foreground to `var(--text-disabled)`, shows `cursor-not-allowed`, hides both state layers and keeps the kind's own surface.
- Test ids: `<paginator testId>__button` when rendered inside a `paginator` (`data-paginator__button` by default), `data-paginator__button` outside one; a consumer `data-testid` wins.

## Motion & Animations

| Trigger                          | Animation / Transition                                                                | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| selected / disabled color change | `transition-colors duration-150 ease-out`                                             | inline                                            | `motion-reduce:transition-none`                                                |
| hover / active layer             | `before:transition-opacity` / `after:transition-opacity` with `duration-150 ease-out` | inline                                            | `motion-reduce:before:transition-none` / `motion-reduce:after:transition-none` |

## Tokens

| Region                                    | Token (DESIGN.md)                                       |
| ----------------------------------------- | ------------------------------------------------------- |
| typography                                | `.text-button-lg`                                       |
| size                                      | `h-7` · `min-w-7` (28px, no horizontal padding)         |
| surface (number / more)                   | `var(--bg-surface)`                                     |
| surface (hover layer)                     | `var(--bg-hover)`                                       |
| surface (active layer)                    | `var(--bg-active)`                                      |
| surface (selected)                        | `var(--bg-selected)`                                    |
| border (selected)                         | `var(--border-default)` · `var(--border-width-default)` |
| text                                      | `var(--text-default)`                                   |
| text (disabled)                           | `var(--text-disabled)`                                  |
| gap (content)                             | `var(--spacing-xs)`                                     |
| shape (first / last button outer corners) | `var(--shape-elements)`                                 |
| ring                                      | `var(--ring-color)` · offset `var(--bg-canvas)`         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: native button — `Tab` focuses; `Enter` / `Space` activates; a `disabled` button is skipped by `Tab`.
- ARIA: `aria-current="page"` when `selected`; `disabled` attribute and `aria-disabled="true"` when `disabled`; the chevron and ellipsis icons are `aria-hidden="true"`, so `previous`, `next` and `more` take their accessible name from a consumer `aria-label` (data-driven `paginator` sets one on Previous and Next only).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): `var(--text-default)` on `var(--bg-surface)` / `var(--bg-selected)`; disabled uses `var(--text-disabled)`.
- `motion-reduce:transition-none`, `motion-reduce:before:transition-none` and `motion-reduce:after:transition-none` on the state transitions.
- Touch target: 28×28, a justified deviation — the buttons are butted into the compact paginator strip that sits in a table footer, with no room to pad the hit area (see `paginator`).

## Stories (Storybook)

- Covered by the `paginator` stories (`apps/storybook/src/stories/components/data/paginator/Paginator.stories.js`): `Buttons` renders every `kind` and the `selected` / `disabled` states as `Paginator.Button`; `Default` and `DataDriven` show it inside the full strip. No standalone story — the button is only meaningful inside the paginator's strip, whose frame it does not draw itself.

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
