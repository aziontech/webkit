---
name: deploy-success
category: templates
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3996-39125
  node_id: 3996:39125
checksum: eff7fe5bc9c127cb5be78f227f284ad093138ddc70eeabcb3447af6e0549eece
created: 2026-05-26
last_updated: 2026-06-30
---

# Deploy Success — Component Spec

## Purpose

Full-page post-deploy success screen: an optional `GlobalHeader` with brand, a centered `CardBox` with a congratulations header (scope tag + visit link), the application name, an embedded `LogView` build log, an icon next-steps list, and a secondary "Manage" CTA.

## Usage

```vue
<script setup>
import DeploySuccess from '@aziontech/webkit/deploy-success'

const steps = [
  { title: 'Customize Domain', description: 'Associate a custom domain to handle user access.', icon: 'ai ai-domains' },
  { title: 'View Analytics', description: 'Gain insights into performance, availability, and security.', icon: 'ai ai-real-time-metrics' }
]
const lines = [
  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
  { id: '2', time: '13:49:10', type: 'success', message: 'Deploy finalized successfully!' }
]
</script>

<template>
  <DeploySuccess app-name="myappname" scope="mygithub-scope" :lines="lines" :steps="steps" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `'Congratulations!'` | no | Main success heading in the card header region. |
| `description` | `string` | `'You just deployed a new application into'` | no | Supporting copy before the scope tag. |
| `scope` | `string` | `'mygithub-scope'` | no | Scope label rendered in the header tag. |
| `appName` | `string` | `'myappname'` | no | Deployed application name above the build log. |
| `lines` | `LogViewLine[]` | `[]` | no | Build log entries passed to LogView. |
| `stepsLabel` | `string` | `'Next Steps'` | no | Section label above the next-steps list. |
| `steps` | `DeploySuccessStep[]` | `[]` | yes | Ordered next-step entries (title, description, icon per row). |
| `actionLabel` | `string` | `'Manage'` | no | Primary footer button label. |
| `visitLabel` | `string` | `'Visit'` | no | Visit link label in the card header. |
| `visitHref` | `string` | `'#'` | no | Visit link destination URL. |
| `showHeader` | `boolean` | `true` | no | When true, renders the top GlobalHeader bar with the brand slot. |
| `disabled` | `boolean` | `false` | no | Disables toolbar controls and the primary action button. |

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
| `success` | — | Replaces the built-in congratulations header inside the CardBox header. |
| `logs` | — | Replaces the built-in app name + LogView region in the CardBox content. |
| `steps` | — | Replaces the built-in next-steps list in the CardBox footer. |
| `actions` | — | Replaces the built-in footer primary button. |

## Data types

`DeploySuccessStep`:

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Step title beside the leading icon. |
| `description` | `string` | Supporting copy under the step title. |
| `icon` | `string` | Azion icon class (e.g. `ai ai-domains`). |

`lines` accepts the `LogViewLine[]` type exported from LogView's `injection-key.ts`.

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on the root

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-fast-02 ease-productive-entrance` | semantic (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (success title) | `.text-heading-sm` |
| typography (app name) | `.text-heading-xs` |
| typography (description) | `.text-body-sm` |
| typography (steps label) | `.text-label-sm` |
| canvas | `var(--bg-canvas)` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| border | `var(--border-muted)` |
| shape (card) | `var(--shape-card)` |
| shape (step icon) | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- The root is a full-height layout; `GlobalHeader` exposes `role="banner"` when shown.
- The main card content is in `<main>` with `aria-labelledby` pointing at the success heading.
- The primary action is a native button with a visible focus ring (delegated to `Button`).
- The visit link opens in a new tab with `rel="noopener noreferrer"` when `target="_blank"`.
- Step-row icons and chevrons are decorative (`aria-hidden="true"`).
- The embedded LogView content uses `role="log"` via LogViewContent.
- `motion-reduce:transition-none` on the color transition.

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
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
