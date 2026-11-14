---
name: copy-prompt-button
category: actions
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: f51410f10a206b6bf524e4997b4b5b2d7630b9576ca42a704cd36fc8779115d5
created: 2026-11-12
last_updated: 2026-11-14
---

# CopyPromptButton — Component Spec

## Purpose

The "Copy prompt" button of a docs or product home: one dark chip that copies a ready-made prompt for a coding agent and, after its label, shows the marks of the agents it works with (Claude, ChatGPT, Gemini and Cursor by default). The chip carries the design system's AI treatment, the same three layers as `ButtonHighlight`: a blurred gradient glow rotating behind it, the brand-accent gradient over the glow, and a dark scrim over both that holds the white label at contrast; on hover the gradient and the scrim fade to a quarter and the glow blooms through. It is dark in both themes (it renders under `data-theme="dark"`), so it reads as the AI entry point next to a primary button, and a tooltip says what it does. The marks are single-colour and decorative, drawn in the chip's own ink; their names reach screen readers as the button's description ("Works with Claude, ChatGPT, Gemini, Cursor"). With `closable` a dismiss button sits beside the chip, and dismissing removes both from the layout.

## When to use

- The hero of a documentation home or a product landing, beside the primary action (`Get started`), when the page hands its reader a prompt for their agent.
- Inside `DocAgentCard`, the "Your AI agent, fluent in Azion" card of a docs home (it renders this button by default).

## When NOT to use

- To show the prompt text itself on the page → use `DocPrompt` (it renders the text with its own copy control).
- To copy a value, a token or a code snippet → use `CopyButton`.
- As a generic dark button → use `Button kind="secondary"`.

## Related

- `DocPrompt` — the prompt rendered in full, with a copy control.
- `DocAgentCard` — the docs-home card that places this button in its left column.
- `DocHero` — the docs-home masthead whose `actions` slot holds `Get started` and this button.
- `CopyButton` — the icon-only copy control; this button shares its clipboard fallback.
- `ButtonHighlight` — the AI-flow button whose glow, gradient and scrim this chip shares.
- `Logo` — draws an agent mark from its asset file in the chip's ink.

## Best practices

- Put it second, after the primary `Button` (`Get started`), and explain what the prompt does in one line below the row (`DocHero`'s `note` slot).
- Keep the default agents unless the product supports a different set; pass `:agents="[]"` to draw the label alone.
- Pass the exact prompt in `value`; the button copies it as it stands.
- Do not recolour the marks: they are single-colour by design and follow the chip's ink.
- To draw a mark from the agent's asset file instead of the icon font, give the agent a `logo` (`@aziontech/webkit/assets/claude-symbol-color.svg`); `Logo` flattens it to the chip's ink.
- Set `closable` where the chip is guidance the reader can put away (a first-use overview), not where it is part of a page's composition (a hero). Listen to `close` to remember the choice; the chip only hides itself.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'

  const prompt = 'Set up the Azion CLI, connect the Azion docs over MCP and link this project.'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-sm)">
    <Button
      label="Get started"
      size="large"
      href="#"
    />
    <CopyPromptButton :value="prompt" />
  </div>
</template>
```

## Props

| Prop          | Type                | Default                         | Required | JSDoc                                                                                                                                                                                             |
| ------------- | ------------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`       | `string`            | —                               | true     | The prompt copied to the clipboard on activation.                                                                                                                                                 |
| `label`       | `string`            | `''`                            | false    | Visible text and accessible name while idle; empty uses the catalog's `Copy prompt`.                                                                                                              |
| `copiedLabel` | `string`            | `''`                            | false    | Visible text announced after a copy; empty uses the catalog's `Copied`.                                                                                                                           |
| `agents`      | `CopyPromptAgent[]` | Claude, ChatGPT, Gemini, Cursor | false    | The agents whose marks follow the label, in order; each is `{ name, icon?, logo? }`, drawn from `logo` through `Logo` when set and from the `icon` glyph otherwise; an empty list draws no marks. |
| `disabled`    | `boolean`           | `false`                         | false    | Disables the button; `copy` is not emitted.                                                                                                                                                       |
| `closable`    | `boolean`           | `false`                         | false    | Shows a dismiss button beside the chip; activating it removes both from the layout and emits `close`.                                                                                             |

## Events

| Event   | Payload      | Notes                                                                                                                                 |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `copy`  | `string`     | Fires with `value` after the clipboard write succeeds. When the write is refused, the copy fallback popover opens instead.            |
| `close` | `MouseEvent` | Fires with the click on the dismiss button (`closable`), after the chip removes itself; whether it stays away is the page's decision. |

## Slots

_none_

## States

- Visual states: `idle`, `hover` (the gradient and the scrim fade to 25% and the rotating glow blooms through), `focus-visible` (ring), `copied` (the label swaps to a check and `Copied` for two seconds, without changing the width), `disabled` (the AI layers hide and the chip takes the disabled fill), `dismissed` (with `closable`, the chip and its dismiss button unmount).
- `data-state` is `idle` or `copied`; `data-disabled` mirrors `disabled`.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed` (the tooltip owns its own open state).

## Motion & Animations

| Trigger              | Animation / Transition                                                                                                                                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| idle (always)        | the glow layer rotates once every 8 s: `animate-spin [animation-duration:8s] [animation-timing-function:linear]`                                                              | semantic `spin`, as `ButtonHighlight`             | `motion-reduce:animate-none` (the glow holds still) |
| hover state change   | the gradient and scrim layers' `transition-opacity duration-300 ease-out`, and the chip's `transition-colors duration-fast-02 ease-productive-entrance`, as `ButtonHighlight` | semantic (fast-02 · productive entrance)          | `motion-reduce:transition-none` on every layer      |
| tooltip open / close | owned by `Tooltip` (its popup scale-in and scale-out) | semantic                                          | `motion-reduce:animate-none` (in `Tooltip`)         |

## Tokens

| Region   | Token (DESIGN.md)                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| glow     | gradient of `var(--color-base-white)`, `var(--color-blue-500)` and `var(--color-brand-primary-500)`, blurred, as `ButtonHighlight`                                                                            |
| gradient | `var(--color-brand-accent-900)`, `var(--color-brand-accent-100)`, `var(--color-brand-accent-600)` on a 120° axis                                                                                              |
| scrim    | `var(--bg-backdrop)`                                                                                                                                                                                          |
| rim      | `var(--secondary-mask)` border, `var(--border-width-default)`                                                                                                                                                 |
| label    | `.text-button-lg`, `var(--color-base-white)`                                                                                                                                                                  |
| marks    | `currentColor` of the label (`Logo kind="current"` or the icon glyph at `.text-label-lg`)                                                                                                                     |
| shape    | `var(--shape-button)`                                                                                                                                                                                         |
| spacing  | `var(--spacing-md)` start, `var(--spacing-sm)` end, `var(--spacing-xs)` gap (`var(--spacing-sm)` from `sm`), `var(--spacing-xxs)` between marks (`var(--spacing-xs)` from `sm`) and before the dismiss button |
| focus    | `var(--ring-color)` ring, offset on `var(--bg-canvas)`                                                                                                                                                        |
| disabled | `var(--bg-disabled)`, `var(--text-disabled)`                                                                                                                                                                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`Copy prompt`, then `Copied` while the copied state shows). A `Tooltip` on hover and focus says what it does (`Copies a setup prompt for your AI coding tool`).
- With `closable`, the dismiss control is a separate `IconButton` beside the chip (never inside it), named `Dismiss`; dismissing unmounts both, so neither stays in the tab order.
- The agent marks are `aria-hidden`; their names form the description through `aria-describedby` ("Works with Claude, ChatGPT, Gemini, Cursor").
- A polite `role="status"` region next to the button announces `Copied` after a successful copy.
- Keyboard map: `Tab` focuses the chip, then the dismiss button when `closable`; `Enter` and `Space` copy on the chip and dismiss on the dismiss button; `Esc` closes an open tooltip (owned by `Tooltip`).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Contrast: the white label and marks sit on the 80% black scrim at rest (≥ 4.5:1 in both page themes); on hover the scrim thins over the accent gradient and the label stays above 3:1 for its large button type.
- Touch target: 40 px tall; `pointer-coarse:min-h-11` raises it to 44 px.
- `motion-reduce:animate-none` on the rotating glow and `motion-reduce:transition-none` on every transition.

## Internationalization

| Key                          | English source                                  | Override prop         |
| ---------------------------- | ----------------------------------------------- | --------------------- |
| `copyPromptButton.label`     | `Copy prompt`                                   | `label`               |
| `copyPromptButton.copied`    | `Copied`                                        | `copiedLabel`         |
| `copyPromptButton.worksWith` | `Works with {agents}`                           | `agents`              |
| `copyPromptButton.tooltip`   | `Copies a setup prompt for your AI coding tool` | — (provider messages) |
| `copyPromptButton.dismiss`   | `Dismiss`                                       | — (provider messages) |

- Agent names are brand names and are not translated.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`); the label leads at the inline start, the marks follow it and the dismiss button follows the chip. The glow, gradient and scrim layers are symmetric.
- Icons: brand marks and the dismiss `×` are not mirrored.
- Keyboard: no arrow keys.

## Responsive

- The chip keeps its intrinsic width; the label truncates with an ellipsis before the marks shrink when the row is narrower than the chip.
- Touch: 40 px tall, 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px; the chip wraps to its own line inside a wrapping action row.

## Performance

- Bundle budget: 4.25 KB gzip for `./copy-prompt-button` in `.size-limit.json`, initial chunk only; `Tooltip` is the growth.
- Runtime budget: none; one timer while the copied state shows.
- Heavy parts: the copy fallback popover is an async component, requested only when the clipboard write is refused. The dismiss `IconButton` loads only when `closable` is set and `Logo` only when an agent sets `logo`; each keeps its box with an empty placeholder of the same size until its chunk arrives, and server rendering resolves both before it writes the HTML.

## Examples

- Default — the chip with the default agents, beside a primary `Get started`.
- Agents — a custom agent list, and the label alone with `:agents="[]"`.
- Disabled — `disabled`.
- Closable — `closable` with the agent marks drawn from their asset files through `Logo`; the dismiss button removes the chip.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
