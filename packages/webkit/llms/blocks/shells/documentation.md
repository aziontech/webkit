# Documentation (`shells/documentation`)

> The documentation shell is `DocLayout`, composed once around the app's router view, so every docs page is only its article. The layout owns the chrome and the DOCUMENT scrolls: a sticky docs header (the Azion Docs mark, the section links from `sections`, the search field that opens the ⌘K palette of every navigation page, and the `actions` slot with the GitHub `IconButton` and the Console `Button`), a sticky navigation rail from `lg` built from the `navigation` data (groups of rows with in-app `href`s followed with the router, inline subsections as `children`) with the `ThemeSwitcher` in its `navigation-footer` slot and a drawer opened from the header below `lg`, the article in the layout's single main landmark, the sticky On this page rail from `xl` (the `outline` headings, tracked as the reader scrolls, plus the GitHub and Community `outline-groups`) with a `DocCta` in its `aside` slot, and the `Footer` (`kind="content"`) in the `footer` slot under the article, between the two rails; the primary's footer carries the columns, social links, status and language, with the brand leading the social row from `lg` (signature `compact`) and moving to the signature band below it, in CSS. No page wraps its article in a scroll area or a full-height frame. The primary's article is a short guide (`DocPageHeader`, then `DocProse` with `DocHeading` sections whose ids match the outline). Three variants fill the article from the documentation parts only: Article is a tutorial (First deploy) with breadcrumb, last updated and meta actions, a `DocCardGroup` chooser of paths, `DocCallout` tips, `DocSteps` with `CodeBlock` commands, a `DocPrompt`, Next steps, Related resources as `DocItem` rows in a `FrameBox`, and `DocPagination`; Reference is a product reference page (an info callout, two actions, the request path as a `Diagram` in a `DocFrame`, a JSON `CodeBlock`, a term list); Landing is the documentation home with the navigation rail but no outline rail: a `DocHero` with `Get started` and the `CopyPromptButton`, a `DocAgentCard` above the Console, CLI and API `DocCard`s, objectives, ready-made templates in their brand colours, Stop attacks, compliance, Follow along and the pager forward.

- Surface: docs
- Source: `blocks/shells/documentation/documentation.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/documentation")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [CodeBlock](../../components/code-block.md), [CopyPromptButton](../../components/copy-prompt-button.md), [Diagram](../../components/diagram.md), [DocAgentCard](../../components/doc-agent-card.md), [DocCallout](../../components/doc-callout.md), [DocCard](../../components/doc-card.md), [DocCardGroup](../../components/doc-card-group.md), [DocCta](../../components/doc-cta.md), [DocFrame](../../components/doc-frame.md), [DocHeading](../../components/doc-heading.md), [DocHero](../../components/doc-hero.md), [DocItem](../../components/doc-item.md), [DocLayout](../../components/doc-layout.md), [DocPageHeader](../../components/doc-page-header.md), [DocPagination](../../components/doc-pagination.md), [DocPrompt](../../components/doc-prompt.md), [DocProse](../../components/doc-prose.md), [DocStep](../../components/doc-step.md), [DocSteps](../../components/doc-steps.md), [Footer](../../components/footer.md), [FrameBox](../../components/frame-box.md), [IconButton](../../components/icon-button.md), `ItemList`, [Select](../../components/select.md), [StatusIndicator](../../components/status-indicator.md), [ThemeSwitcher](../../components/theme-switcher.md)
- Skills: `webkit-layout`, `webkit-navigation`

## Asked as

docs shell; documentation layout; docs page layout; documentation site; docs sidebar; on this page outline; knowledge base layout; layout da documentação; página de documentação; estrutura da documentação; documentation shell; docs layout; documentation article; docs article page; tutorial page; getting started guide; how-to guide; product reference page; reference documentation; docs page with steps and code; documentation home; docs home page; docs landing page; developer portal home; artigo da documentação; página de tutorial; guia de primeiros passos; página de referência do produto; página inicial da documentação; home da documentação; docs home with copy prompt and AI agent logos; your AI agent fluent in Azion card; botão copiar prompt com logos de IA; docs layout component; DocLayout

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close. It is `DocLayout`, composed once in the app around `RouterView`: the layout owns the docs header, the navigation rail, the "On this page" rail, the search palette and the footer, and the document itself scrolls with the header and both rails sticky. Every docs page is only its article.

## When to use

- Every documentation, guide or reference page, and the docs home.

## When not to use

- Marketing pages: `shells/website`. Product pages: `shells/console`.

## Building blocks

### A. Layout — `DocLayout` (required)

Composed once around the router view. `navigation` is the docs tree as data (groups of rows with `id`, `label` and `href`; an inline subsection is a row with `children` and `defaultOpen`), `sections` the header's section links, `home` where the Azion Docs mark links, `outline` the article's headings (`{ id, text, depth }`) and `outline-groups` the GitHub and Community links under them. It renders the single main landmark, the rail from `lg` (a drawer below it), the outline from `xl`, and the ⌘K palette of every navigation page. In an app leave `active-id` empty so the current row follows the route; the preview has no router, so it passes the current row's id.

### B. Header actions — `IconButton` (required)

In the `actions` slot: GitHub, `kind="outlined"`, with an `ariaLabel`. In the footer, the small `transparent` social links.

### C. Console — `Button` (required)

`secondary`, last in the `actions` slot.

### D. Theme — `ThemeSwitcher` (required)

In the `navigation-footer` slot, labelled `Theme`; the layout shows it at the foot of the rail and of the drawer.

### E. Call to action — `DocCta` (optional)

In the `aside` slot, under the outline: "Ready to build?" with a primary and a secondary link.

### F. Masthead — `DocPageHeader` (required)

The first thing in the article: breadcrumb, title, deck, and on real pages the last-updated date and the meta actions.

### G. Running text — `DocProse` (required)

Everything under the masthead; it sets the running text and gives the headings their type scale.

### H. Section headings — `DocHeading` (required)

One per outline entry, with the same `id` the `outline` item carries: the layout tracks which heading is in view and scrolls a chosen entry under the sticky header.

### I. Footer — `Footer` (required)

In the `footer` slot, `kind="content"`, under a top rule: `Footer.Column` with `Footer.Link` items, then the social, status, language and brand slots. With `signature="compact"` the brand leads the social row from `lg` (`hidden lg:inline-flex`) and the signature band carries it below `lg`, in CSS.

### J. Brand — `Brand` (required)

In the footer only; the header mark belongs to the layout.

### K. System status — `StatusIndicator` (required)

In the footer's status slot.

### L. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Compose `DocLayout` once in the app's root around `RouterView`; each route renders only its `<article>`.
- For a real page, start from a variant (Article, Reference, Landing): the variants build the article from the `Doc*` parts only.
- Give every `DocHeading` an `id` and pass the same ids, in document order, as `outline`.
- Put everything under `DocPageHeader` in one `DocProse`.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router); keep the rail scoped to the current product; the header section links switch products.
- Build a docs home from the Landing variant: `DocHero` with `CopyPromptButton`, then `DocAgentCard` above the Console / CLI / API cards; pass no `outline`.
- Write the deck as the outcome (`By the end of this tutorial, …`), one action per `DocStep`, with its command as a `CodeBlock` inside the same step.

## Don't

- Don't put a `ScrollArea`, an `h-screen` frame or any inner scroll region around the article: the document scrolls, so find in page, scroll restoration and full-page captures work.
- Don't render a `<main>` in a page; the layout already renders the only one.
- Don't repeat the header, the search, the navigation rail, the outline or the footer in a page.
- Don't hand-write the outline, the pager or the masthead; the layout's outline rail, `DocPagination` and `DocPageHeader` own their markup and labels.
- Don't give a `DocHeading` an id the `outline` does not list, or list an id no heading carries.
- Don't put a `DocHeading` outside `DocProse` (it renders at body size), and don't drop a `Button` row straight into `DocProse`: wrap it in an element with `data-doc-chrome`.
- Don't measure the viewport in script to place the footer brand; the `lg:` utilities and `signature="compact"` decide it in CSS.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Navigation rows:** page titles exactly as the `h1` reads.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`
- **Landing groups:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`; card link labels are a verb and the object (`Install the CLI`).

## Accessibility

- One main landmark: the layout's. The article is an `<article>` inside it, never a second `<main>`.
- One `h1` per article (the masthead or the hero); `DocHeading` levels follow it in order (2, then 3 under a 2), and outline entries target those ids.
- Landmarks: the header is a banner, the rail and the outline are labelled navigation regions, the footer is contentinfo; `Tab` runs header → rail → article → outline → footer.
- Choosing an outline entry moves focus to its heading and clears the sticky header.

## States

- Default: the chrome around a short guide; rail from `lg` (drawer below), outline with the GitHub and Community groups and the `DocCta` from `xl`, the full footer under the article.
- Article: a tutorial page from the `Doc*` parts, pager in both directions, outline with an indented level 3 entry.
- Reference: a product reference page with a callout, the request-path diagram, a JSON rule and a term list; pager forward only.
- Landing: the documentation home; navigation rail, no outline rail, `DocHero` with `CopyPromptButton`, `DocAgentCard`, entry-point grids, pager forward to the first page.

## Related

- `DocLayout` — the component this block shows.
- `headers/docs-header` — the header on its own.
- `shells/console` (`ConsoleLayout`) and `shells/website` (`SiteLayout`) — the console and marketing counterparts.

## Variants

- `Default` — primary (the code below)
- `Article` — A tutorial page inside DocLayout: masthead with breadcrumb and meta actions, a chooser of paths, callouts, steps with commands, an agent prompt, Next steps, Related resources and the pager; the outline tracks its DocHeading ids, with the GitHub and Community groups and a DocCta under it.
- `Reference` — A product reference page inside DocLayout: an info callout, two actions, the request path as a Diagram in a DocFrame, a JSON CodeBlock, a term list and a two-column Next steps; the outline tracks its four sections, with a DocCta under it.
- `Landing` — The documentation home inside DocLayout, with the navigation rail and no outline rail: a DocHero with Get started and the CopyPromptButton (agent marks) and its note, then a DocAgentCard above the Console, CLI and API cards, then objectives, coloured framework templates, Stop attacks, compliance, Follow along and the pager forward.

Each variant is the same screen in another state: `get_pattern("shells/documentation", { variant })`, or the file under `blocks/shells/documentation/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Functions',
      items: [
        { id: 'functions-overview', label: 'Overview', href: '/docs/functions' },
        {
          id: 'functions-getting-started',
          label: 'Getting started',
          href: '/docs/functions/getting-started'
        },
        {
          id: 'functions-how-it-works',
          label: 'How it works',
          href: '/docs/functions/how-it-works'
        },
        { id: 'functions-examples', label: 'Examples', href: '/docs/functions/examples' },
        { id: 'functions-reference', label: 'Reference', href: '/docs/functions/reference' },
        { id: 'functions-limits', label: 'Limits', href: '/docs/functions/limits' },
        {
          id: 'functions-best-practices',
          label: 'Best practices',
          href: '/docs/functions/best-practices'
        },
        {
          id: 'functions-troubleshooting',
          label: 'Troubleshooting',
          href: '/docs/functions/troubleshooting'
        }
      ]
    }
  ]

  const crumbs = [{ label: 'Functions', href: '/docs/functions' }, { label: 'Getting started' }]

  const outline = [
    { id: 'prerequisites', text: 'Prerequisites', depth: 2 },
    { id: 'create-the-function', text: 'Create the function', depth: 2 },
    { id: 'instantiate-the-function', text: 'Instantiate it in your application', depth: 2 },
    { id: 'verify-the-response', text: 'Verify the response', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 }
  ]

  const outlineGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'pi pi-github' },
        {
          label: 'Contribute to this page',
          href: 'https://github.com/aziontech/azion',
          icon: 'pi pi-pencil'
        }
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

  const theme = ref<ThemeSwitcherValue>('dark')

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
</script>

<template>
  <DocLayout
    :navigation="navigation"
    active-id="functions-getting-started"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
    >
      <DocPageHeader
        title="Getting started"
        description="Create a function, instantiate it in an application, and verify the response from the edge."
        :breadcrumb="crumbs"
      />
      <DocProse>
        <DocHeading
          id="prerequisites"
          :level="2"
          >Prerequisites</DocHeading
        >
        <p>An Azion account and an application that already answers on its Azion domain.</p>
        <DocHeading
          id="create-the-function"
          :level="2"
          >Create the function</DocHeading
        >
        <p>
          Open Functions in the console, select Create Function, paste the handler below and save
          it.
        </p>
        <DocHeading
          id="instantiate-the-function"
          :level="2"
          >Instantiate it in your application</DocHeading
        >
        <p>
          On the application's Functions tab, add an instance pointing at the function you just
          created.
        </p>
        <DocHeading
          id="verify-the-response"
          :level="2"
          >Verify the response</DocHeading
        >
        <p>Request the domain and read the header the function sets.</p>
        <DocHeading
          id="next-steps"
          :level="2"
          >Next steps</DocHeading
        >
        <p>Read the limits before you move a production route onto the function.</p>
      </DocProse>
    </article>

    <template #actions>
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
        href="https://console.azion.com"
      />
    </template>

    <template #navigation-footer>
      <ThemeSwitcher
        v-model="theme"
        aria-label="Theme"
      />
    </template>

    <template #aside>
      <DocCta
        title="Ready to build?"
        primary-label="Start for free"
        primary-href="https://console.azion.com/signup"
        secondary-label="See our plans"
        secondary-href="https://www.azion.com/en/pricing/"
      >
        Deploy your first application in minutes.
      </DocCta>
    </template>

    <template #footer>
      <div class="w-full border-t border-(--border-default)">
        <Footer
          kind="content"
          signature="compact"
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
              href="/"
              aria-label="Azion home"
              class="me-(--spacing-xs) hidden w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none lg:inline-flex"
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

          <template #brand>
            <a
              href="/"
              aria-label="Azion home"
              class="mx-auto inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              <Brand size="small" />
            </a>
          </template>
        </Footer>
      </div>
    </template>
  </DocLayout>
</template>
```
