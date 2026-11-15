<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import type { ColumnNavigationColumns } from '../../marketing/column-navigation/column-navigation.vue'
  import ColumnNavigation from '../../marketing/column-navigation/column-navigation.vue'
  import ColumnNavigationColumn from '../../marketing/column-navigation/column-navigation-column/column-navigation-column.vue'
  import ColumnNavigationItem from '../../marketing/column-navigation/column-navigation-item/column-navigation-item.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'PlatformDirectory',
    inheritAttrs: false
  })

  /** One product of the directory, rendered as a linked row. */
  export type PlatformDirectoryItem = {
    /** Icon class for the product's glyph. */
    icon?: string
    /** Name of the product, the row's first line. */
    title: string
    /** One line about the product. */
    description?: string
    /** Destination of the row. */
    href: string
  }

  /** One column of the directory, a product group under its overline heading. */
  export type PlatformDirectoryGroup = {
    /** Overline heading of the column. */
    title: string
    /** The products of the group, in order. */
    items: PlatformDirectoryItem[]
  }

  export interface PlatformDirectoryProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Short label above the headline; shown only with a title. */
    eyebrow?: string
    /** Headline over the directory, rendered by the section title as its `h2`; the band renders no header, eyebrow or description when empty. */
    title?: string
    /** One sentence under the headline; shown only with a title. */
    description?: string
    /** Accessible name of the directory's navigation landmark; empty uses the title. */
    ariaLabel?: string
    /** The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. */
    groups?: PlatformDirectoryGroup[]
  }

  const props = withDefaults(defineProps<PlatformDirectoryProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    ariaLabel: '',
    groups: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-platform-directory'
  )

  const columns = computed(() =>
    props.groups
      .map((group) => ({
        title: group.title,
        items: (group.items ?? []).filter((item) => Boolean(item.title) && Boolean(item.href))
      }))
      .filter((group) => group.items.length > 0)
  )

  const hasColumns = computed(() => columns.value.length > 0)

  const trackCount = computed<ColumnNavigationColumns>(() => {
    const count = columns.value.length
    if (count >= 4) return 4
    return count === 3 ? 3 : 2
  })

  const spanOf = (index: number): 'full' | 'pair' | undefined => {
    const count = columns.value.length
    if (count === 1) return 'full'
    if (count === 3 && index === 2) return 'pair'
    return undefined
  }

  const hasHeader = computed(() => hasColumns.value && props.title.length > 0)

  const navigationLabel = computed(() => props.ariaLabel || props.title)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="hasHeader ? title : undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasColumns"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <SectionTitle
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <ColumnNavigation
          :columns="trackCount"
          :mobile-columns="1"
          :aria-label="navigationLabel"
        >
          <ColumnNavigationColumn
            v-for="(group, index) in columns"
            :key="`${group.title}-${index}`"
            :title="group.title"
            :data-span="spanOf(index)"
            class="data-[span=full]:col-span-full data-[span=pair]:sm:col-span-2 data-[span=pair]:lg:col-span-1"
          >
            <ColumnNavigationItem
              v-for="item in group.items"
              :key="item.href"
              :icon="item.icon ?? ''"
              :title="item.title"
              :description="item.description ?? ''"
              :href="item.href"
            />
          </ColumnNavigationColumn>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>
  </section>
</template>
