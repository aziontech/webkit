import eslintConfig from '../../eslint.config.js'

export default [
  ...eslintConfig,
  { ignores: ['test-results/**', 'playwright-report/**', 'baselines/**'] }
]
