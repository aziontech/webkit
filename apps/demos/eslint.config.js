import webkitPlugin from '@aziontech/webkit/eslint-plugin'

import eslintConfig from '../../eslint.config.js'

export default [
  ...eslintConfig,
  ...webkitPlugin.configs.strict,
  {
    files: ['*.config.{js,cjs,mjs,ts,cts,mts}'],
    rules: { 'webkit/authoring-standards': 'off' }
  },
  { ignores: ['dist/**'] }
]
