<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import { useMinuteClock } from '../../../composables/use-minute-clock'
  import * as en from '../../../locales/en'
  import Tag from '../tag/tag.vue'
  import { relativeText, toDate } from '../timestamp/timestamp-format'
  import { DAY_MINUTES, durationParts, roundedMinutes } from './lib/countdown-phrase'

  defineOptions({ name: 'Countdown', inheritAttrs: false })

  /** The words of the phrase: `due` for a task or an SLA, `expiry` for something that ends. */
  export type CountdownType = 'due' | 'expiry'

  /** Size token of the tag. */
  export type CountdownSize = 'small' | 'medium'

  export interface CountdownProps {
    /** The deadline: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash. */
    deadline?: string | number | Date
    /** Time left, in milliseconds, at or under which the countdown turns to warning. `0` stays neutral until the deadline passes. */
    warningThreshold?: number
    /** Name of what is due (`First reply`, `Certificate`), shown before the phrase. Empty shows the phrase alone. */
    label?: string
    /** The words of the phrase: `due` says `Due in` and `Overdue by` (a task, an SLA); `expiry` says `Expires in` and `Expired` (a certificate, a key, a trial). */
    type?: CountdownType
    /** The clock is stopped (an SLA waiting on the customer): the countdown says `Paused` with a pause icon, stays neutral and stops counting. */
    paused?: boolean
    /** Size token of the tag; `medium` is 24px tall, `small` is 20px. */
    size?: CountdownSize
  }

  const props = withDefaults(defineProps<CountdownProps>(), {
    deadline: undefined,
    warningThreshold: 3_600_000,
    label: '',
    type: 'due',
    paused: false,
    size: 'medium'
  })

  type CountdownState = 'remaining' | 'warning' | 'overdue' | 'paused'
  type UnitDisplay = 'narrow' | 'long'

  const ICONS: Record<CountdownState, string> = {
    remaining: 'az az-clock',
    warning: 'az az-triangle-alert',
    overdue: 'az az-circle-alert',
    paused: 'az az-circle-pause'
  }

  const SEVERITIES = {
    remaining: 'neutral',
    warning: 'warning',
    overdue: 'danger',
    paused: 'neutral'
  } as const

  const attrs = useAttrs()
  const now = useMinuteClock()
  const { t, formatNumber, formatRelativeTime } = useLocale({
    countdown: en.countdown,
    timestamp: en.timestamp
  })

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'countdown')

  const date = computed<Date | null>(() => toDate(props.deadline))
  const left = computed<number>(() => (date.value ? date.value.getTime() - now.value : 0))

  const state = computed<CountdownState>(() => {
    if (props.paused) return 'paused'
    if (left.value <= 0) return 'overdue'
    if (props.warningThreshold > 0 && left.value <= props.warningThreshold) return 'warning'
    return 'remaining'
  })

  const duration = (minutes: number, unitDisplay: UnitDisplay): string => {
    const [major, minor] = durationParts(minutes).map((part) =>
      formatNumber(part.value, { style: 'unit', unit: part.unit, unitDisplay })
    )
    return minor ? t('countdown.duration', { major, minor }) : (major ?? '')
  }

  const relative = (target: Date): string =>
    relativeText(target, now.value, t('timestamp.justNow'), formatRelativeTime)

  const phrase = (unitDisplay: UnitDisplay): string => {
    const target = date.value
    if (!target) return ''
    if (state.value === 'paused') return t('countdown.paused')
    const due = props.type === 'due'
    const minutes = roundedMinutes(left.value)
    if (state.value === 'overdue')
      return due
        ? t('countdown.overdue', { duration: duration(minutes, unitDisplay) })
        : t('countdown.expired', { relative: relative(target) })
    if (minutes >= DAY_MINUTES)
      return t(due ? 'countdown.due' : 'countdown.expires', { relative: relative(target) })
    return t(due ? 'countdown.dueIn' : 'countdown.expiresIn', {
      duration: duration(minutes, unitDisplay)
    })
  }

  const shortText = computed<string>(() => phrase('narrow'))
  const longText = computed<string>(() => phrase('long'))
</script>

<template>
  <Tag
    v-if="date"
    v-bind="$attrs"
    :data-testid="testId"
    :data-type="type"
    :data-overdue="state === 'overdue' || null"
    :data-paused="paused || null"
    :severity="SEVERITIES[state]"
    :size="size"
    :icon="ICONS[state]"
  >
    <span class="inline-flex items-center gap-(--spacing-2xs) whitespace-nowrap">
      <span
        v-if="label"
        :data-testid="`${testId}__label`"
        dir="auto"
        >{{ `${t('countdown.label', { label })} ` }}</span
      >
      <time
        :datetime="date.toISOString()"
        :data-testid="`${testId}__text`"
        data-allow-mismatch="text"
        ><span aria-hidden="true">{{ shortText }}</span
        ><span class="sr-only">{{ longText }}</span></time
      >
    </span>
  </Tag>
  <span
    v-else
    v-bind="$attrs"
    :data-testid="testId"
    :data-type="type"
    data-invalid
    class="text-(--text-muted)"
    >—</span
  >
</template>
