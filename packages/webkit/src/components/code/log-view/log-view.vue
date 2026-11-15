<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import { formatLogLineText } from './composables/format-log-line-text'
  import type { LogViewLine, LogViewLineLevel } from './injection-key'
  import { lineLevel, LogViewInjectionKey } from './injection-key'

  export type { LogViewLine, LogViewLineLevel, LogViewLineType } from './injection-key'

  defineOptions({
    name: 'LogView',
    inheritAttrs: false
  })

  interface Props {
    /** Log entries (filtered in LogViewContent by search and warnings-only). */
    lines?: LogViewLine[]
    /** Draw the outer card border and corner radius around the log shell. On by default; set to false to render flush inside a surface that already frames it. */
    bordered?: boolean
    /** Placeholder for the default header search field. Empty uses the locale catalog (`Find in logs`). */
    searchPlaceholder?: string
    /** Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent). */
    copyable?: boolean
    /** Disables toolbar controls in LogViewHeader. */
    disabled?: boolean
    /** Replaces the LogViewContent log body with a centered spinner and label. */
    loading?: boolean
    /** Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading…`). */
    loadingLabel?: string
    /** Levels the header offers as filter toggles, each with its line count; a level with no line is still offered. Empty hides the level filter. */
    levels?: LogViewLineLevel[]
    /** Message shown in place of the log body when the log failed to load. Empty shows the log. */
    error?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    lines: () => [],
    bordered: true,
    searchPlaceholder: '',
    copyable: true,
    disabled: false,
    loading: false,
    loadingLabel: '',
    levels: () => [],
    error: ''
  })

  /** Bound to LogViewHeader search; filters LogViewContent when set. */
  const search = defineModel<string>('search', { default: '' })
  /**
   * When true, shows only warning lines (`level: 'warn'`, or the deprecated `type: 'warning'`).
   * @deprecated since 6.0 — use `v-model:level` with `'warn'`. Removed in 7.0.
   */
  const warningsOnly = defineModel<boolean>('warningsOnly', { default: false })
  /** The level the log is filtered to; empty shows every level. */
  const level = defineModel<LogViewLineLevel | ''>('level', { default: '' })

  const emit = defineEmits<{
    copy: [event: MouseEvent, value: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logView: en.logView })

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'code-log-view')

  const warningCount = computed(
    () => props.lines.filter((line) => lineLevel(line) === 'warn').length
  )

  const levelCounts = computed(() => {
    const counts: Record<LogViewLineLevel, number> = { debug: 0, info: 0, warn: 0, error: 0 }
    for (const line of props.lines) {
      const value = lineLevel(line)
      if (value) counts[value] += 1
    }
    return counts
  })

  const haystacks = new WeakMap<LogViewLine, { message: string; text: string }>()

  const haystackOf = (line: LogViewLine): string => {
    const cached = haystacks.get(line)
    if (cached && cached.message === line.message) return cached.text
    const text = [
      line.time,
      line.level,
      line.message,
      line.folderType,
      line.size,
      line.gzipSize,
      line.suffix
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    haystacks.set(line, { message: line.message, text })
    return text
  }

  const filteredLines = computed(() => {
    const query = search.value.trim().toLowerCase()
    let result = props.lines

    if (warningsOnly.value) {
      result = result.filter((line) => lineLevel(line) === 'warn')
    }

    if (level.value) {
      result = result.filter((line) => lineLevel(line) === level.value)
    }

    if (query) {
      result = result.filter((line) => haystackOf(line).includes(query))
    }

    return result
  })

  const lineCountLabel = computed(() => t('logView.lines', { count: filteredLines.value.length }))

  const warningTagLabel = computed(() => {
    const count = warningCount.value

    return count > 0 ? t('logView.warningCount', { count }) : t('logView.warnings')
  })

  const copyLines = new WeakMap<LogViewLine, { message: string; text: string }>()

  const copyLineOf = (line: LogViewLine): string => {
    const cached = copyLines.get(line)
    if (cached && cached.message === line.message) return cached.text
    const text = formatLogLineText(line)
    copyLines.set(line, { message: line.message, text })
    return text
  }

  const copyText = computed(() => filteredLines.value.map(copyLineOf).join('\n'))

  const canCopy = computed(
    () =>
      props.copyable &&
      !props.disabled &&
      !props.loading &&
      !props.error &&
      filteredLines.value.length > 0
  )

  const setSearch = (value: string) => {
    search.value = value
  }

  const toggleWarningsOnly = () => {
    if (props.disabled) return

    warningsOnly.value = !warningsOnly.value
  }

  const toggleLevel = (next: LogViewLineLevel) => {
    if (props.disabled) return

    level.value = level.value === next ? '' : next
  }

  const emitCopy = (event: MouseEvent, value: string) => {
    emit('copy', event, value)
  }

  provide(LogViewInjectionKey, {
    testId,
    lines: computed(() => props.lines),
    filteredLines,
    search: computed(() => search.value),
    warningsOnly: computed(() => warningsOnly.value),
    levels: computed(() => props.levels),
    level: computed(() => level.value),
    levelCounts,
    disabled: computed(() => props.disabled),
    copyable: computed(() => props.copyable),
    loading: computed(() => props.loading),
    loadingLabel: computed(() => props.loadingLabel || t('logView.loading')),
    error: computed(() => props.error),
    searchPlaceholder: computed(() => props.searchPlaceholder || t('logView.searchPlaceholder')),
    warningCount,
    lineCountLabel,
    warningTagLabel,
    canCopy,
    copyText,
    setSearch,
    toggleWarningsOnly,
    toggleLevel,
    emitCopy
  })
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :data-testid="testId"
    :data-border="bordered || null"
    :data-disabled="disabled || null"
    :data-loading="loading || null"
    :data-error="error ? true : null"
    :data-warnings-only="warningsOnly || null"
    :data-level="level || null"
    :class="
      cn(
        'flex h-fit min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden data-[border]:rounded-(--shape-elements) data-[border]:border data-[border]:border-(--border-muted)',
        attrs.class
      )
    "
  >
    <slot />
  </div>
</template>
