const { getJestConfig } = require('@storybook/test-runner')

const defaultConfig = getJestConfig()

/**
 * Jest layer of the visual test runner (test-storybook picks this file up
 * automatically from the package root).
 *
 * Templates are slated for deletion and are excluded from the visual layer
 * entirely: their story files are never collected, so they are neither
 * visited (render smoke) nor screenshotted — and `test:visual:update`
 * generates no baselines for them.
 */
module.exports = {
  ...defaultConfig,
  testPathIgnorePatterns: [
    ...(defaultConfig.testPathIgnorePatterns ?? []),
    '/src/stories/templates/'
  ]
}
