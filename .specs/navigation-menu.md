---
name: navigation-menu
category: navigation
structure: composition
status: implemented
spec_version: 10
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191
  node_id: 3374:6191
checksum: 83339457a0d5d9fa376067f4b564fbe015578eb3a575d999269e545707437917
created: 2026-05-22
last_updated: 2026-11-15
---

# Navigation Menu — Component Spec

## Purpose

The top bar of a site: a row of links and triggers whose items open large panels of grouped links (product and solution menus). The items share one hover-intent timing, one keyboard model and one animated popup that resizes and slides between panels, inside a `navigation` landmark.

## When to use

- Use NavigationMenu only to build a marketing top bar with hover panels; the site already gets one from SiteNav, and app navigation uses SidebarMenu.
- A horizontal top bar whose items open large panels of grouped links (product and solution mega-menus).
- A mix of panel triggers and plain links in one bar that shares hover-intent timing, keyboard navigation and a single animated popup.
- Panel entries need a title plus a muted description line, a leading icon, or a featured "see all" link.

## When NOT to use

- It is the persistent vertical navigation of an app → use `sidebar` with `sidebar-menu`.
- It is a list of actions or options opened from a button → use `dropdown-menu`.
- It shows where the current page sits in a hierarchy → use `breadcrumb`.
- It is the marketing site's whole navigation bar → use `site-nav`, which already composes this menu.

## Related

- `site-nav` — the marketing navigation band built on `global-header`, `brand` and `navigation-menu`.
- `global-header` — the bar layout this menu usually sits in.
- `dropdown-menu` — a single-trigger option menu, not a site-wide navigation bar.
- `sidebar-menu` — vertical, hierarchical navigation rows for a sidebar.

## Best practices

- Give every panel item a stable `value` on `NavigationMenu.Item`; `v-model` and `default-value` refer to it, and an omitted value is auto-generated and cannot be controlled.
- A top-level item with no panel is a `NavigationMenu.Trigger` with an `href`; inside panels use `NavigationMenu.Item` with `layout="entry"`, an `href`, an optional `description` and `close-on-click`.
- Render the popup chain exactly once per root: `Portal` → `Positioner` → `Popup` → `Viewport`. Each `Content` is moved into the shared `Viewport`, so a missing chain renders no panel.
- `Portal` teleports to `container` when set and to `body` otherwise, passing the selector through so the server renders the same chain the client hydrates.
- Pin a wide panel to the page column with the positioner's `collision-padding`, not with override classes on the popup.
- Set `aria-label` on the root (default `'Main'`) when the page has more than one navigation landmark.
- Test ids: root fallback `navigation-navigation-menu` (`<category>-<name>`); every part derives from it (`navigation-navigation-menu__list`, `__item`, `__trigger`, `__content`, `__portal`, `__positioner`, `__popup`, `__viewport`, `__arrow`, `__backdrop`, `__icon`), and a consumer `data-testid` wins on every part.
- Attributes on the root (`id`, `aria-labelledby`, `data-*`, listeners) land on the `nav` landmark.
- `Portal`, `Backdrop`, `Positioner`, `Popup`, `Viewport` and `Arrow` are the overlay chain that hosts every panel. They stay public so a page can place, pad and decorate the one shared popup; most pages copy the chain from the Usage block unchanged.
- `NavigationMenu.Trigger` always renders a `button` (or an anchor with `href`); 6.0 removed its `native-button` prop.

## Usage

```vue
<script setup>
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
</script>

<template>
  <NavigationMenu
    aria-label="Primary"
    :delay="50"
    :close-delay="300"
  >
    <NavigationMenu.List>
      <NavigationMenu.Item value="products">
        <NavigationMenu.Trigger>
          Products
          <NavigationMenu.Icon>
            <i
              class="ai ai-chevron-down"
              aria-hidden="true"
            />
          </NavigationMenu.Icon>
        </NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.List label="Build">
            <NavigationMenu.Item
              layout="entry"
              href="/products/functions"
              description="Run serverless functions"
              close-on-click
            >
              <template #icon>
                <i class="ai ai-edge-functions" />
              </template>
              Functions
            </NavigationMenu.Item>
            <NavigationMenu.Item
              layout="entry"
              href="/products"
              featured
              close-on-click
            >
              See all products
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Backdrop />
      <NavigationMenu.Positioner
        side="bottom"
        align="start"
        :side-offset="12"
      >
        <NavigationMenu.Popup>
          <NavigationMenu.Arrow />
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu>
</template>
```

## Sub-components

- `navigation-menu-arrow.vue` — Public sub-component `navigation-menu-arrow`.
- `navigation-menu-backdrop.vue` — Public sub-component `navigation-menu-backdrop`.
- `navigation-menu-content.vue` — Public sub-component `navigation-menu-content`.
- `navigation-menu-icon.vue` — Public sub-component `navigation-menu-icon`.
- `navigation-menu-item.vue` — Public sub-component `navigation-menu-item`.
- `navigation-menu-link.vue` — Public sub-component `navigation-menu-link`, reached as `NavigationMenu.Link`: a top-level link of the bar (`href`, `active`, `close-on-click`) that renders the same anchor as a trigger with an `href`. Attributes it does not declare still flow to the trigger it renders, so a `NavigationMenu.Link` written as a panel trigger keeps working.
- `navigation-menu-list.vue` — Public sub-component `navigation-menu-list`; `show-highlight` (default `true`) shows the sliding highlight on the root horizontal list.
- `navigation-menu-popup.vue` — Public sub-component `navigation-menu-popup`.
- `navigation-menu-portal.vue` — Public sub-component `navigation-menu-portal`.
- `navigation-menu-positioner.vue` — Public sub-component `navigation-menu-positioner`; `side` is `top | end | bottom | start` (logical: `start`/`end` follow the reading direction) and `track-anchor` (default `true`) keeps the popup on the active trigger.
- `navigation-menu-trigger.vue` — Public sub-component `navigation-menu-trigger`.
- `navigation-menu-viewport.vue` — Public sub-component `navigation-menu-viewport`.

## Props

| Prop           | Type                        | Default        | Required | JSDoc                                                                                     |
| -------------- | --------------------------- | -------------- | -------- | ----------------------------------------------------------------------------------------- |
| `defaultValue` | `NavigationMenuValue`       | `null`         | false    | Uncontrolled initial open item value.                                                     |
| `delay`        | `number`                    | `50`           | false    | Hover-open delay in milliseconds.                                                         |
| `closeDelay`   | `number`                    | `300`          | false    | Hover-close delay in milliseconds.                                                        |
| `orientation`  | `NavigationMenuOrientation` | `'horizontal'` | false    | Menu orientation.                                                                         |
| `ariaLabel`    | `string`                    | `''`           | false    | Accessible name for the root navigation landmark. Empty uses the locale catalog (`Main`). |

## v-model

| Model     | Type                               | Default     | Emits               | Notes                                                                                                                                                                                                                                       |
| --------- | ---------------------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `NavigationMenuValue \| undefined` | `undefined` | `update:modelValue` | Open item via `defineModel`; `null` closes every panel. While unbound (`undefined`) the menu is uncontrolled and starts at `defaultValue`. The event carries a second argument, `eventDetails: unknown`, describing what caused the change. |

## Events

| Event                 | Payload         | Notes                                                       |
| --------------------- | --------------- | ----------------------------------------------------------- |
| `open-transition-end` | `open: boolean` | Fires when the popup finishes its open or close transition. |

## Slots

| Slot      | Scope | Notes |
| --------- | ----- | ----- |
| `default` | —     | —     |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` — on the root, the list, each trigger icon, the content, the popup and the backdrop (no `data-open` / `data-closed`)
- `data-side` on the positioner and the arrow: `top` | `end` | `bottom` | `start`

## Motion & Animations

The menu **opens out of its trigger**: the popup is placed at the trigger before
its first paint and scales up from `--popup-origin`, the trigger's centre. It
never animates into place from elsewhere.

Switching panels is a **morph**, not a re-open: the popup keeps an explicit pixel
size for its whole open lifetime, so a switch writes one new size and the browser
interpolates from the current one. Box size and placement share a duration and
curve so they read as a single object moving and reshaping. Each panel is pinned
to its own width (`--viewport-width`) so it never re-wraps mid-morph — the box
reveals and crops a panel that is already laid out — while the two panels
cross-fade over a shorter duration, sliding in from the side the new item sits on.

**`scale` and `translate` are separate CSS properties from `transform`.** The
`scale-*` / `translate-*` utilities write `scale:` / `translate:`, so a transition
list must name those properties; naming `transform` does not cover them and the
animation silently snaps. Only the positioner, whose placement is an inline
`transform: translate3d(...)`, transitions `transform`.

| Trigger                             | Animation / Transition                                                                         | Token                                               | Reduced-motion fallback         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| trigger / entry hover, focus, press | `transition-colors`                                                                            | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| popup open / close                  | `transition-[opacity,scale]` — fade + `scale-95`, origin `--popup-origin` (the active trigger) | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| popup box morph between panels      | `transition-[width,height]` driven by `--popup-width` / `--popup-height`                       | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| positioner move between triggers    | `transition-[transform]` (placement is a `translate3d`); suppressed on the first placement     | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| panel content swap                  | `transition-[opacity,translate]`, directional 24px slide keyed on `data-activation-direction`  | `duration-moderate-01` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| chevron icon                        | `transition-transform` (180° on open)                                                          | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| list sliding highlight              | `transition-[left,top,width,height,opacity]`                                                   | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region     | Token (DESIGN.md)      |
| ---------- | ---------------------- |
| typography | .text-body-sm          |
| surface    | `var(--bg-surface)`    |
| text       | `var(--text-default)`  |
| spacing    | `var(--spacing-3)`     |
| shape      | `var(--shape-control)` |
| ring       | `var(--ring-color)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves between triggers and links of the bar. On a trigger, `Enter`/`Space` toggle its panel; `ArrowRight`/`ArrowLeft` move to the next/previous trigger and wrap (swapped under RTL); `ArrowDown` opens the panel and focuses its first entry; `Escape` closes an open panel. Inside a panel, `ArrowDown`/`ArrowUp` move between entries and wrap, `Tab` on the trigger of an open panel moves into it, `Shift+Tab` on the first entry returns to the trigger, `Tab` on the last entry closes the panel and moves on to the next trigger, and `Escape` closes the panel and returns focus to its trigger. Tests: `navigation-menu.test.ts` › keyboard map (spec).
- ARIA: the root is a `nav` landmark. A panel trigger is a disclosure button: `aria-expanded` reflects its panel and, while open, `aria-controls` names the panel (`role="region"`); it carries no `aria-haspopup`, since the panel is navigation, not a menu. A link trigger carries `aria-current="page"` when `active`. Tests: `navigation-menu.test.ts` › axe on the closed bar, the open panel and the vertical menu.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the trigger caret points down and does not mirror.
- Arrow: the popup arrow is a rotated square that hides two of its borders through logical utilities (`border-e-0`, `border-s-0`); under `rtl` it also flips on its inline axis (`rtl:-scale-x-100`), so the visible corner still points at the trigger.
- Keyboard: on a horizontal menu `ArrowRight`/`ArrowLeft` move to the next/previous trigger, swapped under `dir="rtl"` (`useDirection` passed to the root composable); vertical menus keep `ArrowDown`/`ArrowUp`.
- Motion: the content slides in from the side the pointer came from; the forward/back direction is computed in reading order, so under `rtl` moving to a later trigger slides from the start edge.
- User data: none.
- Teleported content: the `NavigationMenu.Portal` wrapper binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

- Default

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
