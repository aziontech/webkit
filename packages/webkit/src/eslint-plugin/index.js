import consistentHeaderActionSize from './rules/consistent-header-action-size.js'
import noBarrelImport from './rules/no-barrel-import.js'
import noDeepInternalImport from './rules/no-deep-internal-import.js'
import noDeprecatedComponent from './rules/no-deprecated-component.js'
import noDeprecatedName from './rules/no-deprecated-name.js'
import noDroppedChildren from './rules/no-dropped-children.js'
import noGapAfterClosingSection from './rules/no-gap-after-closing-section.js'
import noHardcodedColor from './rules/no-hardcoded-color.js'
import noHardcodedMotion from './rules/no-hardcoded-motion.js'
import noLinkInSentence from './rules/no-link-in-sentence.js'
import noOutputInCommand from './rules/no-output-in-command.js'
import noPageNavigationMenu from './rules/no-page-navigation-menu.js'
import noPhysicalDirection from './rules/no-physical-direction.js'
import noPolymorphicAsProp from './rules/no-polymorphic-as-prop.js'
import noRootRelativeAsset from './rules/no-root-relative-asset.js'
import noStyleOverride from './rules/no-style-override.js'
import noUnknownImport from './rules/no-unknown-import.js'
import noUnownedElement from './rules/no-unowned-element.js'
import noViewportHeightCalc from './rules/no-viewport-height-calc.js'
import noWholeIconSetImport from './rules/no-whole-icon-set-import.js'
import noWrappedPageChrome from './rules/no-wrapped-page-chrome.js'
import preferDefineModel from './rules/prefer-define-model.js'
import preferHint from './rules/prefer-hint.js'
import preferHrefInMenuNode from './rules/prefer-href-in-menu-node.js'
import preferTreeShakeableRoot from './rules/prefer-tree-shakeable-root.js'
import preferValueControl from './rules/prefer-value-control.js'
import preferWebkitComponent from './rules/prefer-webkit-component.js'
import requireAccessibleName from './rules/require-accessible-name.js'
import requireAuthoringStandards from './rules/require-authoring-standards.js'
import requireComposableScopeCleanup from './rules/require-composable-scope-cleanup.js'
import requireContainerWidth from './rules/require-container-width.js'
import requireHeaderSearch from './rules/require-header-search.js'
import requireReadonlyComposableReturn from './rules/require-readonly-composable-return.js'

const rules = {
  'no-unknown-import': noUnknownImport,
  'no-deep-internal-import': noDeepInternalImport,
  'no-barrel-import': noBarrelImport,
  'no-whole-icon-set-import': noWholeIconSetImport,
  'no-hardcoded-color': noHardcodedColor,
  'no-hardcoded-motion': noHardcodedMotion,
  'no-physical-direction': noPhysicalDirection,
  'prefer-tree-shakeable-root': preferTreeShakeableRoot,
  'no-deprecated-component': noDeprecatedComponent,
  'no-deprecated-name': noDeprecatedName,
  'prefer-webkit-component': preferWebkitComponent,
  'prefer-define-model': preferDefineModel,
  'no-style-override': noStyleOverride,
  'require-authoring-standards': requireAuthoringStandards,
  'require-container-width': requireContainerWidth,
  'require-header-search': requireHeaderSearch,
  'no-wrapped-page-chrome': noWrappedPageChrome,
  'no-output-in-command': noOutputInCommand,
  'no-root-relative-asset': noRootRelativeAsset,
  'prefer-href-in-menu-node': preferHrefInMenuNode,
  'no-gap-after-closing-section': noGapAfterClosingSection,
  'require-accessible-name': requireAccessibleName,
  'prefer-value-control': preferValueControl,
  'no-dropped-children': noDroppedChildren,
  'no-viewport-height-calc': noViewportHeightCalc,
  'no-link-in-sentence': noLinkInSentence,
  'require-readonly-composable-return': requireReadonlyComposableReturn,
  'require-composable-scope-cleanup': requireComposableScopeCleanup,
  'no-polymorphic-as-prop': noPolymorphicAsProp,
  'no-page-navigation-menu': noPageNavigationMenu,
  'consistent-header-action-size': consistentHeaderActionSize,
  'no-unowned-element': noUnownedElement,
  'prefer-hint': preferHint
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
  'no-unknown-import': 'error',
  'no-deep-internal-import': 'error',
  'no-barrel-import': 'error',
  'no-deprecated-component': 'error',
  'no-deprecated-name': 'error',
  'no-hardcoded-color': 'error',
  'no-hardcoded-motion': 'error',
  'no-physical-direction': 'error',
  'prefer-tree-shakeable-root': 'error',
  'no-whole-icon-set-import': 'error',
  'prefer-webkit-component': 'error',
  'prefer-define-model': 'error',
  'no-style-override': 'error',
  'require-authoring-standards': 'error',
  'require-container-width': 'warn',
  'require-header-search': 'error',
  'no-wrapped-page-chrome': 'error',
  'no-output-in-command': 'warn',
  'no-root-relative-asset': 'error',
  'prefer-href-in-menu-node': 'error',
  'no-gap-after-closing-section': 'error',
  'require-accessible-name': 'error',
  'prefer-value-control': 'error',
  'no-dropped-children': 'error',
  'no-viewport-height-calc': 'error',
  'no-link-in-sentence': 'error',
  'require-readonly-composable-return': 'error',
  'require-composable-scope-cleanup': 'error',
  'no-polymorphic-as-prop': 'error',
  'no-page-navigation-menu': 'warn',
  'consistent-header-action-size': 'error',
  'prefer-hint': 'error'
}

export const HEURISTIC_RULES = Object.freeze([
  'require-container-width',
  'no-output-in-command',
  'no-page-navigation-menu'
])

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
export {
  CHART_PALETTE_VARIABLES,
  isChartPaletteClass,
  isChartPaletteVariable
} from './lib/chart-palette.js'
export {
  logicalClass,
  mirroredGradient,
  physicalDirectionClasses
} from './lib/direction-classes.js'
export { isLayoutClass, LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from './lib/layout-classes.js'
