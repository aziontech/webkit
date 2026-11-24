<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { LocaleInjectionKey, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { safeHref } from '../../../../utils/safe-href'
  import type { SourcesItem } from '../types'
  import { sourceMeta } from '../types'
  import SourcesMark from './sources-mark.vue'

  defineOptions({
    name: 'SourcesItem',
    inheritAttrs: false
  })

  export interface SourcesItemProps {
    /** The source to draw: its mark, its linked title, then its site, publisher and date. */
    item: SourcesItem
  }

  const props = defineProps<SourcesItemProps>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ common: en.common })
  const context = inject(LocaleInjectionKey, null)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'sources-item'
  })
  const href = computed<string | null>(() => safeHref(props.item.href))
  const external = computed<boolean>(() => /^https?:\/\//i.test(href.value ?? ''))
  const meta = computed<string>(() =>
    sourceMeta(props.item, locale.value, context?.timeZone?.value)
  )

  const LINK_CLASS =
    'line-clamp-2 rounded-(--shape-control) text-label-sm text-(--text-default) no-underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 items-start gap-(--spacing-xs)"
  >
    <SourcesMark
      :item="item"
      size="medium"
    />
    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
      <a
        v-if="href"
        :href="href"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined"
        :data-testid="`${testId}__link`"
        :class="LINK_CLASS"
      >
        {{ item.title
        }}<template v-if="external"
          >{{ ' ' }}<span class="sr-only">{{ t('common.newTab') }}</span
          ><i
            class="az az-external-link ms-1 inline-block text-body-xs leading-none text-(--text-muted)"
            aria-hidden="true"
        /></template>
      </a>
      <span
        v-else
        class="line-clamp-2 text-label-sm text-(--text-default)"
      >
        {{ item.title }}
      </span>
      <span
        v-if="meta"
        :data-testid="`${testId}__meta`"
        class="line-clamp-2 text-body-xs text-(--text-muted)"
      >
        {{ meta }}
      </span>
    </span>
  </div>
</template>
