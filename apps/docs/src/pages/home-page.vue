<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import CopyPromptButton from '@aziontech/ui/copy-prompt-button'
  import DocAgentCard from '@aziontech/ui/doc-agent-card'
  import DocCard from '@aziontech/ui/doc-card'
  import DocCardGroup from '@aziontech/ui/doc-card-group'
  import DocHero from '@aziontech/ui/doc-hero'
  import { useHead } from '@unhead/vue'
  import index from 'virtual:docs-nav'
  import { computed } from 'vue'

  import { format, messages } from '../lib/i18n'

  const t = messages
  useHead({
    title: 'Azion UI — Azion design system',
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
    {
      to: '/ai#the-mcp-server',
      icon: 'az az-server',
      title: t.value.aiMcpTitle,
      body: t.value.aiMcpBody
    },
    {
      to: '/ai#set-up-your-agent-in-one-step',
      icon: 'az az-terminal',
      title: t.value.aiInitTitle,
      body: t.value.aiInitBody
    },
    {
      to: '/ai#the-guidance-agents-load',
      icon: 'az az-book',
      title: t.value.aiGuidanceTitle,
      body: t.value.aiGuidanceBody
    },
    {
      to: '/ai#the-checks-that-hold-the-line',
      icon: 'az az-circle-check',
      title: t.value.aiChecksTitle,
      body: t.value.aiChecksBody
    }
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

  const sections = computed(() => [
    { id: 'azion-ui-for-ai', title: t.value.aiTitle, lead: t.value.aiLead },
    { id: 'explore-azion-ui', title: t.value.exploreTitle, lead: t.value.exploreLead },
    {
      id: 'why-azion-ui',
      title: t.value.whyTitle,
      lead: format(t.value.whyLead, {
        components: index.components.length,
        examples: exampleCount,
        blocks: index.blocks.length
      })
    }
  ])
</script>

<template>
  <div
    class="flex w-full max-w-(--container-7xl) flex-col gap-(--spacing-2xl) px-(--spacing-md) pt-(--spacing-xl) pb-(--spacing-2xl) lg:px-(--spacing-xl)"
  >
    <DocHero
      :title="t.homeTitle"
      :description="t.homeLead"
    >
      <template #actions>
        <Button
          :label="t.pathBuildLink"
          variant="primary"
          size="large"
          href="/foundations/getting-started"
        />
        <CopyPromptButton :value="t.agentPrompt" />
      </template>
      <template #note>{{ t.homeNote }}</template>
    </DocHero>

    <section
      class="flex flex-col gap-(--spacing-lg)"
      aria-labelledby="start-by-role"
    >
      <header class="flex flex-col gap-(--spacing-sm)">
        <h2
          id="start-by-role"
          class="m-0 text-heading-md text-(--text-default)"
        >
          {{ t.pathsTitle }}
        </h2>
        <p class="m-0 max-w-(--container-2xl) text-body-lg text-(--text-muted)">
          {{ t.pathsLead }}
        </p>
      </header>
      <DocAgentCard
        :prompt="t.agentPrompt"
        :title="t.aiAgentTitle"
        :description="t.aiAgentBody"
        :aside-title="t.aiAgentAside"
        :action-label="t.aiAgentAction"
        action-href="/ai"
      />
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
    </section>

    <section
      v-for="(section, position) in sections"
      :key="section.id"
      class="flex flex-col gap-(--spacing-lg)"
      :aria-labelledby="section.id"
    >
      <header class="flex flex-col gap-(--spacing-sm)">
        <h2
          :id="section.id"
          class="m-0 text-heading-md text-(--text-default)"
        >
          {{ section.title }}
        </h2>
        <p class="m-0 max-w-(--container-2xl) text-body-lg text-(--text-muted)">
          {{ section.lead }}
        </p>
      </header>
      <DocCardGroup
        v-if="position === 0"
        :columns="2"
        :mobile-columns="1"
      >
        <DocCard
          v-for="feature in aiFeatures"
          :key="feature.to"
          :href="feature.to"
          :title="feature.title"
          :icon="feature.icon"
          :label="feature.body"
        />
      </DocCardGroup>
      <DocCardGroup
        v-else-if="position === 1"
        :columns="3"
        :mobile-columns="1"
      >
        <DocCard
          v-for="item in explore"
          :key="item.to"
          :href="item.to"
          :title="item.label"
          :icon="item.icon"
          :label="item.text"
        />
      </DocCardGroup>
      <DocCardGroup
        v-else
        :columns="3"
        :mobile-columns="1"
      >
        <DocCard
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          icon="az az-asterisk"
          :label="feature.body"
        />
      </DocCardGroup>
    </section>
  </div>
</template>
