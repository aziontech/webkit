<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { LinkDirectoryColumns } from '../../marketing/link-directory/link-directory.vue'
  import LinkDirectory from '../../marketing/link-directory/link-directory.vue'
  import LinkDirectoryColumn from '../../marketing/link-directory/link-directory-column/link-directory-column.vue'
  import LinkDirectoryItem from '../../marketing/link-directory/link-directory-item/link-directory-item.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'PlatformDirectorySection',
    inheritAttrs: false
  })

  /** One product of the directory, rendered as a linked row. */
  export type PlatformDirectorySectionItem = {
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
  export type PlatformDirectorySectionGroup = {
    /** Eyebrow heading of the column. */
    title: string
    /** The products of the group, in order. */
    items: PlatformDirectorySectionItem[]
  }

  export interface PlatformDirectorySectionProps {
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
    groups?: PlatformDirectorySectionGroup[]
  }

  const props = withDefaults(defineProps<PlatformDirectorySectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    ariaLabel: '',
    groups: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'platform-directory-section'
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

  const trackCount = computed<LinkDirectoryColumns>(() => {
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
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="hasHeader ? title : ''"
    :filled="hasColumns"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
  >
    <LinkDirectory
      :columns="trackCount"
      :mobile-columns="1"
      :aria-label="navigationLabel"
    >
      <LinkDirectoryColumn
        v-for="(group, index) in columns"
        :key="`${group.title}-${index}`"
        :title="group.title"
        :data-span="spanOf(index)"
        class="data-[span=full]:col-span-full data-[span=pair]:sm:col-span-2 data-[span=pair]:lg:col-span-1"
      >
        <LinkDirectoryItem
          v-for="item in group.items"
          :key="item.href"
          :icon="item.icon ?? ''"
          :title="item.title"
          :description="item.description ?? ''"
          :href="item.href"
        />
      </LinkDirectoryColumn>
    </LinkDirectory>
  </SectionBand>
</template>
