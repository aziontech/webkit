const { getJestConfig } = require('@storybook/test-runner')

const defaultConfig = getJestConfig()
const testsDenied = [
  '/src/stories/_shared/',
  '/src/stories/foundations/',
  '/src/stories/templates/'
]

module.exports = {
  ...defaultConfig,
  testTimeout: 45000,
  testPathIgnorePatterns: [
    ...(defaultConfig.testPathIgnorePatterns ?? []),
    ...(testsDenied ?? [])
  ]
}
