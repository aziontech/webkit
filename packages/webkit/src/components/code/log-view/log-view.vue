<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
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
    /** Search query bound to the header field. */
    search?: string
    /** When true, shows only lines whose `type` is `warning`. */
    warningsOnly?: boolean
    /** Placeholder for the default header search field. */
    searchPlaceholder?: string
    /** Shows the copy-to-clipboard control in LogViewHeader. */
    showCopy?: boolean
    /** Disables toolbar controls in LogViewHeader. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    lines: () => [],
    search: '',
    warningsOnly: false,
    searchPlaceholder: 'Find in Logs',
    showCopy: true,
    disabled: false
  })

  const emit = defineEmits<{
    'update:search': [value: string]
    'update:warningsOnly': [value: boolean]
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
    const query = props.search.trim().toLowerCase()
    let result = props.lines

    if (props.warningsOnly) {
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

  const formatLineText = (line: LogViewLine) => {
    const parts = [line.time, line.message]

    if (line.suffix) parts.push(line.suffix)
    if (line.folderType) parts.push(line.folderType)
    if (line.size) parts.push(line.size)
    if (line.gzipSize) parts.push(`gzip: ${line.gzipSize}`)

    return parts.join(' ')
  }

  const copyText = computed(() =>
    filteredLines.value.map((line) => formatLineText(line)).join('\n')
  )

  const setSearch = (value: string) => {
    emit('update:search', value)
  }

  const toggleWarningsOnly = () => {
    if (props.disabled) return

    emit('update:warningsOnly', !props.warningsOnly)
  }

  const copyLogs = async () => {
    if (props.disabled || !props.showCopy) return

    const text = copyText.value

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard may be unavailable; still emit so consumers can handle fallback.
    }

    emit('copy', text)
  }

  provide(LogViewInjectionKey, {
    testId: testId.value,
    lines: computed(() => props.lines),
    filteredLines,
    search: computed(() => props.search),
    warningsOnly: computed(() => props.warningsOnly),
    disabled: computed(() => props.disabled),
    showCopy: computed(() => props.showCopy),
    searchPlaceholder: computed(() => props.searchPlaceholder),
    warningCount,
    lineCountLabel,
    warningTagLabel,
    setSearch,
    toggleWarningsOnly,
    copyLogs
  })
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
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
