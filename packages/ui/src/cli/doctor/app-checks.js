import { ENTRY_CANDIDATES, firstExisting, read } from '../init/project-files.js'
import { readText } from './project.js'

function iconsImportCheck(pkg, entry, src, add) {
  const declaredIcons = Boolean(
    pkg?.dependencies?.['@aziontech/icons'] || pkg?.devDependencies?.['@aziontech/icons']
  )
  if (!declaredIcons) return
  const iconsImported = src.includes('@aziontech/icons')
  add(
    'icons import',
    iconsImported ? 'ok' : 'warn',
    iconsImported
      ? `imported in ${entry}`
      : `@aziontech/icons is a dependency but not imported — add \`import '@aziontech/icons'\` to ${entry} (icon font).`
  )
}

export function entryImportChecks({ projectDir, pkg, add }) {
  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)
  if (!entry) return
  const src = readText(projectDir, entry)
  const styled = src.includes('azion-ui.css')
  add(
    'styles import',
    styled ? 'ok' : 'warn',
    styled
      ? `imported in ${entry}`
      : `add \`import './azion-ui.css'\` (theme tokens + Tailwind + the Azion UI source registration) to ${entry}.`
  )
  iconsImportCheck(pkg, entry, src, add)
}

const PROVIDER_PATTERN =
  /@aziontech\/ui\/config-provider|<ConfigProvider[\s/>]|<config-provider[\s/>]/

export function configProviderCheck({ srcFiles, add }) {
  const provided = srcFiles.some((file) => PROVIDER_PATTERN.test(read(file) || ''))
  add(
    'config provider',
    provided ? 'ok' : 'warn',
    provided
      ? 'ConfigProvider is mounted'
      : 'no ConfigProvider in src/ — components read English text, left-to-right, and format for the ' +
          'device locale. Wrap the app root in `<ConfigProvider :catalogs="catalogs">` from ' +
          "'@aziontech/ui/config-provider' (add `:locale` for a language the user chose)."
  )
}

const TOAST_REGION = /\.use\(\s*ToastPlugin\s*[),]|<Toaster[\s/>]|<Toast[\s/>]/

function toastUsage(srcFiles) {
  let usesToast = false
  let toastWired = false
  for (const file of srcFiles) {
    const src = read(file) || ''
    if (src.includes('@aziontech/ui/toast')) usesToast = true
    if (TOAST_REGION.test(src)) toastWired = true
    if (usesToast && toastWired) break
  }
  return { usesToast, toastWired }
}

export function toastCheck({ srcFiles, add }) {
  const { usesToast, toastWired } = toastUsage(srcFiles)
  if (!usesToast) return
  add(
    'toast setup',
    toastWired ? 'ok' : 'warn',
    toastWired
      ? 'toast region wired (ToastPlugin or a mounted Toaster)'
      : 'toast is imported but no region is wired — toasts will not render. Add `import { ' +
          "ToastPlugin } from '@aziontech/ui/toast'` and chain `.use(ToastPlugin)` onto " +
          'createApp() in your entry (the plugin mounts the region automatically).'
  )
}
