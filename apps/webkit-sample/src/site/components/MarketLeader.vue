<script setup>
  import forrester from '@aziontech/webkit/assets/logos/forrester.svg'
  import forresterReversed from '@aziontech/webkit/assets/logos/forrester-reversed.svg'
  import frost from '@aziontech/webkit/assets/logos/frost-and-sullivan.svg'
  import frostReversed from '@aziontech/webkit/assets/logos/frost-and-sullivan-reversed.svg'
  import g2 from '@aziontech/webkit/assets/logos/g2.svg'
  import gartner from '@aziontech/webkit/assets/logos/gartner.svg'
  import gartnerReversed from '@aziontech/webkit/assets/logos/gartner-reversed.svg'
  import gigaom from '@aziontech/webkit/assets/logos/gigaom.svg'
  import gigaomReversed from '@aziontech/webkit/assets/logos/gigaom-reversed.svg'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Quote from '@aziontech/webkit/quote'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'

  const FIRMS = {
    gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
    forrester: { name: 'Forrester', logo: forresterReversed, logoLight: forrester },
    gartner: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
    frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost },
    g2: { name: 'G2', logo: g2, logoLight: g2 }
  }

  // Every claim below is sourced from the analyst-reports index in the Azion KB
  // (analyst-reports/analyst-recognitions-by-year.md): firm, report, position and date
  // as the index records them. Courtesy copies there are marked not-for-distribution,
  // so nothing is quoted from a report body — only the position the index states.
  const recognitions = [
    {
      text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
      name: 'GigaOm Radar for Full-Stack Edge Deployments v3',
      jobTitle: 'May 2026',
      firm: FIRMS.gigaom
    },
    {
      text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
      name: 'The Forrester Wave™: Edge Development Platforms',
      jobTitle: 'March 2026',
      firm: FIRMS.forrester
    },
    {
      text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
      name: 'Gartner Market Guide for Edge Distribution Platforms',
      jobTitle: 'November 2025',
      firm: FIRMS.gartner
    },
    {
      text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
      name: 'Frost & Sullivan Latin America Company of the Year',
      jobTitle: 'June 2026',
      firm: FIRMS.frost
    },
    {
      text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
      name: 'GigaOm Radar for Application and API Security v5',
      jobTitle: 'March 2026',
      firm: FIRMS.gigaom
    },
    {
      text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
      name: 'G2 Reports',
      jobTitle: 'March 2026',
      firm: FIRMS.g2
    },
    {
      text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
      name: 'G2 Reports',
      jobTitle: 'December 2025',
      firm: FIRMS.g2
    }
  ]

  const SECONDS_PER_CARD = 12

  const passDuration = `${recognitions.length * SECONDS_PER_CARD}s`
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
      marks="all"
    >
      <div
        role="region"
        aria-label="Analyst recognitions"
        tabindex="0"
        class="group/loop overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:overflow-x-auto"
      >
        <div
          :style="{ animationDuration: passDuration }"
          class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
        >
          <ul
            v-for="copy in 2"
            :key="copy"
            :data-duplicate="copy === 2 || null"
            :aria-hidden="copy === 2 ? 'true' : undefined"
            class="m-0 flex w-max shrink-0 list-none p-0 motion-reduce:data-[duplicate]:hidden"
          >
            <li
              v-for="(recognition, index) in recognitions"
              :key="`${copy}-${index}`"
              class="flex w-[85vw] max-w-(--container-md) shrink-0 sm:w-(--container-md)"
            >
              <FrameBox
                borders="right"
                marks="all"
                class="w-full bg-(--bg-surface)"
              >
                <Quote
                  kind="signed"
                  :text="recognition.text"
                  :name="recognition.name"
                  :job-title="recognition.jobTitle"
                  class="p-(--spacing-xl)"
                >
                  <template #mark>
                    <ClientMark
                      :client="recognition.firm"
                      mark="h-8 w-auto max-w-40 object-contain"
                    />
                  </template>
                </Quote>
              </FrameBox>
            </li>
          </ul>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
