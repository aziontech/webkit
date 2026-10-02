<script setup>
  // Product page prototype: Azion AI Inference (Figma `Azion.com` node 13031:161116,
  // "Run AI Inference Globally to Power Smarter Applications"), composed entirely from
  // @aziontech/webkit components, the site's layout primitives and theme tokens.
  // Rendered inside SiteLayout (website nav + footer, no console sidebar).
  //
  // Sections, top to bottom, as the design lays them out:
  //
  //   hero            centered band, one screen tall — headline, description, two
  //                   actions, the pixelate field on the floor, the client trust strip
  //   features        six capability cards (inference, API, agents, RAG, observability,
  //                   security), three-up
  //   platform        "The Platform for Your AI Workloads" — four cards, each a
  //                   capability + its own Start/Docs pair
  //   stack           "Compatible with your stack" — a framework strip over a
  //                   quick-start panel (terminal art beside starter-template links)
  //   operate         "Operate AI With Speed, Reliability, and Cost Control" — a
  //                   three-row list beside a small network panel
  //   quotes          "Battle-Tested…" — three client-quote cards
  //   primitives      "All the AI Primitives You Need" — the platform's primitives,
  //                   four columns (identical to AzionFunctions' ProductsMenu)
  //   infrastructure  "Distributed infrastructure that stays up…" — a network-backed
  //                   band of capability chips, then a three-cell stat row
  //   faq             ten collapsed questions
  //   cta             the site's own closing band
  //
  // Layout is the framed grid of CONTAINERS.md — the same three-layer skeleton every
  // other Site page uses:
  //
  //   BannerContainer hero  → the full-bleed hero band, one viewport tall, owning the
  //                           page's top rule (border-b).
  //   SectionContainer      → the centered column below, owning border-x.
  //   SectionModule         → each brick inside it, owning its own padding (which is why
  //                           the column is unpadded).
  //
  // Every SectionModule in this page passes `:divided="false" :padded="false"` and wraps
  // its body in a `FrameBox flush borders="y" marks="bottom"` — the pattern every other
  // module on the site already follows (AzionFunctions, AzionRetail): the frame above
  // (the hero, or the previous frame's own bottom rule, or a SectionGap) has already
  // drawn the boundary, so `flush` only ever skips a redundant top rule. The footer owns
  // border-t, so every edge of the frame is drawn exactly once.
  //
  // Figma → ours, where the two disagree (recorded rather than silently inherited):
  //   • THE CARDS ARE OUR SHAPE, NOT THE DESIGN'S. The design floats each card at a 16px
  //     radius with its own border and drop shadow-free surface. CONTAINERS.md's ceiling
  //     is `--shape-card` (8px) and "nothing structural is pill-shaped" — CallToAction
  //     already makes this exact call for this page's own closing band. So every card grid
  //     here (features, platform, quotes) is `CardGrid kind="divider"` — the hairline
  //     box grid every other page's card rows use — not the design's individually rounded
  //     tiles.
  //   • THE HERO'S "Pixelate" LAYER IS OUR REGISTERED `pixelate` BANNER, NOT A SHADER. The
  //     design drives that field with a Figma-only WebGPU shader effect (no CSS
  //     equivalent, and shaders are outside what this package takes on per
  //     .claude/rules/dependencies.md). `PixelateBanner` is the same accent-lit grid
  //     already registered for exactly this texture, selected with `banner="pixelate"`.
  //   • THE FOUR CONNECTOR-LINE DIAGRAMS (build-ai-agents / deploy-mcp-servers /
  //     build-applications / automate-threat-mitigation) ARE A SINGLE LEADING ICON, NOT A
  //     redrawn constellation of dashed connector lines. Each is decorative art with no
  //     information the copy beside it does not already state, so it takes one glyph in a
  //     registration-framed icon box — the same weight every other Site card gives its
  //     leading mark.
  //   • THE NETWORK PANEL BESIDE "Operate AI…" AND THE BACKDROP BEHIND "Distributed
  //     infrastructure…" ARE THE REGISTERED `NetworkBanner`, NOT THE DESIGN'S EXPORTED MAP
  //     IMAGE. Same artwork the `network`/`map` banner keys already draw elsewhere on the
  //     site (CONTAINERS.md § 1), so this page draws its map with the one map asset the
  //     system owns.
  //   • THE FRAMEWORK STRIP IN "Compatible with your stack" IS STATIC, NOT A SECOND
  //     MARQUEE. The design scrolls it; a second looping track fighting the hero's own
  //     BrandCarousel for attention on one page reads as noise, so it holds still, faded.
  //   • CONTENT GAPS, recorded rather than invented:
  //       - The design's three "Operate AI…" rows carry IDENTICAL copy ("Run AI models
  //         close to users" / the same supporting sentence, three times) — an unfinished
  //         state in the source file. Shipped as-is; real per-row copy is a follow-up.
  //       - The three "Battle-Tested…" quote cards are likewise identical (one AXUR quote,
  //         signed "Fabio Ramos, CEO", repeated three times) — shipped as-is for the same
  //         reason. AXUR has no client-mark asset in this repo (and isn't in the shared
  //         CLIENTS registry), so its mark renders as a typographic wordmark, the same
  //         fallback ClientMark uses for any unregistered client; the quote's headshot is
  //         likewise a initials avatar rather than a substituted stock photo.
  //       - "Build and Scale AI Applications"'s description text is clipped in the Figma
  //         frame's own overflow (a 4-card row wider than its declared 1280px frame) and
  //         could not be fully read back from either the code export or a screenshot; the
  //         text below is a best-effort reconstruction from the visible fragment and this
  //         product's other stated capabilities (LoRA fine-tuning, SQL Database context) —
  //         flagged here for a content owner to verify against the source.
  //       - The FAQ's ten rows show only their closed question text; no answer copy is
  //         drawn anywhere in the frame. Each ships with an empty answer rather than an
  //         invented one — real answers are a follow-up, not a default this page invents.
  //       - The hero's client strip names four specific marks (NZN, HeroSpark, iFood,
  //         Agibank); iFood has no asset in this repo. Rather than a three-mark strip, this
  //         page follows the rest of the site and carries the full shared CLIENTS trust
  //         list (monochrome), matching AzionFunctions and AzionHome.
  import Accordion from '@aziontech/webkit/accordion'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import CardGrid from '@aziontech/webkit/card-grid'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import { NetworkBanner } from '@shared/ui/banners/index.js'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { NavColumn, NavItem, NETWORK_BAND, NETWORK_CLAIMS } from '../ui/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ── Features — six capability cards, three-up ─────────────────────────────────
  const FEATURES = [
    {
      icon: 'pi pi-globe',
      title: 'Global inference on GPUs',
      description:
        'Run real-time serverless inference on GPUs across hundreds of locations with median latency under 30 ms. No infra to manage.'
    },
    {
      icon: 'ai ai-azion-api',
      title: 'OpenAI-compatible API',
      description:
        'Migrate and integrate AI features quickly using OpenAI-compatible endpoints and SDKs. Just swap the endpoint.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Real-time decisioning with AI agents',
      description:
        'Run ReAct-style AI agents on a distributed architecture to reason over context, call tools, and respond in real time.'
    },
    {
      icon: 'ai ai-edge-sql',
      title: 'RAG with SQL vector search',
      description:
        'Integrate AI Inference with SQL Database vector search to power semantic retrieval and hybrid search.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Observability built for AI',
      description:
        'Track behavior and performance with Real-Time Metrics, Real-Time Events, and GraphQL APIs.'
    },
    {
      icon: 'pi pi-shield',
      title: 'AI-powered security workflows',
      description:
        'Build autonomous security agents to detect abuse and mitigate threats before origin impact. Or deploy a pre-built one instantly.'
    }
  ]

  // ── Platform — four cards, each its own Start/Docs pair ───────────────────────
  // See the header comment: card 3's description is a recorded content gap
  // (reconstructed from a partially clipped source, not verbatim).
  const PLATFORM_CARDS = [
    {
      icon: 'ai ai-edge-ai',
      title: 'Build AI Agents',
      description:
        'Automate multi-step workflows with AI agents that reason, plan, and act on your behalf. Collapse days of manual effort into minutes and free teams for higher-value work.'
    },
    {
      icon: 'pi pi-share-alt',
      title: 'Deploy Secure MCP Servers',
      description:
        'Connect AI agents to your tools, APIs, and live data through MCP servers running on the same distributed infrastructure as your inference.'
    },
    {
      icon: 'ai ai-layers',
      title: 'Build and Scale AI Applications',
      description:
        'Supercharge your applications with AI models, LoRA fine-tuned with SQL Database context, and generate real-time responses.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Automate Threat Mitigation',
      description:
        'Run multi-model AI to identify phishing and abuse patterns across your digital assets. Automate security workflows with agentic AI — from detection to takedown.'
    }
  ]

  // ── Stack — the framework strip + the quick-start panel ───────────────────────
  const FRAMEWORKS = [
    'ai ai-vue',
    'ai ai-react',
    'ai ai-next',
    'ai ai-astro',
    'ai ai-svelte',
    'ai ai-angular',
    'ai ai-nuxt'
  ]

  const TEMPLATES = [
    { icon: 'pi pi-comments', label: 'Next.js AI Chatbot' },
    { icon: 'pi pi-align-center', label: 'Paint by Text' },
    { icon: 'pi pi-microphone', label: 'Live Transcription' },
    { icon: 'ai ai-azion-api', label: 'TanStack AI' }
  ]

  const DEPLOY_STEPS = ['azion init', 'azion build', 'azion deploy']

  // ── Operate — three rows beside the network panel ─────────────────────────────
  // Identical across all three in the source Figma frame — see the header comment.
  const OPERATE_ROWS = [
    {
      title: 'Run AI models close to users',
      description:
        'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
    },
    {
      title: 'Run AI models close to users',
      description:
        'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
    },
    {
      title: 'Run AI models close to users',
      description:
        'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
    }
  ]

  // ── Quotes — identical across all three in the source; see the header comment ─
  const QUOTE_TEXT =
    'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.'
  const QUOTES = [
    { key: 'axur-1', mark: 'AXUR', quote: QUOTE_TEXT, name: 'Fabio Ramos, CEO', initials: 'FR' },
    { key: 'axur-2', mark: 'AXUR', quote: QUOTE_TEXT, name: 'Fabio Ramos, CEO', initials: 'FR' },
    { key: 'axur-3', mark: 'AXUR', quote: QUOTE_TEXT, name: 'Fabio Ramos, CEO', initials: 'FR' }
  ]

  // ── Primitives — the platform's own vocabulary, four columns ──────────────────
  // Identical to AzionFunctions' `productGroups`: one description per product, so no
  // page on the site states one product's one-liner two different ways.
  const PRODUCT_GROUPS = [
    {
      label: 'Compute',
      items: [
        { icon: 'ai ai-edge-functions', title: 'Functions', description: 'Run code globally' },
        { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic with high availability'
        },
        {
          icon: 'pi pi-image',
          title: 'Image Processor',
          description: 'Optimize and transform images'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        { icon: 'ai ai-edge-ai', title: 'AI Inference', description: 'Run low-latency models' },
        { icon: 'ai ai-gateway', title: 'AI Gateway', description: 'Govern and route LLMs' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Store and deliver globally'
        },
        { icon: 'ai ai-edge-sql', title: 'SQL Database', description: 'Distributed SQL database' },
        { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Key-value data store' },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate delivery and availability'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'Web Application Firewall',
          description: 'Smart way to block threats'
        },
        {
          icon: 'ai ai-azion-api',
          title: 'API Gateway',
          description: 'Authenticate and protect APIs'
        },
        { icon: 'pi pi-android', title: 'Bot Management', description: 'Stop bots, prevent abuse' },
        { icon: 'ai ai-edge-dns', title: 'DNS', description: 'High-performance DNS' }
      ]
    }
  ]

  // ── Infrastructure — capability chips + the three-cell stat row ───────────────
  const INFRA_STATS = [
    {
      icon: 'pi pi-globe',
      title: 'Global resilience beyond anycast',
      description:
        "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
    },
    {
      icon: 'pi pi-bolt',
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run across all data centers, close to your users, keeping median global latency under 30 ms, with a built-in CDN and tiered caching for every app.'
    },
    {
      icon: 'pi pi-gauge',
      title: 'Zero-ops autoscaling and failover',
      description:
        'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
    }
  ]

  // ── FAQ — ten questions; the source draws no answer copy (see header comment) ─
  const FAQ = [
    { value: 'model-types', question: 'Which model types are supported?', answer: '' },
    {
      value: 'use-in-app',
      question: 'How do I use AI Inference in my application?',
      answer: ''
    },
    {
      value: 'openai-compatible',
      question: 'Is Azion AI compatible with OpenAI APIs and SDKs?',
      answer: ''
    },
    {
      value: 'rag-search',
      question: 'How do I implement RAG and semantic search?',
      answer: ''
    },
    {
      value: 'fine-tune',
      question: 'Can I fine-tune models with proprietary data?',
      answer: ''
    },
    {
      value: 'model-unavailable',
      question: 'What if the model I need is not available?',
      answer: ''
    },
    {
      value: 'training-vs-inference',
      question: 'What is the difference between training and inference?',
      answer: ''
    },
    {
      value: 'monitor-production',
      question: 'How can I monitor AI application behavior in production?',
      answer: ''
    },
    {
      value: 'manage-servers',
      question: 'Do I need to manage servers or clusters for scaling?',
      answer: ''
    },
    {
      value: 'autonomous-security',
      question: 'Can AI be used for autonomous security use cases?',
      answer: ''
    }
  ]
</script>

<template>
  <!-- ── Hero — centered band, one screen tall ──────────────────────────────────
       `pixelate` is the registered accent-lit grid this design's own hero art asks
       for (see header comment); the trust strip stands on the floor, inside the hero
       like every other Site page. -->
  <Hero
    texture="pixelate"
    kind="screen"
    align="center"
    max-width="site"
    carousel
    :carousel-marks="CLIENT_STRIP"
    class="[--banner-offset:3.5rem]"
  >
    <HeroTitle
      centered
      title="Build and deploy AI agents and applications in seconds"
      description="Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality."
      class="min-w-0"
    >
      <template #actions>
        <Button
          label="Start free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Docs"
          kind="outlined"
          size="large"
          href="/site/docs"
        />
      </template>
    </HeroTitle>
  </Hero>

  <!-- ══ The framed column ═════════════════════════════════════════════════════ -->
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <!-- ── Features — six capability cards, three-up ────────────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
          :mobile-columns="1"
        >
          <div
            v-for="feature in FEATURES"
            :key="feature.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg)"
          >
            <div
              class="flex size-11 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
            >
              <i
                :class="feature.icon"
                class="text-(length:--text-heading-sm) text-(--primary)"
                aria-hidden="true"
              />
            </div>
            <div class="flex flex-col gap-(--spacing-xs)">
              <h3 class="m-0 text-heading-xs text-(--text-default)">{{ feature.title }}</h3>
              <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Platform — "The Platform for Your AI Workloads" ─────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="The Platform for Your AI Workloads" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="2"
          :mobile-columns="1"
        >
          <div
            v-for="card in PLATFORM_CARDS"
            :key="card.title"
            class="flex flex-col justify-between gap-(--spacing-xxl) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <div class="flex flex-col gap-(--spacing-lg)">
              <div
                class="flex size-11 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
              >
                <i
                  :class="card.icon"
                  class="text-(length:--text-heading-sm) text-(--primary)"
                  aria-hidden="true"
                />
              </div>
              <div class="flex flex-col gap-(--spacing-md)">
                <h3 class="m-0 text-heading-md text-(--text-default)">{{ card.title }}</h3>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  {{ card.description }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-(--spacing-sm)">
              <Button
                label="Start now"
                kind="primary"
                size="large"
                @click="goSignup"
              />
              <Button
                label="Docs"
                kind="outlined"
                size="large"
                href="/site/docs"
              />
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Stack — "Compatible with your stack" ─────────────────────────────────
         The framework strip is static (see header comment); the quick-start panel is
         one FrameBox, the terminal art on the left bleeding the cell's padding the
         same way every two-up art cell on the site does. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Compatible with your stack" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex flex-col gap-(--spacing-xxl) p-(--spacing-xl)">
          <div
            class="flex flex-wrap items-center justify-center gap-(--spacing-xl) opacity-40"
            aria-hidden="true"
          >
            <i
              v-for="framework in FRAMEWORKS"
              :key="framework"
              :class="framework"
              class="text-(length:--text-heading-lg) text-(--text-muted)"
            />
          </div>

          <div
            class="grid overflow-hidden rounded-(--shape-card) border border-(--border-default) lg:grid-cols-2"
          >
            <!-- Decorative terminal art: a prompt glyph, three framework badges, and the
                 three commands the panel is inviting the reader to run. -->
            <div
              class="relative flex min-h-[20rem] flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-surface) p-(--spacing-xl)"
              aria-hidden="true"
            >
              <span class="text-label-code-lg text-(--text-default)">&gt;_</span>
              <div class="flex flex-col gap-(--spacing-xs)">
                <span
                  v-for="step in DEPLOY_STEPS"
                  :key="step"
                  class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-center text-label-code-sm text-(--text-default) shadow-(--shadow-sm)"
                  >{{ step }}</span
                >
              </div>
            </div>

            <div
              class="flex flex-col justify-between gap-(--spacing-xxl) border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
            >
              <div class="flex flex-col gap-(--spacing-lg)">
                <h3 class="m-0 text-heading-lg text-(--text-default)">
                  Quick start with templates
                </h3>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  Build faster with pre-built applications and starter kits for common use cases.
                  Deploy complete projects in seconds with popular frameworks.
                </p>
                <div class="grid grid-cols-2 gap-x-(--spacing-lg) gap-y-(--spacing-sm)">
                  <div
                    v-for="template in TEMPLATES"
                    :key="template.label"
                    class="flex items-center gap-(--spacing-xxs)"
                  >
                    <i
                      :class="template.icon"
                      class="text-(length:--text-body-sm) text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="text-body-sm text-(--text-muted)">{{ template.label }}</span>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  label="Deploy now"
                  kind="primary"
                  size="large"
                  @click="goSignup"
                />
              </div>
            </div>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Operate — "Operate AI With Speed, Reliability, and Cost Control" ─────
         Three rows beside a small network panel. The rows carry identical copy in the
         source (see header comment); shipped as designed. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Operate AI With Speed, Reliability, and Cost Control" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-2">
          <div class="flex flex-col">
            <div
              v-for="(row, index) in OPERATE_ROWS"
              :key="index"
              class="flex flex-col gap-(--spacing-sm) p-(--spacing-xl)"
              :class="index > 0 && 'border-t border-(--border-default)'"
            >
              <h3 class="m-0 text-heading-md text-(--text-default)">{{ row.title }}</h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                {{ row.description }}
              </p>
            </div>
          </div>

          <!-- The network panel: decorative, the registered `NetworkBanner` asset (see
               header comment) rather than a redrawn connector diagram. It paints its own
               absolute inset-0 layer plus its own copy-column scrim, so it drops straight
               into this relative cell with no extra wrapper. -->
          <div
            class="relative min-h-[20rem] overflow-hidden border-t border-(--border-default) bg-(--bg-canvas) lg:border-l lg:border-t-0"
          >
            <NetworkBanner />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Quotes — "Battle-Tested by the World's Largest Banks and E-commerce
         Companies" — three identical cards in the source (see header comment). ─── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Battle-Tested by the World's Largest Banks and E-commerce Companies" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
          :mobile-columns="1"
        >
          <div
            v-for="entry in QUOTES"
            :key="entry.key"
            class="flex flex-col justify-between gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <div class="flex items-center justify-between gap-(--spacing-md)">
              <span
                class="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-raised) text-label-code-sm text-(--text-muted)"
                aria-hidden="true"
                >{{ entry.initials }}</span
              >
              <span class="text-label-code-md uppercase tracking-wide text-(--text-muted)">{{
                entry.mark
              }}</span>
            </div>
            <blockquote class="m-0 flex flex-col gap-(--spacing-md)">
              <p class="m-0 text-pretty text-body-md text-(--text-default)">
                &ldquo;{{ entry.quote }}&rdquo;
              </p>
              <footer class="text-body-sm text-(--text-muted)">{{ entry.name }}</footer>
            </blockquote>
            <IconButton
              icon="pi pi-arrow-right"
              kind="primary"
              size="medium"
              :aria-label="`Read the ${entry.mark} case study`"
              href="#"
            />
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Primitives — "All the AI Primitives You Need" ───────────────────────
         Identical productGroups to AzionFunctions' ProductsMenu (see header comment). -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="All the AI Primitives You Need" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="4"
          :mobile-columns="2"
        >
          <NavColumn
            v-for="group in PRODUCT_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="product in group.items"
              :key="product.title"
              :icon="product.icon"
              :title="product.title"
              :description="product.description"
              :href="product.href || '#'"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Infrastructure — "Distributed infrastructure that stays up when others
         go down" — a network-backed band of chips, then a three-cell stat row. The
         two sit back to back with no gap in the source, so the second passes the
         same `flush` treatment as the first. ──────────────────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="relative min-h-[28rem] overflow-hidden">
          <!-- Decorative, the registered `NetworkBanner` asset (see header comment); it
               paints its own absolute inset-0 layer and its own copy-column scrim, so the
               heading and chips below stand on it with no extra wrapper mask. -->
          <NetworkBanner />
          <div class="relative z-10 flex flex-col gap-(--spacing-xxl) p-(--spacing-xxl)">
            <SectionTitle
              :framed="false"
              kind="left"
              size="medium"
              :eyebrow="NETWORK_BAND.eyebrow"
              :title="NETWORK_BAND.title"
              class="[&_h2]:max-w-[22em]"
            />
            <div class="flex flex-col gap-(--spacing-md)">
              <h3 class="m-0 text-heading-sm text-(--text-default)">
                {{ NETWORK_BAND.lead }}
              </h3>
              <div class="flex flex-wrap gap-(--spacing-sm)">
                <Badge
                  v-for="chip in NETWORK_CLAIMS"
                  :key="chip"
                  :label="chip"
                  severity="primary"
                  size="medium"
                />
              </div>
            </div>
          </div>
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
          :mobile-columns="1"
        >
          <div
            v-for="stat in INFRA_STATS"
            :key="stat.title"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg)"
          >
            <i
              :class="stat.icon"
              class="text-(length:--text-heading-lg) text-(--primary)"
              aria-hidden="true"
            />
            <h3 class="m-0 text-heading-xs text-(--text-default)">{{ stat.title }}</h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ stat.description }}
            </p>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── FAQ — ten closed questions; no answer copy in the source (header comment) ─ -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          class="grid gap-px bg-(--border-default) [--accordion-inset:var(--spacing-lg)] lg:grid-cols-3 lg:[--accordion-inset:var(--spacing-xl)]"
        >
          <div class="bg-(--bg-canvas) px-(--accordion-inset) py-(--spacing-md)">
            <h2 class="m-0 mt-(--spacing-md) text-balance text-heading-lg text-(--text-default)">
              Frequently Asked Questions
            </h2>
          </div>
          <div class="bg-(--bg-canvas) lg:col-span-2">
            <Accordion
              type="single"
              collapsible
              size="large"
            >
              <Accordion.Item
                v-for="(item, index) in FAQ"
                :key="item.value"
                :value="item.value"
                :class="[
                  'border-(--border-default) data-[state=open]:border-b',
                  index === FAQ.length - 1 && 'border-b-0 data-[state=open]:border-b-0'
                ]"
              >
                <Accordion.Trigger
                  class="border-b-0! py-(--spacing-md) data-[state=open]:min-h-0 data-[state=open]:pb-0"
                >
                  <span class="text-body-md text-(--text-default)">{{ item.question }}</span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <p
                    class="m-0 max-w-(--container-2xl) px-(--accordion-inset) pt-(--spacing-xs) pb-(--spacing-md) text-body-sm text-(--text-muted)"
                  >
                    {{ item.answer }}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── The closing CTA — the site's own band, this page's strings ─────────── -->
    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
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
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════════ -->
</template>
