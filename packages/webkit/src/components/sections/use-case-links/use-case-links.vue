<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'UseCaseLinks',
    inheritAttrs: false
  })

  /** One use case, rendered as a linked topic cell. */
  export type UseCaseLinksItem = {
    /** Icon class for the glyph that leads the use case's heading. */
    icon: string
    /** The use case, rendered as its h3. */
    title: string
    /** One sentence explaining the use case. */
    description: string
    /** Destination the whole cell links to. */
    href: string
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The use cases rendered as linked topics in a three-column divider grid, in order; each item is `{ icon, title, description, href }`. */
    items?: UseCaseLinksItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-use-case-links'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeading = computed(() => props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeading"
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
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <div
            v-for="item in items"
            :key="item.href + item.title"
            class="relative flex bg-(--bg-canvas)"
          >
            <Topic
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
              :href="item.href"
              :heading-level="3"
              class="w-full p-(--spacing-xl)"
            />
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>
