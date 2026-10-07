<script setup>
  // Landing page: Vercel Alternative Guide — a translation of
  // https://www.azion.com/en/lp/vercel-to-azion-alternative-guide/ into this site's own
  // page language. The source is the specification for WHAT the page says; CONTAINERS.md
  // is the specification for HOW it is drawn. Every line of copy below is the source's,
  // verbatim; none of its grid, spacing, borders, colours or radii came across.
  //
  // The source's 15 bands, in order, and what each becomes here:
  //
  //   0  hero (eyebrow, h1, description, one action, art)  SolutionArtHero, copy beside art
  //   1  labelled 11-mark marquee                          the hero's carousel, on its floor
  //   2  "Why Azion" title + first three cells             SectionTitle in #header + CardGrid
  //   3  the second three cells                            the same grid's second row
  //   4  spacer                                            SectionGap hatch
  //   5  six client marks + one quote                      QuoteTabs, the client quotes band
  //   6  spacer                                            SectionGap hatch
  //   7  "Comparison" title + the capability matrix        SectionTitle in #header + a real table
  //   8  spacer                                            SectionGap hatch
  //   9  copy | art — "Move application delivery…"         MediaSplit
  //   10 spacer                                            SectionGap hatch
  //   11 Frequently Asked Questions                        the ruled Faq band
  //   12 spacer                                            SectionGap hatch
  //   13 closing CTA                                       CallToAction kind="split"
  //   14 the half-height closing spacer                    a bare hatch frame
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • The source's hero is 618px. Ours is `screen` — one viewport — because that is this
  //     language's hero rule.
  //   • The source runs the mark strip as its own band under the hero. Here it stands on the
  //     hero's floor and the hero's own `border-b` is the rule dividing it from the column —
  //     the same single line, one owner. Its label is the source's eyebrow, so no copy moves.
  //     AzionHome, AzionFunctions, AzionCache and AzionApplicationAccelerator all seat their
  //     strip this way, so the pages read as one site.
  //   • Bands 2 and 3 are one band here. The source splits its six cells across two sections
  //     because only the first carries the heading; six cells are two rows of one grid, and
  //     the heading is that module's `#header`. Nothing is added, dropped or reordered.
  //   • The source's six cells are `h3` under the band's `h2`. Ours are `h3` for the same
  //     reason — SectionTitle renders the `h2` above them, so the outline stays in order.
  //   • The comparison matrix is a real `<table>`, on the same form as the pricing matrix
  //     (PricingComparison): it is tabular data, and a screen reader announcing
  //     "Cold-start-free function execution, Vercel, Partial support" is the whole point of
  //     the band. Its head is STICKY under the site nav — the source's is too, and past row
  //     six there is nothing on screen to say which column is which.
  //   • The source's matrix header row is `sticky`, which is why it is absent from the
  //     extracted inventory (the reader suppresses everything pinned to the viewport). It is
  //     real rendered copy — `Capability` / `Azion` / `Vercel` — and it is here, in a `thead`
  //     that scrolls with its rows.
  //   • The source's hero art and its band-9 art are the same raster OG image (a Vercel
  //     triangle and an Azion arrow over a stack of deploy rows). Ours is the design system's
  //     own, and it is two scenes rather than one: `azion-to-vercel` in the hero — the two
  //     marks, one laid over the other, which is the page's whole subject stated once at the
  //     top — and `build-applications` in band 9, framework projects mapped through the
  //     platform to what each one serves, which is what that band's copy enumerates. Their
  //     `alt` text therefore does not survive the copy diff: it described art we replaced.
  //   • Band 9's source paragraph runs its link's label on as a sentence ("…production
  //     domains. Complete technical guide"). Here the paragraph is prose and the link is a
  //     real control labelled `See the guide`, the outlined action every media split carries.
  //   • The closing band's eyebrow is `// SECURE` in the source. CallToAction's overline
  //     anatomy draws the `//` itself, so the string passed is `Secure`.
  //   • Every "read more" control on the source carries a trailing arrow, and so does every
  //     one here: `Button` takes `icon-position="trailing"`, and the glyph is the system's
  //     own `pi-chevron-right` rather than the source's arrow — the same mark `doc-item` and
  //     `doc-card` already use for "this goes somewhere". A control whose leading glyph
  //     carries meaning (`pi-book` for Docs) keeps it and takes no second glyph.
  //   • Band 9's media is the same link as its action: `media-href` makes the whole asset
  //     cell one anchor, and the chevron affordance that fades in on hover says so. The
  //     labelled button under the copy stays — it is what a keyboard and a screen reader read.
  //
  // ASSET GAPS: none — every mark the source names resolves to a file. Two of the source's
  // `alt` strings are its own mislabels and we did not inherit them: its eighth strip mark is
  // `radware-logo.svg` carrying `alt="Prime Video"` (we render the registry's real Prime Video
  // mark under that name), and the first cell of the quote band's grid is `dzn-logo.svg`
  // carrying `alt="DNZ"` (NZN is this repo's name for that client, and what the file draws).
  // `Magazine Luiza` is `Magalu` here for the same reason — one client, our registry's name.
  import { competitor } from '@aziontech/webkit/assets/competitor-registry'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Topic from '@aziontech/webkit/topic'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { useRouter } from 'vue-router'

  import { quotesLedBy } from '../data/solutions.js'
  import SolutionArtHero from './SolutionArtHero.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The page's three outbound destinations, stated once each: the specialist / team ask, the
  // technical guide, and the client stories the quote band links out to.
  const CONTACT = '/site/contact'
  const GUIDE = '/site/docs'
  const CLIENT_STORIES = '/site/success-cases'

  // ── Band 1 — who already runs on the platform ─────────────────────────────────
  // The source's marquee, in the source's order. `Prime Video` is the name its eighth mark
  // states; the file it serves under that name is Radware's, which is its own mislabel.
  const TRUST_MARKS = [
    'global-fashion-group',
    'herospark',
    'itau',
    'nzn',
    'netshoes',
    'caixa',
    'agibank',
    'prime-video',
    'america-movil',
    'gpa',
    'fourbank'
  ]

  const HERO = {
    eyebrow: 'Alternative Guide',
    title: 'Vercel Alternative Guide: Moving to Azion',
    description:
      'Map Vercel projects, preview deployments, Functions, Blob, Edge Config, Firewall, and Web Analytics to Azion. Keep your Git-based build and preview workflow, run functions without cold starts, and move one project at a time before you switch the domain.',
    art: {
      name: 'azion-to-vercel',
      alt: 'The Azion mark and the Vercel mark, one laid over the other'
    },
    carouselMarks: TRUST_MARKS
  }

  // ── Bands 2 + 3 — why teams move, in six cells ────────────────────────────────
  // The source draws a dollar, a code bracket, a globe, a shield, a bolt and a sync arrow
  // over the six cells. Ours are the same six ideas from the icon library the rest of the
  // page glyphs come from.
  const REASONS = [
    {
      icon: 'pi pi-dollar',
      title: 'Bills you can forecast',
      description:
        'Usage-based bandwidth and invocation pricing makes spend hard to predict as traffic grows. Azion publishes a price per unit for delivery, compute, storage, and security, with no egress charges between services.'
    },
    {
      icon: 'pi pi-code',
      title: 'The same build and preview workflow',
      description:
        'Git-connected builds, preview URLs, custom domains, and automatic certificates map to Applications, Azion CLI, Preview Deployment, Domains, and Certificate Manager. Your team keeps the release loop it already uses.'
    },
    {
      icon: 'pi pi-globe',
      title: 'Sit in front of any origin',
      description:
        'Vercel accelerates what runs on Vercel. Azion fronts origins on AWS, GCP, on-premises, or another provider, so you put delivery, caching, and security in place before you move the application.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Protection below the application layer',
      description:
        'Vercel Firewall works on application rules. Azion adds DDoS Protection, Network Shield, and Network Lists at the network layer, underneath WAF and Bot Manager.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Cold-start-free scale',
      description:
        "Fluid Compute reduces cold starts. Functions removes them: execution begins on arrival at Azion's distributed infrastructure, including under bursty traffic."
    },
    {
      icon: 'pi pi-sync',
      title: 'Move one project at a time',
      description:
        'Rebuild a single project on Azion, compare routes and function behavior against production, then move the domain. Vercel keeps serving until you cut over.'
    }
  ]

  const QUOTES = quotesLedBy('contabilizei')

  // ── Band 7 — the capability matrix ────────────────────────────────────────────
  // Twenty-three rows, each platform's level as the source states it. The three levels are
  // the source's own words: two of them are drawn as the pricing matrix's own two glyphs
  // and announce these strings to a screen reader, the third is stated as the cell's text.
  const SUPPORT = {
    full: 'Full support',
    partial: 'Partial support',
    none: 'Not available'
  }

  const VERCEL = competitor('Vercel')

  const CAPABILITIES = [
    {
      capability: 'Delivery, compute, storage, and security on one platform',
      azion: 'full',
      vercel: 'partial'
    },
    { capability: 'Git-connected builds and preview deployments', azion: 'full', vercel: 'full' },
    {
      capability: 'Delivery rules changed without redeploying the application',
      azion: 'full',
      vercel: 'partial'
    },
    { capability: 'JavaScript and WebAssembly runtime', azion: 'full', vercel: 'full' },
    { capability: 'Cold-start-free function execution', azion: 'full', vercel: 'partial' },
    { capability: 'AI inference on the platform', azion: 'full', vercel: 'partial' },
    { capability: 'Distributed key-value store', azion: 'full', vercel: 'partial' },
    { capability: 'S3-compatible object storage', azion: 'full', vercel: 'partial' },
    { capability: 'Distributed SQL database with vector search', azion: 'full', vercel: 'none' },
    { capability: 'Managed WAF for applications and APIs', azion: 'full', vercel: 'full' },
    { capability: 'API discovery and protection', azion: 'full', vercel: 'partial' },
    { capability: 'Bot management', azion: 'full', vercel: 'full' },
    { capability: 'DDoS protection included with delivery', azion: 'full', vercel: 'full' },
    { capability: 'Network-layer firewall', azion: 'full', vercel: 'none' },
    { capability: 'Tiered caching and origin offload', azion: 'full', vercel: 'partial' },
    { capability: 'Image and video optimization', azion: 'full', vercel: 'partial' },
    { capability: 'Authoritative DNS', azion: 'full', vercel: 'full' },
    { capability: 'Load balancing across multi-cloud origins', azion: 'full', vercel: 'none' },
    {
      capability: 'Accelerate and protect origins hosted elsewhere',
      azion: 'full',
      vercel: 'none'
    },
    { capability: 'Real-time metrics and event search', azion: 'full', vercel: 'full' },
    { capability: 'Log streaming to third-party tools', azion: 'full', vercel: 'full' },
    { capability: 'Real-user monitoring', azion: 'full', vercel: 'full' },
    { capability: 'Published pay-as-you-go pricing', azion: 'full', vercel: 'full' }
  ]

  // ── Band 11 — the ten questions ───────────────────────────────────────────────
  const FAQ = [
    {
      value: 'good-vercel-alternative',
      question: 'Is Azion a good Vercel alternative?',
      answer:
        'Yes. Azion is a strong Vercel alternative for teams that want application delivery, distributed functions, object storage, key-value data, security, DNS, analytics, and observability on Azion Web Platform with cold-start-free scale.'
    },
    {
      value: 'projects-map',
      question: 'How do Vercel projects map to Azion?',
      answer:
        'Vercel projects and production deployments map to Azion Applications and Functions. CDN cache behavior, redirects, rewrites, headers, and routing can be rebuilt with Applications, Cache, and Rules Engine.'
    },
    {
      value: 'preview-deployments',
      question: 'What replaces Vercel Preview Deployments?',
      answer:
        'Preview workflows can be rebuilt with Azion Preview Deployment and Azion CLI. Use them to validate non-production URLs, application behavior, functions, and configuration before promotion.'
    },
    {
      value: 'functions-fluid-compute',
      question: 'What is the equivalent of Vercel Functions and Fluid Compute?',
      answer:
        'Vercel Functions and Fluid Compute workloads map to Azion Functions. Teams can translate server-side logic, API routes, environment variables, and backend integrations into Functions and validate behavior before domain cutover.'
    },
    {
      value: 'blob-edge-config',
      question: 'How do Vercel Blob and Edge Config map to Azion?',
      answer:
        'Vercel Blob maps to Azion Object Storage for application files, uploads, documents, images, and videos. Edge Config maps to KV Store for low-latency reads such as feature flags, experiments, redirects, and configuration.'
    },
    {
      value: 'ai-workloads',
      question: 'How do Vercel AI workloads map to Azion?',
      answer:
        'AI SDK and AI Gateway patterns map to AI Inference, Azion AI Client, Azion Lib, and Functions depending on the application architecture, model routing, streaming behavior, and observability requirements.'
    },
    {
      value: 'security-features',
      question: 'How do Vercel security features map to Azion?',
      answer:
        'Vercel Firewall maps to Azion Firewall and Rules Engine. Web Application Firewall maps to Azion Web Application Firewall, bot controls map to Bot Manager, deployment protection can use Firewall and Network Lists, and DDoS posture maps to DDoS Protection and Network Shield.'
    },
    {
      value: 'domains-dns-certificates',
      question: 'How do Vercel domains, DNS, and certificates map to Azion?',
      answer:
        'Custom domains, DNS records, nameservers, and certificate workflows can be rebuilt with Azion Domains, Edge DNS, and Certificate Manager. Validate certificate issuance and routing before moving production traffic.'
    },
    {
      value: 'observability-analytics',
      question: 'What replaces Vercel Observability, Speed Insights, and Web Analytics?',
      answer:
        'Vercel Observability maps to Real-Time Metrics, Real-Time Events, and Data Stream. Speed Insights and Web Analytics map to Edge Pulse and Real-Time Metrics for user experience and traffic visibility.'
    },
    {
      value: 'run-in-parallel',
      question: 'Can I run Vercel and Azion in parallel?',
      answer:
        'Yes. You can rebuild delivery, functions, storage, security, DNS, TLS, and observability on Azion while keeping Vercel active, then shift production domains in stages after validation.'
    }
  ]
</script>

<template>
  <SolutionArtHero :hero="HERO" />

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its
       top rule ON the one above and hands the vertical rules back to the column — so no
       line on this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- ── Bands 2 + 3 — why teams move, in six cells ───────────────────────────
         The heading is the module's own `#header`, so the rule under it is that header's
         `border-b` rather than two bands' edges meeting. Each of the six cells is a framed
         CardGridCell, so every cell draws its own rules and corner marks. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Why Azion"
          title="Why teams move from Vercel to Azion"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="reason in REASONS"
            :key="reason.title"
            kind="canvas"
          >
            <Topic
              :heading-level="3"
              :icon="reason.icon"
              :title="reason.title"
              :description="reason.description"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 4 — spacer. -->
    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <QuoteTabs
          aria-label="Client stories"
          :items="QUOTES"
        >
          <template #actions>
            <Button
              label="See success stories"
              kind="secondary"
              size="large"
              :href="CLIENT_STORIES"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </QuoteTabs>
      </FrameBox>
    </SectionModule>

    <!-- Band 6 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 7 — the capability matrix ───────────────────────────────────────
         A real `<table>`, drawn on the pricing matrix's form (PricingComparison), because
         it is the same object at a smaller scale: one column of labels, N columns of values,
         read down rather than across.

         What that form fixes, and why:
           • `border-separate` rather than the browser default `collapse` — a sticky header
             cell loses its borders under `collapse` in every engine.
           • Each head cell is INDIVIDUALLY sticky (a `thead` cannot be, and a `tr` only can
             in some engines), pinned under the site nav's 3.5rem bar and opaque, so twenty-
             three rows pass behind it rather than through it. That is what makes the matrix
             readable: past row six there is nothing on screen to say which column is which.
           • One size and one weight for every row — `text-label-md`, regular, on the CELL
             and not on a span inside it, so the table's own 16/24 line box cannot set the
             row height. A `th` needs an explicit `font-normal`: the UA stylesheet sets
             `th { font-weight: bold }`.
           • Each edge keeps one owner. The column rules are `border-l` on columns two and
             three, drawn by every cell, which is what makes them read as continuous rules
             down the band. The row rules are `border-t`, and the FIRST row drops its own —
             the head's `border-b` is that seam, and it has to travel with the head when it
             pins. The matrix's floor is the `SectionGap` below it, and its sides are the
             column's `border-x`, so this band draws no frame of its own.
           • The two platform columns are headed by their MARKS, not by their names set in
             this page's type — the reader is comparing two products, and a product is its
             lockup. Azion's is the design system's own `Brand`; Vercel's is the competitor
             registry's pair of files, placed per theme by `ClientMark` with no filter. Both
             lockups draw at the same height, so both measure ~80px wide (~60px under `sm`,
             where 23 rows of labels need the width back) and neither column reads as the
             louder claim. Each carries its name twice over, and both are load-bearing: the
             `aria-label` is what a screen reader announces for all 23 rows, and the
             `sr-only` span is the header TEXT a table header must have — the per-theme mark
             is two `img`s of which CSS hides one, and the hidden one takes its `alt` out of
             the tree, so on the light theme the cell would otherwise hold no text at all.
             `Capability` names its column rather than heading the page, so it stays the
             quietest token here.

         The value cells take the pricing matrix's vocabulary unchanged, which has exactly
         three kinds and invents no glyph beyond them: a `pi-check` in `--success-contrast`
         for the affirmative, an em dash in `--text-muted` for the absent, and the stated
         value as text for anything in between. The two glyphs carry their meaning entirely
         in shape, so each pairs with the source's own words in `sr-only` text; `Partial
         support` is text already and needs none. The tick is `--success-contrast` and not
         `--success` — that pair is ink and surface, and the surface is all but invisible
         on the canvas in whichever theme you are not looking at. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          eyebrow="Comparison"
          title="How Azion compares with Vercel"
        />
      </template>

      <table
        class="w-full table-auto border-separate border-spacing-0 border-b border-(--border-default) text-left lg:table-fixed"
      >
        <caption class="sr-only">
          Capability-by-capability comparison of Azion and Vercel.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
            >
              <span class="text-overline-md text-(--text-muted)">Capability</span>
            </th>
            <th
              scope="col"
              aria-label="Azion"
              class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) text-center align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
            >
              <Brand
                kind="default"
                size="small"
                class="[&>svg]:h-3! sm:[&>svg]:h-4!"
              />
              <span class="sr-only">Azion</span>
            </th>
            <th
              scope="col"
              aria-label="Vercel"
              class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
            >
              <ClientMark
                :client="VERCEL"
                mark="mx-auto h-3 w-auto max-w-full object-contain sm:h-4"
              />
              <span class="sr-only">Vercel</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in CAPABILITIES"
            :key="row.capability"
            :data-first="index === 0 || null"
            class="group/row"
          >
            <th
              scope="row"
              class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[first]/row:border-t-0"
            >
              {{ row.capability }}
            </th>
            <td
              v-for="platform in ['azion', 'vercel']"
              :key="platform"
              class="border-l border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-[first]/row:border-t-0"
            >
              <template v-if="row[platform] === 'full'">
                <i
                  class="pi pi-check text-body-sm text-(--success-contrast)"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ SUPPORT.full }}</span>
              </template>
              <template v-else-if="row[platform] === 'none'">
                <span
                  class="text-(--text-muted)"
                  aria-hidden="true"
                  >—</span
                >
                <span class="sr-only">{{ SUPPORT.none }}</span>
              </template>
              <span v-else>{{ SUPPORT.partial }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </SectionModule>

    <!-- Band 8 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 9 — the argument beside the mapping ─────────────────────────────
         The source runs its link's label on as the last sentence of the paragraph; here the
         paragraph is prose and the link is a real control. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        :media-href="GUIDE"
        align="center"
        size="large"
        media-fill="canvas"
        texture="pixelate"
        texture-size="small"
        texture-fade="top"
        title="Move application delivery without disrupting releases"
        description="Translate Vercel projects into Azion equivalents while keeping validation workflows predictable. Rebuild CDN behavior, redirects, rewrites, image optimization, Functions, AI integrations, storage, security rules, DNS, certificates, and observability before shifting production domains."
      >
        <template #media>
          <Illustration
            name="build-applications"
            aria-label="Framework projects mapped through the platform to what each one serves"
          />
        </template>
        <template #actions>
          <Button
            label="See the guide"
            kind="outlined"
            size="medium"
            :href="GUIDE"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </MediaSplit>
    </SectionModule>

    <!-- Band 10 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 11 — Frequently Asked Questions ─────────────────────────────────
         `Faq` in its hairline register, framed so the band draws its own floor. -->
    <SectionModule
      id="faq"
      :divided="false"
      :padded="false"
    >
      <Faq
        framed
        title="Frequently Asked Questions"
        :items="FAQ"
      />
    </SectionModule>

    <!-- Band 12 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 13 — the closing CTA ────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are
         the homepage's copy, so every string the source states here is explicit. -->
    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Secure"
        title="Protected by default."
        title-muted="Always on."
        description="Get stronger protection, less attack exposure, and less operational overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            :href="CONTACT"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════════ -->
</template>
