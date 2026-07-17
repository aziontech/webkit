const { getJestConfig } = require('@storybook/test-runner')

const defaultConfig = getJestConfig()

/**
 * Jest layer of the visual test runner (test-storybook picks this file up
 * automatically from the package root).
 */
module.exports = {
  ...defaultConfig,
  testTimeout: 45000,
  testPathIgnorePatterns: [
    ...(defaultConfig.testPathIgnorePatterns ?? []),
    // Regex patterns (not globs): any templates/ folder directly under
    // src/stories/ or nested deeper in the stories tree.
    '/src/stories/templates/',
    '/src/stories/.*/templates/'
  ]
}
