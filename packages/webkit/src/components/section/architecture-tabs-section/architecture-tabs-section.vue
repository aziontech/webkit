<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Diagram, { type DiagramName } from '../../marketing/diagram/diagram.vue'
  import MediaTabs from '../../marketing/media-tabs/media-tabs.vue'
  import FeatureTabsSectionShell from '../feature-tabs-section/parts/feature-tabs-section-shell.vue'

  defineOptions({
    name: 'ArchitectureTabsSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** Side of the diagram the tabs sit on. */
  export type ArchitectureTabsSectionSide = 'top' | 'bottom' | 'start' | 'end'

  /** One architecture of the band: a tab and the diagram it draws. */
  export type ArchitectureTabsSectionTab = {
    /** Stable id of the tab. */
    value: string
    /** The tab's heading, naming it in the row. */
    title: string
    /** The sentence under the heading. */
    description: string
    /** Name of the diagram drawn while the tab is active. */
    diagram: DiagramName
    /** Accessible description of the diagram, replacing the one it ships; empty keeps its own. */
    diagramAriaLabel?: string
  }

  export interface ArchitectureTabsSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence beside the headline. */
    description?: string
    /** Side of the diagram the tabs sit on: `top`, `bottom`, `start` or `end`; start and end hold up to three tabs. */
    tabsSide?: ArchitectureTabsSectionSide
    /**
     * The architectures, in order; each is `{ value, title, description, diagram, diagramAriaLabel? }`
     * where `diagram` is the name of the diagram drawn while the tab is active and `diagramAriaLabel`
     * replaces the description it ships.
     */
    tabs?: ArchitectureTabsSectionTab[]
    /** Opens the next tab on a timer, with the composed tabs' visible pause control. */
    autoplay?: boolean
    /** Milliseconds each tab holds before the next one opens. */
    autoplayInterval?: number
    /** Large button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<ArchitectureTabsSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    tabsSide: 'top',
    tabs: () => [],
    autoplay: true,
    autoplayInterval: 6000,
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'architecture-tabs-section'
  )

  const items = computed(() =>
    props.tabs.map((tab) => ({ title: tab.title, description: tab.description }))
  )
</script>

<template>
  <FeatureTabsSectionShell
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :item-count="tabs.length"
    align="split"
    header-padding="small"
    :primary-action="primaryAction"
  >
    <RegistrationFrame
      flush
      borders="top"
      marks="none"
    >
      <MediaTabs
        :tabs-side="tabsSide"
        size="small"
        :items="items"
        :autoplay="autoplay"
        :autoplay-interval="autoplayInterval"
        class="[--media-tabs-media-bg:var(--bg-surface)] [--media-tabs-media-min-lg:28rem] [--media-tabs-media-min:24rem]"
      >
        <template #media="{ index }">
          <Diagram
            :key="tabs[index]?.value"
            :name="tabs[index]?.diagram"
            :aria-label="tabs[index]?.diagramAriaLabel ?? ''"
            class="w-full"
          />
        </template>
      </MediaTabs>
    </RegistrationFrame>
  </FeatureTabsSectionShell>
</template>
