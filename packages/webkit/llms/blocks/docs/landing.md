# DocsLanding (`docs/landing`)

> The documentation home, chrome included: the docs bar with a `SearchTrigger` that widens into the ⌘K field, the rail with the Getting started and Platform resources groups and the `ThemeSwitcher`, then a reading column with no outline rail. It opens on a `DocPageHeader` with no breadcrumb (the welcome title and one sentence), the Get started `Button` and a `DocPrompt` the reader hands to a coding agent. Then the entry points, each a `DocHeading` section: Start by interface (a full-width `DocCard` for agent setup over a three-column `DocCardGroup` of Console, CLI and API), Start by objective (two columns), Ready-made templates (four columns of framework glyphs, two on a phone, with an Also useful line in `DocProse`) and Follow along (release notes, blog, Discord). `DocPagination` points forward to the first page in reading order and the `Footer` closes the column. Built from `GlobalHeader`, `NavigationMenu`, `SearchTrigger`, `Sidebar`, `MenuRoot`, `ThemeSwitcher`, `ScrollArea`, `DocPageHeader`, `DocPrompt`, `DocCardGroup`, `DocCard`, `DocHeading`, `DocProse`, `DocPagination`, `Footer` and `StatusIndicator`.

- Surface: docs
- Source: `blocks/docs/landing/landing.vue` in `@aziontech/webkit`
- MCP: `get_pattern("docs/landing")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [DocCard](../../components/doc-card.md), [DocCardGroup](../../components/doc-card-group.md), [DocHeading](../../components/doc-heading.md), [DocPageHeader](../../components/doc-page-header.md), [DocPagination](../../components/doc-pagination.md), [DocPrompt](../../components/doc-prompt.md), [DocProse](../../components/doc-prose.md), [Footer](../../components/footer.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), `MenuGroup`, `MenuItem`, `MenuRoot`, [NavigationMenu](../../components/navigation-menu.md), [ScrollArea](../../components/scroll-area.md), [SearchTrigger](../../components/search-trigger.md), [Sidebar](../../components/sidebar.md), [StatusIndicator](../../components/status-indicator.md), [ThemeSwitcher](../../components/theme-switcher.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-microcopy`

## Asked as

documentation home; docs home page; docs landing page; documentation landing; welcome to the docs; docs index with entry points; start here page; developer portal home; página inicial da documentação; home da documentação; portal do desenvolvedor

The front door of the documentation. Readers arrive without a page in mind: a new user who wants the first step, a developer who knows the tool they want (Console, CLI, API), or someone with a goal (build, accelerate, secure). The landing sends each of them to one page in a click. It has no outline rail, because it has no reading order of its own; the column holds grids of entry points instead.

## When to use

- The home of a documentation site, or of one product's documentation.
- A developer portal start page that routes to guides, tools and references.

## When not to use

- A page that teaches or describes one thing from top to bottom: use `docs/article`.
- The marketing home: use `shells/website` and the page sections.
- A list of every page: the rail already lists them; don't repeat it as a grid.

## Building blocks

### A. Docs bar — `GlobalHeader`, `Brand`, `NavigationMenu`, `IconButton`, `SearchTrigger`, `Button`

The bar of `headers/docs-header`, with Search as a `collapsible` `SearchTrigger` (`Search docs`) inside an `@container`. On the landing, search is the most-used control, so it keeps its field form whenever the bar is wide enough.

### B. Rail — `Sidebar`, `MenuRoot`, `MenuGroup`, `MenuItem`, `ThemeSwitcher`

From `lg`. Getting started first, with Overview selected, then Platform resources. Rows pass `icon=""`. The `ThemeSwitcher` sits in the rail footer.

### C. Welcome — `ScrollArea`, `DocPageHeader`, `Button`, `DocPrompt`

`DocPageHeader` with no breadcrumb and no meta actions carries the page's `h1` and one sentence. Under it go one primary `Button` (Get started) and a `DocPrompt` the reader copies into a coding agent.

### D. Entry points — `DocProse`, `DocHeading`, `DocCardGroup`, `DocCard`

The groups sit in one `DocProse`, which gives `DocHeading` its type scale. Each group is a `section` labelled by its `DocHeading`. Start by interface opens with one full-width `DocCard` (eyebrow `Recommended`, agent setup) over three `DocCard`s with a `link-label`. Start by objective uses two columns. Templates use four columns with framework glyphs (`ai ai-react`, `ai ai-next`…) and two on a phone. An "Also useful" line in `DocProse` closes a group when it has more than the grid shows.

### E. Footer — `DocPagination`, `Footer`, `StatusIndicator`

`DocPagination` points forward to the first page in reading order. The `content` placement `Footer` follows inside the column's scroller.

## Do

- Name each card by its destination and give it one sentence on what the reader will do there.
- Keep each group to one grid of at most eight cards.
- Order the groups from the broadest entry (interface) to the narrowest (templates).

## Don't

- Don't add an outline rail; the landing has no headings to follow.
- Don't use the marketing `Banner` here; at docs scale it outweighs the page title. A full-width `DocCard` with an eyebrow does the job.
- Don't link a card to another landing; link to a page that starts the task.

## Copy

- **Title:** `Welcome to Azion Docs`, or the product name for a product landing.
- **Group headings:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`.
- **Card titles:** the destination, sentence case: `Build your application`. **Link labels:** a verb and the object: `Install the CLI`.
- **External cards:** say where the link goes in the label: `Join the Discord`.

## Accessibility

- Heading order: the `h1` from `DocPageHeader`, then one `h2` per group from `DocHeading`; cards carry no headings above `h3`.
- Landmarks: the bar, the rail (`Documentation`), `main` with one `section` per group (`aria-labelledby` its heading), and the footer.
- Focus order follows the reading order; every card is one link, and external ones open a new tab.
- The `DocPrompt` copy result is announced by its own live region.

## States

- `Default`: the only state; the landing is static content and has no loading, empty or error form.

## Related

- `docs/article`: the pages the landing links to.
- `shells/documentation`: the chrome alone.
- `headers/docs-header`: the bar alone.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("docs/landing", { variant })`, or the file under `blocks/docs/landing/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const theme = ref('system')

  const gettingStarted = ['Fundamentals', 'Agent setup', 'Use cases', 'Support', 'Marketplace']
  const platform = [
    'Workloads',
    'Applications',
    'Firewall',
    'Functions',
    'Connectors',
    'Object Storage',
    'SQL Database',
    'KV Store'
  ]

  const interfaces = [
    {
      title: 'Console',
      icon: 'pi pi-desktop',
      link: 'Access the Console',
      text: 'Create and manage every resource in the browser.'
    },
    {
      title: 'CLI',
      icon: 'pi pi-code',
      link: 'Install the CLI',
      text: 'Build, link and deploy projects from your terminal.'
    },
    {
      title: 'API',
      icon: 'pi pi-server',
      link: 'Call the API',
      text: 'Automate the platform over REST with a personal token.'
    }
  ]
  const objectives = [
    {
      title: 'Build your application',
      icon: 'pi pi-box',
      text: 'Deploy a framework app or a function.'
    },
    {
      title: 'Accelerate your application',
      icon: 'pi pi-bolt',
      text: 'Cache, optimize images and route to origins.'
    },
    {
      title: 'Secure your application',
      icon: 'pi pi-shield',
      text: 'Firewall, WAF, bot rules and TLS.'
    },
    {
      title: 'Execute AI inference',
      icon: 'pi pi-microchip-ai',
      text: 'Run models close to your users.'
    }
  ]
  const templates = [
    { title: 'React', icon: 'ai ai-react' },
    { title: 'Next.js', icon: 'ai ai-next' },
    { title: 'Astro', icon: 'ai ai-astro' },
    { title: 'Vue.js', icon: 'ai ai-vue' },
    { title: 'Angular', icon: 'ai ai-angular' },
    { title: 'Gatsby Blog', icon: 'ai ai-gatsby' },
    { title: 'Hono', icon: 'ai ai-hono' },
    { title: 'Hugo', icon: 'ai ai-hugo' }
  ]
  const followAlong = [
    {
      title: 'Release notes',
      icon: 'pi pi-megaphone',
      link: 'Read the release notes',
      target: '_self'
    },
    { title: 'Blog', icon: 'pi pi-book', link: 'Read the blog', target: '_blank' },
    { title: 'Discord', icon: 'pi pi-discord', link: 'Join the Discord', target: '_blank' }
  ]

  const footerColumns = [
    { title: 'Company', links: ['About us', 'Careers', 'Compliance', 'Privacy Policy'] },
    { title: 'Resources', links: ['Blog', 'Learning', 'Marketplace', 'Success cases'] },
    { title: 'Getting started', links: ['Start for free', 'Pricing', 'Contact'] },
    { title: 'Developer', links: ['Documentation', 'API', 'Release notes'] }
  ]
</script>

<template>
  <div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas) text-(--text-default)">
    <div class="@container w-full">
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
                class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
              >
                <Brand size="small" />
                <span
                  class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
                  >Docs</span
                >
              </a>
            </GlobalHeader.Brand>
            <div class="ms-(--spacing-xs) hidden shrink-0 lg:flex">
              <NavigationMenu aria-label="Documentation sections">
                <NavigationMenu.List>
                  <NavigationMenu.Item
                    v-for="section in sections"
                    :key="section"
                  >
                    <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu>
            </div>
          </div>
        </GlobalHeader.Left>
        <GlobalHeader.Nav />
        <GlobalHeader.Right>
          <SearchTrigger
            collapsible
            label="Search docs"
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
    </div>

    <div class="relative flex min-h-0 flex-1">
      <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
        <Sidebar
          aria-label="Documentation"
          class="w-full"
        >
          <template #footer>
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </template>
          <MenuRoot role="presentation">
            <MenuGroup label="Getting started">
              <MenuItem
                icon=""
                label="Overview"
                href="#"
                selected
              />
              <MenuItem
                icon=""
                v-for="page in gettingStarted"
                :key="page"
                :label="page"
                href="#"
              />
            </MenuGroup>
            <MenuGroup label="Platform resources">
              <MenuItem
                icon=""
                v-for="page in platform"
                :key="page"
                :label="page"
                href="#"
              />
            </MenuGroup>
          </MenuRoot>
        </Sidebar>
      </aside>

      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea class="w-full">
          <article
            class="layout-column layout-boundary-inline flex flex-col gap-(--spacing-xl) pt-(--spacing-xl) pb-(--spacing-xxl)"
          >
            <header class="flex flex-col gap-(--spacing-md)">
              <DocPageHeader
                title="Welcome to Azion Docs"
                description="We make every application fast and reliable. Deploy on a global network with enterprise-grade security and no cold starts."
              />
              <div class="flex flex-wrap gap-(--spacing-sm)">
                <Button
                  label="Get started"
                  kind="primary"
                  size="large"
                  href="#"
                />
              </div>
              <DocPrompt title="Prompt for your coding agent">
                Set up the Azion CLI, connect the Azion docs over MCP and link this project to my
                Azion account.
              </DocPrompt>
            </header>

            <DocProse>
              <div class="flex flex-col gap-(--spacing-xl)">
                <section
                  aria-labelledby="start-by-interface"
                  class="flex flex-col gap-(--spacing-md)"
                >
                  <DocHeading
                    id="start-by-interface"
                    :level="2"
                    >Start by interface</DocHeading
                  >
                  <DocCardGroup :cols="1">
                    <DocCard
                      eyebrow="Recommended"
                      title="Your AI agent, fluent in Azion"
                      icon="pi pi-sparkles"
                      link-label="Agent setup"
                      href="#"
                      >Give your coding agent the CLI, the live docs and your project in one
                      prompt.</DocCard
                    >
                  </DocCardGroup>
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in interfaces"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      :link-label="item.link"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                  </DocCardGroup>
                </section>

                <section
                  aria-labelledby="start-by-objective"
                  class="flex flex-col gap-(--spacing-md)"
                >
                  <DocHeading
                    id="start-by-objective"
                    :level="2"
                    >Start by objective</DocHeading
                  >
                  <DocCardGroup :cols="2">
                    <DocCard
                      v-for="item in objectives"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                  </DocCardGroup>
                </section>

                <section
                  aria-labelledby="templates"
                  class="flex flex-col gap-(--spacing-md)"
                >
                  <DocHeading
                    id="templates"
                    :level="2"
                    >Ready-made templates</DocHeading
                  >
                  <DocCardGroup
                    :cols="4"
                    :mobile-columns="2"
                  >
                    <DocCard
                      v-for="item in templates"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                    />
                  </DocCardGroup>
                  <p>
                    Also useful: <a href="#">First deploy</a>,
                    <a href="#">Frameworks compatibility</a>.
                  </p>
                </section>

                <section
                  aria-labelledby="follow-along"
                  class="flex flex-col gap-(--spacing-md)"
                >
                  <DocHeading
                    id="follow-along"
                    :level="2"
                    >Follow along</DocHeading
                  >
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in followAlong"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      :link-label="item.link"
                      :target="item.target"
                      href="#"
                    />
                  </DocCardGroup>
                </section>
              </div>
            </DocProse>
            <DocPagination :next="{ title: 'Agent setup', href: '#' }" />
          </article>

          <div class="w-full border-t border-(--border-default)">
            <Footer
              kind="content"
              aria-label="Footer"
            >
              <Footer.Column
                v-for="column in footerColumns"
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
              <template #status>
                <StatusIndicator
                  severity="success"
                  label="All systems operational"
                />
              </template>
            </Footer>
          </div>
        </ScrollArea>
      </main>
    </div>
  </div>
</template>
```
