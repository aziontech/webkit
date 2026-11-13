<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import MiniButton from '../../actions/mini-button/mini-button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import MediaTabs from '../../marketing/media-tabs/media-tabs.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'FeatureTabs',
    inheritAttrs: false
  })

  /** The small link under the frame. */
  export type FeatureTabsAction = {
    /** Visible label of the link. */
    label: string
    /** Destination the link points to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** One feature of the band: a tab and the illustration it shows. */
  export type FeatureTabsTab = {
    /** The tab's heading, naming it in the stack. */
    title: string
    /** The sentence under the heading. */
    description: string
    /** Registry name of the illustration shown while the tab is active. */
    illustration: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the left section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The features, in order, at most three; each is `{ title, description, illustration, illustrationLabel? }` where `illustration` is a registry name and `illustrationLabel` its accessible name. */
    tabs?: FeatureTabsTab[]
    /** Small link under the frame; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: FeatureTabsAction
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    tabs: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-feature-tabs'
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
    :data-testid="testId"
    :aria-label="title || undefined"
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
          kind="left"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaTabs
          :items="items"
          size="small"
          :auto-play-interval="5200"
          class="[--media-tabs-media-min:24rem]"
        >
          <template #media="{ index }">
            <Illustration
              :name="tabs[index]?.illustration"
              :aria-label="tabs[index]?.illustrationLabel ?? ''"
              class="size-full"
            />
          </template>
        </MediaTabs>

        <div
          v-if="primaryAction"
          class="p-(--spacing-xl)"
        >
          <MiniButton
            :label="primaryAction.label"
            :href="primaryAction.href"
            :target="primaryAction.target"
            :show-icon="Boolean(primaryAction.trailing)"
            icon="pi pi-angle-right"
          />
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>
