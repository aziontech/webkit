<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Topic from '@aziontech/webkit/topic'
  import { useRouter } from 'vue-router'

  import { quotesLedBy } from '../data/solutions.js'
  import {
    SUPPORT_CLOSING,
    SUPPORT_FAQ,
    SUPPORT_HERO,
    SUPPORT_MARKS,
    SUPPORT_PRICING_LINK,
    SUPPORT_REASONS,
    SUPPORT_SECTIONS,
    SUPPORT_TIERS
  } from '../data/support.js'
  import PricingComparison from './PricingComparison.vue'

  const router = useRouter()

  const CONTACT = '/site/contact'
  const CLIENT_STORIES = '/site/success-cases'

  const QUOTES = quotesLedBy('contabilizei')

  const go = (event, to) => {
    event?.preventDefault?.()
    router.push(to)
  }

  const choose = (tier) => router.push(tier.action.to)

  const [pricingLead, pricingTail] = SUPPORT_FAQ.find(
    (item) => item.value === 'pricing'
  ).answer.split(SUPPORT_PRICING_LINK.label)
</script>

<template>
  <Hero
    kind="band"
    size="large"
    max-width="site"
    texture="dots"
    texture-fade="top"
    carousel
    :carousel-label="SUPPORT_HERO.carouselLabel"
    :carousel-marks="SUPPORT_MARKS"
  >
    <Hero.Title
      centered
      max-width="2xl"
      :eyebrow="SUPPORT_HERO.eyebrow"
      eyebrow-prefix="//"
      :title="SUPPORT_HERO.title"
      :description="SUPPORT_HERO.description"
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="go($event, '/signup')"
        />
        <Button
          label="Contact Us"
          kind="outlined"
          size="large"
          :href="CONTACT"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          @click="go($event, CONTACT)"
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionGap hatch />

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
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="reason in SUPPORT_REASONS"
            :key="reason.title"
            kind="canvas"
          >
            <Topic
              :heading-level="2"
              :icon="reason.icon"
              :title="reason.title"
              :description="reason.description"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="tiers"
      :divided="false"
      :padded="false"
    >
      <PricingComparison
        :plans="SUPPORT_TIERS"
        :sections="SUPPORT_SECTIONS"
        caption="Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers."
        column-label="Support"
        @select="choose"
      />
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
      >
        <QuoteTabs
          aria-label="Client stories"
          :items="QUOTES"
        >
          <template #actions>
            <Button
              label="Clients"
              kind="secondary"
              size="large"
              :href="CLIENT_STORIES"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
              @click="go($event, CLIENT_STORIES)"
            />
          </template>
        </QuoteTabs>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="faq"
      :divided="false"
      :padded="false"
    >
      <Faq
        framed
        title="Frequently Asked Questions"
        :items="SUPPORT_FAQ"
      >
        <template #answer="{ item }">
          <template v-if="item.value === 'pricing'"
            >{{ pricingLead
            }}<a
              :href="SUPPORT_PRICING_LINK.href"
              target="_blank"
              rel="noopener"
              class="text-(--text-default) underline underline-offset-2 transition-colors duration-150 ease-out hover:text-(--primary) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
              >{{ SUPPORT_PRICING_LINK.label }}</a
            >{{ pricingTail }}</template
          >
          <template v-else>{{ item.answer }}</template>
        </template>
      </Faq>
    </SectionModule>

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
        :eyebrow="SUPPORT_CLOSING.eyebrow"
        :title="SUPPORT_CLOSING.title"
        :description="SUPPORT_CLOSING.description"
      >
        <template #actions>
          <Button
            :label="SUPPORT_CLOSING.action.label"
            kind="secondary"
            size="large"
            :href="SUPPORT_CLOSING.action.to"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
            @click="go($event, SUPPORT_CLOSING.action.to)"
          />
        </template>
        <template #aside>
          <Button
            :label="SUPPORT_CLOSING.aside.label"
            kind="outlined"
            size="large"
            :href="SUPPORT_CLOSING.aside.to"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
            @click="go($event, SUPPORT_CLOSING.aside.to)"
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
