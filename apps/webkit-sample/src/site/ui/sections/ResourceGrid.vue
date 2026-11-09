<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import MediaSplit from '@aziontech/webkit/media-split'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionModule from '@aziontech/webkit/section-module'
  import Topic from '@aziontech/webkit/topic'
  import { computed } from 'vue'

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
    /** Linked resource cards, two to a row; four fill the grid and the rest scroll. */
    items: SiteTopic[]
    /** Actions under the copy. */
    actions?: SiteAction[]
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const VISIBLE_ITEMS = 4

  const { follow } = useSiteLink()

  const scrolls = computed(() => props.items.length > VISIBLE_ITEMS)
  const scrollProps = computed(() => (scrolls.value ? { ariaLabel: props.title, fade: true } : {}))

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
        <div
          :data-scrolls="scrolls || null"
          class="group/resources relative flex w-full flex-col self-stretch data-[scrolls]:-mb-px"
        >
          <div
            class="flex min-h-0 flex-1 flex-col group-data-[scrolls]/resources:lg:absolute group-data-[scrolls]/resources:lg:inset-0"
          >
            <component
              :is="scrolls ? ScrollArea : 'div'"
              v-bind="scrollProps"
            >
              <div class="group-data-[scrolls]/resources:pb-px">
                <CardGrid
                  :data-balanced="!scrolls || null"
                  flush
                  kind="frame"
                  :columns="2"
                  class="data-[balanced]:sm:auto-rows-fr"
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
            </component>
          </div>
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
