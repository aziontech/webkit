<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Diagram, { type DiagramName } from '../../marketing/diagram/diagram.vue'
  import MediaTabs from '../../marketing/media-tabs/media-tabs.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ArchitectureTabs',
    inheritAttrs: false
  })

  /** Side of the diagram the tabs sit on. */
  export type ArchitectureTabsPosition = 'top' | 'bottom' | 'left' | 'right'

  /** The large button in the section title. */
  export type ArchitectureTabsAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** One architecture of the band: a tab and the diagram it draws. */
  export type ArchitectureTabsTab = {
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

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence beside the headline. */
    description?: string
    /** Side of the diagram the tabs sit on: `top`, `bottom`, `left` or `right`; left and right hold up to three tabs. */
    position?: ArchitectureTabsPosition
    /** The architectures, in order; each is `{ value, title, description, diagram, diagramAriaLabel? }` where `diagram` is the name of the diagram drawn while the tab is active and `diagramAriaLabel` replaces the description it ships. */
    tabs?: ArchitectureTabsTab[]
    /** Opens the next tab on a timer, with the composed tabs' visible pause control. */
    autoplay?: boolean
    /** Milliseconds each tab holds before the next one opens. */
    autoplayInterval?: number
    /** @deprecated since 6.0 — use `autoplayInterval`. Removed in 7.0. */
    interval?: number
    /** Large button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: ArchitectureTabsAction
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    position: 'top',
    tabs: () => [],
    autoplay: true,
    autoplayInterval: 6000,
    interval: 0,
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-architecture-tabs'
  )

  const hasTabs = computed(() => props.tabs.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const items = computed(() =>
    props.tabs.map((tab) => ({ title: tab.title, description: tab.description }))
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="hasTabs"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <SectionTitle
          kind="horizontal"
          padding="small"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="primaryAction"
            #actions
          >
            <Button
              :label="primaryAction.label"
              :href="primaryAction.href"
              kind="secondary"
              size="large"
              :target="primaryAction.target"
              :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
            />
          </template>
        </SectionTitle>
      </template>

      <FrameBox
        flush
        borders="top"
        marks="none"
      >
        <MediaTabs
          :position="position"
          size="small"
          :items="items"
          :autoplay="autoplay"
          :autoplay-interval="interval || autoplayInterval"
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
      </FrameBox>
    </SectionModule>
  </section>
</template>
