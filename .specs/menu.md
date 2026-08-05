---
name: menu
category: navigation
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5993-33335
  node_id: '5993:33335'
checksum: 334494606cc6eb0ca8641de9c2faa13cba2447b127e094b53ba1a6a33187e4a0
created: 2026-08-03
last_updated: 2026-08-04
---

# Menu — Component Spec

## Purpose

A vertical, hierarchical navigation menu. It owns no shell and no layout of its own: it is
**injected into** a host — usually `Sidebar`, but any scroll container works — and renders three
structures through one compound: **groups** that separate rows under a title,
**condensed rows** that own children and expand in place behind an indent rail, and **drill rows**
that replace the menu with a second-level menu. Unlike `navigation-menu` — the horizontal
megamenu — this menu is vertical, recursive, and owns a view stack.

Its box model follows Cloudflare Kumo's `Sidebar` (<https://kumo-ui.com/components/sidebar/>):
full-width rows, padding inside the row rather than on the list, and indentation carried by the
nested list's `padding-left`. Per [`migration.md`](../.claude/rules/migration.md) only that
*structure* is adopted — every *value* is expressed in our own tokens per
[`DESIGN.md`](../.claude/docs/DESIGN.md). Kumo's raw utilities (`min-h-8.5`, `rounded-lg`,
`gap-2.5`, `pl-7`, `my-3`, a `cubic-bezier` literal) are all things DESIGN.md forbids outright; the
mapping is in Tokens, and the single value with no token behind it is in Theme gaps.

## When to use

- Any navigation region grouped by product or concern — placed inside `Sidebar`, a drawer, or a plain container.
- A documentation tree that nests two or three levels and must show its indentation structurally.
- A settings-style area where activating a row should replace the menu with that row's own menu, then return.
- Navigation whose tree comes from a manifest or route config rather than hand-authored markup (use `groups`).

## When NOT to use

- Horizontal top-of-page navigation with hover-opened panels → use `navigation-menu` instead.
- A menu that floats over the page from a trigger → use `dropdown` (rows + selection) or `popover` (arbitrary content) instead.
- A searchable flat command palette → use `command-menu` instead.
- A single collapsible content region that is not navigation → use `accordion` instead.
- Mutually exclusive in-page view switching → use `tab-view` (or `segmented-button` for a compact control) instead.
- The surrounding shell itself (brand header, scroll region, user footer) → that is `Sidebar`; this menu goes inside it.

## Related

- `sidebar` — the most common host. It supplies the landmark, the scroll region, and the header/footer; this menu is placed in its default slot. The two are independent — neither imports the other.
- `menu-item` — **is** `Menu.Item`. The existing standalone component, attached to this compound and reachable both ways, and now documented here rather than in a spec of its own (see Sub-components). **Two changes are made to it**: an empty icon box no longer renders, and its two branches share one label class. Its wider visual redesign remains a separate, later `spec_version: 2` revision of this spec.
- `sidebar-group` — functionally **superseded by `Menu.Group`**, which adds collapsing and shares the root's context. It keeps working untouched; no `@deprecated` tag is added here, because `webkit/no-deprecated-component` is `error` in the recommended config and would turn a consumer's lint green→red on a minor. Deprecating it is a separate, announced change.
- `navigation-menu` — the horizontal megamenu. Different component, different axis; see the testid note in Sub-components.
- `accordion` — a **reference only**, for content disclosure rather than navigation. `Menu` borrows the *shape* of its collapse (a `:css="false"` `<Transition>` driving `height` in JS, because CSS cannot animate to `auto`) and nothing else. `Menu` must **not** import, wrap, extend, or re-export `accordion` or any of its sub-components: a nav group is not an accordion — it has no heading-wrapped trigger, no single/multiple `type` model, no roving arrow-key model across items, and its rows are navigation, not panels. `Group` and `Sub` own their disclosure end to end. The timing itself comes from `menu/presets/transitions.ts`, not from accordion (whose inline `'height 150ms ease-out'` literal predates and violates DESIGN.md § Forbidden in animations).
- `tag` — renders the optional trailing badge on a row via `menu-item`'s `tagValue`.

## Best practices

- Put every `Menu.Item` and `Menu.Sub` inside a `Menu.Group` or an **inline** `Menu.SubContent`. Those own the `<ul>`; a row outside one is a `<li>` with no list, which is invalid HTML. A group with no `label` is the correct way to express an unlabeled block — including inside a **drill** `Menu.SubContent`, which is a level container rather than a list precisely so it can hold groups.
- Treat a drilled level as a whole menu, because it is one: give it groups and labels the way the root has them. A second-level nav that is only flat rows is a missed opportunity, not a constraint of the component.
- Let the host own width, padding and scrolling. The menu fills the width it is given and adds no outer margin, so it drops into `Sidebar`, a drawer, or a bare `<div>` unchanged.
- Keep padding **inside the row**, never on the list. Every list (`Group`'s `<ul>`, `SubContent`'s `<ul>`) is a bare `m-0 list-none p-0 flex flex-col`; the row owns `px-[var(--spacing-sm)]` and `min-h-8`. That is what lets a row's hover surface span the full menu width instead of stopping short of a list inset.
- **The rail means parentage, not membership.** It is drawn only by an inline `Menu.SubContent`, where it ties children to the row above them. A `Menu.Group` draws none and indents nothing: its label already marks the section, so a rail there would spend the same ink saying something the label has said and dilute what the rail means everywhere else. A grouped row therefore sits flush with an ungrouped one.
- Indentation is the nested list's `padding-left`, not a margin on each row — so the rail, which is drawn relative to that padding box, stays aligned no matter what a row contains.
- One step of nesting is `--menu-indent` = `calc(var(--spacing-sm) + var(--spacing-md))` (28 px), the step the reference sidebar uses. It is deliberately **narrower than the row's own icon column** (40 px), which is a chosen trade: a tighter tree, at the cost of a child's label landing slightly left of its parent's rather than aligned with it. Widening it to 40 px would align the columns and read as more indentation.
- **One content column, `var(--spacing-sm)`.** Every row type starts its content on it, whatever the row is: a group title's text, an icon-bearing row's **glyph** (its box pads by `var(--spacing-xxs)`, and the glyph's centring inside a `size-8` box carries it the rest of the way), and an icon-less row's label — a `SubTrigger` without a glyph included — (`pl-[var(--spacing-sm)]` directly). A `SubTrigger` that does carry one (drill only) switches to the icon-bearing inset, so both cases land on the column. Nesting shifts the whole column by exactly one `--menu-indent`, so the alignment cascades at every depth. Measured: level 1 content at 12 px for all four row types, level 2 at 40 px.
- **The rail descends from that column**, so `--menu-rail-x` is `var(--spacing-sm)` — one value for every parent, not a per-row calculation. The elbow spans from that line to the child **row's left edge** (`--menu-indent - --menu-rail-x`) and stops there: it must never reach the child's content, because the row's box begins at the indent and its hover and selected surfaces fill that box, so a wider elbow would be drawn underneath them. **The rail lives in the gutter beside the rows, never on top of one.** Every token involved is fixed at all breakpoints, unlike `--spacing-lg` / `--spacing-xl`, which would drift the elbow.
- **A row renders no icon box when it has no icon.** An empty box misreports where the row's content starts, so the label sits off the column its siblings hold and the rail anchors to blank space. This rule is what makes the column hold.
- Hover and active are `::before` / `::after` **ghost layers** per [`DESIGN.md`](../.claude/docs/DESIGN.md) § Interactive states — never a `transition-colors` on the row root, and never a `background-color` swap that discards the selected fill.
- Pick one affordance per meaning: `chevron-down` expands children in place, `chevron-right` replaces the menu. A **group title carries no affordance at all** — it separates rows without folding them, so it never competes with the rows it labels. Folding belongs to a row, which has a chevron and a rail to say which rows it owns.
- **The menu is typed in the `label` family, not `body`.** A menu row is compact UI text, which is what `.text-label-*` is for. Rows — `Menu.Item`, `Menu.SubTrigger` and `Menu.Back` alike — are `.text-label-md` (14 px) in `var(--text-default)`. **Only the first-level group title is smaller and muted:** `.text-label-sm` (12 px) in `var(--text-muted)`, which replaced the overline and is the one place the menu changes register. Hierarchy below that is carried by the indent and the rail, not by shrinking each level — and a component with two render branches must give both the same label class, or the same menu renders two sizes.
- Prefer `groups` when the tree is data. Hand-composing a recursive tree with `v-for` means re-implementing recursion in the consuming app; the data path renders through the same sub-components.
- Draw the elbow with borders, not a glyph: `w-[var(--spacing-sm)] h-4 -left-[var(--spacing-sm)] border-l border-b border-[var(--border-default)] rounded-bl-[var(--shape-elements)]` on the row's `::before`, and the continuation on its `::after`, hidden on `:last-child`. All tokens, no SVG, and it scales with the row.
- Do not nest more than three levels. Past that the indent eats the rail's readable width; restructure with a drill row instead.
- A drill row navigates **on its one activation**, not through a second target. Splitting the row into a link plus a drill affordance is what costs a second tab stop and nests interactive elements — that shape stays rejected. Instead the single button both pushes the level and emits `navigate`, so the consumer routes to the level's landing page as it opens: one target, one tab stop, and the user never opens a second-level menu while still looking at the page they came from. The landing page is still the first item inside the level, so the level reads complete on its own.

## Usage

`Sidebar` already renders the `<nav>` landmark, so the menu inside it gives up **both** halves of
its own: `role="presentation"` suppresses the nested landmark, and the accessible name goes with it
(the component drops `aria-label` on its own — a presentational element takes no name). In a host
that is *not* a landmark — a drawer, a plain `<div>` — drop the `role` and keep `aria-label`, which
is the shape every story below uses.

```vue
<script setup>
import Menu from '@aziontech/webkit/menu'
import Sidebar from '@aziontech/webkit/sidebar'
</script>

<template>
  <Sidebar aria-label="Console">
    <Menu role="presentation">
      <Menu.Back />

      <Menu.Group
        label="User agents"
      >
        <Menu.Item
          label="End User"
          icon="pi pi-user"
          href="/end-user"
          selected
        />
        <Menu.Item
          label="Web Browser"
          icon="ai ai-domains"
          href="/web-browser"
        />
      </Menu.Group>

      <Menu.Group label="Azion platform">
        <Menu.Sub default-open>
          <Menu.SubTrigger
            label="Getting started"
            icon="pi pi-book"
            kind="inline"
          />
          <Menu.SubContent>
            <Menu.Item
              label="Installation"
              href="/docs/install"
            />
          </Menu.SubContent>
        </Menu.Sub>

        <Menu.Sub>
          <Menu.SubTrigger
            label="Settings"
            icon="pi pi-cog"
            kind="drill"
          />
          <Menu.SubContent>
            <Menu.Item
              label="General"
              href="/settings/general"
            />
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Group>
    </Menu>
  </Sidebar>
</template>
```

Tree-shaking alternative — the standalone root plus each sub-component from its own entry (no
`Object.assign` compound pulled in):

```vue
<script setup>
import Menu from '@aziontech/webkit/menu-root'
import MenuGroup from '@aziontech/webkit/menu-group'
import MenuItem from '@aziontech/webkit/menu-item'
</script>
```

## Sub-components

The root ships a **compound API**: an `index.ts` beside `menu.vue` attaches every sub-component so
`<Menu.Group>` / `<Menu.Sub>` resolve from one import; the standalone imports above remain the
tree-shaking path. Two contexts flow through `provide`/`inject` (`injection-key.ts`): the **root
context** (drill stack, active id, testid) and the **sub context** (open state, ids, nesting
level), so the consumer wires nothing.

`Group`, `Sub` and `SubTrigger` carry `data-state="open|closed"` and `aria-expanded`, which is what
makes `SubTrigger` / `SubContent` the correct anatomy names. `Group` is deliberately **not** split
into a Trigger + Content pair: its header is a label and a toggle glyph, nothing arbitrary, so a
`label` prop with a `default` slot fallback is the honest surface and keeps the common case one
element instead of three.

- `menu-item/menu-item.vue` — `Menu.Item`, the leaf navigation row. **Moved into this component's folder** (from `navigation/menu-item/`) so it is a real sub-component rather than a sibling reached across folders: it is a part of `Menu`'s anatomy, and keeping it outside meant its typography and its icon box could drift from the rows it sits beside — which is exactly what happened. Its `./menu-item` export path is unchanged for consumers (the key now points at the new location), as are its props, events, slots and **every default**.
  - **Two changes made to it**, both fixing drift against the rows around it:
    1. The leading icon box renders **only when `icon` is set**. An empty `size-8` box reserved a column the row did not use, pushing an icon-less row's label off the column its siblings hold and leaving the rail anchored to blank space.
    2. Its **two branches now share one label class**. The anchor branch was `.text-label-sm` (12 px) and the button branch `.text-body-sm` (14 px), so the same menu rendered two sizes depending on whether a row happened to carry an `href` — children came out *smaller than their parents*. Both are now `.text-label-md`.
  - Props: `kind?: 'option' | 'group'` (default `'option'` — navigable row or section overline label), `label?: string` (default `'Option 1'` — visible text for the row or group header), `selected?: boolean` (default `false` — applies the selected surface on option rows), `disabled?: boolean` (default `false` — blocks interaction on option rows), `icon?: string` (default `'pi pi-home'` — PrimeIcons class for the leading glyph, option kind only; an empty string renders **no icon box at all**), `href?: string` (default `''` — renders an anchor instead of a button when set on an enabled option row), `target?: '_self' | '_blank'` (default `'_self'` — link target when `href` is set), `tagValue?: string` (default `undefined` — short text rendered in a trailing `Tag`), `tagSeverity?: MenuItemTagSeverity` (default `'info'` — severity token for that trailing `Tag`, one of `primary | secondary | success | info | warning | danger | accent`).
  - Events: `click` — `(event: MouseEvent, item: { label: string; href: string })`. `item` carries the row's `label` and `href`, identifying which row was activated (event-first per `event-payloads.md`).
  - Slots: `default` — replaces the label text; `tag` — replaces the trailing `Tag` (its presence alone renders the tag region, with or without `tagValue`).
  - **This spec is menu-item's only spec.** It previously carried its own `.specs/menu-item.md`, which is removed with this change: a sub-component of a compound is documented in the compound's spec, the way `menu-sub` and `menu-group` already are. The `./menu-item` export path stays public, so its API lives here (that is what `build-catalog.mjs` reads to give the path an entry in `catalog.json`).
  - **Deliberately deferred — this release is additive only.** The redesigned row (a `size-3` icon, `var(--primary)` on the selected icon, `var(--border-default)` on the selected surface, the box model below, and `::before` / `::after` ghost layers replacing its root `transition-colors`) is a **visual breaking change** and is therefore **out of scope here**. It lands later as a `spec_version: 2` revision of *this* spec, on a major. Until then `Menu` renders today's row: correct behaviour, old visuals.
- `menu-group/menu-group.vue` — A section that separates rows under a title. Renders a `<section>` (`flex flex-col`) holding a **static** title row — no toggle, no hover surface, not a control — plus the bare `<ul>` that holds the rows. The label is `.text-label-sm` in `var(--text-muted)` — **not** an overline: no uppercasing and no baked-in tracking, so `.text-overline-xs` is deliberately not used. It takes `my-[var(--spacing-sm)]`, dropped to `0` on the first group so the menu does not start with a gap. **It draws no connector rail and applies no indent** — its rows sit flush with an ungrouped row's, because the label already separates the section and the rail means something else (see Best practices).
  - Props: `label?: string` (default `''` — the title text; omit for an unlabeled block), `ariaLabel?: string` (default `''` — accessible name when there is no visible `label`).
  - No `open` model and no `collapsible`: a section is not a disclosure.
  - **A root group plays the rail's own entrance** when the menu mounts with an empty stack and the root's `enterOnMount` is set — the case where the reader travelled *back out* of a level and the host remounted, leaving the group no rendered off-canvas position to slide from. A group behind a *pushed* level does not (it should stay put, not animate in behind the level), and a **nested** group never travels on its own: the level carries it.
  - Slots: `default` — the group's rows; `label` — replaces the header text.
- `menu-sub/menu-sub.vue` — The `<li>` that owns a row plus that row's children. Provides the sub context (open state, generated trigger/content ids, nesting level derived from any ancestor sub) so its trigger and content need no wiring.
  - Props: `defaultOpen?: boolean` (default `false` — initial state when uncontrolled; ignored for `kind="drill"`, whose visibility is the root's stack).
  - Model: `open` — `boolean | undefined`, default `undefined` (controlled via `v-model:open`).
  - Slots: `default` — exactly one `SubTrigger` and one `SubContent`.
- `menu-sub-trigger/menu-sub-trigger.vue` — The row that owns children, and a **heading for them**.
  - **Geometry matches `Menu.Item` exactly** — height, padding (including `py`), gap, 32 px icon box, glyph size, and the unset root font-size that sizes that glyph — so its icon and label columns line up with the leaves around it.
  - **Typography is a row's, not a title's.** Its label is `.text-label-md` in `var(--text-default)` — the same treatment `Menu.Item` uses. Only a **first-level group title** is allowed to be smaller and muted (`.text-label-sm` in `var(--text-muted)`, the thing that replaced the overline); from there every row is 14 px, a trigger included, however deep it sits. A row that owns children is still a row.
  - **An inline trigger carries no icon; a drill trigger may.** An inline row is a separator for the rows it expands *beneath itself*, in their own column — a glyph there competes with the rows it owns, so the column belongs to them and only the chevron sits on the trailing edge. A drill row has nothing beneath it (it **replaces** the menu), so it is read as one of the destinations it is listed among and takes an icon for the same reason they do. The component **enforces** this rather than trusting the caller: `showIcon` is `icon && kind === 'drill'`, so an inline trigger handed an `icon` still renders none. When shown, the glyph uses `Menu.Item`'s own box (32 px, `pl-[var(--spacing-xxs)]`, `size-4` glyph, muted → default on hover) so it lands on the same content column as the leaves around it. With `kind="inline"` it renders a rotating `pi pi-chevron-down`, toggles the sub through context, and exposes `aria-expanded` / `aria-controls`. With `kind="drill"` it renders a static `pi pi-chevron-right`, pushes its sub onto the root's stack, and carries **no** `aria-expanded` — nothing expands, so the attribute would be a lie.
  - **A drill trigger is a destination as well as a level.** In data-driven mode a `kind: 'drill'` node emits `navigate` `(event, node)` on activation, alongside pushing its level — so a consumer can route to the level's landing page while the level opens, rather than leaving the user on the page they were already on. An inline trigger emits nothing: toggling a disclosure is not a navigation.
  - Props: `label?: string` (default `''` — visible row text), `kind?: 'inline' | 'drill'` (default `'inline'` — whether children expand in place or replace the menu), `icon?: string` (default `''` — leading glyph; honoured for `kind="drill"` only, see above), `disabled?: boolean` (default `false` — blocks toggling and pushing).
  - Slots: `default` — replaces the label text.
- `menu-sub-content/menu-sub-content.vue` — The children of a sub, in one of two shapes depending on its trigger's `kind`.
  - `kind="inline"` — a nested bare `<ul>` (`relative m-0 list-none p-0 flex flex-col`) whose `padding-left` is `calc(var(--spacing-sm) * 2)`, with the connector rail drawn on its `li` children. **Kumo indents with padding alone and draws no rail; we keep the rail** — the one place this component deliberately adds to the reference, because the Figma frame specifies it and it is what makes a three-level docs tree readable.
  - It renders the anchor `Menu.Back` teleports into, at the top of its own box (see `menu-back`).
  - `kind="drill"` — **a second-level menu with the same anatomy as the root**, not a flat row list: a `<div role="group">` labelled by its trigger, so it holds `Menu.Group`s exactly like the root does. It therefore follows the root's composition rule — rows live inside a `Menu.Group` (an unlabeled one for a flat level), because a `<ul>` here could never contain a group's `<section>`. It mounts only while its sub is on the stack, draws no rail (a pushed level is not indented), and its own mount is the one phase CSS cannot tween, so a `<Transition>` supplies the from-frame. **That Transition must always exist before its child does**, so the level is withheld for one tick after its Teleport becomes renderable and every arrival — a live push and a restored stack alike — takes the same `enter` path. `appear` is deliberately **not** used: the Teleport's target is the root's level host, a ref the root sets in *its* `onMounted`, which runs after this component's (children mount first) — so on a restored stack the Transition and its child would first render together and the appear hooks would not play, making the entrance depend on where the reader happened to come from.
  - A `Menu.Group` nested inside a drilled level is part of that level and never steps aside on its own — the level slides as one piece. Only a **root-level** group translates out on a push.
  - Slots: `default` — the nested rows.
- `menu-back/menu-back.vue` — The return row for drill levels. **It renders inside the current level, not where it is declared:** the level exposes an anchor through the root context and Back teleports into it. That placement is load-bearing on two counts — the level's own slide animates Back for free (no second transition to keep in sync), and Back never occupies the root's flow, so popping cannot shift the menu it returns to. Held in the root's flow it reserved a 32 px row plus its margin for the whole exit, pushing the returning menu down and snapping it back at the end. A level claims the anchor when it becomes current and releases it only when it **unmounts**, so a level still sliding out keeps its header; Back holds the last level label for the same reason, since the stack empties the instant a pop begins. It carries `mb-[var(--spacing-sm)]` so it reads as heading the level rather than as the first row of the level's first group. It spans the full row width with its label **centred** — it heads a level rather than navigating within one — and uses the same label class as every other row, so it reads at the rows' size. Its padding is symmetric (unlike a nav row's) so the centred label lands on the true midpoint, while its chevron still sits on the rows' icon column. Context-aware: it reads the root's stack and **renders nothing at the root level**, so it can be declared unconditionally. Its accessible name names the level it returns to. It reads the label from the root's level map, which every drill sub fills when its **trigger mounts** — not only on a push — so a stack restored through `v-model:path` still names its level instead of rendering a bare chevron.
  - Props: `label?: string` (default `''` — overrides the parent trigger's label taken from context).
  - Slots: `default` — replaces the label text.

**Known testid conflict.** The root derives `data-testid="navigation-menu"` (`<category>-<name>`),
which is the literal string `navigation-menu-root.vue` already emits for the horizontal megamenu.
That component escapes the derivation check only because its folder has no conventionally-named
root `.vue`, and its own name stutters the category — which
[`imports.md`](../.claude/rules/imports.md) forbids ("the category lives in the folder, never in
the public name"). Both facts point at the same follow-up: rename that component to `mega-menu`,
freeing `navigation-menu` and fixing the stutter. Until it lands, the two testids are ambiguous
only in an app that renders a horizontal megamenu and this vertical menu in the same tree.

Resulting layout (no per-component `package.json` — the root `packages/webkit/package.json#exports`
resolves every path; `.d.ts` is generated at publish time, never committed):

```
packages/webkit/src/components/navigation/
└── menu/
    ├── menu.vue                    (root; owns the drill stack + data mode, provides root context)
    ├── menu-item/                  (MOVED here from navigation/menu-item/ — a real sub-component)
    │   ├── menu-item.vue
    │   └── menu-item.test.ts
    ├── index.ts                    (compound: Group / Item / Sub / SubTrigger / SubContent / Back)
    ├── injection-key.ts            (MenuContext + MenuSubContext)
    ├── composables/
    │   ├── use-menu-context.ts     (throws outside <Menu>)
    │   └── use-menu-sub-context.ts (throws outside <Menu.Sub>)
    ├── presets/
    │   └── transitions.ts          (height collapse timing; imports duration/curve from animate.js)
    ├── menu-group/
    │   └── menu-group.vue
    ├── menu-sub/
    │   └── menu-sub.vue
    ├── menu-sub-trigger/
    │   └── menu-sub-trigger.vue
    ├── menu-sub-content/
    │   └── menu-sub-content.vue
    └── menu-back/
        └── menu-back.vue
```

**Scope — additive only.** Every file in the `menu/` tree above is **new**. Two existing files are
touched, neither in a way a consumer can observe as a break: `packages/webkit/package.json#exports`
by **adding** keys (no existing key changes target), and `sidebar.vue` by **adding one CSS variable**
to its `<nav>` (`--menu-ring-offset`, beside the `--menu-item-ring-offset` it already sets) so a menu
hosted there rings against the sidebar's surface. No existing prop, default, event, slot or
`data-testid` anywhere in the package is altered, and nothing is deprecated or removed. The release
is a `feat` (minor), never a `feat!`.

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the
folder only). `./menu-item` already exists; its **key is unchanged** and only its target moves:

```jsonc
"./menu": "./src/components/navigation/menu/index.ts",
// retargeted, not added — the public key is untouched:
"./menu-item": "./src/components/navigation/menu/menu-item/menu-item.vue",
"./menu-root": "./src/components/navigation/menu/menu.vue",
"./menu-group": "./src/components/navigation/menu/menu-group/menu-group.vue",
"./menu-sub": "./src/components/navigation/menu/menu-sub/menu-sub.vue",
"./menu-sub-trigger": "./src/components/navigation/menu/menu-sub-trigger/menu-sub-trigger.vue",
"./menu-sub-content": "./src/components/navigation/menu/menu-sub-content/menu-sub-content.vue",
"./menu-back": "./src/components/navigation/menu/menu-back/menu-back.vue"
```

## Props

Props below belong to the root `Menu`. Sub-component props are documented in the
**Sub-components** section above.

Two exported node types describe the data mode:

```ts
export type MenuNode = {
  id: string
  label: string
  icon?: string
  href?: string
  target?: '_self' | '_blank'
  tagValue?: string
  disabled?: boolean
  kind?: 'inline' | 'drill'
  defaultOpen?: boolean
  children?: MenuNode[]
  // A drill level is a menu, so it is described by the SAME shape the root takes.
  // `kind: 'drill'` only; ignored on an inline row, which is a list and not a level.
  // Takes precedence over `children` when both are set.
  groups?: MenuGroupNode[]
}

export type MenuGroupNode = {
  label?: string
  items: MenuNode[]
}
```

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `groups` | `MenuGroupNode[]` | `[]` | no | Data-driven navigation tree; each entry renders through `Menu.Group` and its items through `Menu.Item` / `Menu.Sub`. Composes with the `default` slot rather than replacing it. |
| `activeId` | `string` | `''` | no | Id of the node rendered as selected in data-driven mode. |
| `enterOnMount` | `boolean` | `false` | no | Plays the level entrance when the stack is already populated at mount, for a restored stack whose arrival is an entrance rather than a move inside a level the user was already in. |
| `ariaLabel` | `string` | `'Menu'` | no | Accessible name for the navigation region. |

The root also owns **`v-model:expanded`** — `string[]`, default `[]` — the ids of the inline subs
currently open. Expansion belongs to the root, not to each sub, for two reasons: one sub opening
must not disturb another, and a consumer whose shell remounts on navigation (a per-page layout,
say) can persist the list and hand it back, which per-sub local state cannot survive. A sub's
`defaultOpen` seeds the set once per id, so it never fights state the consumer supplied.

## Events

| Event | Payload | Notes |
|---|---|---|
| `navigate` | `(event: MouseEvent, node: MenuNode)` | A leaf row — or a `kind: 'drill'` row, which is a destination as well as a level — was activated in data-driven mode; `node` is the activated tree node. An inline trigger does not emit it: toggling a disclosure is not a navigation. |
| `update:path` | `string[]` | `v-model:path` — the drill stack as ancestor node ids, outermost first. Empty at the root level. **Persist it when the host remounts** (and always when a drill row navigates, which remounts the shell in most routers) or the level closes on the very navigation that opened it. A stack supplied this way is restored **with its label, its trigger, and its entrance**: every drill sub announces the first two to the root when its trigger mounts (not only when pushed), so `Menu.Back` still names the level and popping still returns focus to the row that owns it; and the level *arrives* rather than simply being there — see the restored-level row in Motion. |
| `update:expanded` | `string[]` | `v-model:expanded` — ids of the inline subs currently open. Persist it when the host remounts, or expansion resets and one sub appearing to close another. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The composed anatomy. Rendered **before** the `groups` tree, not instead of it — so a `Menu.Back` can accompany a data-driven menu, which is the one row `groups` cannot express (a drilled level would otherwise have no pointer route back). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`, `disabled`
- `data-state` values: `open` | `closed` — on `Sub`, `SubTrigger` and `SubContent`. A `Group` has none: it never closes.
- `data-kind` values: `inline` | `drill` — on `SubTrigger` and `SubContent`
- `data-selected` mirrors the `selected` prop on `Menu.Item`
- `data-disabled` mirrors the `disabled` prop on `Menu.Item` and `SubTrigger`
- `data-level` on `SubContent` — nesting depth, drives the indent step
- `data-motion` values: `push` | `pop` | `none` — on a drill level, so the direction of the slide is a Tailwind `data-[motion=…]` variant instead of a `:class` ternary (see Motion)
- `data-level` on `SubContent` also drives the indent step at each depth
- `data-node-id` on a `Sub` rendered from `groups` — carries the `MenuNode.id` so `update:path` reports real node ids rather than generated ones
- Empty: `groups` is `[]` and the `default` slot is empty → the root renders nothing; the empty
  message belongs to the host shell, not the menu.

## Motion & Animations

Every piece of this component's motion is **per-phase, open-vs-close, driven by `data-state`** —
which DESIGN.md § Motion ("When to use which pattern") routes through a **`presets/transitions.ts`**
module, *not* through the catalogued `animate-*` utilities. So `menu/presets/transitions.ts` imports
`duration` / `curve` from the theme and returns the inline `transition`; the transform / height /
opacity themselves stay in Tailwind classes on `data-[…]` variants.

**No catalogued keyframe utility is used by this component.** That is deliberate on two counts: the
catalogued keyframes are fixed-direction entrances with baked-in timing and cannot express a
push-vs-pop pair off one `data-state`; and the catalogued height keyframe (height 0 → auto) would
fight the JS height transition on the very same element. No raw `ms`, no `cubic-bezier` literal, and
no Tailwind default duration or easing utility appears anywhere.

(This section deliberately names no keyframe utility, not even to rule one out: the compliance
check scrapes the whole section for those class names and treats every hit as required.)

The height collapse lives **inside `SubContent`** — the element that mounts and unmounts is the
nested `<ul>` — as a local `:css="false"` `<Transition>` whose `enter` / `leave` hooks drive `height`
and short-circuit on `prefers-reduced-motion`. A `Group` has no collapse at all. Do not import `accordion` (or any of its
sub-components) to get this — see Related.

| Trigger | Animation / Transition | Token (from `presets/transitions.ts`) | Reduced-motion fallback |
|---|---|---|---|
| inline sub expands | `height` 0 → content, local `:css="false"` `<Transition>` | `duration['moderate-01']` · `curve['productive-entrance']` | `prefers-reduced-motion` short-circuit — `done()` immediately, no transition set |
| inline sub collapses | `height` content → 0, same `<Transition>` | `duration['moderate-01']` · `curve['productive-exit']` | same short-circuit in the `leave` hook |
| drill push — level enters | `translate-x` 100% → 0 **and `opacity` 0 → 1** | `duration['moderate-02']` · `curve['productive-entrance']` | `motion-reduce:transition-none motion-reduce:transform-none` |
| drill push — level leaves | `translate-x` 0 → -100% **and `opacity` 1 → 0** on `data-motion="push"` | `duration['moderate-01']` · `curve['productive-exit']` | `motion-reduce:transition-none motion-reduce:transform-none` |
| drill pop — level enters | `translate-x` -100% → 0 on `data-motion="pop"`, **fully opaque** — the arriving surface must cover what leaves behind it, so the enter phase transitions `translate` only | `duration['moderate-02']` · `curve['productive-entrance']` | `motion-reduce:transition-none motion-reduce:transform-none` |
| drill pop — level leaves | `translate-x` 0 → 100% **and `opacity` 1 → 0** on `data-motion="pop"` | `duration['moderate-01']` · `curve['productive-exit']` | `motion-reduce:transition-none motion-reduce:transform-none` |
| **level** restored from `v-model:path`, **with `enterOnMount`** (a level on the stack at first render) | same as *drill push — level enters*: `SubContent` withholds the level for one tick after its Teleport becomes renderable, so it arrives through the ordinary **enter** transition rather than `appear`; the root sets `data-motion="push"` on mount so the surfaces and timing match a real push | `duration['moderate-02']` · `curve['productive-entrance']` | `motion-safe:` on the from-class, so the reduced-motion render never gets the off-canvas frame |
| **root** restored with `enterOnMount` (an *empty* stack at first render) | `translate-x` -100% → 0, opaque, played by the `<Transition :appear>` in `Group`; the root sets `data-motion="pop"` on mount. The rail arriving is an entrance too — coming back out of a level, the groups have no rendered off-canvas position to tween from, because the host remounted. `Group` **can** use `appear` (unlike `SubContent`) because it is not teleported: it renders in the component's own first render, which is exactly what `appear` covers | `duration['moderate-02']` · `curve['productive-entrance']` | `motion-safe:` on the from-class |
| either, restored **without** `enterOnMount` (the default) | none — the menu renders in place | — | — |

**The direction is derived, not passed.** A menu that mounts inside a level was travelled *into*
(`push`); one that mounts at the root was travelled *back to* (`pop`). So `enterOnMount` stays a
single boolean — the consumer says only *whether* this arrival was a journey, never which way.

**A restored entrance is opt-in, and that is not a default chosen for caution.** Only the owner of
the persisted stack can tell the arrivals apart: travelling between levels and moving *within* the
level the reader is already in both remount the host and both hand back the same `path`, so from
inside this component they are identical. Animating on mount unconditionally replays the entrance
on every navigation inside the level, which reads as the menu re-opening under a reader who never
left it. The consumer therefore sets `enterOnMount` only for an arrival that was travelled to.

**Derive it from the page, not from the control.** A consumer that keys `enterOnMount` to its own
nav row's activation animates only that one route in; the same destination reached from a header
menu, a command palette or a pasted link then arrives unanimated. Comparing the level the page
belongs to against the level of the page before it covers every entry point with one rule — and a
first render is never an entrance, since a cold load arrives already inside rather than travelling
there. A **pop by `Menu.Back`** needs none of this: it changes no route, so the same instance
handles it and the pop motion plays as usual.

**Every phase moves and fades**, and the leaving side must reach **0%**: `-translate-x-full`
moves a level by its **own width**, which does not clear the clipping edge when the host insets
the menu (a `Sidebar` pads by `--spacing-md`, leaving that many pixels of the outgoing level on
screen). The component cannot know its host's padding, so the residual sliver is faded out rather
than chased with a larger translate.

Two structural details are what make the cross-fade read as a push instead of as ghosting, and
both are load-bearing:

1. **The level host is not positioned.** It sits after the groups, so an out-of-flow level would
   resolve its `top` against the host and trail *below* the menu that replaced it — the outgoing
   level showing under the incoming one was this, not the fade.
2. **The current level carries `z-10` against the leaving level's `z-0`.** An out-of-flow element
   paints above an in-flow sibling by default, which would otherwise put the level being replaced
   on top of the one replacing it.
| row hover | `::before` ghost layer, `before:transition-opacity` | `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:before:transition-none` |
| row active | `::after` ghost layer, `after:transition-opacity` | `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:after:transition-none` |
| inline chevron rotates on open | `transition-transform` | `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none motion-reduce:transform-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (first-level group title) | `.text-label-sm` |
| typography (every row: Item, SubTrigger, Back) | `.text-label-md` |
| surface (row hover) | `var(--bg-hover)` |
| surface (row selected) | `var(--bg-selected)` |
| border (selected row, connector rail) | `var(--border-default)` |
| text (row label) | `var(--text-default)` |
| text (group label, idle icon) | `var(--text-muted)` |
| text (disabled row) | `var(--text-disabled)` |
| icon (selected row) | `var(--primary)` |
| shape (row, rail elbow) | `var(--shape-elements)` |
| spacing (row padding-x, icon-to-label gap, group-label margin-y, rail column) | `var(--spacing-sm)` |
| surface (row pressed, `::after` ghost) | `var(--bg-active)` |
| ring | `var(--ring-color)` |
| ring offset | `var(--bg-canvas)` (host-overridable, see below) |
| surface while sliding | `var(--menu-slide-surface, var(--bg-surface))` |

Geometry — the Kumo box model re-expressed in our tokens. Every Kumo value in the middle column is
something DESIGN.md forbids in a webkit component (arbitrary `p-*`/`gap-*` where a
`spacings.data.js` token applies, `rounded-lg`, Tailwind default durations, `cubic-bezier`
literals), so the right column is the contract:

| Region | Kumo | Ours (DESIGN.md) |
|---|---|---|
| list reset | `m-0 list-none p-0 flex flex-col` | adopted as-is — structure, no values |
| row padding-x | `px-3` (12 px) | `px-[var(--spacing-sm)]` — exact match |
| icon-to-label gap | `gap-2.5` (10 px) | `gap-[var(--spacing-sm)]` (12 px) — the Figma value; no 10 px spacing token exists |
| group-label margin-y | `my-3` (12 px) | `my-[var(--spacing-sm)]`, `0` on the first group — exact match |
| row min-height | `min-h-8.5` (34 px) | `min-h-8` — the theme size scale (checklist § Sizing), and the Figma frame's row height |
| icon size | — | `size-3` — theme size scale, matches the Figma 12 px glyph |
| row radius | `rounded-lg` (8 px) | `rounded-[var(--shape-elements)]` — DESIGN.md forbids `rounded-lg` and every numeric radius |
| rail connector column | — (Kumo draws no rail) | `var(--spacing-sm)` (12 px) — the elbow's width and its negative offset |
| rail elbow height | — | `h-4` — half the row, so the horizontal leg meets the row's centre line |
| nested indent | `pl-7` (28 px) | `pl-[calc(var(--spacing-sm)+var(--spacing-md))]` (**28 px — matched to the reference**); narrower than our own 40 px icon column, so children sit slightly left of the parent's label rather than on it. Both tokens are breakpoint-fixed, unlike `--spacing-lg` / `--spacing-xl` |
| hover / active | `hover:bg-*` on the root | `::before` / `::after` ghost layers on `var(--bg-hover)` / `var(--bg-active)` — DESIGN.md § Interactive states |
| focus | `focus-visible:bg-*`, no ring | `focus-visible:ring-2` + `ring-offset-1` on `var(--ring-color)` — DESIGN.md § Interactive states; a visible ring is required by [`accessibility.md`](../.claude/rules/accessibility.md), so our standard wins over the reference |
| motion | `250ms cubic-bezier(0.77, 0, 0.175, 1)` | `duration` / `curve` from `animate.js` only — see Motion |

**A sliding surface carries a fill, and only while it slides.** Backgroundless layers cannot
occlude one another: cross-sliding two of them through one viewport, you read the leaving layer
through the gaps between the arriving layer's rows — opacity does not help, because opaque *text*
hides nothing. So a surface in motion (`data-motion="push"` or `"pop"`) takes
`var(--menu-slide-surface, var(--bg-surface))`, and drops it again at rest. A host on a different
fill sets `--menu-slide-surface` to match; at rest the menu is as transparent as it ever was.

The menu paints no background of its own at rest — the host supplies the surface. The focus ring's offset
colour therefore comes from the host through `var(--menu-ring-offset, var(--bg-canvas))`, the same
pattern `sidebar.vue` already uses to hand `menu-item` its own offset — and `sidebar.vue` now sets
**both** variables on its `<nav>`, so a menu dropped into a `Sidebar` rings against the sidebar's
own fill with nothing to wire. A host on a different surface sets `--menu-ring-offset` the same way.

## Theme gaps

The rail is **not** a gap: its column is `var(--spacing-sm)` and its indent is
`calc(var(--spacing-sm) * 2)`, so the geometry needs no new token and never touches the
breakpoint-responsive `--spacing-lg` / `--spacing-xl`. Only one external value has no token behind
it.

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| Kumo row-to-row gap `1px` (`gap-y-px`) — a hairline that makes adjacent hover surfaces read as separate rows | **None.** Rows are flush (`flex flex-col`, no `gap-y`). DESIGN.md forbids arbitrary spacing utilities and directs new values to `spacings.data.js`; the smallest token is `--spacing-xxs` (4 px), which is 4× too large. Kumo's paired `before:-inset-y-px` hit-area bleed is dropped with it — with no gap there is no dead strip to cover. | `TODO: tokenizar` — add a `spacing-hairline` (`1px`) entry to `spacings.data.js`, then set `gap-y-[var(--spacing-hairline)]` on every list and restore the bleed. Purely cosmetic; the menu is correct without it. |

Two further reference values are **conscious mappings, not gaps** — DESIGN.md already dictates the
answer, so no token is missing: Kumo's `min-h-8.5` (34 px) becomes `min-h-8` (the theme size scale,
and the Figma row height), and its `rounded-lg` (8 px) becomes `var(--shape-elements)`, since
`rounded-lg` and every numeric radius are forbidden outright.

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]` — `ring-offset-1` per [`DESIGN.md`](../.claude/docs/DESIGN.md) § Interactive states, with the offset colour handed down by the host (`Sidebar` sets `--menu-ring-offset` to its own surface, mirroring the existing `--menu-item-ring-offset` pattern).
- Keyboard map: `Tab` / `Shift+Tab` move between rows; `Enter`/`Space` activates a row, toggles an inline `Sub`, or pushes a drill level; `ArrowRight` expands a collapsed inline `Sub` or pushes a drill level; `ArrowLeft` collapses an expanded inline `Sub`, or pops one drill level when the current level is not the root; `Escape` pops one drill level.
- ARIA:
  - The root renders a plain container with `role="navigation"` and `aria-label` from `ariaLabel`. It does **not** render `<nav>`: the menu is injected into a host that may already be a `<nav>` landmark (`Sidebar` is), and nesting landmarks duplicates them in the landmark list. When the host provides the landmark, the consumer suppresses the role by passing `role="presentation"` — and **the name goes with the role**: the root renders no `aria-label` under `role="presentation"` / `"none"`, because ARIA prohibits naming a presentational element and the a11y tree drops the name anyway. The consumer therefore suppresses the landmark with one attribute rather than remembering to unset `ariaLabel` as well.
  - `Group` is a `<section>` named by its title through `aria-labelledby` (id from `useId()`), or by `aria-label` when there is no visible title. It exposes **no** `aria-expanded` and contains no control — the title is text.
  - Inline `SubTrigger` carries `aria-expanded` + `aria-controls` pointing at its `SubContent`.
  - Drill `SubTrigger` carries **no** `aria-expanded` — it replaces the view rather than expanding one. On push, focus moves to the level's `Back` row and the pushed `<ul>` takes `aria-label` from the trigger's label; on pop, focus returns to the trigger that pushed it. A level that is not current carries **both `aria-hidden` and `inert`** while it is still mounted for the slide, so it leaves the accessibility tree and the tab order together (the pattern Kumo's `SlidingViews` uses).
  - `Back` is a `<button>` whose accessible name names its destination (`Back to Settings`).
  - A selected `Menu.Item` rendered as an anchor carries `aria-current="page"`; a disabled row carries `aria-disabled` and is removed from the tab order.
  - The connector rail and every chevron are `aria-hidden="true"` — decorative, and the indentation already conveys the hierarchy.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state. The rail (`var(--border-default)`, ≈1.5:1) is exempt: it is decorative and carries no information the indentation does not, so 1.4.11 does not apply.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target — **justified deviation from ≥40×40 px.** Rows are 32 px tall, matching the Figma frame's `h-button-md` and the density a product navigation needs. Every target is full-row width (≥252 px), so all clear WCAG 2.5.8's 24×24 minimum. The Figma frame's 16×16 group toggle would have failed that minimum; it is moot here, because a group title is not a control at all.

## Stories (Storybook)

- Default — a console-style menu inside a `Sidebar` host: two titled `Group`s with a selected row.
- Types — composite story rendering both `SubTrigger` `kind` values side-by-side, so the `chevron-down` and `chevron-right` affordances are directly comparable.
- Condensed — **justified addition.** A three-level recursive tree with the nested indent rail. `Default` renders flat groups and cannot show the rail's nesting, which is the primary reason this component exists over `sidebar-group`.
- Drill — **justified addition.** The view stack is stateful: pushing a level, the `Back` row, and focus restoration on pop cannot be shown by any static args delta.
- Disabled — a disabled `Menu.Item` and a disabled `SubTrigger`, demonstrating that activation is suppressed.

`Sizes` is omitted: the component declares no `size` prop — row height is fixed at the Figma
frame's 32 px.

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
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
