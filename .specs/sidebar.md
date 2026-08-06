---
name: sidebar
category: layout
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3735-14866
  node_id: 3735:14866
checksum: a0ded78bd69aceed40baffb930c4f23f4a085b00aac20c325e2ba757b4d8f9f1
created: 2026-05-22
last_updated: 2026-08-06
---
# Sidebar — Component Spec

## Purpose

Helps users move between views or sections. Composable application sidebar with optional header and
footer regions; navigation content scrolls inside a built-in `ScrollArea`.

It also owns **the rail gesture** — sizing the sidebar by dragging its trailing edge, and collapsing
it out of the layout entirely. That belongs here rather than in each shell: the interaction is not a
small one (a pointer drag that crosses the collapse boundary continuously, a keyboard equivalent,
token-derived bounds, a phase-aware transition, and an affordance that brings a collapsed rail back),
and every app that has a sidebar wants the same one. Two shells re-implementing it is how the two
drift apart.

Both halves are **opt-in and independent**: `resizable` adds the drag, `collapsible` adds the
collapse trigger and the edge affordance. With neither set the component renders exactly as it
always has, with the host owning the width — every existing consumer is unaffected.

## Usage

Navigation is a [`Menu`](./menu.md) in the default slot. It owns no shell, fills the width the
sidebar gives it, and adds no outer margin — so the sidebar keeps the regions and the scrolling,
and the menu keeps the rows, the groups, the nesting and the drill levels.

Two details are what make the pair correct, and neither costs more than one attribute:

- **`role="presentation"` on the `Menu`.** `Sidebar` already renders the `<nav>` landmark; without
  this the menu adds a second one, duplicating it in the landmark list. The menu drops its
  `aria-label` along with the role, so the sidebar's `ariaLabel` remains the one name for the
  region — nothing else to unset.
- **Nothing to wire for focus rings.** The sidebar hands its own surface down as
  `--menu-ring-offset` / `--menu-item-ring-offset`, so every row's focus ring is offset against the
  sidebar fill rather than the page canvas.

```vue
<script setup>
import Avatar from '@aziontech/webkit/avatar'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import Menu from '@aziontech/webkit/menu'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarFooter from '@aziontech/webkit/sidebar-footer'
import SidebarHeader from '@aziontech/webkit/sidebar-header'
import { ref } from 'vue'

const accountMenuOpen = ref(false)
</script>

<template>
  <Sidebar aria-label="Console" class="h-screen w-[280px]">
    <template #header>
      <SidebarHeader>
        <!-- search, branding — stays put while the navigation below it scrolls -->
      </SidebarHeader>
    </template>

    <Menu role="presentation">
      <!-- Renders nothing until a drill level is pushed, so it needs no v-if. -->
      <Menu.Back />

      <Menu.Group>
        <Menu.Item label="Home" icon="ai ai-home" href="/" selected />
      </Menu.Group>

      <Menu.Group label="Build">
        <Menu.Item label="Applications" icon="ai ai-edge-application" href="/applications" />

        <Menu.Sub default-open>
          <Menu.SubTrigger label="Edge Functions" kind="inline" />
          <Menu.SubContent>
            <Menu.Item label="Runtime APIs" href="/functions/runtime-apis" />
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Group>

      <Menu.Group label="Account">
        <Menu.Sub>
          <Menu.SubTrigger label="Settings" icon="pi pi-cog" kind="drill" />
          <Menu.SubContent>
            <Menu.Group label="Organization">
              <Menu.Item label="General" href="/settings/general" />
              <Menu.Item label="Members" href="/settings/members" />
            </Menu.Group>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Group>
    </Menu>

    <template #footer>
      <SidebarFooter class="flex items-center gap-[var(--spacing-xs)]">
        <Avatar kind="square" size="small" src="/avatar.jpg" alt="Rafael Umman" />
        <span class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)]">
          Rafael Umman
        </span>
        <Dropdown v-model:open="accountMenuOpen" placement="top-end">
          <Dropdown.Trigger>
            <IconButton icon="pi pi-ellipsis-v" aria-label="Account menu" kind="outlined" size="small" />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="settings" label="Account Settings" />
            <Dropdown.Option value="logout" label="Log Out" />
          </Dropdown.Group>
        </Dropdown>
      </SidebarFooter>
    </template>
  </Sidebar>
</template>
```

### Resizable and collapsible — the console rail

Turn the gesture on and the sidebar owns its own width: `v-model:width` is the sized width in px
(`null` until the sidebar measures its own natural width on mount, after which the drag owns it),
and `v-model:collapsed` is whether it is in the layout at all. Persist both in the consuming app —
they are the user's choice, and a shell that remounts per route would otherwise lose them on every
navigation.

The collapse trigger renders **at the bottom**, in the footer region, trailing whatever the footer
slot holds — so the profile block and the trigger read as one row, which is the arrangement a
console rail wants. That is why the trigger belongs to the component and not to the footer content:
it must survive whatever the consumer puts there, and it must go inert with the rail when the rail
collapses. The footer region becomes a centred flex row when `collapsible` is set, and the slot
content takes `min-w-0 flex-1`.

The **band** — the separator and the space above it — then belongs to that row rather than to the
footer content, which is what makes the line run the full width of the region *past* the trigger
instead of stopping short of it, and what keeps the trigger on the content's line instead of half a
padding above it. `SidebarFooter` drops its own `border-t` / top padding whenever it is inside a
collapsible sidebar for that reason, and **any other footer content must not add its own top
padding** either.

Both icon-only controls (the collapse trigger and the expand button) carry a **`Tooltip`** whose
text is the same string as their accessible name, so a pointer user gets the label a screen reader
already had, and the two cannot drift.

#### The collapsed rail previews itself

A collapsed rail leaves nothing on the page, so the way back has to be discoverable without being
visible at rest. Resting the pointer in the leading-edge zone — or landing focus in it — **animates
the rail back in to `--size-10`** and morphs the page beside it on the same frames, so the way back
is something the user *sees happen* rather than a 2 px line they have to find and trust. Leaving
the zone carries the sliver out again on the exit curve.

Four things make it hold together:

- **The zone grows with the sliver.** It is `--size-6` at rest and `--size-10` while previewing, so
  it always spans exactly what it opened. A fixed narrow zone would end where the sliver begins and
  flicker the preview on and off as the pointer crossed that seam. Both widths come from the
  **fixed** `--size-*` scale, never `--spacing-lg`/`xl`/`xxl`, which are breakpoint-responsive — an
  `--spacing-xl` zone is 48 px on desktop, far more of the page's leading edge than a hit target
  should claim.
- **The sliver shows the rail's surface, not its content.** The panel stays parked off the leading
  edge and only the rail's own fill and padding come in. A `--size-10` window onto a panel laid out
  for its committed width would cut every row mid-glyph — icons sit at 28–44 px, so 40 px clips all
  of them — and a chopped column reads as a rendering fault rather than an invitation. The
  affordance rides in on that clean strip, centred in it (`--spacing-xxs` either side of the 32 px
  button).
- **The affordance moves with the sliver, it does not appear on top of it.** The expand button is
  parked a full width past the leading edge and shares the rail's own `transition` string, so the
  two are one movement: its trailing edge tracks the sliver's exactly, frame for frame. That timing
  has to be inline — the rail's `duration['moderate-02']` / `curve['expressive-entrance']` live in
  `presets/transitions.ts` as JS values, and `duration-*` / `ease-*` utilities only resolve steps
  the theme registers as CSS variables (`duration-fast-02` is not one, and silently emits nothing).
- **The accent line marks the rail's own trailing edge, in every state.** It lives inside the rail
  rather than in the zone, so it is the same mark whether the rail is sized, being dragged, or
  previewing, and it travels with that edge by construction. A line drawn on the zone's leading
  edge instead would be left standing at the page edge the sliver had just moved away from —
  pointing at nothing.
- **A preview is not a restore.** The rail stays `inert` + `aria-hidden` throughout. Bringing it
  back for real is still the expand button (or the drag), which is why the preview is additive to
  the affordance rather than a replacement for it — it costs a keyboard user nothing and gives a
  pointer user the whole rail as the target.

A collapsed rail also **drops its trailing border**: `width: 0` still paints a border, so without
this the only trace of a fully collapsed rail would be a 1 px line down the page.

```vue
<script setup>
import Menu from '@aziontech/webkit/menu'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarFooter from '@aziontech/webkit/sidebar-footer'
import { ref } from 'vue'

// Persisted by the app — the rail remounts per route, the user's choice must not.
const collapsed = ref(false)
const width = ref(null)
</script>

<template>
  <!-- The host row is `relative`: the affordance that brings a collapsed rail back is
       positioned against it, because a collapsed rail is 0 px wide and would clip it. -->
  <div class="relative flex h-screen min-h-0">
    <Sidebar
      v-model:collapsed="collapsed"
      v-model:width="width"
      resizable
      collapsible
      aria-label="Console"
    >
      <Menu role="presentation">
        <Menu.Group label="Build">
          <Menu.Item label="Applications" icon="ai ai-edge-application" href="/applications" selected />
        </Menu.Group>
      </Menu>

      <template #footer>
        <SidebarFooter class="flex items-center gap-[var(--spacing-xs)]">
          <!-- the account block from Usage above; the collapse trigger trails it -->
        </SidebarFooter>
      </template>
    </Sidebar>

    <main class="min-w-0 flex-1"><!-- the page --></main>
  </div>
</template>
```

The page beside it needs nothing: the sidebar's width animates and a `flex-1` sibling morphs to fill
the freed space on the same frames.

## Sub-components

- `sidebar-footer.vue` — Public sub-component `sidebar-footer`.
- `sidebar-group.vue` — Public sub-component `sidebar-group`. One flat block of rows under an
  optional title, **superseded by `Menu.Group`**: the docs, the stories and every example here
  compose `Menu`, which does everything this does and also nests, collapses and drills. It keeps
  working untouched for existing consumers and is **not** deprecated (no `@deprecated` tag, because
  `webkit/no-deprecated-component` is `error` in the recommended config and would turn a consumer's
  lint green→red on a minor). Reach for `Menu` in anything new.
- `sidebar-header.vue` — Public sub-component `sidebar-header`.

`Sidebar` does not import `Menu` and `Menu` does not import `Sidebar`; the only thing that passes
between them is the ring-offset surface below.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `'Sidebar'` | no | Accessible name for the navigation landmark. |
| `resizable` | `boolean` | `false` | no | Adds the drag handle on the trailing edge; dragging past the minimum collapses the rail. |
| `collapsible` | `boolean` | `false` | no | Adds the collapse trigger at the bottom of the rail and the edge affordance that brings a collapsed rail back. |
| `minWidthToken` | `string` | `'--container-3xs'` | no | Theme container token the sized width is clamped up to, read off the document at runtime. |
| `maxWidthToken` | `string` | `'--container-sm'` | no | Theme container token the sized width is clamped down to, read off the document at runtime. |
| `collapseAriaLabel` | `string` | `'Collapse sidebar'` | no | Accessible name for the collapse trigger. |
| `expandAriaLabel` | `string` | `'Expand sidebar'` | no | Accessible name for the control and the grab bar that bring a collapsed rail back. |
| `resizeAriaLabel` | `string` | `'Resize sidebar'` | no | Accessible name for the drag handle separator. |

The root also owns two models:

- **`v-model:collapsed`** — `boolean`, default `false`. Whether the rail is out of the layout.
- **`v-model:width`** — `number | null`, default `null`. The sized width in px. `null` means *not
  sized yet*: the sidebar seeds it from its own natural width on mount, after which the gesture owns
  it. px is the model's native unit because it is the outcome of a pointer gesture; the **bounds** it
  is clamped to are the ones that come from tokens (`minWidthToken` / `maxWidthToken`).

Both are inert unless `resizable` or `collapsible` is set. With neither, no inline width is applied
and the host's own `class="w-[280px]"` governs exactly as before.

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:collapsed` | `boolean` | `v-model:collapsed` — the rail entered or left the layout, by the trigger, the drag crossing the snap boundary, the keyboard nudge, or a double-click on the handle. |
| `update:width` | `number` | `v-model:width` — the sized width in px, already clamped to the token bounds. Emitted continuously during a drag. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | — |
| `header` | — | Named slot. |
| `footer` | — | Named slot. The collapse trigger renders after this content in the same row, under one full-width separator, so a profile block and the trigger read as one footer. |

## Exposed

| Method | Notes |
|---|---|
| `measure()` | Re-reads the rail's natural width. For a host that reveals the sidebar *after* mount (a viewport change out of a mobile layout): a rail measured while `display: none` reports 0, which would strand it invisible. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-collapsed` on the root while the rail is out of the layout
- `data-resizing` on the root and on the handle while a pointer drag is in flight
- `data-preview` on the collapsed edge zone while it is showing the rail's preview sliver
- Region testids derived from the root: `__panel` (the fixed-width inner panel), `__header`,
  `__nav`, `__scroll`, `__footer`, `__collapse` (the trigger), `__handle` (the drag separator),
  `__expand` / `__expand-button` (the collapsed affordance)
- A collapsed rail carries `inert` + `aria-hidden`, so it holds no tab stops while it is out

## Motion & Animations

Collapsing and expanding is **per-phase, open-vs-close motion driven by state**, which
[`DESIGN.md`](../.claude/docs/DESIGN.md) § Motion routes through a **`presets/transitions.ts`**
module rather than the catalogued keyframe utilities: those are fixed-direction entrances with baked
in timing and cannot express an enter/leave pair off one boolean, and none of them animates a width.
So `sidebar/presets/transitions.ts` imports `duration` / `curve` from the theme and returns the
inline `transition`; the width, transform and opacity themselves are inline styles because they are
continuous values a gesture writes frame by frame, not variants.

| Trigger | Animation / Transition | Token (from `presets/transitions.ts`) | Reduced-motion fallback |
|---|---|---|---|
| rail expands | `width` 0 → sized, `translate-x` -100% → 0, `opacity` → 1 | `duration['moderate-02']` · `curve['expressive-entrance']` | `prefers-reduced-motion` short-circuit — `transition: none`, the rail simply is where it lands |
| rail collapses | `width` sized → 0, `translate-x` 0 → -100%, `opacity` → floor | `duration['moderate-02']` · `curve['expressive-exit']` | same short-circuit |
| drag in flight | none — width tracks the pointer frame for frame | — | — |
| collapsed edge affordance appears | `opacity` 0 → 1 | `duration['moderate-01']` · `curve['productive-entrance']` | `motion-reduce:transition-none` |
| collapsed rail previews / retracts | `width` 0 ↔ `--size-10` (the panel does not move — the sliver is surface only) | `duration['moderate-02']` · `curve['expressive-entrance']` in, `['expressive-exit']` out | `prefers-reduced-motion` short-circuit — `transition: none`, the sliver is simply there or not |
| preview zone widens to the sliver | `width` `--size-6` ↔ `--size-10` | shares `railTransition` | inherited — the preset returns `none` |
| expand affordance rides the sliver in | `transform` `translateX(calc(-100% - --spacing-xxs))` ↔ 0, `opacity` 0 ↔ 1 | shares `railTransition` | inherited — the preset returns `none` |
| rail trailing-edge line on hover / focus / drag / preview | `transition-opacity` | Tailwind default (see note) | `motion-reduce:transition-none` |

An eased width would lag behind the cursor and read as a broken handle, so the transition is
suppressed for the duration of a drag and handed back on release — whatever fraction the rail was
pulled to then animates to fully in or fully out.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-body-sm |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| spacing | `var(--spacing-3)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |
| resize handle line | `var(--accent)`, `var(--border-2)` wide |
| resize handle hit area | `var(--spacing-xs)` |
| rail width bounds | `var(--container-3xs)` … `var(--container-sm)` (via `minWidthToken` / `maxWidthToken`) |
| collapsed preview sliver | `var(--size-10)` |
| collapsed edge zone | `var(--size-6)` at rest, `var(--size-10)` while previewing |

The `<nav>` region hands its own fill down to the rows inside it as
`--menu-item-ring-offset` and `--menu-ring-offset`, both `var(--bg-surface)`. That is what makes a
focus ring on a `MenuItem` or any `Menu` row read against the sidebar rather than against the page
canvas the tokens fall back to.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
  The **scroll viewport is not a tab stop** (`tabindex="-1"` on the built-in `ScrollArea`): a scroll
  region needs one only when nothing inside it is focusable, and this one holds a `Menu` of rows —
  so `Tab` reaches the first row directly instead of the box around it.
  The region also keeps `var(--spacing-xxs)` of padding — and the same as `scroll-padding` — inside
  the clip, because the first row's focus ring (`ring-2` over `ring-offset-2`) reaches 4 px past the
  row and a viewport flush against it would cut the ring off.
  The **drag handle is a focusable `role="separator"`**, so the gesture has a keyboard equivalent:
  `ArrowLeft` / `ArrowRight` nudge the width, `ArrowLeft` past the snap boundary collapses, and
  `ArrowRight` from the collapsed grab bar brings the rail back.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component. Each
  separator is named (`resizeAriaLabel` / `expandAriaLabel`) because a bare separator announces
  nothing about what it sizes; the collapse trigger is named by `collapseAriaLabel`.
- A focusable `role="separator"` is a **window splitter**, so both separators report their position:
  `aria-valuenow` (the sized width in px, `0` while collapsed), `aria-valuemin="0"` and
  `aria-valuemax` (the resolved `maxWidthToken`). `aria-valuemin` is `0` rather than the minimum
  width token because collapsed is a real position of this splitter — the rail never rests between
  1 px and the minimum, and reporting the token bound would put the collapsed position outside the
  range the control announces. Without these, `axe` reports `aria-required-attr` and a screen reader
  announces a separator carrying no information at all.
- A **collapsed rail carries `inert` and `aria-hidden`** — the content is still mounted so its width
  can animate, and it must not be reachable while it is out of the layout. That is why the control
  that brings it back is a sibling of the rail rather than inside it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states; the width /
  transform / opacity transition is dropped entirely under `prefers-reduced-motion`.
- Touch target ≥40×40 px where the control is interactive. The drag handle is a **justified
  deviation**: it is a `var(--spacing-xs)`-wide edge strip, which is the target a pointer resize
  wants, and it is not the only route — the trigger, the keyboard nudge, and double-click all reach
  the same state, so no capability depends on hitting it.

## Stories (Storybook)

- Default — the whole console rail: a header whose search field opens a ⌘K palette, grouped
  navigation composed with `Menu` (an inline level and a drill level included), and a footer
  carrying the account identity and its menu. Deliberately **one** complete example rather than a
  ladder of header-only / footer-only variants: the regions are independent and each is visible
  here, while what actually needs demonstrating is how the parts sit together.
- Resizable — **justified addition.** The rail gesture is stateful and continuous: dragging the
  trailing edge, crossing the snap boundary into a collapse, the trigger at the bottom, and the edge
  affordance that brings it back. None of that is expressible as an args delta on a static story,
  and the page morphing beside it needs a sibling to morph against.

Every story composes `Menu`; none composes `SidebarGroup` (see Sub-components).

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
