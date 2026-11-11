<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Input from '../../inputs/input/input.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import Tag from '../tag/tag.vue'

  export interface OverflowCountEntry {
    label: string
    href?: string
  }

  export type OverflowCountItem = string | OverflowCountEntry

  export type OverflowCountNoun = string | { one: string; other: string }

  defineOptions({
    name: 'OverflowCount',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The hidden items. The chip reads `+<length>`; an item with `href` opens in a new tab. */
      items?: OverflowCountItem[]
      /** What the items are, for the summary and the trigger's name. Empty uses the catalog (`item` / `items`). */
      noun?: OverflowCountNoun
    }>(),
    {
      items: () => [],
      noun: undefined
    }
  )

  defineSlots<{
    /** One list entry; replaces the built-in text or link. */
    item(props: { item: OverflowCountEntry; index: number }): unknown
  }>()

  const SEARCH_THRESHOLD = 7
  const BATCH = 10

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ overflowCount: en.overflowCount })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-overflow-count'
  )

  const entries = computed<OverflowCountEntry[]>(() =>
    props.items.map((item) => (typeof item === 'string' ? { label: item } : item))
  )
  const total = computed<number>(() => entries.value.length)

  const nounFor = (count: number): string => {
    const noun = props.noun
    if (!noun) return t('overflowCount.noun', { count })
    if (typeof noun === 'string') return noun
    const rule = new Intl.PluralRules(locale.value).select(count)
    return rule === 'one' ? noun.one : noun.other
  }

  const open = ref<boolean>(false)
  const query = ref<string>('')
  const shown = ref<number>(BATCH)

  const searchable = computed<boolean>(() => total.value > SEARCH_THRESHOLD)
  const matches = computed<OverflowCountEntry[]>(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return entries.value
    return entries.value.filter((entry) => entry.label.toLowerCase().includes(needle))
  })
  const visible = computed<OverflowCountEntry[]>(() => matches.value.slice(0, shown.value))
  const remaining = computed<number>(() => matches.value.length - visible.value.length)
  const nextBatch = computed<number>(() => Math.min(BATCH, remaining.value))

  const summary = computed<string>(() => {
    const paged = remaining.value > 0 || query.value.trim() !== ''
    return paged
      ? t('overflowCount.paged', {
          shown: visible.value.length,
          count: total.value,
          noun: nounFor(total.value)
        })
      : t('overflowCount.summary', { count: total.value, noun: nounFor(total.value) })
  })
  const triggerLabel = computed<string>(() =>
    t('overflowCount.showAll', { count: total.value, noun: nounFor(total.value) })
  )

  const loadMore = (): void => {
    shown.value += BATCH
  }

  watch(open, (isOpen) => {
    if (isOpen) return
    query.value = ''
    shown.value = BATCH
  })
  watch(query, () => {
    shown.value = BATCH
  })
</script>

<template>
  <span
    v-if="total > 0"
    v-bind="$attrs"
    :data-testid="testId"
    class="inline-flex shrink-0"
    @click.stop
  >
    <Popover
      v-model:open="open"
      placement="bottom-start"
      width="small"
      :data-testid="`${testId}__popover`"
    >
      <PopoverTrigger
        :aria-label="triggerLabel"
        :data-testid="`${testId}__trigger`"
        class="rounded-(--shape-elements)"
      >
        <Tag
          :label="`+${total}`"
          severity="secondary"
          size="small"
          class="shrink-0 cursor-pointer tabular-nums"
        />
      </PopoverTrigger>

      <PopoverContent>
        <div
          class="flex flex-col gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
        >
          <PopoverTitle
            :data-testid="`${testId}__summary`"
            class="text-label-sm! text-(--text-muted)!"
          >
            {{ summary }}
          </PopoverTitle>
          <Input
            v-if="searchable"
            v-model="query"
            size="medium"
            :placeholder="t('overflowCount.search')"
            :aria-label="t('overflowCount.search')"
            :data-testid="`${testId}__search`"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </div>

        <ul
          :data-testid="`${testId}__list`"
          class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
        >
          <li
            v-for="(entry, index) in visible"
            :key="`${index}-${entry.label}`"
            :data-testid="`${testId}__item`"
            class="min-w-0"
          >
            <slot
              name="item"
              :item="entry"
              :index="index"
            >
              <a
                v-if="entry.href"
                :href="entry.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-h-7 items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) no-underline transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <span
                  dir="auto"
                  class="min-w-0 truncate"
                  >{{ entry.label }}</span
                >
                <span class="sr-only">{{ ` ${t('overflowCount.newTab')}` }}</span>
                <i
                  class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                  aria-hidden="true"
                />
              </a>
              <span
                v-else
                dir="auto"
                class="block min-h-7 truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
                >{{ entry.label }}</span
              >
            </slot>
          </li>
        </ul>
        <p
          v-if="matches.length === 0"
          :data-testid="`${testId}__no-match`"
          class="px-(--spacing-xs) pb-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
        >
          {{ t('overflowCount.noMatch', { query: query.trim() }) }}
        </p>

        <div
          v-if="remaining > 0"
          class="border-t-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-xxs)"
        >
          <Button
            :label="t('overflowCount.loadMore', { count: nextBatch })"
            kind="transparent"
            size="small"
            class="w-full"
            :data-testid="`${testId}__load-more`"
            @click="loadMore"
          />
        </div>

        <span
          class="sr-only"
          role="status"
          >{{ summary }}</span
        >
      </PopoverContent>
    </Popover>
  </span>
</template>
