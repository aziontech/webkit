---
name: deploy-success
category: templates
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3996-39125
  node_id: 3996:39125
created: 2026-05-26
last_updated: 2026-05-26
checksum: dc9c58f6cc29fb4b2c84b2d5c9aa5d416f5b33a706a563926ff8a5bf0db5b42f
---

# Deploy Success — Component Spec

## Purpose

Full-page post-deploy success screen ([Figma 3996:39125](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3996-39125)): optional `GlobalHeader` with brand, centered `CardBox` with congratulations header (scope tag + visit link), application name, embedded `BuildLog`, icon next-steps list, and a secondary manage CTA.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `'Congratulations!'` | no | Main success heading in the card header region. |
| `description` | `string` | `'You just deployed a new application into'` | no | Supporting copy before the scope tag. |
| `scope` | `string` | `'mygithub-scope'` | no | Scope label rendered in the header tag. |
| `appName` | `string` | `'myappname'` | no | Deployed application name above the build log. |
| `lines` | `BuildLogLine[]` | `[]` | no | Build log entries passed to BuildLog. |
| `stepsLabel` | `string` | `'Next Steps'` | no | Section label above the next-steps list. |
| `steps` | `DeploySuccessStep[]` | `undefined` | yes | Ordered next-step entries (title, description, icon per row). |
| `actionLabel` | `string` | `'Manage'` | no | Primary footer button label. |
| `visitLabel` | `string` | `'Visit'` | no | Visit link label in the card header. |
| `visitHref` | `string` | `'#'` | no | Visit link destination URL. |
| `showHeader` | `boolean` | `true` | no | When true, renders the top GlobalHeader bar with the brand slot. |
| `disabled` | `boolean` | `false` | no | Disables toolbar controls and the primary action button. |

`DeploySuccessStep`:

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Step title beside the leading icon. |
| `description` | `string` | Supporting copy under the step title. |
| `icon` | `string` | Azion icon class (e.g. `ai ai-domains`). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `action-click` | `MouseEvent` | Fires when the primary footer button is activated. |
| `visit-click` | `MouseEvent` | Fires when the visit link is activated. |
| `step-click` | `[index: number, event: MouseEvent]` | Fires when a next-step row is activated. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `header` | — | Replaces the built-in GlobalHeader bar (brand + regions). |
| `success` | — | Replaces the built-in congratulations header inside CardBox header. |
| `logs` | — | Replaces the built-in app name + BuildLog region in CardBox content. |
| `steps` | — | Replaces the built-in next-steps list in CardBox footer. |
| `actions` | — | Replaces the built-in footer primary button. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on the root

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-fast-02 ease-productive-entrance` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (success title) | `.text-heading-sm` |
| typography (app name) | `.text-heading-xs` |
| typography (description) | `.text-body-sm` |
| typography (steps label) | `.text-label-sm` |
| typography (step title) | `.text-body-sm` |
| typography (step description) | `.text-body-sm` |
| canvas | `var(--bg-canvas)` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| border | `var(--border-muted)` |
| spacing (page) | `var(--spacing-xxl)` |
| spacing (card sections) | `var(--spacing-lg)` |
| spacing (section gap) | `var(--spacing-md)` |
| spacing (step gap) | `var(--spacing-xs)` |
| shape (card) | `var(--shape-card)` |
| shape (step icon) | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Root is a full-height layout; `GlobalHeader` uses `role="banner"` when shown.
- Main card content is in `<main>` with `aria-labelledby` pointing at the success heading.
- Primary action is a native button with visible focus ring (delegated to `Button`).
- Visit link opens in a new tab with `rel="noopener noreferrer"` when `target="_blank"`.
- Step row icons and chevrons are decorative (`aria-hidden="true"`).
- BuildLog content uses `role="log"` via BuildLogContent.
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
