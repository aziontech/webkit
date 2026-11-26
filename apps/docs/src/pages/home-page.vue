<script setup lang="ts">
  import CardGrid from '@aziontech/webkit/card-grid'
  import Container from '@aziontech/webkit/container'
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import Hero from '@aziontech/webkit/hero'
  import Module from '@aziontech/webkit/module'
  import ModuleHeader from '@aziontech/webkit/module-header'
  import { useHead } from '@unhead/vue'
  import index from 'virtual:docs-nav'
  import { computed } from 'vue'

  import { format, messages } from '../lib/i18n'

  const t = messages
  useHead({
    title: 'WebKit — Azion design system',
    meta: [{ name: 'description', content: computed(() => t.value.homeLead) }]
  })

  const exampleCount = index.components.reduce((sum, item) => sum + item.exampleCount, 0)

  const paths = computed(() => [
    {
      to: '/foundations/getting-started',
      title: t.value.pathBuildTitle,
      icon: 'az az-code',
      text: t.value.pathBuildBody,
      link: t.value.pathBuildLink
    },
    {
      to: '/ai#contribute',
      title: t.value.pathContributeTitle,
      icon: 'az az-git-pull-request',
      text: t.value.pathContributeBody,
      link: t.value.pathContributeLink
    }
  ])

  const aiFeatures = computed(() => [
    { icon: 'az az-server', title: t.value.aiMcpTitle, body: t.value.aiMcpBody },
    { icon: 'az az-terminal', title: t.value.aiInitTitle, body: t.value.aiInitBody },
    { icon: 'az az-book', title: t.value.aiGuidanceTitle, body: t.value.aiGuidanceBody },
    { icon: 'az az-circle-check', title: t.value.aiChecksTitle, body: t.value.aiChecksBody }
  ])

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
      to: '/patterns',
      label: t.value.patterns,
      icon: 'az az-list-check',
      text: t.value.explorePatterns
    },
    {
      to: '/blocks',
      label: t.value.blocks,
      icon: 'az az-app-window',
      text: t.value.exploreBlocks
    },
    { to: '/assets', label: t.value.assets, icon: 'az az-images', text: t.value.exploreAssets },
    { to: '/ai', label: t.value.forAi, icon: 'az az-sparkles', text: t.value.exploreAi }
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
      size="medium"
    >
      <Hero.Title
        :eyebrow="`${t.homeEyebrow} ${index.version}`"
        :title="t.homeTitle"
        :description="t.homeLead"
        size="medium"
        max-width="3xl"
      />
    </Hero>

    <Container
      max-width="7xl"
      class="lg:@max-7xl/main:border-s-0!"
    >
      <Module
        :divided="false"
        :padded="false"
      >
        <template #header>
          <ModuleHeader
            :title="t.pathsTitle"
            :description="t.pathsLead"
            size="small"
            padding="small"
          />
        </template>
        <DocCardGroup
          :columns="2"
          :mobile-columns="1"
        >
          <DocCard
            v-for="path in paths"
            :key="path.to"
            :href="path.to"
            :title="path.title"
            :icon="path.icon"
            :label="path.text"
            :link-label="path.link"
          />
        </DocCardGroup>
      </Module>

      <Module
        :divided="false"
        :padded="false"
        :eyebrow="t.forAi"
        :title="t.aiTitle"
        :description="t.aiLead"
      >
        <CardGrid
          :columns="2"
          variant="divider"
          divider-color="muted"
        >
          <div
            v-for="feature in aiFeatures"
            :key="feature.title"
            class="flex flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <i
              :class="feature.icon"
              class="text-heading-sm text-(--primary)"
              aria-hidden="true"
            />
            <h3 class="text-balance text-heading-xs text-(--text-default)">
              {{ feature.title }}
            </h3>
            <p class="text-pretty text-body-sm text-(--text-muted)">{{ feature.body }}</p>
          </div>
        </CardGrid>
        <div class="p-(--spacing-md) lg:p-(--spacing-xl)">
          <DocAgentCard
            :prompt="t.agentPrompt"
            :title="t.aiAgentTitle"
            :description="t.aiAgentBody"
            :aside-title="t.aiAgentAside"
            :action-label="t.aiAgentAction"
            action-href="/ai"
          />
        </div>
      </Module>

      <Module
        :divided="false"
        :padded="false"
      >
        <template #header>
          <ModuleHeader
            :title="t.exploreTitle"
            :description="t.exploreLead"
            size="small"
            padding="small"
          />
        </template>
        <DocCardGroup
          :columns="3"
          :mobile-columns="1"
        >
          <DocCard
            v-for="section in explore"
            :key="section.to"
            :href="section.to"
            :title="section.label"
            :icon="section.icon"
            :label="section.text"
          />
        </DocCardGroup>
      </Module>

      <Module
        :divided="false"
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
      </Module>
    </Container>
  </div>
</template>
