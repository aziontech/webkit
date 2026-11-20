---
name: shortcuts-dialog
category: overlay
structure: monolithic
status: approved
spec_version: 1
template: 2
created: 2026-11-20
last_updated: 2026-11-20
checksum: 7c835a777ee3bb75ec920e044f08fb8e34718ee5f02f2e457a5a63157e92d315
---

# ShortcutsDialog — Component Spec

## Purpose

The list of every keyboard shortcut the current screen offers, opened with `?` (Shift+/) as the console keyboard standard asks. It reads the shortcuts screens register with `useShortcuts` (`@aziontech/webkit/use-shortcuts`), so the list is generated, never written by hand: a shortcut that a screen stops offering leaves the list with it. Built from `Dialog`, the `Panel` parts and `Kbd`.

## When to use

- Once per app, in the app shell (beside the header search), so `?` works on every screen.
- With a `trigger` (a Help menu item, a keyboard icon button) so pointer and touch users find the list too.

## When NOT to use

- A shortcut hint beside one action → use `Kbd` inside the button, menu item or tooltip, with `aria-keyshortcuts`.
- Searching commands and pages → use `Command` (`⌘K` / `Ctrl K`).
- Help content that is not keyboard shortcuts → use `HelpPanel` or a `Dialog` with your own body.

## Related

- `use-shortcuts` — the composable screens register shortcuts with; this dialog only lists them.
- `kbd` — draws each key, with `⌘` on Apple platforms and `Ctrl` elsewhere.
- `command` — the command palette; it binds `⌘K` itself and can be listed here with a `useShortcuts` entry that has no `handler`.
- `dialog` — the overlay it composes.

## Best practices

- Mount one ShortcutsDialog per app, never one per page: the list already follows the screen.
- Register shortcuts with a `label` and a `group` (`Page`, `Table`, `Editor`); a shortcut without a `label` works but stays out of the list.
- Label a shortcut with the action it runs, in sentence case (`Save changes`, `Focus search`), never the key.
- Keep the default `?` binding; an empty `shortcut` leaves only the trigger.
- Give the control in the `trigger` slot `aria-keyshortcuts` with `toAriaKeyshortcuts(shortcut)` from `use-shortcuts`, as the Default example does.
- An app with more than one Vue root, or one that needs isolated shortcuts, calls `provideShortcuts()` in the shell above both the screens and the ShortcutsDialog; otherwise every screen and the dialog share the page-wide registry.

## Usage

```vue
<script setup>
  import ShortcutsDialog from '@aziontech/webkit/shortcuts-dialog'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  const searchEl = ref(null)

  useShortcuts([
    { keys: '/', label: 'Focus search', group: 'Page', handler: () => searchEl.value?.focus() },
    { keys: 'meta+s', label: 'Save changes', group: 'Page', handler: () => {} }
  ])
</script>

<template>
  <ShortcutsDialog />
</template>
```

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                                                   |
| ------------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `title`       | `string`  | `''`    | false    | Dialog title. Empty uses the locale catalog (`Keyboard shortcuts`).                                     |
| `shortcut`    | `string`  | `'?'`   | false    | Keys that open the list, in the `useShortcuts` syntax; listed under the general group. Empty binds no key. |
| `defaultOpen` | `boolean` | `false` | false    | Initial open state when uncontrolled (`v-model:open` unbound).                                          |

## v-model

- **`v-model:open`** — `boolean`, default `undefined` (uncontrolled, starts at `defaultOpen`), the same open contract as `Dialog`. The `shortcut` key, the trigger, `Esc`, the overlay and the close button update it.

## Events

_none_ — `update:open` is the `v-model:open` signal.

## Slots

| Slot      | Scope | Notes                                                              |
| --------- | ----- | ------------------------------------------------------------------ |
| `trigger` | —     | The control that opens the list (a menu item, an icon button).     |

## States

- Visual states: `closed`, `open`
- `data-state` on the root: `open` | `closed` (from `dialog`)
- The list holds at least the dialog's own `shortcut` row (general group). Only with an empty `shortcut` and nothing registered is it empty: the body then shows `EmptyState` with the catalog text.
- The dialog's `shortcut` entry follows the prop: when it changes, the old keys stop working and the new ones start.
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`. The list is read-only and has no async source; empty is the `EmptyState` case above.

## Motion & Animations

_none_ — the open and close motion is owned by `dialog`.

## Tokens

| Region       | Token (DESIGN.md)                                               |
| ------------ | --------------------------------------------------------------- |
| group title  | `.text-label-sm`, `var(--text-muted)`                           |
| row label    | `.text-body-sm`, `var(--text-default)`                          |
| row divider  | `var(--border-default)`                                         |
| row spacing  | `var(--spacing-xs)`                                             |
| group gap    | `var(--spacing-lg)`                                             |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `dialog` (the close button) and the trigger.
- Keyboard map: `?` (Shift+/ on a US layout; the key is matched by the character, so any layout that types `?` works) opens the list from anywhere except while typing in a field (input, textarea, contenteditable, combobox), while a modifier other than Shift is held (Command, Control or Alt), during IME composition, and while a modal layer is open (the dialog's own entry has no `element`, so it does not fire inside another layer). With the list open, `?` does nothing. `Esc` closes it; `Tab` is trapped in the dialog; on close focus returns to the element that had it before the list opened (from `dialog`). Tests: `shortcuts-dialog.test.ts`.
- ARIA: `role="dialog"`, `aria-modal`, named by its title (`DialogTitle`, an `h2`). Each group is a `div role="group"` with `aria-labelledby` pointing at its `h3` heading (no region landmark per group); each row is a `dt` (the action) and a `dd` (the keys) in a `dl`, so a screen reader reads the action, then the keys as `Kbd` text. List rows carry no `aria-keyshortcuts`; the keys are read as `Kbd` text.
- The control in the `trigger` slot carries `aria-keyshortcuts` for the `shortcut` keys. `DialogTrigger` forwards only `aria-haspopup` and `aria-expanded`, so the consumer sets it with `toAriaKeyshortcuts(shortcut)`; the Default example shows it.
- Contrast ≥4.5:1 from the tokens above; `Kbd` owns its keycap contrast.
- Touch: the trigger slot carries the touch target; the list itself has no controls besides the close button (44 px from `dialog`).

## Internationalization

| Key                          | English source              | Override prop |
| ---------------------------- | --------------------------- | ------------- |
| `shortcutsDialog.title`      | `Keyboard shortcuts`        | `title`       |
| `shortcutsDialog.show`       | `Show keyboard shortcuts`   | — (the label of the dialog's own `shortcut` row) |
| `shortcutsDialog.general`    | `General`                   | — (the heading of shortcuts registered without a `group`) |
| `shortcutsDialog.emptyTitle` | `No keyboard shortcuts here` | —            |

- The general heading shows on every list, also when the general group is the only one, so the list always reads as headed groups.
- Formatting: none. Key glyphs come from the `kbd` catalog (`Ctrl`, `Alt`, `Enter`, `Esc`).
- Registered labels and group names are the screen's own strings; the screen translates them (a getter keeps them current when the locale changes).

## Right-to-left

- Layout: logical utilities only; the label sits at the inline start and the keys at the inline end.
- Icons: none.
- Keyboard: no arrow keys.
- User data: keys render `dir="ltr"` inside `Kbd`; labels follow the page direction.

## Responsive

- Container queries: none: the dialog owns its width (`medium`).
- Narrow: rows keep the label and the keys on one line and wrap the label; the body scrolls inside the dialog.
- Touch: the list opens from the `trigger` slot on touch screens, where there is no `?` key.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: at most 24 KB gzip for the `shortcuts-dialog` entry in `.size-limit.json` (`confirm-dialog`, which also bundles `Input`, is 27.3 KB). This change adds the export `"./use-shortcuts": "./src/composables/use-shortcuts/index.ts"` and its `.size-limit.json` entry `use-shortcuts` (at most 2 KB), the same shape as `use-collection`.
- Runtime budget: one `keydown` listener per shortcut registry (the page-wide default, or one per `provideShortcuts` call), added with its first registration and removed with its last.
- Heavy parts: none.

## Examples

- Default — a page registers three shortcuts in two groups; `?` or the trigger opens the list.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
