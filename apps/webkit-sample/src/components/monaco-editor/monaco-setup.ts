import loader from '@monaco-editor/loader'
import * as monaco from 'monaco-editor'
// The package's `exports` map rewrites `monaco-editor/<path>` to `esm/vs/<path>.js`, so
// these specifiers are deliberately written without the `esm/vs` prefix.
import editorWorker from 'monaco-editor/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/language/typescript/ts.worker?worker'

import { applyAzionSyntax } from './azion-monaco-syntax'

/**
 * `@guolao/vue-monaco-editor` loads Monaco from a CDN by default. That is a runtime
 * dependency on jsdelivr, so it is replaced here by the locally installed
 * `monaco-editor` — the app keeps working offline and under a strict CSP.
 *
 * This module is imported only by `monaco-editor.vue`, which only the lazy Monaco route
 * pulls in, so none of Monaco reaches the entry chunk.
 */

/**
 * Monaco runs its language services in web workers. Vite's `?worker` imports bundle each
 * one; without this map Monaco falls back to the main thread and logs a hard error.
 */
globalThis.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    switch (label) {
      case 'json':
        return new jsonWorker()
      case 'css':
      case 'scss':
      case 'less':
        return new cssWorker()
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker()
      case 'typescript':
      case 'javascript':
        return new tsWorker()
      default:
        return new editorWorker()
    }
  }
}

// Idempotent by construction: the module body runs once per app, and `loader.init()`
// resolves with this instance instead of fetching anything.
loader.config({ monaco })

// Before any model exists — see the note in azion-monaco-syntax.ts on why the timing is
// what makes this stick.
applyAzionSyntax(monaco)

/** Resolves with the Monaco API. Safe to call repeatedly — the loader caches it. */
export const monacoReady = () => loader.init()
