---
name: <kebab-case-name>
category: <actions|content|data|feedback|inputs|layout|navigation|overlay|utils>
structure: <monolithic|composition>
status: draft
spec_version: 1
figma:
  url: <https://figma.com/design/...>
  node_id: <e.g. 10:42>
checksum: <sha256-of-body — filled by spec-validator on approval>
created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
---

# <Name> — Component Spec

## Purpose

<1–3 sentences. What the component is, when to use it, what makes it different from siblings in the same category.>

## Sub-components

<!-- Omit this section when structure: monolithic. -->
<!-- For structure: composition, list every public sub-component. -->

- `<name>-trigger.vue` — purpose
- `<name>-content.vue` — purpose
- `<name>-title.vue` — purpose
- `<name>-description.vue` — purpose
- `<name>-close.vue` — purpose

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'text'` | `'primary'` | no | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | no | Size token; affects height, padding, typography. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |

<!-- Rules enforced by spec-validator:
     - kebab-case prop names; no `is`/`has` prefix on booleans.
     - Visual variants always named `kind`. Sizes always named `size`.
     - Every prop has a JSDoc one-liner; no empty cells.
     - Types are union literals or primitives; no `any`. -->

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fires on activation. |
| `update:open` | `boolean` | v-model:open. |

<!-- Rules:
     - Event names in kebab-case (or `update:<prop>` for v-model).
     - Payload is a single TypeScript type or `void`. -->

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Main content. |
| `actions` | — | Trailing action area. |

<!-- Use `—` (em-dash) in Scope when the slot has no scoped props. -->

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-state` values (when applicable): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-orientation` (when applicable): `horizontal` | `vertical`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| open (overlay / popover) | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| close (overlay / popover) | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| loading indicator | `animate-blink` or component (`Spinner`) | semantic (1s step-end) | `aria-hidden="true"` + `motion-reduce:animate-none` |

<!-- Rules:
     - Every animation MUST come from packages/theme/src/tokens/semantic/animations.js.
     - Every motion-bearing transition pairs with `motion-reduce:transition-none` (or `motion-reduce:transform-none` / `motion-reduce:animate-none`).
     - No `@keyframes` declared inside the component.
     - Decorative spinners/loaders use `aria-hidden="true"`.
     - If the component is static (no motion), write `_none_` in this section. Do not omit the section. -->

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-button-lg` |
| surface | `var(--bg-surface)` |
| spacing.x | `var(--spacing-4)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

<!-- Every token here must exist in .claude/docs/DESIGN.md.
     spec-validator and token-mapper independently verify this. -->

## Theme gaps

<!-- One row per Figma variable that has no DESIGN.md equivalent yet. -->

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `<figma var>` | `<closest primitive>` | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `<Tab focuses; Enter/Space activates; Esc closes; arrows navigate; ...>`
- ARIA: `<aria-label / aria-busy / aria-disabled / aria-hidden / aria-current / aria-expanded as applicable>`
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states
- Touch target ≥40×40 px (or justified deviation)

## Stories (Storybook)

Keep it minimal. Default lists only the essentials. Add a story only if the variant is genuinely distinct in behavior.

- Default
- One per `kind` (when the component has more than one)
- One per `size` (when the component has more than one)
- Disabled (when the component has a `disabled` prop)

<!-- Rules:
     - DO NOT add LightDark, Accessibility play, Playground, WithSlots, WithComposition, Controlled, Uncontrolled, Loading unless the spec explicitly justifies them in writing here.
     - Storybook addons (a11y, docs autodocs, backgrounds) cover the rest automatically without a dedicated story.
     - If `kind` has only one value, omit the per-kind story (the Default already covers it).
     - Same for `size`. -->


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
