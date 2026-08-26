<script setup>
  // The Azion documentation HOME — the content of www.azion.com/en/documentation/.
  //
  // It is the page, not the section. The rail's first SEGMENT is titled `Getting Started`
  // and this page is the `Overview` row inside it (see docs-nav.js). The rail used to call
  // this row "Getting Started" itself, which spent the section's name on one page and left
  // the home with none. The file was called `DocsGetStarted` for the same reason.
  //
  // IT IS A READING PAGE. Not a landing page, not a page with a landing page on top of
  // it — the same three lines every other docs page opens with (`layout-column-docs` +
  // the inline boundary + `DocProse`), and a masthead as its first block.
  //
  // Two things went away to get here, in that order. First the Hub shape: a framed
  // column (`SectionContainer`'s border-x) of banded modules (`SectionModule`'s header
  // rules), which meant the front door of the documentation drew a frame no page behind
  // it draws, so the chrome changed under a reader the moment they followed their first
  // link. Then the BANNER: a full-bleed band, one viewport tall, that the sections
  // began under.
  //
  // THE ONE-SCREEN BAND WAS THE LAST THING SEPARATING THIS PAGE FROM THE ONES IT LINKS
  // TO. A reader arriving at a documentation home is looking for the way in, and a band
  // sized to `100dvh` guarantees that whatever they came for is below the fold — the
  // page spends a whole screen on a headline and a pair of buttons and puts the six
  // sections that answer the question underneath. The reference here is Cloudflare's
  // developer docs, which open on the title, the deck, the two controls and then go
  // straight into the first section, all on one column: the top of the page is the top
  // of the content. So the masthead is now a `PageHeader` sitting inside `DocProse` as
  // its first child — flush at the top (the prose reset), `data-doc-chrome` so the type
  // contract stops at its edge, and closing one rung above what closes a section,
  // because a masthead is the page's landmark and not one more section of it.
  //
  // THE PAGE RUNS ONE RUNG WIDER THAN THE PROSE LADDER, and that is a density
  // decision, not a disagreement. `DocProse`'s rungs are fitted to FLOWING COPY —
  // paragraphs, lists, the occasional block — where a 56 section step keeps a 3.5:1
  // lead over a 16 paragraph gap. This page has almost no flowing copy: every section
  // is a heading, one sentence and a bordered grid, so what the reader navigates by is
  // the distance between two heavy framed objects, and at 56 the grids read as one
  // continuous stack with headings caught between them. So the section step is opened
  // here (`[&_h2]:pt-16! sm:[&_h2]:pt-24!` on the article) — moving up the same
  // PRIMITIVE ladder the prose contract itself pins that step to
  // (`--spacing-12/14/16/20/24`), never a number invented for this page — and the
  // column's own inset takes the SAME pair, so the page's opening and every section's
  // opening are one measurement at every width.
  //
  // IT IS A PAIR, WHERE THE CONTRACT'S OWN STEP IS FLAT, and that is deliberate. What
  // the contract was fixing when it pinned 56 was the SEMANTIC scale's fluidity, which
  // ran the wrong way: `xxl`/`sm:xl` read 32 on a phone AND on a laptop and only
  // reached 48 at `xl`, so the same page broke its sections at two different widths
  // for no reason anyone chose. This is the opposite case — one number, chosen twice.
  // 96 is right where a section is a grid four cards wide; on a 390 column every grid
  // is a single file, six boundaries repeat down a 6800px scroll, and 96 apiece spends
  // a seventh of the viewport on each one. 64 there is still a rung above what the
  // contract gives a section, so the page reads wider than a reading page at BOTH
  // ends — it just does not spend desktop money on a phone.
  //
  // 96 at the top is also what puts this page's headline where its SIBLINGS' sit. A
  // reading page pays a 48px page bar plus the same `pt-14`, landing its h1 160 below
  // the top bar; the home draws no page bar, so at `pt-14` its headline sat at 112 —
  // 48 higher than every page it links to, on the one page a reader arrives at first.
  // At `pt-24` it lands at 152, level with them to within a hairline.
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
  // There is no page bar on this page at all — no trail, no Copy page. Both are reading
  // chrome and the home is a directory, so the VIEW hands the shell no `page-bar` slot
  // and the shell draws none (see AzionDocs.vue). The column therefore opens directly
  // under the docs top bar, which is what the reference does too.
  //
  // The page's six sections are the live docs home's own, in its order: start by
  // objective, start by interface, ready-made templates, stop attacks, assess risk and
  // prove compliance, follow along.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import DocCard from '@aziontech/webkit-docs/doc-card'
  import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'
  import DocHeading from '@aziontech/webkit-docs/doc-heading'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import { PixelateBanner } from '@shared/ui/banners/index.js'
  import CopyPromptButton from '@shared/ui/CopyPromptButton.vue'
  import PageHeader from '@shared/ui/layout/PageHeader.vue'

  // Hero: ONE CONTROL, NOT A LISTING. The hero used to show the prompt — a two-tab
  // CodeBlock (`AI Prompt` / `CLI`) filling the band's right half. It spent half the
  // front door on text nobody reads: a setup prompt is written to be PASTED, so the
  // reader's whole business with it is the clipboard, and showing twelve lines of it
  // made them scan a wall to find the copy glyph in its corner.
  //
  // So the prompt is a BUTTON, and it is the button the rest of this app already
  // uses for exactly this: `CopyPromptButton`, the contrast pill that stands beside
  // the Hub hero's primary and inside the block further down this same page. One
  // control, one prompt, one confirmation, in every place the offer is made — a
  // second control built here would have been a fourth copy-prompt affordance with
  // its own dwell, its own failure path and its own idea of what "copied" looks like.
  //
  // The prompt is still hard-wrapped at ~64 columns: it is pasted into agents and
  // terminals that do not re-wrap, and the one line that overflows is the bare docs
  // URL — a single unbreakable token, kept whole on purpose.
  const AGENT_PROMPT = `Help me set up Azion in this project. Do the following:

1. Install the Azion CLI:
   curl -fsSL https://cli.azion.app/install.sh | bash
2. Connect the Azion MCP server (https://mcp.azion.com) so you
   can search current Azion docs — per-tool setup:
   https://www.azion.com/en/documentation/agent-setup/
3. Review the project and check whether it is already linked
   to Azion; if it is not, run azion link and follow the prompts.
4. Suggest the most relevant next steps.`

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
  <!-- ══ THE PAGE — one column, masthead first ═══════════════════════════════
       The same three lines every other documentation page opens with: the docs
       MEASURE (`layout-column-docs`, the reading column capped by line length),
       the page's inline boundary, and the section step above the first block. The
       home's masthead and its sections sit on that one column, at the same left
       edge and on the same rhythm as a tutorial's — one pattern, with no exception
       left in it.

       WHAT WENT AWAY TO GET HERE: the framed column (`SectionContainer`'s border-x)
       and the banded modules (`SectionModule`'s header rules), and then the
       one-viewport banner the masthead used to stand in. Those were the page's own
       chrome, and no other documentation page draws any of it — a reader moving
       from the home into a page had the shell change under them. The bands' work is
       done by the prose contract itself: an h2 opens a section, its lead says what
       the section is for, and `DocCardGroup` frames the set of cards.

       THE ONE THING THIS PAGE OVERRIDES is the width of that step: `[&_h2]:pt-16!`
       / `sm:[&_h2]:pt-24!` opens a section at 64 / 96 instead of the contract's flat
       56, because this page's sections are grids and not paragraphs (see the note in
       the script block). It is the only `!` here, it is scoped to this article, and it
       moves along the same primitive rungs the contract's own section step is pinned to
       — the page is choosing a coarser rung of the ladder, not stepping off it. The
       column's inset takes the same pair, so the page opens and closes on the
       measurement its sections open on. -->
  <article
    class="layout-column-docs layout-boundary-inline pt-16 pb-16 [&_h2]:pt-16! sm:pt-24 sm:pb-24 sm:[&_h2]:pt-24!"
  >
    <DocProse>
      <!-- ── The masthead ────────────────────────────────────────────────────
           `DocProse`'s FIRST CHILD, which is what makes the page open flush: the
           prose root resets `mt`/`pt` on its first child, so the only space above
           the headline is the column's own `pt-14`. `data-doc-chrome` stops the type
           contract at this element's edge — inside it the h1 and the lead take
           `PageHeader`'s hero scale, not the scale prose gives an h1 and a `p`.

           `mb-12 sm:mb-16` (48 / 64) is the masthead's close, one rung under the
           section step at both ends. It has to out-space the header's own internals to
           read as a boundary at all: at the `hero` scale `PageHeader` breaks its deck
           at 24 and its control row at 48 (24 / 32 below `xl` / `sm`), so from `sm`
           up a 48 close would have TIED the largest gap inside the masthead and stopped
           reading as the edge of it. 64 keeps it clear of that, and the first h2 then
           pays its own step on top — 112 on a phone, 160 on a desktop: the widest gap
           on the page either way, which is what a front door's masthead should be.

           `title-max-width` caps the HEADLINE (not the header) at `--container-lg`
           (552), which is where "Welcome to Azion Docs" stops fitting on one line:
           the balance algorithm then splits it "Welcome to" / "Azion Docs", so the
           product name reads as its own line instead of trailing the greeting. The
           longest line it has to hold is `Welcome to` at 342px, so the cap has slack
           at every size the token scale gives the h1 (56 / 48 / 30). Below `sm` the
           reading column itself (366) is narrower than the whole string at 30px, so
           the title fits on one line there and the cap never comes into play.

           `description-max-width` narrows the LEAD one rung, to `--container-xl`
           (644). The `hero` default is `--container-2xl` (752), which is wide enough
           that this 123-character lead breaks late: 698 / 406, a 292px rag with a stub
           second line. 644 is the narrowest cap that still holds it to two lines —
           570 / 534, a 36px rag — so the block reads as a paragraph instead of a
           sentence with a tail, and the buttons below it do not move. -->
      <PageHeader
        id="overview"
        data-doc-chrome
        margin-bottom="mb-12 sm:mb-16"
        size="hero"
        title-max-width="max-w-(--container-lg)"
        description-max-width="max-w-(--container-xl)"
        title="Welcome to Azion Docs"
        description="We make every application fast and reliable. Deploy on a global network, with enterprise-grade security and no cold starts."
      >
        <!-- TWO ways in, which is what the reference offers: start reading, or hand
             the prompt to the tool you already have open. `Per-tool setup` used to be
             a third button here; it only scrolled to the "Prefer the guided route?"
             block further down this same page, and a tertiary link beside two real
             controls read as a caption. That block still carries its own `Agent Setup`
             button, and the rail names the page directly.

             The pair is a primary `Button` and the contrast pill — the same pairing the
             Hub hero makes, so the two front doors of this app offer their agent route
             in one shape. `show-logo` is off because the Azion mark is already in the
             top bar directly above this row; the pill keeps its trailing agent marks,
             which are the part that says WHICH tools it means.

             ONE WRAPPING ROW AT EVERY WIDTH, controls at their natural size. The rows
             elsewhere in this app go fluid below `sm` — a full-width primary is the
             right target on a phone — but the pill is `rounded-full` and sizes to its
             content by design: stretched across a phone it stops reading as a pill and
             starts reading as a second primary. The pair fits a 390px column on one
             line as it is, and wraps to two left-aligned lines on anything narrower. -->
        <template #actions>
          <div class="flex flex-wrap items-center gap-(--spacing-lg)">
            <Button
              label="Get Started"
              kind="primary"
              size="large"
              href="/site/docs/first-deploy"
              class="shrink-0"
            />
            <CopyPromptButton
              label="Copy prompt"
              :show-logo="false"
              :prompt="AGENT_PROMPT"
            />
          </div>

          <!-- What the prompt actually does, under the control that hands it over —
               the live page's own caption for its "Copy prompt" button. It stays in
               the actions slot rather than under the masthead, so it reads as the
               button's own line and not as a second lead paragraph. -->
          <p class="mt-(--spacing-lg) max-w-(--container-2xl) text-body-sm text-(--text-muted)">
            The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
          </p>
        </template>
      </PageHeader>

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
             that operates the other three.

             IT NEEDS ITS OWN h2, and for a while it did not have one — the comment
             above called this a section but nothing opened it, so the agent block
             followed the objectives' closing sentence at the BLOCK rung (24) and the
             whole thing read as one continuous run: four objective cards, a sentence,
             a bordered banner, three more cards, and only then the next heading. The
             banner looked like a footnote to "Start by objective" rather than the way
             into a section of its own, and the page's outline said the same thing —
             `Your AI agent, fluent in Azion` is an h3, so with no h2 above it, it hung
             off the previous section in the document outline too.

             With the heading in place this opens at the page's section step like every
             other section, and the h3 inside the banner is correctly a level below it. -->
      <DocHeading
        id="start-by-interface"
        :level="2"
      >
        Start by interface
      </DocHeading>
      <p>
        Hand the platform to a coding agent, or drive it yourself — visually, from the terminal, or
        over the API.
      </p>

      <!-- ── The agent offer, as ONE framed block ─────────────────────────
             The two halves of the same offer used to be four separate items in the
             prose flow — an h3, a paragraph, a pill in its own div, and a sentence
             carrying the Agent Setup link — which read as four unrelated beats and
             buried the onward route in the middle of a running paragraph. They are
             one decision with two exits ("hand it the prompt" / "walk me through
             it"), so they are one block with two cells.

             70/30, and that ratio is the CONTENT's: the left cell holds a headline,
             a sentence and a control, the right holds a question and a button. At
             the docs measure (752px) that is ~520 / ~225, which is the narrowest the
             right cell can be and still fit its button on one line — so the split
             is `7fr_3fr` rather than a half-and-half that would leave the left cell
             short and the right cell mostly air.

             THE ROW IS THE FRAME, NOT THE CELLS — the same construction every framed
             grid on the site uses (see AzionHome). The cells declare
             `borders="none" marks="none"` and the seam between them is the grid's own
             `gap-px` showing the wrapper's border colour, so the vertical rule is one
             hairline instead of two abutting borders, and the corner ticks register
             the block once instead of clustering four squares either side of the seam.

             THE RIGHT CELL'S GROUND IS THE PIXELATE FIELD — the same backdrop the
             site's "From local dev to mission critical" band pools behind its two
             samples (DeveloperSection.vue), used exactly the way that band uses it:
             held down to `opacity-60` and masked to one soft ellipse, so it reads as a
             pool of light under the cell rather than as wallpaper competing with the
             copy standing on it. It replaces `hatch`, which was a rule-coloured
             texture — the same ink the frame's own borders are drawn in, so at this
             size it read as a fourth set of hairlines inside a bordered box rather than
             as a ground. The field is the accent instead, at low alpha, and it is one
             hue in both themes (only the floor under it flips), so the guided route
             reads as the quieter half without a second border or a different fill.

             THE POOL IS PUT IN THE CELL'S OUTER CORNER and the mask fades it out
             before it reaches the copy — `--pixelate-pool-x: 100%` drives the field's
             two pools onto the right edge and the mask keeps only the lower one. That
             is a tighter mask than DeveloperSection's, and it has to be: there the
             field lies under a 600px-tall cell whose middle is covered by a code block,
             so a 120%/100% ellipse fades out inside the cell. Here the cell is ~300 ×
             265, the same ellipse never reaches its transparent stop, and the field
             renders as a flat wash of dots edge to edge — with the deck sentence
             sitting on top of them. So the ellipse is fitted to THIS cell (fading out
             by 60%) rather than copied across from a much larger one, and the field is
             held at `opacity-40` instead of 60: the same texture on a tenth of the
             area needs a tenth of the volume.

             Measured in both themes at 1440: the dots stop clear of the cell's copy in
             light and in dark, so nothing is ever read over texture.

             `overflow-hidden` on the frame is load-bearing: the field is `inset-0` on
             a stretched grid cell, and without it the grid's own 1px seam would show a
             band of accent through it.

             `data-doc-chrome` stops the prose contract at the block's edge: inside it
             the type is set here, because a DocProse h3 and p carry the reading
             column's own rhythm (top padding, relaxed measure) which is wrong inside
             a cell that owns its padding. `data-doc-block` keeps the block's OUTER
             spacing in the prose's hands, so it sits in the flow like a card group.

             The heading keeps its `id`: it is the page's own h3 in the outline, and
             the anchor has to keep resolving from the rail. Same for `agent-setup` on
             the right cell — the hero's "Per-tool setup" button targets it. -->
      <FrameBox
        data-doc-block
        data-doc-chrome
      >
        <div class="grid gap-px bg-(--border-default) lg:grid-cols-[7fr_3fr]">
          <FrameBox
            borders="none"
            marks="none"
            class="bg-(--bg-canvas)"
          >
            <div class="flex h-full flex-col items-start gap-(--spacing-md) p-(--spacing-xl)">
              <!-- `heading-md` — one token, and the SECTION rung rather than the h3 one.
                     At `heading-sm` this headline was 18px over a 16px paragraph: two
                     points of lead, which on a 900px-wide cell reads as bolder body copy
                     rather than as a title. `heading-md` is 16 / 20 / 24, so it opens to
                     a full 8-point lead on a desktop and still never drops BELOW the
                     16px `body-md` under it on a phone — the inversion the old
                     `heading-sm` pair was written to avoid (that token resolves to 14px
                     below `sm`). It lands level with the page's own h2s, which is the
                     right reading: this is a bordered feature panel, its own landmark
                     with its own onward control, not a subsection of the prose above. -->
              <h3
                id="your-ai-agent-fluent-in-azion"
                class="text-heading-lg text-(--text-default)"
              >
                Your AI agent, fluent in Azion
              </h3>
              <!-- The `#mcp` link this sentence used to carry pointed at an id no
                     page on this site defines, so it was a dead anchor dressed as a
                     live one. The onward route out of this block is the right cell's
                     button, and it goes somewhere. -->
              <p class="m-0 text-body-md text-(--text-muted)">
                One prompt teaches any coding agent the platform: current product names, live docs
                through the Azion MCP server, and real deploys with the CLI.
              </p>

              <!-- The shared contrast pill, so the docs home, this page and the console
                     Home offer the onboarding as one control with one prompt behind it —
                     not three look-alikes that can drift. It confirms the copy in its own
                     label now, which is why it can sit inside a reading column at all:
                     the answer to "did that work?" no longer arrives in a screen corner
                     the reader has to leave the sentence to find. -->
              <CopyPromptButton
                label="Copy prompt"
                :show-logo="false"
                :prompt="AGENT_PROMPT"
                class="mt-auto"
              />
            </div>
          </FrameBox>

          <!-- The guided route. `justify-between` pins the button to the cell's bottom
                 edge, so however the question above it wraps at this width, the button
                 lands on the block's floor and the two cells share one baseline —
                 measured equal at 1024 / 1100 / 1280 / 1440 / 1600 / 1920.

                 THE GAP IT LEAVES IS THE PRICE OF THAT BASELINE, and it is the right
                 one to pay. This cell holds two items where its neighbour holds three,
                 so once both buttons sit on the floor the shorter cell has slack, and
                 the slack collects in the middle. Closing it means letting this button
                 float up under its own heading — which is the alignment going away, not
                 the gap being fixed. If the hole ever reads as a mistake rather than as
                 air, the answer is a second line of copy here, not a change of
                 `justify-between`. -->
          <FrameBox
            id="agent-setup"
            borders="none"
            marks="none"
            class="overflow-hidden bg-(--bg-canvas)"
          >
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 opacity-40 [--pixelate-pool-x:100%] mask-[radial-gradient(90%_140%_at_100%_100%,black_0%,transparent_60%)]"
            >
              <PixelateBanner />
            </div>

            <div
              class="relative z-10 flex h-full flex-col items-start justify-between gap-(--spacing-lg) p-(--spacing-xl) md:flex-row lg:flex-col"
            >
              <p class="m-0 text-heading-md text-(--text-default)">Prefer the guided route?</p>
              <Button
                label="Agent Setup"
                kind="primary"
                size="large"
                href="/site/docs/agent-setup"
              />
            </div>
          </FrameBox>
        </div>
      </FrameBox>

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
        What the platform covers, what stays with you, and where the evidence lives when an auditor
        asks for it.
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
      next-label="Next Page · Getting Started"
      class="pt-16"
    />
  </article>
</template>
