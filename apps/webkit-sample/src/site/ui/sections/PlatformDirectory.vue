<script setup lang="ts">
  import ColumnNavigation from '@aziontech/webkit/column-navigation-root'
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import { useSiteLink } from '../../composables/use-site-link'
  import { PLATFORM_PRIMITIVES } from '../../data/platform-primitives.js'
  import type { SiteTopic } from './types'

  defineOptions({ name: 'PlatformDirectory' })

  interface PlatformGroup {
    /** Column heading, the product group. */
    label: string
    /** The group's products, one row each. */
    items: SiteTopic[]
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Headline over the directory. */
    title: string
    /** One sentence under the title. */
    description?: string
    /** Accessible name of the directory; empty uses the title. */
    ariaLabel?: string
    /** Product groups, one column each. */
    groups?: PlatformGroup[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    description: '',
    ariaLabel: '',
    groups: () => PLATFORM_PRIMITIVES
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
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
        :columns="4"
        :mobile-columns="1"
        :aria-label="ariaLabel || title"
      >
        <ColumnNavigationColumn
          v-for="group in groups"
          :key="group.label"
          :title="group.label"
        >
          <ColumnNavigationItem
            v-for="item in group.items"
            :key="item.title"
            :icon="item.icon ?? ''"
            :title="item.title"
            :description="item.description"
            :href="item.href ?? ''"
            @click="follow($event, item.href ?? '')"
          />
        </ColumnNavigationColumn>
      </ColumnNavigation>
    </FrameBox>
  </SectionModule>
</template>
