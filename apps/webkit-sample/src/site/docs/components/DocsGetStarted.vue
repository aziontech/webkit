<script setup>
  // The Azion documentation HOME — the content of www.azion.com/en/documentation/.
  //
  // IT IS A READING PAGE WITH A BANNER ON TOP, and that is the whole design. The home
  // used to be built the Hub way — a framed column (`SectionContainer`'s border-x) of
  // banded modules (`SectionModule`'s header rules) — which meant the front door of the
  // documentation drew a frame no page behind it draws, so the chrome changed under a
  // reader the moment they followed their first link. Now the body is the same three
  // lines every other docs page opens with (`layout-column-docs` + the inline boundary
  // + `DocProse`), and the BANNER is the only thing the home does differently.
  //
  // So the page's sections are prose sections, not bands: an anchored `DocHeading` h2
  // opens one, a lead paragraph says what it is for, and `DocCardGroup` frames its set
  // of cards. Those cards are the docs layer's own (`DocCard`) — the same components an
  // `.mdx` page gets from a `<CardGroup>` — so the home's grids and a tutorial's cannot
  // drift, and each card's closing call-to-action is its `link` prop rather than markup
  // typed here: the layer decides the glyph (a chevron inside the docs, the diagonal
  // arrow when the destination leaves them) and animates it.
  //
  // The onward links that used to close each band as a ruled row are plain sentences
  // now, for the same reason: a muted row under a hairline is a band's footer, and there
  // are no bands. The trailing "next page" row is `DocPagination`, the same pair that
  // closes every reading page — with only its `next` half filled, since the home has no
  // previous.
  //
  // The page bar (breadcrumb + Copy page) is not here either: it goes to the shell's
  // `page-bar` slot from the VIEW, exactly as the two reading pages hand theirs over —
  // see AzionDocs.vue. Its 48px are still folded into the hero's `--banner-offset`, so
  // the banner is exactly one screen.
  //
  // The page's six sections are the live docs home's own, in its order: start by
  // objective, start by interface, ready-made templates, stop attacks, assess risk and
  // prove compliance, follow along.
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocCard from '@aziontech/webkit-docs/doc-card'
  import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'
  import DocHeading from '@aziontech/webkit-docs/doc-heading'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import ContrastBanner from '@shared/ui/ContrastBanner.vue'
  import BannerContainer from '@shared/ui/layout/BannerContainer.vue'
  import PageHeader from '@shared/ui/layout/PageHeader.vue'

  // Hero: the two ways to hand this platform to a tool. `AI Prompt` is pasted into an
  // agent, `CLI` is pasted into a terminal — same job, two audiences, so they are two
  // tabs of one CodeBlock rather than two blocks. It is the hero's own rendition of the
  // live page's "Copy prompt" button: same prompt, shown before it is copied.
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

  // ── Start by objective ───────────────────────────────────────────────────────────
  // Four jobs, not four products: the reader arrives knowing what they want done, so
  // the first band is phrased as the doing. Four cards at two columns divide evenly at
  // every width, so no card needs a span.
  const objectives = [
    {
      title: 'Build your application',
      description: 'Go live from a template, a repo, or the CLI.',
      icon: 'ai ai-build-pillar',
      href: '/site/docs/first-deploy'
    },
    {
      title: 'Accelerate your application',
      description: 'Cache at the edge so your origin stops repeating itself.',
      icon: 'pi pi-gauge',
      href: '#cache-settings'
    },
    {
      title: 'Secure your application',
      description: 'A firewall in front, with a block rule you can verify.',
      icon: 'ai ai-secure-pillar',
      href: '#firewall-quickstart'
    },
    {
      title: 'Execute AI inference',
      description: 'A hosted model behind an OpenAI-compatible endpoint.',
      icon: 'ai ai-ai-pillar',
      href: '#ai-inference'
    }
  ]

  // ── Start by interface ───────────────────────────────────────────────────────────
  // The three surfaces the platform is driven through. Each card closes on its own CTA
  // line, passed as `DocCard`'s `link` prop — the layer renders the row, picks the glyph
  // (chevron here; these three stay inside the docs) and animates it, so the page never
  // hand-composes a link inside a card that is already a link.
  //
  // `span` fills the ragged row: three cards over the `sm` two-column grid leave one
  // hole, and an empty track in a `gap-px` grid shows the rule colour across its whole
  // face. The third card spans both columns there and goes back to one at `lg`.
  const interfaces = [
    {
      title: 'Platform',
      description:
        'Configure it visually in Azion Console: applications, firewall rules, metrics, and events.',
      cta: 'Open the Console',
      icon: 'ai ai-azion',
      href: '#console'
    },
    {
      title: 'CLI',
      description:
        'Stay in the terminal: link a project, run it locally, and deploy with a single binary.',
      cta: 'Install the CLI',
      icon: 'ai ai-azion-cli',
      href: '#cli'
    },
    {
      title: 'API',
      description:
        'Drive it from your own systems: create and change resources over REST, token authenticated.',
      cta: 'Call the API',
      icon: 'ai ai-azion-api',
      href: '#api',
      span: 'sm:col-span-2 lg:col-span-1'
    }
  ]

  // ── Ready-made templates ─────────────────────────────────────────────────────────
  // A mark plus one word, which is the case `mobile-cols=2` exists for: a single file of
  // eight would be a screen of scrolling to say what two columns say in half the height.
  // Eight at 2 / 2 / 4 columns divides evenly at every breakpoint, so no cell is ever a
  // rule-coloured hole — "More frameworks" is the ninth link on the live page and belongs
  // in the closing link row, since it is an onward page and not a template.
  //
  // The icon library ships 17 COLORED marks (`ai-cor`); the frameworks it covers use
  // them, and the rest fall back to their monochrome mark so every tile still shows its
  // real logo. Astro is the exception: its colored mark is a WHITE logo with fixed
  // fills, so it vanishes on the light canvas and takes the monochrome glyph, which
  // inherits currentColor and reads in both themes.
  const templates = [
    { title: 'React', icon: 'ai-cor ai-react' },
    { title: 'Next.js', icon: 'ai-cor ai-next' },
    { title: 'Astro', icon: 'ai ai-astro' },
    { title: 'Vue.js', icon: 'ai-cor ai-vue' },
    { title: 'Angular', icon: 'ai-cor ai-angular' },
    { title: 'Gatsby Blog', icon: 'ai ai-gatsby' },
    { title: 'Hono', icon: 'ai ai-hono' },
    { title: 'Hugo', icon: 'ai ai-hugo' }
  ]

  // ── Stop attacks ─────────────────────────────────────────────────────────────────
  // Seven tasks, each phrased as the thing you end up having done. Seven divides by
  // neither two nor three, so the last card spans the remainder at both breakpoints
  // rather than leaving one (at `sm`) or two (at `lg`) rule-coloured tracks.
  const security = [
    {
      title: 'Add a firewall',
      description: 'Bind it to your workload and prove a deny rule with curl.',
      icon: 'ai ai-edge-firewall',
      href: '#firewall-quickstart'
    },
    {
      title: 'Block injection attacks',
      description: 'A SQL Injection rule set, with the blocks visible in events.',
      icon: 'ai ai-waf-rules',
      href: '#waf-quickstart'
    },
    {
      title: 'Tune false positives',
      description: 'Turn WAF false positives into allowed rules.',
      icon: 'pi pi-list-check',
      href: '#tune-waf'
    },
    {
      title: 'Deny bad bots',
      description: 'Deny automated requests that score above your threshold.',
      icon: 'pi pi-microchip',
      href: '#bot-manager'
    },
    {
      title: 'Network blocklists',
      description: 'Drop unwanted traffic before it reaches your application.',
      icon: 'pi pi-map',
      href: '#blocklists'
    },
    {
      title: 'Install TLS certificates',
      description: 'Upload a certificate and key, then check the handshake.',
      icon: 'pi pi-key',
      href: '#certificate-manager'
    },
    {
      title: 'Stream to SIEM',
      description: 'Stream WAF and firewall events where your team watches.',
      icon: 'pi pi-arrow-right-arrow-left',
      href: '#integrate-siems',
      span: 'sm:col-span-2 lg:col-span-3'
    }
  ]

  // ── Assess risk and prove compliance ─────────────────────────────────────────────
  // Six at 1 / 2 / 3 columns divides evenly everywhere, so no card carries a span.
  const compliance = [
    {
      title: 'Shared Responsibility Model',
      description: 'What Azion covers, and what stays yours.',
      icon: 'pi pi-verified',
      href: '#shared-responsibility'
    },
    {
      title: 'Governance, Risk & Compliance',
      description: 'The tools and certifications behind your compliance work.',
      icon: 'pi pi-id-card',
      href: '#governance-risk-compliance'
    },
    {
      title: 'PCI DSS compliance',
      description: 'PCI-DSS 4.0 Level 1, and what it covers for cardholder data.',
      icon: 'pi pi-wallet',
      href: '#pci-dss'
    },
    {
      title: 'SOC compliance',
      description: 'SOC 2 Type 2 and SOC 3 reports, twice a year.',
      icon: 'pi pi-lock',
      href: '#soc'
    },
    {
      title: 'Activity History',
      description: 'The audit trail: who changed what, and when.',
      icon: 'pi pi-history',
      href: '#activity-history'
    },
    {
      title: 'Security Response Team',
      description: 'Azion mitigates on your behalf during an attack.',
      icon: 'pi pi-users',
      href: '#security-response-team'
    }
  ]

  // ── Follow along ─────────────────────────────────────────────────────────────────
  // Where the platform is talked about. The three off-site destinations open in a new
  // tab — leaving the docs is the point of the card, so it should not cost the reader
  // their place in them. Five over three columns leaves two tracks empty in the second
  // row, so the last card spans them.
  //
  // The three off-site cards carry a `link` line and the two docs pages do not: a card
  // that leaves the documentation should say so before it is clicked, and its `link`
  // glyph is the diagonal arrow that means exactly that. The two internal cards need no
  // line — the whole card is already the link, and a chevron saying "this goes
  // somewhere" adds nothing on a grid where every cell does.
  const followAlong = [
    {
      title: 'Release notes',
      description: 'What changed in Azion products, as it ships.',
      icon: 'pi pi-megaphone',
      href: '#changelog'
    },
    {
      title: 'Blog',
      description: 'Engineering posts and how customers run on Azion.',
      icon: 'pi pi-book',
      href: 'https://www.azion.com/en/blog/',
      target: '_blank',
      cta: 'Read the blog'
    },
    {
      title: 'YouTube',
      description: 'Walkthroughs, demos, and recorded sessions.',
      icon: 'pi pi-youtube',
      href: 'https://www.youtube.com/aziontech',
      target: '_blank',
      cta: 'Watch on YouTube'
    },
    {
      title: 'Discord',
      description: 'Ask questions and compare notes with other builders.',
      icon: 'pi pi-discord',
      href: 'https://discord.com/invite/Yp9N7RMVZy',
      target: '_blank',
      cta: 'Join the Discord'
    },
    {
      title: 'Style Guide',
      description: 'How Azion writes documentation: voice, structure, and conventions.',
      icon: 'pi pi-pencil',
      href: '#style-guide',
      span: 'sm:col-span-2 lg:col-span-2'
    }
  ]

  // The onward pages that close a section, as a sentence rather than as a ruled row —
  // one data shape for every section, so no two can drift. Only the lead-in changes,
  // because "also useful", "reference" and "access governance" are three different
  // offers and flattening them to one word would lose that. The links are plain
  // anchors: `DocProse` owns how a link in a paragraph looks, so nothing is typed here.
  const linkBands = {
    objectives: {
      lead: 'Also useful:',
      links: [
        { label: 'observe your application', href: '#observe' },
        { label: 'reference architectures', href: '#architectures' }
      ]
    },
    templates: {
      lead: 'Also useful:',
      links: [
        { label: 'first deploy tutorial', href: '/site/docs/first-deploy' },
        { label: 'More frameworks', href: '#frameworks-compatibility' }
      ]
    },
    security: {
      lead: 'Reference, when you need the details:',
      links: [
        { label: 'DDoS Protection (unmetered, on by default)', href: '#ddos-protection' },
        { label: 'WAF rule sets', href: '#waf' },
        { label: 'WAF Exceptions', href: '#waf-exceptions' },
        { label: 'Bot Manager', href: '#bot-manager' }
      ]
    },
    compliance: {
      lead: 'Access governance:',
      links: [
        { label: 'single sign-on', href: '#sso' },
        { label: 'multi-factor authentication', href: '#mfa' },
        { label: 'teams and permissions', href: '#teams-permissions' },
        { label: 'conditional access by IP address', href: '#conditional-access' }
      ]
    }
  }
</script>

<template>
  <div>
    <!-- ══ Hero band ═══════════════════════════════════════════════════════════
         THE BANNER IS THE ONLY THING THIS PAGE DOES DIFFERENTLY. Everything under
         it is the reading-page shape (see the article below), so the home and a
         tutorial are one pattern with one exception: the home opens on a
         full-bleed band, exactly one screen tall, because it is the front door.

         The band spans the whole content region while its copy keeps the 7xl
         column (1024px at a 1440 window, once the rail's 300px and the band's own
         p-xl are off), and `hero` centers that copy in `100dvh - --banner-offset`
         — the offset reading the docs top bar's and the shell page bar's own
         heights, so "one screen" means the region actually left for the hero. -->
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
          title="Welcome to Azion Docs"
          description="We make every application fast and reliable. Deploy on a global network, with enterprise-grade security and no cold starts."
        >
          <!-- Below `sm` the actions STACK, each full width: a phone column fits one of
               these labels per line anyway, and two ragged part-width buttons read as
               debris where one full-width stack reads as a list of two ways in. From
               `sm` up they are a wrapping row again — `flex-wrap` + `shrink-0`, so long
               labels in a half-width hero column wrap to a second line instead of
               compressing until their text spills out of the button. -->
          <template #actions>
            <div
              class="flex flex-col items-stretch gap-(--spacing-md) sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Button
                label="Get Started"
                kind="primary"
                size="large"
                href="/site/docs/first-deploy"
                class="w-full shrink-0 sm:w-auto"
              />
              <Button
                label="Per-tool setup"
                kind="outlined"
                size="large"
                href="#agent-setup"
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
        <div class="my-(--spacing-lg) min-w-0 xl:self-center">
          <div class="rounded-(--shape-elements) shadow-(--shadow-sm)">
            <CodeBlock
              :tabs="heroTabs"
              default-value="ai-prompt"
              :show-line-numbers="false"
              animate-lines
              copy-aria-label="Copy setup prompt"
            />
          </div>
          <!-- What the prompt actually does, under the thing it describes — the live
               page's own caption for its "Copy prompt" button. -->
          <p class="mt-(--spacing-sm) text-pretty text-body-sm text-(--text-muted)">
            The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
          </p>
        </div>
      </div>
    </BannerContainer>

    <!-- ══ The page body — THE READING-PAGE SHAPE ══════════════════════════════
         The same three lines every other documentation page opens with: the docs
         MEASURE (`layout-column-docs`, the reading column capped by line length),
         the page's inline boundary, and the section step above the first block. So
         the home's sections sit on the same column, the same left edge and the same
         rhythm as a tutorial's — one pattern, not a landing-page pattern beside a
         reading-page one.

         WHAT WENT AWAY WITH IT: the framed column (`SectionContainer`'s border-x)
         and the banded modules (`SectionModule`'s header rules). Those vertical
         rules were the page's own frame, and no other documentation page draws one
         — a reader moving from the home into a page had the chrome change under
         them. The bands' work is now done by the prose contract itself: an h2 opens
         a section, its lead says what the section is for, and `DocCardGroup` frames
         the set of cards. -->
    <article
      class="layout-column-docs layout-boundary-inline pt-(--spacing-xxl) pb-(--spacing-xxl)"
    >
      <DocProse>
        <!-- ── Start by objective ─────────────────────────────────────────────
             Four jobs, not four products. -->
        <DocHeading
          id="start-by-objective"
          :level="2"
        >
          Start by objective
        </DocHeading>
        <p>Build something, make it faster, lock it down, or run AI on it.</p>

        <DocCardGroup :cols="2">
          <DocCard
            v-for="card in objectives"
            :key="card.title"
            :title="card.title"
            :icon="card.icon"
            :href="card.href"
          >
            {{ card.description }}
          </DocCard>
        </DocCardGroup>

        <!-- The onward links that used to close each band as a ruled row are just a
             sentence now: in a prose column a muted row under a hairline is a band's
             footer, and there are no bands. -->
        <p>
          {{ linkBands.objectives.lead }}
          <template
            v-for="(link, index) in linkBands.objectives.links"
            :key="link.label"
          >
            <a :href="link.href">{{ link.label }}</a
            ><template v-if="index < linkBands.objectives.links.length - 1">, </template>
          </template>
        </p>

        <!-- ── Start by interface ─────────────────────────────────────────────
             Two halves of one answer: hand the platform to an agent, or drive it
             yourself. The agent half comes FIRST and as prose rather than as a
             fourth card, because it is not a fourth interface — it is the thing
             that operates the other three. -->
        <DocHeading
          id="start-by-interface"
          :level="2"
        >
          Start by interface
        </DocHeading>
        <p>Hand it to your agent, or drive it yourself. Same platform either way.</p>

        <DocHeading
          id="your-ai-agent-fluent-in-azion"
          :level="3"
        >
          Your AI agent, fluent in Azion
        </DocHeading>
        <p>
          One prompt teaches any coding agent the platform: current product names, live docs through
          the <a href="#mcp">Azion MCP server</a>, and real deploys with the CLI.
        </p>
        <!-- The copy affordance is the shared contrast pill, so the docs home and the
             console Home offer the onboarding as one control with one prompt behind it —
             not two look-alikes that can drift. `data-doc-chrome` stops the prose
             contract at its edge: the pill is a component with its own type, not copy. -->
        <div
          data-doc-chrome
          class="mt-(--spacing-md) flex"
        >
          <ContrastBanner
            label="Copy prompt"
            :show-logo="false"
            :prompt="AGENT_PROMPT"
            class="self-start"
          />
        </div>
        <p>
          Prefer the guided route? Four steps connect Claude Code, Cursor, GitHub Copilot, Windsurf,
          Codex, or Gemini CLI.
          <a
            id="agent-setup"
            href="/site/docs/agent-setup"
            >Agent Setup</a
          >
        </p>

        <DocCardGroup :cols="3">
          <DocCard
            v-for="card in interfaces"
            :key="card.title"
            :title="card.title"
            :icon="card.icon"
            :href="card.href"
            :link="card.cta"
            :class="card.span"
          >
            {{ card.description }}
          </DocCard>
        </DocCardGroup>

        <!-- ── Ready-made templates ───────────────────────────────────────────
             This is the one grid that stays TWO-up on a phone (`mobile-cols`): its
             cells are a mark plus one word, so a single file of eight would be a
             screen of scrolling to say what two columns say in half the height. -->
        <DocHeading
          id="ready-made-templates"
          :level="2"
        >
          Ready-made templates
        </DocHeading>
        <p>Deploy in one click, with CI/CD already wired up.</p>

        <DocCardGroup
          :cols="4"
          :mobile-cols="2"
        >
          <DocCard
            v-for="template in templates"
            :key="template.title"
            :title="template.title"
            :icon="template.icon"
            href="#template"
          />
        </DocCardGroup>

        <p>
          {{ linkBands.templates.lead }}
          <template
            v-for="(link, index) in linkBands.templates.links"
            :key="link.label"
          >
            <a :href="link.href">{{ link.label }}</a
            ><template v-if="index < linkBands.templates.links.length - 1">, </template>
          </template>
        </p>

        <!-- ── Stop attacks ───────────────────────────────────────────────────── -->
        <DocHeading
          id="stop-attacks"
          :level="2"
        >
          Stop attacks
        </DocHeading>
        <p>Everything you need to protect applications, APIs, and the traffic that reaches them.</p>

        <DocCardGroup :cols="3">
          <DocCard
            v-for="card in security"
            :key="card.title"
            :title="card.title"
            :icon="card.icon"
            :href="card.href"
            :class="card.span"
          >
            {{ card.description }}
          </DocCard>
        </DocCardGroup>

        <p>
          {{ linkBands.security.lead }}
          <template
            v-for="(link, index) in linkBands.security.links"
            :key="link.label"
          >
            <a :href="link.href">{{ link.label }}</a
            ><template v-if="index < linkBands.security.links.length - 1">, </template>
          </template>
        </p>

        <!-- ── Assess risk and prove compliance ───────────────────────────────── -->
        <DocHeading
          id="assess-risk-and-prove-compliance"
          :level="2"
        >
          Assess risk and prove compliance
        </DocHeading>
        <p>
          What the platform covers, what stays with you, and where the evidence lives when an
          auditor asks for it.
        </p>

        <DocCardGroup :cols="3">
          <DocCard
            v-for="card in compliance"
            :key="card.title"
            :title="card.title"
            :icon="card.icon"
            :href="card.href"
          >
            {{ card.description }}
          </DocCard>
        </DocCardGroup>

        <p>
          {{ linkBands.compliance.lead }}
          <template
            v-for="(link, index) in linkBands.compliance.links"
            :key="link.label"
          >
            <a :href="link.href">{{ link.label }}</a
            ><template v-if="index < linkBands.compliance.links.length - 1">, </template>
          </template>
        </p>

        <!-- ── Follow along ───────────────────────────────────────────────────
             No closing link sentence: this grid IS the onward links. The three
             off-site destinations carry a `link` line, so the card says where it
             goes and draws the diagonal arrow that means "leaves the docs". -->
        <DocHeading
          id="follow-along"
          :level="2"
        >
          Follow along
        </DocHeading>
        <p>
          Release notes as things ship, plus the blog, the YouTube channel, and the Discord where
          questions get answered.
        </p>

        <DocCardGroup :cols="3">
          <DocCard
            v-for="card in followAlong"
            :key="card.title"
            :title="card.title"
            :icon="card.icon"
            :href="card.href"
            :target="card.target || '_self'"
            :link="card.cta"
            :class="card.span"
          >
            {{ card.description }}
          </DocCard>
        </DocCardGroup>
      </DocProse>

      <!-- The layer's own previous/next pair, the same one that closes a reading page,
           with only the `next` half filled — the home has nothing before it, and
           DocPagination leaves that half empty rather than collapsing the row, so the
           link stays anchored to the column's right edge. -->
      <DocPagination
        :next="{ title: 'Agent Setup', href: '/site/docs/agent-setup' }"
        next-label="Next Page · Start"
        class="pt-(--spacing-xxl)"
      />
    </article>
  </div>
</template>
