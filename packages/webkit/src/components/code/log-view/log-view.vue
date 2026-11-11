<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
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
    /** Draw the outer card border and corner radius around the log shell. On by default; set to false to render flush inside a surface that already frames it. */
    bordered?: boolean
    /** Placeholder for the default header search field. Empty uses the locale catalog (`Find in Logs`). */
    searchPlaceholder?: string
    /** Shows the copy-to-clipboard control (a CopyButton pinned top-right over the log content in LogViewContent). */
    copyable?: boolean
    /** Disables toolbar controls in LogViewHeader. */
    disabled?: boolean
    /** Replaces the LogViewContent log body with a centered spinner and label. */
    loading?: boolean
    /** Label shown beneath the spinner while `loading`. Empty uses the locale catalog (`Loading...`). */
    loadingLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    lines: () => [],
    bordered: true,
    searchPlaceholder: '',
    copyable: true,
    disabled: false,
    loading: false,
    loadingLabel: ''
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
  const { t } = useTranslate({ logView: en.logView })

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

  const lineCountLabel = computed(() => t('logView.lines', { count: filteredLines.value.length }))

  const warningTagLabel = computed(() => {
    const count = warningCount.value

    return count > 0 ? t('logView.warningCount', { count }) : t('logView.warnings')
  })

  const copyText = computed(() =>
    filteredLines.value.map((line) => formatLogLineText(line)).join('\n')
  )

  const canCopy = computed(
    () => props.copyable && !props.disabled && !props.loading && copyText.value.length > 0
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
    copyable: computed(() => props.copyable),
    loading: computed(() => props.loading),
    loadingLabel: computed(() => props.loadingLabel || t('logView.loading')),
    searchPlaceholder: computed(() => props.searchPlaceholder || t('logView.searchPlaceholder')),
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
    :data-border="bordered || null"
    :data-disabled="disabled || null"
    :data-loading="loading || null"
    :data-warnings-only="warningsOnly || null"
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
