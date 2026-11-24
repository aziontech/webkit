<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { safeHref } from '../../../../utils/safe-href'
  import Drawer from '../../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../../overlay/drawer/drawer-content.vue'
  import DrawerTitle from '../../../overlay/drawer/drawer-title.vue'
  import PanelBody from '../../../overlay/panel/panel-body.vue'
  import PanelHeader from '../../../overlay/panel/panel-header.vue'
  import type { SourcesItem } from '../types'
  import { sourceCited, sourceName } from '../types'
  import SourcesMark from './sources-mark.vue'

  defineOptions({
    name: 'SourcesPanel',
    inheritAttrs: false
  })

  export interface SourcesPanelProps {
    /** The sources to list, in citation order. */
    items: SourcesItem[]
    /** Title of the panel. */
    title: string
  }

  const props = defineProps<SourcesPanelProps>()

  /** Open state of the panel. */
  const open = defineModel<boolean>('open', { default: false })

  interface SourcesGroup {
    key: 'cited' | 'more'
    id: string
    label: string
    items: SourcesItem[]
  }

  const attrs = useAttrs()
  const { t } = useTranslate({ sources: en.sources, common: en.common })
  const desktop = useMediaQuery('(min-width: 48rem)')
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'sources-panel'
  )
  const groups = computed<SourcesGroup[]>(() => {
    const all: SourcesGroup[] = [
      {
        key: 'cited',
        id: `${uid}-cited`,
        label: t('sources.cited'),
        items: props.items.filter(sourceCited)
      },
      {
        key: 'more',
        id: `${uid}-more`,
        label: t('sources.more'),
        items: props.items.filter((item) => !sourceCited(item))
      }
    ]
    return all.filter((group) => group.items.length)
  })
  const grouped = computed<boolean>(() => groups.value.length > 1)

  function external(href?: string): boolean {
    return Boolean(href && /^https?:\/\//i.test(href))
  }

  const ITEM_CLASS =
    'flex items-start gap-(--spacing-sm) rounded-(--shape-control) p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'has-[a:hover]:bg-(--bg-hover)'

  const LINK_CLASS =
    'line-clamp-2 rounded-(--shape-control) text-label-md text-(--text-default) underline-offset-2 hover:underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <Drawer
    v-model:open="open"
    side="end"
    size="small"
    :modal="!desktop"
    :data-testid="testId"
    class="contents"
  >
    <DrawerContent :data-testid="`${testId}__panel`">
      <PanelHeader class="w-full">
        <DrawerTitle>{{ title }}</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <section
          v-for="group in groups"
          :key="group.key"
          :aria-label="grouped ? undefined : t('sources.label')"
          :aria-labelledby="grouped ? group.id : undefined"
          :data-testid="`${testId}__group`"
          class="flex flex-col gap-(--spacing-2xs) not-first:mt-(--spacing-md)"
        >
          <h3
            v-if="grouped"
            :id="group.id"
            class="m-0 px-(--spacing-xs) text-label-sm text-(--text-muted)"
          >
            {{ group.label }}
          </h3>
          <ol
            :data-testid="`${testId}__list`"
            data-slot="sources-list"
            class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
          >
            <li
              v-for="(item, i) in group.items"
              :key="`${i}-${item.title}`"
              :data-testid="`${testId}__item`"
              :class="ITEM_CLASS"
            >
              <SourcesMark
                :item="item"
                size="medium"
              />
              <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <span class="truncate text-label-sm text-(--text-muted)">{{
                  sourceName(item)
                }}</span>
                <a
                  v-if="safeHref(item.href)"
                  :href="safeHref(item.href) ?? undefined"
                  :target="external(item.href) ? '_blank' : undefined"
                  :rel="external(item.href) ? 'noopener noreferrer' : undefined"
                  :data-testid="`${testId}__link`"
                  :class="LINK_CLASS"
                >
                  {{ item.title
                  }}<template v-if="external(item.href)"
                    >{{ ' ' }}<span class="sr-only">{{ t('common.newTab') }}</span
                    ><i
                      class="az az-external-link ms-1 inline-block text-body-xs leading-none"
                      aria-hidden="true"
                  /></template>
                </a>
                <span
                  v-else
                  class="line-clamp-2 text-label-md text-(--text-default)"
                >
                  {{ item.title }}
                </span>
                <span
                  v-if="item.description"
                  class="line-clamp-2 text-body-sm text-(--text-muted)"
                >
                  {{ item.description }}
                </span>
              </span>
            </li>
          </ol>
        </section>
      </PanelBody>
    </DrawerContent>
  </Drawer>
</template>
