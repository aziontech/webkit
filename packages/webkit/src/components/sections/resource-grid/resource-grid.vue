<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'ResourceGrid',
    inheritAttrs: false
  })

  /** One linked resource card. */
  export type ResourceGridItem = {
    /** Title of the resource; a card without one is skipped. */
    title: string
    /** One sentence under the title. */
    description?: string
    /** Destination of the card; a full http link opens in a new tab. */
    href: string
  }

  /** The button rendered under the copy. */
  export type ResourceGridAction = {
    /** Visible label of the button. */
    label: string
    /** Destination the button links to. */
    href: string
    /** Adds a trailing chevron that reads as go. */
    trailing?: boolean
    /** Browsing context the link opens in. */
    target?: '_blank' | '_self'
  }

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band, which also names its region and the scroll area. */
    title?: string
    /** Lead sentence beside the grid. */
    description?: string
    /** The resource cards, in order; each is `{ title, description?, href }`, and a card with no title is skipped. */
    items?: ResourceGridItem[]
    /** Button under the copy; dropped when its label or link is missing. */
    primaryAction?: ResourceGridAction
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => [],
    primaryAction: undefined
  })

  const VISIBLE_ITEMS = 4

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-resource-grid'
  )

  const cards = computed(() => props.items.filter((item) => item.title.length > 0))

  const scrollable = computed(() => cards.value.length > VISIBLE_ITEMS)

  const action = computed(() =>
    props.primaryAction && props.primaryAction.label && props.primaryAction.href
      ? props.primaryAction
      : null
  )

  const isExternal = (href: string): boolean => /^https?:/.test(href)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-scrollable="scrollable || undefined"
  >
    <SectionModule
      v-if="cards.length > 0"
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
            v-if="scrollable"
            class="relative -mb-px flex w-full flex-col self-stretch"
          >
            <div class="flex min-h-0 flex-1 flex-col lg:absolute lg:inset-0">
              <ScrollArea
                :aria-label="title || undefined"
                fade
              >
                <div class="pb-px">
                  <CardGrid
                    flush
                    kind="frame"
                    :columns="2"
                  >
                    <CardGridCell
                      v-for="card in cards"
                      :key="card.href"
                      kind="surface"
                    >
                      <Topic
                        :heading-level="3"
                        :title="card.title"
                        :description="card.description ?? ''"
                        :href="card.href"
                        :target="isExternal(card.href) ? '_blank' : undefined"
                        :rel="isExternal(card.href) ? 'noopener noreferrer' : undefined"
                      />
                    </CardGridCell>
                  </CardGrid>
                </div>
              </ScrollArea>
            </div>
          </div>
          <CardGrid
            v-else
            flush
            kind="frame"
            :columns="2"
            class="w-full self-stretch sm:auto-rows-fr"
          >
            <CardGridCell
              v-for="card in cards"
              :key="card.href"
              kind="surface"
            >
              <Topic
                :heading-level="3"
                :title="card.title"
                :description="card.description ?? ''"
                :href="card.href"
                :target="isExternal(card.href) ? '_blank' : undefined"
                :rel="isExternal(card.href) ? 'noopener noreferrer' : undefined"
              />
            </CardGridCell>
          </CardGrid>
        </template>
        <template
          v-if="action"
          #actions
        >
          <Button
            :label="action.label"
            kind="secondary"
            size="large"
            :href="action.href"
            :target="action.target"
            :icon="action.trailing ? 'pi pi-chevron-right' : ''"
            icon-position="trailing"
            :animated="Boolean(action.trailing)"
          />
        </template>
      </MediaSplit>
    </SectionModule>
  </div>
</template>
