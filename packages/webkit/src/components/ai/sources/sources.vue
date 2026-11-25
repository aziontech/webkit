<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { LocaleInjectionKey, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import { LazySourcesMenu, type SourcesGroup, type SourcesRow } from './lib/sources-menu'
  import type { SourcesItem } from './types'
  import { sourceCited, sourceMeta } from './types'

  export type { SourcesItem }

  defineOptions({
    name: 'Sources',
    inheritAttrs: false
  })

  export interface SourcesProps {
    /** The sources behind the response, in citation order; item `n` is what `[n]` points at. */
    items?: SourcesItem[]
    /** Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). */
    title?: string
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<SourcesProps>(), {
    items: () => [],
    title: '',
    defaultOpen: false
  })

  /** Controlled open state of the panel. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ sources: en.sources })
  const context = inject(LocaleInjectionKey, null)

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'sources')
  const heading = computed<string>(() => props.title || t('sources.label'))
  const triggerName = computed<string>(() =>
    props.title ? '' : t('sources.count', { count: props.items.length })
  )
  const marks = computed<SourcesItem[]>(() => {
    const cited = props.items.filter(sourceCited)
    return (cited.length ? cited : props.items).slice(0, 3)
  })

  const rows = computed<SourcesRow[]>(() =>
    props.items.map((item, index) => {
      const href = safeHref(item.href) ?? ''
      return {
        index,
        item,
        href,
        external: /^https?:\/\//i.test(href),
        meta: sourceMeta(item, locale.value, context?.timeZone?.value)
      }
    })
  )

  const groups = computed<SourcesGroup[]>(() => {
    const all: SourcesGroup[] = [
      {
        key: 'cited',
        label: t('sources.cited'),
        rows: rows.value.filter((row) => sourceCited(row.item))
      },
      {
        key: 'more',
        label: t('sources.more'),
        rows: rows.value.filter((row) => !sourceCited(row.item))
      }
    ]
    return all.filter((group) => group.rows.length)
  })
  const grouped = computed<boolean>(() => groups.value.length > 1)

  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)

  function setOpen(value: boolean): void {
    open.value = value
  }
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="contents"
  >
    <LazySourcesMenu
      :open="isOpen"
      :test-id="testId"
      :marks="marks"
      :title="heading"
      :trigger-name="triggerName"
      :groups="groups"
      :grouped="grouped"
      @update:open="setOpen"
    />
  </div>
</template>
