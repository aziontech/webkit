<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import type { Severity } from '../../../utils/severity'
  import { useCodeEditorMonaco } from './composables/use-code-editor-monaco'
  import {
    changesBySide,
    editorPanes,
    monacoOptions,
    withoutKeys,
    worstSeverityByLine
  } from './lib/editor-view'
  import type { CodeEditorMonacoModule } from './monaco'
  import CodeEditorPane from './parts/code-editor-pane.vue'
  import CodeEditorProblems from './parts/code-editor-problems.vue'

  export type {
    CodeEditorMonaco,
    CodeEditorMonacoDiffEditor,
    CodeEditorMonacoEditor,
    CodeEditorMonacoJsonDefaults,
    CodeEditorMonacoJsonDiagnostics,
    CodeEditorMonacoJsonSchema,
    CodeEditorMonacoLanguage,
    CodeEditorMonacoLanguages,
    CodeEditorMonacoMarker,
    CodeEditorMonacoModel,
    CodeEditorMonacoModule,
    CodeEditorMonacoTheme
  } from './monaco'

  /** Severity of a diagnostic. */
  export type CodeEditorMarkerSeverity = Extract<Severity, 'info' | 'warning' | 'danger'>

  /** One diagnostic, with 1-based lines and columns. */
  export interface CodeEditorMarker {
    line: number
    column?: number
    endLine?: number
    endColumn?: number
    severity: CodeEditorMarkerSeverity
    message: string
  }

  /** Which editor is live: the plain editor, the plain editor while Monaco loads, or Monaco. */
  export type CodeEditorMode = 'plain' | 'loading' | 'monaco'

  defineOptions({
    name: 'CodeEditor',
    inheritAttrs: false
  })

  export interface CodeEditorProps {
    /** Monaco language id (`javascript`, `typescript`, `json`, `sql`, `lua`, `yaml`…). The plain editor ignores it. */
    language?: string
    /** Loads Monaco lazily, e.g. `() => import('monaco-editor')`; without it the plain editor is the editor. */
    loader?: () => Promise<CodeEditorMonacoModule>
    /** The code can be read, selected and copied but not changed. */
    readonly?: boolean
    /** Locks the editor; it leaves the tab order. */
    disabled?: boolean
    /** Paints the danger border; also set by a surrounding `Field`. */
    invalid?: boolean
    /** Shows `original` beside the value as a side-by-side diff. */
    diff?: boolean
    /** The left side of the diff. */
    original?: string
    /** Diagnostics shown on their lines and in the problems list. */
    markers?: CodeEditorMarker[]
    /** CSS height of the editing area. */
    height?: string
    /** Fills a flex column instead of using `height`. */
    fill?: boolean
    /** Draws the frame: border, corner radius and an offset focus ring. Off, the editor sits flush in its pane. */
    bordered?: boolean
    /** Shows the line-number gutter. */
    showLineNumbers?: boolean
    /** Zero-pads line numbers to two digits (01, 02…), as the console's full-page function and arguments editors do. */
    padLineNumbers?: boolean
    /** Model path for Monaco language services (`index.ts`, `args.json`). */
    path?: string
    /** JSON Schema the value is checked against when `language` is `json` and Monaco is loaded. */
    schema?: Record<string, unknown>
    /** Accessible name when no `Field` label names it. Empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<CodeEditorProps>(), {
    language: 'plaintext',
    loader: undefined,
    readonly: false,
    disabled: false,
    invalid: false,
    diff: false,
    original: '',
    markers: () => [],
    height: '16rem',
    fill: false,
    bordered: true,
    showLineNumbers: true,
    padLineNumbers: false,
    path: '',
    schema: undefined,
    ariaLabel: ''
  })

  const model = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    ready: [editor: unknown]
    'load-error': [error: unknown]
    'markers-change': [markers: CodeEditorMarker[]]
  }>()

  defineSlots<{
    /** A bar above the editing area: a document switch, the file name, a Format or Run action. */
    toolbar(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ codeEditor: en.codeEditor })
  const uid = useId()
  const summaryId = `${uid}-problems`
  const schemaUri = `inmemory://azion-ui/${uid}/schema.json`
  const hintId = `${uid}-hint`

  const {
    field,
    controlId,
    describedBy: fieldDescribedBy,
    invalid: isInvalid,
    disabled: isDisabled
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'code-editor')

  const rootAttrs = computed(() => withoutKeys(attrs, ['id', 'aria-describedby', 'data-testid']))

  const rootEl = ref<HTMLElement | null>(null)
  const monacoHostEl = ref<HTMLElement | null>(null)
  const paneEls: Record<string, InstanceType<typeof CodeEditorPane> | null> = {}
  const setPane = (key: string, el: unknown) => {
    paneEls[key] = (el as InstanceType<typeof CodeEditorPane> | null) ?? null
  }
  const mode = ref<CodeEditorMode>('plain')
  const loadFailed = ref(false)

  const isReadonly = computed(() => props.readonly || isDisabled.value)

  const markerByLine = computed(() => worstSeverityByLine(props.markers))

  const describedBy = computed(() =>
    [fieldDescribedBy.value, summaryId, isReadonly.value ? '' : hintId].filter(Boolean).join(' ')
  )

  const plainLabel = computed(() => props.ariaLabel || (field ? undefined : t('codeEditor.label')))

  const changes = computed(() => changesBySide(props.diff, props.original, model.value))

  const panes = computed(() =>
    editorPanes(model.value, props.diff ? props.original : null, !isReadonly.value, {
      original: t('codeEditor.original'),
      modified: t('codeEditor.modified')
    })
  )

  const accessibleName = () => {
    if (props.ariaLabel) return props.ariaLabel
    const id = controlId.value
    const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null
    return label?.textContent?.trim() || t('codeEditor.label')
  }

  const editorOptions = () =>
    monacoOptions(isReadonly.value, props.showLineNumbers, props.padLineNumbers, accessibleName())

  const { editor, refresh } = useCodeEditorMonaco({
    rootEl,
    hostEl: monacoHostEl,
    model,
    mode,
    loadFailed,
    uid,
    schemaUri,
    loader: () => props.loader,
    language: () => props.language,
    diff: () => props.diff,
    original: () => props.original,
    markers: () => props.markers,
    path: () => props.path,
    schema: () => props.schema,
    options: editorOptions,
    labels: () => {
      const name = accessibleName()
      return {
        original: `${name}, ${t('codeEditor.original')}`,
        modified: `${name}, ${t('codeEditor.modified')}`
      }
    },
    ready: (instance) => emit('ready', instance),
    failed: (error) => emit('load-error', error),
    changed: (markers) => emit('markers-change', markers)
  })

  watch(
    [isReadonly, () => props.showLineNumbers, () => props.padLineNumbers, () => props.ariaLabel],
    refresh
  )

  const goTo = (marker: CodeEditorMarker) => {
    const column = marker.column ?? 1
    const live = editor.value
    if (mode.value === 'monaco' && live) {
      live.setPosition({ lineNumber: marker.line, column })
      live.revealLineInCenter(marker.line)
      live.focus()
      return
    }
    paneEls['modified']?.reveal(marker.line, column)
  }

  defineExpose({
    /** Focuses the live editor. */
    focus: () => (editor.value ? editor.value.focus() : paneEls['modified']?.focus()),
    /** Moves the caret to a marker's position. */
    goTo,
    /** The Monaco editor once mounted, for actions such as formatting. */
    editor
  })

  const AREA_CLASS =
    'relative flex h-(--code-editor-height) min-h-0 min-w-0 flex-col data-[fill]:h-auto data-[fill]:flex-1 @lg/code-editor:flex-row ' +
    'data-[diff]:h-[calc(var(--code-editor-height)*2)] @lg/code-editor:data-[diff]:h-(--code-editor-height)'

  const ROOT_CLASS =
    '@container/code-editor flex w-full min-w-0 flex-col overflow-hidden border-(--border-default) bg-(--bg-surface) transition-colors duration-150 ease-out ' +
    'focus-within:ring-2 focus-within:ring-(--ring-color) ' +
    'not-data-[bordered]:focus-within:ring-inset data-[bordered]:rounded-(--shape-control) data-[bordered]:border data-[bordered]:focus-within:ring-offset-2 ' +
    'data-[bordered]:focus-within:ring-offset-(--bg-canvas) ' +
    'data-[disabled]:bg-(--bg-disabled) ' +
    'data-[fill]:min-h-0 data-[fill]:flex-1 ' +
    'data-[invalid]:border-(--danger-border) ' +
    'motion-reduce:transition-none forced-colors:data-[bordered]:border-[CanvasText]'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-mode="mode"
    :data-invalid="isInvalid || null"
    :data-readonly="readonly || null"
    :data-disabled="isDisabled || null"
    :data-diff="diff || null"
    :data-fill="fill || null"
    :data-bordered="bordered || null"
    :aria-busy="mode === 'loading' || undefined"
    :class="ROOT_CLASS"
  >
    <div
      v-if="$slots['toolbar']"
      class="flex min-h-10 shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
      :data-testid="`${testId}__toolbar`"
    >
      <slot name="toolbar" />
    </div>

    <div
      :style="fill ? undefined : { '--code-editor-height': height }"
      :data-fill="fill || null"
      :data-diff="(diff && !fill) || null"
      :class="AREA_CLASS"
      :data-testid="`${testId}__area`"
    >
      <div
        v-show="mode === 'monaco'"
        ref="monacoHostEl"
        dir="ltr"
        class="absolute inset-0"
        :data-testid="`${testId}__monaco`"
      />
      <template v-if="mode !== 'monaco'">
        <CodeEditorPane
          v-for="(pane, paneIndex) in panes"
          :key="pane.key"
          :ref="(el) => setPane(pane.key, el)"
          :pane="pane"
          :second="paneIndex > 0"
          :diff="diff"
          :label-id="`${uid}-${pane.key}-label`"
          :show-line-numbers="showLineNumbers"
          :pad-line-numbers="padLineNumbers"
          :severities="pane.main ? markerByLine : null"
          :changes="diff ? changes[pane.main ? 'modified' : 'original'] : null"
          :control-id="pane.main ? controlId : undefined"
          :plain-label="plainLabel"
          :described-by="describedBy"
          :invalid="isInvalid"
          :disabled="isDisabled"
          :test-id="testId"
          @update:model-value="(value: string) => (model = value)"
        />
      </template>
    </div>

    <p
      :id="hintId"
      class="sr-only"
    >
      {{ t('codeEditor.tabHint') }}
    </p>

    <p
      v-if="mode === 'loading' || loadFailed"
      class="m-0 shrink-0 border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-2xs) text-body-xs text-(--text-muted)"
      :data-testid="`${testId}__status`"
    >
      {{ loadFailed ? t('codeEditor.loadFailed') : t('codeEditor.loading') }}
    </p>

    <CodeEditorProblems
      :markers="markers"
      :summary-id="summaryId"
      :test-id="testId"
      @select="(_event: MouseEvent, marker: CodeEditorMarker) => goTo(marker)"
    />
  </div>
</template>
