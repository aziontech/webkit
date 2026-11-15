---
name: alert
category: feedback
structure: monolithic
status: implemented
spec_version: 3
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-892
  node_id: 478:892
checksum: b52868a1bb5bd53a60635fb0682e69869b8df261cdadba47125ce7f2279446d8
created: 2026-05-22
last_updated: 2026-11-15
---

# Alert — Component Spec

## Purpose

Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with a leading icon, an optional bold `title` over the copy, and message copy that may carry inline links, plus an optional secondary action button.

## When to use

- A status, warning or error that belongs to a page, section or form and should stay visible in context.
- A notice with an inline link, or with one follow-up action (`actionLabel` or the `action` slot).
- A notice that needs a short headline and a sentence of detail (`title` over the copy): "Maintenance scheduled" over the window and what changes.

## When NOT to use

- A transient confirmation of an action → use `toast`.
- Validation feedback under one form field → use `helper-text`.
- An admonition inside documentation prose → use `doc-callout`.
- A promotional band between page sections → use `banner`.

## Related

- `toast` — overlay stack raised imperatively, auto-dismissing and not anchored to content.
- `helper-text` — field-level guidance and errors below an input.
- `doc-callout` — docs admonition rendered on the `Alert` surface.
- `empty-state` — a full zero-data block, not a status banner.

## Best practices

- Pick `severity` by meaning. `danger` and `warning` render with `role="alert"`.
- Use `label` for plain copy and the default slot when the copy needs inline links.
- Set `title` when the alert says two things: what happened (the title, a few words, no end period) and what it means or what to do (the copy). A one-sentence alert needs no title. A title alone, with no copy, is allowed for a short notice that still wants the heading weight.
- Use either the built-in action (`actionLabel` with `@action`) or the `action` slot, not both. The slot replaces the button.
- Once `closable` or `life` dismisses the message, it stays hidden until it is remounted. Listen to `close` to keep your own state in sync.
- Use `size="small"` inside dense surfaces such as cards and drawers.

## Usage

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <!-- Plain copy via the label prop -->
  <Alert
    severity="info"
    label="Deployment finished in 42 seconds."
  />

  <!-- Copy with inline links via the default slot -->
  <Alert severity="warning">
    Your plan is close to its request limit.
    <a href="/billing">Upgrade the plan</a>
    to avoid throttling.
  </Alert>

  <!-- A bold title over the description -->
  <Alert
    severity="warning"
    title="Maintenance scheduled"
    label="The dashboard is read-only on March 4 from 02:00 to 03:00 UTC."
  />
</template>
```

## Props

| Prop          | Type                                           | Default    | Required | JSDoc                                                                                             |
| ------------- | ---------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------- |
| `severity`    | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`   | false    | Visual severity variant.                                                                          |
| `size`        | `'small' \| 'medium'`                          | `'medium'` | false    | Size token. Drives the banner height, inline padding, copy scale, and the trailing control sizes. |
| `label`       | `string`                                       | `''`       | false    | Fallback message copy when the default slot is empty.                                             |
| `title`       | `string`                                       | `''`       | false    | Bold heading above the message copy; hidden when empty.                                           |
| `icon`        | `string`                                       | `''`       | false    | PrimeIcons class override for the leading icon.                                                   |
| `actionLabel` | `string`                                       | `''`       | false    | Label for the built-in secondary action button; hidden when empty.                                |
| `closable`    | `boolean`                                      | `false`    | false    | When true, shows a close control that dismisses the message.                                      |
| `life`        | `number`                                       | `0`        | false    | Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss.                          |

## Events

| Event    | Payload      | Notes                                                                   |
| -------- | ------------ | ----------------------------------------------------------------------- |
| `action` | `MouseEvent` | Emitted when the built-in action button is clicked.                     |
| `close`  | `(event?: Event)` | Emitted when the message is dismissed, after the fade. Carries the originating event: the close button's `MouseEvent` or the `Escape` `KeyboardEvent`; no argument after `life` expires. |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                                                                                                                                                                                                                     |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`  | —     | Custom action control; replaces the built-in Button when provided.                                                                                                                                                                                                                                                                                                        |
| `default` | —     | Alert copy. Inline content — plain text plus anchors, which the message region styles with the `.text-link` token — or flow content such as paragraphs and a list. The copy region is a flow container (a `div`, not a `p`), so block markup arriving from a server render stays inside it instead of being closed out beside the copy. Falls back to `label` when empty. |

## States

- Visual states: default (per severity)
- `data-titled` on the root mirrors a non-empty `title`: the title renders above the copy in `.text-heading-xxs` (`__title`), and the copy keeps its size below it. With a title and no copy (no default slot, empty `label`), only the title renders.
- Responsive: the root is the `@container/alert`. Below `@sm` of its box the action (built-in or the `action` slot, wrapped in `[data-slot=alert-action]`) moves to its own line under the message while the close button stays on the message line.

## Motion & Animations

| Trigger | Animation / Transition      | Token                                                           | Reduced-motion fallback         |
| ------- | --------------------------- | --------------------------------------------------------------- | ------------------------------- |
| dismiss | `transition-opacity duration-fast-02 ease-productive-exit` on the leave-active class (no inline `transition`, so the reduced-motion class wins) | `duration['fast-02']` · `curve['productive-exit']` (animate.js) | `motion-reduce:transition-none` |

## Tokens

| Region                                                | Token (DESIGN.md)                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| message typography (small)                            | `.text-label-sm` — 12px                                                                                                                                                                                                                                                               |
| message typography (medium)                           | `.text-label-md` — 14px                                                                                                                                                                                                                                                               |
| title typography                                      | `.text-heading-xxs` — a flat 14px heading at both sizes, so the title stands out from the copy by weight                                                                                                                                                                              |
| title text                                            | `var(--text-default)`                                                                                                                                                                                                                                                                 |
| spacing (title to copy)                               | `var(--spacing-xxs)` — 4px                                                                                                                                                                                                                                                            |
| inline link (anchor inside the message)               | `.text-link` with its color set to `currentColor` (the message copy color), told apart by the underline, so it keeps AA contrast on every severity surface                                                                                                                            |
| leading icon glyph                                    | `.text-label-md` — 14px at both sizes; the icon does not scale with the banner                                                                                                                                                                                                        |
| leading icon box                                      | `size-3.5` — 14px, matching the glyph so the row height is stable                                                                                                                                                                                                                     |
| leading icon alignment                                | the icon and the copy share an `items-start` block, and the icon rides an alignment box the height of the copy's line box (`h-5.25` medium / `h-4.5` small) — so it centers on the **first** line and stays there when the copy wraps, instead of drifting to the middle of the block |
| action typography                                     | `.text-button-md` — both Button sizes use this step                                                                                                                                                                                                                                   |
| action size                                           | tracks `size`: `small` → Button `small` (28px), `medium` → Button `medium` (32px)                                                                                                                                                                                                     |
| action surface                                        | `var(--secondary)` — the built-in action is a `secondary` Button, so it reads as a control against every severity surface rather than as body copy                                                                                                                                    |
| action text                                           | `var(--secondary-contrast)`                                                                                                                                                                                                                                                           |
| close control size                                    | tracks `size`: `small` → IconButton `small` (28px), `medium` → IconButton `medium` (32px)                                                                                                                                                                                             |
| close control surface                                 | transparent — the close is a `transparent` IconButton, so the severity surface shows through and the glyph does not compete with the action                                                                                                                                           |
| close control glyph                                   | `var(--text-default)`                                                                                                                                                                                                                                                                 |
| surface (info)                                        | `var(--info)`                                                                                                                                                                                                                                                                         |
| surface (success)                                     | `var(--success)`                                                                                                                                                                                                                                                                      |
| surface (warning)                                     | `var(--warning)`                                                                                                                                                                                                                                                                      |
| surface (danger)                                      | `var(--danger)`                                                                                                                                                                                                                                                                       |
| border (info)                                         | `var(--info-border)`                                                                                                                                                                                                                                                                  |
| border (success)                                      | `var(--success-border)`                                                                                                                                                                                                                                                               |
| border (warning)                                      | `var(--warning-border)`                                                                                                                                                                                                                                                               |
| border (danger)                                       | `var(--danger-border)`                                                                                                                                                                                                                                                                |
| icon (info)                                           | `var(--info-contrast)`                                                                                                                                                                                                                                                                |
| icon (success)                                        | `var(--success-contrast)`                                                                                                                                                                                                                                                             |
| icon (warning)                                        | `var(--warning-contrast)`                                                                                                                                                                                                                                                             |
| icon (danger)                                         | `var(--danger-contrast)`                                                                                                                                                                                                                                                              |
| text                                                  | `var(--text-default)`                                                                                                                                                                                                                                                                 |
| muted text                                            | `var(--text-muted)`                                                                                                                                                                                                                                                                   |
| spacing (padding block)                               | `py-1.5` — 6px; no semantic token sits between `--spacing-xxs` (4px) and `--spacing-xs` (8px)                                                                                                                                                                                         |
| spacing (padding inline, small)                       | `var(--spacing-xs)` — 8px                                                                                                                                                                                                                                                             |
| spacing (padding inline, medium)                      | `var(--spacing-sm)` — 12px                                                                                                                                                                                                                                                            |
| spacing (padding inline end, with a trailing control) | `var(--spacing-xs)` — 8px, tightened; the trailing action/close control carries its own padding                                                                                                                                                                                       |
| spacing (gap)                                         | `var(--spacing-sm)` — 12px at every breakpoint; only the `lg`/`xl`/`xxl` steps scale responsively                                                                                                                                                                                     |
| shape                                                 | `var(--shape-button)` — 6px, identical to `rounded-md`                                                                                                                                                                                                                                |
| shadow                                                | `var(--shadow-xs)`                                                                                                                                                                                                                                                                    |
| ring                                                  | `var(--ring-color)`                                                                                                                                                                                                                                                                   |
| height (small)                                        | `min-h-8` — 32px floor; grows with wrapped copy or a trailing control                                                                                                                                                                                                                 |
| height (medium)                                       | `min-h-9` — 36px floor; grows with wrapped copy or a trailing control                                                                                                                                                                                                                 |

## Theme gaps

| Figma variable    | Temporary primitive                       | Follow-up                                                                                                                                                                                          |
| ----------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| block padding 6px | `py-1.5` (`calc(var(--spacing) * 1.5)`)   | Add a 6px semantic spacing step if a second component needs it; today only this banner does.                                                                                                       |
| icon box 14px     | `size-3.5` (`calc(var(--spacing) * 3.5)`) | The theme has no icon-size scale, so the box is spacing-derived while the glyph rides the `.text-label-md` font-size token. Add an icon-size scale when a second component needs a non-16px glyph. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses inline links in the message copy, then the action and close controls when present; `Enter` follows a link, `Enter`/`Space` activates the controls; `Escape` dismisses when `closable` is true.
- ARIA: root uses `role="alert"` for danger/warning severities and `role="status"` for info/success. The title is text inside the live region, read before the copy; it is not a document heading, so it does not enter the page outline.
- Inline links are underlined, not colour-only, so they stay distinguishable against every severity surface (WCAG 1.4.1); the `.text-link` token supplies the focus outline.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on the dismiss fade; nothing sets the transition inline.
- Touch target ≥40×40 px where the control is interactive.

## Internationalization

| Key           | English source  | Override prop |
| ------------- | --------------- | ------------- |
| `alert.close` | `Close message` | —             |

- Formatting: none; `title`, `label` and the slot copy come from the consumer.

## Right-to-left

- Layout: logical utilities only (`pe-`, `gap`, flex order), so the icon leads and the controls trail under `dir="rtl"`.
- Icons: severity glyphs and the close `×` are not mirrored.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: the root is `@container/alert`; below `@sm` the action moves to its own line under the message.
- Narrow (≤ 640 px or a narrow container): the title and copy wrap; the close button stays on the first line.
- Touch: the action and close take Button / IconButton sizes (28 or 32 px); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long words break (`break-words`).

## Performance

- Bundle budget: 6.5 KB gzip for `alert` in `.size-limit.json`.
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default
- Types
- Sizes
- WithLinks — the inline-link anatomy is the reason this component was reshaped; the default slot's link handling is not reachable from any arg-driven story, so it needs its own composite story.
- WithTitle — justified: `title` adds a second text level (a bold heading over the copy) that none of the other examples shows; one alert per severity a console raises with a headline and a sentence of detail.
- Closable
- AutoDismiss

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
