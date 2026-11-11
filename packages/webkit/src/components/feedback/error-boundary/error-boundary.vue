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

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
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

  interface Props {
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

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    retryLabel: '',
    resetKey: undefined,
    propagate: false
  })

  const emit = defineEmits<{
    error: [event: ErrorBoundaryErrorEvent]
    retry: []
  }>()

  defineSlots<{
    /** The region this boundary guards. */
    default(): unknown
    /** Replaces the built-in fallback; `retry` mounts the region again. */
    fallback(props: { error: unknown; retry: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ errorBoundary: en.errorBoundary })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-error-boundary'
  )

  const failure = shallowRef<{ error: unknown } | null>(null)
  const generation = shallowRef(0)
  const root = useTemplateRef<HTMLElement>('root')

  const focusWasInside = () => {
    const active = globalThis.document?.activeElement
    return !active || active === globalThis.document.body || Boolean(root.value?.contains(active))
  }

  onErrorCaptured((error, _instance, info) => {
    if (failure.value) return props.propagate ? undefined : false
    const moveFocus = focusWasInside()
    failure.value = { error }
    emit('error', { error, info })
    if (moveFocus) {
      void nextTick(() => {
        root.value
          ?.querySelector<HTMLElement>(`[data-testid="${testId.value}__fallback"]`)
          ?.focus({ preventScroll: true })
      })
    }
    return props.propagate ? undefined : false
  })

  const retry = () => {
    if (!failure.value) return
    const moveFocus = focusWasInside()
    failure.value = null
    generation.value += 1
    emit('retry')
    if (moveFocus) void nextTick(() => root.value?.focus({ preventScroll: true }))
  }

  watch(
    () => props.resetKey,
    () => {
      if (failure.value) retry()
    }
  )
</script>

<template>
  <div
    v-bind="$attrs"
    ref="root"
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
