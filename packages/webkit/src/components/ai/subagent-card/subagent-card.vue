<script setup lang="ts">
  import { computed, nextTick, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { intlLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import type { StatusIndicatorSeverity } from '../../feedback/status-indicator/status-indicator.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'

  export type SubagentCardStatus = 'pending' | 'running' | 'success' | 'error' | 'canceled'

  defineOptions({
    name: 'SubagentCard',
    inheritAttrs: false
  })

  export interface SubagentCardProps {
    /** The helper agent's identifier, shown in code font (`researcher`). */
    name: string
    /** What the helper is doing in the reader's words (`Comparing cache plans`). Empty shows only the name. */
    title?: string
    /** One summary line under the row: the latest step, the result, or the error message. Empty hides the line. */
    description?: string
    /** `pending` waits on the reader, `running` is in flight, then `success`, `error` or `canceled` (stopped). */
    status?: SubagentCardStatus
    /** Seconds the helper has worked, when the host knows it. Without it the card counts its own running time, held while `pending`, frozen once the run ends. */
    duration?: number
    /** Offers `Stop` while the status is `running` or `pending`. */
    stoppable?: boolean
    /** Initial open state when uncontrolled; the helper's messages start collapsed. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<SubagentCardProps>(), {
    title: '',
    description: '',
    status: 'running',
    duration: undefined,
    stoppable: false,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /** The reader pressed `Stop`; the owner stops the helper and sets `status` to `canceled`. */
    stop: [event: MouseEvent]
  }>()

  /** Controlled open state. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  const slots = defineSlots<{
    /** The helper's own messages (`StreamingResponse`, `ToolCall`, a nested `SubagentCard`). */
    default?(): unknown
    /** The task the main agent gave the helper (`CodeBlock`, `KeyValueList`, or a sentence). */
    input?(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ subagentCard: en.subagentCard })
  const uid = useId()
  const panelId = `${uid}-panel`

  const rootEl = ref<HTMLElement | null>(null)
  const toggleEl = ref<HTMLButtonElement | null>(null)
  const stopEl = ref<HTMLElement | null>(null)

  const accumulated = ref<number>(0)
  const runningSince = ref<number | null>(null)
  const now = ref<number>(0)
  const seen = ref<boolean>(false)
  let ticker: ReturnType<typeof setInterval> | null = null

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'subagent-card'
  )
  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)
  const expandable = () => Boolean(slots.default || slots.input)
  const showStop = computed<boolean>(
    () => props.stoppable && (props.status === 'running' || props.status === 'pending')
  )

  const severity = computed<StatusIndicatorSeverity>(() => {
    if (props.status === 'success') return 'success'
    if (props.status === 'error') return 'danger'
    if (props.status === 'canceled') return 'warning'
    if (props.status === 'running') return 'info'
    return 'neutral'
  })

  const elapsedSeconds = computed<number | null>(() => {
    if (props.duration !== undefined) return Math.max(0, Math.round(props.duration))
    if (!seen.value) return null
    const live = runningSince.value === null ? 0 : Math.max(0, now.value - runningSince.value)
    return Math.floor((accumulated.value + live) / 1000)
  })

  const elapsed = computed<string>(() => {
    const total = elapsedSeconds.value
    if (total === null) return ''
    const unit = (value: number, name: 'hour' | 'minute' | 'second') =>
      new Intl.NumberFormat(intlLocale(locale.value), {
        style: 'unit',
        unit: name,
        unitDisplay: 'narrow'
      }).format(value)
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    if (hours > 0) return `${unit(hours, 'hour')} ${unit(minutes, 'minute')}`
    if (minutes > 0) return `${unit(minutes, 'minute')} ${unit(seconds, 'second')}`
    return unit(seconds, 'second')
  })

  function stopTicker(): void {
    if (ticker !== null) clearInterval(ticker)
    ticker = null
  }

  function startRunning(): void {
    seen.value = true
    now.value = Date.now()
    runningSince.value = now.value
    if (props.duration !== undefined || ticker !== null) return
    ticker = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }

  function endRunning(): void {
    stopTicker()
    if (runningSince.value === null) return
    accumulated.value += Math.max(0, Date.now() - runningSince.value)
    runningSince.value = null
  }

  watch(
    () => props.status,
    (next, previous) => {
      if (next === previous) return
      if (next === 'running') startRunning()
      else if (previous === 'running') endRunning()
    }
  )

  watch(
    showStop,
    (visible) => {
      if (visible) return
      const holder = stopEl.value
      if (!holder || !holder.contains(document.activeElement)) return
      void nextTick(() => {
        if (toggleEl.value) toggleEl.value.focus()
        else rootEl.value?.focus()
      })
    },
    { flush: 'pre' }
  )

  onMounted(() => {
    if (props.status === 'running') startRunning()
  })

  onScopeDispose(stopTicker)

  function toggle(): void {
    open.value = !isOpen.value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    ref="rootEl"
    :data-testid="testId"
    :data-status="status"
    :data-state="expandable() ? (isOpen ? 'open' : 'closed') : undefined"
    :tabindex="expandable() ? undefined : -1"
    class="flex w-full flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
  >
    <div class="flex flex-col gap-(--spacing-2xs) px-(--spacing-sm) py-(--spacing-xs)">
      <div class="flex min-h-10 flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs)">
        <button
          v-if="expandable()"
          ref="toggleEl"
          type="button"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="panelId"
          :data-testid="`${testId}__trigger`"
          class="flex min-h-10 min-w-0 flex-1 basis-48 items-center gap-(--spacing-xs) rounded-(--shape-control) text-start pointer-coarse:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          @click="toggle"
        >
          <i
            class="az az-git-fork shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
          <span
            class="flex min-w-0 flex-1 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)"
          >
            <span
              v-if="title"
              class="line-clamp-2 min-w-0 text-label-sm break-words text-(--text-default)"
            >
              {{ title }}
            </span>
            <code
              dir="ltr"
              class="max-w-full truncate rounded-(--shape-control) bg-(--bg-surface-raised) px-1 text-label-code-sm text-(--text-muted)"
              >{{ name }}</code
            >
          </span>
          <i
            :data-state="isOpen ? 'open' : 'closed'"
            class="az az-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-[rotate] duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
        <div
          v-else
          class="flex min-h-10 min-w-0 flex-1 basis-48 items-center gap-(--spacing-xs)"
        >
          <i
            class="az az-git-fork shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
          <span
            class="flex min-w-0 flex-1 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)"
          >
            <span
              v-if="title"
              class="line-clamp-2 min-w-0 text-label-sm break-words text-(--text-default)"
            >
              {{ title }}
            </span>
            <code
              dir="ltr"
              class="max-w-full truncate rounded-(--shape-control) bg-(--bg-surface-raised) px-1 text-label-code-sm text-(--text-muted)"
              >{{ name }}</code
            >
          </span>
        </div>
        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
          <span
            v-if="elapsed"
            :data-testid="`${testId}__elapsed`"
            class="shrink-0 text-label-sm tabular-nums text-(--text-muted)"
          >
            {{ elapsed }}
          </span>
          <span
            role="status"
            class="flex shrink-0"
          >
            <StatusIndicator
              :severity="severity"
              :loading="status === 'running'"
              :label="t(`subagentCard.${status}`)"
              :data-testid="`${testId}__status`"
            />
          </span>
          <span
            v-if="showStop"
            ref="stopEl"
            class="flex shrink-0"
          >
            <Button
              :label="t('subagentCard.stop')"
              :aria-label="t('subagentCard.stopAgent', { name })"
              icon="az az-stop"
              variant="ghost"
              size="small"
              :data-testid="`${testId}__stop`"
              @click="(event: MouseEvent) => emit('stop', event)"
            />
          </span>
        </div>
      </div>
      <p
        v-if="description"
        :data-testid="`${testId}__description`"
        class="m-0 text-body-sm text-(--text-muted)"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="expandable()"
      v-show="isOpen"
      :id="panelId"
      :data-testid="`${testId}__content`"
      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
    >
      <section
        v-if="slots.input"
        :aria-labelledby="`${uid}-input`"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <h4
          :id="`${uid}-input`"
          class="m-0 text-label-sm text-(--text-muted)"
        >
          {{ t('subagentCard.input') }}
        </h4>
        <slot name="input" />
      </section>
      <section
        v-if="slots.default"
        :aria-labelledby="`${uid}-activity`"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <h4
          :id="`${uid}-activity`"
          class="m-0 text-label-sm text-(--text-muted)"
        >
          {{ t('subagentCard.activity') }}
        </h4>
        <slot />
      </section>
    </div>
  </div>
</template>
