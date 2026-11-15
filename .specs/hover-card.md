---
name: hover-card
category: overlay
structure: composition
status: implemented
spec_version: 2
template: 2
checksum: bbf664510e82aff53d3f093ac695fc0ee3e0e5c90096b7eca600f4fc0d813963
created: 2026-11-14
last_updated: 2026-11-15
---

# HoverCard — Component Spec

## Purpose

Rich preview that appears beside a link or name when the pointer rests on it or keyboard focus reaches it, and goes away when both leave. The root `HoverCard` owns the open state, the open and close delays and positioning (the shared `usePlacement`, the same engine as `Popover`); `HoverCard.Trigger` wraps the element being previewed; `HoverCard.Content` is the floating card. It sits between `Tooltip` (one line of plain text) and `Popover` (opened by a click, holds interactive content): the card shows a few lines of supplementary context, such as a person, a resource or a commit, without asking for a click.

## When to use

- Use HoverCard for a read-only rich preview (a definition, a user card, a link preview) shown on hover or focus; interactive content is a Popover and a one-line hint is a Tooltip.
- Previewing what a link points to before following it: a user handle in an audit log, a resource name in a table, a commit hash.
- Showing a summary (status, owner, last update) that the destination page also shows.

## When NOT to use

- A one-line label or hint for an icon → use `tooltip`.
- Content the user must act on (buttons, forms) or must be able to reach by touch → use `popover`.
- The only place a piece of information appears. Hover and focus are not available everywhere; the card must repeat what the destination already shows.

## Related

- `tooltip` — plain-text hint, same hover-and-focus model, no rich content.
- `popover` — click-opened panel with focus management for interactive content; same positioning.
- `avatar`, `tag` — typical content of a card.

## Best practices

- Wrap a link or a button: the trigger must be focusable on its own so keyboard users get the card too.
- Keep the card to a heading line, two or three facts and at most one secondary link; it is a preview, not a page.
- Keep the default delays (500 ms to open, 300 ms to close) so the card does not flash while the pointer crosses a list; shorten `openDelay` only for a single, deliberate target.
- The pointer can move from the trigger onto the card without closing it, so a link inside the card is reachable; `Esc` closes it.

## Usage

```vue
<script setup>
  import HoverCard from '@aziontech/webkit/hover-card'
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <HoverCard>
    <HoverCard.Trigger>
      <a href="https://example.com/people/jane-doe">Jane Doe</a>
    </HoverCard.Trigger>
    <HoverCard.Content>
      <Avatar label="Jane Doe" />
      <p class="text-body-sm">Owner of production · joined March 2024</p>
    </HoverCard.Content>
  </HoverCard>
</template>
```

Tree-shaking alternative — the same sub-components as standalone imports:

```vue
<script setup>
  import HoverCard from '@aziontech/webkit/hover-card-root'
  import HoverCardTrigger from '@aziontech/webkit/hover-card-trigger'
  import HoverCardContent from '@aziontech/webkit/hover-card-content'
</script>
```

## Sub-components

- `hover-card-trigger/hover-card-trigger.vue` — wraps the previewed element in an `inline-flex` span that carries `data-testid` (`overlay-hover-card__trigger`) and `data-state`, and is the positioning anchor. It has no role and no tab stop of its own. It schedules the open on `pointerenter` (mouse and pen only; a touch tap follows the link) and on `focusin`, and the close on `pointerleave` and `focusout`. While the card is open, the first focusable element in the slot gets `aria-describedby` pointing at the card, so screen readers read the card text after the link's name.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` with scope `{ isOpen: boolean }` — the previewed element.
- `hover-card-content/hover-card-content.vue` — the floating card. Teleported to `body`, rendered only while open, positioned by the root, `data-testid` `overlay-hover-card__content`, `data-state`, `data-placement`. Entering it with the pointer cancels a pending close and leaving it schedules one, so the pointer can travel from the trigger to the card. It has no role: it is description text for the trigger, not a dialog, and it takes no focus.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the card content.

## Props

| Prop          | Type                                                                            | Default    | Required | JSDoc                                                                                                   |
| ------------- | ------------------------------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `placement`   | `HoverCardPlacementInput` (a side with optional `-start` / `-end`, or `'auto'`) | `'bottom'` | false    | Side of the trigger the card opens on, flipped when it does not fit; `'auto'` picks the side with room. |
| `offset`      | `number`                                                                        | `8`        | false    | Pixel gap between the trigger and the card.                                                             |
| `openDelay`   | `number`                                                                        | `500`      | false    | Milliseconds the pointer or focus must stay on the trigger before the card opens.                       |
| `closeDelay`  | `number`                                                                        | `300`      | false    | Milliseconds after the pointer or focus leaves the trigger and the card before the card closes.         |
| `disabled`    | `boolean`                                                                       | `false`    | false    | Never opens the card.                                                                                   |
| `defaultOpen` | `boolean`                                                                       | `false`    | false    | Initial open state while `v-model:open` is unbound.                                                     |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                     |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`. While unbound the card is uncontrolled and starts at `defaultOpen`. |

## Events

_No events of its own: `update:open` comes from `v-model:open` (see v-model above)._

## Slots

| Slot      | Scope | Notes                                                          |
| --------- | ----- | -------------------------------------------------------------- |
| `default` | —     | Place one `<HoverCard.Trigger>` and one `<HoverCard.Content>`. |

## States

- `data-state` (root, trigger, content): `open` | `closed`.
- `data-disabled` on the root mirrors `disabled`; the card never opens.
- `data-placement` on the content mirrors the resolved placement.
- `loading`, `empty`, `error`, `readonly`, `invalid`: not states of this component; a preview that loads data shows a `Skeleton` inside `HoverCard.Content`, owned by the consumer.

## Motion & Animations

| Trigger    | Animation / Transition                                  | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ---------- | ------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| card open  | `animate-popup-scale-in` (origin from `--popup-origin`) | semantic (`moderate-01` · `productive-entrance`)  | `motion-reduce:animate-none` (instant) |
| card close | `animate-popup-scale-out`                               | semantic (`fast-02` · `productive-exit`)          | `motion-reduce:animate-none` (instant) |

## Tokens

| Region       | Token (DESIGN.md)                         |
| ------------ | ----------------------------------------- |
| card surface | `var(--bg-surface-raised)`                |
| card border  | `var(--border-default)`                   |
| card shape   | `var(--shape-elements)`                   |
| card shadow  | `var(--shadow-sm)`                        |
| card padding | `var(--spacing-md)`                       |
| card gap     | `var(--spacing-sm)`                       |
| card width   | `--container-3xs` to `--container-xs`     |
| card text    | `.text-body-sm` + `text-(--text-default)` |
| popup origin | `var(--popup-origin)`                     |

## Theme gaps

_none_ — the card uses the same surface tokens as `popover`.

## Accessibility (WCAG 2.1 AA)

- Content on hover or focus (WCAG 1.4.13): dismissible (`Esc` closes it without moving focus), hoverable (the pointer can move onto the card; `closeDelay` and the card's own pointer handlers keep it open), persistent (it stays until pointer and focus leave or `Esc`).
- Keyboard map: `Tab` onto the trigger's link opens the card after `openDelay`; `Tab` away closes it after `closeDelay`; `Esc` closes it. The card takes no focus. Tests: `hover-card.test.ts` › keyboard.
- ARIA: while open, the trigger's focusable element carries `aria-describedby` pointing at the card; the card has no role and no `aria-modal`. The trigger wrapper adds no role or tab stop.
- Visible focus: the focus ring belongs to the consumer's link or button.
- Contrast ≥4.5:1 for card text on `--bg-surface-raised`.
- `motion-reduce:animate-none` on `animate-popup-scale-*`.
- Teleported card: binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`).

## Internationalization

No built-in strings: the card shows only consumer content.

- Formatting: none (dates or counts inside the card are formatted by the consumer with `Intl`).

## Right-to-left

- Layout: logical utilities only; the card binds `dir` from `WebkitProvider`.
- Icons: none.
- Keyboard: no arrow keys.
- User data: consumer content; wrap names and domains in `<bdi>` inside the card.
- Placement: `-start` / `-end` align to the trigger's physical left / right edge, as in `Popover`.

## Responsive

- Container queries: none; the card is between `--container-3xs` and `--container-xs` wide.
- Narrow (≤ 640 px or a narrow container): `usePlacement` flips to the side with room and shifts the card inside the viewport; a long card scrolls inside a height cap.
- Touch: hover is not available on touch, so a tap follows the trigger's link and the card does not open; the destination page carries the same information (see When NOT to use). Keyboard focus opens the card.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./hover-card-root`, `./hover-card-trigger` and `./hover-card-content` have entries in `.size-limit.json`; `./hover-card` carries all three.
- Runtime budget: a closed card renders nothing but the trigger wrapper, so a table with a card per row adds one span and listeners per row; 1,000 triggers mount in a single frame budget.
- Heavy parts: none.

## Examples

Canonical layout — composite examples (`types.vue`, `sizes.vue`) render every variant of one axis side-by-side in a single frame; state examples (`loading.vue`, `disabled.vue`) change only the prop they demonstrate.

- Default — a user link in a sentence; the card shows an avatar, name, role and a fact. Opens on hover or focus.
- ResourcePreview — card forced open (`default-open`) on a resource name in a table cell, showing status, region and last deploy. Required because the forced-open card is the only way to show the card's anatomy without a pointer, and table rows are the main use.
- Disabled — the same link with `disabled`; no card.

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
