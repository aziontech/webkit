import { nextTick, onMounted, onScopeDispose, readonly, type Ref, shallowRef, watch } from 'vue'

import type { CodeEditorMarker, CodeEditorMode } from '../code-editor.vue'
import {
  applyMarkers,
  applySchema,
  createSession,
  disposeSession,
  type MonacoSession,
  mountEditors,
  watchMarkers
} from '../lib/monaco-session'
import {
  applyThemeOnce,
  CODE_EDITOR_THEME,
  type CodeEditorMonaco,
  type CodeEditorMonacoEditor,
  type CodeEditorMonacoModule,
  fontFromTokens,
  highlightCalls,
  themeFromTokens
} from '../monaco'

export interface UseCodeEditorMonacoOptions {
  rootEl: Readonly<Ref<HTMLElement | null>>
  hostEl: Readonly<Ref<HTMLElement | null>>
  model: Ref<string>
  mode: Ref<CodeEditorMode>
  loadFailed: Ref<boolean>
  uid: string
  schemaUri: string
  loader: () => (() => Promise<CodeEditorMonacoModule>) | undefined
  language: () => string
  diff: () => boolean
  original: () => string
  markers: () => CodeEditorMarker[]
  path: () => string
  schema: () => Record<string, unknown> | undefined
  options: () => Record<string, unknown>
  labels: () => { original: string; modified: string }
  ready: (editor: unknown) => void
  failed: (error: unknown) => void
  changed: (markers: CodeEditorMarker[]) => void
}

async function load(loader: () => Promise<CodeEditorMonacoModule>): Promise<CodeEditorMonaco> {
  const module = await loader()
  const loaded = 'editor' in module ? module : module.default
  if (!loaded?.editor) throw new Error('monaco-editor did not load')
  return loaded
}

function themeWatcher(apply: () => void): () => void {
  let frame = 0
  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(apply)
  }
  const observer = new MutationObserver(schedule)
  for (const target of [document.documentElement, document.body])
    observer.observe(target, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  const query = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null
  query?.addEventListener('change', schedule)
  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    query?.removeEventListener('change', schedule)
  }
}

function labelSides(session: MonacoSession, labels: { original: string; modified: string }): void {
  session.diffEditor?.getOriginalEditor?.().updateOptions({ ariaLabel: labels.original })
  session.diffEditor?.getModifiedEditor().updateOptions({ ariaLabel: labels.modified })
}

function startSession(
  options: UseCodeEditorMonacoOptions,
  current: MonacoSession,
  editor: Ref<CodeEditorMonacoEditor | null>,
  applyTheme: () => void
): () => void {
  const host = options.hostEl.value
  const root = options.rootEl.value
  if (!host || !root) throw new Error('missing host')
  applyTheme()
  const file = options.path() || (options.schema() ? 'model.json' : '')
  const { Uri } = current.api
  editor.value = mountEditors(current, {
    host,
    value: options.model.value,
    original: options.original(),
    language: options.language(),
    diff: options.diff(),
    uri: file && Uri ? Uri.parse(`inmemory://webkit/${options.uid}/${file}`) : undefined,
    options: { ...options.options(), ...fontFromTokens(root), theme: CODE_EDITOR_THEME }
  })
  labelSides(current, options.labels())
  const subscription = current.mainModel?.onDidChangeContent(() => {
    const value = current.mainModel?.getValue() ?? ''
    current.editorValue = value
    if (value !== options.model.value) options.model.value = value
  })
  if (subscription) current.disposables.push(subscription)
  applyMarkers(current, options.markers())
  applySchema(current, options.schemaUri, options.schema(), options.language())
  watchMarkers(current, options.changed)
  const stop = themeWatcher(applyTheme)
  options.ready(current.diffEditor ?? current.editor)
  return stop
}

export interface UseCodeEditorMonacoReturn {
  editor: Readonly<Ref<CodeEditorMonacoEditor | null>>
  refresh: () => void
}

export function useCodeEditorMonaco(
  options: UseCodeEditorMonacoOptions
): UseCodeEditorMonacoReturn {
  const { mode } = options
  const editor = shallowRef<CodeEditorMonacoEditor | null>(null)
  let session: MonacoSession | null = null
  let stopTheme = (): void => {}
  let unmounted = false

  const applyTheme = () => {
    if (session && options.rootEl.value)
      applyThemeOnce(session.api, CODE_EDITOR_THEME, themeFromTokens(options.rootEl.value))
  }

  const fail = (error: unknown) => {
    if (session) disposeSession(session, options.schemaUri)
    editor.value = null
    mode.value = 'plain'
    options.loadFailed.value = true
    options.failed(error)
  }

  async function mount(): Promise<void> {
    const loader = options.loader()
    if (!loader) return
    mode.value = 'loading'
    let api: CodeEditorMonaco
    try {
      api = await load(loader)
    } catch (error) {
      if (!unmounted) fail(error)
      return
    }
    if (unmounted) return
    await highlightCalls(api)
    if (unmounted) return
    session = createSession(api)
    mode.value = 'monaco'
    await nextTick()
    try {
      stopTheme = startSession(options, session, editor, applyTheme)
    } catch (error) {
      fail(error)
    }
  }

  useMonacoSync(options, () => session)
  onMounted(() => void mount())
  onScopeDispose(() => {
    unmounted = true
    stopTheme()
    if (session) disposeSession(session, options.schemaUri)
    editor.value = null
  })

  return {
    editor: readonly(editor),
    refresh: () => {
      if (!session) return
      ;(session.diffEditor ?? session.editor)?.updateOptions(options.options())
      labelSides(session, options.labels())
    }
  }
}

function useMonacoSync(
  options: UseCodeEditorMonacoOptions,
  current: () => MonacoSession | null
): void {
  watch(options.model, (value) => {
    const session = current()
    if (!session?.mainModel || value === session.editorValue) return
    if (session.mainModel.getValue() !== value) session.mainModel.setValue(value)
  })
  watch(options.original, (value) => {
    const model = current()?.originalModel
    if (model && model.getValue() !== value) model.setValue(value)
  })
  watch(options.language, (language) => {
    const session = current()
    if (!session) return
    if (session.mainModel) session.api.editor.setModelLanguage?.(session.mainModel, language)
    if (session.originalModel)
      session.api.editor.setModelLanguage?.(session.originalModel, language)
    applySchema(session, options.schemaUri, options.schema(), language)
  })
  watch(
    options.schema,
    () => {
      const session = current()
      if (session) applySchema(session, options.schemaUri, options.schema(), options.language())
    },
    { deep: true }
  )
  watch(
    options.markers,
    (markers) => {
      const session = current()
      if (session) applyMarkers(session, markers)
    },
    { deep: true }
  )
}
