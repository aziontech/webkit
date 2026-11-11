# Navigation Menu

> Helps users move between views or sections. Lives at `packages/webkit/src/components/navigation/navigation-menu/`.

- Import: `import NavigationMenu from '@aziontech/webkit/navigation-menu'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [navigation-menu.json](https://github.com/aziontech/webkit/blob/main/.specs/navigation-menu.json)

## When to use

- A horizontal top bar whose items open large panels of grouped links (product and solution mega-menus).
- A mix of panel triggers and plain links in one bar that shares hover-intent timing, keyboard navigation and a single animated popup.
- Panel entries need a title plus a muted description line, a leading icon, or a featured "see all" link.

## Do

- Give every panel item a stable `value` on `NavigationMenu.Item`; `v-model` and `default-value` refer to it, and an omitted value is auto-generated and cannot be controlled.
- A top-level item with no panel is a `NavigationMenu.Trigger` with an `href`; inside panels use `NavigationMenu.Item` with `layout="entry"`, an `href`, an optional `description` and `close-on-click`.
- Render the popup chain exactly once per root: `Portal` → `Positioner` → `Popup` → `Viewport`. Each `Content` is moved into the shared `Viewport`, so a missing chain renders no panel.
- Portal` teleports to `container` when set and to `body` otherwise, passing the selector through so the server renders the same chain the client hydrates.
- Pin a wide panel to the page column with the positioner's `collision-padding`, not with override classes on the popup.
- Set `aria-label` on the root (default `'Main'`) when the page has more than one navigation landmark.

## Don’t

- It is the persistent vertical navigation of an app → use `sidebar` with `menu`.
- It is a list of actions or options opened from a button → use `dropdown`.
- It shows where the current page sits in a hierarchy → use `breadcrumb`.
- It is the marketing site's whole navigation bar → use `site-nav`, which already composes this menu.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-nav](site-nav.md) — the marketing navigation band built on `global-header`, `brand` and `navigation-menu`.
- [global-header](global-header.md) — the bar layout this menu usually sits in.
- dropdown` — a single-trigger option menu, not a site-wide navigation bar.
- [menu](menu.md) — vertical, hierarchical navigation rows for a sidebar.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultValue` | `NavigationMenuValue` | `null` | false | Uncontrolled initial open item value. |
| `delay` | `number` | `50` | false | Hover-open delay in milliseconds. |
| `closeDelay` | `number` | `300` | false | Hover-close delay in milliseconds. |
| `orientation` | `NavigationMenuOrientation` | `'horizontal'` | false | Menu orientation. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the root navigation landmark. Empty uses the locale catalog (`Main`). |
| `as` | `string \| object` | `'nav'` | false | Polymorphic root element. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `open-change-complete` | `open: boolean` | — |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-components

- `navigation-menu-arrow.vue` — Public sub-component `navigation-menu-arrow`.
- `navigation-menu-backdrop.vue` — Public sub-component `navigation-menu-backdrop`.
- `navigation-menu-content.vue` — Public sub-component `navigation-menu-content`.
- `navigation-menu-icon.vue` — Public sub-component `navigation-menu-icon`.
- `navigation-menu-item.vue` — Public sub-component `navigation-menu-item`.
- `navigation-menu-link.vue` — internal; not reachable through the compound, where `NavigationMenu.Link` is an alias of `NavigationMenuTrigger`.
- `navigation-menu-list.vue` — Public sub-component `navigation-menu-list`.
- `navigation-menu-popup.vue` — Public sub-component `navigation-menu-popup`.
- `navigation-menu-portal.vue` — Public sub-component `navigation-menu-portal`.
- `navigation-menu-positioner.vue` — Public sub-component `navigation-menu-positioner`.
- `navigation-menu-trigger.vue` — Public sub-component `navigation-menu-trigger`.
- `navigation-menu-viewport.vue` — Public sub-component `navigation-menu-viewport`.

## v-model

| Model     | Type                               | Default     | Emits               | Notes                                                                                                                                                                                                                                       |
| --------- | ---------------------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `NavigationMenuValue \| undefined` | `undefined` | `update:modelValue` | Open item via `defineModel`; `null` closes every panel. While unbound (`undefined`) the menu is uncontrolled and starts at `defaultValue`. The event carries a second argument, `eventDetails: unknown`, describing what caused the change. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves between triggers and links of the bar. On a trigger, `Enter`/`Space` toggle its panel; `ArrowRight`/`ArrowLeft` move to the next/previous trigger and wrap (swapped under RTL); `ArrowDown` opens the panel and focuses its first entry; `Escape` closes an open panel. Inside a panel, `ArrowDown`/`ArrowUp` move between entries and wrap, `Tab` on the trigger of an open panel moves into it, `Shift+Tab` on the first entry returns to the trigger, `Tab` on the last entry closes the panel and moves on to the next trigger, and `Escape` closes the panel and returns focus to its trigger. Tests: `navigation-menu.test.ts` › keyboard map (spec).
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
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

### Default

```vue
<script setup>
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="min-h-screen bg-(--bg-canvas) text-(--text-default)">
    <header class="border-b border-solid border-(--border-default)">
      <NavigationMenu
        :delay="50"
        :close-delay="300"
        orientation="horizontal"
        aria-label="Azion"
        class="mx-auto flex w-full max-w-(--container-xl) flex-wrap items-center gap-(--spacing-6) px-(--spacing-6) py-(--spacing-4)"
      >
        <NavigationMenu.List>
          <NavigationMenu.Item value="solucoes">
            <NavigationMenu.Trigger>
              Soluções
              <NavigationMenu.Icon>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content class="w-full p-0">
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
            <NavigationMenu.Trigger>
              Produtos
              <NavigationMenu.Icon>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content class="w-full p-0">
              <div class="grid grid-cols-2 gap-(--spacing-6) p-(--spacing-2)">
                <NavigationMenu.List label="Construir">
                  <NavigationMenu.Item
                    layout="entry"
                    href="https://www.azion.com/pt-br/produtos/functions/"
                    description="Implemente funções serverless"
                    close-on-click
                  >
                    <template #icon>
                      <i class="ai ai-edge-functions" />
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
                      <i class="ai ai-tiered-cache" />
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

        <NavigationMenu.Portal>
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
          kind="secondary"
        />
      </div>
    </div>
  </div>
</template>
```
