<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import {
    CODE_EDITOR_THEME,
    type CodeEditorDisposable,
    type CodeEditorMonaco,
    type CodeEditorMonacoDiffEditor,
    type CodeEditorMonacoEditor,
    type CodeEditorMonacoModel,
    type CodeEditorMonacoModule,
    fontFromTokens,
    themeFromTokens
  } from './monaco'

  export type {
    CodeEditorMonaco,
    CodeEditorMonacoDiffEditor,
    CodeEditorMonacoEditor,
    CodeEditorMonacoModel,
    CodeEditorMonacoModule,
    CodeEditorMonacoTheme
  } from './monaco'

  /** Severity of a diagnostic. */
  export type CodeEditorMarkerSeverity = 'error' | 'warning' | 'info'

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

  interface Props {
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
    /** Shows the line-number gutter. */
    lineNumbers?: boolean
    /** Model path for Monaco language services (`index.ts`, `args.json`). */
    path?: string
    /** Accessible name when no `Field` label names it. Empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
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
    lineNumbers: true,
    path: '',
    ariaLabel: ''
  })

  const model = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    ready: [editor: unknown]
    'load-error': [error: unknown]
  }>()

  defineSlots<{
    /** A bar above the editing area: a document switch, the file name, a Format or Run action. */
    toolbar(): unknown
  }>()

  const INDENT = '  '

  const attrs = useAttrs()
  const { t } = useTranslate({ codeEditor: en.codeEditor })
  const uid = useId()
  const summaryId = `${uid}-problems`
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

  const rootAttrs = computed(() => {
    const rest: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'id' || key === 'aria-describedby' || key === 'data-testid') continue
      rest[key] = value
    }
    return rest
  })

  const rootRef = ref<HTMLElement | null>(null)
  const monacoHost = ref<HTMLElement | null>(null)
  const textareas = ref<Record<string, HTMLTextAreaElement | null>>({})
  const scrollers = ref<Record<string, HTMLElement | null>>({})
  const mode = ref<CodeEditorMode>('plain')
  const loadFailed = ref(false)
  const escapeArmed = ref(false)

  const isReadonly = computed(() => props.readonly || isDisabled.value)

  const markerByLine = computed(() => {
    const rank = { error: 3, warning: 2, info: 1 }
    const map = new Map<number, CodeEditorMarkerSeverity>()
    for (const marker of props.markers) {
      const current = map.get(marker.line)
      if (!current || rank[marker.severity] > rank[current]) map.set(marker.line, marker.severity)
    }
    return map
  })

  const sortedMarkers = computed(() =>
    [...props.markers].sort((a, b) => a.line - b.line || (a.column ?? 1) - (b.column ?? 1))
  )

  const severityLabel = (severity: CodeEditorMarkerSeverity) =>
    severity === 'error'
      ? t('codeEditor.error')
      : severity === 'warning'
        ? t('codeEditor.warning')
        : t('codeEditor.info')

  const problemCount = computed(() => t('codeEditor.problemCount', { count: props.markers.length }))

  const describedBy = computed(() =>
    [fieldDescribedBy.value, summaryId, isReadonly.value ? '' : hintId].filter(Boolean).join(' ')
  )

  const plainLabel = computed(() => props.ariaLabel || (field ? undefined : t('codeEditor.label')))

  const linesOf = (text: string) => text.split('\n')

  const panes = computed(() => {
    const modified = {
      key: 'modified',
      value: model.value,
      editable: !isReadonly.value,
      label: t('codeEditor.modified'),
      lines: linesOf(model.value),
      main: true
    }
    if (!props.diff) return [modified]
    return [
      {
        key: 'original',
        value: props.original,
        editable: false,
        label: t('codeEditor.original'),
        lines: linesOf(props.original),
        main: false
      },
      modified
    ]
  })

  const columnsOf = (lines: string[]) =>
    Math.max(1, ...lines.map((line) => line.replace(/\t/g, INDENT).length)) + 1

  const setTextarea = (key: string, el: unknown) => {
    textareas.value[key] = el instanceof HTMLTextAreaElement ? el : null
  }

  const setScroller = (key: string, el: unknown) => {
    scrollers.value[key] = el instanceof HTMLElement ? el : null
  }

  const onInput = (event: Event) => {
    model.value = (event.target as HTMLTextAreaElement).value
  }

  const replaceRange = (
    el: HTMLTextAreaElement,
    start: number,
    end: number,
    text: string,
    selection: [number, number]
  ) => {
    const value = el.value
    const next = value.slice(0, start) + text + value.slice(end)
    el.value = next
    model.value = next
    el.setSelectionRange(selection[0], selection[1])
  }

  const indent = (el: HTMLTextAreaElement, outdent: boolean) => {
    const { selectionStart, selectionEnd, value } = el
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
    const multiLine = value.slice(selectionStart, selectionEnd).includes('\n')
    if (!outdent && !multiLine) {
      replaceRange(el, selectionStart, selectionEnd, INDENT, [
        selectionStart + INDENT.length,
        selectionStart + INDENT.length
      ])
      return
    }
    const blockEnd = selectionEnd
    const block = value.slice(lineStart, blockEnd)
    const lines = block.split('\n')
    let firstShift = 0
    const changed = lines.map((line, index) => {
      if (!outdent) {
        if (index === 0) firstShift = INDENT.length
        return INDENT + line
      }
      const remove = line.startsWith(INDENT) ? INDENT.length : line.startsWith(' ') ? 1 : 0
      if (index === 0) firstShift = -remove
      return line.slice(remove)
    })
    const text = changed.join('\n')
    const start = Math.max(lineStart, selectionStart + firstShift)
    replaceRange(el, lineStart, blockEnd, text, [
      multiLine ? lineStart : start,
      lineStart + text.length
    ])
  }

  const onKeydown = (event: KeyboardEvent, editable: boolean) => {
    if (event.key === 'Escape') {
      escapeArmed.value = true
      return
    }
    if (event.key !== 'Tab') {
      if (event.key !== 'Shift') escapeArmed.value = false
      return
    }
    if (escapeArmed.value || !editable || event.altKey || event.ctrlKey || event.metaKey) {
      escapeArmed.value = false
      return
    }
    event.preventDefault()
    indent(event.currentTarget as HTMLTextAreaElement, event.shiftKey)
  }

  const onBlur = () => {
    escapeArmed.value = false
  }

  const offsetOf = (text: string, line: number, column: number) => {
    const lines = linesOf(text)
    const target = Math.min(Math.max(line, 1), lines.length)
    let offset = 0
    for (let i = 0; i < target - 1; i += 1) offset += (lines[i] ?? '').length + 1
    return offset + Math.min(Math.max(column - 1, 0), (lines[target - 1] ?? '').length)
  }

  let editor: CodeEditorMonacoEditor | null = null
  let diffEditor: CodeEditorMonacoDiffEditor | null = null
  let api: CodeEditorMonaco | null = null
  let mainModel: CodeEditorMonacoModel | null = null
  let originalModel: CodeEditorMonacoModel | null = null
  const disposables: CodeEditorDisposable[] = []
  const editorRef = shallowRef<CodeEditorMonacoEditor | null>(null)

  const goTo = (marker: CodeEditorMarker) => {
    const column = marker.column ?? 1
    if (mode.value === 'monaco' && editor) {
      editor.setPosition({ lineNumber: marker.line, column })
      editor.revealLineInCenter(marker.line)
      editor.focus()
      return
    }
    const el = textareas.value['modified']
    if (!el) return
    const offset = offsetOf(el.value, marker.line, column)
    el.focus()
    el.setSelectionRange(offset, offset)
    const scroller = scrollers.value['modified']
    if (scroller) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
      const top = (marker.line - 1) * lineHeight
      if (top < scroller.scrollTop || top > scroller.scrollTop + scroller.clientHeight - lineHeight)
        scroller.scrollTop = Math.max(0, top - scroller.clientHeight / 2)
    }
  }

  const accessibleName = () => {
    if (props.ariaLabel) return props.ariaLabel
    const id = controlId.value
    const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null
    return label?.textContent?.trim() || t('codeEditor.label')
  }

  const editorOptions = () => ({
    readOnly: isReadonly.value,
    domReadOnly: isReadonly.value,
    lineNumbers: props.lineNumbers ? 'on' : 'off',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontLigatures: false,
    renderLineHighlight: 'all',
    tabFocusMode: true,
    ariaLabel: accessibleName()
  })

  const applyTheme = () => {
    if (!api || !rootRef.value) return
    api.editor.defineTheme(CODE_EDITOR_THEME, themeFromTokens(rootRef.value))
    api.editor.setTheme(CODE_EDITOR_THEME)
  }

  const severityOf = (severity: CodeEditorMarkerSeverity) => {
    if (!api) return 0
    if (severity === 'error') return api.MarkerSeverity.Error
    if (severity === 'warning') return api.MarkerSeverity.Warning
    return api.MarkerSeverity.Info
  }

  const applyMarkers = () => {
    if (!api || !mainModel) return
    const model = mainModel
    api.editor.setModelMarkers(
      model,
      'webkit',
      props.markers.map((marker) => ({
        startLineNumber: marker.line,
        startColumn: marker.column ?? 1,
        endLineNumber: marker.endLine ?? marker.line,
        endColumn:
          marker.endColumn ??
          (marker.column ? marker.column + 1 : (model.getLineMaxColumn?.(marker.line) ?? 1000)),
        severity: severityOf(marker.severity),
        message: marker.message
      }))
    )
  }

  let themeObserver: MutationObserver | null = null
  let schemeQuery: MediaQueryList | null = null
  let themeFrame = 0
  let unmounted = false

  const scheduleTheme = () => {
    cancelAnimationFrame(themeFrame)
    themeFrame = requestAnimationFrame(applyTheme)
  }

  const watchTheme = () => {
    themeObserver = new MutationObserver(scheduleTheme)
    for (const target of [document.documentElement, document.body]) {
      themeObserver.observe(target, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    }
    schemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null
    schemeQuery?.addEventListener('change', scheduleTheme)
  }

  const mountMonaco = async () => {
    if (!props.loader) return
    mode.value = 'loading'
    let loaded: CodeEditorMonaco
    try {
      const module = await props.loader()
      loaded = 'editor' in module ? module : module.default
      if (!loaded?.editor) throw new Error('monaco-editor did not load')
    } catch (error) {
      if (unmounted) return
      mode.value = 'plain'
      loadFailed.value = true
      emit('load-error', error)
      return
    }
    if (unmounted) return
    api = loaded
    mode.value = 'monaco'
    await nextTick()
    try {
      const host = monacoHost.value
      if (!host || !rootRef.value) throw new Error('missing host')
      applyTheme()
      const font = fontFromTokens(rootRef.value)
      const uri =
        props.path && api.Uri ? api.Uri.parse(`inmemory://webkit/${uid}/${props.path}`) : undefined
      mainModel = api.editor.createModel(model.value, props.language, uri)
      const options = { ...editorOptions(), ...font, theme: CODE_EDITOR_THEME }
      if (props.diff) {
        originalModel = api.editor.createModel(props.original, props.language)
        diffEditor = api.editor.createDiffEditor(host, {
          ...options,
          originalEditable: false,
          renderSideBySide: true,
          useInlineViewWhenSpaceIsLimited: true
        })
        diffEditor.setModel({ original: originalModel, modified: mainModel })
        editor = diffEditor.getModifiedEditor()
      } else {
        editor = api.editor.create(host, { ...options, model: mainModel })
      }
      editorRef.value = editor
      disposables.push(
        mainModel.onDidChangeContent(() => {
          const value = mainModel?.getValue() ?? ''
          if (value !== model.value) model.value = value
        })
      )
      applyMarkers()
      watchTheme()
      emit('ready', diffEditor ?? editor)
    } catch (error) {
      disposeMonaco()
      mode.value = 'plain'
      loadFailed.value = true
      emit('load-error', error)
    }
  }

  const disposeMonaco = () => {
    disposables.splice(0).forEach((item) => item.dispose())
    diffEditor?.dispose()
    if (!diffEditor) editor?.dispose()
    mainModel?.dispose()
    originalModel?.dispose()
    editor = null
    diffEditor = null
    mainModel = null
    originalModel = null
    editorRef.value = null
  }

  watch(model, (value) => {
    if (mainModel && mainModel.getValue() !== value) mainModel.setValue(value)
  })

  watch(
    () => props.original,
    (value) => {
      if (originalModel && originalModel.getValue() !== value) originalModel.setValue(value)
    }
  )

  watch(
    () => props.language,
    (language) => {
      if (api && mainModel) api.editor.setModelLanguage?.(mainModel, language)
      if (api && originalModel) api.editor.setModelLanguage?.(originalModel, language)
    }
  )

  watch([isReadonly, () => props.lineNumbers, () => props.ariaLabel], () => {
    ;(diffEditor ?? editor)?.updateOptions(editorOptions())
  })

  watch(() => props.markers, applyMarkers, { deep: true })

  onMounted(() => {
    void mountMonaco()
  })

  onBeforeUnmount(() => {
    unmounted = true
    cancelAnimationFrame(themeFrame)
    themeObserver?.disconnect()
    schemeQuery?.removeEventListener('change', scheduleTheme)
    disposeMonaco()
  })

  defineExpose({
    /** Focuses the live editor. */
    focus: () => (editor ? editor.focus() : textareas.value['modified']?.focus()),
    /** Moves the caret to a marker's position. */
    goTo,
    /** The Monaco editor once mounted, for actions such as formatting. */
    editor: editorRef
  })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-mode="mode"
    :data-invalid="isInvalid || null"
    :data-readonly="readonly || null"
    :data-disabled="isDisabled || null"
    :data-diff="diff || null"
    :data-fill="fill || null"
    :aria-busy="mode === 'loading' || undefined"
    class="@container/code-editor flex w-full min-w-0 flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) transition-colors duration-150 ease-out focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas) data-[disabled]:bg-(--bg-disabled) data-[fill]:min-h-0 data-[fill]:flex-1 data-[invalid]:border-(--danger-border) motion-reduce:transition-none forced-colors:border-[CanvasText]"
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
      class="relative flex h-(--code-editor-height) min-h-0 min-w-0 flex-col data-[fill]:h-auto data-[fill]:flex-1 @lg/code-editor:flex-row"
      :data-testid="`${testId}__area`"
    >
      <div
        v-show="mode === 'monaco'"
        ref="monacoHost"
        dir="ltr"
        class="absolute inset-0"
        :data-testid="`${testId}__monaco`"
      />
      <template v-if="mode !== 'monaco'">
        <div
          v-for="(pane, paneIndex) in panes"
          :key="pane.key"
          class="flex min-h-0 min-w-0 flex-1 flex-col data-[second]:border-t data-[second]:border-(--border-default) @lg/code-editor:data-[second]:border-t-0 @lg/code-editor:data-[second]:border-s"
          :data-second="paneIndex > 0 || null"
          :data-testid="`${testId}__pane`"
        >
          <div
            v-if="diff"
            class="shrink-0 border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
            :id="`${uid}-${pane.key}-label`"
          >
            {{ pane.label }}
          </div>
          <div
            :ref="(el) => setScroller(pane.key, el)"
            dir="ltr"
            class="min-h-0 flex-1 overflow-auto overscroll-contain"
          >
            <div class="flex min-h-full w-max min-w-full">
              <ol
                v-if="lineNumbers"
                aria-hidden="true"
                class="sticky start-0 z-1 m-0 shrink-0 list-none border-e border-(--border-default) bg-(--bg-canvas) py-(--spacing-xs) ps-(--spacing-sm) pe-(--spacing-xs) text-end text-body-code-sm text-(--code-sintax-line-number) select-none"
                :data-testid="`${testId}__gutter`"
              >
                <li
                  v-for="(_, index) in pane.lines"
                  :key="index"
                  :data-severity="(pane.main && markerByLine.get(index + 1)) || null"
                  class="relative min-w-[2ch] tabular-nums data-[severity]:font-medium data-[severity=error]:text-(--danger-contrast) data-[severity=info]:text-(--info-contrast) data-[severity=warning]:text-(--warning-contrast) forced-colors:data-[severity]:text-[Highlight]"
                >
                  {{ index + 1 }}
                </li>
              </ol>
              <textarea
                :ref="(el) => setTextarea(pane.key, el)"
                :id="pane.main ? controlId : undefined"
                :value="pane.value"
                :rows="pane.lines.length"
                :cols="columnsOf(pane.lines)"
                wrap="off"
                spellcheck="false"
                autocapitalize="off"
                autocomplete="off"
                :readonly="!pane.editable || undefined"
                :disabled="isDisabled || undefined"
                :aria-label="diff ? undefined : plainLabel"
                :aria-labelledby="diff ? `${uid}-${pane.key}-label` : undefined"
                :aria-invalid="(pane.main && isInvalid) || undefined"
                :aria-readonly="!pane.editable || undefined"
                :aria-describedby="pane.main ? describedBy : undefined"
                class="m-0 block min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent px-(--spacing-sm) py-(--spacing-xs) text-body-code-sm whitespace-pre text-(--code-sintax-identifier) caret-(--text-default) outline-none placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
                :data-testid="`${testId}__${pane.main ? 'input' : 'original'}`"
                @input="onInput"
                @keydown="onKeydown($event, pane.editable)"
                @blur="onBlur"
              />
            </div>
          </div>
        </div>
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
      class="m-0 shrink-0 border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xxs) text-body-xs text-(--text-muted)"
      :data-testid="`${testId}__status`"
    >
      {{ loadFailed ? t('codeEditor.loadFailed') : t('codeEditor.loading') }}
    </p>

    <div
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
        class="m-0 flex max-h-32 list-none flex-col overflow-y-auto p-(--spacing-xxs)"
      >
        <li
          v-for="(marker, index) in sortedMarkers"
          :key="`${marker.line}-${marker.column ?? 0}-${index}`"
        >
          <button
            type="button"
            :data-severity="marker.severity"
            class="flex min-h-8 w-full cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) text-start text-body-xs text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none pointer-coarse:min-h-11"
            :data-testid="`${testId}__problem`"
            @click="goTo(marker)"
          >
            <i
              :data-severity="marker.severity"
              :class="
                marker.severity === 'error'
                  ? 'pi pi-times-circle'
                  : marker.severity === 'warning'
                    ? 'pi pi-exclamation-triangle'
                    : 'pi pi-info-circle'
              "
              class="shrink-0 text-body-xs data-[severity=error]:text-(--danger-contrast) data-[severity=info]:text-(--info-contrast) data-[severity=warning]:text-(--warning-contrast)"
              aria-hidden="true"
            />
            <span class="sr-only">{{ severityLabel(marker.severity) }}:</span>
            <span class="shrink-0 text-(--text-muted) tabular-nums">{{
              t('codeEditor.line', { line: marker.line })
            }}</span>
            <bdi class="min-w-0 flex-1 truncate">{{ marker.message }}</bdi>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
