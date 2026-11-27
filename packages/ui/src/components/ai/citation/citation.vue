<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import HoverCard from '../../overlay/hover-card/hover-card.vue'
  import HoverCardContent from '../../overlay/hover-card/hover-card-content/hover-card-content.vue'
  import HoverCardTrigger from '../../overlay/hover-card/hover-card-trigger/hover-card-trigger.vue'
  import SourcesItemPart from '../sources/parts/sources-item.vue'
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

  function onClick(event: globalThis.MouseEvent): void {
    const pointer = 'pointerType' in event ? event.pointerType : ''
    open.value = pointer === 'mouse' ? true : !open.value
  }

  function onDocumentPointerdown(event: globalThis.PointerEvent): void {
    const target = event.target
    if (!(target instanceof globalThis.Node) || chipEl.value?.contains(target)) return
    if (globalThis.document.getElementById(cardId)?.contains(target)) return
    open.value = false
  }

  function stopListening(): void {
    globalThis.document?.removeEventListener('pointerdown', onDocumentPointerdown)
  }

  watch(open, (value) => {
    if (!value) return stopListening()
    globalThis.document?.addEventListener('pointerdown', onDocumentPointerdown)
  })

  onScopeDispose(stopListening)

  const CHIP_CLASS =
    'relative inline-flex h-5 max-w-48 items-center gap-(--spacing-2xs) rounded-(--shape-control) bg-(--bg-selected) ps-(--spacing-2xs) pe-(--spacing-xs) align-middle ' +
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
        <span
          aria-hidden="true"
          :data-testid="`${testId}__hit-area`"
          class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
        />
      </button>
    </HoverCardTrigger>
    <HoverCardContent :data-testid="`${testId}__card`">
      <ol
        :id="cardId"
        :data-testid="`${testId}__list`"
        class="m-0 flex list-none flex-col divide-y divide-(--border-default) p-0"
      >
        <li
          v-for="(source, i) in cited"
          :key="`${i}-${source.index}`"
          class="py-(--spacing-sm) first:pt-0 last:pb-0"
        >
          <SourcesItemPart
            :item="source.item"
            :data-testid="`${testId}__item`"
          />
        </li>
      </ol>
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
