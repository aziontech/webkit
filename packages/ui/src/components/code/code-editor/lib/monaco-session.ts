import type { CodeEditorMarker, CodeEditorMarkerSeverity } from '../code-editor.vue'
import {
  type CodeEditorDisposable,
  type CodeEditorMonaco,
  type CodeEditorMonacoDiffEditor,
  type CodeEditorMonacoEditor,
  type CodeEditorMonacoModel,
  jsonDefaultsOf,
  syncJsonSchema,
  toCodeEditorMarkers
} from '../monaco'

const MARKER_OWNER = 'webkit'

export interface MonacoSession {
  api: CodeEditorMonaco
  editor: CodeEditorMonacoEditor | null
  diffEditor: CodeEditorMonacoDiffEditor | null
  mainModel: CodeEditorMonacoModel | null
  originalModel: CodeEditorMonacoModel | null
  editorValue: string | null
  disposables: CodeEditorDisposable[]
}

export interface MonacoMount {
  host: HTMLElement
  value: string
  original: string
  language: string
  diff: boolean
  uri: unknown
  options: Record<string, unknown>
}

export const createSession = (api: CodeEditorMonaco): MonacoSession => ({
  api,
  editor: null,
  diffEditor: null,
  mainModel: null,
  originalModel: null,
  editorValue: null,
  disposables: []
})

function severityOf(api: CodeEditorMonaco, severity: CodeEditorMarkerSeverity): number {
  if (severity === 'danger') return api.MarkerSeverity.Error
  if (severity === 'warning') return api.MarkerSeverity.Warning
  return api.MarkerSeverity.Info
}

export function applyMarkers(session: MonacoSession, markers: CodeEditorMarker[]): void {
  const { api, mainModel: model } = session
  if (!model) return
  api.editor.setModelMarkers(
    model,
    MARKER_OWNER,
    markers.map((marker) => ({
      startLineNumber: marker.line,
      startColumn: marker.column ?? 1,
      endLineNumber: marker.endLine ?? marker.line,
      endColumn:
        marker.endColumn ??
        (marker.column ? marker.column + 1 : (model.getLineMaxColumn?.(marker.line) ?? 1000)),
      severity: severityOf(api, marker.severity),
      message: marker.message
    }))
  )
}

export function applySchema(
  session: MonacoSession,
  schemaUri: string,
  schema: Record<string, unknown> | undefined,
  language: string
): void {
  const defaults = jsonDefaultsOf(session.api)
  if (!defaults) return
  const target = session.mainModel?.uri?.toString()
  const active = schema && language === 'json' && target
  syncJsonSchema(
    defaults,
    schemaUri,
    active ? { fileMatch: target, schema: JSON.parse(JSON.stringify(schema)) } : null
  )
}

export function watchMarkers(
  session: MonacoSession,
  changed: (markers: ReturnType<typeof toCodeEditorMarkers>) => void
): void {
  const { api } = session
  const subscription = api.editor.onDidChangeMarkers?.((resources) => {
    const resource = session.mainModel?.uri
    const target = resource?.toString()
    if (!target || !resources.some((entry) => String(entry) === target)) return
    const markers = api.editor.getModelMarkers?.({ resource }) ?? []
    changed(toCodeEditorMarkers(markers, api.MarkerSeverity, MARKER_OWNER))
  })
  if (subscription) session.disposables.push(subscription)
}

export function mountEditors(session: MonacoSession, mount: MonacoMount): CodeEditorMonacoEditor {
  const { api } = session
  const main = api.editor.createModel(mount.value, mount.language, mount.uri)
  session.mainModel = main
  if (!mount.diff) {
    session.editor = api.editor.create(mount.host, { ...mount.options, model: main })
    return session.editor
  }
  session.originalModel = api.editor.createModel(mount.original, mount.language)
  session.diffEditor = api.editor.createDiffEditor(mount.host, {
    ...mount.options,
    originalEditable: false,
    renderSideBySide: true,
    useInlineViewWhenSpaceIsLimited: true
  })
  session.diffEditor.setModel({ original: session.originalModel, modified: main })
  session.editor = session.diffEditor.getModifiedEditor()
  return session.editor
}

export function disposeSession(session: MonacoSession, schemaUri: string): void {
  const defaults = jsonDefaultsOf(session.api)
  if (defaults) syncJsonSchema(defaults, schemaUri, null)
  session.disposables.splice(0).forEach((item) => item.dispose())
  session.diffEditor?.dispose()
  if (!session.diffEditor) session.editor?.dispose()
  session.mainModel?.dispose()
  session.originalModel?.dispose()
  session.editor = null
  session.diffEditor = null
  session.editorValue = null
  session.mainModel = null
  session.originalModel = null
}
