# Website (`shells/website`)

> The website shell: a sticky `GlobalHeader` in its `site` placement (see Templates › Headers › SiteHeader), one `Hero` band opening the page, every section stacked inside one framed `SectionContainer max-width="site"` separated by hatched gaps, a closing frame that draws no rule of its own, and the `Footer` in its `site` placement closing the page frame. The hero, the sections and the footer all resolve to the site measure, which is the only reason the side rules running down the page are continuous; the hairline above the footer is the mirror of the hero’s top rule, so the frame turns the corner instead of stopping at it. The footer’s social buttons are small, the brand mark leads the social row from `lg` (answered by the `lg:` utility, so it follows the breakpoint token) and moves to the signature band below it, and row two sizes its bands by content, so the row never wraps while the status pair still has room. Built from `GlobalHeader`, `Hero`, `SectionContainer`, `SectionGap`, `SectionModule`, `FrameBox`, `BigNumbers`, `TextureMaterial` and `Footer`. The full mega-menus and the navigation sheet are documented on Templates › Marketing › Shell › SiteNav.

- Surface: marketing
- Source: `blocks/shells/website/website.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/website")`
- Components: [BigNumbers](../../components/big-numbers.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Footer](../../components/footer.md), [FrameBox](../../components/frame-box.md), [GlobalHeader](../../components/global-header.md), [Hero](../../components/hero.md), [IconButton](../../components/icon-button.md), [NavigationMenu](../../components/navigation-menu.md), [SectionContainer](../../components/section-container.md), [SectionGap](../../components/section-gap.md), [SectionModule](../../components/section-module.md), [Select](../../components/select.md), [StatusIndicator](../../components/status-indicator.md), [TextureMaterial](../../components/texture-material.md)
- Skills: `webkit-layout`

## Asked as

site shell; marketing site layout; landing page layout; website layout; marketing page frame; layout do site; estrutura do site; página de marketing; website shell; marketing site shell

The marketing shell. A visitor scans to decide whether Azion fits, so the page is one continuous frame: a sticky site header, a hero band that states the offer and the two next steps, every section stacked inside one framed container separated by hatched gaps, and the site footer closing the frame. The hero, sections and footer all resolve to the site measure, which is what keeps the side rules continuous down the page.

## When to use

- Product, solution and landing pages on the public site.

## When not to use

- Documentation: `shells/documentation`. Product UI: `shells/console`.

## Building blocks

### A. Header — `GlobalHeader` (required)

`kind="site"` in a sticky wrapper; the same bar as `headers/site-header`.

### B. Icon actions — `IconButton` (required)

The navigation trigger below `xl` and Search in the header; the small `transparent` social links in the footer.

### C. Brand — `Brand` (required)

In the header, and in the footer leading the social row from `lg` or in the signature band below it.

### D. Primary navigation — `NavigationMenu` (required from xl)

The five top-level links with the `contrast` mega-menu popup.

### E. Actions — `Button` (required)

Header actions (Contact, Login, Start for free) and the hero's primary and outlined large buttons.

### F. Opening band — `Hero` (required)

`kind="band"`, `size="large"`, `max-width="site"`; `Hero.Title` carries the eyebrow, title, description and the two actions, centred.

### G. Frame — `SectionContainer` (required)

`max-width="site"`; every section after the hero stacks inside it.

### H. Separator — `SectionGap` (required)

`hatch` between sections. Use it instead of margins.

### I. Section — `SectionModule` (required)

One per section; here unpadded and undivided around a framed figure row.

### J. Framed area — `FrameBox` (required)

Draws borders and corner marks; the closing frame uses `borders="none"` so it draws no rule of its own.

### K. Figures — `BigNumbers` (optional)

A row of headline figures inside a `FrameBox`.

### L. Texture — `TextureMaterial` (optional)

`kind="lines"`, the decorative fill of the closing frame.

### M. Footer — `Footer` (required)

`kind="site"`, with columns, social, status, language and brand slots; the hairline above it mirrors the hero's top rule.

### N. System status — `StatusIndicator` (required)

In the footer's status slot.

### O. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Keep every band on the site measure; one off-measure section breaks the side rules.
- Separate sections with `SectionGap`, not with spacing utilities.
- Keep one primary action per band.

## Don't

- Don't nest a second `SectionContainer`.
- Don't put interactive content inside `TextureMaterial`; it is decoration.

## Copy

- **Hero title:** the outcome in sentence case, under ten words. **Eyebrow:** the product name: `Functions`.
- **Hero actions:** match the header's wording and capitalization (`Start for free`, `Talk to a specialist`); the sample's hero reads `Start for free`, which should follow the header.
- **Figures:** a number and a short noun phrase.

## Accessibility

- One `h1` (the hero title) per page; sections use `h2`.
- The sticky header must not cover anchor targets; scroll with an offset.
- Decorative textures and hatches are hidden from assistive technology.

## States

- Default: the only state.

## Related

- `headers/site-header` — the header on its own.
- `shells/documentation` — shares the footer anatomy in its `content` placement.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("shells/website", { variant })`, or the file under `blocks/shells/website/variants/`.

## Code (`Default`)

```vue
<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Hero from '@aziontech/webkit/hero'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const links = ['Solutions', 'Products', 'Developer', 'Resources', 'Pricing']
  const figures = [
    { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
    { value: '24', suffix: '/7', label: 'Support on every plan' },
    { value: '99.99', suffix: '%', label: 'Availability, contractual' }
  ]

  const columns = [
    {
      title: 'Products',
      links: [
        'Functions',
        'Cache',
        'Object Storage',
        'SQL Database',
        'WAF',
        'Edge DNS',
        'Data Stream'
      ]
    },
    {
      title: 'Solutions',
      links: [
        'Web Apps',
        'AI',
        'Application Security',
        'Financial Services',
        'Retail',
        'Technology'
      ]
    },
    {
      title: 'Developers',
      links: ['Docs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
  ]

  const socials = [
    { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'pi pi-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
  const language = ref('EN')

  const brandLeadsSocialRow = ref(false)
  let lgProbe = null
  const syncBrand = () => {
    brandLeadsSocialRow.value = getComputedStyle(lgProbe).display !== 'none'
  }
  onMounted(() => {
    lgProbe = document.createElement('span')
    lgProbe.className = 'hidden lg:block'
    document.body.append(lgProbe)
    syncBrand()
    window.addEventListener('resize', syncBrand)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncBrand)
    lgProbe?.remove()
  })
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-(--bg-canvas) text-(--text-default)">
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
                aria-label="Open navigation"
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
          <IconButton
            icon="pi pi-search"
            kind="outlined"
            size="medium"
            aria-label="Search"
            class="shrink-0"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
    </div>

    <main class="flex-1">
      <Hero
        kind="band"
        size="large"
        max-width="site"
      >
        <Hero.Title
          centered
          eyebrow="Functions"
          eyebrow-prefix="//"
          title="Run serverless code at the edge"
          description="Functions execute on 100+ data centers worldwide, with no servers to provision and nothing to scale by hand."
        >
          <template #actions>
            <Button
              label="Start for free"
              kind="primary"
              size="large"
              href="#"
            />
            <Button
              label="Talk to a specialist"
              kind="outlined"
              size="large"
              href="#"
            />
          </template>
        </Hero.Title>
      </Hero>

      <SectionContainer max-width="site">
        <SectionGap hatch />

        <SectionModule
          :divided="false"
          :padded="false"
        >
          <FrameBox
            flush
            borders="y"
            marks="bottom"
          >
            <BigNumbers :items="figures" />
          </FrameBox>
        </SectionModule>

        <SectionGap hatch />

        <FrameBox
          borders="none"
          marks="all"
          data-hatch="true"
          class="h-[calc(var(--spacing-xxl)*2)]"
        >
          <TextureMaterial kind="lines" />
        </FrameBox>
      </SectionContainer>
    </main>

    <div class="w-full border-t border-(--border-default)">
      <Footer
        kind="site"
        aria-label="Footer"
      >
        <Footer.Column
          v-for="column in columns"
          :key="column.title"
          :title="column.title"
        >
          <Footer.Link
            v-for="link in column.links"
            :key="link"
            href="#"
            >{{ link }}</Footer.Link
          >
        </Footer.Column>

        <template #social>
          <a
            v-if="brandLeadsSocialRow"
            href="#"
            aria-label="Azion home"
            class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) me-(--spacing-xs)"
          >
            <Brand size="small" />
          </a>
          <IconButton
            v-for="social in socials"
            :key="social.label"
            kind="transparent"
            size="small"
            :icon="social.icon"
            :aria-label="social.label"
            :href="social.href"
            target="_blank"
          />
        </template>

        <template #status>
          <StatusIndicator
            severity="success"
            label="All systems operational"
          />
        </template>

        <template #language>
          <div class="w-28">
            <Select
              v-model="language"
              placeholder="Language"
            >
              <Select.Trigger aria-label="Language">
                <template #iconLeft>
                  <i
                    class="pi pi-globe text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Option
                  v-for="option in languages"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
        </template>

        <template
          v-if="!brandLeadsSocialRow"
          #brand
        >
          <a
            href="#"
            aria-label="Azion home"
            class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) mx-auto"
          >
            <Brand size="small" />
          </a>
        </template>
      </Footer>
    </div>
  </div>
</template>
```
