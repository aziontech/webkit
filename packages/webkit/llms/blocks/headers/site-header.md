# SiteHeader (`headers/site-header`)

> The marketing bar: a sticky `GlobalHeader` in its `site` placement. The surface runs to the window edges while the regions are capped at the bar’s own measure and centred, so the bar answers to the framed page under it. Start: the navigation trigger below `xl` and the brand. Middle: the navigation, from `xl`. End: Contact from `xl`, then Login and Start for free, with search last. The mega-menus and the navigation sheet are documented on Templates › Marketing › Shell › SiteNav. Built from `GlobalHeader`, `NavigationMenu`, `IconButton`, `Button` and `Brand`.

- Surface: marketing
- Source: `blocks/headers/site-header/site-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/site-header")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [Command](../../components/command.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [NavigationMenu](../../components/navigation-menu.md), [SearchTrigger](../../components/search-trigger.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

site header; marketing header; website header; landing page header; marketing navbar; site navigation bar; mega menu header; cabeçalho do site; menu do site; cabeçalho de marketing

The sticky top bar of the marketing site. A visitor is deciding whether to try Azion, so the bar keeps the decision one click away (Start for free, Login) while letting them explore (the product navigation and its mega-menus, Contact, search). Its surface runs to the window edges while its regions are capped at the site measure, so it lines up with the framed page under it.

## When to use

- On every marketing page, inside `shells/website`.

## When not to use

- Documentation: use `headers/docs-header`. Console: use `headers/resource-header`. Signed-out console screens: use `headers/auth-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

`kind="site"`, `aria-label="Azion"`, in a `sticky top-0` wrapper. Start in `GlobalHeader.Left`, navigation in `GlobalHeader.Middle`, actions in `GlobalHeader.Right`.

### B. Navigation trigger — `IconButton` (required)

Below `xl`, an outlined `pi-bars` icon button opens the navigation sheet.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked home with `aria-label="Azion home"`.

### D. Primary navigation — `NavigationMenu` (required from xl)

Five top-level links (`Solutions`, `Products`, `Developer`, `Resources`, `Pricing`) with a `contrast` popup for the mega-menus. Hidden below `xl`. The menus and the sheet are specified on the SiteNav story.

### E. Actions — `Button` (required)

Contact (`transparent`, from `xl` only), Login (`secondary`) and Start for free (`primary`). One primary in the bar.

### F. Search — `SearchTrigger` (required)

The header search, last in the end cluster as on azion.com: `collapsible` with no `@container` around the bar, so it stays the magnifier at every width. It still announces and binds ⌘K / Ctrl K and emits `open`, which opens the `Command` palette. Never a bare magnifier `IconButton` (rule `webkit-header-search`).

### G. Search palette — `Command` (required)

The ⌘K palette the header search opens: `Command.Input`, one group of pages, and `Command.Empty` for no match. It owns the ⌘K / Ctrl K shortcut while mounted.

## Do

- Keep Start for free as the only primary action, and visible at every width.
- Let Contact leave first when space runs out; Login and Start for free stay.

## Don't

- Don't add a second primary (Book a demo) next to Start for free.
- Don't put the console's account controls here; a signed-in visitor goes to Console.

## Copy

- **Navigation:** nouns, sentence case: `Solutions`, `Pricing`.
- **Actions:** short verbs: `Contact`, `Login`, `Start for free`. Keep the same capitalization on every page and in the hero.

## Accessibility

- Sticky bar: make sure in-page anchors scroll with an offset so the target is not hidden under it.
- `NavigationMenu` triggers are keyboard operable and the popup closes on Escape; the mobile trigger has `aria-label="Open navigation"`.
- At 320 px only the trigger, brand, Login, Start for free and search remain, without horizontal scroll.

## States

- Default: the only state; navigation from `xl`, trigger below it.

## Related

- `shells/website` — the shell this bar heads.
- `headers/docs-header` — the documentation counterpart.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("headers/site-header", { variant })`, or the file under `blocks/headers/site-header/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Command from '@aziontech/webkit/command'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const links = ['Solutions', 'Products', 'Developer', 'Resources', 'Pricing']
  const searchPages = ['Functions', 'Applications', 'Firewall', 'Pricing', 'Documentation']
  const searchOpen = ref(false)
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <div class="sticky top-0 z-40">
      <GlobalHeader
        kind="site"
        aria-label="Azion"
      >
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <div class="shrink-0 xl:hidden">
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                ariaLabel="Open navigation"
              />
            </div>
            <GlobalHeader.Brand>
              <a
                href="#"
                aria-label="Azion home"
                class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </GlobalHeader.Brand>
          </div>
        </GlobalHeader.Left>

        <GlobalHeader.Middle>
          <div class="hidden w-full min-w-0 items-center justify-start xl:flex">
            <div class="min-w-0">
              <NavigationMenu
                aria-label="Azion"
                class="w-full"
              >
                <NavigationMenu.List>
                  <NavigationMenu.Item
                    v-for="link in links"
                    :key="link"
                  >
                    <NavigationMenu.Trigger href="#">{{ link }}</NavigationMenu.Trigger>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
                <NavigationMenu.Portal>
                  <NavigationMenu.Positioner
                    side="bottom"
                    align="start"
                    :side-offset="12"
                  >
                    <NavigationMenu.Popup kind="contrast">
                      <NavigationMenu.Arrow />
                      <NavigationMenu.Viewport />
                    </NavigationMenu.Popup>
                  </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
              </NavigationMenu>
            </div>
          </div>
        </GlobalHeader.Middle>

        <GlobalHeader.Right>
          <div class="hidden xl:flex">
            <Button
              label="Contact"
              kind="transparent"
              size="medium"
              href="#"
            />
          </div>
          <Button
            label="Login"
            kind="secondary"
            size="medium"
            href="#"
          />
          <Button
            label="Start for free"
            kind="primary"
            size="medium"
            class="shrink-0"
            href="#"
          />
          <SearchTrigger
            collapsible
            @open="searchOpen = true"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
      <Command v-model:open="searchOpen">
        <Command.Input placeholder="Search azion.com" />
        <Command.List>
          <Command.Empty>No page matches your search.</Command.Empty>
          <Command.Group heading="Pages">
            <Command.Item
              v-for="page in searchPages"
              :key="page"
              :value="page"
              >{{ page }}</Command.Item
            >
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  </div>
</template>
```
