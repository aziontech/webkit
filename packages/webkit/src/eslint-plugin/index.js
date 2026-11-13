import accessibleName from './rules/accessible-name.js'
import authoringStandards from './rules/authoring-standards.js'
import composableReadonlyReturn from './rules/composable-readonly-return.js'
import composableScopeCleanup from './rules/composable-scope-cleanup.js'
import containerNeedsWidth from './rules/container-needs-width.js'
import headerSearchTrigger from './rules/header-search-trigger.js'
import menuNodeHref from './rules/menu-node-href.js'
import noBarrelImport from './rules/no-barrel-import.js'
import noDeepInternalImport from './rules/no-deep-internal-import.js'
import noDeprecatedComponent from './rules/no-deprecated-component.js'
import noDroppedChildren from './rules/no-dropped-children.js'
import noGapAfterClosingSection from './rules/no-gap-after-closing-section.js'
import noHardcodedColor from './rules/no-hardcoded-color.js'
import noHardcodedMotion from './rules/no-hardcoded-motion.js'
import noLinkInSentence from './rules/no-link-in-sentence.js'
import noOutputInCommand from './rules/no-output-in-command.js'
import noPhysicalDirection from './rules/no-physical-direction.js'
import noRootRelativeAsset from './rules/no-root-relative-asset.js'
import noStyleOverride from './rules/no-style-override.js'
import noViewportHeightCalc from './rules/no-viewport-height-calc.js'
import noWholeIconSetImport from './rules/no-whole-icon-set-import.js'
import noWrappedPageChrome from './rules/no-wrapped-page-chrome.js'
import preferDefineModel from './rules/prefer-define-model.js'
import preferTreeShakeableRoot from './rules/prefer-tree-shakeable-root.js'
import preferWebkitComponent from './rules/prefer-webkit-component.js'
import validImportPath from './rules/valid-import-path.js'

const rules = {
  'valid-import-path': validImportPath,
  'no-deep-internal-import': noDeepInternalImport,
  'no-barrel-import': noBarrelImport,
  'no-whole-icon-set-import': noWholeIconSetImport,
  'no-hardcoded-color': noHardcodedColor,
  'no-hardcoded-motion': noHardcodedMotion,
  'no-physical-direction': noPhysicalDirection,
  'prefer-tree-shakeable-root': preferTreeShakeableRoot,
  'no-deprecated-component': noDeprecatedComponent,
  'prefer-webkit-component': preferWebkitComponent,
  'prefer-define-model': preferDefineModel,
  'no-style-override': noStyleOverride,
  'authoring-standards': authoringStandards,
  'container-needs-width': containerNeedsWidth,
  'header-search-trigger': headerSearchTrigger,
  'no-wrapped-page-chrome': noWrappedPageChrome,
  'no-output-in-command': noOutputInCommand,
  'no-root-relative-asset': noRootRelativeAsset,
  'menu-node-href': menuNodeHref,
  'no-gap-after-closing-section': noGapAfterClosingSection,
  'accessible-name': accessibleName,
  'no-dropped-children': noDroppedChildren,
  'no-viewport-height-calc': noViewportHeightCalc,
  'no-link-in-sentence': noLinkInSentence,
  'composable-readonly-return': composableReadonlyReturn,
  'composable-scope-cleanup': composableScopeCleanup
}

const FILES = [
  '**/*.vue',
  '**/*.astro',
  '**/*.js',
  '**/*.jsx',
  '**/*.ts',
  '**/*.tsx',
  '**/*.mjs',
  '**/*.cjs'
]

const plugin = {
  meta: { name: '@aziontech/eslint-plugin-webkit', version: '0.0.0' },
  rules
}

function preset(name, severities) {
  return [
    {
      name: `webkit/${name}`,
      files: FILES,
      plugins: { webkit: plugin },
      rules: Object.fromEntries(
        Object.entries(severities).map(([rule, sev]) => [`webkit/${rule}`, sev])
      )
    }
  ]
}

const RECOMMENDED = {
  'valid-import-path': 'error',
  'no-deep-internal-import': 'error',
  'no-barrel-import': 'error',
  'no-deprecated-component': 'error',
  'no-hardcoded-color': 'error',
  'no-hardcoded-motion': 'error',
  'no-physical-direction': 'error',
  'prefer-tree-shakeable-root': 'error',
  'no-whole-icon-set-import': 'error',
  'prefer-webkit-component': 'error',
  'prefer-define-model': 'error',
  'no-style-override': 'error',
  'authoring-standards': 'error',
  'container-needs-width': 'warn',
  'header-search-trigger': 'error',
  'no-wrapped-page-chrome': 'error',
  'no-output-in-command': 'warn',
  'no-root-relative-asset': 'error',
  'menu-node-href': 'error',
  'no-gap-after-closing-section': 'error',
  'accessible-name': 'error',
  'no-dropped-children': 'error',
  'no-viewport-height-calc': 'error',
  'no-link-in-sentence': 'error',
  'composable-readonly-return': 'error',
  'composable-scope-cleanup': 'error'
}

export const HEURISTIC_RULES = Object.freeze(['container-needs-width', 'no-output-in-command'])

const STRICT = Object.fromEntries(
  Object.keys(rules).map((r) => [r, HEURISTIC_RULES.includes(r) ? 'warn' : 'error'])
)

const PERFORMANCE = {
  'no-barrel-import': 'error',
  'prefer-tree-shakeable-root': 'error',
  'no-whole-icon-set-import': 'error'
}

plugin.configs = {
  recommended: preset('recommended', RECOMMENDED),
  strict: preset('strict', STRICT),
  performance: preset('performance', PERFORMANCE)
}

export default plugin
export { rules }
export { logicalClass, mirroredGradient, physicalDirectionClasses } from './direction-classes.js'
export { isLayoutClass, LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from './layout-classes.js'
