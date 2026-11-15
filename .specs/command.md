---
name: command
category: overlay
structure: composition
status: implemented
spec_version: 8
template: 2
checksum: 51f1ed22884f65d5bf3b0f7b970cb43843f64568a89c739d35e8f140b8a92ed9
created: 2026-07-23
last_updated: 2026-11-15
---

# Command Menu — Component Spec

## Purpose

Command Menu is a ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the `Dialog` primitive for its panel, backdrop, focus trap, scroll-lock, and Escape handling, and adds the palette chrome on top — a search `Input`, a scrollable `List` of `Item`s organized into optional `Group`s, an `Empty` state, and `Separator`s. The root owns open/closed state (controlled or uncontrolled), a global open shortcut (⌘K / Ctrl+K), the ranked filter, nested pages, and roving active-item navigation. The filter is fuzzy and ranked: an item matches on its label (prefix, then word start, then anywhere, then an in-order abbreviation such as `dpl` for "Deploy"), its `value`, or its extra `keywords`; better matches rise to the top of their group, groups rise by their best item, and the matched characters of a plain-text label are emphasized. An item can open a `Page` — a nested list such as "Switch project" — with a back control in the search bar. It differs from `dropdown` (a small trigger-anchored menu) and `select` (a form value picker): Command Menu is a full-screen search-first launcher for actions, not a positioned menu or an input control.

## When to use

- Use Command for the searchable ⌘K palette of actions and destinations; a short list of actions opened from a button is a DropdownMenu.
- Provide a global ⌘K launcher for navigating to pages or running actions across an app.
- Let users filter a large, grouped list of commands by typing, then activate with the keyboard.

## When NOT to use

- A small menu anchored to a trigger button → use `dropdown-menu`.
- Picking a value for a form field → use `select` / `multi-select`.
- A confirmation or content modal without search/list semantics → use `dialog` directly.

## Related

- `dialog` — the overlay primitive Command Menu wraps for panel, backdrop, focus trap, and Escape.
- `kbd` — renders each item's keyboard-shortcut hint and the ⌘K affordance.
- `dropdown-menu` — trigger-anchored menu; reach for it when the list is short and positioned by a trigger.

## Best practices

- Write items as Title Case verb phrases describing an action ("Deploy Project"), not navigation labels.
- Keep the palette controlled via `v-model:open` so the app can open it from a button and from the global ⌘K shortcut.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.
- Group related actions with `<Command.Group heading="…">` and separate distinct sections with `<Command.Separator>`.
- Give an item `keywords` for the words people type that are not in its label (`['org', 'team']` on "Switch organization"). Keywords match, they are never shown.
- Use a `Page` for a choice that needs its own list ("Switch project", "Change theme"), not for a deep tree: pages are one stack, and every page is one Backspace away from the previous one.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Command from '@aziontech/webkit/command'

  const open = ref(false)
  function run(action) {
    // navigate / execute the selected action
  }
</script>

<template>
  <Command
    v-model:open="open"
    shortcut="meta+k"
    @select="(event, value) => run(value)"
  >
    <Command.Input placeholder="Search commands…" />
    <Command.List>
      <Command.Group heading="Actions">
        <Command.Item
          value="deploy"
          shortcut="meta+d"
          >Deploy Project</Command.Item
        >
        <Command.Item
          value="new-app"
          shortcut="meta+n"
          >Create Application</Command.Item
        >
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Navigation">
        <Command.Item
          value="settings"
          :keywords="['preferences', 'account']"
          >Go to Settings</Command.Item
        >
        <Command.Item
          value="switch-project"
          page="projects"
          >Switch Project</Command.Item
        >
      </Command.Group>
      <Command.Page
        name="projects"
        heading="Switch project"
      >
        <Command.Item value="acme-store">acme-store</Command.Item>
        <Command.Item value="docs-site">docs-site</Command.Item>
      </Command.Page>
      <Command.Empty>No commands found.</Command.Empty>
    </Command.List>
  </Command>
</template>
```

Tree-shaking alternative — the standalone root + each sub-component from its own entry:

```vue
<script setup>
  import Command from '@aziontech/webkit/command-root'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import CommandPage from '@aziontech/webkit/command-page'
</script>
```

## Sub-components

The root ships a compound API via `index.ts` (`Object.assign` attaches every sub-component; vue-tsc emits `index.d.ts`). Root binding is PascalCase `Command`. Folder layout, one folder per part:

```
packages/webkit/src/components/overlay/command/
├── command.vue          (root — wraps Dialog, provides context)
├── index.ts                  (compound Object.assign)
├── injection-key.ts          (CommandContext + useCommandMenuContext())
├── command-match.ts          (pure ranked fuzzy matcher, no Vue)
├── command.test.ts
├── command-input/command-input.vue
├── command-list/command-list.vue
├── command-group/command-group.vue
├── command-item/command-item.vue
├── command-empty/command-empty.vue
├── command-separator/command-separator.vue
└── command-page/command-page.vue
```

- `command-input/command-input.vue` — the search field. Context-aware: reads and writes the injected `query` (no consumer `v-model`). Builds on the `Input` field (`size="large"`, full-width) with a leading search icon in its `iconLeft` slot and a decorative `Esc` `Kbd` hint (`key-name="escape"`, text from the locale catalog) in its `iconRight` slot, so the focus ring sits on the whole bar; the inner `<input>` carries `role="combobox"`. Autofocuses when the palette opens. Delegates `ArrowDown`/`ArrowUp`/`Enter`/`Home`/`End` to the context's roving navigation. On a nested page it renders a back control before the field: a `chevron-left` glyph (mirrored under `dir="rtl"`) and the page's `heading`, as a native `<button>` named `Back from <heading>` from the locale catalog (`command.back`); activating it returns to the previous page. `Backspace` in an empty field and `Esc` also return to the previous page while one is open (`Esc` closes the palette only from the first page).
  - Props: `placeholder: string` default `''` — input placeholder text; empty uses the locale catalog (`Search everything` in English). `ariaLabel: string` default `''` — accessible name for the search field; when empty it falls back to `placeholder`, so the field keeps its name after the placeholder disappears on the first keystroke.
  - Events: _none_ (the query lives in the injected context).
  - Slots: _none_.
- `command-list/command-list.vue` — the scrollable results region. `role="listbox"` while at least one item is visible; with no visible item it drops the role (an empty listbox fails `aria-required-children`) and shows the `Empty` part. While the query is not empty it carries `data-ranked` and becomes a flex column, so groups and ungrouped items take their rank as a CSS `order` (the DOM order is untouched, so no consumer node is moved or re-created).
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Group>` / `<Command.Item>` / `<Command.Separator>`, plus an optional `<Command.Empty>`.
- `command-group/command-group.vue` — labeled section. Renders a `heading` row (`text-label-sm` in `--text-muted`, sentence case) above its items; hides itself entirely when all of its items are filtered out. Carries `--spacing-sm` above itself when it follows another group, and deliberately **not** when it follows a `<Command.Separator>` — the separator owns the space around itself, so the two rules are mutually exclusive and never stack. While ranked (`data-ranked`) the group is ordered by its best item and its items by their own score, the heading staying first; every group but the leading one carries `--spacing-sm` above itself (`data-leading` marks the first).
  - Props: `heading: string` default `''` — section label; omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<Command.Item>`.
- `command-item/command-item.vue` — a selectable command row. `role="option"`. Registers itself with the context (value + searchable text + score) so the root can filter, rank and track the active item. Activated by click, `Enter` while active, or a full-row pointer; activation calls the context, which emits the root `select` and closes the palette — or, when the item names a `page`, opens that page instead (no `select`, the palette stays open). Shows an optional keyboard-shortcut hint rendered with `Kbd`, or a trailing `chevron-right` (mirrored under `dir="rtl"`) when it opens a page. When the label is plain text and the query matches it, the matched characters render in `<mark>` with `font-semibold` on a transparent fill (weight, not color, so the emphasis survives the active row's `--bg-selected` and forced colors); a rich label (elements in the slot) still filters and ranks but is not highlighted.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when the item is activated; also part of the searchable text.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens; the item is skipped by roving navigation and never activates.
    - `keywords: string[]` default `[]` — extra search terms matched as substrings of the query (never shown), e.g. `['preferences', 'account']`.
    - `page: string` default `''` — the `name` of a `<Command.Page>` this item opens instead of selecting.
    - `shortcut: string` default `''` — a `'+'`-delimited shortcut hint (e.g. `'meta+d'`, `'meta+shift+p'`, `'esc'`) rendered on the right via `Kbd`. Modifier tokens (`meta`/`ctrl`/`shift`/`alt`) map to `Kbd` modifier props; the final token is the key. A named final token (`esc`/`escape`, `enter`/`return`, `space`, `tab`, `backspace`, `delete`/`del`) is printed from the locale catalog through `Kbd` `key-name` (`Esc`, `Enter`, `Espaço`…); any other key is upper-cased. Display only — it does not register a global keybinding.
  - Events: _none_ (root emits `select`).
  - Slots: `default` — the item label (rich content allowed); `prefix` — leading icon/avatar; `suffix` — trailing content (mutually exclusive with `shortcut`).
  - **The icon box belongs to the item that has an icon.** An item renders the leading box only when it actually supplies a `prefix`; an icon-less item puts no empty element in the DOM and pays no indent, so a list that mixes iconed and icon-less rows lets each label start at the row inset it earns rather than every label inheriting the widest row's indent. The box is a fixed `size-4` — the same glyph size a `SidebarMenu` row uses — so an oversized icon cannot widen the row and pull its own label out of line with the iconed rows around it.
- `command-empty/command-empty.vue` — the no-results state, shown only when the filter produces zero visible items. Fallback copy lives inside the slot.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the empty-state message (falls back to "No results found." when empty).
- `command-separator/command-separator.vue` — a thin divider between sections. `role="separator"`, `aria-hidden`. Hidden while the query is not empty (ranking reorders the sections it sits between) and on any page other than its own.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `command-page/command-page.vue` — a nested list the palette swaps in when an item with a matching `page` is activated (or when `v-model:page` is set to its `name`). Renders its content only while it is the current page, inside a `display: contents` wrapper so its groups and items rank like top-level ones; every item, group and separator outside any page belongs to the first page and hides while a nested page is open. Pages are siblings inside the list; opening one pushes onto a single stack, and going back pops it. Registers its `heading` with the root so the input's back control can name it.
  - Props: `name: string` (required) — the identifier items open with `page="…"`. `heading: string` default `''` — the page title shown in the back control; empty falls back to `name`.
  - Events: _none_.
  - Slots: `default` — the page's `<Command.Group>` / `<Command.Item>` / `<Command.Separator>`.

## Props

| Prop          | Type      | Default    | Required | JSDoc                                                                                                                                  |
| ------------- | --------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen` | `boolean` | `false`    | false    | Initial open state when uncontrolled.                                                                                                  |
| `dismissible` | `boolean` | `true`     | false    | When true, backdrop click and Escape close the palette.                                                                                |
| `shortcut`    | `string`  | `'meta+k'` | false    | Global `'+'`-delimited keyboard shortcut that toggles the palette open (e.g. `'meta+k'`); matched against Ctrl on non-macOS platforms. |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                                                                      |
| -------------- | --------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, the `shortcut`, item activation, `Esc`, backdrop click). While unbound the palette is uncontrolled and starts at `defaultOpen`.            |
| `v-model:page` | `string`  | `''`        | `update:page` | The current page via `defineModel('page')`; `''` is the first page. Item activation with `page`, the back control, `Backspace` in an empty field and `Esc` on a nested page update it. Set it before opening to open straight on a page; otherwise each opening starts on the first page. Changing pages clears the query. |

## Events

| Event    | Payload                                                         | Notes                                                                                                                                                                                                                             |
| -------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fires when an enabled item is activated (click or `Enter`). `event` is the activation event; `value` is the item's identifier. The palette closes automatically and focus returns to the element that was focused before opening. |

## Slots

| Slot      | Scope | Notes                                                                                                                 |
| --------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The palette content: a `<Command.Input>` followed by a `<Command.List>`. Rendered inside the teleported dialog panel. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (roving highlight), `disabled`, `empty`
- `data-state` values (root): `open` | `closed` (inherited from the wrapped `Dialog`)
- `data-active` on an item mirrors the roving active item (keyboard/hover highlight)
- `data-disabled` on an item mirrors its `disabled` prop
- `data-ranked` on the list and on each group while the query is not empty; `data-leading` on the group ranked first
- `data-page` on the input bar names the open nested page (absent on the first page)
- `empty`: when the filter yields no visible items, the `Empty` part renders in place of the list rows

## Motion & Animations

The palette panel's open/close scale animation is owned by the wrapped `Dialog` (its `DialogContent`), including its reduced-motion escape — Command Menu renders no panel animation of its own. The only motion this component's own markup introduces is the item hover/active color transition:

| Trigger                    | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| item hover / active change | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                                                    | Token (DESIGN.md)                                                                                                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| panel surface / border / shape / shadow                   | inherited from `Dialog` (`var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)`, `var(--shadow-sm)`)                                          |
| input header divider                                      | `border-b border-(--border-default)`                                                                                                                     |
| input field chrome (border / surface / text / focus ring) | inherited from `Input` (`var(--border-default)`, `var(--bg-surface)`, `var(--text-default)`, `var(--ring-color)`)                                        |
| input placeholder / search icon                           | `var(--text-muted)`                                                                                                                                      |
| group heading typography                                  | `.text-label-sm` + `text-(--text-muted)`                                                                                                                 |
| item label typography                                     | `.text-label-sm` + `text-(--text-default)`                                                                                                               |
| item shape                                                | `var(--shape-button)`                                                                                                                                    |
| item min-height                                           | `min-h-8` (32px)                                                                                                                                         |
| item spacing.x                                            | `var(--spacing-sm)`                                                                                                                                      |
| item spacing.y                                            | `var(--spacing-xxs)`                                                                                                                                     |
| item gap                                                  | `var(--spacing-xs)`                                                                                                                                      |
| item icon box                                             | `size-4` (16px), rendered only on an item that carries a `prefix`                                                                                        |
| list spacing.x / spacing.y                                | `var(--spacing-xxs)` / `var(--spacing-xs)` — the vertical seam is one step up from the row inset, matching the DropdownMenu panel                        |
| item active surface                                       | `var(--bg-selected)`                                                                                                                                     |
| item hover surface                                        | `var(--bg-hover)`                                                                                                                                        |
| item disabled text                                        | `var(--text-disabled)`                                                                                                                                   |
| item match highlight                                      | `font-semibold` on a transparent `<mark>`, `text-inherit` (inherits the row's color)                                                                     |
| item page chevron                                         | `pi pi-chevron-right` in `text-(--text-muted)`, `rtl:-scale-x-100`                                                                                       |
| back control                                              | `.text-label-sm` + `text-(--text-default)`, `var(--shape-elements)`, `h-8`, `px-(--spacing-xs)`, hover `var(--bg-hover)`, focus ring `var(--ring-color)` |
| back control glyph                                        | `pi pi-chevron-left` in `text-(--text-muted)`, `rtl:-scale-x-100`                                                                                        |
| separator                                                 | `border-t border-(--border-default)`                                                                                                                     |
| separator spacing.above                                   | `var(--spacing-sm)`                                                                                                                                      |
| separator spacing.below                                   | `var(--spacing-xs)`                                                                                                                                      |
| group spacing (after another group)                       | `var(--spacing-sm)`                                                                                                                                      |
| empty-state text                                          | `.text-label-sm` + `text-(--text-muted)`                                                                                                                 |
| focus ring                                                | `var(--ring-color)`                                                                                                                                      |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the input; items use the roving `data-active` highlight (the input keeps DOM focus).
- Keyboard map:
  - Global: the `shortcut` combo (⌘K / Ctrl+K) toggles the palette open from anywhere.
  - Inside the palette: `ArrowDown` / `ArrowUp` move the active item in the order the list shows (ranked order while searching; skipping disabled, wrap-around); `Home` / `End` jump to first/last enabled item; `Enter` activates the active item (opening its page when it names one); `Backspace` in an empty field returns to the previous page; `Esc` returns to the previous page on a nested page and closes (via `Dialog`) on the first; `Tab` is trapped within the panel (via `Dialog`) and reaches the back control.
- ARIA: the panel is `role="dialog"` (from `Dialog`) with an accessible name via a visually-hidden title; the input is `role="combobox"` with `aria-expanded` and `aria-controls` pointing at the list, and carries its own accessible name via `aria-label` (`ariaLabel`, falling back to `placeholder`) so the name survives the first keystroke; the list is `role="listbox"` (no role while nothing matches); each group is `role="group"` with `aria-labelledby` referencing its heading id; each item is `role="option"` with a stable `id` (`useId`), `aria-selected` mirroring the active state and `aria-disabled` mirroring `disabled`. With DOM focus on the input, the input's `aria-activedescendant` points at the active item's `id` (absent while no item is active), so a screen reader announces each row as `ArrowUp` / `ArrowDown` / `Home` / `End` move; and the active row is scrolled into view (`scrollIntoView({ block: 'nearest' })`) whenever it changes, so it never drops below the fold of the scrolling list (WCAG 4.1.2, 2.4.11). Tests: `command.test.ts` › active option is announced and kept in view.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled`).
- `motion-reduce:animate-none` on the inherited `animate-popup-scale-*`; `motion-reduce:transition-none` on item `transition-colors`.
- Ranked order is visual (CSS `order`) while the DOM keeps the consumer's order; the roving active item, `aria-selected` and `Enter` follow the visual order, so keyboard users get the ranked sequence. Highlighted characters are a `<mark>` inside the option, so the option's accessible name stays its full label.
- Focus management: opening moves focus to the input; changing pages keeps focus in the input; closing returns focus to the element focused before the palette opened. Focus trap and scroll-lock are inherited from `Dialog`.
- Touch target: item rows are full-width click targets ≥32 px tall, satisfying the in-overlay 24×24 px floor (WCAG 2.5.8).

## Internationalization

| Key                   | English source      | Override prop         |
| --------------------- | ------------------- | --------------------- |
| `command.title`       | `Command menu`      | —                     |
| `command.placeholder` | `Search everything` | `placeholder` (Input) |
| `command.empty`       | `No results found.` | default slot (Empty)  |
| `command.back`        | `Back from {page}`  | —                     |

- Item labels, keywords, group and page headings are consumer copy.
- Matching is case-insensitive with `toLowerCase()`; it does not fold accents, so a consumer adds unaccented spellings as `keywords` when people type them.

## Right-to-left

- Layout: logical utilities only (`text-start`, `gap-*`, `px-*`), so the bar, the back control and each row mirror under `dir="rtl"`.
- Icons: the back `chevron-left` and the item page `chevron-right` mirror (`rtl:-scale-x-100`); the search glyph and `Kbd` keycaps do not.
- Keyboard: navigation is vertical only (`ArrowUp` / `ArrowDown`), so no arrow logic flips.

## Responsive

- The panel width and max height come from `Dialog`; the list scrolls inside `max-h-[24rem]`.
- The back control truncates a long page heading (`truncate`, `max-w-[40%]`) so the field keeps room to type.
- Touch: rows are full-width ≥32px; the back control is 32px tall. No hover-only affordance: the highlight follows the active row and taps activate.

## Performance

- Bundle budget: `.size-limit.json` entries `command`, `command-root`, `command-item`, `command-input`, `command-page` (the matcher is part of `command-item`).
- Runtime: each item scores itself once per query change (linear in its label length); the root derives group visibility and rank in one pass over the items and sorts only the visible ones for keyboard order. Ranking changes CSS `order` only, so no node is moved or re-rendered. Covered by the `command-1k` scenario in `perf-budgets.json` (1k items in 20 groups: open, then type four queries).

## Examples

Composition component with no `kind`/`size` axis. Every story starts **closed** and ships its own opening affordance, matching the `dialog` story pattern: the panel teleports to `document.body`, so a story that forced `open` would stack its panel on top of every other story's panel on the Docs page (leaving each story canvas empty). Only `Default` keeps the global `shortcut`; the remaining stories pass `shortcut=""` so the Docs page has a single ⌘K owner.

- Default — the intended entry point: a large read-only search `Input` carrying a ⌘K `Kbd` hint that opens the palette via `v-model:open` (the global `meta+k` shortcut opens it too), containing one input, two groups, a separator, and items with and without `shortcut` hints. Covers the "Best practices" controlled `v-model:open` pattern alongside the default composition.
- Grouped — composite story with three `<Command.Group>`, only the first pair separated by a `<Command.Separator>`, and half the items carrying a `prefix` icon. Required because grouping + separators are central anatomy not covered by `Default`; the three-group shape shows both spacings (around a separator and between two bare groups) in one frame, and the mixed icons are the only coverage of the `prefix` slot and of the fact that an icon-less row renders no box.
- WithShortcuts — items carrying `shortcut` hints rendered via `Kbd`. Required because the `shortcut` prop and its `Kbd` rendering are public Item API with no other coverage.
- Empty — the palette with no matching items, showing the `<Command.Empty>` state. Required because the empty state is a distinct visual state (the `empty` state in the States table) with no other coverage.
- Disabled — a group containing a disabled item alongside enabled ones. Required because `disabled` is public Item API and the disabled row is a distinct state.
- Ranking — items with `keywords` and labels that match the same query at different strengths, so typing (`set`, `dpl`, `team`) shows the ranked order, the regrouped sections and the highlighted characters. Required because ranking, `keywords` and the highlight are public behavior with no other coverage.
- Pages — an item with `page` opening a "Switch project" `<Command.Page>`, with the back control in the search bar. Required because `Page`, the item `page` prop and `v-model:page` have no other coverage.

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
