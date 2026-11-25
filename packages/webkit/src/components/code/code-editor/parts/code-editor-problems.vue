<script setup lang="ts">
  import { computed } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import type { CodeEditorMarker, CodeEditorMarkerSeverity } from '../code-editor.vue'

  defineOptions({ name: 'CodeEditorProblems', inheritAttrs: false })

  interface Props {
    /** The diagnostics to list. */
    markers: CodeEditorMarker[]
    /** Id of the problem count, which describes the editor. */
    summaryId: string
    /** Test id of the owning CodeEditor; each part appends its own name. */
    testId: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    select: [event: MouseEvent, marker: CodeEditorMarker]
  }>()

  const { t } = useTranslate({ codeEditor: en.codeEditor })

  const sortedMarkers = computed(() =>
    [...props.markers].sort((a, b) => a.line - b.line || (a.column ?? 1) - (b.column ?? 1))
  )

  const severityLabel = (severity: CodeEditorMarkerSeverity) =>
    severity === 'danger'
      ? t('codeEditor.error')
      : severity === 'warning'
        ? t('codeEditor.warning')
        : t('codeEditor.info')

  const problemCount = computed(() => t('codeEditor.problemCount', { count: props.markers.length }))

  const PROBLEM_CLASS =
    'flex min-h-8 w-full cursor-pointer items-baseline gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-start text-body-xs text-(--text-default) transition-colors ' +
    'duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none pointer-coarse:min-h-11'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-empty="markers.length === 0 || null"
    class="shrink-0 border-t border-(--border-default) bg-(--bg-surface-raised) data-[empty]:hidden"
    :data-testid="`${testId}__problems`"
  >
    <p
      :id="summaryId"
      role="status"
      class="m-0 px-(--spacing-sm) pt-(--spacing-xs) text-label-sm text-(--text-default)"
    >
      {{ problemCount }}
    </p>
    <ul
      v-if="markers.length"
      :aria-label="t('codeEditor.problems')"
      class="m-0 flex max-h-32 list-none flex-col overflow-y-auto p-(--spacing-2xs)"
    >
      <li
        v-for="(marker, index) in sortedMarkers"
        :key="`${marker.line}-${marker.column ?? 0}-${index}`"
      >
        <button
          type="button"
          :data-severity="marker.severity"
          :class="PROBLEM_CLASS"
          :data-testid="`${testId}__problem`"
          @click="(event: MouseEvent) => emit('select', event, marker)"
        >
          <i
            :data-severity="marker.severity"
            :class="
              marker.severity === 'danger'
                ? 'az az-circle-x'
                : marker.severity === 'warning'
                  ? 'az az-triangle-alert'
                  : 'az az-circle-info'
            "
            class="shrink-0 text-body-xs data-[severity=danger]:text-(--danger-foreground) data-[severity=info]:text-(--info-foreground) data-[severity=warning]:text-(--warning-foreground)"
            aria-hidden="true"
          />
          <span class="sr-only">{{ `${severityLabel(marker.severity)}: ` }}</span>
          <span class="shrink-0 text-(--text-muted) tabular-nums">{{
            `${t('codeEditor.line', { line: marker.line })} `
          }}</span>
          <bdi
            :data-testid="`${testId}__problem-message`"
            class="min-w-0 flex-1 break-words"
            >{{ marker.message }}</bdi
          >
        </button>
      </li>
    </ul>
  </div>
</template>
