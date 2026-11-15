---
name: save-bar
category: layout
structure: monolithic
status: implemented
checksum: 761e938369919352f1603b93a8555e6edf6ba35ae11017a81c17ad57032348e1
spec_version: 4
template: 2
created: 2026-11-10
last_updated: 2026-11-15
---

# SaveBar — Component Spec

## Purpose

The bar at the bottom of a settings or create page that holds the status of unsaved work and its Discard (or Cancel) and Save actions. `floating` overlays the bottom of the scroll region without moving the content and is shown while the form is dirty; `docked` takes its own row at the bottom; `plain` closes a form column saved as one unit, always shown; `fade` closes a wizard step with no border or surface, the step content fading into the canvas above Back and Next; `centered` floats the actions as a raised card centred over the bottom of a create page, always shown.

## When to use

- A settings page whose changes are staged and saved together: show the floating bar while the form is dirty or saving.
- A create page or account form with one Save for the whole page (`plain`).
- A full-page wizard step: Back in `leading`, the step's primary action in `actions` (`fade`).
- A create page (Create Team, Create Zone, Create Function): Cancel and Create in a raised card centred at the bottom of the form, over the content, at every width (`centered`). This is the design sample's create-page footer; use it instead of a full-width `floating` bar there.

## When NOT to use

- A card that saves on its own → put the actions in the card footer.
- A drawer or dialog form → use the `PanelFooter` of `drawer` or `dialog`.
- A one-off confirmation → use `confirm-dialog`.

## Related

- `button` — the actions: an outlined Discard or Cancel, then a primary Save with `loading` while it runs.
- `settings-section` — the bands the bar saves.
- `confirm-dialog` — the guard shown when someone leaves with unsaved changes.

## Best practices

- Render the floating bar with `v-if="dirty || saving"` inside a `Transition`, so it slides in when the first change is made.
- Say what changed and when it takes effect in the status sentence; keep it to one line.
- Disable Discard and set `loading` on Save while saving.
- Do not build a centred action pill by hand (a sticky footer with a bordered card and a shadow): that is `variant="centered"`.
- `floating` and `docked` are for the dirty state of a settings page; `centered` and `plain` are for a create page or a form saved as one unit and stay on screen.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar>
    You have unsaved changes.
    <template #actions>
      <Button
        type="button"
        label="Discard"
        variant="outline"
        size="medium"
      />
      <Button
        label="Save"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

## Props

| Prop   | Type                                | Default      | Required | JSDoc                                                |
| ------ | ----------------------------------- | ------------ | -------- | ---------------------------------------------------- |
| `variant` | `'floating' \| 'docked' \| 'plain' \| 'fade' \| 'centered'` | `'floating'` | false    | How the bar sits at the bottom of its scroll region. See the variant table below. |

Each `variant` is one placement plus one surface, named for what a reader sees:

- `floating`: overlays the bottom of the scroll region; the content does not move; canvas band with a top border; use for the dirty state of a settings page.
- `docked`: its own row at the bottom of the region; the content ends above it; canvas band with a top border; use for the dirty state when nothing may be covered.
- `plain`: the last row of a form column, always shown; surface band with a muted top border; use for a form saved as one unit.
- `fade`: the last row of a wizard step, always shown; a gradient from transparent to the canvas, no border; use for a full-page wizard step (Back, Next).
- `centered`: a card centred at the bottom of the region, over the content; raised card with a border and a large shadow; use for a create page (Cancel, Create).

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                                                |
| --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The status sentence on the left, such as You have unsaved changes.                                                                                                                                   |
| `leading` | —     | Replaces the whole leading region (the info icon and the sentence) with your own content, such as a `StatusIndicator` (Saving…, Saved) or an unsaved-changes count. Takes precedence over `default`. |
| `actions` | —     | Discard or Cancel, then Save, on the right.                                                                                                                                                          |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop on the root
- Floating inset: while a `floating` bar is mounted it publishes its measured height on the document root as `--save-bar-inset` (for a scroll region of its own, such as a code editor, to pad its bottom) and `--toast-offset-bottom` (so the `toaster` stacks above the bar), and updates both when the bar resizes. When the bar would cover the end of the content, the root grows to the bar's height so the last field can scroll clear of it; when there is nothing left to cover, the root stays at zero height. Both properties are removed when the bar unmounts or changes to another `variant`. The other variants publish nothing.
- Responsive: the root is the `@container/save-bar`. `floating` and `docked` put the message and the actions on one row from `@xl` of the bar; below it the actions stack full width under the message, Save on top. `plain` stacks the same way below `@md`. `fade` keeps `leading` (Back) and the actions on one row at every width, the actions at the inline end. `centered` keeps the card centred and one row at every width: the optional `leading` or `default` content first, then the actions; the card never grows wider than the bar and lets clicks through around it. The bar keeps `env(safe-area-inset-bottom)` clear on phones.

## Motion & Animations

_none_ — the consumer wraps the bar in a `Transition` when it appears with the dirty state.

## Tokens

| Region                  | Token (DESIGN.md)                                               |
| ----------------------- | --------------------------------------------------------------- |
| floating/docked surface | `var(--bg-canvas)` · border `var(--border-default)`             |
| plain surface           | `var(--bg-surface)` · border `var(--border-muted)`              |
| fade surface            | gradient `transparent` to `var(--bg-canvas)`, no border         |
| centered card           | `var(--bg-surface-raised)` · border `var(--border-default)` · `var(--shape-card)` · `var(--shadow-lg)` |
| status text             | `.text-body-sm` · `var(--text-default)`                         |
| status glyph            | `var(--text-muted)`                                             |
| gaps                    | `var(--spacing-xs)` · `var(--spacing-sm)` · `var(--spacing-xl)` |
| padding                 | `var(--spacing-sm)` · `var(--spacing-md)` · `var(--spacing-lg)` · `var(--spacing-xl)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the action buttons.
- Keyboard map: `Tab` reaches Discard, then Save, in reading order (the column is reversed visually on a phone so Save sits on top).
- ARIA: the root is a `footer`; the status glyph is `aria-hidden`. The message region (`__message`, the `leading` / default slot) is a polite live region (`role="status"`), so a bar that appears when the form turns dirty announces its status sentence (WCAG 4.1.3 Status Messages) without moving focus.
- Contrast ≥4.5:1 for the status sentence.

## Internationalization

No built-in strings: the status sentence and the action labels come from the consumer's slots.

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `me-auto`, `ps-`); the message sits at the inline start and the actions at the inline end.
- Icons: the info glyph is not mirrored.
- Keyboard: none of its own; `Tab` order follows the actions in the slot.
- User data: none.

## Responsive

- Container queries: the root is `@container/save-bar`; `floating` and `docked` go to one row from `@xl`, `plain` stacks below `@md`.
- Narrow (≤ 640 px or a narrow container): the actions stack full width under the message, Save on top; the bar keeps `env(safe-area-inset-bottom)` clear.
- Touch: the actions are `Button` at `medium`, full width when stacked; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the floating bar reserves scroll room so it never hides the last field.

## Performance

- Bundle budget: 2.1 KB gzip for `./save-bar` in `.size-limit.json`.
- Runtime budget: one `ResizeObserver` on the floating bar while it is mounted; a resize writes two custom properties on the document root and measures the nearest scroll container once.
- Heavy parts: none.

## Examples

- Floating — the dirty-state bar over a scroll region.
- Docked — the bar on its own row; justified because `variant` changes the layout.
- Plain — the form footer; justified because `variant` changes the surface and width.
- Fade — the wizard step footer with Back in `leading`; justified because `variant` changes the surface and keeps one row.
- Centered — the create page footer, Cancel and Create in a raised card centred under the form; justified because `variant` changes the surface, the width and the placement.

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
