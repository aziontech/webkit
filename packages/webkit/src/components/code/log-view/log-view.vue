<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { formatLogLineText } from './composables/format-log-line-text'
  import type { LogViewLine } from './injection-key'
  import { LogViewInjectionKey } from './injection-key'

  export type { LogViewLine, LogViewLineType } from './injection-key'

  defineOptions({
    name: 'LogView',
    inheritAttrs: false
  })

  interface Props {
    /** Log entries (filtered in LogViewContent by search and warnings-only). */
    lines?: LogViewLine[]
    /** Placeholder for the default header search field. */
    searchPlaceholder?: string
    /** Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent). */
    showCopy?: boolean
    /** Disables toolbar controls in LogViewHeader. */
    disabled?: boolean
    /** Replaces the LogViewContent log body with a centered spinner and label. */
    loading?: boolean
    /** Label shown beneath the spinner while `loading`. */
    loadingLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    lines: () => [],
    searchPlaceholder: 'Find in Logs',
    showCopy: true,
    disabled: false,
    loading: false,
    loadingLabel: 'Loading...'
  })

  /** Bound to LogViewHeader search; filters LogViewContent when set. */
  const search = defineModel<string>('search', { default: '' })
  /** When true, shows only lines whose `type` is `warning`. */
  const warningsOnly = defineModel<boolean>('warningsOnly', { default: false })

  const emit = defineEmits<{
    copy: [value: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'code-log-view')

  const warningCount = computed(() => props.lines.filter((line) => line.type === 'warning').length)

  const filteredLines = computed(() => {
    const query = search.value.trim().toLowerCase()
    let result = props.lines

    if (warningsOnly.value) {
      result = result.filter((line) => line.type === 'warning')
    }

    if (query) {
      result = result.filter((line) => {
        const haystack = [
          line.time,
          line.message,
          line.folderType,
          line.size,
          line.gzipSize,
          line.suffix
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(query)
      })
    }

    return result
  })

  const lineCountLabel = computed(() => `${filteredLines.value.length} lines`)

  const warningTagLabel = computed(() => {
    const count = warningCount.value

    if (count === 1) return '1 Warning'
    if (count > 1) return `${count} Warnings`

    return 'Warnings'
  })

  const copyText = computed(() =>
    filteredLines.value.map((line) => formatLogLineText(line)).join('\n')
  )

  const canCopy = computed(
    () => props.showCopy && !props.disabled && !props.loading && copyText.value.length > 0
  )

  const setSearch = (value: string) => {
    search.value = value
  }

  const toggleWarningsOnly = () => {
    if (props.disabled) return

    warningsOnly.value = !warningsOnly.value
  }

  const emitCopy = (value: string) => {
    emit('copy', value)
  }

  provide(LogViewInjectionKey, {
    testId: testId.value,
    lines: computed(() => props.lines),
    filteredLines,
    search: computed(() => search.value),
    warningsOnly: computed(() => warningsOnly.value),
    disabled: computed(() => props.disabled),
    showCopy: computed(() => props.showCopy),
    loading: computed(() => props.loading),
    loadingLabel: computed(() => props.loadingLabel),
    searchPlaceholder: computed(() => props.searchPlaceholder),
    warningCount,
    lineCountLabel,
    warningTagLabel,
    canCopy,
    copyText,
    setSearch,
    toggleWarningsOnly,
    emitCopy
  })
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-loading="loading || null"
    :data-warnings-only="warningsOnly || null"
    :class="
      cn(
        'flex min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-muted)]',
        attrs.class
      )
    "
  >
    <slot />
  </div>
</template>
