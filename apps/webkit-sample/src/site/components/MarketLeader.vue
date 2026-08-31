<script setup>
  // Recognized as a Market Leader — azion.com/en bands 14 + 15.
  //
  // The analyst recognitions: a centred title band over one cell per award, each stating
  // what was recognized and who said it. The source runs these as a three-up carousel
  // with chevrons; here they are a four-up hairline grid, because all four fit the page
  // frame at once and a row you cannot over-scroll needs no controls
  // (.claude/rules/dependencies.md — a carousel is not a dependency we take on to show
  // four cards).
  //
  // Each cell leads with the REPORT VENDOR'S MARK, the way the source does — the badge or
  // wordmark of whoever made the call, then the call, then which report it came from.
  // The mark is the fastest way to read a row of recognitions: the eye lands on who said
  // it before reading what was said.
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionTitle from '@aziontech/webkit/section-title'
  // `fill="currentColor"`, which has no inherited colour inside an <img> and so resolves
  // to black — inverted to white for this band.
  import g2 from '@shared/ui/brand/clients/g2-logo.svg'
  // THE FOLDER NAME IS NOT THE ARTWORK. `light/` here holds the WHITE lockups
  // (`fill="#fff"`) and `dark/` the dark ones (`#1E1E1E`) — the folder records which
  // theme the file was exported FOR, and the fills record what it draws. This band is on
  // the site's dark canvas, so it takes the white pair for the two wordmarks. Same trap
  // the Caixa mark carries in the client registry; classified by reading the fills.
  import frostAndSullivan from '@shared/ui/brand/clients/light/frostandsullivan-logo.svg'
  import gigaom from '@shared/ui/brand/clients/light/gigaom-logo.svg'
  import { CardGrid, SectionModule } from '@shared/ui/layout/index.js'

  // Mark, claim, then source, in the source page's order. `markClass` is per-vendor
  // geometry, not decoration: G2 is a round badge and the other two are wide wordmarks,
  // so one height for all three would set the badge tiny beside them. Each is sized to
  // read at the same weight in its cell — the same reason the client strip passes its
  // mark geometry from the call site.
  const awards = [
    {
      logo: g2,
      markClass: 'h-8 w-8 invert',
      claim:
        'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
      source: 'G2 Spring 2026 Reports'
    },
    {
      logo: g2,
      markClass: 'h-8 w-8 invert',
      claim:
        'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
      source: 'G2 Winter 2026 Reports'
    },
    {
      logo: gigaom,
      markClass: 'h-5 w-auto max-w-40 object-contain object-left',
      claim:
        'Named a Leader and the only edge platform built specifically for that purpose, whose capabilities meet all key criteria in the report.',
      source: 'GigaOm Radar for Edge Platforms'
    },
    {
      logo: frostAndSullivan,
      markClass: 'h-8 w-auto max-w-40 object-contain object-left',
      claim:
        "Awarded in the Edge Serverless Computing category and recognized for consistently exceeding its customers' performance expectations.",
      source: '2023 North American New Product Innovation Award'
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle title="Recognized as a Market Leader" />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        variant="divider"
        :columns="4"
        :mobile-columns="1"
      >
        <!-- `justify-between` is what puts every source line on one baseline: the mark and
             the claim hang from the cell's top edge and the attribution stands on its
             floor, however long the claim above it runs. The mark sits in a fixed 32px
             band for the same reason the client strip reserves one — a round badge and a
             wide wordmark then start every claim on exactly one line. -->
        <div
          v-for="award in awards"
          :key="award.source"
          class="flex min-w-0 flex-col justify-between gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xl)"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="flex h-8 items-center">
              <!-- Decorative: the attribution on the cell's floor names the vendor in
                   type, so the mark repeating it would be read out twice. -->
              <img
                :src="award.logo"
                alt=""
                aria-hidden="true"
                decoding="async"
                :class="award.markClass"
              />
            </div>
            <p class="m-0 text-pretty text-heading-sm text-(--text-default)">{{ award.claim }}</p>
          </div>
          <p class="m-0 text-pretty text-body-sm text-(--text-muted)">{{ award.source }}</p>
        </div>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
