---
name: search-trigger
category: actions
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: 6fa2b20a73c52eb8f418ff0d436d40ac7d761b8398c06f8050cd3ed90b512349
created: 2026-11-12
last_updated: 2026-11-12
---

# SearchTrigger — Component Spec

## Purpose

The field-shaped button in a top bar that opens search: a magnifier, a muted label (`Search` by default) and the keycap of the shortcut that opens the same palette (`⌘K` on macOS, `Ctrl K` elsewhere, drawn by `Kbd`). It looks like an input so the bar reads "you can search here", but it is one `<button>` that emits `open` — on click and on the shortcut itself, which it binds on the window unless a mounted `Command` already listens for it. The consumer opens `Command` (or its own search) from `open`. Every app header — console, demo, docs and site — carries one: it is the single way search is offered in a top bar. With `collapsible` it folds to the magnifier alone inside a narrow container (with its label as a tooltip), so one element serves the wide and the narrow bar.

## When to use

- The search entry of every app header — console, demo, docs or site top bar (`GlobalHeader.Right`) — that opens the `Command` palette or a search dialog. A header without it is incomplete.
- Anywhere a shortcut-backed launcher should look like a field without being one.

## When NOT to use

- To type a query in place (filter a list, search a table) → use `Input` with a search icon, `PropertyFilter`, or the `Table` search part.
- For the palette itself → use `Command`; this only opens it.
- For an icon-only toolbar action that is not search → use `IconButton`.

## Related

- `Command` — the palette this button opens; when it is mounted it owns the global ⌘K / Ctrl+K listener and `v-model:open`, and the trigger stands its own listener down.
- `Kbd` — draws the keycap with the OS-aware modifier glyph.
- `IconButton` — the shape the trigger folds to when `collapsible` and the container is narrow.
- `Tooltip` — shows the label over the folded magnifier on hover and focus.
- `GlobalHeader` — the bar it sits in, usually in `GlobalHeader.Right`.

## Best practices

- Wire `@open` to the same state the shortcut opens (`<Command v-model:open="open">`), so the button and ⌘K never disagree. Without a `Command` on the page, `@open` also fires on ⌘K / Ctrl K, so a custom search dialog gets the shortcut for free.
- Keep `shortcut` equal to the key the `Command` root listens for (`K`), or clear it (`shortcut=""`) when no shortcut exists.
- Do not hand-roll the field (`<button>` + magnifier + `Kbd`) or put a bare magnifier `IconButton` in a header: the `webkit/header-search-trigger` lint rule flags both.
- With `collapsible`, put the bar inside an `@container` (the header blocks do); the trigger folds while that container is narrower than 47rem (752 px, the `--container-2xl` token) and without a container it stays folded. Do not add your own breakpoint around it: 47rem is the one threshold every header uses.
- With `collapsible`, the button sits inside the `Tooltip` wrapper, so put layout classes (`ms-auto`, `order-*`) on a parent, not on the trigger.
- Name the target in the label when the scope is narrow (`Search docs`); the label is also the accessible name.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Command from '@aziontech/webkit/command'

  const open = ref(false)
</script>

<template>
  <SearchTrigger @open="open = true" />
  <Command v-model:open="open" />
</template>
```

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                                                                  |
| ------------- | --------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | false    | Visible muted text and accessible name; empty uses the catalog's `Search`.                                             |
| `shortcut`    | `string`  | `'K'`   | false    | Key that opens search with ⌘ or Ctrl: drawn in the keycap, announced through `aria-keyshortcuts` and bound on the window unless a mounted `Command` already listens for it; empty removes all three. |
| `collapsible` | `boolean` | `false` | false    | Folds to the magnifier alone while the nearest container is narrower than 47rem (752px, the `--container-2xl` token); the label stays the accessible name and shows as a tooltip on hover and focus. |
| `disabled`    | `boolean` | `false` | false    | Disables the button and its shortcut; `open` is not emitted. |

## Events

| Event   | Payload      | Notes                                                                               |
| ------- | ------------ | ----------------------------------------------------------------------------------- |
| `open` | `MouseEvent \| KeyboardEvent` | Fires when the button is activated (pointer, Enter or Space) and on ⌘K / Ctrl K when no mounted `Command` claims that shortcut; not while `disabled`. |

## Slots

_none_

## States

- Visual states: `default`, `hover` (border strengthens), `focus-visible` (ring), `disabled`.
- `data-disabled` mirrors `disabled`; `data-collapsible` mirrors `collapsible`.
- Folded (`collapsible` in a container narrower than 47rem): a `Tooltip` (`placement="bottom"`, test id `<testid>__tooltip`) shows the label on hover and focus. It is disabled while the trigger is unfolded or `disabled`; the trigger measures its own label with a `ResizeObserver` to know which form is drawn.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed` (the palette owns open state).

## Motion & Animations

| Trigger                  | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------ | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover/focus state change | `transition-colors duration-fast-02 ease-productive-entrance` | semantic (fast-02 · productive entrance)          | `motion-reduce:transition-none` |

## Tokens

| Region   | Token (DESIGN.md)                                           |
| -------- | ----------------------------------------------------------- |
| surface  | `var(--bg-surface)`                                         |
| border   | `var(--border-default)`, hover `var(--border-strong)`       |
| label    | `.text-label-sm`, `var(--text-muted)`                       |
| icon     | `var(--text-muted)`                                         |
| spacing  | `var(--spacing-xs)` gap, `var(--spacing-sm)` inline padding |
| shape    | `var(--shape-elements)`                                     |
| ring     | `var(--ring-color)`, offset `var(--bg-canvas)`              |
| disabled | `var(--bg-disabled)`, `var(--text-disabled)`                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`aria-label` keeps it when the label is visually hidden in the folded form).
- Shortcut: `aria-keyshortcuts="Meta+K Control+K"` (both chords `Command` listens for, so the server and the client render the same attribute) when `shortcut` is set; the keycap is `aria-hidden` so the name is not read twice.
- Keyboard map: `Tab` focuses; `Enter` and `Space` activate; `⌘K` / `Ctrl K` anywhere on the page opens search (handled by `Command` when one is mounted, otherwise by the trigger, which emits `open`).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Disabled: native `disabled` (out of the tab order, not announced as actionable); text and border keep ≥ 3:1 against the surface.
- Contrast: muted label ≥ 4.5:1 on `--bg-surface` in light and dark; magnifier ≥ 3:1.
- `motion-reduce:transition-none` on the colour transition.
- Touch target: drawn 32 px tall in the wide form and 32 × 32 px folded on every pointer, the same box as the header's `IconButton` medium neighbours. On a coarse pointer an invisible `aria-hidden` span (`data-slot="touch-target"`, `inset-[min(0rem,calc(50%-22px))]`, the `IconButton` technique) grows the hit area to at least 44 × 44 px without changing the drawn size.

## Internationalization

| Key                   | English source | Override prop |
| --------------------- | -------------- | ------------- |
| `searchTrigger.label` | `Search`       | `label`       |

- Formatting: none. The modifier glyph comes from `Kbd` (`kbd.ctrl` on non-Apple platforms).

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`, `text-start`); the magnifier leads at the inline start.
- Icons: the magnifier and the keycap are not mirrored.
- Keyboard: no arrow keys.
- User data: none; the keycap is `dir="ltr"` (from `Kbd`) so `⌘K` keeps its order.

## Responsive

- Container queries: with `collapsible`, while the nearest `@container` is narrower than 47rem (`@min-[47rem]`, 752 px, equal to the `--container-2xl` token) the label and keycap hide and the button becomes a 32 × 32 px square with a tooltip; from 47rem it is the field (`w-56`). The threshold is the design sample's measured one (the console bar with breadcrumb, Create, Agent and avatar runs out of room at 740 px of content box). It is written as `@min-[47rem]` and not `@2xl` because the theme ships its container scale in `:root`, not in `@theme`, so Tailwind's `@2xl` still compiles to its own 42rem.
- Narrow: without `collapsible` the label truncates with an ellipsis and the keycap stays.
- Touch: drawn at 32 px everywhere; the hit area grows invisibly to 44 px on `pointer: coarse`; no hover-only affordance (hover only strengthens the border; the folded tooltip also opens on focus).
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the field shrinks to its content.

## Performance

- Bundle budget: 8.5 KB gzip for `./search-trigger` in `.size-limit.json` (8.05 KB measured standalone; includes `Kbd`, `Tooltip` with its placement composable, the translate composable and the window `keydown` listener with the shared shortcut registry). Raised from 4 KB for the folded tooltip: `Tooltip` is 4.5 KB of it, and an app header already ships `Tooltip` for its other icon buttons, so the marginal cost in a real bundle is the wrapper alone.
- Runtime budget: one `keydown` listener on the window and one `ResizeObserver` on the button (VueUse, disposed with the component) while mounted.
- Heavy parts: none.

## Examples

- Default — the field with its `⌘K` / `Ctrl K` keycap.
- Collapsible — the same trigger in a narrow and a wide `@container`, folded (tooltip on hover and focus) and unfolded.
- Disabled — `disabled`.

The Collapsible example is justified: `collapsible` is the prop whose output depends on the container, and only a side-by-side frame shows both forms.

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
