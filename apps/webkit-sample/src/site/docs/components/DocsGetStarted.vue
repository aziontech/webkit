<script setup>
  // "Get started with Azion" — the Azion documentation's landing content, built on the
  // same page logic as the Hub home so the two read as one system:
  //
  //   • BannerContainer + PageHeader — the fluid hero band, its border-b becoming the
  //     top edge of the column below it.
  //   • SectionContainer — the bordered content column (border-x owns the outer edges).
  //   • SectionModule — one band per section: a header row divided from its body by a
  //     hairline, and divided from the band above by its own border-t.
  //   • CardGrid variant="divider" — the boxes get their borders from the grid: 1px gaps
  //     reveal the wrapper's border colour as internal rules, and the perimeter carries
  //     none, so nothing doubles against the column's frame. Each cell fills
  //     bg-(--bg-canvas) so only the gaps show.
  //
  // Inside a cell the anatomy is the Hub's card, part for part: a bare glyph stacked
  // above the title and description, on the cell's own padding (see CELL_CLASS). The
  // `Item` — with its boxed icon media — stays for the trailing "next page" ROW, which
  // is a row and not a card.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Item from '@aziontech/webkit/item'
  import SplitButton from '@aziontech/webkit/split-button'
  import BannerContainer from '@shared/ui/layout/BannerContainer.vue'
  import CardGrid from '@shared/ui/layout/CardGrid.vue'
  import PageHeader from '@shared/ui/layout/PageHeader.vue'
  import SectionContainer from '@shared/ui/layout/SectionContainer.vue'
  import SectionModule from '@shared/ui/layout/SectionModule.vue'
  import { ref } from 'vue'

  const crumbs = [
    { label: 'Documentation', href: '#documentation' },
    { label: 'Get Started', href: '#get-started', current: true }
  ]

  // Hero: the two ways to hand this platform to a tool. `AI Prompt` is pasted into an
  // agent, `CLI` is pasted into a terminal — same job, two audiences, so they are two
  // tabs of one CodeBlock rather than two blocks.
  //
  // The prompt is hard-wrapped at ~64 columns on purpose: CodeBlock scrolls long lines
  // horizontally (correct for code), but this pane is prose meant to be read before it
  // is copied, and a reader should not have to scroll sideways to finish a sentence.
  // The one line that still overflows is the bare docs URL — it is a single unbreakable
  // token, and keeping it whole matters more for a prompt that gets pasted into an agent
  // than saving the reader one short sideways scroll.
  const AGENT_PROMPT = `Help me set up Azion in this project. Do the following:

1. Install the Azion CLI:
   curl -fsSL https://cli.azion.app/install.sh | bash
2. Connect the Azion MCP server (https://mcp.azion.com) so you
   can search current Azion docs — per-tool setup:
   https://www.azion.com/en/documentation/agent-setup/
3. Review the project and check whether it is already linked
   to Azion; if it is not, run azion link and follow the prompts.
4. Suggest the most relevant next steps.`

  const CLI_SNIPPET = `# Install the Azion CLI
curl -fsSL https://cli.azion.app/install.sh | bash

# Link this project to Azion and deploy it
azion link
azion deploy`

  const heroTabs = [
    { label: 'AI Prompt', value: 'ai-prompt', language: 'markdown', code: AGENT_PROMPT },
    { label: 'CLI', value: 'cli', language: 'bash', code: CLI_SNIPPET }
  ]

  const firstDeploy = [
    {
      title: 'Deploy a template via Console',
      description:
        'One-click start from ready-made projects: e-commerce, blogs, APIs, full-stack SSR.',
      icon: 'pi pi-th-large'
    },
    {
      title: 'Import a project from GitHub',
      description: 'Connect your repository and deploy an existing project.',
      icon: 'pi pi-github'
    },
    {
      title: 'Deploy with Azion CLI',
      description: 'Link a local project from your terminal with azion link.',
      icon: 'ai ai-azion-cli'
    }
  ]

  const paths = [
    {
      title: 'I’m evaluating Azion',
      description: 'See what you can build and how much effort the first success takes.',
      icon: 'pi pi-compass'
    },
    {
      title: 'I need to implement something specific',
      description: 'Browse how-to guides by product and by capability.',
      icon: 'pi pi-search'
    },
    {
      title: 'I operate Azion in production',
      description: 'Administer as code with the CLI and manage your account, teams, and billing.',
      icon: 'pi pi-cog'
    },
    {
      title: 'I’m comparing vendors',
      description:
        'Check what’s included in each plan and how real-world architectures look on Azion.',
      icon: 'pi pi-chart-line'
    }
  ]

  // Framework cards lead with the stack's own mark. The icon library ships 17 COLORED
  // marks (`ai-cor`); the frameworks it covers use them, and the rest fall back to
  // their monochrome mark so every card still shows its real logo.
  //
  // Astro is the exception: its colored mark is a WHITE logo with fixed fills, so it
  // vanishes on the light canvas. It takes the monochrome glyph, which inherits
  // currentColor and therefore reads in both themes.
  const frameworks = [
    { title: 'Angular', icon: 'ai-cor ai-angular' },
    { title: 'Astro', icon: 'ai ai-astro' },
    { title: 'Docusaurus', icon: 'ai ai-docusaurus' },
    { title: 'Eleventy', icon: 'ai ai-eleventy' },
    { title: 'Gatsby', icon: 'ai ai-gatsby' },
    { title: 'Hexo', icon: 'ai ai-hexo' },
    { title: 'Hono', icon: 'ai ai-hono' },
    { title: 'Hugo', icon: 'ai ai-hugo' },
    { title: 'Jekyll', icon: 'ai ai-jekyll' },
    { title: 'Next.js', icon: 'ai-cor ai-next' },
    { title: 'Nextal', icon: 'pi pi-box' },
    { title: 'React', icon: 'ai-cor ai-react' },
    { title: 'Svelte', icon: 'ai-cor ai-svelte' },
    { title: 'VitePress', icon: 'ai ai-vitepress' },
    { title: 'Vue', icon: 'ai-cor ai-vue' },
    { title: 'WebAssembly', icon: 'pi pi-code' }
  ]

  const afterDeploy = [
    {
      title: 'Go live with Azion',
      description: 'Point a custom domain to your application.',
      icon: 'ai ai-domains'
    },
    {
      title: 'Secure your application',
      description: 'Protect it with Firewall and WAF.',
      icon: 'ai ai-secure-pillar'
    },
    {
      title: 'Observe your application',
      description: 'Monitor metrics and events in real time.',
      icon: 'ai ai-observe-pillar'
    }
  ]

  // One recipe for every grid cell, so the four card bands cannot drift apart. The cell
  // fills the canvas so the divider grid's 1px gaps are the only lines that show, and
  // raises itself on focus so its ring is not clipped by a neighbouring cell.
  //
  // Anatomy is the Hub's card, not an `Item`: a BARE glyph stacked above the title, no
  // boxed icon square. The box is a console/list affordance — in a docs card it fought
  // the cell's own padding (the box's inset made the icon sit off the text's left edge,
  // and an inline media column pushed the copy off the p-xl grid the bands share).
  // Stacking glyph → title → description on one padding keeps every card in every band
  // on the same left edge and the same rhythm, and matches the Hub 1-to-1.
  // The spacing hangs off the TOP of each part (the description carries the gap above
  // it), so a card with no description — the framework cells — ends on its title with
  // no trailing margin, and its bottom padding is the same p-xl as its top.
  // "Also useful" — the band that closes a module: a hairline row under the grid with a
  // muted lead-in and the onward pages, dot-separated. One class and one data shape for
  // every section, so a band cannot drift from its neighbours.
  //
  // The links are anchors carrying the theme's `text-link` utility, not the Link
  // component: inline in a sentence they must inherit the band's own type (`text-link`
  // sets font-size/line-height to `inherit`, plus the link color, hover underline and
  // focus ring), where a Link would impose its own size.
  // The links are separated by SPACE, not by a dot bullet — one gap token does the
  // separating, and nothing decorative has to be kept in sync with the list.
  const LINKS_BAND_CLASS =
    'flex flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xxs) ' +
    'border-t border-(--border-default) p-(--spacing-xl) text-body-sm text-(--text-muted)'

  const alsoUseful = {
    firstDeploy: [
      { label: 'First deploy in a few minutes', href: '#first-deploy' },
      { label: 'Develop with Azion CLI', href: '#cli' },
      { label: 'Agent Setup', href: '#agent-setup' }
    ],
    paths: [
      { label: 'Accounts and billing', href: '#accounts' },
      { label: 'Architectures', href: '#architectures' }
    ],
    frameworks: [
      { label: 'Frameworks overview', href: '#frameworks' },
      { label: 'First deploy tutorial', href: '#first-deploy' }
    ],
    afterDeploy: [
      { label: 'Workloads', href: '#workloads' },
      { label: 'About WAF', href: '#waf' },
      { label: 'Real-Time Metrics', href: '#metrics' }
    ]
  }

  const GLYPH_CLASS = 'mb-(--spacing-md) text-heading-sm text-(--text-default)'
  const TITLE_CLASS = 'text-heading-xxs text-(--text-default)'
  const DESC_CLASS = 'mt-(--spacing-sm) text-pretty text-body-xxs text-(--text-muted)'

  const CELL_CLASS =
    'group/card relative flex h-full flex-col bg-(--bg-canvas) p-(--spacing-xl) ' +
    'no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) ' +
    'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
    'focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  // ── Page bar: "Copy page" + the LLM-context menu ────────────────────────────────
  // One SplitButton, because the control IS a split: the primary segment does the one
  // thing a reader wants most (the page as Markdown, on the clipboard) and the attached
  // menu carries the variants — the link, the raw markdown, and "ask <assistant> about
  // this page". SplitButton owns the joined segments, the overlay, and the keyboard
  // model, so the page only supplies the model and handles the choice.
  const PAGE_MARKDOWN =
    `# Welcome to Azion Docs\n\n` +
    `We make every application fast and reliable. Deploy your projects instantly on ` +
    `the most reliable global network, leverage enterprise-grade security, and scale ` +
    `from zero to peak without cold starts.\n\n` +
    `## Deploy your first application\n\n## Find your path\n\n` +
    `## Build with your framework\n\n## After the first deploy\n`

  const pageUrl = () => globalThis.location?.href ?? 'https://www.azion.com/en/documentation/'

  // What each assistant is handed: the page's URL plus what to do with it. Each entry
  // builds its own search URL, which is how the published docs' "open in" actions work.
  const ASK = () => `Read ${pageUrl()} and help me get started building on Azion.`

  const pageActions = [
    { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-file' },
    {
      value: 'google',
      label: 'Open in Google AI',
      icon: 'pi pi-external-link',
      url: () => `https://www.google.com/search?udm=50&q=${encodeURIComponent(ASK())}`
    },
    {
      value: 'perplexity',
      label: 'Open in Perplexity',
      icon: 'pi pi-external-link',
      url: () => `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK())}`
    },
    {
      value: 'claude',
      label: 'Open in Claude',
      icon: 'pi pi-external-link',
      url: () => `https://claude.ai/new?q=${encodeURIComponent(ASK())}`
    },
    {
      value: 'chatgpt',
      label: 'Open in ChatGPT',
      icon: 'pi pi-external-link',
      url: () => `https://chatgpt.com/?q=${encodeURIComponent(ASK())}`
    },
    {
      value: 'grok',
      label: 'Open in Grok',
      icon: 'pi pi-external-link',
      url: () => `https://grok.com/?q=${encodeURIComponent(ASK())}`
    }
  ]

  // The primary segment reports back on itself for two seconds — a clipboard write has
  // no other visible outcome, so without it the click looks like nothing happened.
  const copied = ref(false)
  const writeClipboard = async (text) => {
    // `writeText` rejects when the document is not focused (and in browsers that gate
    // the permission), which would otherwise surface as an unhandled rejection and skip
    // the confirmation entirely.
    try {
      await globalThis.navigator?.clipboard?.writeText(text)
    } catch {
      return
    }
    copied.value = true
    globalThis.setTimeout(() => (copied.value = false), 2000)
  }

  const copyPage = () => writeClipboard(PAGE_MARKDOWN)

  // SplitButton emits (event, item) — event first, per the event-payload convention.
  const onPageAction = (event, item) => {
    const action = pageActions.find((entry) => entry.value === item.value)
    if (!action) return

    if (action.url) {
      globalThis.open(action.url(), '_blank', 'noopener')
      return
    }

    if (action.value === 'link') {
      writeClipboard(pageUrl())
      return
    }

    // "View" really views it: the markdown is served to a new tab from a blob, so the
    // prototype needs no .md route to show the source of the page it is on.
    const blob = new globalThis.Blob([PAGE_MARKDOWN], { type: 'text/plain' })
    const url = globalThis.URL.createObjectURL(blob)
    globalThis.open(url, '_blank', 'noopener')
    globalThis.setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000)
  }
</script>

<template>
  <div>
    <!-- ══ Page bar ════════════════════════════════════════════════════════════
         Where the reader is (breadcrumb) and what they can do with this page (copy it,
         or hand it to an assistant), pinned for the whole scroll — the same job the
         console's tab bar does at the top of its content zone. Here it is `sticky`
         rather than a non-scrolling shell row, because both halves belong to the PAGE,
         not to the docs shell: the shell has no idea which crumbs this page has or what
         its markdown says.

         It is the first thing in the scroll region, so it is pinned from the start; its
         48px are folded into the hero's `--banner-offset` below so the hero underneath
         is still exactly one screen. -->
    <div
      class="sticky top-0 z-20 flex h-12 items-center gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) md:gap-(--spacing-md) md:px-(--spacing-xl)"
    >
      <!-- The trail wraps rather than truncates (BreadcrumbList is `flex-wrap`), and a
           two-line trail would double a bar that is pinned for the whole scroll. So the
           bar carries the full trail from `md` up and the current page alone below it —
           where the only ancestor is "Documentation", which the shell's own brand and
           the sheet already say. -->
      <Breadcrumb
        :items="crumbs"
        class="hidden min-w-0 flex-1 md:inline-flex"
      />
      <Breadcrumb
        :items="crumbs.slice(-1)"
        class="min-w-0 flex-1 md:hidden"
      />
      <SplitButton
        :label="copied ? 'Copied' : 'Copy page'"
        :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
        :model="pageActions"
        kind="outlined"
        size="small"
        class="shrink-0"
        @click="copyPage"
        @item-click="onPageAction"
      />
    </div>

    <!-- ══ Hero band ═══════════════════════════════════════════════════════════
         Full-bleed and exactly one screen tall: the band spans the whole content
         region while its copy keeps the 7xl column (1024px at a 1440 window, once the
         rail's 300px and the band's own p-xl are off), and `hero` centers that copy in
         `100dvh - --banner-offset` — the offset reading the docs top bar's and the page
         bar's own heights, so "one screen" means the region actually left for the hero.
         The reader gets the hero alone on load; everything below it goes back inside
         the container.

         Its border-b is the top edge of the framed column below, so the page frame
         still reads as one continuous border. -->
    <BannerContainer
      hero
      max-width="7xl"
      class="[--banner-offset:calc(var(--bar-height,3.5rem)+var(--page-bar-height,3rem))]"
    >
      <!-- No `#background`: the hero sits on plain canvas, the same as the Hub hero, so
           the two still read as one pattern. -->

      <!-- The docs card-grid geometry, on the tokens: one column that splits at `xl`
           (not `lg` — the 300px rail leaves a laptop's content region ~700px, where a
           half-width headline beside a half-width code block is two cramped columns
           instead of one readable stack), no `items-*` so the cells keep the grid's
           default stretch — which is what gives the code block's own `xl:self-center`
           an area to centre in (the block is the shorter of the two cells), and the
           `--spacing-xl` gutter, which reaches the 48px the reference asks for at `xl`
           and steps down to 32/24 on the narrower windows the reference never had.
           The margins are the same token, so `mt` and `mb` equalise from `lg` up and
           the band's vertical centering is preserved exactly where the two columns are.

           `min-w-0` on both cells: a grid item's default `min-width: auto` sizes the
           column to its content's min-content width, and the code block's longest line
           is wider than a phone — without it the whole hero column grows past the
           viewport and the headline stops wrapping. -->
      <div
        class="mt-(--spacing-xs) mb-(--spacing-xl) grid grid-cols-1 gap-(--spacing-xxl) lg:mt-(--spacing-xl) xl:grid-cols-2"
      >
        <PageHeader
          id="overview"
          class="min-w-0"
          margin-bottom=""
          size="hero"
          title="Build into the most reliable edge network"
          description="We make every application fast and reliable. Deploy your projects instantly on the most reliable global network, leverage enterprise-grade security, and scale from zero to peak without cold starts."
        >
          <!-- Below `sm` the three actions STACK, each full width: a phone column fits
               one of these labels per line anyway, and three ragged part-width buttons
               read as debris where one full-width stack reads as a list of three ways in.
               From `sm` up they are a wrapping row again — `flex-wrap` + `shrink-0`, so
               three long labels in a half-width hero column wrap to a second line
               instead of compressing until their text spills out of the button. -->
          <template #actions>
            <div
              class="flex flex-col items-stretch gap-(--spacing-md) sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Button
                label="First deploy"
                kind="primary"
                size="large"
                href="#first-deploy"
                class="w-full shrink-0 sm:w-auto"
              />
              <Button
                label="Create an account"
                kind="outlined"
                size="large"
                href="#create-account"
                class="w-full shrink-0 sm:w-auto"
              />
              <Button
                label="Platform overview"
                kind="outlined"
                size="large"
                href="#platform-overview"
                class="w-full shrink-0 sm:w-auto"
              />
            </div>
          </template>
        </PageHeader>

        <!-- The block is wrapped so the elevation is cast by a shell that matches its
             shape: CodeBlock rounds to --shape-elements and clips its own overflow, so
             the shadow goes on a wrapper at the same radius instead of being clipped
             away. --shadow-sm is the "inline surface at rest" step (see DESIGN.md §
             Shadows) — it lifts the block off the animated hero field without reading
             as a floating panel.

             `animate-lines` is CodeBlock's own staggered line entrance (opacity + an
             8px slide, with a motion-reduce fallback it ships), so the snippet arrives
             line by line with the hero rather than all at once.

             `my-[--spacing-lg]` is the reference's 1.5rem of vertical room around the
             block, on the token that carries that value from `sm` up (1rem below it).
             It reads on the stacked column, where the margin is real space between the
             actions and the block; from `xl` up `self-center` is what places it, and
             the margins only inset the area it centres in.

             `xl:self-center` is the alignment: the grid stretches its cells, so left
             alone the block would either fill the row or hang from its top edge. Centred
             in its area it keeps its natural height (275px against the headline column's
             422 at 1440) and sits on the column's optical middle, so neither edge is
             flush and the ragged one reads as deliberate. -->
        <div
          class="my-(--spacing-lg) min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm) xl:self-center"
        >
          <CodeBlock
            :tabs="heroTabs"
            default-value="ai-prompt"
            :show-line-numbers="false"
            animate-lines
            copy-aria-label="Copy setup prompt"
          />
        </div>
      </div>
    </BannerContainer>

    <!-- ══ Bordered content column ═════════════════════════════════════════════
         From the banner's bottom edge down, everything is in the container: one
         centered column, so the full-bleed hero is the only full-width band on the
         page. 4xl (1024px) rather than the hub's 6xl (1388px) because the rail eats
         ~300px of the window — a 6xl column only clears the content region above a
         ~1690px window, so it read as full width on a laptop and the container was
         invisible. border-x owns the outer edges; each module owns its own padding
         and its own top rule, so no line is ever drawn twice. -->
    <SectionContainer max-width="4xl">
      <!-- ── Deploy your first application ────────────────────────────────── -->
      <SectionModule
        id="deploy-your-first-application"
        :divided="false"
        :padded="false"
        title="Deploy your first application"
        description="Three doors, same destination: an application answering on its own Azion domain. Pick the one that matches how you work."
      >
        <CardGrid
          :columns="3"
          variant="divider"
        >
          <a
            v-for="card in firstDeploy"
            :key="card.title"
            href="#first-deploy"
            :class="CELL_CLASS"
          >
            <i
              :class="[card.icon, GLYPH_CLASS]"
              aria-hidden="true"
            />
            <span :class="TITLE_CLASS">{{ card.title }}</span>
            <span :class="DESC_CLASS">{{ card.description }}</span>
          </a>
        </CardGrid>

        <!-- "Also useful" band: same class, same shape, in every module (LINKS_BAND_CLASS). -->
        <div :class="LINKS_BAND_CLASS">
          Also useful:
          <a
            v-for="link in alsoUseful.firstDeploy"
            :key="link.label"
            :href="link.href"
            class="text-link"
            >{{ link.label }}</a
          >
        </div>
      </SectionModule>

      <!-- ── Find your path ───────────────────────────────────────────────── -->
      <SectionModule
        id="find-your-path"
        :padded="false"
        title="Find your path"
      >
        <CardGrid
          :columns="2"
          variant="divider"
        >
          <a
            v-for="card in paths"
            :key="card.title"
            href="#path"
            :class="CELL_CLASS"
          >
            <i
              :class="[card.icon, GLYPH_CLASS]"
              aria-hidden="true"
            />
            <span :class="TITLE_CLASS">{{ card.title }}</span>
            <span :class="DESC_CLASS">{{ card.description }}</span>
          </a>
        </CardGrid>

        <div :class="LINKS_BAND_CLASS">
          Also useful:
          <a
            v-for="link in alsoUseful.paths"
            :key="link.label"
            :href="link.href"
            class="text-link"
            >{{ link.label }}</a
          >
        </div>
      </SectionModule>

      <!-- ── Build with your framework ─────────────────────────────────────────
           Same band anatomy as every other section — header row over an edge-to-edge
           divider grid — so the frameworks read as cards in the same column, on the
           same padding, as the three bands above. 16 frameworks divides evenly by the
           grid's 2 / 2 / 4 columns, so no breakpoint ever leaves a ragged row of
           divider-coloured holes; the band's two onward destinations are LINKS in the
           closing "Also useful" row, not cards — they are not stacks to pick from.

           This is the one band that stays TWO-up on a phone (`mobile-columns`): its
           cells are a mark plus one word, so a single file of 16 would be a screen and
           a half of scrolling to say what two columns say in half the height. -->
      <SectionModule
        id="build-with-your-framework"
        :padded="false"
        title="Build with your framework"
        description="Ready-made build paths for the stack you already use."
      >
        <CardGrid
          :columns="4"
          :mobile-columns="2"
          variant="divider"
        >
          <a
            v-for="framework in frameworks"
            :key="framework.title"
            href="#framework"
            :class="CELL_CLASS"
          >
            <i
              :class="[framework.icon, GLYPH_CLASS]"
              aria-hidden="true"
            />
            <span :class="TITLE_CLASS">{{ framework.title }}</span>
          </a>
        </CardGrid>

        <div :class="LINKS_BAND_CLASS">
          Also useful:
          <a
            v-for="link in alsoUseful.frameworks"
            :key="link.label"
            :href="link.href"
            class="text-link"
            >{{ link.label }}</a
          >
        </div>
      </SectionModule>

      <!-- ── After the first deploy ────────────────────────────────────────── -->
      <SectionModule
        id="after-the-first-deploy"
        :padded="false"
        title="After the first deploy"
      >
        <CardGrid
          :columns="3"
          variant="divider"
        >
          <a
            v-for="card in afterDeploy"
            :key="card.title"
            href="#after"
            :class="CELL_CLASS"
          >
            <i
              :class="[card.icon, GLYPH_CLASS]"
              aria-hidden="true"
            />
            <span :class="TITLE_CLASS">{{ card.title }}</span>
            <span :class="DESC_CLASS">{{ card.description }}</span>
          </a>
        </CardGrid>

        <div :class="LINKS_BAND_CLASS">
          Also useful:
          <a
            v-for="link in alsoUseful.afterDeploy"
            :key="link.label"
            :href="link.href"
            class="text-link"
            >{{ link.label }}</a
          >
        </div>
      </SectionModule>

      <!-- ── Next page ────────────────────────────────────────────────────── -->
      <SectionModule :padded="false">
        <a
          href="#agent-setup"
          :class="CELL_CLASS"
        >
          <Item kind="inline">
            <Item.Content>
              <span class="text-body-sm text-(--text-muted)">Next Page · Start</span>
              <Item.Title class="mt-(--spacing-xxs) text-body-lg">Agent Setup</Item.Title>
            </Item.Content>
            <Item.Actions>
              <i
                class="pi pi-arrow-right text-(--text-muted) group-hover/card:text-(--text-default)"
                aria-hidden="true"
              />
            </Item.Actions>
          </Item>
        </a>
      </SectionModule>
    </SectionContainer>
  </div>
</template>
