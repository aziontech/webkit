<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useLocaleContext, useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'

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

  const props = withDefaults(
    defineProps<{
      /** Conversations, any order; they are sorted newest first inside their group. */
      items?: ConversationHistoryItem[]
      /** Reference time for the groups. Empty uses the nearest WebkitProvider now, then the current time; set either when the list is rendered on the server. */
      now?: string | number | Date
      /** Shows a Delete button on each row that emits `remove`. */
      removable?: boolean
      /** Shows placeholder rows while the history loads. */
      loading?: boolean
      /** Accessible name of the list. Empty uses the locale catalog (`Conversation history`). */
      label?: string
    }>(),
    {
      items: () => [],
      now: undefined,
      removable: false,
      loading: false,
      label: ''
    }
  )

  const model = defineModel<string | null>({ default: null })

  const emit = defineEmits<{
    remove: [id: string]
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const { t } = useTranslate({ conversationHistory: en.conversationHistory })
  const { context: localeContext } = useLocaleContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-conversation-history'
  )

  const ORDER: GroupKey[] = ['today', 'yesterday', 'previous7', 'previous30', 'older']
  const DAY = 86_400_000

  const startOfDay = (time: number): number => {
    const date = new Date(time)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  }

  const groupOf = (time: number, today: number): GroupKey => {
    const days = Math.round((today - startOfDay(time)) / DAY)
    if (days <= 0) return 'today'
    if (days === 1) return 'yesterday'
    if (days < 7) return 'previous7'
    if (days < 30) return 'previous30'
    return 'older'
  }

  const groups = computed(() => {
    const reference = props.now ?? localeContext?.now?.value ?? Date.now()
    const today = startOfDay(new Date(reference).getTime())
    const buckets = new Map<GroupKey, { item: ConversationHistoryItem; time: number }[]>()
    for (const item of props.items) {
      const time = new Date(item.updatedAt).getTime()
      const key = groupOf(Number.isNaN(time) ? 0 : time, today)
      buckets.set(key, [...(buckets.get(key) ?? []), { item, time }])
    }
    return ORDER.filter((key) => buckets.has(key)).map((key) => ({
      key,
      items: buckets
        .get(key)!
        .sort((a, b) => b.time - a.time)
        .map(({ item }) => item)
    }))
  })
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-label="label || t('conversationHistory.label')"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-md)"
  >
    <ul
      v-if="loading"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
      :data-testid="`${testId}__loading`"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="px-(--spacing-xs)"
      >
        <Skeleton
          kind="shape"
          :width="`${90 - n * 8}%`"
          height="var(--size-5)"
        />
      </li>
    </ul>
    <p
      v-else-if="!items.length"
      class="m-0 px-(--spacing-xs) text-body-sm text-(--text-muted)"
      :data-testid="`${testId}__empty`"
    >
      {{ t('conversationHistory.empty') }}
    </p>
    <template v-else>
      <div
        v-for="group in groups"
        :key="group.key"
        class="flex flex-col gap-(--spacing-xxs)"
        :data-group="group.key"
      >
        <p
          :id="`${uid}-${group.key}`"
          class="m-0 px-(--spacing-xs) text-overline-sm text-(--text-muted)"
        >
          {{ t(`conversationHistory.${group.key}`) }}
        </p>
        <ul
          :aria-labelledby="`${uid}-${group.key}`"
          class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
        >
          <li
            v-for="item in group.items"
            :key="item.id"
            :data-active="item.id === model || null"
            :data-testid="`${testId}__item`"
            class="group/item flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-elements) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) data-[active]:bg-(--bg-selected) motion-reduce:transition-none"
          >
            <button
              type="button"
              :aria-current="item.id === model ? 'page' : undefined"
              :title="item.title"
              class="flex h-8 min-w-0 flex-1 items-center rounded-(--shape-elements) px-(--spacing-xs) text-start text-label-sm text-(--text-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
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
              icon="pi pi-trash"
              :ariaLabel="t('conversationHistory.remove', { title: item.title })"
              kind="transparent"
              size="small"
              :data-testid="`${testId}__remove`"
              @click="emit('remove', item.id)"
            />
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
