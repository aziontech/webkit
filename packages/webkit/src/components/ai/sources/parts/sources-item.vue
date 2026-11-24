<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import {
    cached,
    intlLocale,
    LocaleInjectionKey,
    useTranslate
  } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { safeHref } from '../../../../utils/safe-href'
  import type { SourcesItem } from '../types'
  import { sourceName, sourcePublished } from '../types'
  import SourcesMark from './sources-mark.vue'

  defineOptions({
    name: 'SourcesItem',
    inheritAttrs: false
  })

  export interface SourcesItemProps {
    /** The source to draw: its mark and site, its linked title, then its publisher and date. */
    item: SourcesItem
    /** Shows the source's `description` under the meta line, cut at two lines. */
    showDescription?: boolean
  }

  const props = withDefaults(defineProps<SourcesItemProps>(), {
    showDescription: false
  })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ common: en.common })
  const context = inject(LocaleInjectionKey, null)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'sources-item'
  })
  const href = computed<string | null>(() => safeHref(props.item.href))
  const external = computed<boolean>(() => /^https?:\/\//i.test(href.value ?? ''))
  const meta = computed<string>(() => {
    const published = sourcePublished(props.item)
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: 'medium',
      timeZone: published?.calendar ? 'UTC' : context?.timeZone?.value
    }
    const date = published
      ? cached(
          'date',
          locale.value,
          options,
          () => new Intl.DateTimeFormat(intlLocale(locale.value), options)
        ).format(published.date)
      : ''
    return [props.item.publisher?.trim(), date].filter(Boolean).join(' · ')
  })

  const LINK_CLASS =
    'line-clamp-2 rounded-(--shape-control) text-label-md text-(--text-default) underline-offset-2 hover:underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-2xs)"
  >
    <span class="flex min-w-0 items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)">
      <SourcesMark :item="item" />
      <span class="truncate">{{ sourceName(item) }}</span>
    </span>
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
      v-if="meta"
      :data-testid="`${testId}__meta`"
      class="truncate text-body-sm text-(--text-muted)"
    >
      {{ meta }}
    </span>
    <span
      v-if="showDescription && item.description"
      class="line-clamp-2 text-body-sm text-(--text-muted)"
    >
      {{ item.description }}
    </span>
  </div>
</template>
