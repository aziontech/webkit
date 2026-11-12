# Menu

> A vertical, hierarchical navigation menu. It owns no shell and no layout of its own: it is **injected into** a host — usually `Sidebar`, but any scroll container works — and renders three structures through one compound: **groups** that separate rows under a title, **condensed rows** that own children and expand in place behind an indent rail, and **drill rows** that replace the menu with a second-level menu. Unlike `navigation-menu` — the horizontal megamenu — this menu is vertical, recursive, and owns a view stack. Its box model follows Cloudflare Kumo's `Sidebar` (<https://kumo-ui.com/components/sidebar/>): full-width rows, padding inside the row rather than on the list, and indentation carried by the nested list's `padding-left`. Per [`migration.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/migration.md) only that _structure_ is adopted — every _value_ is expressed in our own tokens (see [`styling.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/styling.md)). Kumo's raw utilities (`min-h-8.5`, `rounded-lg`, `gap-2.5`, `pl-7`, `my-3`, a `cubic-bezier` literal) are all things the token rules forbid outright; the mapping is in Tokens, and the single value with no token behind it is in Theme gaps.

- Import: `import MenuRoot from '@aziontech/webkit/menu-root'`
- Compound import (dot notation, not tree-shakeable): `import Menu from '@aziontech/webkit/menu'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [menu.json](https://github.com/aziontech/webkit/blob/main/.specs/menu.json)

## When to use

- Any navigation region grouped by product or concern — placed inside `Sidebar`, a drawer, or a plain container.
- A documentation tree that nests two or three levels and must show its indentation structurally.
- A settings-style area where activating a row should replace the menu with that row's own menu, then return.
- Navigation whose tree comes from a manifest or route config rather than hand-authored markup (use `groups`).

## Do

- Put every `Menu.Item` and `Menu.Sub` inside a `Menu.Group` or an **inline** `Menu.SubContent`. Those own the `<ul>`; a row outside one is a `<li>` with no list, which is invalid HTML. A group with no `label` is the correct way to express an unlabeled block — including inside a **drill** `Menu.SubContent`, which is a level container rather than a list precisely so it can hold groups.
- Treat a drilled level as a whole menu, because it is one: give it groups and labels the way the root has them. A second-level nav that is only flat rows is a missed opportunity, not a constraint of the component.
- Let the host own width, padding and scrolling. The menu fills the width it is given and adds no outer margin, so it drops into `Sidebar`, a drawer, or a bare `<div>` unchanged.
- Keep padding **inside the row**, never on the list. Every list (`Group`'s `<ul>`, `SubContent`'s `<ul>`) is a bare `m-0 list-none p-0 flex flex-col`; the row owns `px-(--spacing-sm)` and `min-h-8`. That is what lets a row's hover surface span the full menu width instead of stopping short of a list inset.
- **The rail means parentage, not membership.** It is drawn only by an inline `Menu.SubContent`, where it ties children to the row above them. A `Menu.Group` draws none and indents nothing: its label already marks the section, so a rail there would spend the same ink saying something the label has said and dilute what the rail means everywhere else. A grouped row therefore sits flush with an ungrouped one.
- Indentation is the nested list's `padding-left`, not a margin on each row — so the rail, which is drawn relative to that padding box, stays aligned no matter what a row contains.
- One step of nesting is `--menu-indent` = `calc(var(--spacing-sm) + var(--spacing-md))` (28 px), the step the reference sidebar uses. It is deliberately **narrower than the row's own icon column** (40 px), which is a chosen trade: a tighter tree, at the cost of a child's label landing slightly left of its parent's rather than aligned with it. Widening it to 40 px would align the columns and read as more indentation.
- **One content column, `var(--spacing-sm)`.** Every row type starts its content on it, whatever the row is: a group title's text, an icon-bearing row's **glyph** (its box pads by `var(--spacing-xxs)`, and the glyph's centring inside a `size-8` box carries it the rest of the way), and an icon-less row's label — a `SubTrigger` without a glyph included — (`pl-(--spacing-sm)` directly). A `SubTrigger` that does carry one (drill only) switches to the icon-bearing inset, so both cases land on the column. Nesting shifts the whole column by exactly one `--menu-indent`, so the alignment cascades at every depth. Measured: level 1 content at 12 px for all four row types, level 2 at 40 px.
- **The rail descends from that column**, so `--menu-rail-x` is `var(--spacing-sm)` — one value for every parent, not a per-row calculation. The elbow spans from that line to the child **row's left edge** (`--menu-indent - --menu-rail-x`) and stops there: it must never reach the child's content, because the row's box begins at the indent and its hover and selected surfaces fill that box, so a wider elbow would be drawn underneath them. **The rail lives in the gutter beside the rows, never on top of one.** Every token involved is fixed at all breakpoints, unlike `--spacing-lg` / `--spacing-xl`, which would drift the elbow.
- **A row renders no icon box when it has no icon.** An empty box misreports where the row's content starts, so the label sits off the column its siblings hold and the rail anchors to blank space. This rule is what makes the column hold.
- Hover and active are `::before` / `::after` **ghost layers** per the interactive-states standard ([`component-states.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/component-states.md)) — never a `transition-colors` on the row root, and never a `background-color` swap that discards the selected fill.
- Pick one affordance per meaning: `chevron-down` expands children in place, `chevron-right` replaces the menu. A **group title carries no affordance at all** — it separates rows without folding them, so it never competes with the rows it labels. Folding belongs to a row, which has a chevron and a rail to say which rows it owns.
- **The menu is typed in the `label` family, not `body`.** A menu row is compact UI text, which is what `.text-label-*` is for. Rows — `Menu.Item` and `Menu.SubTrigger` — are `.text-label-md` (14 px) in `var(--text-default)`, and `Menu.Back` keeps that same class even though it is a button rather than a row, so it reads at the rows' size instead of shrinking into chrome. **Only the first-level group title is smaller and muted:** `.text-label-sm` (12 px) in `var(--text-muted)`, which replaced the overline and is the one place the menu changes register. Hierarchy below that is carried by the indent and the rail, not by shrinking each level — and a component with two render branches must give both the same label class, or the same menu renders two sizes.
- **A row's destination is `href`, and only `href`.** A `MenuNode` (and `Menu.Item` / `Menu.SubTrigger`) renders as an anchor when it has an `href`; any other key (`path`, `to`, `url`, `route`) is not read, and the row renders as a button with no destination. `path` on the root is a different thing: `v-model:path`, the drill stack.
- **Vue Router:** put the route's path in `href` (for a named route, `router.resolve(to).href`), then take over the click in `@navigate`: `(event, node) => { event.preventDefault(); router.push(node.href) }`, and derive `active-id` from the current route. The row stays a real link (open in a new tab, copy link address) while the router does the navigation. A modified click (Ctrl, ⌘, Shift, middle button) should be left to the browser: skip `preventDefault` when `event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0`.
- Prefer `groups` when the tree is data. Hand-composing a recursive tree with `v-for` means re-implementing recursion in the consuming app; the data path renders through the same sub-components.
- Draw the elbow with borders, not a glyph: `w-(--spacing-sm) h-4 -left-(--spacing-sm) border-l border-b border-(--border-default) rounded-bl-(--shape-elements)` on the row's `::before`, and the continuation on its `::after`, hidden on `:last-child`. All tokens, no SVG, and it scales with the row.
- Do not nest more than three levels. Past that the indent eats the rail's readable width; restructure with a drill row instead.
- A drill row navigates **on its one activation**, not through a second target. Splitting the row into a link plus a drill affordance is what costs a second tab stop and nests interactive elements — that shape stays rejected. Instead the single button both pushes the level and emits `navigate`, so the consumer routes to the level's landing page as it opens: one target, one tab stop, and the user never opens a second-level menu while still looking at the page they came from. The landing page is still the first item inside the level, so the level reads complete on its own.

## Don’t

- Horizontal top-of-page navigation with hover-opened panels → use `navigation-menu` instead.
- A menu that floats over the page from a trigger → use `dropdown` (rows + selection) or `popover` (arbitrary content) instead.
- A searchable flat command palette → use `command` instead.
- A single collapsible content region that is not navigation → use `accordion` instead.
- Mutually exclusive in-page view switching → use `tabs` (or `toggle-group` for a compact control) instead.
- The surrounding shell itself (brand header, scroll region, user footer) → that is `Sidebar`; this menu goes inside it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sidebar](sidebar.md) — the most common host. It supplies the landmark, the scroll region, and the header/footer; this menu is placed in its default slot. The two are independent — neither imports the other.
- menu-item` — **is** `Menu.Item`. The existing standalone component, attached to this compound and reachable both ways, and now documented here rather than in a spec of its own (see Sub-components). **Two changes are made to it**: an empty icon box no longer renders, and its two branches share one label class. Its wider visual redesign remains a separate, later `spec_version: 2` revision of this spec.
- sidebar-group` — functionally **superseded by `Menu.Group`**, which adds collapsing and shares the root's context. It keeps working untouched; no `@deprecated` tag is added here, because `webkit/no-deprecated-component` is `error` in the recommended config and would turn a consumer's lint green→red on a minor. Deprecating it is a separate, announced change.
- [navigation-menu](navigation-menu.md) — the horizontal megamenu. Different component, different axis; see the testid note in Sub-components.
- [accordion](accordion.md) — a **reference only**, for content disclosure rather than navigation. `Menu` borrows the _shape_ of its collapse (a `:css="false"` `<Transition>` driving `height` in JS, because CSS cannot animate to `auto`) and nothing else. `Menu` must **not** import, wrap, extend, or re-export `accordion` or any of its sub-components: a nav group is not an accordion — it has no heading-wrapped trigger, no single/multiple `type` model, no roving arrow-key model across items, and its rows are navigation, not panels. `Group` and `Sub` own their disclosure end to end. The timing itself comes from `menu/presets/transitions.ts`, not from accordion (whose inline `'height 150ms ease-out'` literal predates and violates the token rules § Forbidden in animations).
- [tag](tag.md) — renders the optional trailing badge on a row via `menu-item`'s `tagValue`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `groups` | `MenuGroupNode[]` | `[]` | false | Data-driven navigation tree; each entry renders through `Menu.Group` and its items through `Menu.Item` / `Menu.Sub`. Composes with the `default` slot rather than replacing it. |
| `activeId` | `string` | `''` | false | Id of the node rendered as selected in data-driven mode. |
| `enterOnMount` | `boolean` | `false` | false | Plays the level entrance when the stack is already populated at mount, for a restored stack whose arrival is an entrance rather than a move inside a level the user was already in. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the navigation region. Empty uses the locale catalog (`Menu`). |
| `path` | `string[]` | `() => []` | false | Two-way value (`v-model:path`). |
| `expanded` | `string[]` | `() => []` | false | Two-way value (`v-model:expanded`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent, node: MenuNode)` | A leaf row — or the **label** of a row that owns children, of either kind, since such a row is a destination as well as a container — was activated in data-driven mode; `node` is the activated tree node. A row's **arrow** does not emit it: revealing children is a move inside the menu, not a navigation. A node with nothing to point at gives the consumer nothing to route to, which is the consumer's own check. |
| `update:path` | `string[]` | v-model:path` — the drill stack as ancestor node ids, outermost first. Empty at the root level. **Persist it when the host remounts** (and always when a drill row navigates, which remounts the shell in most routers) or the level closes on the very navigation that opened it. A stack supplied this way is restored **with its label, its trigger, and its entrance**: every drill sub announces the first two to the root when its trigger mounts (not only when pushed), so the restored level still names itself in the a11y tree, `Menu.Back` can still name it as a destination from a deeper level, and popping still returns focus to the row that owns it; and the level _arrives_ rather than simply being there — see the restored-level row in Motion. |
| `update:expanded` | `string[]` | v-model:expanded` — ids of the inline subs currently open. Persist it when the host remounts, or expansion resets and one sub appearing to close another. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The composed anatomy. Rendered **before** the `groups` tree, not instead of it — so a `Menu.Back` can accompany a data-driven menu, which is the one row `groups` cannot express (a drilled level would otherwise have no pointer route back). |

## Sub-component imports

- `@aziontech/webkit/menu-group`
- `@aziontech/webkit/menu-sub`
- `@aziontech/webkit/menu-sub-trigger`
- `@aziontech/webkit/menu-sub-content`
- `@aziontech/webkit/menu-back`
- `@aziontech/webkit/menu-item`

## Sub-components

The root ships a **compound API**: an `index.ts` beside `menu.vue` attaches every sub-component so
`<Menu.Group>` / `<Menu.Sub>` resolve from one import; the standalone imports above remain the
tree-shaking path. Two contexts flow through `provide`/`inject` (`injection-key.ts`): the **root
context** (drill stack, active id, testid) and the **sub context** (open state, ids, nesting
level), so the consumer wires nothing.

`Sub` and `SubTrigger` carry `data-state="open|closed"`, and an inline `SubTrigger`'s arrow carries
`aria-expanded`, which is what makes `SubTrigger` / `SubContent` the correct anatomy names. `Group` is deliberately **not** split
into a Trigger + Content pair: its header is a label and a toggle glyph, nothing arbitrary, so a
`label` prop with a `default` slot fallback is the honest surface and keeps the common case one
element instead of three.

- `menu-item/menu-item.vue` — `Menu.Item`, the leaf navigation row. **Moved into this component's folder** (from `navigation/menu-item/`) so it is a real sub-component rather than a sibling reached across folders: it is a part of `Menu`'s anatomy, and keeping it outside meant its typography and its icon box could drift from the rows it sits beside — which is exactly what happened. Its `./menu-item` export path is unchanged for consumers (the key now points at the new location), as are its props, events, slots and **every default**.
  - **Two changes made to it**, both fixing drift against the rows around it:
    1. The leading icon box renders **only when `icon` is set**. An empty `size-8` box reserved a column the row did not use, pushing an icon-less row's label off the column its siblings hold and leaving the rail anchored to blank space.
    2. Its **two branches now share one label class**. The anchor branch was `.text-label-sm` (12 px) and the button branch `.text-body-sm` (14 px), so the same menu rendered two sizes depending on whether a row happened to carry an `href` — children came out _smaller than their parents_. Both are now `.text-label-md`.
  - Props: `kind?: 'option' | 'group'` (default `'option'` — navigable row or section overline label), `label?: string` (default `'Option 1'` — visible text for the row or group header), `selected?: boolean` (default `false` — applies the selected surface on option rows), `disabled?: boolean` (default `false` — blocks interaction on option rows), `icon?: string` (default `'pi pi-home'` — PrimeIcons class for the leading glyph, option kind only; an empty string renders **no icon box at all**), `href?: string` (default `''` — renders an anchor instead of a button when set on an enabled option row), `target?: '_self' | '_blank'` (default `'_self'` — link target when `href` is set), `tagValue?: string` (default `undefined` — short text rendered in a trailing `Tag`), `tagSeverity?: MenuItemTagSeverity` (default `'info'` — severity token for that trailing `Tag`, one of `primary | secondary | success | info | warning | danger | accent`).
  - Events: `click` — `(event: MouseEvent, item: { label: string; href: string })`. `item` carries the row's `label` and `href`, identifying which row was activated (event-first per `event-payloads.md`).
  - Slots: `default` — replaces the label text; `tag` — replaces the trailing `Tag` (its presence alone renders the tag region, with or without `tagValue`).
  - **This spec is menu-item's only spec.** It previously carried its own `.specs/menu-item.md`, which is removed with this change: a sub-component of a compound is documented in the compound's spec, the way `menu-sub` and `menu-group` already are. The `./menu-item` export path stays public, so its API lives here (that is what `build-catalog.mjs` reads to give the path an entry in `catalog.json`).
  - **Deliberately deferred — this release is additive only.** The redesigned row (a `size-3` icon, `var(--primary)` on the selected icon, `var(--border-default)` on the selected surface, the box model below, and `::before` / `::after` ghost layers replacing its root `transition-colors`) is a **visual breaking change** and is therefore **out of scope here**. It lands later as a `spec_version: 2` revision of _this_ spec, on a major. Until then `Menu` renders today's row: correct behaviour, old visuals.
- `menu-group/menu-group.vue` — A section that separates rows under a title. Renders a `<section>` (`flex flex-col`) holding a **static** title row — no toggle, no hover surface, not a control — plus the bare `<ul>` that holds the rows. The label is `.text-label-sm` in `var(--text-muted)` — **not** an overline: no uppercasing and no baked-in tracking, so `.text-overline-xs` is deliberately not used. It takes `my-(--spacing-sm)`, dropped to `0` on the first group so the menu does not start with a gap. **It draws no connector rail and applies no indent** — its rows sit flush with an ungrouped row's, because the label already separates the section and the rail means something else (see Best practices).
  - Props: `label?: string` (default `''` — the title text; omit for an unlabeled block), `ariaLabel?: string` (default `''` — accessible name when there is no visible `label`).
  - No `open` model and no `collapsible`: a section is not a disclosure.
  - **A root group plays the rail's own entrance** when the menu mounts with an empty stack and the root's `enterOnMount` is set — the case where the reader travelled _back out_ of a level and the host remounted, leaving the group no rendered off-canvas position to slide from. A group behind a _pushed_ level does not (it should stay put, not animate in behind the level), and a **nested** group never travels on its own: the level carries it.
  - Slots: `default` — the group's rows; `label` — replaces the header text.
- `menu-sub/menu-sub.vue` — The `<li>` that owns a row plus that row's children. Provides the sub context (open state, generated trigger/content ids, nesting level derived from any ancestor sub) so its trigger and content need no wiring.
  - Props: `defaultOpen?: boolean` (default `false` — initial state when uncontrolled; ignored for `kind="drill"`, whose visibility is the root's stack).
  - Model: `open` — `boolean | undefined`, default `undefined` (controlled via `v-model:open`).
  - Slots: `default` — exactly one `SubTrigger` and one `SubContent`.
- `menu-sub-trigger/menu-sub-trigger.vue` — The row that owns children, and a **heading for them**.
  - **Geometry matches `Menu.Item` exactly** — height, padding (including `py`), gap, 32 px icon box, glyph size, and the unset root font-size that sizes that glyph — so its icon and label columns line up with the leaves around it.
  - **Typography is a row's, not a title's.** Its label is `.text-label-md` in `var(--text-default)` — the same treatment `Menu.Item` uses. Only a **first-level group title** is allowed to be smaller and muted (`.text-label-sm` in `var(--text-muted)`, the thing that replaced the overline); from there every row is 14 px, a trigger included, however deep it sits. A row that owns children is still a row.
  - **One anatomy, always: a row box holding a LABEL control and an ARROW.** The root is a plain flex **box** (`relative flex h-8 w-full items-center gap-(--spacing-xxs) pr-(--spacing-xxs)`, not interactive) — nesting is not an option, since neither an anchor nor a button may contain a button, so the row itself is never the control. **The arrow is always a real `IconButton`**: it is the affordance that says the row owns children, and it must not change shape according to whether the row also has a destination.
  - **`href` decides what the LABEL does — this is the component's central decision**, and therefore how much of the row reveals the children:
    - **With an `href`** the label is an `<a>` to that destination and the **arrow alone** reveals the children. Reaching them must not cost the reader the destination.
    - **Without one** the label is a `<button>` that **reveals the children too**, so the whole row does. There is no destination to protect, and leaving the arrow as the only live target is a 28 px box — **7 % of the row's area**, with the other 93 % doing nothing — which on a phone reads as a broken menu. This is the shape most containers have (a console module's settings drill, every one of the 28 container rows in the sample's docs tree), so it is the one that must be right by default.
    - `href` is the signal rather than a boolean because it is the same data every other row in this menu uses to say where it goes, and because it makes the behaviour fall out of the tree in data-driven mode: `MenuNode.href` already exists. It also follows [`root-element.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/root-element.md) — the root switches element on a **data** prop, never an `as`/`is` string.
    - The **link** is an `<a href>` carrying `sub.triggerId`, the icon column and the row's typography (`min-w-0 flex-1`, so it fills what the arrow leaves). A real anchor, so middle-click and open-in-new-tab work; the consumer intercepts a plain left click for SPA routing. It announces its activation through `click` and does **nothing else** — it neither expands nor pushes. **A disabled row drops its `href` outright** (an anchor with no destination is not a link) and takes `tabindex="-1"` + `aria-disabled`.
    - The **arrow** is an `IconButton kind="transparent" size="small"` (28 px box, 12 px glyph), on every row. With `kind="inline"` it is a rotating `pi pi-chevron-down` that toggles the sub; with `kind="drill"` a static `pi pi-chevron-right` that pushes the sub onto the root's stack and carries **no** `aria-expanded` — nothing expands, so the attribute would be a lie. Its accessible name is derived, since the glyph alone says nothing: `Expand <label>` / `Collapse <label>` for an inline arrow (it names the state it moves to, which `aria-expanded` then confirms) and `Open <label> menu` for a drill one. It overrides `IconButton`'s ring offset with the menu's own (`ring-offset-1` against `--menu-ring-offset`) — both with `!`, because they conflict with utilities `IconButton` puts in the same class list, where stylesheet order rather than source order would otherwise decide. Its glyph colour goes through `iconClass` (onto the `i`) for the same reason, and a **disabled** arrow paints no fill (`bg-transparent!`) with `--text-disabled` ink, because `IconButton`'s filled disabled box made the arrow the brightest thing on a row whose label had dimmed away.
    - **`aria-expanded` / `aria-controls` sit on whichever control expands the children, and on exactly one of them.** With a link that is the arrow. Without one the **label** already reveals, so it carries them and the arrow becomes a **redundant pointer affordance** for the same action: `tabindex="-1"` + `aria-hidden="true"`, so it leaves the tab order and the accessibility tree rather than announcing a second control for one thing. One tab stop per row either way.
    - **The arrow keys work from the row's own control**: `ArrowRight` expands / pushes and `ArrowLeft` collapses, so a keyboard reader reaches the children without first tabbing to an arrow.
    - Focus returns, on pop, to **whichever control pushed the level** — the arrow when the label is a link, the label otherwise.
  - **An inline trigger carries no icon; a drill trigger may.** An inline row is a separator for the rows it expands _beneath itself_, in their own column — a glyph there competes with the rows it owns, so the column belongs to them and only the arrow sits on the trailing edge. A drill row has nothing beneath it (it **replaces** the menu), so it is read as one of the destinations it is listed among and takes an icon for the same reason they do. The component **enforces** this rather than trusting the caller: `showIcon` is `icon && kind === 'drill'`, so an inline trigger handed an `icon` still renders none. When shown, the glyph uses `Menu.Item`'s own box (32 px, `pl-(--spacing-xxs)`, `size-4` glyph, muted → default on hover) so it lands on the same content column as the leaves around it.
  - **A trigger announces a navigation only when it has one to announce.** In data-driven mode a node with children emits `navigate` `(event, node)` from its **link**, which exists only when the node carries an `href` — so a container that is not a destination emits nothing at all, of either kind. Revealing the children never emits: that is a move inside the menu, not a navigation.
  - Props: `label?: string` (default `''` — visible row text), `kind?: 'inline' | 'drill'` (default `'inline'` — whether children expand in place or replace the menu), `icon?: string` (default `''` — leading glyph; honoured for `kind="drill"` only, see above), `href?: string` (default `''` — the row's own destination, and the switch between the split and unsplit shapes above), `disabled?: boolean` (default `false` — blocks revealing and navigating; suppresses **every** control of the row).
  - Events: `click` `(event: MouseEvent)` — the **link** was activated, so it cannot fire on a row with nowhere to go. Declared rather than left to `$attrs` fallthrough: in the split shape the root is a box holding two controls, so a fallthrough listener would sit on that box and fire for the arrow too, making "reveal the children" also trigger the consumer's navigation.
  - Slots: `default` — replaces the label text.
- `menu-sub-content/menu-sub-content.vue` — The children of a sub, in one of two shapes depending on its trigger's `kind`.
  - `kind="inline"` — a nested bare `<ul>` (`relative m-0 list-none p-0 flex flex-col`) whose `padding-left` is `calc(var(--spacing-sm) * 2)`, with the connector rail drawn on its `li` children. **Kumo indents with padding alone and draws no rail; we keep the rail** — the one place this component deliberately adds to the reference, because the Figma frame specifies it and it is what makes a three-level docs tree readable.
  - It renders the anchor `Menu.Back` teleports into, at the top of its own box (see `menu-back`).
  - `kind="drill"` — **a second-level menu with the same anatomy as the root**, not a flat row list: a `<div role="group">` labelled by its trigger, so it holds `Menu.Group`s exactly like the root does. It therefore follows the root's composition rule — rows live inside a `Menu.Group` (an unlabeled one for a flat level), because a `<ul>` here could never contain a group's `<section>`. It mounts only while its sub is on the stack, draws no rail (a pushed level is not indented), and its own mount is the one phase CSS cannot tween, so a `<Transition>` supplies the from-frame. **That Transition must always exist before its child does**, so the level is withheld for one tick after its Teleport becomes renderable and every arrival — a live push and a restored stack alike — takes the same `enter` path. `appear` is deliberately **not** used: the Teleport's target is the root's level host, a ref the root sets in _its_ `onMounted`, which runs after this component's (children mount first) — so on a restored stack the Transition and its child would first render together and the appear hooks would not play, making the entrance depend on where the reader happened to come from.
  - A `Menu.Group` nested inside a drilled level is part of that level and never steps aside on its own — the level slides as one piece. Only a **root-level** group translates out on a push.
  - Slots: `default` — the nested rows.
- `menu-back/menu-back.vue` — The way out of a drill level. **It renders inside the current level, not where it is declared:** the level exposes an anchor through the root context and Back teleports into it. That placement is load-bearing on two counts — the level's own slide animates Back for free (no second transition to keep in sync), and Back never occupies the root's flow, so popping cannot shift the menu it returns to. Held in the root's flow it reserved a 32 px row plus its margin for the whole exit, pushing the returning menu down and snapping it back at the end. A level claims the anchor when it becomes current and releases it only when it **unmounts**, so a level still sliding out keeps its Back; a pop between levels hands the button to the level it landed on. It carries `mb-(--spacing-sm)` so it reads as heading the level rather than as the first row of the level's first group. Context-aware: it reads the root's stack and **renders nothing at the root level**, so it can be declared unconditionally.
  - **It is a button, not a row** — the one shape rule that separates it from everything beneath it. It hugs its label (`w-fit`, `max-w-full`, `px-(--spacing-sm)`, left-aligned) instead of spanning the rail with a centred label, so its hover surface is the size of the control rather than the width of a nav row. A full-width row with a centred label is exactly the shape of the rows below it, and reading as one of them makes the single control that leaves the level the hardest thing in it to find. Its chevron sits on the menu's content column (`--spacing-sm`), so it lines up with where a row's 32 px icon box centres its glyph — but it does **not** borrow that box: the chevron is tight against the label (`--spacing-xxs`), which is what keeps the label off the rows' label column. It still uses the same label class as every row, so it reads at the rows' size rather than shrinking into chrome.
  - **Its text names the destination, not the level the reader is in** — `Back to Settings`, the way a back button always reads. Naming the current level is what a _header_ does; on a left-aligned button beside a back chevron it would read as travelling to the place you are already standing. The destination is the level below the current one on the stack; when that is the menu **root** there is no trigger to name it, so the text falls back to a bare `Back` and `label` is how a consumer supplies the name (`Back to app`). The stack is read **live**, with no hold across the slide-out: naming the current level needed one (the stack empties the instant a pop begins), naming the destination never does — a pop to the root leaves the text unchanged, and a pop between levels hands the button to the incoming level, whose own destination is what the live stack now reports. The visible text is also the **accessible name** (there is no `aria-label`), so the two cannot disagree.
  - Props: `label?: string` (default `''` — names the destination, overriding the level below on the stack; set it to name the menu root, which has no trigger to name itself).
  - Slots: `default` — replaces the label text.

**Known testid conflict.** The root derives `data-testid="navigation-menu"` (`<category>-<name>`),
which is the literal string `navigation-menu-root.vue` already emits for the horizontal megamenu.
That component escapes the derivation check only because its folder has no conventionally-named
root `.vue`, and its own name stutters the category — which
[`imports.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/imports.md) forbids ("the category lives in the folder, never in
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

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`, `disabled`
- `data-state` values: `open` | `closed` — on `Sub`, `SubTrigger` and `SubContent`. A `Group` has none: it never closes.
- `data-kind` values: `inline` | `drill` — on `SubTrigger` and `SubContent`. On a trigger they sit on its root, which is always the row **box** holding its label control and its arrow.
- `data-selected` mirrors the `selected` prop on `Menu.Item`
- `data-disabled` mirrors the `disabled` prop on `Menu.Item` and `SubTrigger` (on the row box and on its label alike, so a test can read it from either)
- `data-level` on `SubContent` — nesting depth, drives the indent step
- `data-motion` values: `push` | `pop` | `none` — on a drill level, so the direction of the slide is a Tailwind `data-[motion=…]` variant instead of a `:class` ternary (see Motion)
- `data-level` on `SubContent` also drives the indent step at each depth
- `data-node-id` on a `Sub` rendered from `groups` — carries the `MenuNode.id` so `update:path` reports real node ids rather than generated ones
- Empty: `groups` is `[]` and the `default` slot is empty → the root renders nothing; the empty
  message belongs to the host shell, not the menu.

## Accessibility

- Visible focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]` — `ring-offset-1` per the interactive-states standard ([`component-states.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/component-states.md)), with the offset colour handed down by the host (`Sidebar` sets `--menu-ring-offset` to its own surface, mirroring the existing `--menu-item-ring-offset` pattern).
- Keyboard map: `Tab` / `Shift+Tab` move between rows; `Enter`/`Space` activates a row, toggles an inline `Sub`, or pushes a drill level; `ArrowRight` expands a collapsed inline `Sub` or pushes a drill level; `ArrowLeft` collapses an expanded inline `Sub`, or pops one drill level when the current level is not the root; `Escape` pops one drill level.
- ARIA:
  - The root renders a plain container with `role="navigation"` and `aria-label` from `ariaLabel`. It does **not** render `<nav>`: the menu is injected into a host that may already be a `<nav>` landmark (`Sidebar` is), and nesting landmarks duplicates them in the landmark list. When the host provides the landmark, the consumer suppresses the role by passing `role="presentation"` — and **the name goes with the role**: the root renders no `aria-label` under `role="presentation"` / `"none"`, because ARIA prohibits naming a presentational element and the a11y tree drops the name anyway. The consumer therefore suppresses the landmark with one attribute rather than remembering to unset `ariaLabel` as well.
  - `Group` is a `<section>` named by its title through `aria-labelledby` (id from `useId()`), or by `aria-label` when there is no visible title. It exposes **no** `aria-expanded` and contains no control — the title is text.
  - An inline `SubTrigger` puts `aria-expanded` + `aria-controls` on **whichever control expands the children** — its arrow when an `href` makes the label a link, the label itself otherwise — and never on both. When the label owns them the arrow is `aria-hidden` + `tabindex="-1"`: a redundant pointer target, not a second announced control. An announced arrow is named `Expand <label>` / `Collapse <label>`, so the state is given twice over: by the name it moves to and by `aria-expanded`.
  - A drill `SubTrigger` carries **no** `aria-expanded` on any control — it replaces the view rather than expanding one. An announced drill arrow is named `Open <label> menu`. On push, focus moves to the level's `Back` button and the pushed `<ul>` takes `aria-label` from the trigger's label; on pop, focus returns to whichever control pushed it. A level that is not current carries **both `aria-hidden` and `inert`** while it is still mounted for the slide, so it leaves the accessibility tree and the tab order together (the pattern Kumo's `SlidingViews` uses).
  - `Back` is a `<button>` whose **visible text** names its destination (`Back to Settings`, or a bare `Back` when that destination is the unnamed root) and is therefore also its accessible name — it renders no `aria-label`, so the two cannot disagree (2.5.3 Label in Name).
  - A selected `Menu.Item` rendered as an anchor carries `aria-current="page"`; a disabled row carries `aria-disabled` and is removed from the tab order.
  - The connector rail and every chevron are `aria-hidden="true"` — decorative, and the indentation already conveys the hierarchy.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state. The rail (`var(--border-default)`, ≈1.5:1) is exempt: it is decorative and carries no information the indentation does not, so 1.4.11 does not apply.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target — **justified deviation from ≥40×40 px.** Rows are 32 px tall, matching the Figma frame's `h-button-md` and the density a product navigation needs. Every target is full-row width (≥252 px), so all clear WCAG 2.5.8's 24×24 minimum. The Figma frame's 16×16 group toggle would have failed that minimum; it is moot here, because a group title is not a control at all.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: directional item icons mirror (`directionalIconClass`); the sub-trigger chevron and the `MenuBack` chevron mirror (`rtl:-scale-x-100`).
- Keyboard: `ArrowRight` opens a submenu and `ArrowLeft` closes it (and goes back from a drilled-in panel), swapped under `dir="rtl"` (`logicalArrowKey`).
- Motion: drill-in panels and pop-out submenus slide toward the end (`rtl:` variants flip every `translate-x`).
- User data: none.

## Examples

### Default

```vue
<script setup>
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <MenuRoot aria-label="Console navigation">
      <MenuGroup label="User agents">
        <MenuItem
          label="End User"
          icon="pi pi-user"
          href="/end-user"
          selected
        />
        <MenuItem
          label="Web Browser"
          icon="ai ai-domains"
          href="/web-browser"
        />
        <MenuItem
          label="Device Groups"
          icon="pi pi-mobile"
          href="/device-groups"
        />
      </MenuGroup>
      <MenuGroup label="Azion platform">
        <MenuItem
          label="Applications"
          icon="pi pi-th-large"
          href="/applications"
        />
        <MenuItem
          label="Edge Firewall"
          icon="pi pi-shield"
          href="/edge-firewall"
          tag-value="Beta"
        />
        <MenuItem
          label="Real-Time Metrics"
          icon="pi pi-chart-bar"
          href="/metrics"
        />
      </MenuGroup>
    </MenuRoot>
  </div>
</template>
```

### Types

```vue
<script setup>
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-md)">
    <div class="w-[264px] overflow-hidden">
      <MenuRoot aria-label="Expands in place">
        <MenuGroup label="Expands in place">
          <MenuSub default-open>
            <MenuSubTrigger
              label="Getting started"
              kind="inline"
            />
            <MenuSubContent>
              <MenuItem
                label="Installation"
                icon=""
                href="/docs/install"
              />
              <MenuItem
                label="Quick start"
                icon=""
                href="/docs/quick-start"
              />
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>
      </MenuRoot>
    </div>
    <div class="w-[264px] overflow-hidden">
      <MenuRoot aria-label="Replaces the menu">
        <MenuBack />
        <MenuGroup label="Replaces the menu">
          <MenuSub>
            <MenuSubTrigger
              label="Settings"
              kind="drill"
              icon="pi pi-cog"
            />
            <MenuSubContent>
              <MenuItem
                label="General"
                icon=""
                href="/settings/general"
              />
              <MenuItem
                label="Members"
                icon=""
                href="/settings/members"
              />
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>
      </MenuRoot>
    </div>
  </div>
</template>
```

### Condensed

```vue
<script setup>
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <MenuRoot aria-label="Docs">
      <MenuGroup label="Docs">
        <MenuSub default-open>
          <MenuSubTrigger
            label="Build"
            kind="inline"
          />
          <MenuSubContent>
            <MenuItem
              label="Overview"
              icon=""
              href="/build"
            />
            <MenuSub default-open>
              <MenuSubTrigger
                label="Edge Application"
                kind="inline"
              />
              <MenuSubContent>
                <MenuItem
                  label="Rules Engine"
                  icon=""
                  href="/build/rules-engine"
                />
                <MenuItem
                  label="Cache Settings"
                  icon=""
                  href="/build/cache-settings"
                />
              </MenuSubContent>
            </MenuSub>
            <MenuSub>
              <MenuSubTrigger
                label="Edge Functions"
                kind="inline"
              />
              <MenuSubContent>
                <MenuItem
                  label="Runtime APIs"
                  icon=""
                  href="/build/runtime-apis"
                />
              </MenuSubContent>
            </MenuSub>
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </MenuRoot>
  </div>
</template>
```
