---
name: kbd
category: content
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: 05c5f913eb84ab1c53e92530be48daf4af939ccf040f7220379e6491e94fd75a
created: 2026-07-23
last_updated: 2026-11-15
---

# Kbd — Component Spec

## Purpose

Kbd renders keyboard input — a single key or a shortcut combination — as a compact, non-interactive keycap. It reads like a real key: a bordered surface with a thicker bottom edge for depth. Modifier keys are passed as boolean props (`meta`, `shift`, `alt`, `ctrl`) and rendered with the correct OS-aware glyph (⌘ on macOS, the catalog's `Ctrl` elsewhere), and named keys (`keyName`) print their localized name, so consumers never hardcode platform symbols or English key names. The platform is read once mounted: the server and the first client render print the non-Mac names, then a Mac swaps in its glyphs, so hydration never mismatches. Use it for shortcut hints in prose, menus, and control suffixes (e.g. the ⌘K hint in `command`). A sequence can also be passed as a `keys` list (`['meta', 'shift', 'p']`, `['arrow-up', 'arrow-down']`), drawn either as one keycap (`kind="combined"`, the default) or as one keycap per key (`kind="separate"`, each a nested `<kbd>` as HTML specifies for key combinations). Arrow keys and the Return glyph (`↵`) are named keys like `escape`.

## When to use

- Show a keyboard shortcut or a single key inline (a ⌘K hint on a search button, an `Esc` hint in a dialog, `/` to focus search).
- Present a modifier combination whose glyph should adapt to the user's OS.

## When NOT to use

- The token is a status/category label, not a key → use `tag` or `badge`.
- You need an interactive control that fires on click → use `button` / `icon-button`; Kbd is a presentational hint only.

## Related

- `command` — consumes Kbd for its per-item shortcut hints and its ⌘K trigger affordance.
- `badge` — compact non-interactive indicator for counts/status; Kbd is specifically for keyboard keys.

## Best practices

- Keep the default slot to a single key or glyph (`K`, `7`, `Enter`, `Esc`, `/`); avoid lowercase words or sentences.
- Pass modifiers as boolean props rather than hardcoding `⌘`/`⇧` so the glyph adapts to the OS.
- Name a key with `key-name` (`<Kbd key-name="escape" />`) instead of typing `Esc` or `Enter`: the text comes from the locale catalog (`kbd.*`), so it follows `WebkitProvider` (`Espaço` in pt-BR, `Intro` in es) and a consumer renames it with `messages` (`{ kbd: { ctrl: 'Strg' } }`). The macOS symbols `⌘`, `⌃`, `⌥` and `⇧` are never translated.
- Place surrounding punctuation outside the element, not inside the keycap.
- Use `keys` when the shortcut comes from data (a command list, a settings table); use the boolean props when you write it by hand. Pick `kind="separate"` for a sequence pressed key by key or for arrow pairs (`↑` `↓` to navigate), `combined` for a chord pressed at once.
- Name the Return key `return` (`↵`) in compact hints (a footer "↵ to select"); keep `enter` (`Enter`) where the word reads better.

## Usage

```vue
<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <Kbd meta>K</Kbd>
</template>
```

## Props

| Prop      | Type                                                                                                                                                                          | Default      | Required | JSDoc                                                                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `meta`    | `boolean`                                                                                                                                                                     | `false`      | false    | Prepend the meta/command modifier glyph (⌘ on macOS, Ctrl elsewhere).                                                                                                                                                         |
| `ctrl`    | `boolean`                                                                                                                                                                     | `false`      | false    | Prepend the Control modifier glyph (⌃ on macOS, Ctrl elsewhere).                                                                                                                                                              |
| `shift`   | `boolean`                                                                                                                                                                     | `false`      | false    | Prepend the Shift modifier glyph (⇧).                                                                                                                                                                                         |
| `alt`     | `boolean`                                                                                                                                                                     | `false`      | false    | Prepend the Alt/Option modifier glyph (⌥ on macOS, Alt elsewhere).                                                                                                                                                            |
| `size`    | `'small' \| 'medium'`                                                                                                                                                         | `'medium'`   | false    | Size token; `small` is a denser keycap for menus, command bars, and table cells.                                                                                                                                              |
| `keyName` | `'' \| 'ctrl' \| 'alt' \| 'shift' \| 'escape' \| 'enter' \| 'space' \| 'tab' \| 'backspace' \| 'delete' \| 'return' \| 'arrow-up' \| 'arrow-down' \| 'arrow-left' \| 'arrow-right'` | `''`         | false    | Named key printed from the locale catalog (`escape` → `Esc`, `enter` → `Enter`); the slot still renders after it.                                                                                                             |
| `keys`    | `string[]`                                                                                                                                                                    | `[]`         | false    | A key sequence drawn after the modifier props and `keyName`: `meta`/`ctrl`/`alt`/`shift` print their OS-aware glyph, a named key prints from the catalog, a single character is upper-cased, anything else prints as written. |
| `kind`    | `'combined' \| 'separate'`                                                                                                                                                    | `'combined'` | false    | Visual variant: one keycap holding every key, or one keycap per key.                                                                                                                                                          |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                             |
| --------- | ----- | --------------------------------------------------------------------------------- |
| `default` | —     | The single key or glyph rendered after any modifier glyphs (`K`, `Enter`, `Esc`). |

## States

Kbd is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-size` mirrors the `size` prop (`small` | `medium`).
- `data-kind` mirrors the `kind` prop (`combined` | `separate`). With `separate` the root drops its keycap chrome (border, surface, shadow, padding) and each key renders as a nested `<kbd>` keycap with the same size tokens, separated by `--spacing-xxs`.

## Motion & Animations

_none_

## Tokens

| Region                                        | Token (DESIGN.md)                      |
| --------------------------------------------- | -------------------------------------- |
| typography (medium)                           | `.text-overline-md` + `leading-none`   |
| typography (small)                            | `.text-overline-sm` + `leading-none`   |
| surface                                       | `var(--bg-surface)`                    |
| label                                         | `var(--text-default)`                  |
| border (keycap outline + thicker bottom edge) | `var(--border-default)`                |
| shape                                         | `var(--shape-elements)`                |
| elevation (keycap lift)                       | `var(--shadow-sm)`                     |
| spacing (medium)                              | `var(--spacing-xs)` horizontal padding |
| spacing (small)                               | `var(--spacing-xs)` horizontal padding |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — Kbd is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Kbd is a presentational hint and exposes no interactive affordance.
- ARIA: the root is the native `<kbd>` element so assistive tech announces it as keyboard input; modifier glyphs render as text so a combination like ⌘K is announced in reading order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-default)` on `var(--bg-surface)` is theme-guaranteed in both light and dark.
- `motion-reduce:*`: not applicable — Kbd is static (no motion).
- Touch target: not applicable — Kbd is non-interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: modifier symbols (`⌘`, `⌥`, `⇧`) never mirror.
- Keyboard: no horizontal arrow-key logic. The arrow glyphs name physical keys, so `arrow-left` stays `←` under `dir="rtl"`.
- Isolation: the keycap renders `dir="ltr"`, so a shortcut such as `Ctrl` `K` keeps its order inside right-to-left text; key names come from the locale catalog (`kbd.*`).

## Internationalization

| Key                                  | English source                                     | Override prop |
| ------------------------------------ | -------------------------------------------------- | ------------- |
| `kbd.ctrl` / `kbd.alt` / `kbd.shift` | `Ctrl` / `Alt` / `Shift`                           | —             |
| `kbd.escape` … `kbd.delete`          | `Esc`, `Enter`, `Space`, `Tab`, `Backspace`, `Del` | —             |
| `kbd.return`                         | `↵`                                                | —             |
| `kbd.arrow-up` … `kbd.arrow-right`   | `↑` `↓` `←` `→`                                    | —             |

- The glyph entries (`return`, arrows) are the same in every locale; they live in the catalog so a consumer can rename them with `messages` like any key name.
- Literal `keys` entries and the slot are consumer copy.

## Responsive

- A keycap never wraps inside itself (`inline-flex`); a `separate` sequence wraps between keycaps only where the surrounding text wraps.
- No touch target and no hover affordance: Kbd is non-interactive.

## Performance

- Bundle budget: `.size-limit.json` entry `kbd`.
- Runtime: renders one span or nested keycap per key; no observers, no listeners.

## Examples

- Default
- Sizes — composite story rendering every `size` value side-by-side.
- Keys — a `keys` list drawn both ways (`combined` and `separate`), the arrow pair and the Return glyph. Justified addition: `keys`, `kind` and the new named keys are public API no other story shows.
- Combinations — composite story rendering representative shortcuts (single key, `meta` + key, `meta` + `shift` + key, a named key like `Esc`). Justified addition: the modifier props (`meta`/`ctrl`/`shift`/`alt`) are the component's primary feature and compose along multiple boolean axes at once — there is no single `kind` axis, so a composite that shows real combinations (and the OS-aware glyphs) is the only way to document the core behavior.

<!-- Types story omitted: Kbd has no `kind` axis. Loading/Disabled omitted: Kbd declares neither prop and is non-interactive. -->

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
