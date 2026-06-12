---
name: plan-success
category: templates
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/eeX71MMNcfqKHoXWemUacK/-UXE-7875--Azion-Plans?node-id=833-23321
  node_id: 833:23321
checksum: 1871b6c30798c92fc5ed7901d2bb76ac9339e5b7a2324f650efb56fde6f87796
created: 2026-05-25
last_updated: 2026-05-25
---
# Plan Success — Component Spec

## Purpose

Full-page post-checkout success screen for the Azion Plans flow ([Figma 833:23321](https://www.figma.com/design/eeX71MMNcfqKHoXWemUacK/-UXE-7875--Azion-Plans?node-id=833-23321)): optional `GlobalHeader` with brand, centered `CardBox` with activation message, numbered next steps, and a primary deploy CTA.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `'Your Pro Plan is now Active'` | no | Main success heading in the card header region. |
| `description` | `string` | `'A receipt has been sent to your email for your records.'` | no | Supporting copy under the success heading. |
| `stepsLabel` | `string` | `'Next Steps'` | no | Section label above the numbered steps list. |
| `steps` | `PlanSuccessStep[]` | `undefined` | yes | Ordered next-step entries (title + description per row). |
| `actionLabel` | `string` | `'Start deploying'` | no | Primary footer button label. |
| `showHeader` | `boolean` | `true` | no | When true, renders the top `GlobalHeader` bar with the brand slot. |
| `disabled` | `boolean` | `false` | no | Disables the primary action button. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `action-click` | `MouseEvent` | Fires when the primary footer button is activated. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `header` | — | Replaces the built-in `GlobalHeader` bar (brand + regions). |
| `success` | — | Replaces the built-in success banner inside `CardBox` header. |
| `steps` | — | Replaces the built-in next-steps list in `CardBox` content. |
| `actions` | — | Replaces the built-in footer primary button. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on the root

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (success title) | `.text-heading-sm` |
| typography (success description) | `.text-body-xs` |
| typography (steps label) | `.text-button-md` |
| typography (step title) | `.text-body-sm` |
| typography (step description) | `.text-body-xs` |
| canvas | `var(--bg-canvas)` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| text (success icon) | `var(--success)` |
| border | `var(--border-default)` |
| step badge surface | `var(--bg-hover)` |
| spacing (page) | `var(--spacing-8)` |
| spacing (card header) | `var(--spacing-6)` |
| spacing (card body) | `var(--spacing-6)` |
| spacing (section gap) | `var(--spacing-5)` |
| spacing (step gap) | `var(--spacing-1)` |
| shape (card) | `var(--shape-card)` |
| shape (step badge) | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Root is a full-height layout; `GlobalHeader` uses `role="banner"` when shown.
- Main card content is in `<main>` with `aria-labelledby` pointing at the success heading.
- Primary action is a native button with visible focus ring (delegated to `Button`).
- Success check icon is decorative (`aria-hidden="true"`).
- Step numbers are exposed as text in badges with readable contrast.
- `motion-reduce:transition-none` on color transitions.

## Stories (Storybook)

- Default
- Disabled

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
