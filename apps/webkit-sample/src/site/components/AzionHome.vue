<script setup>
  import rennerColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import NetworkMap from '@aziontech/webkit/network-map'
  import Quote from '@aziontech/webkit/quote'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { PLATFORM_PRIMITIVES } from '../data/platform-primitives.js'
  import { ClientMark, CLIENTS, NETWORK_BAND, NETWORK_CLAIMS } from '../ui/index.js'
  import ClientStories from './ClientStories.vue'
  import MarketLeader from './MarketLeader.vue'
  import WhyAzion from './WhyAzion.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  const clientNamed = (name) => CLIENTS.find((client) => client.name === name)

  const outcomes = [
    {
      key: 'dafiti',
      mark: clientNamed('Dafiti'),
      ink: 'white',
      text: '86% faster load times, with a 45% cost reduction in data transfer.',
      highlights: ['86% faster load times', '45% cost reduction']
    },
    {
      key: 'madeiramadeira',
      mark: clientNamed('MadeiraMadeira'),
      ink: 'white',
      text: '90% lower cloud costs, and faster product delivery at scale.',
      highlights: ['90% lower cloud costs']
    },
    {
      key: 'renner',
      mark: { name: 'Renner', logoLight: rennerColor },
      ink: 'brand',
      text: '67% saved on data transfer costs, through massive traffic spikes.',
      highlights: ['67% saved']
    },
    {
      key: 'fourbank',
      mark: clientNamed('Fourbank'),
      ink: 'white',
      text: 'DDoS mitigated on applications and APIs, behind a programmable security layer.',
      highlights: ['DDoS mitigated']
    }
  ]
</script>

<template>
  <Hero
    kind="screen"
    align="center"
    max-width="site"
    texture="dots"
    texture-fade="top"
    carousel
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="CLIENT_STRIP"
  >
    <Hero.Title
      centered
      max-width="xl"
      highlight="Invisible Infrastructure"
      title="for the Speed of AI"
      description="Compute, AI, data, security, and observability primitives that run autonomously and scale instantly on 100+ data centers worldwide. One platform, from idea to mission-critical."
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="#contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Serverless AI-Native Primitives for Autonomous Workloads" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          aria-label="Platform primitives"
        >
          <ColumnNavigation.Column
            v-for="group in PLATFORM_PRIMITIVES"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
        class="relative overflow-hidden"
      >
        <NetworkMap
          region="world"
          position="top-right"
          animated
          fade="left"
          :opacity="0.3"
          density="medium"
          :scale="1.3"
          :offset-x="0.4"
          :offset-y="-0.2"
          class="max-md:hidden"
        />

        <div class="relative flex h-full flex-col">
          <div
            class="relative flex min-h-[clamp(340px,52vh,620px)] flex-col justify-start gap-(--spacing-xl) p-(--spacing-xxl) lg:justify-between"
          >
            <NetworkMap
              region="world"
              position="bottom"
              animated
              fade="none"
              :opacity="0.3"
              density="medium"
              :scale="2"
              :offset-x="0.19"
              :offset-y="0.085"
              class="md:hidden"
            />

            <SectionTitle
              :framed="false"
              kind="left"
              size="medium"
              :eyebrow="NETWORK_BAND.eyebrow"
              :title="NETWORK_BAND.title"
              class="relative [&_h2]:max-w-[22em]"
            />

            <div class="relative flex flex-col gap-(--spacing-md)">
              <h3 class="m-0 text-heading-sm text-(--text-default)">
                {{ NETWORK_BAND.lead }}
              </h3>

              <ul
                class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="claim in NETWORK_CLAIMS"
                  :key="claim"
                  class="inline-flex h-6 items-center rounded-(--shape-elements) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default)"
                >
                  {{ claim }}
                </li>
              </ul>
            </div>
          </div>

          <CardGrid
            flush
            kind="frame"
            :columns="4"
            class="border-t border-(--border-default)"
          >
            <CardGrid.Cell
              v-for="outcome in outcomes"
              :key="outcome.key"
              kind="canvas"
            >
              <Quote
                :text="outcome.text"
                :highlights="outcome.highlights"
                class="h-full"
              >
                <template #mark>
                  <ClientMark
                    :client="outcome.mark"
                    :colored="outcome.ink === 'brand'"
                    :monochrome="outcome.ink === 'white'"
                    mark="h-full w-auto max-w-32 object-contain"
                  />
                </template>
              </Quote>
            </CardGrid.Cell>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <WhyAzion />

    <SectionGap hatch />

    <MarketLeader />

    <SectionGap hatch />

    <ClientStories />

    <SectionGap hatch />

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
        title="Build, run, and protect applications."
        title-muted="Everywhere."
        description="Get faster launches, lower latency, and less infrastructure overhead from day one."
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
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
