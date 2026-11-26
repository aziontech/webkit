import { join } from 'node:path'

import { configProviderCheck, entryImportChecks, toastCheck } from './doctor/app-checks.js'
import { bundleCheck } from './doctor/bundle-check.js'
import {
  buildOutputCheck,
  catalogCheck,
  eslintConfigCheck,
  lintPluginCheck,
  mcpCheck,
  stylelintConfigCheck
} from './doctor/config-checks.js'
import {
  rawColoursCheck,
  sourceExclusionCheck,
  sourceRegistrationCheck,
  sourcesFileCheck,
  tailwindBuildCheck,
  themeImportCheck
} from './doctor/css-checks.js'
import { gitHooksCheck } from './doctor/git-hooks.js'
import { listSrcFiles, parsedPackage, readText } from './doctor/project.js'
import {
  dependencyVersionsCheck,
  tailwindVersionCheck,
  themeVersionCheck,
  vueTscCheck,
  vueVersionCheck
} from './doctor/version-checks.js'
import {
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  read,
  STYLELINT_CONFIG_CANDIDATES
} from './init/project-files.js'

const CHECKS = [
  catalogCheck,
  eslintConfigCheck,
  stylelintConfigCheck,
  sourceRegistrationCheck,
  sourceExclusionCheck,
  sourcesFileCheck,
  tailwindBuildCheck,
  mcpCheck,
  gitHooksCheck,
  buildOutputCheck,
  rawColoursCheck,
  entryImportChecks,
  vueVersionCheck,
  tailwindVersionCheck,
  themeImportCheck,
  lintPluginCheck,
  configProviderCheck,
  toastCheck,
  dependencyVersionsCheck,
  vueTscCheck,
  themeVersionCheck,
  bundleCheck
]

/** @returns {Array<{check: string, status: 'ok'|'warn'|'fail', detail: string}>} */
export function planDoctor(projectDir) {
  const checks = []
  const eslintCfg = firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)
  const context = {
    projectDir,
    add: (check, status, detail) => checks.push({ check, status, detail }),
    pkg: parsedPackage(projectDir),
    eslintCfg,
    eslintText: readText(projectDir, eslintCfg),
    stylelintCfg: firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES),
    cssEntry: read(join(projectDir, 'src/webkit.css')),
    srcFiles: listSrcFiles(projectDir)
  }
  for (const check of CHECKS) check(context)
  return checks
}
