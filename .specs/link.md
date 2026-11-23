---
name: link
category: navigation
structure: monolithic
status: implemented
spec_version: 7
checksum: ccbc7bf299fed77fb11732e48dd8db914b4d0ef2ee54c92473bf1309519a8578
created: 2026-05-22
last_updated: 2026-11-21
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578
  node_id: 3548:578
---

# Link — Component Spec

## Purpose

Helps users move between views or sections. Migrated from the existing implementation at `packages/webkit/src/components/navigation/link/`. Design source: [Webkit — Link](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578) (`Size` × `State` variants; hover handled in CSS).

## When to use

- Use Link when the text takes the person to another page, resource or URL.
- A standalone navigation link: a domain, a repository, a docs page, "View all".
- An in-console navigation action ("Add custom domain"): no trailing icon unless `icon` is set.
- A link inside a sentence: set `inline`, so it takes the size of the text around it and keeps the underline at rest.

## When NOT to use

- An action that changes something instead of navigating → use `button`.
- A text action that runs something instead of navigating → use `button` with `variant="link"`.

## Related

- `button` — set `href` when a link must look like a button.
- `breadcrumb` — a trail of links for hierarchical location.

## Best practices

- Always set `href` and a label that names the destination; an empty `href` renders `#` so the anchor stays focusable, and an empty label falls back to the locale catalog (`Learn more`).
- Pass the label as the default slot or the `label` prop; the slot wins when both are set.
- `target="_blank"` adds `rel="noopener noreferrer"` and, when `icon` is empty, the `az az-external-link` glyph so an off-site link reads as one; a `_blank` link also carries visually hidden text from the locale catalog (`common.newTab`, `(opens in a new tab)`) after its label, so a screen reader announces the new tab the glyph shows (the glyph stays `aria-hidden`); same-tab links show no icon unless `icon` is set.
- An icon is shown when `icon` is set.
- Match `size` to the controls around it; heights follow `button` (40 / 32 / 28 px).
- Inside running prose set `inline`: the link inherits the font size and line height of its sentence, wraps with it and keeps a quiet underline at rest (color alone fails WCAG 1.4.1); `size` does not apply.
- `disabled` drops it from the tab order and suppresses `click`; hide a link that can never be followed instead.

## Usage

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <Link
    label="View documentation"
    href="https://www.azion.com/en/documentation/"
    target="_blank"
  />
  <Link
    href="/domains/create"
    size="medium"
  >
    Add custom domain
  </Link>
  <p>
    Read the
    <Link
      href="/docs/domains"
      inline
      >domains guide</Link
    >
    before you point a record.
  </p>
</template>
```

## Props

| Prop       | Type                             | Default   | Required | JSDoc                                                                                                                                                                    |
| ---------- | -------------------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`    | `string`                         | `''`      | false    | Visible label, the default slot's fallback. Empty uses the locale catalog (`Learn more`).                                                                                |
| `size`     | `'small' \| 'medium' \| 'large'` | `'large'` | false    | Size token; affects height and typography (large 40px, medium 32px, small 28px), matching Button.                                                                        |
| `disabled` | `boolean`                        | `false`   | false    | Disables interaction and applies disabled tokens.                                                                                                                        |
| `icon`     | `string`                         | `''`      | false    | Azion icon class for the trailing icon; set shows it. Empty shows `az az-external-link` only when `target` is `_blank`.                                                  |
| `href`     | `string`                         | `''`      | false    | Destination URL for the anchor. Empty, or an unsafe URL (`javascript:`, `data:`), renders `#`.                                                                           |
| `target`   | `'_blank' \| '_self'`            | `'_self'` | false    | Link target when navigating.                                                                                                                                             |
| `inline`   | `boolean`                        | `false`   | false    | Renders the link inside running prose: it inherits the size and line height of the text around it, wraps with it and keeps the underline at rest; `size` does not apply. |

## Events

| Event   | Payload      | Notes |
| ------- | ------------ | ----- |
| `click` | `MouseEvent` | —     |

## Slots

| Slot      | Props | Notes                                                      |
| --------- | ----- | ---------------------------------------------------------- |
| `default` | —     | The link text. Fallback: `label`, then the locale catalog. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `hover` and `focus-visible` underline the label (`underline-offset-4`); there is no surface behind the link
- `data-disabled` mirrors the `disabled` prop
- `inline`: the anchor carries the `text-link` style (link colour, underline at rest, stronger on hover, outline focus ring) and `data-inline`; no box height
- Consumer attributes (`id`, `aria-*`, `download`, `rel`, `data-*`, listeners) land on the anchor through `v-bind="$attrs"`; a consumer `rel` overrides the computed one

## Motion & Animations

| Trigger      | Animation / Transition                    | Token  | Reduced-motion fallback         |
| ------------ | ----------------------------------------- | ------ | ------------------------------- |
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region     | Token (DESIGN.md)                                             |
| ---------- | ------------------------------------------------------------- |
| typography | .text-button-lg / .text-button-md; `.text-link` when `inline` |
| text       | `var(--text-link)`                                            |
| spacing    | `var(--spacing-xs)`                                           |
| shape      | `var(--shape-button)`                                         |
| ring       | `var(--ring-color)`                                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `target="_blank"` adds the visually hidden `common.newTab` text (`(opens in a new tab)`) after the label, so a screen reader hears what the external glyph shows.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): points at `#`.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: a URL printed as the link text is the consumer's; wrap it in `dir="ltr"` when it sits inside right-to-left prose.

## Examples

- Default
- Sizes
- Inline
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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
