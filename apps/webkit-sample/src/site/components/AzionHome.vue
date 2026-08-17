<script setup>
  // Landing-page example: a faithful recreation of the azion.com homepage
  // structure, composed entirely from @aziontech/webkit components and theme
  // tokens. Rendered inside SiteLayout (website nav + footer, no console
  // sidebar). Sections, top to bottom: hero → framework strip → platform pillars
  // → feature highlights → stats band → developer/CLI section → customers
  // (#customers) → pricing teaser (#pricing) → final CTA (#contact).
  //
  // Layout is the framed grid of CONTAINERS.md, the same three-layer skeleton the
  // Hub and Docs homes use — no hand-rolled section wrappers:
  //
  //   BannerContainer hero  → the full-bleed hero band, exactly one viewport tall,
  //                           owning the page's top rule (border-b).
  //   SectionContainer      → the centered column below it, owning border-x.
  //   SectionModule         → each brick inside it, owning its own border-t and
  //                           its own padding (which is why the column is unpadded).
  //
  // The footer owns border-t, so every edge of the frame is drawn exactly once.
  //
  // That "exactly once" is the page's border discipline, and it holds two ways.
  // Where a brick meets a rule it does not own, it does not draw a second one: a
  // frame stacked under another is `flush` (its top rule lands ON the rule above
  // instead of beside it), a row of cells takes its seams from the grid's own
  // `gap-px` rather than from four sets of borders, and a component that would wrap
  // itself in its own bordered column is given `:framed="false"` inside this one.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  // Imported directly rather than through BannerContainer's `banner` prop: this
  // band is a FrameBox, not a BannerContainer, so there is no container to name
  // it on. The registry still owns it — this is its named export.
  import { MapBanner } from '@shared/ui/banners/index.js'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import PlatformIllustrations from '@shared/ui/illustration/PlatformIllustrations.vue'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { useRouter } from 'vue-router'

  import {
    ClaimChips,
    ClientMark,
    CLIENTS,
    NavColumn,
    NavItem,
    NETWORK_CLAIMS
  } from '../ui/index.js'
  import CapabilitiesSection from './CapabilitiesSection.vue'
  import ClientStories from './ClientStories.vue'
  import DeveloperSection from './DeveloperSection.vue'
  import PlatformShowcase from './PlatformShowcase.vue'
  import SiteCta from './SiteCta.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const clientNamed = (name) => CLIENTS.find((client) => client.name === name)

  // The platform primitives, grouped by capability. One <NavColumn> per group, one
  // <NavItem> per primitive — the site's own link row, built to the Figma
  // NavigationItem: registration-framed glyph, name, one line of what it does.
  //
  // Every row is a link, because on the site every product row is one — and the hover
  // state the design draws only exists on a link. `href` carries a real route where this
  // demo has one and falls back to the placeholder `#`, the same convention the mega-menu
  // rows in SiteNav already use for products with no page in the sample.
  const primitiveGroups = [
    {
      label: 'Compute',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run code globally, low latency',
          href: '/site/functions'
        },
        { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'High availability across origins'
        },
        {
          icon: 'pi pi-image',
          title: 'Image Processor',
          description: 'Optimize and modify images'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Low-latency distributed inference'
        },
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
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Distributed SQL with low latency'
        },
        { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Keep state close, fast' },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate delivery, boost reliability'
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
        {
          icon: 'pi pi-android',
          title: 'Bot Management',
          description: 'Stop bots, prevent abuse'
        },
        { icon: 'ai ai-edge-dns', title: 'DNS', description: 'Resilient DNS with performance' }
      ]
    }
  ]

  // The outcome row under the network panel: one benefit per registration-framed
  // cell, written as a single sentence — the claim itself in the default colour, the
  // rest of the line muted — and signed with the client mark of the workload it came
  // from. Reads as proof rather than as a scoreboard of loose numbers.
  //
  // PLACEHOLDER PAIRING: the numbers are the platform's published claims; which
  // client each is signed with is illustrative, the same placeholder convention
  // ClientStories already carries. Real attributions before this ships.
  const benefits = [
    { claim: '7x faster', line: 'page loads under peak retail traffic.', client: 'Magalu' },
    { claim: '90% lower', line: 'cloud spend after moving workloads to the edge.', client: 'GPA' },
    { claim: '40x more', line: 'simultaneous connections held per origin.', client: 'Itaú' },
    {
      claim: '100% of',
      line: 'OWASP Top 10 threats mitigated before the origin.',
      client: 'Coca-Cola'
    }
  ].map((benefit) => ({ ...benefit, mark: clientNamed(benefit.client) }))

  // Platform section — the six things the platform is, as a hairline grid beside the
  // headline. Each cell is one shape: a glyph-led label in the muted token, then the
  // claim itself in the default one, so the eye reads the six labels first and drops
  // into whichever paragraph it wants. Every cell carries a single paragraph of
  // comparable length, which is what lets the row tops line up without a fixed height.
  const platformPillars = [
    {
      icon: 'pi pi-globe',
      label: 'Infraestrutura global',
      description:
        'Totalmente gerenciada com mais de 100 datacenters globais, roteamento inteligente e failover automático para garantir alta disponibilidade.'
    },
    {
      icon: 'ai ai-edge-functions',
      label: 'Arquitetura serverless',
      description:
        'Execução sob demanda, sem servidores para gerenciar, com escalabilidade automática, eliminação de cold start e eficiência de recursos.'
    },
    {
      icon: 'ai ai-waf-rules',
      label: 'Segurança integrada e programável',
      description:
        'Proteção em tempo real para aplicações e APIs, com mitigação de DDoS, gestão de bots e políticas de segurança extensíveis por código.'
    },
    {
      icon: 'pi pi-code',
      label: 'Construa e implante onde quiser',
      description:
        'Arquitetura baseada em padrões abertos, compatível com seu stack atual. Sem lock-in, com portabilidade para executar workloads onde fizer mais sentido.'
    },
    {
      icon: 'ai ai-edge-storage',
      label: 'Armazenamento distribuído',
      description:
        'Armazenamento de objetos, banco de dados SQL e Key-Value serverless e distribuídos, que reduzem a latência e aumentam a performance.'
    },
    {
      icon: 'pi pi-verified',
      label: 'Plataforma moderna e confiável',
      description:
        'Arquitetura resiliente, com conformidade SOC 2 & 3, certificação PCI DSS 4.0.1 Nível 1 e 100% de disponibilidade garantida por SLA.'
    }
  ]
</script>

<template>
  <!-- ── Hero — the fluid banner band, exactly one viewport tall ───────────
       BannerContainer owns the full-bleed band and the page's top rule; the copy
       goes in the default slot (z-10) on plain canvas — the band carries no
       backdrop. `--banner-offset` is the sticky SiteNav's height (h-14 =
       3.5rem), so the hero still measures one screen with the nav above it. -->
  <BannerContainer
    hero
    max-width="7xl"
    class="[--banner-offset:3.5rem]"
  >
    <!-- The band holds two things, top to bottom: the copy, and the trust strip standing
         on the floor. The strip is part of the hero, not a band under it — so the wrapper
         declares the band's own height (`100dvh - --banner-offset`, less the container's
         own `py-xl` at each end) and hands the leftover to the copy with `justify-between`.
         That makes the band's `justify-center` a no-op instead of something to fight, and
         it is what puts the marks on the bottom edge of ONE screen rather than floating
         them a third of the way up it. Functions closes its hero the same way. -->
    <div
      class="flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-between gap-[var(--spacing-xxl)]"
    >
      <!-- Hero copy anatomy: headline → description → actions. No eyebrow here — the
           headline opens the page on its own, and its accent phrase carries the brand
           colour the overline used to.

           `flex-1` + `justify-center` is what keeps the headline optically centred in
           whatever the strip leaves rather than hanging from the nav. -->
      <div class="flex flex-1 flex-col justify-center">
        <HeroTitle
          centered
          highlight="Distributed Infrastructure"
          title="for Modern Workloads"
          description="Networking, compute, AI, data, and security that autonomously scale up and down instantly.
And it stays up when others go down."
        >
          <!-- The stacking and the fluid width belong to HeroTitle's actions row, so the
               CTAs go in bare. -->
          <template #actions>
            <Button
              label="Get started"
              kind="primary"
              size="large"
              @click="goSignup"
            />
            <Button
              label="Read the docs"
              kind="outlined"
              size="large"
              href="#contact"
            />
          </template>
        </HeroTitle>
      </div>

      <!-- Client marks close the hero, standing on its floor. No rule above them: the band's
           own border-b is the only line the hero draws, and the first thing under it is a
           hatched SectionGap — so the strip is divided from the copy by air and by that
           texture, not by a hairline of its own. (Functions closes the same way.) The old
           capability strip lived here; every line of it now has a row in the primitives grid
           below, so the hero keeps the headline and the proof, nothing else. -->
      <BrandCarousel
        label="Trusted by mission-critical workloads"
        :clients="CLIENTS"
      />
    </div>
  </BannerContainer>

  <!-- ══ The framed column ═════════════════════════════════════════════════
       Everything after the hero is a stack of SectionModule bricks inside one
       centered column. The column carries only `border-x`; its top edge is the
       hero's `border-b` and its bottom edge the SiteFooter's `border-t`, so the
       four sides read as one frame with no doubled lines. Each module owns its
       own `border-t` and its own padding — which is why the column is unpadded
       and no module ever draws a side border. -->
  <SectionContainer max-width="5xl">
    <!-- The column opens on a Spacer, hatched — the same first brick Functions puts under
         its hero. As the first frame in the column its `flush` top rule lands on the hero's
         border-b, and its bottom rule is what divides it from the module below, which is
         why that module draws none of its own. It is also what separates the hero's trust
         strip from the copy that follows: the texture does the dividing, so the strip needs
         no rule of its own above it. -->
    <SectionGap hatch />

    <!-- ── Platform primitives ──────────────────────────────────────────────
         First module in the column: `:divided="false"`, because its top edge is
         already the hatched Spacer's bottom rule.

         A framed headline block over a four-column hairline grid, one column per
         capability — <NavColumn> and <NavItem>, the site's own link set, built to
         the Figma pair. The column heading sits over its own rule and shares the
         `lg` inset with the rows beneath it, so the label and every product name
         start on ONE content column; the grid's `gap-px` draws the seams, which is
         why no column carries a border of its own. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          title="Serverless AI-Native Primitives for Autonomous Workloads"
          description="Every primitive stands on its own and shares the same network, identity, and observability. Compose only what a workload needs, and add the rest without moving anything."
        />
      </template>

      <!-- The menu is a registration-framed band. Only `y` — its left and right edges are
           the column's own border-x, and drawing them here would put two hairlines on one
           line. `flush` and `marks="bottom"` say the same thing about the rule ABOVE: the
           SectionTitle in the `#header` slot is itself a frame and already draws its own
           bottom rule and its own bottom pair of ticks, so this band draws neither again —
           it takes that junction as given and owns only its floor. -->
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="2"
        >
          <NavColumn
            v-for="group in primitiveGroups"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href || '#'"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Network ──────────────────────────────────────────────────────────
         The infrastructure claim, framed: copy + claim chips on the left, the
         animated globe on the right, then the outcome numbers as their own row of
         registration-framed cells.

         Every rule and every tick here is drawn exactly once. `borders="y"` on the
         full-width panel hands the vertical rules back to the column; `flush` drops its
         top rule onto the section gap's bottom one instead of beside it, and
         `marks="bottom"` does the same for the ticks — the gap above already registers
         that junction, so the panel marks only its own floor. The benefit row below it
         carries no borders of its own — its seams are the grid's `gap-px` over the border
         colour, so four adjacent cells produce three hairlines rather than six.
         Padding lives inside the frames only. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <div class="flex flex-col">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
          class="overflow-hidden"
        >
          <!-- The network itself, as the frame's backdrop: the pixel world map,
               its route picked out in the accent. It parks in the RIGHT part of
               the band (see --map-inset-inline-start in MapBanner), so it reads
               as the art half beside the copy rather than spanning the whole
               frame behind it; its scrims stay full-bleed and wash left-to-right
               into the artwork's leading edge. The min-height is what the globe
               used to hold open. -->
          <MapBanner />
          <div class="relative z-10 grid items-center gap-[var(--spacing-xl)] lg:grid-cols-2">
            <!-- Copy hangs from the top edge rather than centring in the band: the map
                 behind it is a full-height backdrop, so a centred block floated in the
                 middle of the frame with no edge to hold onto.

                 Below lg the map is no longer the art half beside the copy — it sits
                 nearly full-bleed behind it — so the block splits instead: the title
                 keeps a modest top pad and the claim chips are pushed to the floor of
                 the band, which puts the map's own body between them rather than behind
                 a solid stack of copy. From lg the copy has its own column again, hangs
                 from the top edge, and falls back to the frame's vertical rhythm. -->
            <div
              class="flex min-h-[clamp(340px,52vh,620px)] flex-col justify-between gap-[var(--spacing-xl)] px-[var(--spacing-xl)] pt-[clamp(2rem,7vh,3.25rem)] pb-[var(--spacing-xl)] lg:justify-start lg:py-[var(--spacing-xxl)] lg:pt-[var(--spacing-xxl)]"
            >
              <h2 class="text-balance text-heading-2xl text-[var(--text-default)]">
                The most reliable infrastructure
              </h2>
              <!-- The claim chips, from the shared list and the shared treatment
                   (`ui/claims.js` + `ClaimChips`) — the same ones the signed-out
                   NetworkPanel puts under its headline, so the two surfaces cannot
                   quote different numbers at the same person minutes apart. -->
              <ClaimChips :claims="NETWORK_CLAIMS" />
            </div>
            <!-- Second cell intentionally empty: the map behind IS the art half. -->
          </div>
        </FrameBox>

        <!-- The benefit row: claim on top, client mark on the floor of every cell.
             `justify-between` is what aligns the marks with each other — the copy
             hangs from the top edge, the mark sits on the bottom one, so the row
             reads as a single baseline no matter how long a sentence runs.

             The ROW is the frame, not the cells. Its seams are the grid's `gap-px`
             showing the wrapper's border colour, the way every other hairline grid on
             this page is built — four bordered cells butted together would draw each
             internal seam twice and the outer two a third time against the column's own
             `border-x`, and four marked cells would put a pair of ticks either side of
             every seam. (`class="border-0"` did not prevent that: it is one border-width
             utility against FrameBox's own, and the frame kept drawing all four rules.)

             So the cells declare `borders="none" marks="none"` and the row's own FrameBox
             owns the one edge nothing else draws — its floor, and the pair of ticks that
             register it. The top rule and its ticks are the panel's above; the sides are
             the column's; the SectionGap below is `flush`, so it takes this floor as its
             own ceiling. -->
        <FrameBox
          borders="bottom"
          marks="bottom"
        >
          <div class="grid grid-cols-2 gap-px bg-[var(--border-default)] lg:grid-cols-4">
            <FrameBox
              v-for="benefit in benefits"
              :key="benefit.client"
              borders="none"
              marks="none"
              class="min-w-0 bg-[var(--bg-canvas)]"
            >
              <div
                class="flex h-full flex-col justify-between gap-[var(--spacing-xl)] p-[var(--spacing-xl)]"
              >
                <p class="m-0 text-pretty text-heading-sm text-[var(--text-muted)]">
                  <span class="font-medium text-[var(--text-default)]">{{ benefit.claim }}</span>
                  {{ benefit.line }}
                </p>
                <!-- The signature strip: a fixed 24px band every cell reserves, so the
                     four marks land on exactly one line and one left edge however long
                     the sentence above them runs. The band is also what keeps a flex
                     column from stretching a `w-auto` image sideways. -->
                <div
                  v-if="benefit.mark"
                  class="flex h-6 items-center"
                >
                  <ClientMark
                    colored
                    :client="benefit.mark"
                    mark="h-full w-auto max-w-32 object-contain object-left"
                  />
                </div>
              </div>
            </FrameBox>
          </div>
        </FrameBox>
      </div>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── Plataforma ───────────────────────────────────────────────────────
         The one section whose title does NOT sit centred over its body: the header is
         its own row — headline held against the left rule, description and actions
         against the right one — and the six pillars run the full width underneath.
         SectionTitle is the centred opener and would fight that, so this module
         composes its own header band: the same anatomy (overline → h2 → description
         → actions), laid on its side and pushed out to both edges.

         The band is ONE cell, not two: `justify-between` over the module's full width
         with no rule down the middle, so what separates the headline from the copy is
         the empty span between them rather than a border. That is the industrial move
         — the copy is registered to the frame's own edges, and the only lines in the
         module are the ones the grid already draws.

         Both blocks are `items-start`, and every line of type is left-aligned — the
         house setting for a title. So the two hang from the band's top edge and open
         on the same line, exactly like the pillar cells below them.

         The whole module is one hairline grid: `gap-px` over the border colour, every
         cell filling `--bg-canvas`, so the rule between the header and the pillars is
         the same 1px the pillars divide each other with.

         Across the full width the pillars go three-up instead of two — six cells as two
         rows of three, so no cell stretches to half the page.

         The BAND is the frame, and the cells inside it are not. Every interior cell is
         `borders="none" marks="none"`: its four edges are already drawn by the grid's
         `gap-px` (or by the column, at the module's outer edges), and a tick per cell
         corner would cluster four squares around every internal junction of the lattice
         instead of registering it once.

         The outer FrameBox is the band: `borders="y"` hands the vertical rules back to the
         column (which is why SectionModule passes `:divided="false"`), `flush` drops its
         top rule onto the SectionGap above instead of beside it, and `marks="bottom"`
         registers the one corner pair nothing else draws — the gap above already ticks the
         junction they share. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid gap-px bg-[var(--border-default)]">
          <!-- Header band: headline at the start edge, description + actions at the end
             edge. `gap-xxl` is the floor on the span between them — below `lg` the two
             blocks stack and that same gap becomes the vertical air.

             A cell like the pillars under it, and drawing as little: the module's rules
             and its ticks are the band's, so this one contributes only its fill. -->
          <FrameBox
            borders="none"
            marks="none"
            class="bg-[var(--bg-canvas)]"
          >
            <div
              class="flex flex-col gap-[var(--spacing-xxl)] p-[var(--spacing-xl)] lg:flex-row lg:items-start lg:justify-between"
            >
              <div class="flex flex-col gap-[var(--spacing-md)] lg:max-w-[52%]">
                <Overline
                  prefix="//"
                  show-cursor
                  >Plataforma</Overline
                >
                <!-- `text-heading-lg` is the section-title token — the same size SectionTitle
                 sets on every other section's h2, so this left-aligned opener carries the
                 same weight as the centred ones. -->
                <h2 class="m-0 text-balance text-heading-lg text-[var(--text-default)]">
                  Plataforma Completa de Desenvolvimento e Segurança de Aplicações
                </h2>
              </div>

              <!-- The end block: pinned to the module's right rule by the band's
               `justify-between`, but set left-aligned like every other block of copy on
               the page — the edge is what the block registers to, not the ragged line. -->
              <div class="flex flex-col items-start gap-[var(--spacing-lg)] lg:max-w-[36%]">
                <p class="m-0 text-pretty text-body-lg text-[var(--text-muted)]">
                  Infraestrutura, runtime, dados e segurança em um só lugar — para construir,
                  distribuir e proteger aplicações modernas sem montar a plataforma peça por peça.
                </p>

                <div
                  class="flex flex-col items-stretch gap-[var(--spacing-sm)] sm:flex-row sm:items-center"
                >
                  <Button
                    label="Comece agora"
                    kind="primary"
                    size="large"
                    @click="goSignup"
                  />
                  <Button
                    label="Fale com um especialista"
                    kind="outlined"
                    size="large"
                    href="#contact"
                  />
                </div>
              </div>
            </div>
          </FrameBox>

          <!-- Three columns, two rows. Every cell is the same shape — glyph-led label
             over one paragraph — and `items-start` is what the design asks for by
             "aligned on top": the copy hangs from each cell's top edge rather than
             centring inside whatever height the tallest paragraph forces.

             The cells carry the SAME `xl` padding as the header cells above them, so
             the first pillar's label sits on the header's own inset and every cell's
             copy shares one left edge. Anything smaller here and the two halves of the
             module would open on different lines. -->
          <CardGrid
            variant="divider"
            :columns="3"
          >
            <FrameBox
              v-for="pillar in platformPillars"
              :key="pillar.label"
              borders="none"
              marks="none"
              class="bg-[var(--bg-canvas)]"
            >
              <div
                class="flex h-full flex-col items-start gap-[var(--spacing-sm)] p-[var(--spacing-xl)]"
              >
                <p class="m-0 flex items-center gap-[var(--spacing-xs)] text-body-sm">
                  <i
                    :class="[pillar.icon, 'text-body-md text-[var(--text-muted)]']"
                    aria-hidden="true"
                  />
                  <span class="text-[var(--text-muted)]">{{ pillar.label }}</span>
                </p>
                <p class="m-0 text-pretty text-body-md text-[var(--text-default)]">
                  {{ pillar.description }}
                </p>
              </div>
            </FrameBox>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── What you build on it (Figma node 1626:7014) ──────────────────────
         The argument in a column that spans the band, and the four things the
         platform is for as a bento beside it. -->
    <CapabilitiesSection />

    <SectionGap hatch />

    <!-- ── Deploy — drawn beside running ─────────────────────────────────────
         The Deploy scene as illustrated, next to the same deploy actually playing back
         in the LogView widget, 50/50. The catalogue of six scenes this section used to
         open with is gone from the home page — it documents the illustration language
         rather than the product, so it now lives only where that is the subject (the
         Hub's assets page renders the full set). -->
    <!-- `:framed="false"`: the component wraps itself in its own SectionContainer by
         default (it is also used as a standalone page band). Inside this page's column
         that would nest one bordered column in another at the same width, drawing both
         side rules twice for the whole height of the block. -->
    <PlatformIllustrations
      deploy-only
      :framed="false"
    />

    <SectionGap hatch />

    <!-- ── Why Azion — the four-panel proof grid (Figma node 365:113958) ─────
         Branch graph, credentials table, control plane, usage chart. The component
         already implemented this design; it carries the Figma's overline now. -->
    <PlatformShowcase />

    <SectionGap hatch />

    <!-- ── Client stories (Figma node 365:114155) ──────────────────────────── -->
    <ClientStories />

    <SectionGap hatch />

    <!-- ── Developer / AI band (Figma node 365:114094) ─────────────────────── -->
    <DeveloperSection />

    <SectionGap hatch />

    <!-- ── Closing CTA (Figma node 365:114207) ─────────────────────────────── -->
    <SiteCta />

    <!-- The Spacer the design closes the column with, hatched: the one band on the page
         with no content of its own, so the texture reads as the page's own material.

         A bare FrameBox rather than SectionGap, at that component's own `medium` height,
         because this one must draw NO rules. The footer below opens with a full-bleed rule
         the way the hero closes with one, and SectionGap's fixed `borders="y"` would put a
         second hairline on that same pixel across the column's width. Its sides stay the
         column's border-x, as everywhere else on the page. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════ -->
</template>
