<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import {
    BILLING_PERIODS,
    COMPARISON_SECTIONS,
    FAQ,
    ON_DEMAND_LINK,
    PLANS,
    PRICING_REASONS,
    PRIMITIVE_GROUPS
  } from '../data/pricing.js'
  import PricingComparison from './PricingComparison.vue'

  const router = useRouter()

  const openDestination = (event, item) => {
    if (!item.href.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  const period = ref('monthly')

  const cards = computed(() =>
    PLANS.map((plan) => {
      const price = plan.price[period.value]
      return { ...plan, ...price, caveat: price.details || plan.description }
    })
  )

  const choose = (plan) => {
    if (plan.action.to.startsWith('#')) {
      document.querySelector(plan.action.to)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    router.push(plan.action.to)
  }

  const goSignup = () => router.push('/signup')
</script>

<template>
  <Hero max-width="site">
    <Hero.Title
      centered
      max-width="2xl"
      eyebrow="Pricing"
      title="Infrastructure without the waste"
      description="Distributed by design, extremely fast, and built for the strictest compliance. No idle clusters, no capacity provisioned just in case. Scale from zero to mission-critical and pay only for what you use."
    />
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      id="plans"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex justify-center border-b border-(--border-default) p-(--spacing-md)">
          <SegmentedButton
            v-model="period"
            :options="BILLING_PERIODS"
            aria-label="Billing period"
          />
        </div>
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <CardPricing
            v-for="card in cards"
            :key="card.id"
            aligned
            slot-position="middle"
            kind="transparent"
            :class="card.highlighted ? 'bg-(--bg-surface)' : 'bg-(--bg-canvas)'"
            :plan-title="card.name"
            :value="card.value"
            :prefix="card.prefix"
            :suffix="card.suffix"
            :show-prefix="Boolean(card.prefix)"
            :show-suffix="Boolean(card.suffix)"
            :pricing-details="card.caveat"
            :show-tag="card.highlighted"
            :tag-label="card.tagLabel"
            action-label=""
            :data-testid="`pricing-card-${card.id}`"
          >
            <div class="flex flex-col gap-(--spacing-md)">
              <p class="m-0 text-body-sm text-(--text-muted)">{{ card.featuresTitle }}</p>
              <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                <li
                  v-for="feature in card.features"
                  :key="feature.label"
                  class="flex items-start gap-(--spacing-sm)"
                >
                  <i
                    :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']"
                    aria-hidden="true"
                  />
                  <span class="text-body-sm text-(--text-default)">{{ feature.label }}</span>
                </li>
              </ul>
            </div>

            <template #actions>
              <Button
                :label="card.action.label"
                :kind="card.action.kind"
                size="large"
                class="w-full"
                @click="choose(card)"
              />
            </template>
          </CardPricing>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="why-pricing"
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
          <CardGrid.Cell
            v-for="reason in PRICING_REASONS"
            :key="reason.key"
            kind="canvas"
            :padded="false"
          >
            <MediaTile
              kind="plain"
              :title="reason.title"
              :description="reason.description"
              :media-scale="reason.scale"
              fluid
            >
              <template #media>
                <Illustration :name="reason.illustration" />
              </template>
            </MediaTile>
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="comparison"
      :divided="false"
      :padded="false"
    >
      <PricingComparison
        :plans="PLANS"
        :sections="COMPARISON_SECTIONS"
        :link="ON_DEMAND_LINK"
        @select="choose"
      />
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Platform primitives"
          title="Serverless AI-Native Primitives"
          description="Enterprise-grade reliability, security and performance, without requiring specialized operational expertise."
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          aria-label="Platform primitives"
        >
          <ColumnNavigation.Column
            v-for="group in PRIMITIVE_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href || '#'"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
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
        :items="FAQ"
      />
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
        eyebrow="Build"
        title="Build once."
        title-muted="Run anywhere."
        description="Get a faster path to launch, less latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start for free"
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
  </SectionContainer>
</template>
