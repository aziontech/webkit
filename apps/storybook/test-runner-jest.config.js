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
  // Six screenshots + six PNG comparisons per story (theme × viewport matrix
  // in .storybook/visual-modes.js); jest's default 5s was sized for one.
  // Headroom for the tall foundation galleries on a cold CI runner.
  testTimeout: 30000,
  testPathIgnorePatterns: [
    ...(defaultConfig.testPathIgnorePatterns ?? []),
    '/src/stories/templates/'
  ]
}
