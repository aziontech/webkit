# ShellDocs (`shell/shell-docs`)

> The documentation shell is `DocLayout`, composed once around the app's router view: this block's primary is the app's `App.vue` and every variant is a page body (an `<article>` only, with no header, rail, outline or footer of its own) that renders inside it. The layout owns the chrome and the DOCUMENT scrolls: a sticky docs header (the Azion ShellDocs mark, the section links from `sections`, the search field that opens the ⌘K palette of every navigation page, and the `actions` slot with the GitHub `IconButton` and the Console `Button`), a sticky navigation rail from `lg` built from the `navigation` data (groups of rows with in-app `href`s followed with the router, inline subsections as `children`, the current row following the route) with the `ThemeSwitcher` in its `navigation-footer` slot and a drawer opened from the header below `lg`, the page in the layout's single main landmark, the sticky On this page rail from `xl` filled by the page itself (every `DocHeading` with an `anchor` at level 2 or 3 registers with the layout, in document order, and is tracked as the reader scrolls), the GitHub and Community `outline-groups` and a `DocCallToAction` in its `aside` slot (both shown only on pages with an outline), and the `Footer` (`variant="content"`) in the `footer` slot under the article, between the two rails; the primary's footer carries the columns, then one bottom bar with the brand and the social links at the start and the status and language at the end, stacked below `md`, in CSS. No page wraps its article in a scroll area, a full-height frame or a layout of its own. The primary's stand-in page, in its default slot, is a short guide (`DocPageHeader`, then `DocProse` with anchored `DocHeading` sections); replace it with `<RouterView />`. Five variants are page bodies built from the documentation parts only: Article is a tutorial (First deploy) with breadcrumb, last updated and meta actions, a `DocCardGroup` chooser of paths, `DocCallout` tips, `DocSteps` with `CodeBlock` commands, a `DocPrompt`, Next steps, Related resources as `DocItem` rows in a `RegistrationFrame`, and `DocPreviousNext`; Reference is a product reference page (an info callout, two actions, the request path as a `Diagram` in a `DocFrame`, a JSON `CodeBlock`, a term list); Landing is the documentation home, whose headings carry no anchor so no outline rail shows: a `DocHero` with `Get started` and the `CopyPromptButton`, a `DocAgentCard` above the Console, CLI and API `DocCard`s, objectives, ready-made templates in their brand colours, Stop attacks, compliance, Follow along and the pager forward; AgentSetup is the index of agent setup pages: a `Tabs` picker filtering `DocCard`s of coding agents by workflow, a comparison `DataTable` with check marks and `Tag`s, a legend `DocCallout` and a glossary of `DocCard` grids; AgentGuide is one agent's setup page: a masthead with the agent mark, fact `Tag`s and links, `DocSteps` with `DocCodeGroup` commands and `DocMarkdown` bodies, the MCP tools `DataTable`, CLI and context-file code, `DocItem` rows, `DocPrompt`s, tip callouts, FAQ and troubleshooting `DocAccordionGroup`s and the other agents grid.

- Surface: docs
- Source: `blocks/shell/shell-docs/shell-docs.vue` in `@aziontech/webkit`
- MCP: `get_block("shell/shell-docs")`
- Components: `claudeMark`, `codexMark`, `copilotMark`, `cursorMark`, `geminiMark`, `opencodeMark`, [Brand](../../components/brand.md), [Button](../../components/button.md), [CodeBlock](../../components/code-block.md), [CopyPromptButton](../../components/copy-prompt-button.md), [DataTable](../../components/data-table.md), [Diagram](../../components/diagram.md), [DocAccordion](../../components/doc-accordion.md), [DocAccordionGroup](../../components/doc-accordion-group.md), [DocAgentCard](../../components/doc-agent-card.md), [DocCallToAction](../../components/doc-call-to-action.md), [DocCallout](../../components/doc-callout.md), [DocCard](../../components/doc-card.md), [DocCardGroup](../../components/doc-card-group.md), [DocCodeGroup](../../components/doc-code-group.md), [DocFrame](../../components/doc-frame.md), [DocHeading](../../components/doc-heading.md), [DocHero](../../components/doc-hero.md), [DocItem](../../components/doc-item.md), [DocLayout](../../components/doc-layout.md), [DocMarkdown](../../components/doc-markdown.md), [DocPageHeader](../../components/doc-page-header.md), [DocPreviousNext](../../components/doc-previous-next.md), [DocPrompt](../../components/doc-prompt.md), [DocProse](../../components/doc-prose.md), [DocSteps](../../components/doc-steps.md), [Footer](../../components/footer.md), [IconButton](../../components/icon-button.md), `ItemList`, [RegistrationFrame](../../components/registration-frame.md), [Select](../../components/select.md), [StatusIndicator](../../components/status-indicator.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [ThemeSwitcher](../../components/theme-switcher.md), [ThirdPartyLogo](../../components/third-party-logo.md), `use-color-mode`
- Skills: `webkit-layout`, `webkit-navigation`

## Asked as

docs shell; documentation layout; docs page layout; documentation site; docs sidebar; on this page outline; knowledge base layout; layout da documentação; página de documentação; estrutura da documentação; documentation shell; docs layout; documentation article; docs article page; tutorial page; getting started guide; how-to guide; product reference page; reference documentation; docs page with steps and code; documentation home; docs home page; docs landing page; developer portal home; artigo da documentação; página de tutorial; guia de primeiros passos; página de referência do produto; página inicial da documentação; home da documentação; docs home with copy prompt and AI agent logos; your AI agent fluent in Azion card; botão copiar prompt com logos de IA; docs layout component; DocLayout; agent setup page; coding agent setup; mcp setup guide; AI agent comparison table; configurar agente de IA; página de configuração do agente; agent setup index; connect an AI agent to the docs; docs page body; documentation page body; docs outline from headings

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close. It is `DocLayout`, composed once in the app around `RouterView`: the layout owns the docs header, the navigation rail, the "On this page" rail, the search palette and the footer, and the document itself scrolls with the header and both rails sticky. This block's primary is that `App.vue`; every variant is a page body, only its `<article>`, rendered in the layout's default slot. A page feeds the outline by rendering its section headings as anchored `DocHeading`s: each one registers with the layout, so the app passes nothing per page.

## When to use

- Every documentation, guide or reference page, and the docs home.

## When not to use

- Marketing pages: `shell/shell-site`. Product pages: `shell/shell-console`.

## Building blocks

### A. Layout — `DocLayout` (required)

Composed once around the router view: copy the primary as `App.vue` and replace the stand-in guide in its `<slot>` with `<RouterView />`. `navigation` is the docs tree as data (groups of rows with `id`, `label` and `href`; an inline subsection is a row with `children` and `defaultOpen`), `sections` the header's section links, `home` where the Azion ShellDocs mark links, and `outline-groups` the GitHub and Community links under the outline. The outline itself comes from the page: every anchored level 2 or 3 `DocHeading` (and every `DocChangelogEntry`) registers with the layout, in document order. It renders the single main landmark, the rail from `lg` (a drawer below it), the outline from `xl` on pages that have one, and the ⌘K palette of every navigation page. Leave `active-id` empty so the current row follows the route. A site whose products each have their own tree picks `navigation` in `App.vue` from the route (a computed over the path), never in the page.

### B. Header actions — `IconButton` (required)

In the `actions` slot: GitHub, `variant="outline"`, with an `ariaLabel`. In the footer, the small `ghost` social links.

### C. Console — `Button` (required)

`secondary`, last in the `actions` slot.

### D. Theme — `ThemeSwitcher` (required)

In the `navigation-footer` slot, labelled `Theme`; the layout shows it at the foot of the rail and of the drawer.

### E. Call to action — `DocCallToAction` (optional)

In the `aside` slot, under the outline: "Ready to build?" with a primary and a secondary link. It shows only on pages with an outline, so the one shared call to action never lands on the docs home.

### F. Masthead — `DocPageHeader` (required)

The first thing in the article: breadcrumb, title, deck, and on real pages the last-updated date and the meta actions.

### G. Running text — `DocProse` (required)

Everything under the masthead; it sets the running text and gives the headings their type scale.

### H. Section headings — `DocHeading` (required)

One per section, with an `anchor`: an anchored level 2 or 3 heading is an outline entry, named by its own text, so the outline can never list a missing heading. The layout tracks which heading is in view and scrolls a chosen entry under the sticky header. A heading without `anchor` stays out of the outline.

### I. Footer — `Footer` (required)

In the `footer` slot, `variant="content"`, under a top rule: `Footer.Column` with `Footer.Link` items, then the brand, social, status and language slots. The footer lays the bottom bar out as one row (the brand and the social icons at the start, the status and the language at the end) and stacks it below `md`, in CSS.

### J. Brand — `Brand` (required)

In the footer only; the header mark belongs to the layout.

### K. System status — `StatusIndicator` (required)

In the footer's status slot.

### L. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Compose `DocLayout` once in the app's root around `RouterView` (the primary); each route renders only its `<article>`.
- For a real page, start from a variant (Article, Reference, Landing, AgentSetup, AgentGuide): each is a page body built from the `Doc*` parts only, with no layout of its own. `webkit add shell/shell-docs --variant Article` copies the shell and the page side by side; keep the shell as `App.vue` and route to the page.
- Give every section `DocHeading` an `anchor`; the layout lists those headings as the outline.
- Put everything under `DocPageHeader` in one `DocProse`.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router); keep the rail scoped to the current product; the header section links switch products.
- Build a docs home from the Landing variant: `DocHero` with `CopyPromptButton`, then `DocAgentCard` above the Console / CLI / API cards; its headings carry no `anchor`, so the page shows no outline rail.
- Build an index of peers (agents, SDKs, integrations) from AgentSetup: pick (a `Tabs` filter over a `DocCardGroup`, with `data-doc-block` on `Tabs` inside `DocProse`), compare (a `Table`), understand (glossary `DocCard`s). Give each peer its own page from AgentGuide.
- Render copy authored as Markdown with MDX tags (a content file, a CMS field, a sentence in data) with `DocMarkdown` inside `DocProse`; the headings it renders are `DocHeading`s with slug ids and join the outline on their own. AgentGuide uses it for its step bodies and accordion answers.
- Show a comparison of peers or a list of tools as a `DataTable` (`bordered`, imported from `data-table`) inside an element with `data-doc-block data-doc-chrome`, so the prose rules stay off it; a yes/no cell is a check or minus glyph with a visually hidden `Yes` / `No`, a category cell a `Tag` with `severity="neutral"`.
- Write the deck as the outcome (`By the end of this tutorial, …`), one action per `DocSteps.Step`, with its command as a `CodeBlock` inside the same step.

## Don't

- Don't put a `ScrollArea`, an `h-screen` frame or any inner scroll region around the article: the document scrolls, so find in page, scroll restoration and full-page captures work.
- Don't render a `<main>` in a page; the layout already renders the only one.
- Don't render `DocLayout` in a page, and don't repeat the header, the search, the navigation rail, the outline or the footer there.
- Don't hand-write the outline, the pager or the masthead; the layout's outline rail (fed by the anchored headings), `DocPreviousNext` and `DocPageHeader` own their markup and labels.
- Don't pass page data up to the layout through route meta or props: the page's headings register on their own.
- Don't put a `DocHeading` outside `DocProse` (it renders at body size), and don't drop a `Button` row straight into `DocProse`: wrap it in an element with `data-doc-chrome`.
- Don't measure the viewport in script to place the footer brand; put it in the `brand` slot and the footer places it in CSS.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Navigation rows:** page titles exactly as the `h1` reads.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`
- **Landing groups:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`; card link labels are a verb and the object (`Install the CLI`).

## Accessibility

- A comparison table's yes/no glyphs are `aria-hidden` with a visually hidden `Yes` / `No` beside them; the agent name cell is a link with the mark `aria-hidden`.
- One main landmark: the layout's. The article is an `<article>` inside it, never a second `<main>`.
- One `h1` per article (the masthead or the hero); `DocHeading` levels follow it in order (2, then 3 under a 2), and outline entries target those ids.
- Landmarks: the header is a banner, the rail and the outline are labelled navigation regions, the footer is contentinfo; `Tab` runs header → rail → article → outline → footer.
- Choosing an outline entry moves focus to its heading and clears the sticky header.

## States

- Default: the chrome (the app's `App.vue`) around a stand-in guide; rail from `lg` (drawer below), outline from the guide's headings with the GitHub and Community groups and the `DocCallToAction` from `xl`, the full footer under the article. The preview renders every variant inside it.
- Article: a tutorial page body from the `Doc*` parts, pager in both directions, outline with an indented level 3 entry.
- Reference: a product reference page with a callout, the request-path diagram, a JSON rule and a term list; pager forward only.
- AgentSetup: an index page; the picker tabs filter the agent cards, the comparison table scrolls inside its frame on a narrow page, the outline indents its three level 3 entries.
- AgentGuide: one agent's page; steps with code, the tools table, prompts, accordions collapsed by default, pager in both directions.
- Landing: the documentation home page body; navigation rail, no outline rail (unanchored headings), `DocHero` with `CopyPromptButton`, `DocAgentCard`, entry-point grids, pager forward to the first page.

## Related

- `DocLayout` — the component this block shows.
- `shell/shell-console` (`ConsoleLayout`) and `shell/shell-site` (`SiteLayout`) — the console and marketing counterparts.

## Variants

- `Default` — primary (the code below)
- `Article` — A tutorial page body for the docs layout: masthead with breadcrumb and meta actions, a chooser of paths, callouts, steps with commands, an agent prompt, Next steps, Related resources and the pager; its anchored DocHeadings fill the layout's outline, with the GitHub and Community groups and a DocCallToAction under it.
- `Reference` — A product reference page body for the docs layout: an info callout, two actions, the request path as a Diagram in a DocFrame, a JSON CodeBlock, a term list and a two-column Next steps; its four anchored sections fill the layout's outline.
- `Landing` — The documentation home as a page body for the docs layout, with no outline (its headings carry no anchor): a DocHero with Get started and the CopyPromptButton (agent marks) and its note, then a DocAgentCard above the Console, CLI and API cards, then objectives, coloured framework templates, Stop attacks, compliance, Follow along and the pager forward.
- `AgentSetup` — The index of agent setup pages as a page body for the docs layout: a Tabs picker that filters the coding-agent DocCards by workflow, a comparison Table with check marks and Tags, a legend DocCallout, and Workflow, Key concepts and Common tradeoffs DocCard grids; its h2 and h3 sections fill the layout's outline.
- `AgentGuide` — One agent's setup page as a page body for the docs layout: a masthead with the agent mark, fact Tags and links, Quick start DocSteps with DocCodeGroup commands and DocMarkdown bodies, the MCP tools Table, CLI and CLAUDE.md code, agent-friendly DocItem rows, DocPrompts, tip callouts, FAQ and Troubleshooting DocAccordionGroups and the Other agents grid.

Each variant is the same screen in another state: `get_block("shell/shell-docs", { variant })`, or the file under `blocks/shell/shell-docs/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocCallToAction from '@aziontech/webkit/doc-call-to-action'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'
  import { ref } from 'vue'

  defineSlots<{
    /** The page body: the route's article; the sample guide stands in for RouterView. */
    default(): unknown
  }>()

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Get started',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        {
          id: 'get-started',
          label: 'Get started',
          type: 'inline',
          defaultOpen: true,
          children: [
            {
              id: 'create-an-account',
              label: 'Create an account',
              href: '/docs/get-started/create-an-account'
            },
            { id: 'first-deploy', label: 'First deploy', href: '/docs/get-started/first-deploy' }
          ]
        }
      ]
    },
    {
      label: 'Functions',
      items: [
        { id: 'functions-overview', label: 'Overview', href: '/docs/functions' },
        {
          id: 'functions-getting-started',
          label: 'Getting started',
          href: '/docs/functions/getting-started'
        },
        { id: 'functions-limits', label: 'Limits', href: '/docs/functions/limits' }
      ]
    },
    {
      label: 'Applications',
      items: [
        { id: 'applications-overview', label: 'Overview', href: '/docs/applications' },
        { id: 'applications-cache', label: 'Cache', href: '/docs/applications/cache' }
      ]
    },
    {
      label: 'Dev tools',
      items: [
        { id: 'azion-cli', label: 'Azion CLI', href: '/docs/dev-tools/cli' },
        {
          id: 'agent-setup-group',
          label: 'Agent setup',
          type: 'inline',
          defaultOpen: true,
          children: [
            { id: 'agent-setup', label: 'Overview', href: '/docs/agent-setup' },
            { id: 'claude-code', label: 'Claude Code', href: '/docs/agent-setup/claude-code' }
          ]
        }
      ]
    }
  ]

  const crumbs = [{ label: 'Functions', href: '/docs/functions' }, { label: 'Getting started' }]

  const outlineGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion ShellDocs', href: 'https://github.com/aziontech', icon: 'az az-github' },
        {
          label: 'Contribute to this page',
          href: 'https://github.com/aziontech/azion',
          icon: 'az az-pencil'
        }
      ]
    },
    {
      label: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/azion', icon: 'az az-discord' },
        { label: 'X', href: 'https://x.com/aziontech', icon: 'az az-x-brand' }
      ]
    }
  ]

  const { mode: theme } = useColorMode()

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
      links: ['ShellDocs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
  ]

  const socials = [
    { icon: 'az az-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'az az-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'az az-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    { icon: 'az az-x-brand', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'az az-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'az az-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'az az-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
  const language = ref('EN')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :sections="sections"
    home="/docs"
    :outline-groups="outlineGroups"
  >
    <slot>
      <article
        class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
      >
        <DocPageHeader
          title="Getting started"
          description="Create a function, instantiate it in an application, and verify the response from the edge."
          :breadcrumbs="crumbs"
        />
        <DocProse>
          <DocHeading
            anchor="prerequisites"
            :level="2"
            >Prerequisites</DocHeading
          >
          <p>An Azion account and an application that already answers on its Azion domain.</p>
          <DocHeading
            anchor="create-the-function"
            :level="2"
            >Create the function</DocHeading
          >
          <p>
            Open Functions in the console, select Create Function, paste the handler below and save
            it.
          </p>
          <DocHeading
            anchor="instantiate-the-function"
            :level="2"
            >Instantiate it in your application</DocHeading
          >
          <p>
            On the application's Functions tab, add an instance pointing at the function you just
            created.
          </p>
          <DocHeading
            anchor="verify-the-response"
            :level="2"
            >Verify the response</DocHeading
          >
          <p>Request the domain and read the header the function sets.</p>
          <DocHeading
            anchor="next-steps"
            :level="2"
            >Next steps</DocHeading
          >
          <p>Read the limits before you move a production route onto the function.</p>
        </DocProse>
      </article>
    </slot>

    <template #actions>
      <IconButton
        icon="az az-github"
        variant="outline"
        size="medium"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
        class="shrink-0"
      />
      <Button
        label="Console"
        variant="secondary"
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
      <DocCallToAction
        title="Ready to build?"
        :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
        :secondary-action="{ label: 'See our plans', href: 'https://www.azion.com/en/pricing/' }"
      >
        Deploy your first application in minutes.
      </DocCallToAction>
    </template>

    <template #footer>
      <div class="w-full border-t border-(--border-default)">
        <Footer
          variant="content"
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
            <IconButton
              v-for="social in socials"
              :key="social.label"
              variant="ghost"
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
                  <template #leading>
                    <i
                      class="az az-globe text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </template>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item
                    v-for="option in languages"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
          </template>

          <template #brand>
            <a
              href="/"
              aria-label="Azion home"
              class="inline-flex w-fit items-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
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
