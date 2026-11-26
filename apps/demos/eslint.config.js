import azionUiPlugin from '@aziontech/ui/eslint-plugin'

import eslintConfig from '../../eslint.config.js'

export default [
  ...eslintConfig,
  ...azionUiPlugin.configs.strict,
  {
    files: ['*.config.{js,cjs,mjs,ts,cts,mts}'],
    rules: { 'azion-ui/require-authoring-standards': 'off' }
  },
  { ignores: ['dist/**'] }
]
