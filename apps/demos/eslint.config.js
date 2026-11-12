import webkitPlugin from '@aziontech/webkit/eslint-plugin'

import eslintConfig from '../../eslint.config.js'

export default [
  ...eslintConfig.filter((config) => !config.plugins?.webkit),
  ...webkitPlugin.configs.strict,
  {
    files: ['*.config.{js,cjs,mjs,ts,cts,mts}'],
    rules: { 'webkit/authoring-standards': 'off' }
  },
  { ignores: ['dist/**'] }
]
