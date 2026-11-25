<script setup lang="ts">
  import { computed, inject, nextTick, onMounted, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import { useMinuteClock } from '../../../composables/use-minute-clock'
  import { LocaleInjectionKey } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import CopyButton from '../../action/copy-button/copy-button.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { relativeText, toDate } from './timestamp-format'

  defineOptions({ name: 'Timestamp', inheritAttrs: false })

  /** What the text of the timestamp shows. */
  export type TimestampFormat = 'relative' | 'local' | 'utc' | 'time'

  export interface TimestampProps {
    /**
     * The moment: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits
     * or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash with
     * no panel.
     */
    value?: string | number | Date
    /** What the text shows: the relative phrase that updates every minute, the date and time in the time zone, the date and time in UTC, or only the hour and minute in the time zone (for a row under a date header). The panel always lists every form. */
    format?: TimestampFormat
    /** IANA time zone of the local time (`America/New_York`). Empty reads the nearest `ConfigProvider`'s `time-zone`, then the browser's zone. */
    timeZone?: string
  }

  const props = withDefaults(defineProps<TimestampProps>(), {
    value: undefined,
    format: 'local',
    timeZone: ''
  })

  const DAY: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  const TIME: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }

  const CLOCK: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit'
  }

  const attrs = useAttrs()
  const provider = inject(LocaleInjectionKey, null)
  const now = useMinuteClock()
  const { t, formatDate, formatRelativeTime } = useLocale({ timestamp: en.timestamp })

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'timestamp')

  const mounted = ref<boolean>(false)
  const browserZone = ref<string>('')
  const open = ref<boolean>(false)
  const armed = ref<boolean>(false)

  const date = computed<Date | null>(() => toDate(props.value))
  const chosenZone = computed<string>(() => props.timeZone || provider?.timeZone?.value || '')
  const zone = computed<string>(
    () => chosenZone.value || (mounted.value ? browserZone.value : 'UTC')
  )
  const absolute = (target: Date, zoned: Intl.DateTimeFormatOptions): string =>
    `${formatDate(target, { ...DAY, ...zoned })}, ${formatDate(target, { ...TIME, ...zoned })}`
  const inZone = (target: Date, timeZone: string): string => {
    try {
      return absolute(target, timeZone ? { timeZone } : {})
    } catch {
      return absolute(target, { timeZone: 'UTC' })
    }
  }

  const relative = computed<string>(() =>
    date.value
      ? relativeText(date.value, now.value, t('timestamp.justNow'), formatRelativeTime)
      : ''
  )
  const utc = computed<string>(() => (date.value ? inZone(date.value, 'UTC') : ''))
  const local = computed<string>(() => (date.value ? inZone(date.value, zone.value) : ''))
  const clock = computed<string>(() => {
    if (!date.value) return ''
    try {
      return formatDate(date.value, { ...CLOCK, ...(zone.value ? { timeZone: zone.value } : {}) })
    } catch {
      return formatDate(date.value, { ...CLOCK, timeZone: 'UTC' })
    }
  })
  const text = computed<string>(() => {
    if (props.format === 'relative') return relative.value
    if (props.format === 'utc') return utc.value
    if (props.format === 'time') return clock.value
    return local.value
  })

  interface Row {
    id: string
    label: string
    value: string
    note?: string
  }

  const rows = computed<Row[]>(() => {
    const moment = date.value
    if (!moment) return []
    const list: Row[] = [
      { id: 'utc', label: t('timestamp.utc'), value: moment.toISOString() },
      { id: 'local', label: t('timestamp.local'), value: local.value, note: zone.value }
    ]
    if (mounted.value && browserZone.value && browserZone.value !== zone.value)
      list.push({
        id: 'browser',
        label: t('timestamp.browser'),
        value: inZone(moment, browserZone.value),
        note: browserZone.value
      })
    list.push({ id: 'relative', label: t('timestamp.relative'), value: relative.value })
    list.push({
      id: 'raw',
      label: t('timestamp.raw'),
      value: props.value instanceof Date ? props.value.toISOString() : String(props.value)
    })
    return list
  })

  const textEl = ref<HTMLButtonElement | null>(null)
  const arm = (): void => {
    armed.value = true
    open.value = true
    void nextTick(() => textEl.value?.focus({ preventScroll: true }))
  }

  onMounted(() => {
    browserZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    mounted.value = true
  })

  const TEXT_CLASS =
    'relative cursor-pointer rounded-(--shape-control) text-start underline decoration-dotted decoration-(--border-strong) underline-offset-4 outline-none transition-colors duration-150 ease-out ' +
    'hover:decoration-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'motion-reduce:transition-none'

  const ROW_CLASS =
    'flex items-center gap-(--spacing-sm) border-b-(length:--border-width-default) border-solid border-(--border-default) py-(--spacing-xs) ps-(--spacing-sm) pe-(--spacing-xs) ' +
    'last:border-b-0'
</script>

<template>
  <Popover
    v-if="date && armed"
    v-bind="$attrs"
    v-model:open="open"
    :data-testid="testId"
    :data-format="format"
    side="auto"
  >
    <PopoverTrigger>
      <button
        ref="textEl"
        type="button"
        :data-testid="`${testId}__text`"
        :class="TEXT_CLASS"
      >
        <time
          :datetime="date.toISOString()"
          dir="auto"
          >{{ text }}</time
        >
        <span
          aria-hidden="true"
          data-slot="touch-target"
          class="absolute hidden inset-x-0 inset-y-[min(0rem,calc(50%-20px))] pointer-coarse:block"
        />
      </button>
    </PopoverTrigger>
    <PopoverContent :data-testid="`${testId}__panel`">
      <PopoverTitle class="sr-only">{{ t('timestamp.title') }}</PopoverTitle>
      <dl
        v-if="open"
        :data-testid="`${testId}__details`"
        class="flex flex-col py-(--spacing-2xs)"
      >
        <div
          v-for="row in rows"
          :key="row.id"
          :data-testid="`${testId}__row`"
          :data-row="row.id"
          :class="ROW_CLASS"
        >
          <dt class="w-20 shrink-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
          <dd class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
            <span class="flex min-w-0 flex-1 flex-col">
              <span
                dir="ltr"
                class="break-all text-start text-label-code-sm text-(--text-default)"
                >{{ row.value }}</span
              >
              <span
                v-if="row.note"
                dir="ltr"
                class="text-start text-body-xs text-(--text-muted)"
                >{{ row.note }}</span
              >
            </span>
            <CopyButton
              :value="row.value"
              :aria-label="t('timestamp.copy', { label: row.label })"
              size="small"
              variant="ghost"
            />
          </dd>
        </div>
      </dl>
    </PopoverContent>
  </Popover>
  <span
    v-else-if="date"
    v-bind="$attrs"
    :data-testid="testId"
    :data-format="format"
    data-state="closed"
    class="inline-block"
  >
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      :data-testid="`${testId}__text`"
      :class="TEXT_CLASS"
      @click="arm"
    >
      <time
        :datetime="date.toISOString()"
        dir="auto"
        data-allow-mismatch="text"
        >{{ text }}</time
      >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute hidden inset-x-0 inset-y-[min(0rem,calc(50%-20px))] pointer-coarse:block"
      />
    </button>
  </span>
  <span
    v-else
    v-bind="$attrs"
    :data-testid="testId"
    :data-format="format"
    data-invalid
    class="text-(--text-muted)"
    >—</span
  >
</template>
