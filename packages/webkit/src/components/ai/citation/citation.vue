<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import HoverCard from '../../overlay/hover-card/hover-card.vue'
  import HoverCardContent from '../../overlay/hover-card/hover-card-content/hover-card-content.vue'
  import HoverCardTrigger from '../../overlay/hover-card/hover-card-trigger/hover-card-trigger.vue'
  import SourcesMark from '../sources/parts/sources-mark.vue'
  import type { SourcesItem } from '../sources/types'
  import { sourceName, sourceSite } from '../sources/types'

  defineOptions({
    name: 'Citation',
    inheritAttrs: false
  })

  export interface CitationProps {
    /** 1-based numbers of the sources this reference cites, in order: `[1]` gives `[1]`, `[1][3]` and `[1, 3]` give `[1, 3]`. */
    indexes: number[]
    /** The sources of the response, in citation order; `indexes` point into it. A number with no source renders as a plain numbered note. */
    sources?: SourcesItem[]
  }

  const props = withDefaults(defineProps<CitationProps>(), {
    sources: () => []
  })

  interface CitedSource {
    index: number
    item: SourcesItem
  }

  const attrs = useAttrs()
  const { t } = useTranslate({ citation: en.citation })
  const cardId = `${useId()}-card`

  const open = ref<boolean>(false)
  const page = ref<number>(0)
  const chipEl = ref<globalThis.HTMLButtonElement | null>(null)

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'citation')
  const cited = computed<CitedSource[]>(() =>
    props.indexes.flatMap((index) => {
      const item = props.sources[index - 1]
      return item ? [{ index, item }] : []
    })
  )
  const first = computed<CitedSource | undefined>(() => cited.value[0])
  const more = computed<number>(() => cited.value.length - 1)
  const current = computed<CitedSource | undefined>(
    () => cited.value[Math.min(page.value, cited.value.length - 1)]
  )
  const text = computed<string>(() => (first.value ? sourceName(first.value.item) : ''))
  const numbers = computed<string>(() => props.indexes.join(', '))
  const label = computed<string>(() => {
    const source = first.value
    if (!source) return t('citation.labelUntitled', { index: numbers.value })
    if (more.value > 0)
      return t('citation.labelMany', {
        site: text.value,
        more: more.value,
        indexes: cited.value.map(({ index }) => index).join(', ')
      })
    const site = sourceSite(source.item)
    if (site)
      return t('citation.labelWithSite', {
        index: source.index,
        site,
        title: source.item.title || site
      })
    return t('citation.label', { index: source.index, title: source.item.title })
  })
  const currentHref = computed<string | null>(() => safeHref(current.value?.item.href))
  const external = computed<boolean>(() => /^https?:\/\//i.test(currentHref.value ?? ''))

  function onClick(event: globalThis.MouseEvent): void {
    const pointer = (event as globalThis.PointerEvent).pointerType
    open.value = pointer === 'mouse' ? true : !open.value
  }

  function onDocumentPointerdown(event: globalThis.PointerEvent): void {
    const target = event.target as globalThis.Node | null
    if (!target || chipEl.value?.contains(target)) return
    if (globalThis.document.getElementById(cardId)?.contains(target)) return
    open.value = false
  }

  function stopListening(): void {
    globalThis.document?.removeEventListener('pointerdown', onDocumentPointerdown)
  }

  watch(open, (value) => {
    if (!value) return stopListening()
    page.value = 0
    globalThis.document?.addEventListener('pointerdown', onDocumentPointerdown)
  })

  onScopeDispose(stopListening)

  const CHIP_CLASS =
    'inline-flex h-5 max-w-48 items-center gap-(--spacing-2xs) rounded-(--shape-control) bg-(--bg-selected) ps-(--spacing-2xs) pe-(--spacing-xs) align-middle ' +
    'text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'hover:bg-(--bg-active) data-[state=open]:bg-(--bg-active) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <HoverCard
    v-if="first"
    v-bind="$attrs"
    v-model:open="open"
    :open-delay="300"
    :close-delay="200"
    align="start"
    :data-testid="testId"
    data-slot="citation"
    class="align-middle"
  >
    <HoverCardTrigger :data-testid="`${testId}__trigger`">
      <button
        ref="chipEl"
        type="button"
        :aria-label="label"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="open ? cardId : undefined"
        :data-testid="`${testId}__chip`"
        :data-state="open ? 'open' : 'closed'"
        :class="CHIP_CLASS"
        @click="onClick"
      >
        <SourcesMark
          :item="first.item"
          size="tiny"
        />
        <span class="truncate">{{ text }}</span>
        <span
          v-if="more > 0"
          :data-testid="`${testId}__more`"
          class="shrink-0 text-(--text-muted)"
          >+{{ more }}</span
        >
      </button>
    </HoverCardTrigger>
    <HoverCardContent :data-testid="`${testId}__card`">
      <div
        v-if="current"
        :id="cardId"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <span
          class="flex min-w-0 items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)"
        >
          <SourcesMark :item="current.item" />
          <span class="truncate">{{ sourceName(current.item) }}</span>
        </span>
        <a
          v-if="currentHref"
          :href="currentHref"
          :target="external ? '_blank' : undefined"
          :rel="external ? 'noopener noreferrer' : undefined"
          :data-testid="`${testId}__link`"
          class="line-clamp-2 rounded-(--shape-control) text-label-md text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >
          {{ current.item.title }}
        </a>
        <span
          v-else
          class="line-clamp-2 text-label-md text-(--text-default)"
        >
          {{ current.item.title }}
        </span>
        <p
          v-if="current.item.description"
          class="m-0 line-clamp-3 text-body-sm text-(--text-muted)"
        >
          {{ current.item.description }}
        </p>
        <div
          v-if="more > 0"
          :data-testid="`${testId}__pager`"
          class="flex items-center justify-end gap-(--spacing-2xs)"
        >
          <IconButton
            icon="az az-chevron-left"
            :aria-label="t('citation.previous')"
            variant="ghost"
            size="small"
            :disabled="page === 0"
            :data-testid="`${testId}__previous`"
            @click="page -= 1"
          />
          <span
            aria-live="polite"
            :data-testid="`${testId}__page`"
            class="text-label-sm text-(--text-muted) tabular-nums"
          >
            {{ t('citation.page', { current: page + 1, total: cited.length }) }}
          </span>
          <IconButton
            icon="az az-chevron-right"
            :aria-label="t('citation.next')"
            variant="ghost"
            size="small"
            :disabled="page >= cited.length - 1"
            :data-testid="`${testId}__next`"
            @click="page += 1"
          />
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
  <span
    v-else
    v-bind="$attrs"
    role="note"
    :aria-label="label"
    :data-testid="testId"
    data-slot="citation"
    class="inline-flex h-5 items-center rounded-(--shape-control) bg-(--bg-selected) px-(--spacing-xs) align-middle text-label-sm text-(--text-default)"
  >
    {{ numbers }}
  </span>
</template>
