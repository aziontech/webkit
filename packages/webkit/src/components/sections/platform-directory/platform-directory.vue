<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
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

  interface Props {
    /** Headline over the directory, rendered by the section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Accessible name of the directory's navigation landmark. */
    ariaLabel?: string
    /** The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. */
    groups?: PlatformDirectoryGroup[]
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
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

  const hasHeader = computed(() => hasColumns.value && props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="hasHeader ? title : undefined"
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
        <SectionTitle :title="title" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          :aria-label="ariaLabel"
        >
          <ColumnNavigationColumn
            v-for="(group, index) in columns"
            :key="`${group.title}-${index}`"
            :title="group.title"
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
