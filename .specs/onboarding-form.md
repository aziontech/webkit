---
name: onboarding-form
category: templates
structure: monolithic
status: implemented
spec_version: 1
checksum: ecbae09da710519bb89738bbecc54ec3991c39933a450f85c1aad560660e826f
created: 2026-05-23
last_updated: 2026-05-23
---
# Onboarding Form — Component Spec

## Purpose

Centered onboarding layout for post-signup flows, wrapped in `CardBox`: plan summary, usage intent (`BoxGridSelection`), full name (`InputText`), optional expert session (`FieldCheckbox`), primary continue action, and enterprise footer CTA. Composes existing webkit inputs and actions; consumers bind v-models for usage, name, and schedule preference.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `'Your first global deployment is seconds away'` | no | Page title above the form sections. |
| `planLabel` | `string` | `'Plan Selected'` | no | Label above the plan summary card. |
| `planTitle` | `string` | `'Hobby'` | no | Selected plan name in the summary card. |
| `planPrice` | `string` | `'Free'` | no | Price badge text beside the plan title. |
| `planDescription` | `string` | `'For professional or commercial workloads.'` | no | Supporting copy under the plan title. |
| `changeLabel` | `string` | `'Change'` | no | Label for the plan change action button. |
| `usageLabel` | `string` | `'How are you planning to use Azion?'` | no | Label for the usage intent grid. |
| `usageRequired` | `boolean` | `true` | no | When true, appends a required indicator to the usage label. |
| `usageValue` | `string \| number \| undefined` | `undefined` | no | Selected usage option (v-model). |
| `usageItems` | `BoxGridSelectionItem[]` | `undefined` | yes | Options for `BoxGridSelection`. |
| `fullNameLabel` | `string` | `'Your Full Name'` | no | Label for the full name field. |
| `fullNameRequired` | `boolean` | `true` | no | When true, appends a required indicator to the full name label. |
| `fullName` | `string` | `''` | no | Full name value (v-model). |
| `fullNamePlaceholder` | `string` | `'John Doe'` | no | Placeholder for the full name input. |
| `scheduleLabel` | `string` | `'Schedule an onboarding session with an Azion expert'` | no | Label for the scheduling checkbox. |
| `scheduleOnboarding` | `boolean` | `true` | no | Whether the scheduling checkbox is checked (v-model). |
| `continueLabel` | `string` | `'Continue'` | no | Primary submit button label. |
| `continueDisabled` | `boolean` | `false` | no | Disables the continue button. |
| `disabled` | `boolean` | `false` | no | Disables all interactive fields in the template. |
| `footerPrefix` | `string` | `'Have enterprise requirements?'` | no | Footer prompt before the contact link. |
| `footerLinkLabel` | `string` | `'Get in touch'` | no | Footer contact link label. |
| `footerLinkHref` | `string` | `'#'` | no | Footer contact link URL. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:usageValue` | `string \| number` | v-model for usage selection. |
| `update:fullName` | `string` | v-model for full name. |
| `update:scheduleOnboarding` | `boolean` | v-model for scheduling checkbox. |
| `change-click` | `MouseEvent` | Fires when the plan change button is activated. |
| `continue-click` | `MouseEvent` | Fires when the continue button is activated. |
| `footer-link-click` | `MouseEvent` | Fires when the footer contact link is activated. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `plan` | — | Replaces the built-in plan summary card. |
| `footer` | — | Replaces the built-in enterprise footer bar. |

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
| typography (heading) | `.text-heading-sm` |
| typography (section label) | `.text-body-sm` |
| typography (plan title) | `.text-body-sm` |
| typography (plan description) | `.text-body-xs` |
| typography (footer) | `.text-body-sm` |
| surface | `var(--bg-surface)` |
| canvas | `var(--bg-canvas)` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| text (link) | `var(--text-link)` |
| text (required) | `var(--primary)` |
| border | `var(--border-default)` |
| spacing | `var(--spacing-6)` |
| spacing (section) | `var(--spacing-4)` |
| spacing (tight) | `var(--spacing-1)` |
| shape (card) | `var(--shape-card)` |
| shape (elements) | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Root is a `<form>` landmark with `aria-labelledby` pointing at the heading.
- Section labels use native `<label>` or `id`/`for` association with controls.
- Required fields expose `aria-required="true"` on associated controls.
- Footer link is a standard anchor with visible focus ring.
- Contrast and touch targets are delegated to composed child components.
- `motion-reduce:transition-none` on color transitions.

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
