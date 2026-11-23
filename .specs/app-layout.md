---
name: app-layout
category: layout
structure: monolithic
status: implemented
spec_version: 8
template: 2
checksum: 7f48941db1163dc6e2cb1e8273fc422da830a14ddd1cb4889e246ae3870aa7ab
created: 2026-11-11
last_updated: 2026-11-19
---

# AppLayout — Component Spec

## Purpose

The frame every signed-in product page renders inside. It places named regions — navigation,
header, notifications, breadcrumbs, content, tools (the help panel) and the split panel — and owns
how they open, close, resize and remember their state. It responds to its **own** width, not the
viewport's: below `compactBelow` pixels the navigation and the tools turn into drawers and the
split panel moves to the bottom. The regions are slots, so the shell (the `shell/shell-console` block)
keeps its own `Sidebar`, `AppHeader` and page content and only hands the frame to `AppLayout`.

## When to use

- Use AppLayout only to build a signed-in app shell other than the console; the console uses ConsoleLayout.
- A product shell needs a navigation rail, a global header and a scrolling content area that turn into a drawer-based layout on phones.
- A page offers contextual help beside the work (`HelpPanel` in the tools region) that the reader opens and closes.
- A list or table needs a resizable detail panel under it or beside it (the split panel), showing the selected item without leaving the page.
- Page-level flash messages (`Alert`) must sit above the content and stay visible while the content scrolls.

## When NOT to use

- A single resizable split inside a page, with no shell around it → use `resizable`.
- A navigation rail on its own (resize, collapse, footer) → use `sidebar`; put it in the `navigation` slot.
- A one-off overlay for a task (a create form, a detail preview) → use `drawer`.
- Marketing and documentation pages → use the `shell/shell-site` and `shell/shell-docs` blocks.

## Related

- `sidebar` — the navigation rail that goes in the `navigation` slot; it owns its own width, resize and collapse.
- `app-header` — the bar that goes in the `header` slot.
- `help-panel` — the content of the tools region.
- `drawer` — what the navigation and tools regions become below `compactBelow`.
- `resizable` — a split between panes inside a page, without the shell.
- `alert` — the flash messages composed into the `notifications` slot.

## Best practices

- One `AppLayout` per page, at the root. Do not nest them.
- Keep the navigation in the `navigation` slot and read its `drawer` scope flag to drop rail-only controls (resize, collapse) when it renders inside the drawer; call `closeNavigation` from the scope when an item is chosen in the drawer.
- Put the control that opens the navigation drawer in the header, and show it only when the header scope's `compact` is true.
- Put a help button in the header that calls `toggleTools`; the tools region carries its own close button.
- Use the split panel for the selected item of a collection. Close it when the selection clears.
- Pass `storageKey` when the reader's choices (split panel size and position, navigation and tools open) should survive a reload.
- Flash notifications belong in the `notifications` slot, one `Alert` per message, dismissible. Use toasts for results of actions that finish in the background.
- A page body that fills the screen (an empty state, a centred form) is `<main class="flex min-h-full flex-col">` in the default slot. Its height is what is left under the breadcrumbs, so it never scrolls by the breadcrumb row; do not subtract the breadcrumbs yourself.

## Usage

```vue
<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import AppHeader from '@aziontech/webkit/app-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import Sidebar from '@aziontech/webkit/sidebar'
  import { ref } from 'vue'

  const toolsOpen = ref(false)
  const splitPanelOpen = ref(true)
</script>

<template>
  <AppLayout
    v-model:tools-open="toolsOpen"
    v-model:split-panel-open="splitPanelOpen"
    split-panel-title="web-app-prod"
    storage-key="resources-layout"
  >
    <template #navigation="{ drawer }">
      <Sidebar
        aria-label="Main navigation"
        :resizable="!drawer"
      />
    </template>
    <template #header="{ compact, openNavigation, toggleTools }">
      <AppHeader aria-label="Console">
        <AppHeader.Start>
          <IconButton
            v-if="compact"
            icon="az az-menu"
            aria-label="Open navigation"
            variant="outline"
            size="medium"
            @click="openNavigation"
          />
        </AppHeader.Start>
        <AppHeader.End>
          <IconButton
            icon="az az-circle-help"
            aria-label="Help"
            variant="outline"
            size="medium"
            @click="toggleTools"
          />
        </AppHeader.End>
      </AppHeader>
    </template>
    <template #notifications>…</template>
    <template #breadcrumbs>…</template>
    <main>…</main>
    <template #split-panel>…</template>
    <template #tools>
      <HelpPanel>…</HelpPanel>
    </template>
  </AppLayout>
</template>
```

## Props

| Prop                  | Type     | Default | Required | JSDoc                                                                                                                    |
| --------------------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `navigationAriaLabel` | `string` | `''`    | false    | Accessible name of the navigation drawer. Empty uses the locale catalog (`Navigation`).                                  |
| `toolsLabel`          | `string` | `''`    | false    | Title of the tools region, shown in its header. Empty uses the locale catalog (`Help`).                                  |
| `toolsWidth`          | `number` | `320`   | false    | Width of the tools region in pixels while not compact.                                                                   |
| `splitPanelTitle`     | `string` | `''`    | false    | Title of the split panel, shown in its header. Empty uses the locale catalog (`Details`).                                |
| `storageKey`          | `string` | `''`    | false    | When set, the split panel size and position and the navigation and tools open state are kept in `localStorage` under it. |
| `compactBelow`        | `number` | `768`   | false    | Width of the layout itself, in pixels, under which navigation and tools become drawers and the split panel moves down.   |

## v-model

Each two-way value is a named `defineModel`, so its `update:*` event is generated, not hand-declared.
Unbound, each one keeps its own local state.

| Model                          | Type                 | Default    | Emits                       | Notes                                                                                                                                       |
| ------------------------------ | -------------------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:navigation-open`      | `boolean`            | `true`     | `update:navigationOpen`     | Whether the navigation region shows beside the content. Not used while compact, where navigation is a drawer. Same name on `ConsoleLayout`. |
| `v-model:tools-open`           | `boolean`            | `false`    | `update:toolsOpen`          | Whether the tools region (help) is open; while compact it drives the tools drawer.                                                          |
| `v-model:split-panel-open`     | `boolean`            | `false`    | `update:splitPanelOpen`     | Whether the split panel is open.                                                                                                            |
| `v-model:split-panel-position` | `'bottom' \| 'side'` | `'bottom'` | `update:splitPanelPosition` | Where the split panel sits: under the content or beside it. Bottom while compact.                                                           |
| `v-model:split-panel-size`     | `number`             | `320`      | `update:splitPanelSize`     | Height (bottom) or width (side) of the split panel in pixels; emitted on every step.                                                        |

## Events

| _none_ | — | — |

The only events are the `update:*` of the models above.

## Slots

| Slot            | Scope                                                                                                     | Notes                                                                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`       | —                                                                                                         | The page content (the consumer's `<main>`). Fills the content region under the breadcrumbs, so a full-height body (`min-h-full`) takes the rest of the height without overflowing; taller content scrolls. |
| `navigation`    | `{ drawer: boolean, closeNavigation: () => void }`                                                        | The navigation rail. Rendered once: beside the content, or inside the navigation drawer when compact. `closeNavigation` closes the drawer, e.g. after an item is chosen.                                   |
| `header`        | `{ compact: boolean, openNavigation: () => void, toggleNavigation: () => void, toggleTools: () => void }` | The global header, above content, tools and split panel.                                                                                                                                                   |
| `notifications` | —                                                                                                         | Flash messages (`Alert`) above the breadcrumbs and the content; stays in place while content scrolls.                                                                                                      |
| `breadcrumbs`   | —                                                                                                         | Breadcrumbs above the content, inside the scroll area; the page body fills the height left under them.                                                                                                     |
| `tools`         | —                                                                                                         | The tools region's body, usually a `HelpPanel`.                                                                                                                                                            |
| `split-panel`   | —                                                                                                         | The split panel's body.                                                                                                                                                                                    |

## States

- Visual states: `default`, `compact`; per region `open` / `closed`; the split separator `focus-visible` and `resizing`.
- `data-compact` on the root while the layout is narrower than `compactBelow`.
- `data-navigation`, `data-tools`, `data-split-panel` on the root: `open` | `closed`.
- `data-split-panel-position` on the root: `bottom` | `side` (always `bottom` while compact).
- `data-resizing` on the split separator while it is dragged.
- First render (server and client) is the wide layout; the compact layout applies after mount, once the layout has measured itself.

## Motion & Animations

| Trigger                        | Animation / Transition                  | Token (see `.claude/docs/DESIGN.md` § Animations)        | Reduced-motion fallback         |
| ------------------------------ | --------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| separator hover / focus / drag | `transition-colors` on the separator    | inline · `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| compact drawers open / close   | `Drawer` component (owns its own slide) | component                                                | handled by `Drawer`             |

## Tokens

| Region                        | Token (DESIGN.md)                        |
| ----------------------------- | ---------------------------------------- |
| canvas                        | `var(--bg-canvas)`                       |
| tools / split panel surface   | `var(--bg-surface)`                      |
| region borders, separator     | `var(--border-default)`                  |
| separator hover               | `var(--border-strong)`                   |
| separator focus / drag        | `var(--accent)`                          |
| region header title           | `.text-heading-2xs`                      |
| region header height          | `var(--spacing-2xl)`                     |
| region header padding         | `var(--spacing-md)`                      |
| notifications gap and padding | `var(--spacing-xs)`, `var(--spacing-md)` |
| ring                          | `var(--ring-color)`                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Skip link: the first focusable element is a `SkipLink` (`Skip to content`, from its locale catalog), visually hidden until focused; activating it moves focus to the content region (`app-layout__content`, which takes `tabindex="-1"` for the jump), past the navigation and the header. Every layout built on `AppLayout` (`ConsoleLayout`) gets it by construction.
- Visible focus: the separator shows `var(--accent)` and the focus ring (`focus-visible:ring-2 focus-visible:ring-(--ring-color)`, no offset: the separator sits on the panel edge) on `focus-visible`; the region buttons are `IconButton` with their own ring.
- Keyboard map: `Tab` reaches the region controls in DOM order (navigation, header, content, split panel, tools). On the split separator: `ArrowUp` / `ArrowDown` grow and shrink a bottom panel; `ArrowLeft` / `ArrowRight` grow and shrink a side panel (mirrored under RTL); `Shift` makes the step 64 px instead of 16 px; `Home` / `End` go to the minimum / maximum. `Escape` closes a compact drawer (from `Drawer`) and returns focus to the control that opened it. The split panel and tools bodies are focusable scroll regions (`tabindex="0"`, `role="group"` named by their heading), so a keyboard reader can scroll them when they hold no control.
- ARIA: the tools region and the split panel are `<section aria-labelledby>` their header title (`<h2>`); the separator is `role="separator"` with `aria-orientation`, `aria-valuenow` / `aria-valuemin` / `aria-valuemax` in pixels, `aria-controls` the split panel and an accessible name from the catalog. The compact drawers are named by `navigationAriaLabel` and `toolsLabel`. The layout adds no landmark of its own around the content; the consumer's `<main>` and `Sidebar` `<nav>` are the landmarks.
- Contrast ≥4.5:1 for the region titles; ≥3:1 for the separator against the surfaces.
- `motion-reduce:transition-none` on the separator transition.
- Touch target: the separator's hit area is 16 px across (a `before:` pseudo-element) over a 4 px line; region buttons are 32 px `IconButton` (40 px on `pointer: coarse` from `IconButton`).

## Internationalization

| Key                          | English source          | Override prop         |
| ---------------------------- | ----------------------- | --------------------- |
| `appLayout.navigation`       | Navigation              | `navigationAriaLabel` |
| `appLayout.tools`            | Help                    | `toolsLabel`          |
| `appLayout.closeTools`       | Close help              | —                     |
| `appLayout.splitPanel`       | Details                 | `splitPanelTitle`     |
| `appLayout.closeSplitPanel`  | Close panel             | —                     |
| `appLayout.resizeSplitPanel` | Resize panel            | —                     |
| `appLayout.showAtSide`       | Show beside the content | —                     |
| `appLayout.showAtBottom`     | Show under the content  | —                     |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ms-auto`); the navigation sits at the inline start and the tools and side split panel at the inline end.
- Icons: the position toggle icons (`az az-app-window` family) are not mirrored; close is not mirrored.
- Keyboard: on a side split panel, the arrow that points away from the panel grows it — `ArrowLeft` in LTR, `ArrowRight` in RTL.
- User data: none.

## Responsive

- Container queries: the root is `@container/app-layout`; a `ResizeObserver` on the root switches to compact when its own width is under `compactBelow` (768 px by default), so the layout also goes compact inside a narrow host, not only on a narrow viewport.
- First paint: with the default `compactBelow` (768 px) the navigation rail and the tools region also carry a container query (`@max-3xl/app-layout:hidden`), so a server-rendered page never paints the rail on a phone before the script measures the root.
- Narrow (compact): navigation renders in a `Drawer` from the inline end (the design sample's phone menu), the tools in a `Drawer`, the split panel is forced to the bottom and its position toggle hides; the split panel's maximum is 70 % of the layout height.
- Touch: region buttons are `IconButton`; the separator has a 16 px hit area and pointer drag works with touch (pointer events).
- Reflow: the content scrolls on its own; no horizontal scroll at 320 px.

## Performance

- Bundle budget: 30 KB gzip for `./app-layout` (it carries `drawer` and `icon-button`) in `.size-limit.json`.
- Runtime budget: one `ResizeObserver`; resizing the split panel writes one inline size per pointer move.
- Heavy parts: none.

## Examples

- Default — navigation, header, content and closed tools.
- FullHeightPage — breadcrumbs over a full-height page body (`min-h-full`) with a centred empty state. Justified: the body fills the height left under the breadcrumbs without overflowing.
- Help open — tools open with a `HelpPanel`. Justified: the tools region is the component's main optional region.
- Split panel — a table with the split panel open at the bottom and at the side. Justified: the split panel and its position are the component's other region.
- Notifications — flash `Alert`s in the notifications region. Justified: the region exists only for them.

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
