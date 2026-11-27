<script setup lang="ts">
  import {
    computed,
    nextTick,
    onErrorCaptured,
    shallowRef,
    useAttrs,
    useTemplateRef,
    watch
  } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Alert from '../alert/alert.vue'

  defineOptions({
    name: 'ErrorBoundary',
    inheritAttrs: false
  })

  export interface ErrorBoundaryErrorEvent {
    /** What the failed region threw. */
    error: unknown
    /** Vue's description of where it was thrown (render function, setup function, a hook). */
    info: string
  }

  export interface ErrorBoundaryProps {
    /** Heading of the built-in fallback. Empty uses the locale catalog (`This section failed to load`). */
    title?: string
    /** Sentence under the heading of the built-in fallback. Empty uses the locale catalog. */
    description?: string
    /** Label of the built-in Retry action. Empty uses the locale catalog (`Try again`). */
    retryLabel?: string
    /** When this value changes while the fallback shows, the region is mounted again (pass the route path or the record id). */
    resetKey?: string | number
    /** When true, the error keeps travelling to the parent boundaries and the app error handler after this boundary handles it. */
    propagate?: boolean
  }

  const props = withDefaults(defineProps<ErrorBoundaryProps>(), {
    title: '',
    description: '',
    retryLabel: '',
    resetKey: undefined,
    propagate: false
  })

  const emit = defineEmits<{
    error: [event: ErrorBoundaryErrorEvent]
    /** The region mounts again; carries the Retry click, the event the slot passed, a `retry` Event when the slot passed none, or a `reset` Event for a `resetKey` change. */
    retry: [event: Event]
  }>()

  defineSlots<{
    /** The region this boundary guards. */
    default(): unknown
    /** Replaces the built-in fallback; `retry` mounts the region again. */
    fallback(props: { error: unknown; retry: (event?: Event) => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ errorBoundary: en.errorBoundary })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'error-boundary'
  )

  const failure = shallowRef<{ error: unknown } | null>(null)
  const generation = shallowRef(0)
  const rootEl = useTemplateRef<HTMLElement>('rootEl')

  const focusWasInside = () => {
    const active = globalThis.document?.activeElement
    return !active || active === globalThis.document.body || Boolean(rootEl.value?.contains(active))
  }

  const focusWasLost = () => {
    const active = globalThis.document?.activeElement
    return !active || active === globalThis.document.body || active.matches(':disabled')
  }

  onErrorCaptured((error, _instance, info) => {
    if (failure.value) return props.propagate ? undefined : false
    const moveFocus = focusWasInside()
    failure.value = { error }
    emit('error', { error, info })
    void nextTick(() => {
      if (!moveFocus && !focusWasLost()) return
      const fallback = rootEl.value?.querySelector<HTMLElement>(
        `[data-testid="${testId.value}__fallback"]`
      )
      ;(fallback ?? rootEl.value)?.focus({ preventScroll: true })
    })
    return props.propagate ? undefined : false
  })

  const retry = (event?: Event) => {
    if (!failure.value) return
    const moveFocus = focusWasInside()
    failure.value = null
    generation.value += 1
    emit('retry', event ?? new Event('retry'))
    if (moveFocus) void nextTick(() => rootEl.value?.focus({ preventScroll: true }))
  }

  watch(
    () => props.resetKey,
    () => {
      if (failure.value) retry(new Event('reset'))
    }
  )
</script>

<template>
  <div
    v-bind="$attrs"
    ref="rootEl"
    tabindex="-1"
    :data-testid="testId"
    :data-error="failure ? '' : null"
    class="min-w-0 outline-none"
  >
    <template v-if="failure">
      <slot
        name="fallback"
        :error="failure.error"
        :retry="retry"
      >
        <Alert
          severity="danger"
          :action-label="retryLabel || t('errorBoundary.retry')"
          :data-testid="`${testId}__fallback`"
          @action="retry"
        >
          <strong>{{ title || t('errorBoundary.title') }}</strong>
          {{ description || t('errorBoundary.description') }}
        </Alert>
      </slot>
    </template>
    <slot
      v-else
      :key="generation"
    />
  </div>
</template>
