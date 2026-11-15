<script setup lang="ts">
  import { computed, inject, nextTick, onMounted, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import { LocaleInjectionKey } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import { useMinuteClock } from '../../data/table/table-cell-time/minute-clock'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { relativeText, toDate } from './timestamp-format'

  defineOptions({ name: 'Timestamp', inheritAttrs: false })

  /** What the text of the timestamp shows. */
  export type TimestampFormat = 'relative' | 'local' | 'utc'

  interface Props {
    /** The moment: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash with no panel. */
    value?: string | number | Date
    /** What the text shows: the relative phrase that updates every minute, the date and time in the time zone, or the date and time in UTC. The panel always lists every form. */
    format?: TimestampFormat
    /** IANA time zone of the local time (`America/New_York`). Empty reads the nearest `WebkitProvider`'s `time-zone`, then the browser's zone. */
    timeZone?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    format: 'local',
    timeZone: ''
  })

  const ABSOLUTE: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }

  const attrs = useAttrs()
  const provider = inject(LocaleInjectionKey, null)
  const now = useMinuteClock()
  const { t, formatDate, formatRelativeTime } = useLocale({ timestamp: en.timestamp })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-timestamp'
  )

  const mounted = ref<boolean>(false)
  const browserZone = ref<string>('')
  const open = ref<boolean>(false)
  const armed = ref<boolean>(false)

  const date = computed<Date | null>(() => toDate(props.value))
  const chosenZone = computed<string>(() => props.timeZone || provider?.timeZone?.value || '')
  const zone = computed<string>(
    () => chosenZone.value || (mounted.value ? browserZone.value : 'UTC')
  )
  const inZone = (target: Date, timeZone: string): string => {
    try {
      return formatDate(target, timeZone ? { ...ABSOLUTE, timeZone } : ABSOLUTE)
    } catch {
      return formatDate(target, { ...ABSOLUTE, timeZone: 'UTC' })
    }
  }

  const relative = computed<string>(() =>
    date.value
      ? relativeText(date.value, now.value, t('timestamp.justNow'), formatRelativeTime)
      : ''
  )
  const utc = computed<string>(() => (date.value ? inZone(date.value, 'UTC') : ''))
  const local = computed<string>(() => (date.value ? inZone(date.value, zone.value) : ''))
  const text = computed<string>(() => {
    if (props.format === 'relative') return relative.value
    if (props.format === 'utc') return utc.value
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

  const textRef = ref<HTMLButtonElement | null>(null)
  const arm = (): void => {
    armed.value = true
    open.value = true
    void nextTick(() => textRef.value?.focus({ preventScroll: true }))
  }

  onMounted(() => {
    browserZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    mounted.value = true
  })
</script>

<template>
  <Popover
    v-if="date && armed"
    v-bind="$attrs"
    v-model:open="open"
    :data-testid="testId"
    :data-format="format"
    placement="auto"
  >
    <PopoverTrigger>
      <button
        ref="textRef"
        type="button"
        :data-testid="`${testId}__text`"
        class="cursor-pointer rounded-(--shape-elements) text-start underline decoration-dotted decoration-(--border-strong) underline-offset-4 outline-none transition-colors duration-150 ease-out hover:decoration-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
      >
        <time
          :datetime="date.toISOString()"
          dir="auto"
          >{{ text }}</time
        >
      </button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverTitle class="sr-only">{{ t('timestamp.title') }}</PopoverTitle>
      <dl
        v-if="open"
        :data-testid="`${testId}__details`"
        class="flex flex-col py-(--spacing-xxs)"
      >
        <div
          v-for="row in rows"
          :key="row.id"
          :data-testid="`${testId}__row`"
          :data-row="row.id"
          class="flex items-center gap-(--spacing-sm) border-b-(length:--border-width-default) border-solid border-(--border-default) py-(--spacing-xs) ps-(--spacing-sm) pe-(--spacing-xs) last:border-b-0"
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
              kind="transparent"
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
      class="cursor-pointer rounded-(--shape-elements) text-start underline decoration-dotted decoration-(--border-strong) underline-offset-4 outline-none transition-colors duration-150 ease-out hover:decoration-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
      @click="arm"
    >
      <time
        :datetime="date.toISOString()"
        dir="auto"
        >{{ text }}</time
      >
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
