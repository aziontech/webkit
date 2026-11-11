---
name: hotspot
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: d65110e769cfb22a2c07700858626633cf7e68674914fbd33d2b3e1012703486
created: 2026-11-11
last_updated: 2026-11-11
---

# Hotspot — Component Spec

## Purpose

Marks a real control as a step of a tutorial. It wraps the control and, while a tutorial that names
its `hotspotId` runs, draws a small marker beside it. The current step's marker pulses and opens the
step in a popover: the step's title, `Step n of N` with the task's name, the instructions, and
Previous / Next (Finish on the last step). Outside a running tutorial, or outside a
`TutorialPanel.Provider`, it renders only the wrapped control, so hotspots can stay on a page for good.

## When to use

- A tutorial step is about one control on the page, and the reader should see where it is.
- The page runs inside a `TutorialPanel.Provider` and offers guided tutorials from its help region.

## When NOT to use

- A permanent tip on a control → use `hint` or `popover`.
- A new feature announcement with no tutorial behind it → use `popover` or an `alert`.
- Help text for a form field → use the field's `helper-text`.

## Related

- `tutorial-panel` — the provider holds the steps a hotspot shows; the panel lists and runs the tutorials.
- `popover` — the overlay the current step opens in.
- `help-panel` — static help without a guided run.

## Best practices

- Wrap exactly the control the step is about; keep the marker beside it, not inside a long row.
- Use `side="start"` when the control sits at the end of a row and the marker would overflow.
- One `hotspotId` per control and per page. The same id on two elements opens two popovers.
- Keep step content short: the popover is a small surface over the real UI.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
</script>

<template>
  <Hotspot hotspot-id="deploy">
    <Button
      label="Deploy"
      kind="primary"
    />
  </Hotspot>
</template>
```

## Props

| Prop        | Type               | Default | Required | JSDoc                                                                                         |
| ----------- | ------------------ | ------- | -------- | --------------------------------------------------------------------------------------------- |
| `hotspotId` | `string`           | `—`     | true     | Matches the `hotspotId` of a tutorial step; the marker shows while that step's tutorial runs. |
| `side`      | `'start' \| 'end'` | `'end'` | false    | Which side of the wrapped control the marker sits on, in reading direction.                   |

## Events

_No events — moves go through the `TutorialPanel.Provider`, which emits `update:step` and `finish`._

## Slots

| Slot      | Scope | Notes                               |
| --------- | ----- | ----------------------------------- |
| `default` | —     | The real control the step is about. |

## States

- Visual states: `inactive` (no marker), `active` (static marker: the step belongs to the running tutorial), `current` (marker filled and pulsing, popover open), `dismissed` (current step closed by the reader: marker filled, no pulse, popover closed)
- `data-active` on the root when the marker shows; `data-current` on the root and on the marker for the current step
- `data-side` mirrors `side`
- The popover's `data-state` is `open` | `closed` (owned by `Popover`)

## Motion & Animations

| Trigger                    | Animation / Transition                     | Token                                                    | Reduced-motion fallback                           |
| -------------------------- | ------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------- |
| current step, popover open | `animate-ping` on a ring behind the marker | semantic (`ping`, attention ring)                        | `motion-reduce:animate-none` (static ring)        |
| marker becomes current     | `transition-colors` on the dot             | inline · `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none`                   |
| popover open / close       | owned by `Popover` (its scale in and out)  | component                                                | handled by `Popover`                              |
| scroll to the marker       | `scrollIntoView` smooth                    | browser                                                  | `behavior: 'auto'` under `prefers-reduced-motion` |

## Tokens

| Region                   | Token (DESIGN.md)                        |
| ------------------------ | ---------------------------------------- |
| marker ring and fill     | `var(--primary)`                         |
| marker dot (not current) | `var(--bg-surface)`                      |
| shape                    | `var(--radius-full)`                     |
| ring                     | `var(--ring-color)`                      |
| step content typography  | `.text-body-sm`                          |
| step content ink         | `var(--text-default)`                    |
| padding (step content)   | `var(--spacing-md)`, `var(--spacing-sm)` |
| gap (control to marker)  | `var(--spacing-xxs)`                     |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the marker.
- Keyboard map: the marker is a `button` in the tab order after the wrapped control (before it with `side="start"`); `Enter` / `Space` opens its step (and makes it current). Inside the popover `Tab` cycles Close, Previous and Next (the `Popover` loop); `Esc` closes the step and returns focus to the marker. Next, Previous and the marker move focus into the new step's popover; Finish moves focus to the panel's completion heading.
- ARIA: the marker is named `Tutorial step: <title>` and carries `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (from `Popover.Trigger`). The popover is a non-modal `dialog` labelled by the step title and described by `Step n of N`. The pulse ring and dot are `aria-hidden`.
- Contrast: the marker's `--primary` against the canvas ≥3:1 (non-text) in both themes.
- Touch target: the visible marker is 24 px; a `before:` pseudo-element extends the hit area by 8 px on each side (40 px).

## Internationalization

| Key                | English source              | Override prop |
| ------------------ | --------------------------- | ------------- |
| `hotspot.label`    | `Tutorial step: {title}`    | —             |
| `hotspot.stepOf`   | `Step {current} of {total}` | —             |
| `hotspot.previous` | `Previous`                  | —             |
| `hotspot.next`     | `Next`                      | —             |
| `hotspot.finish`   | `Finish`                    | —             |

- Formatting: none (integers interpolated). The close button's name comes from `popover.close`.

## Right-to-left

- Layout: the root is a flex row that follows `dir`; `side="start"` renders the marker before the control in the DOM, so reading, tab and visual order agree in both directions. The popover placement mirrors through `usePlacement`.
- Icons: none in the marker.
- Keyboard: no arrow keys.
- User data: none.

## Responsive

- Container queries: none: fixed-size marker.
- Narrow: the root has `max-w-full` and the popover is `width="small"` (`--container-xs`), clamped by `Popover` to the viewport.
- Touch: 40 px hit area through the pseudo-element.
- Reflow: no horizontal scroll at 320 px; the popover wraps its text.

## Performance

- Bundle budget: `hotspot` 11.5 KB gzip (it carries `Popover` and `Button`).
- Runtime budget: none: one computed lookup per step change.
- Heavy parts: none.

## Stories (Storybook)

- Default — two hotspots inside a running tutorial; the first step's popover open.

## Open questions

- The pulse runs while the step is open (`animate-ping` is infinite). If it proves distracting, stop it after a few cycles with an iteration token in the theme.

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
