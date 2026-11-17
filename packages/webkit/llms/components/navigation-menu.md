# Navigation Menu

> The top bar of a site: a row of links and triggers whose items open large panels of grouped links (product and solution menus). The items share one hover-intent timing, one keyboard model and one animated popup that resizes and slides between panels, inside a `navigation` landmark.

- Import: `import NavigationMenuRoot from '@aziontech/webkit/navigation-menu-root'`
- Compound import (dot notation, not tree-shakeable): `import NavigationMenu from '@aziontech/webkit/navigation-menu'`
- Category: navigation · Surface: app · Structure: composition
- API as JSON: [navigation-menu.json](navigation-menu.json)

## When to use

- Use NavigationMenu only to build a marketing top bar with hover panels; the site already gets one from SiteHeaderSection, and app navigation uses SidebarMenu.
- A horizontal top bar whose items open large panels of grouped links (product and solution mega-menus).
- A mix of panel triggers and plain links in one bar that shares hover-intent timing, keyboard navigation and a single animated popup.
- Panel entries need a title plus a muted description line, a leading icon, or a featured "see all" link.

## Do

- Give every panel item a stable `value` on `NavigationMenu.Item`; `v-model` and `default-value` refer to it, and an omitted value is auto-generated and cannot be controlled.
- A top-level item with no panel is a `NavigationMenu.Trigger` with an `href`; inside panels use `NavigationMenu.Item` with `layout="entry"`, an `href`, an optional `description` and `close-on-click`.
- Render one `NavigationMenu.Viewport` per root, after the list (the shadcn shape). It holds the whole overlay: it teleports, positions the popup on the active trigger, sizes it and hosts every panel. Each `Content` is moved into it, so a menu without a `Viewport` renders no panel.
- The `Viewport` teleports to `container` when set and to `body` otherwise, passing the selector through so the server renders the same tree the client hydrates.
- Pin a wide panel to the page column with the viewport's `collision-padding`, not with override classes on the popup.
- Set `aria-label` on the root (default `'Main'`) when the page has more than one navigation landmark.
- Test ids: root fallback `navigation-menu` (its own name); every part uses its own name (`navigation-menu-list`, `navigation-menu-item`, `navigation-menu-trigger` with its chevron `navigation-menu__icon`, `navigation-menu-content`, `navigation-menu-viewport` and the viewport's inner `__portal`, `__positioner`, `__popup`, `__arrow`, `__backdrop`), and a consumer `data-testid` wins on every part; one set on the `Viewport` lands on its popup.
- Attributes on the root (`id`, `aria-labelledby`, `data-*`, listeners) land on the `nav` landmark.
- The compound has the shadcn parts only: `List`, `Item`, `Trigger`, `Content`, `Link`, `Viewport`. 6.0 folded the Base UI overlay chain (`Portal`, `Positioner`, `Popup`, `Arrow`, `Backdrop`) into `Viewport` props, and the `Icon` part into the trigger, which renders its own chevron.
- `NavigationMenu.Trigger` always renders a `button` (or an anchor with `href`); 6.0 removed its `native-button` prop.

## Don’t

- It is the persistent vertical navigation of an app → use `sidebar` with `sidebar-menu`.
- It is a list of actions or options opened from a button → use `dropdown-menu`.
- It shows where the current page sits in a hierarchy → use `breadcrumb`.
- It is the marketing site's whole navigation bar → use `site-header-section`, which already composes this menu.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-header-section](site-header-section.md) — the marketing navigation band built on `app-header`, `brand` and `navigation-menu`.
- [app-header](app-header.md) — the bar layout this menu usually sits in.
- [dropdown-menu](dropdown-menu.md) — a single-trigger option menu, not a site-wide navigation bar.
- [sidebar-menu](sidebar-menu.md) — vertical, hierarchical navigation rows for a sidebar.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultValue` | `NavigationMenuValue` | `null` | false | Uncontrolled initial open item value. |
| `delay` | `number` | `50` | false | Hover-open delay in milliseconds. |
| `closeDelay` | `number` | `300` | false | Hover-close delay in milliseconds. |
| `orientation` | `NavigationMenuOrientation` | `'horizontal'` | false | Menu orientation. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the root navigation landmark. Empty uses the locale catalog (`Main`). |
| `modelValue` | `NavigationMenuValue \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `open-transition-end` | `open: boolean` | Fires when the popup finishes its open or close transition. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/webkit/navigation-menu-list`
- `@aziontech/webkit/navigation-menu-item`
- `@aziontech/webkit/navigation-menu-trigger`
- `@aziontech/webkit/navigation-menu-content`
- `@aziontech/webkit/navigation-menu-link`
- `@aziontech/webkit/navigation-menu-viewport`

## Sub-components

Every part is attached to the compound (`NavigationMenu.List`, …) and importable on its own as `@aziontech/webkit/navigation-menu-<part>`; `@aziontech/webkit/navigation-menu-root` is the root file (`navigation-menu.vue`) alone.

- `navigation-menu-list.vue` — Public sub-component `navigation-menu-list`; `show-highlight` (default `true`) shows the sliding highlight on the root horizontal list.
- `navigation-menu-item.vue` — Public sub-component `navigation-menu-item`.
- `navigation-menu-trigger.vue` — Public sub-component `navigation-menu-trigger`. A panel trigger (no `href`) renders a trailing `az az-chevron-down` in an `aria-hidden` span (`__icon`) whose `data-state="open|closed"` follows its panel and turns 180° when open; a link trigger (`href`) has no chevron.
- `navigation-menu-content.vue` — Public sub-component `navigation-menu-content`.
- `navigation-menu-link.vue` — Public sub-component `navigation-menu-link`, reached as `NavigationMenu.Link`: a top-level link of the bar (`href`, `active`, `close-on-click`) that renders the same anchor as a trigger with an `href`. Attributes it does not declare still flow to the trigger it renders, so a `NavigationMenu.Link` written as a panel trigger keeps working.
- `navigation-menu-viewport.vue` — Public sub-component `navigation-menu-viewport`, the one overlay that hosts every panel. It teleports (`container`, default `body`; `keep-mounted`, default `true`), places the popup on the active trigger and renders the popup surface with the shared panel frame. Props: `side?: NavigationMenuSide` (`top | bottom | start | end`, logical: `start`/`end` follow the reading direction; default `'bottom'`), `align?: NavigationMenuAlign` (`start | center | end`, default `'center'`; on `top`/`bottom`, `start`/`end` follow the reading direction too), `sideOffset?: number` (default `8`), `alignOffset?: number` (default `0`), `arrowPadding?: number` (default `8`), `collisionPadding?: NavigationMenuCollisionPadding` (default `8`), `sticky?: boolean` (default `false`), `trackAnchor?: boolean` (default `true`, keeps the popup on the active trigger), `kind?: NavigationMenuPopoverVariant` (`default | contrast`, default `'default'`, the popup surface), `arrow?: boolean` (default `false`, an arrow pointing at the trigger), `backdrop?: boolean` (default `false`, a dimmed layer behind the popup; a click on it closes the menu), `container?: object | string` (default `undefined`), `keepMounted?: boolean` (default `true`). Attributes it does not declare land on the popup.
- `parts/` — private, not exported: `navigation-menu-portal.vue`, `navigation-menu-positioner.vue`, `navigation-menu-popover.vue`, `navigation-menu-arrow.vue`, `navigation-menu-backdrop.vue` and `navigation-menu-viewport-frame.vue`, the pieces the `Viewport` composes.

## v-model

| Model     | Type                               | Default     | Emits               | Notes                                                                                                                                                                                                                                       |
| --------- | ---------------------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `NavigationMenuValue \| undefined` | `undefined` | `update:modelValue` | Open item via `defineModel`; `null` closes every panel. While unbound (`undefined`) the menu is uncontrolled and starts at `defaultValue`. The event carries a second argument, `eventDetails: unknown`, describing what caused the change. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` — on the root, the list, each trigger chevron, the content, the popup and the backdrop (no `data-open` / `data-closed`)
- `data-side` on the viewport's positioner and arrow: `top` | `bottom` | `start` | `end`, the side after flipping
- `data-align` on the viewport's positioner and arrow: `start` | `center` | `end`

## Accessibility

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
- Placement: the shared `usePlacement` engine resolves `side` and `align` against the direction, so under `rtl` `side="start"` opens on the right and `align="start"` lines the popup up with the trigger's right edge; `alignOffset` moves away from the aligned edge in both directions.
- User data: none.
- Teleported content: the `NavigationMenu.Viewport` portal binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
</script>

<template>
  <div class="min-h-screen bg-(--bg-canvas) text-(--text-default)">
    <header class="border-b border-solid border-(--border-default)">
      <div
        class="mx-auto flex w-full max-w-(--container-xl) flex-wrap items-center gap-(--spacing-6) px-(--spacing-6) py-(--spacing-4)"
      >
        <NavigationMenu
          :delay="50"
          :close-delay="300"
          orientation="horizontal"
          aria-label="Azion"
        >
          <NavigationMenu.List>
            <NavigationMenu.Item value="solucoes">
              <NavigationMenu.Trigger> Soluções </NavigationMenu.Trigger>
              <NavigationMenu.Content class="w-full">
                <div class="grid grid-cols-2 gap-(--spacing-6) p-(--spacing-2)">
                  <NavigationMenu.List label="Por Caso de Uso">
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/desenvolvimento-de-aplicacoes/"
                      description="Acelere o desenvolvimento de aplicações"
                      close-on-click
                    >
                      Desenvolvimento de Aplicações
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/performance-e-confiabilidade/"
                      description="Otimize performance e entrega de conteúdo"
                      close-on-click
                    >
                      Performance e Confiabilidade
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/"
                      featured
                      close-on-click
                    >
                      Ver todas as soluções
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="produtos">
              <NavigationMenu.Trigger> Produtos </NavigationMenu.Trigger>
              <NavigationMenu.Content class="w-full">
                <div class="grid grid-cols-2 gap-(--spacing-6) p-(--spacing-2)">
                  <NavigationMenu.List label="Construir">
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/produtos/functions/"
                      description="Implemente funções serverless"
                      close-on-click
                    >
                      <template #icon>
                        <i class="az az-functions" />
                      </template>
                      Functions
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/produtos/cache/"
                      description="Acelere a entrega de conteúdo"
                      close-on-click
                    >
                      <template #icon>
                        <i class="az az-tiered-cache" />
                      </template>
                      Cache
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger href="https://www.azion.com/pt-br/precos/">
                Preços
              </NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <div class="ms-auto flex items-center gap-(--spacing-2)">
            <NavigationMenu.Trigger href="https://www.azion.com/pt-br/contato-vendas/">
              Contato
            </NavigationMenu.Trigger>
          </div>

          <NavigationMenu.Viewport
            side="bottom"
            align="start"
            :side-offset="12"
            arrow
          />
        </NavigationMenu>
      </div>
    </header>

    <div
      class="mx-auto flex max-w-2xl flex-col items-center px-(--spacing-6) py-(--spacing-24) text-center"
    >
      <h1 class="text-heading-lg text-(--text-default)">Navigation menu demo</h1>
      <p class="mt-(--spacing-6) text-body-sm text-(--text-muted)">
        Hover top-level items to open panels. Keyboard: arrows, Enter, Escape.
      </p>
      <div class="mt-(--spacing-10) flex flex-wrap justify-center gap-(--spacing-3)">
        <Button label="Primary action" />
        <Button
          label="Secondary"
          variant="secondary"
        />
      </div>
    </div>
  </div>
</template>
```
