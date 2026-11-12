---
name: button-group
category: actions
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 5a31ef1e5ebf5f9cd4b47cecba2c523cbaa8270d8318907f1aaa1f0cae550cd1
created: 2026-11-11
last_updated: 2026-11-12
---

# ButtonGroup — Component Spec

## Purpose

A toolbar of icon actions that belong to one surface (a code panel, a table header, a preview), after Cloudscape's button group. Each item is an icon button that names itself in a tooltip: a plain action, an on / off toggle, or a menu of options. Items past `visibleCount` collapse into one More actions menu. The toolbar is one tab stop with roving focus, so a row of six icons costs the keyboard user one Tab, not six.

## When to use

- A row of icon actions on one surface: Copy, Format, Wrap lines, Download above a code editor.
- Compact actions in a panel header where labels would not fit, each explained by its tooltip.
- A mix of actions and on / off view toggles (wrap lines, show whitespace) that sit together.
- More actions than the space allows: keep the frequent ones visible and move the rest into the overflow menu with `visibleCount`.

## When NOT to use

- A choice of exactly one option among several (view mode, period) → use `toggle-group`.
- One primary action with related alternatives → use `split-button`.
- A single icon action → use `icon-button` (with a `tooltip`).
- Page or form actions with text labels (Save, Cancel, Create) → use `button`s laid out by the page.
- A long list of commands or navigation → use `dropdown-menu`.

## Related

- `icon-button` — every item renders one; ButtonGroup adds the toolbar role, roving focus and overflow.
- `toggle-group` — a radiogroup of mutually exclusive options; ButtonGroup toggles are independent (`aria-pressed`).
- `split-button` — one main action plus a menu, with a visible text label.
- `dropdown-menu` — the menu behind menu items and the More actions overflow.
- `tooltip` — the visible name of each icon.
- `code-editor` — the usual host of an editor toolbar (`toolbar` slot).

## Best practices

- Give the toolbar an `aria-label` that names the surface ("Editor actions"), and every item a `label` that says what it does ("Copy code", not "Copy"). Write the kebab attribute (`aria-label`, `:aria-label` when the name changes, `aria-labelledby` when a visible heading already names the surface), never the camelCase `ariaLabel` attribute.
- The `ariaLabel` prop is optional in the types on purpose: vue-tsc does not camelize `aria-*` attributes onto props, so a required `ariaLabel` made the obvious `aria-label="…"` fail to type-check in a fresh create-vue app. The lint rule `webkit/accessible-name` keeps the name required instead: it flags a `ButtonGroup` with neither `aria-label` nor `aria-labelledby`.
- Keep the most used actions first; `visibleCount` moves the tail into More actions, never the head.
- Use a toggle only for a state the user can see change (wrapped lines); flip `pressed` in your `@toggle` handler — the component never stores it.
- Set `loading` on an action while its request runs instead of disabling the whole group.
- Use `kind="transparent"` on a surface that already has a border (a panel header) and `outlined` on the canvas.
- Do not mix text buttons into the group; a text action belongs beside it as its own `Button`.

## Usage

```vue
<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const wrap = ref(false)
  const items = computed(() => [
    { id: 'copy', label: 'Copy code', icon: 'pi pi-copy' },
    { id: 'format', label: 'Format document', icon: 'pi pi-align-left' },
    {
      id: 'wrap',
      type: 'toggle',
      label: 'Wrap lines',
      icon: 'pi pi-arrows-h',
      pressed: wrap.value
    },
    {
      id: 'download',
      type: 'menu',
      label: 'Download',
      icon: 'pi pi-download',
      options: [
        { id: 'download-js', label: 'Download as .js' },
        { id: 'download-zip', label: 'Download as .zip' }
      ]
    }
  ])
</script>

<template>
  <ButtonGroup
    :items="items"
    aria-label="Editor actions"
    @click="({ id }) => run(id)"
    @toggle="({ pressed }) => (wrap = pressed)"
  />
</template>
```

## Sub-components

_none_ — items are data (`items`), because every item has the same anatomy (icon, label, state) and the overflow menu must re-render the same items as menu options.

## Props

| Prop            | Type                             | Default         | Required | JSDoc                                                                                                                                                     |
| --------------- | -------------------------------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`         | `ButtonGroupItem[]`              | `[]`            | false    | Actions, toggles and menus, in reading order.                                                                                                             |
| `ariaLabel`     | `string`                         | `''`            | false    | Accessible name of the toolbar, written as the `aria-label` attribute. Empty only when `aria-labelledby` names the toolbar; then no `aria-label` renders. |
| `kind`          | `'transparent' \| 'outlined'`    | `'transparent'` | false    | Visual variant of every button.                                                                                                                           |
| `size`          | `'small' \| 'medium' \| 'large'` | `'medium'`      | false    | Size token of every button.                                                                                                                               |
| `visibleCount`  | `number`                         | `undefined`     | false    | Items shown as buttons; the rest go into the More actions menu. Unset shows every item.                                                                   |
| `overflowLabel` | `string`                         | `''`            | false    | Label of the overflow button. Empty uses the locale catalog (`More actions`).                                                                             |

Item shapes: `{ id, label, icon, disabled?, loading? }` (action, `type` omitted or `'icon-button'`), `{ type: 'toggle', id, label, icon, pressedIcon?, pressed?, disabled? }`, `{ type: 'menu', id, label, icon, options: { id, label, disabled? }[], disabled? }`.

## Events

| Event    | Payload                            | Notes                                                                 |
| -------- | ---------------------------------- | --------------------------------------------------------------------- |
| `click`  | `{ id: string }`                   | An action or a menu option was chosen (from the bar or the overflow). |
| `toggle` | `{ id: string; pressed: boolean }` | A toggle was activated; `pressed` is the new state to store.          |

## Slots

| _none_ | — | — |

## States

- Visual states per item: `default`, `hover`, `focus-visible`, `pressed` (toggle, `data-pressed`, `--bg-selected`), `loading` (action), `disabled`.
- Root data attributes: `data-kind`, `data-size`; each item `data-button-group-item="<id>"`.
- Overflow: a pressed toggle shows a check and a hidden "On" in the More actions menu; a menu item becomes a labelled group of its options.

## Motion & Animations

_none_ — tooltips, menus and the loading spinner bring their own motion with `motion-reduce` fallbacks.

## Tokens

| Region              | Token (DESIGN.md)                            |
| ------------------- | -------------------------------------------- |
| gap between buttons | `var(--spacing-xxs)`                         |
| pressed fill / text | `var(--bg-selected)` / `var(--text-default)` |
| buttons             | `IconButton` tokens per `kind` and `size`    |
| overflow check      | `var(--text-default)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `role="toolbar"` with `aria-orientation="horizontal"` and a mandatory accessible name: `aria-label` (static or bound) or `aria-labelledby`. `webkit/accessible-name` flags a ButtonGroup with neither, and an empty name renders no `aria-label` attribute.
- Keyboard map: one tab stop (the last focused item, else the first enabled); `ArrowRight` / `ArrowLeft` move and wrap (swapped under `dir="rtl"` through `logicalArrowKey`); `Home` / `End` jump to the ends; `Enter` / `Space` activate; on a menu item `Enter`, `Space` or `ArrowDown` open the menu, `Escape` closes it and returns focus to its button.
- Each icon button's accessible name is its `label`; the tooltip shows the same text on hover and focus.
- Toggles expose `aria-pressed`; the pressed fill is backed by an outline in forced colors.
- Disabled items leave the roving order; loading actions keep focus and announce through the button's busy state.
- Contrast: icon buttons follow `IconButton` (≥ 3:1 for the glyph, ≥ 4.5:1 for focus ring and labels).

## Internationalization

| Key                       | English source | Override prop   |
| ------------------------- | -------------- | --------------- |
| `buttonGroup.moreActions` | `More actions` | `overflowLabel` |
| `buttonGroup.pressed`     | `On`           | —               |

- Item labels are consumer copy.

## Right-to-left

- Layout: the row follows the inline direction; the overflow button is always last (inline end).
- Icons: not mirrored (the consumer passes a directional icon when meaning depends on direction).
- Keyboard: arrows follow the visual order under `dir="rtl"`.

## Responsive

- The row wraps (`flex-wrap`) instead of overflowing a narrow container; use `visibleCount` to keep one line on small screens.
- Touch: targets follow `IconButton` sizes; prefer `size="large"` on touch-first surfaces.
- No hover-only affordance: every label is the accessible name and is reachable by focus.

## Performance

- Bundle budget: see `.size-limit.json` entry `button-group` (DropdownMenu and Tooltip included).
- Runtime: renders `items.length` buttons; no observers or measurements.

## Examples

- Default — an editor toolbar: two actions, a toggle and a menu.
- WithOverflow — `visibleCount` with the rest in More actions, including a disabled action and a pressed toggle.

Justification: `kind` and `size` are shown through Default's controls; the overflow is a distinct anatomy the consumer must see.

## Decisions and open questions

- **Items as data, not slots.** The overflow menu re-renders hidden items as menu options, which needs their label, icon and state; a slot could not be moved into the menu.
- **Explicit `visibleCount`, no automatic measuring.** Measuring widths would need a ResizeObserver loop and reflow on every resize; Cloudscape's group also keeps a fixed visible set. Open: automatic overflow by width.
- **The consumer owns `pressed`.** Toggles emit the next state; the component stores none, so the source of truth stays in the page.
- **Design source.** The design sample's code editor toolbar (`FunctionCodeEditor.vue`): transparent icon buttons with tooltips in the panel header.

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
