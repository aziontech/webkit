---
name: button
category: action
structure: monolithic
status: implemented
spec_version: 11
template: 2
checksum: 238c42c6009131ec03f86077c6203ee7615812248b6538712cec7bdcfee626bd
created: 2026-05-22
last_updated: 2026-11-20
---

# Button — Component Spec

## Purpose

The labelled control that triggers an action. `variant` ranks the action in its view (one `primary`, the rest `secondary`, `outline`, `ghost`, `danger` for a destructive one, or `link` for an action that reads as a link), `size` fits it to its context, and `loading` and `disabled` cover the states in between. With `href` it renders an anchor that looks the same, so a call to action that navigates needs no second component.

## When to use

- Use Button `variant="link"` when the text runs an action (no navigation) but should read like a link.
- Trigger an action that needs a visible text label: in a form, dialog footer, toolbar or page header.
- Mark the main action of a view with `variant="primary"` and the lesser ones with `secondary`, `outline` or `ghost`.
- Submit or reset a form with `type="submit"` / `type="reset"`.
- A call to action that navigates: set `href` (and `target`) and it renders as an anchor with the same look.
- An action that reads as a link — inline in a table cell or a summary (`Connect Git Repository`, `3 rules`, `Resources pending deletion`) — and opens a drawer, a picker or a flow instead of a URL: `variant="link"`. It is still a `<button>`, so keyboard and screen readers get an action.

## When NOT to use

- The control is icon-only → use `icon-button`.
- One default action with related alternatives in an attached menu → use `split-button`.
- A standalone navigation link with a trailing icon and a ghost hover → use `link`.
- Link-looking text that goes to a URL in a table cell → `TableCellLink`; a `variant="link"` Button is for an action with no destination.
- A hand-written `<button class="text-(--text-link) …">` → use `variant="link"`.
- The single AI or highlight entry point that must stand out from every other action → use `highlight-button`.

## Related

- `icon-button` — icon-only counterpart with the same sizes and a required `ariaLabel`; its `ghost` variant matches this one.
- `split-button` — joins a Button to a chevron menu of related actions.
- `highlight-button` — the same prop surface without `variant`, drawn with the brand gradient and a rotating glow rim.
- `link` — a text link that navigates to a page, resource or URL.
- `toggle-group` — a group of mutually exclusive options, not a single action.

## Best practices

- Keep one `variant="primary"` per view or region; use `danger` only for destructive actions.
- `variant="link"` has no box: no height, padding or surface, `text-body-sm` in the link colour, underlined on hover. `size` does not apply to it; place it where body text sits (a cell, a summary line, under a section).
- Set `loading` while the action resolves: it swaps the icon for a spinner, sets `aria-busy` and suppresses `click`, so the handler needs no extra guard.
- Give `loading` a `loadingLabel` that names the work (`Saving changes`), so a screen reader hears that it started.
- When a button is disabled for a reason the person can act on (a missing permission, an unfinished step), say it in `disabledReason` instead of leaving a dead control.
- Use `iconPosition="leading"` for a glyph that names the action and `"trailing"` for one that points where it goes; add `animated` only on marketing CTAs with a trailing icon.
- Put brand or product marks in the `leading` slot; `icon` takes an Azion icon class.
- `label` is required and is the accessible name; never pass an empty string to get an icon-only control.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button label="Save" />
  <Button variant="ghost">Cancel</Button>
  <Button
    label="Deploy"
    variant="secondary"
    icon="az az-upload"
  />
  <Button
    label="Read the docs"
    variant="outline"
    href="https://www.azion.com/en/documentation/"
    icon="az az-chevron-right"
    icon-position="trailing"
    animated
  />
</template>
```

## Props

| Prop             | Type                                                                     | Default     | Required | JSDoc                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------ | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `string`                                                                 | `''`        | false    | Visible label text, the fallback of the default slot (pass one or the other). Use `IconButton` for icon-only controls.                               |
| `variant`        | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'link'` | `'primary'` | false    | Visual variant. `link` draws an inline text action in the link colour, with no box.                                                                  |
| `size`           | `'small' \| 'medium' \| 'large'`                                         | `'large'`   | false    | Size token; affects height, padding, and typography.                                                                                                 |
| `disabled`       | `boolean`                                                                | `false`     | false    | Disables interaction and applies disabled tokens.                                                                                                    |
| `loading`        | `boolean`                                                                | `false`     | false    | Shows loading state and disables activation.                                                                                                         |
| `icon`           | `string`                                                                 | `''`        | false    | Azion icon class for the icon drawn beside the label.                                                                                                |
| `iconPosition`   | `'leading' \| 'trailing'`                                                | `'leading'` | false    | Which side of the label the icon sits on. `leading` is a glyph that names the action; `trailing` is a glyph that points at where it goes.            |
| `animated`       | `boolean`                                                                | `false`     | false    | Nudges a trailing icon along its axis on hover. Off by default; marketing CTAs opt in.                                                               |
| `href`           | `string`                                                                 | `''`        | false    | When set to a safe URL, renders as a link (`<a>`); an unsafe URL is ignored, and a `download` attribute keeps `blob:` / `data:` (see Accessibility). |
| `target`         | `'_blank' \| '_self'`                                                    | `'_self'`   | false    | Link target when `href` is set.                                                                                                                      |
| `type`           | `'button' \| 'submit' \| 'reset'`                                        | `'button'`  | false    | Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set.                  |
| `disabledReason` | `string`                                                                 | `''`        | false    | Why the action is unavailable. While `disabled`, the button stays focusable and carries this text as its description, shown by the browser on hover. |
| `loadingLabel`   | `string`                                                                 | `''`        | false    | What a screen reader hears when `loading` starts, such as `Saving changes`. Empty announces nothing.                                                 |

## Events

| Event   | Payload      | Notes |
| ------- | ------------ | ----- |
| `click` | `MouseEvent` | —     |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                  |
| --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The visible label, as shadcn and Radix take children; falls back to `label`. Plain text keeps the button's typography.                                                 |
| `leading` | —     | A mark drawn before the label, ahead of a leading `icon`. It stays first when `iconPosition="trailing"`, so a brand mark and a trailing chevron can share one control. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop; `data-loading` the `loading` prop; `data-inert` is set while disabled or loading
- `data-size` mirrors `size`; every variant, size and inert utility switches on these `data-*` attributes in one flat class (no class presets in script)
- `data-variant` mirrors `variant`; with `variant="link"` the button has no box (no height, padding, surface or state layer), the label is `text-body-sm` in `var(--text-link)` turning `var(--text-link-hover)` and underlined on hover, and `size` is ignored; disabled and loading drop it to `var(--text-disabled)`; under forced colors it reads as `LinkText` with no border.
- With `disabledReason` set on a `disabled` button, the root carries `aria-disabled` instead of the native `disabled` attribute, so it keeps its place in the tab order; `click` is still suppressed and the look is the disabled one. The reason is the root's `title`: the browser shows it on hover and assistive technology reads it as the button's description. The button depends on no overlay: a styled `Tooltip` around it is the consumer's choice, and it now opens on focus too, because the button can take focus.
- When `loading` turns on and `loadingLabel` is set, it is announced once through the shared polite live region (`useAnnouncer`). With no `loadingLabel` only `aria-busy` marks the state: the button has no built-in string.
- The root is one element: an anchor when `href` is set, otherwise a button. Its inner parts carry `data-slot`: `content`, `icon`, `label`, `touch-target`.
- With `type="submit"`, `disabled` (native) and `loading` (the click is cancelled) both stop the form from submitting, including implicit submission on `Enter`
- Touch: the drawn size is unchanged (28/32/40 px, all above the 24 px minimum); on a coarse pointer an invisible `[data-slot=touch-target]` span extends the hit area to at least 44 × 44 px around the button.

## Motion & Animations

| Trigger                                            | Animation / Transition                                                                                                           | Token                                                  | Reduced-motion fallback                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------- |
| hover / active (state layer fade)                  | `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance`                                              | `@aziontech/theme` semantic duration + curve           | `motion-reduce:before:transition-none` |
| hover, with `iconPosition="trailing"` + `animated` | the glyph nudges along its own axis — `transition-[translate] duration-moderate-02 ease-expressive-entrance` + `translate-x-0.5` | `--duration-moderate-02`, `--ease-expressive-entrance` | `motion-reduce:transition-none`        |
| hover, `variant="link"` (colour change)            | `transition-colors duration-fast-02 ease-productive-entrance`                                                                    | `--duration-fast-02`, `--ease-productive-entrance`     | `motion-reduce:transition-none`        |

## Tokens

| Region       | Token (DESIGN.md)                                             |
| ------------ | ------------------------------------------------------------- |
| typography   | .text-button-lg                                               |
| link variant | `.text-body-sm`, `var(--text-link)`, `var(--text-link-hover)` |
| surface      | `var(--bg-surface)`                                           |
| text         | `var(--text-default)`                                         |
| spacing      | `var(--spacing-3)`                                            |
| shape        | `var(--shape-control)`                                        |
| ring         | `var(--ring-color)`                                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Forced colors: the filled variants (primary, secondary, danger) have no border of their own, so under `forced-colors: active` every button draws a 1px `ButtonBorder` edge (`GrayText` when disabled); outside forced colors nothing changes.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): stays a native button (with `download`, `blob:` and `data:` are kept).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Motion: the hover nudge of an `icon-position="right"` arrow moves toward the end (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

- No built-in strings: the label, `disabledReason`, `loadingLabel` (and an `aria-label` when given) are consumer copy.

## Responsive

- The button never wraps its label (`whitespace-nowrap`); in a container narrower than the label the button shrinks and the `label` ends in an ellipsis (a default-slot label truncates only when it brings its own truncating element). Keep labels short, or let the layout stack buttons on narrow screens.
- Touch: drawn heights are 28 / 32 / 40 px; a `[data-slot=touch-target]` span extends the hit area to 44 px on a coarse pointer.
- No hover-only affordance: every state reads without hover.

## Performance

- Bundle budget: see `.size-limit.json` entry `button`.
- Runtime: one element plus an optional Spinner; no observers.

## Examples

- Default
- Primary (variant)
- Secondary (variant)
- Outlined (variant)
- Transparent (variant)
- Danger (variant)
- Link (variant) — shown in the Types example beside the others.
- Small (size)
- Medium (size)
- Large (size)
- Icon
- Disabled
- Disabled reason (`disabledReason`)
- Form submit (`type`) — `type` only acts inside a form, so this story renders one with a field, a reset and a submit Button

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
