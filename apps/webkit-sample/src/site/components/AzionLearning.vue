<script setup>
  // The Learning Center — a translation of https://www.azion.com/en/learning/ into this
  // site's own page language, produced with the /site-design-translate flow (the live page
  // read mechanically into a band inventory, then rebuilt band by band). The source is the
  // specification for WHAT the page says; the marketing bands are the specification for HOW
  // it is drawn. Every subject name, description and article label is the source's, verbatim,
  // and they live in ../data/learning.js so this file is the page's LAYOUT and nothing else.
  //
  // ── THE SOURCE IS ONE BAND, AND IT IS A LIBRARY ──
  //
  // The extractor finds a single band 2913px tall holding 16 subjects and 78 article links,
  // over a page head the band does not include:
  //
  //   an h1                 Learning Center
  //   a description         Practical knowledge to speed up, secure, and scale applications.
  //   a three-up card grid  one card per subject: its name, what it covers, its articles
  //
  // ── THE TWO BLOCKS ──
  //
  //   the page head         Hero kind="band" + Hero.Title, opening on the page boundary —
  //                         the pricing page's head
  //   the cards             CardGrid kind="divider", one cell per subject, verbatim
  //
  // The diff's `MISSING` list is empty: every subject name, description and article label the
  // source renders is on this page. There is no eyebrow and no section heading anywhere here
  // that the source does not write — the hero carries the source's `h1` and its one line, and
  // the grid opens straight under the hero rather than under a title this page made up.
  //
  // ── WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose ──
  //
  //   • THE HEAD BECOMES A HERO BAND. The source sets its h1 at the top of a scrolling column
  //     with the cards starting immediately under it. Ours is a `band`, as on the pricing page,
  //     so the library still starts inside the first screen. The source's single band renders
  //     as a hero plus a framed column; that is a change of FORM, not of content or running
  //     order, and the band counts on the two sides are not comparable for exactly this reason.
  //
  //   • THE CARDS DRAW NO BORDERS. The source outlines each card. Here the seams are
  //     `CardGrid`'s own `gap-px` over the rule colour and each cell fills the canvas, so
  //     three adjacent cards produce two rules rather than six (CONTAINERS.md § the hairline
  //     box grid).
  //
  //   • THE ARTICLES LEAVE THE DEMO. Every `href` is the article's real URL on azion.com,
  //     because that is where these 78 pages are; a demo that linked them at its own origin
  //     would 404 on every one.
  //
  //   • THE LINKS ARE NOT BLUE. The source paints them in its own link colour; ours take this
  //     site's link idiom — muted ink, underlined, resolving to the default colour on hover —
  //     because `--text-link` is the product UI's blue and nothing else on these pages uses
  //     it. Colour is form, and form is ours.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { LEARNING_SUBJECTS } from '../data/learning.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <Hero
    kind="band"
    max-width="5xl"
    size="large"
    carousel
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="CLIENT_STRIP"
  >
    <Hero.Title
      centered
      title="Learning Center"
      description="Practical knowledge to speed up, secure, and scale applications."
    >
      <template #actions>
        <Button
          label="See articles"
          kind="secondary"
          size="large"
          href="#subjects"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="/site/contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band after the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`, so the four sides read as one frame with no doubled lines. -->
  <SectionContainer max-width="site">
    <!-- ── The library ──────────────────────────────────────────────────────────
         The source's own grid: one card per subject, holding its name, what it covers, and
         every article in it. Each cell is a `FrameBox` ticking all four corners but drawing
         no borders — the seams are the grid's `gap-px`, and a bordered cell would double
         every one of them — and each fills the canvas, which is what turns those gaps into
         rules. The outer frame draws no ticks, because the corner cells already mark them. -->
    <SectionModule
      id="subjects"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <FrameBox
        flush
        borders="y"
        marks="none"
      >
        <!-- FOUR TRACKS, NOT THE SOURCE'S THREE, and the reason is the divider grid: an
             empty cell of one is not empty, it shows the grid's own `--border-default` fill
             as a grey slab. Sixteen subjects over three tracks leaves two of them in the last
             row; over the 1 / 2 / 4 ladder the rectangle closes at EVERY breakpoint
             (16 = 16x1 = 8x2 = 4x4). Track count is form, and form is ours. -->
        <CardGrid
          kind="divider"
          :columns="3"
          :mobile-columns="1"
        >
          <FrameBox
            v-for="subject in LEARNING_SUBJECTS"
            :key="subject.slug"
            :id="subject.slug"
            borders="none"
            marks="all"
            class="min-w-0 scroll-mt-(--spacing-xxl) bg-(--bg-canvas)"
          >
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
              <div class="flex flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ subject.title }}
                </h3>
                <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                  {{ subject.description }}
                </p>
              </div>

              <!-- The reset strips the bullets, which also strips list semantics in Safari;
                   the explicit role is what keeps the group and its length announced. -->
              <ul
                role="list"
                class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="article in subject.articles"
                  :key="article.href"
                >
                  <a
                    :href="article.href"
                    class="text-body-sm text-(--text-muted) underline underline-offset-2 transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
                  >
                    {{ article.label }}
                  </a>
                </li>
              </ul>
            </div>
          </FrameBox>

          <FrameBox
            borders="none"
            marks="all"
            class="min-w-0 bg-(--bg-surface-raised) sm:col-span-2"
          >
            <CallToAction
              kind="lead"
              eyebrow="Next step"
              class="h-full"
              title="Put what you learned to work."
              title-muted="On Azion."
              description="Deploy your first application in minutes, or talk to our team about your architecture."
            >
              <template #actions>
                <Button
                  label="Start Free"
                  kind="secondary"
                  size="large"
                  @click="goSignup"
                />
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
          </FrameBox>
        </CardGrid>
      </FrameBox>
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
</template>
