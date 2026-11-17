<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import { index } from '../lib/data'
  import { format, messages } from '../lib/i18n'

  const t = messages
  useHead({
    title: 'WebKit — Azion design system',
    meta: [{ name: 'description', content: computed(() => t.value.homeLead) }]
  })

  const exampleCount = index.components.reduce((sum, item) => sum + item.exampleCount, 0)

  const explore = computed(() => [
    {
      to: '/foundations',
      label: t.value.foundations,
      icon: 'az az-palette',
      text: t.value.exploreFoundations
    },
    {
      to: '/components',
      label: t.value.components,
      icon: 'az az-layout-grid',
      text: t.value.exploreComponents
    },
    {
      to: '/blocks',
      label: t.value.blocks,
      icon: 'az az-window-maximize',
      text: t.value.exploreBlocks
    },
    { to: '/assets', label: t.value.assets, icon: 'az az-images', text: t.value.exploreAssets }
  ])

  const features = computed(() => [
    { title: t.value.whyQualityTitle, body: t.value.whyQualityBody },
    { title: t.value.whyPeopleTitle, body: t.value.whyPeopleBody },
    { title: t.value.whyNextTitle, body: t.value.whyNextBody }
  ])

  const whyLead = computed(() =>
    format(t.value.whyLead, {
      components: index.components.length,
      examples: exampleCount,
      blocks: index.blocks.length
    })
  )
</script>

<template>
  <div class="flex w-full flex-col">
    <Hero
      max-width="7xl"
      size="large"
    >
      <Hero.Title
        :eyebrow="`${t.homeEyebrow} ${index.version}`"
        :title="t.homeTitle"
        :description="t.homeLead"
        size="medium"
        max-width="3xl"
      >
        <template #actions>
          <Button
            :label="t.gettingStarted"
            variant="primary"
            size="large"
            href="/foundations/getting-started"
          />
          <CopyPromptButton
            :value="t.agentPrompt"
            :label="t.startWithAgents"
            :copied-label="t.copied"
          />
        </template>
      </Hero.Title>
    </Hero>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        :padded="false"
        :title="t.exploreTitle"
        :description="t.exploreLead"
      >
        <CardGrid
          :columns="4"
          variant="divider"
        >
          <a
            v-for="section in explore"
            :key="section.to"
            :href="section.to"
            class="relative flex h-full min-h-56 flex-col justify-center gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl) transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-surface) focus-visible:z-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
          >
            <i
              :class="section.icon"
              class="text-heading-sm text-(--text-default)"
              aria-hidden="true"
            />
            <span class="text-heading-xs text-(--text-default)">{{ section.label }}</span>
            <span class="text-pretty text-body-sm text-(--text-muted)">{{ section.text }}</span>
          </a>
        </CardGrid>
      </SectionModule>

      <SectionModule
        :padded="false"
        :title="t.whyTitle"
        :description="whyLead"
      >
        <CardGrid
          :columns="3"
          variant="divider"
          divider-color="muted"
        >
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <i
              class="az az-asterisk text-heading-sm text-(--primary)"
              aria-hidden="true"
            />
            <h3 class="max-w-[20ch] text-balance text-heading-xs text-(--text-default)">
              {{ feature.title }}
            </h3>
            <p class="text-pretty text-body-sm text-(--text-muted)">{{ feature.body }}</p>
          </div>
        </CardGrid>
      </SectionModule>
    </SectionContainer>
  </div>
</template>
