# Documentation (`shells/documentation`)

> The documentation shell: a `GlobalHeader` in its `content` placement (see Templates › Headers › DocsHeader), a `Sidebar` rail from `lg` carrying a `MenuRoot` of the current product’s pages and the theme switcher in its footer, the reading column scrolling inside its own `ScrollArea`, and the “On this page” outline from `xl`. The `Footer` sits INSIDE the reading column’s scroller, in its `content` placement: the bands run full bleed across the zone between the rail and the outline and open on the page boundary, like the top bar above. Below `lg` the rail leaves and the footer takes the whole width; below `md` the footer stacks. The social buttons are small and row two sizes its bands by content, so the brand mark, seven icons and the status pair share one line in a zone as narrow as this column at 1024 wide; the brand leads that row from `lg` (answered by the `lg:` utility, so it follows the breakpoint token) and moves to the signature band below it. Built from `GlobalHeader`, `Sidebar`, `MenuRoot`, `ScrollArea`, `ThemeSwitcher` and `Footer`. Three variants fill the reading column with a real page, built only from the documentation parts: Article is a tutorial (First deploy) — `DocPageHeader` with breadcrumb, last updated and the Copy / View as Markdown and Agent setup actions, then one `DocProse` holding a `DocCardGroup` chooser of paths, `DocCallout` tips, `DocHeading` sections, `DocSteps` with `CodeBlock` commands, a `DocPrompt` for the coding agent, Next steps as `DocCardGroup`, Related resources as `DocItem` rows in a `FrameBox`, then `DocPagination`, with the outline rail as `DocOnThisPage` plus the closing `DocCta`; Reference is a product reference page (an info callout, the request path as a `Diagram` in a `DocFrame`, a JSON `CodeBlock`, a term list); Landing is the documentation home (no outline rail: welcome `DocPageHeader`, Get started, a `DocPrompt`, then `DocCardGroup` entry points by interface, objective, template and follow-along). The variants carry search as a `SearchTrigger` that widens into the ⌘K field.

- Surface: docs
- Source: `blocks/shells/documentation/documentation.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/documentation")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [CodeBlock](../../components/code-block.md), [Diagram](../../components/diagram.md), [DocCallout](../../components/doc-callout.md), [DocCard](../../components/doc-card.md), [DocCardGroup](../../components/doc-card-group.md), [DocCta](../../components/doc-cta.md), [DocFrame](../../components/doc-frame.md), [DocHeading](../../components/doc-heading.md), [DocItem](../../components/doc-item.md), [DocOnThisPage](../../components/doc-on-this-page.md), [DocPageHeader](../../components/doc-page-header.md), [DocPagination](../../components/doc-pagination.md), [DocPrompt](../../components/doc-prompt.md), [DocProse](../../components/doc-prose.md), [DocStep](../../components/doc-step.md), [DocSteps](../../components/doc-steps.md), [Footer](../../components/footer.md), [FrameBox](../../components/frame-box.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), `ItemList`, `MenuGroup`, `MenuItem`, `MenuRoot`, `MenuSub`, `MenuSubContent`, `MenuSubTrigger`, [NavigationMenu](../../components/navigation-menu.md), [ScrollArea](../../components/scroll-area.md), [SearchTrigger](../../components/search-trigger.md), [Select](../../components/select.md), [Sidebar](../../components/sidebar.md), [StatusIndicator](../../components/status-indicator.md), [ThemeSwitcher](../../components/theme-switcher.md)
- Skills: `webkit-layout`, `webkit-navigation`

## Asked as

docs shell; documentation layout; docs page layout; documentation site; docs sidebar; on this page outline; knowledge base layout; layout da documentação; página de documentação; estrutura da documentação; documentation shell; docs layout; documentation article; docs article page; tutorial page; getting started guide; how-to guide; product reference page; reference documentation; docs page with steps and code; documentation home; docs home page; docs landing page; developer portal home; artigo da documentação; página de tutorial; guia de primeiros passos; página de referência do produto; página inicial da documentação; home da documentação

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close: the docs header on top, a rail of the current product's pages from `lg`, a reading column that scrolls on its own, the "On this page" outline from `xl`, and the footer inside the reading column's scroller so the bands sit between the rail and the outline.

## When to use

- Every documentation, guide or reference page.

## When not to use

- Marketing pages: `shells/website`. Product pages: `shells/console`.

## Building blocks

### A. Header — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion documentation"`; the same bar as `headers/docs-header`.

### B. Icon actions — `IconButton` (required)

The navigation trigger below `lg`, Search and GitHub in the header, and the small `transparent` social links in the footer, each with an `aria-label`.

### C. Brand — `Brand` (required)

In the header with the Docs tag, and in the footer: it leads the social row from `lg` and moves to the signature band below it.

### D. Section links — `NavigationMenu` (required from lg)

The top-level documentation sections in the header.

### E. Console — `Button` (required)

`secondary`, last in the header.

### F. Rail — `Sidebar` (required from lg)

`aria-label="Docs"`, the width of `--container-2xs`, holding the page menu and the theme switcher in its footer. Below `lg` it leaves and the header trigger opens the navigation.

### G. Theme — `ThemeSwitcher` (required)

In the rail footer, labelled `Theme`.

### H. Page menu — `MenuRoot` (required)

The rail's page navigation for the current product.

### I. Product group — `MenuGroup` (required)

One per product (`Functions`), with the product name as its heading.

### J. Page link — `MenuItem` (required)

One per page, the current page `selected`.

### K. Reading column — `ScrollArea` (required)

The article and the footer scroll inside it, so the header, rail and outline stay put.

### L. Footer — `Footer` (required)

`kind="content"`, inside the scroller: `Footer.Column` with `Footer.Link` items, then the social, status, language and brand slots. It stacks below `md`.

### M. System status — `StatusIndicator` (required)

In the footer's status slot.

### N. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- For a real page, start from a variant (Article, Reference, Landing), not from the primary: the primary's column is a placeholder, and the variants build it from the `Doc*` parts only.
- Put everything under `DocPageHeader` in one `DocProse`: it sets the running text and gives `DocHeading` its type scale. Every `DocHeading` has an `id`, and `DocOnThisPage` lists the same headings.
- Write the deck as the outcome (`By the end of this tutorial, …`), one action per `DocStep`, with its command as a `CodeBlock` inside the same step.
- Use `SearchTrigger` (`collapsible`, `Search docs`) inside an `@container` for search, so it is the ⌘K field when the bar is wide and the magnifier when it is narrow.
- Keep the outline's items equal to the article's `h2` headings.
- Keep the rail scoped to the current product; the header links switch products.
- Let the footer run full bleed across the zone between rail and outline.

## Don't

- Don't hand-write the outline, the pager or the masthead; `DocOnThisPage`, `DocPagination` and `DocPageHeader` own their markup and labels.
- Don't put a `DocHeading` outside `DocProse` (it renders at body size), and don't drop a `Button` row straight into `DocProse`: wrap it in an element with `data-doc-chrome`, or the prose restyles its `<a>` and the label loses contrast.
- Don't leave the rail rows on `MenuItem`'s default glyph: pass `icon=""`.
- Don't use the marketing `Banner` on the landing; a full-width `DocCard` with an eyebrow does the job at docs scale.
- Don't put the footer outside the scroller: it would stay pinned and eat the reading height.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Outline heading:** `On this page`.
- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Menu items:** page titles exactly as the `h1` reads.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`
- **Landing groups:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`; card link labels are a verb and the object (`Install the CLI`).

## Accessibility

- One `h1` per article; outline links target the `h2` ids.
- `ScrollArea` keeps keyboard scrolling working; the article is reachable without passing through the rail.
- Each `nav` (header sections, rail, outline) is labelled so screen reader users can tell them apart.

## States

- Default: the chrome with a placeholder column; rail from `lg`, outline from `xl`, footer stacked below `md`.
- Article: a tutorial page from the `Doc*` parts, pager in both directions, outline rail with `DocOnThisPage` and `DocCta`.
- Reference: a product reference page with a callout, the request-path diagram, a JSON rule and a term list; pager forward only.
- Landing: the documentation home; no outline rail, entry-point grids, pager forward to the first page.

## Related

- `headers/docs-header` — the header on its own.
- `shells/website` — the marketing counterpart that shares the footer.

## Variants

- `Default` — primary (the code below)
- `Article` — A tutorial page: masthead with breadcrumb and meta actions, a chooser of paths, callouts, steps with commands, an agent prompt, Next steps, Related resources, the pager, and the outline rail with DocOnThisPage and DocCta.
- `Reference` — A product reference page: an info callout, two actions, the request path as a Diagram in a DocFrame, a JSON CodeBlock, a term list and a two-column Next steps.
- `Landing` — The documentation home: no outline rail; the welcome masthead, Get started, a DocPrompt, then DocCardGroup entry points by interface, objective, template and follow-along, and the pager forward.

Each variant is the same screen in another state: `get_pattern("shells/documentation", { variant })`, or the file under `blocks/shells/documentation/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Footer from '@aziontech/webkit/footer'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const pages = [
    'Overview',
    'Getting started',
    'How it works',
    'Examples',
    'Reference',
    'Limits',
    'Best practices',
    'Troubleshooting'
  ]
  const outline = [
    'Overview',
    'Prerequisites',
    'Create the function',
    'Instantiate it in your application',
    'Verify the response',
    'Next steps'
  ]
  const theme = ref('dark')

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
  <div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas) text-(--text-default)">
    <GlobalHeader aria-label="Azion documentation">
      <GlobalHeader.Left>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <div class="shrink-0 lg:hidden">
            <IconButton
              icon="pi pi-bars"
              kind="outlined"
              size="medium"
              aria-label="Open documentation navigation"
            />
          </div>
          <GlobalHeader.Brand>
            <a
              href="#"
              aria-label="Azion Docs home"
              class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) gap-(--spacing-xs)"
            >
              <Brand
                kind="default"
                size="small"
              />
              <span
                class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
              >
                Docs
              </span>
            </a>
          </GlobalHeader.Brand>
          <div class="shrink-0 ms-(--spacing-xs) hidden lg:flex">
            <NavigationMenu aria-label="Documentation sections">
              <NavigationMenu.List>
                <NavigationMenu.Item
                  v-for="section in sections"
                  :key="section"
                >
                  <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
                </NavigationMenu.Item>
              </NavigationMenu.List>
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
          </div>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Nav />
      <GlobalHeader.Right>
        <IconButton
          icon="pi pi-search"
          kind="outlined"
          size="medium"
          aria-label="Search documentation"
          class="shrink-0"
        />
        <IconButton
          icon="pi pi-github"
          kind="outlined"
          size="medium"
          aria-label="Azion on GitHub"
          href="https://github.com/aziontech"
          target="_blank"
          class="shrink-0"
        />
        <Button
          label="Console"
          kind="secondary"
          size="medium"
          class="shrink-0"
          href="#"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <div class="relative flex min-h-0 flex-1">
      <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
        <div class="flex w-full h-full">
          <Sidebar
            aria-label="Docs"
            class="w-full"
          >
            <template #footer>
              <ThemeSwitcher
                v-model="theme"
                aria-label="Theme"
              />
            </template>
            <MenuRoot role="presentation">
              <MenuGroup label="Functions">
                <MenuItem
                  v-for="page in pages"
                  :key="page"
                  :label="page"
                  :selected="page === 'Getting started'"
                  href="#"
                />
              </MenuGroup>
            </MenuRoot>
          </Sidebar>
        </div>
      </aside>

      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="flex flex-1">
          <ScrollArea class="w-full">
            <article
              class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-md) pt-(--spacing-md) pb-(--spacing-xxl)"
            >
              <p class="text-overline-sm uppercase text-(--text-muted)">Functions</p>
              <h1 class="text-heading-xl">Getting started</h1>
              <p class="text-body-md text-(--text-muted)">
                Create a function, instantiate it in an application, and verify the response from
                the edge.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Create the function</h2>
              <p class="text-body-md text-(--text-muted)">
                Open Functions in the console, select Create Function, paste the handler below and
                save it.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Instantiate it in your application</h2>
              <p class="text-body-md text-(--text-muted)">
                On the application's Functions tab, add an instance pointing at the function you
                just created.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Verify the response</h2>
              <p class="text-body-md text-(--text-muted)">
                Request the domain and read the header the function sets.
              </p>
            </article>

            <div class="w-full border-t border-(--border-default)">
              <Footer
                kind="content"
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
          </ScrollArea>
        </div>
      </main>

      <aside
        class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-sm) border-s border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex"
      >
        <p class="text-overline-sm uppercase text-(--text-muted)">On this page</p>
        <ul class="flex flex-col border-s border-(--border-default)">
          <li
            v-for="item in outline"
            :key="item"
          >
            <a
              href="#"
              class="block px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-muted) hover:text-(--text-default)"
            >
              {{ item }}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
```
