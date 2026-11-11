<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import Avatar from '../../../content/avatar/avatar.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { TableInjectionKey } from '../injection-key'
  import { useMinuteClock } from './minute-clock'

  defineOptions({
    name: 'TableCellTime',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The moment: a `Date`, an epoch in milliseconds or an ISO string. Empty or unparseable renders a muted dash. */
      value?: string | number | Date
      /** Who made the change: a name or an email (`maria.silva@example.com` reads `Maria Silva`). Shows an avatar with the name on its tooltip. */
      author?: string
      /** Avatar image for `author`. */
      avatarSrc?: string
    }>(),
    {
      value: undefined,
      author: '',
      avatarSrc: ''
    }
  )

  const JUST_NOW_MS = 45_000

  const attrs = useAttrs()
  const now = useMinuteClock()
  const { t, formatDate, formatRelativeTime } = useLocale({ tableCellTime: en.tableCellTime })
  const ctx = inject(TableInjectionKey, null)
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-time` : 'data-table__cell-time')
  )

  const date = computed<Date | null>(() => {
    if (props.value === undefined || props.value === null || props.value === '') return null
    const parsed = props.value instanceof Date ? props.value : new Date(props.value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  })
  const relative = computed<string>(() => {
    if (!date.value) return ''
    if (Math.abs(date.value.getTime() - now.value) < JUST_NOW_MS) return t('tableCellTime.justNow')
    return formatRelativeTime(date.value)
  })
  const absolute = computed<string>(() =>
    date.value ? formatDate(date.value, { dateStyle: 'medium', timeStyle: 'short' }) : ''
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
      :text="displayName"
    >
      <Avatar
        :src="avatarSrc || undefined"
        :alt="displayName"
        :label="displayName"
        size="small"
        kind="square"
        :data-testid="`${testId}__avatar`"
      />
    </Tooltip>
    <Tooltip
      key="tooltip-2"
      v-if="date"
      :text="absolute"
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
