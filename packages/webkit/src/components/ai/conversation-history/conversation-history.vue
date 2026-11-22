<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useLocaleContext, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../input/input/input.vue'

  export interface ConversationHistoryItem {
    id: string
    title: string
    updatedAt: string | number | Date
  }

  type GroupKey = 'today' | 'yesterday' | 'previous7' | 'previous30' | 'older'

  defineOptions({
    name: 'ConversationHistory',
    inheritAttrs: false
  })

  export interface ConversationHistoryProps {
    /** Conversations, any order; they are sorted newest first inside their group. */
    items?: ConversationHistoryItem[]
    /** Reference time for the groups. Empty uses the nearest ConfigProvider now, then the current time; set either when the list is rendered on the server. */
    now?: string | number | Date
    /** Shows a Delete button on each row that emits `remove`. */
    removable?: boolean
    /** Shows a New chat row at the top that emits `create`. */
    creatable?: boolean
    /** Shows a search field at the top that hides conversations whose title does not contain the typed text. */
    searchable?: boolean
    /** Shows placeholder rows while the history loads. */
    loading?: boolean
    /** Accessible name of the list. Empty uses the locale catalog (`Conversation history`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ConversationHistoryProps>(), {
    items: () => [],
    now: undefined,
    removable: false,
    creatable: false,
    searchable: false,
    loading: false,
    ariaLabel: ''
  })

  const model = defineModel<string | null>({ default: null })

  const emit = defineEmits<{
    remove: [event: MouseEvent, id: string]
    create: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const { t, locale } = useTranslate({ conversationHistory: en.conversationHistory })
  const { context: localeContext } = useLocaleContext()
  const query = ref('')

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'conversation-history'
  )

  const ORDER: GroupKey[] = ['today', 'yesterday', 'previous7', 'previous30', 'older']
  const DAY = 86_400_000

  const startOfDay = (time: number): number => {
    const date = new Date(time)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  }

  const lazy = Object.fromEntries(
    ORDER.map((key) => [key, useLazyChunks({ rowHeight: 40 })])
  ) as Record<GroupKey, ReturnType<typeof useLazyChunks>>

  const groupOf = (time: number, today: number): GroupKey => {
    const days = Math.round((today - startOfDay(time)) / DAY)
    if (days <= 0) return 'today'
    if (days === 1) return 'yesterday'
    if (days < 7) return 'previous7'
    if (days < 30) return 'previous30'
    return 'older'
  }

  const needle = computed<string>(() =>
    props.searchable ? query.value.trim().toLocaleLowerCase(locale.value) : ''
  )

  const visibleItems = computed<ConversationHistoryItem[]>(() =>
    needle.value
      ? props.items.filter((item) =>
          item.title.toLocaleLowerCase(locale.value).includes(needle.value)
        )
      : props.items
  )

  const groups = computed(() => {
    const reference = props.now ?? localeContext?.now?.value ?? Date.now()
    const today = startOfDay(new Date(reference).getTime())
    const buckets = new Map<GroupKey, { item: ConversationHistoryItem; time: number }[]>()
    for (const item of visibleItems.value) {
      const time = new Date(item.updatedAt).getTime()
      const key = groupOf(Number.isNaN(time) ? 0 : time, today)
      const bucket = buckets.get(key)
      if (bucket) bucket.push({ item, time })
      else buckets.set(key, [{ item, time }])
    }
    return ORDER.filter((key) => buckets.has(key)).map((key) => ({
      key,
      chunks: lazy[key].split(
        buckets
          .get(key)!
          .sort((a, b) => b.time - a.time)
          .map(({ item }) => item)
      )
    }))
  })

  const navEl = ref<HTMLElement | null>(null)
  const removing = ref<{ id: string; index: number } | null>(null)
  let focusFrame = 0
  let focusDeadline = 0

  const orderedIds = () =>
    groups.value.flatMap((group) =>
      group.chunks.flatMap((chunk) => chunk.items.map((item) => item.id))
    )

  const onRemove = (event: MouseEvent, id: string) => {
    removing.value = { id, index: orderedIds().indexOf(id) }
    emit('remove', event, id)
  }

  const focusAfterRemoval = () => {
    focusFrame = 0
    const pending = removing.value
    if (!pending || !navEl.value) return
    const active = document.activeElement
    const lost = !active || active === document.body || !active.isConnected
    if (!lost) {
      if (performance.now() < focusDeadline) focusFrame = requestAnimationFrame(focusAfterRemoval)
      else removing.value = null
      return
    }
    removing.value = null
    const rows = Array.from(
      navEl.value.querySelectorAll<HTMLElement>('[data-slot="conversation-history-item"]')
    )
    const target = rows[Math.min(pending.index, rows.length - 1)] ?? navEl.value
    target.focus()
  }

  watch(
    () => props.items.map((item) => item.id),
    (ids) => {
      const pending = removing.value
      if (!pending) return
      if (ids.includes(pending.id)) {
        removing.value = null
        return
      }
      cancelAnimationFrame(focusFrame)
      focusDeadline = performance.now() + 1000
      focusFrame = requestAnimationFrame(focusAfterRemoval)
    },
    { flush: 'post' }
  )

  onScopeDispose(() => cancelAnimationFrame(focusFrame))

  const ITEM_CLASS =
    'group/item relative flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) pe-(--spacing-2xs) pointer-fine:pe-0 transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) ' +
    'data-[active]:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const ITEM_BUTTON_CLASS =
    'flex h-10 min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-sm) text-start text-label-lg text-(--text-default) outline-none ' +
    'pointer-fine:h-9 pointer-fine:text-label-md ' +
    'pointer-fine:group-data-[removable]/item:group-hover/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-focus-within/item:pe-10 ' +
    'pointer-fine:group-data-[removable]/item:group-data-[active]/item:pe-10 ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const REMOVE_CLASS =
    'transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'pointer-fine:absolute pointer-fine:end-(--spacing-2xs) pointer-fine:top-1/2 pointer-fine:-translate-y-1/2 ' +
    'pointer-fine:opacity-0 pointer-fine:group-hover/item:opacity-100 pointer-fine:group-focus-within/item:opacity-100 pointer-fine:group-data-[active]/item:opacity-100'

  const NEW_CHAT_CLASS =
    ITEM_BUTTON_CLASS +
    ' transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none'

  const NOTE_CLASS = 'm-0 px-(--spacing-sm) text-body-sm text-(--text-muted)'
</script>

<template>
  <nav
    ref="navEl"
    v-bind="$attrs"
    tabindex="-1"
    :aria-label="ariaLabel || t('conversationHistory.label')"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-md) outline-none"
  >
    <div
      v-if="creatable || searchable"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <button
        v-if="creatable"
        type="button"
        :class="NEW_CHAT_CLASS"
        :data-testid="`${testId}__create`"
        @click="(event: MouseEvent) => emit('create', event)"
      >
        <i
          class="az az-square-pen shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate">{{ t('conversationHistory.newChat') }}</span>
      </button>
      <Input
        v-if="searchable"
        v-model="query"
        :aria-label="t('conversationHistory.search')"
        :placeholder="t('conversationHistory.search')"
        autocomplete="off"
        :spellcheck="false"
        class="rounded-full"
        :data-testid="`${testId}__search`"
      >
        <template #leading>
          <i class="az az-search" />
        </template>
      </Input>
    </div>
    <ul
      v-if="loading"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
      :data-testid="`${testId}__loading`"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="px-(--spacing-sm)"
      >
        <Skeleton
          variant="rectangle"
          :width="`${90 - n * 8}%`"
          height="var(--size-5)"
        />
      </li>
    </ul>
    <p
      v-else-if="!items.length"
      :class="NOTE_CLASS"
      :data-testid="`${testId}__empty`"
    >
      {{ t('conversationHistory.emptyTitle') }}
    </p>
    <p
      v-else-if="!visibleItems.length"
      :class="NOTE_CLASS"
      :data-testid="`${testId}__no-match`"
    >
      {{ t('conversationHistory.noMatch', { query: query.trim() }) }}
    </p>
    <template v-else>
      <div
        v-for="group in groups"
        :key="group.key"
        class="flex flex-col gap-(--spacing-2xs)"
        :data-group="group.key"
      >
        <p
          :id="`${uid}-${group.key}`"
          class="m-0 px-(--spacing-sm) pb-(--spacing-2xs) text-label-sm text-(--text-muted)"
        >
          {{ t(`conversationHistory.${group.key}`) }}
        </p>
        <ul
          :aria-labelledby="`${uid}-${group.key}`"
          class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
        >
          <template
            v-for="chunk in group.chunks"
            :key="chunk.index"
          >
            <li
              v-if="!chunk.mounted"
              :ref="(el) => lazy[group.key].observe(el, chunk.index)"
              :data-chunk="chunk.index"
              aria-hidden="true"
              class="shrink-0"
              :style="{ height: `${chunk.estimatedHeight}px` }"
            />
            <template v-else>
              <li
                v-for="item in chunk.items"
                :key="item.id"
                :data-active="item.id === model || null"
                :data-removable="removable || null"
                :data-testid="`${testId}__item`"
                :class="ITEM_CLASS"
              >
                <button
                  type="button"
                  data-slot="conversation-history-item"
                  :aria-current="item.id === model ? 'page' : undefined"
                  :title="item.title"
                  :class="ITEM_BUTTON_CLASS"
                  @click="model = item.id"
                >
                  <bdi
                    dir="auto"
                    class="truncate"
                    >{{ item.title }}</bdi
                  >
                </button>
                <IconButton
                  v-if="removable"
                  icon="az az-trash"
                  :ariaLabel="t('conversationHistory.delete', { title: item.title })"
                  variant="ghost"
                  size="small"
                  :class="REMOVE_CLASS"
                  :data-testid="`${testId}__remove`"
                  @click="(event: MouseEvent) => onRemove(event, item.id)"
                />
              </li>
            </template>
          </template>
        </ul>
      </div>
    </template>
  </nav>
</template>
