<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import Avatar from '../../../content/avatar/avatar.vue'
  import { relativeText, toDate } from '../../../content/timestamp/timestamp-format'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { useMinuteClock } from './minute-clock'

  defineOptions({
    name: 'TableCellTime',
    inheritAttrs: false
  })

  export interface TableCellTimeProps {
    /** The moment: a `Date`, an epoch in milliseconds or an ISO string. Empty or unparseable renders a muted dash. */
    value?: string | number | Date
    /** Who made the change: a name or an email (`jane.doe@example.com` reads `Jane Doe`). Shows an avatar with the name on its tooltip. */
    author?: string
    /** Avatar image for `author`. */
    avatarSrc?: string
  }

  const props = withDefaults(defineProps<TableCellTimeProps>(), {
    value: undefined,
    author: '',
    avatarSrc: ''
  })

  const attrs = useAttrs()
  const now = useMinuteClock()
  const { t, formatDate, formatRelativeTime } = useLocale({ tableCellTime: en.tableCellTime })
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-cell-time'
  )

  const date = computed<Date | null>(() => toDate(props.value))
  const relative = computed<string>(() =>
    date.value
      ? relativeText(date.value, now.value, t('tableCellTime.justNow'), formatRelativeTime)
      : ''
  )
  const mounted = ref(false)
  onMounted(() => (mounted.value = true))
  const absolute = computed<string>(() =>
    date.value
      ? formatDate(date.value, {
          dateStyle: 'medium',
          timeStyle: 'short',
          ...(mounted.value ? {} : { timeZone: 'UTC' })
        })
      : ''
  )
  const displayName = computed<string>(() => {
    const raw = props.author.trim()
    if (!raw) return ''
    if (!raw.includes('@') && /\s/.test(raw)) return raw
    const local = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <Tooltip
      v-if="displayName"
      :content="displayName"
    >
      <Avatar
        :src="avatarSrc || undefined"
        :alt="displayName"
        :label="displayName"
        size="small"
        variant="square"
        :data-testid="`${testId}__avatar`"
      />
    </Tooltip>
    <Tooltip
      key="tooltip-2"
      v-if="date"
      :content="absolute"
      class="min-w-0 shrink!"
    >
      <time
        :datetime="date.toISOString()"
        :data-testid="`${testId}__time`"
        class="truncate text-body-sm text-(--text-muted)"
        >{{ relative }}<span class="sr-only">{{ `, ${absolute}` }}</span></time
      >
    </Tooltip>
    <span
      v-else-if="!displayName"
      class="text-body-sm text-(--text-muted)"
      >—</span
    >
  </div>
</template>
