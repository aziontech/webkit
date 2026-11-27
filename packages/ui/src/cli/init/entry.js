import { join } from 'node:path'

import { read } from './project-files.js'

function entryAction(projectDir, entry, { icons, wireEntry }) {
  const entryImports = ["import './azion-ui.css'"]
  if (icons) entryImports.push("import '@aziontech/icons'")
  if (!entry) {
    return {
      type: 'advise',
      message: `No app entry found (src/main.ts|js|mts|mjs) — wire the design-system imports once at your entry:\n${entryImports.join('\n')}`
    }
  }
  if (wireEntry) return { type: 'patch-entry', path: entry, imports: entryImports }
  const src = read(join(projectDir, entry)) || ''
  if (src.includes('azion-ui.css') || src.includes('@aziontech/theme')) return null
  return {
    type: 'advise',
    message: `Add the design-system imports to ${entry} (once, near the top):\n${entryImports.join('\n')}`
  }
}

const THEME_NOTE = {
  type: 'advise',
  message:
    'Theme: the design system follows the device setting (light or dark) by default. To pin one, ' +
    'set <html data-theme="light"> or <html data-theme="dark"> (or toggle it at runtime); the ' +
    'tokens also respond to the `.dark` class.'
}

export function entryActions(projectDir, entry, opts) {
  const action = entryAction(projectDir, entry, opts)
  return [...(action ? [action] : []), { ...THEME_NOTE }]
}
