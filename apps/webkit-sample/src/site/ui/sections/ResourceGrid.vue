<script setup lang="ts">
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'
  import Topic from '@aziontech/webkit/topic'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'ResourceGrid' })

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Headline of the copy cell. */
    title: string
    /** One or two sentences under the title. */
    description?: string
    /** Linked resource cards, two to a row; four fill the grid. */
    items: SiteTopic[]
    /** Actions under the copy. */
    actions?: SiteAction[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: 'Go Deeper',
    description: '',
    actions: () => [
      {
        label: 'See all guides',
        href: 'https://www.azion.com/en/documentation/products/guides/',
        kind: 'secondary',
        trailing: true,
        external: true
      }
    ]
  })

  const { follow } = useSiteLink()

  const isExternal = (href: string) => /^https?:/.test(href)
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <MediaSplit
      framed
      :heading-level="2"
      align="center"
      size="large"
      texture="none"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
    >
      <template #media>
        <div class="w-full self-stretch">
          <CardGrid
            flush
            kind="frame"
            :columns="2"
          >
            <CardGridCell
              v-for="item in items"
              :key="item.title"
              kind="surface"
            >
              <Topic
                :heading-level="3"
                :title="item.title"
                :description="item.description"
                :href="item.href ?? ''"
                :target="isExternal(item.href ?? '') ? '_blank' : undefined"
                :rel="isExternal(item.href ?? '') ? 'noopener noreferrer' : undefined"
                @click="follow($event, item.href ?? '')"
              />
            </CardGridCell>
          </CardGrid>
        </div>
      </template>
      <template
        v-if="actions.length"
        #actions
      >
        <SectionAction
          v-for="action in actions"
          :key="action.label"
          :action="action"
        />
      </template>
    </MediaSplit>
  </SectionModule>
</template>
