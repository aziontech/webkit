# DocsArticle (`docs/article`)

> A whole documentation article page, chrome included: the docs bar with a `SearchTrigger` that widens into the ⌘K field, the product rail (`Sidebar` + `MenuRoot`, a folding group for the current section, the `ThemeSwitcher` in its footer), the reading column and the “On this page” rail with the closing `DocCta`. Under the masthead the column is one `DocProse` (which gives `DocHeading` its scale) built only from the documentation parts, in reading order: `DocPageHeader` (breadcrumb, title, deck, last updated, Copy / View as Markdown, Agent setup), `DocProse` for running text, a `DocCardGroup` chooser of paths, `DocCallout` tips and notes, `DocHeading` sections that the outline links to, `DocSteps` with `CodeBlock` commands, a `DocPrompt` for the coding agent, Next steps as `DocCardGroup`, Related resources as `DocItem` rows in a `FrameBox`, and `DocPagination`. The primary state is a tutorial (First deploy); the Reference variant is a product reference page (an info callout, the request path as a `Diagram` in a `DocFrame`, a JSON `CodeBlock` and a term list). Built from `GlobalHeader`, `NavigationMenu`, `SearchTrigger`, `Sidebar`, `MenuRoot`, `ThemeSwitcher`, `ScrollArea`, the `Doc*` parts, `CodeBlock`, `Footer` and `StatusIndicator`.

- Surface: docs
- Source: `blocks/docs/article/article.vue` in `@aziontech/webkit`
- MCP: `get_pattern("docs/article")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [CodeBlock](../../components/code-block.md), [Diagram](../../components/diagram.md), [DocCallout](../../components/doc-callout.md), [DocCard](../../components/doc-card.md), [DocCardGroup](../../components/doc-card-group.md), [DocCta](../../components/doc-cta.md), [DocFrame](../../components/doc-frame.md), [DocHeading](../../components/doc-heading.md), [DocItem](../../components/doc-item.md), [DocOnThisPage](../../components/doc-on-this-page.md), [DocPageHeader](../../components/doc-page-header.md), [DocPagination](../../components/doc-pagination.md), [DocPrompt](../../components/doc-prompt.md), [DocProse](../../components/doc-prose.md), [DocStep](../../components/doc-step.md), [DocSteps](../../components/doc-steps.md), [Footer](../../components/footer.md), [FrameBox](../../components/frame-box.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), `ItemList`, `MenuGroup`, `MenuItem`, `MenuRoot`, `MenuSub`, `MenuSubContent`, `MenuSubTrigger`, [NavigationMenu](../../components/navigation-menu.md), [ScrollArea](../../components/scroll-area.md), [SearchTrigger](../../components/search-trigger.md), [Sidebar](../../components/sidebar.md), [StatusIndicator](../../components/status-indicator.md), [ThemeSwitcher](../../components/theme-switcher.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-microcopy`

## Asked as

documentation article; docs article page; documentation page; docs page; tutorial page; getting started guide; how-to guide; product reference page; reference documentation; docs page with steps and code; knowledge base article; artigo da documentação; página de documentação; página de tutorial; guia de primeiros passos; página de referência do produto

One page of the documentation, from the bar to the footer. A reader lands here from search, from the console or from an agent, in the middle of a task. They need to know where they are (the breadcrumb and the rail), what the page gives them (the title and the deck), the shortest path through it (a chooser, steps and commands they can copy) and where to go next. The tutorial and the reference page share the chrome and the masthead; only the column's content changes.

## When to use

- A tutorial, a how-to guide or a getting-started page with steps and commands.
- A product or tool reference page (overview, request path, rule structure, limits).
- Any page that lives inside `shells/documentation` and reads top to bottom.

## When not to use

- The documentation home, with its grids of entry points and no reading order: use `docs/landing`.
- A changelog: compose `DocUpdate` entries in the same shell.
- Marketing pages: use `shells/website` and the page sections.
- Help inside the product: use `HelpPanel` or `TutorialPanel`, never a full docs page.

## Building blocks

### A. Docs bar — `GlobalHeader`, `Brand`, `NavigationMenu`, `IconButton`, `SearchTrigger`, `Button`

The bar of `headers/docs-header`, with Search as a `SearchTrigger` (`collapsible`, label `Search docs`) inside an `@container`, so it is the ⌘K field when the bar is wide and the magnifier when it is narrow. GitHub is an outlined `IconButton`; Console is the secondary `Button`, last.

### B. Product rail — `Sidebar`, `MenuRoot`, `MenuGroup`, `MenuItem`, `MenuSub`, `MenuSubContent`, `MenuSubTrigger`, `ThemeSwitcher`

From `lg`. One `MenuGroup` named after the product or section. The current page's section is a `MenuSub` opened by default (`kind="inline"`), and the current page is the `selected` `MenuItem`. The `ThemeSwitcher` sits in the rail footer.

### C. Reading column — `ScrollArea`, `DocPageHeader`, `DocProse`, `DocHeading`

The column scrolls inside its own `ScrollArea` with the `layout-column-content` measure. `DocPageHeader` opens it: the breadcrumb, the `h1`, one sentence of deck, `last-updated` and the meta actions (Copy as Markdown, View as Markdown, Agent setup). Everything under the masthead sits in one `DocProse`: it sets the running text and gives `DocHeading` its type scale, while the other `Doc*` parts mark themselves as chrome and keep their own styles. Every section is a `DocHeading` with an `id` that the outline links to.

### D. Paths and asides — `DocCardGroup`, `DocCard`, `DocCallout`, `DocPrompt`

When there is more than one way through the page, it opens with a `DocCardGroup` chooser that links to each path's heading. `DocCallout` holds a tip (`kind="tip"`) or a note (`kind="info"`), never the main instruction. `DocPrompt` holds the prompt the reader hands to a coding agent.

### E. Steps and code — `DocSteps`, `DocStep`, `CodeBlock`

Numbered instructions are `DocStep`s, each a short imperative title. A command sits inside its step as a `CodeBlock` (no line numbers for one-liners). Output and test commands get their own `CodeBlock` under a `Test it` heading.

### F. Leaving the page — `FrameBox`, `ItemList`, `DocItem`, `DocPagination`

Next steps is a `DocCardGroup` (three columns for a tutorial, two for a reference page). Related resources are `DocItem` rows in an `ItemList` inside a `FrameBox`. `DocPagination` closes the column with the previous and next pages in reading order.

### G. Outline rail — `DocOnThisPage`, `DocCta`

From `xl`. `DocOnThisPage` lists the `h2` and `h3` headings, lights the active one and carries the GitHub and Community link groups. `DocCta` is last in the rail, once per page.

### H. Footer — `Footer`, `StatusIndicator`

The `content` placement inside the column's scroller, so it spans the column and not the rails, with the system status.

## Do

- Write the deck as the outcome: what will be true when the reader finishes.
- Give every `h2` and `h3` an `id` and list the same headings in `DocOnThisPage`.
- Put one action in each step, and the command for that action inside the same step.
- Link a chooser card to the heading of its path on the same page.

## Don't

- Don't hand-write the outline, the pager or the masthead. The `Doc*` parts own their markup, links and labels.
- Don't put a `DocCallout` between a step and its command.
- Don't add a second `DocCta` in the column; the rail carries the page's one offer.
- Don't nest the rail menu more than three levels, and pass `icon=""` to its rows: `MenuItem` draws a home glyph by default.
- Don't put a `DocHeading` outside `DocProse`; it renders at body size there.
- Don't drop a `Button` row straight into `DocProse`: the prose restyles its `<a>` and the label loses contrast. Wrap the row in an element with `data-doc-chrome`.

## Copy

- **Title:** the task or the product, sentence case: `First deploy in a few minutes`, `Applications`.
- **Deck:** one sentence that names the outcome: `By the end of this tutorial, an application will be live…`.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`.
- **Headings:** nouns or short imperatives: `Before you start`, `Test it`, `Next steps`.
- **Search:** short enough to fit the field: `Search docs`.

## Accessibility

- Heading order: one `h1` (`DocPageHeader`), then `h2` sections and `h3` subsections from `DocHeading`; no level skipped.
- Landmarks: the bar (`GlobalHeader`, `Azion documentation`), the rail (`Sidebar`, named after the product), `main`, the outline rail (`complementary`) and the footer.
- Focus order follows the reading order: bar, rail, column (masthead, content, pager), outline, footer. The ⌘K field is a real button with `aria-keyshortcuts`.
- `DocOnThisPage` marks the active heading with `aria-current`; code blocks announce their copy result through their own live region.

## States

- `Tutorial`: the primary; a getting-started page with a chooser, steps, commands, an agent prompt and the pager in both directions.
- `Reference`: a product reference page; an info callout, the request-path diagram, a JSON rule and the term list, with the pager forward only.

## Related

- `shells/documentation`: the chrome alone, without a page.
- `headers/docs-header`: the bar alone.
- `docs/landing`: the documentation home.

## Variants

- `Tutorial` — primary (the code below)
- `Reference` — A product reference page: an info callout under the masthead, two actions, the request path as a Diagram in a DocFrame, a JSON CodeBlock, a term list in DocProse and a two-column Next steps.

Each variant is the same screen in another state: `get_pattern("docs/article", { variant })`, or the file under `blocks/docs/article/variants/`.

## Code (`Tutorial`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocItem from '@aziontech/webkit/doc-item'
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import ItemList from '@aziontech/webkit/item-list'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const theme = ref('system')

  const crumbs = [
    { label: 'Fundamentals', href: '#' },
    { label: 'Get started', href: '#' },
    { label: 'First deploy' }
  ]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye' },
    { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '#' }
  ]

  const outline = [
    { id: 'before-you-start', text: 'Before you start', depth: 2 },
    { id: 'deploy-a-template', text: 'Deploy a template via Console', depth: 2 },
    { id: 'test-the-template', text: 'Test it', depth: 3 },
    { id: 'deploy-with-cli', text: 'Deploy with Azion CLI', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 },
    { id: 'related-resources', text: 'Related resources', depth: 2 }
  ]
  const activeId = ref('before-you-start')

  const railGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'pi pi-github' },
        { label: 'Contribute to this page', href: '#', icon: 'pi pi-pencil' }
      ]
    },
    {
      label: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/azion', icon: 'pi pi-discord' },
        { label: 'X', href: 'https://x.com/aziontech', icon: 'ai ai-x' }
      ]
    }
  ]

  const testTabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: 'curl -I https://<your-azion-domain>\n# HTTP/2 200'
    }
  ]
  const installTabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: 'curl -fsSL https://cli.azion.app/install.sh | bash'
    }
  ]
  const deployTabs = [
    { label: 'Shell', value: 'shell', language: 'bash', code: 'azion login\nazion deploy' }
  ]

  const related = [
    {
      title: 'Applications',
      icon: 'pi pi-th-large',
      text: 'Route requests, cache responses and run code with rules.'
    },
    {
      title: 'Functions',
      icon: 'pi pi-code',
      text: 'Serverless code that runs close to your users.'
    },
    { title: 'Azion CLI', icon: 'pi pi-desktop', text: 'Build and deploy from your terminal.' }
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
          aria-label="Fundamentals"
          class="w-full"
        >
          <template #footer>
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </template>
          <MenuRoot role="presentation">
            <MenuGroup label="Fundamentals">
              <MenuItem
                icon=""
                label="Overview"
                href="#"
              />
              <MenuItem
                icon=""
                label="How Azion works"
                href="#"
              />
              <MenuSub default-open>
                <MenuSubTrigger
                  label="Get started"
                  kind="inline"
                />
                <MenuSubContent>
                  <MenuItem
                    icon=""
                    label="Create an account"
                    href="#"
                  />
                  <MenuItem
                    icon=""
                    label="First deploy"
                    href="#"
                    selected
                  />
                  <MenuItem
                    icon=""
                    label="Migrate to Azion"
                    href="#"
                  />
                </MenuSubContent>
              </MenuSub>
              <MenuItem
                icon=""
                label="Billing"
                href="#"
              />
              <MenuItem
                icon=""
                label="Security"
                href="#"
              />
            </MenuGroup>
          </MenuRoot>
        </Sidebar>
      </aside>

      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea class="w-full">
          <article
            class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
          >
            <DocPageHeader
              title="First deploy in a few minutes"
              description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain."
              :breadcrumb="crumbs"
              last-updated="2026-11-11"
              :meta-actions="metaActions"
            />
            <DocProse>
              <p>
                Three complete paths get you there. Pick one; each ends with the same application
                live on its domain.
              </p>
              <DocCardGroup :cols="3">
                <DocCard
                  title="Deploy a template"
                  icon="pi pi-th-large"
                  href="#deploy-a-template"
                  >A ready-made project, live in a few clicks.</DocCard
                >
                <DocCard
                  title="Import from GitHub"
                  icon="pi pi-github"
                  href="#"
                  >Connect a repository; every push deploys.</DocCard
                >
                <DocCard
                  title="Deploy with CLI"
                  icon="pi pi-desktop"
                  href="#deploy-with-cli"
                  >Build and deploy from your terminal.</DocCard
                >
              </DocCardGroup>
              <DocCallout kind="tip">
                New to Azion? Start with the template: it needs no local tooling.
              </DocCallout>

              <DocHeading
                id="before-you-start"
                :level="2"
                >Before you start</DocHeading
              >
              <p>
                You need an Azion account. The CLI path also needs a terminal with
                <code>curl</code> and a project folder.
              </p>

              <DocHeading
                id="deploy-a-template"
                :level="2"
                >Deploy a template via Console</DocHeading
              >
              <DocCallout kind="info">
                Templates create the workload, the application and the domain for you.
              </DocCallout>
              <DocSteps>
                <DocStep title="Open Azion Console." />
                <DocStep title="Select + Create on the home page." />
                <DocStep title="Pick a template and fill in the fields it asks for." />
                <DocStep title="Select Deploy and wait for the status to read Live." />
              </DocSteps>
              <DocHeading
                id="test-the-template"
                :level="3"
                >Test it</DocHeading
              >
              <CodeBlock
                :tabs="testTabs"
                default-value="shell"
              />

              <DocHeading
                id="deploy-with-cli"
                :level="2"
                >Deploy with Azion CLI</DocHeading
              >
              <DocPrompt title="AI Assistant">
                Install the Azion CLI, link this folder as an Azion project and deploy it. Show me
                the domain when it is live.
              </DocPrompt>
              <DocSteps>
                <DocStep title="Set up the Azion CLI">
                  <CodeBlock
                    :tabs="installTabs"
                    default-value="shell"
                    :show-line-numbers="false"
                  />
                </DocStep>
                <DocStep title="Log in and deploy">
                  <CodeBlock
                    :tabs="deployTabs"
                    default-value="shell"
                    :show-line-numbers="false"
                  />
                </DocStep>
              </DocSteps>

              <DocHeading
                id="next-steps"
                :level="2"
                >Next steps</DocHeading
              >
              <DocCardGroup :cols="3">
                <DocCard
                  title="Go live"
                  icon="pi pi-globe"
                  href="#"
                  >Point your own domain at the workload.</DocCard
                >
                <DocCard
                  title="Secure your application"
                  icon="pi pi-shield"
                  href="#"
                  >Add a firewall and WAF rules.</DocCard
                >
                <DocCard
                  title="Observe your application"
                  icon="pi pi-chart-line"
                  href="#"
                  >Read metrics and events in real time.</DocCard
                >
              </DocCardGroup>

              <DocHeading
                id="related-resources"
                :level="2"
                >Related resources</DocHeading
              >
              <FrameBox class="w-full bg-(--bg-surface)">
                <ItemList>
                  <DocItem
                    v-for="item in related"
                    :key="item.title"
                    :title="item.title"
                    :icon="item.icon"
                    href="#"
                    >{{ item.text }}</DocItem
                  >
                </ItemList>
              </FrameBox>
            </DocProse>
            <DocPagination
              :previous="{ title: 'Create an account', href: '#' }"
              :next="{ title: 'Migrate to Azion', href: '#' }"
            />
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

      <aside
        class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-lg) border-s border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex"
      >
        <DocOnThisPage
          :items="outline"
          :active-id="activeId"
          :groups="railGroups"
          @select="(event, item) => (activeId = item.id)"
        />
        <DocCta
          title="Ready to build?"
          primary-label="Start for free"
          primary-href="#"
          secondary-label="See our plans"
          secondary-href="#"
        >
          Deploy your first application in minutes.
        </DocCta>
      </aside>
    </div>
  </div>
</template>
```
