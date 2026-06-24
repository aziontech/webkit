import vue from '@vitejs/plugin-vue'

/** @type {import('@storybook/vue3-vite').StorybookConfig} */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@whitespace/storybook-addon-html'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation'
  },
  core: {
    disableTelemetry: true
  },
  refs: {
    // 'webkit-v3': {
    //   title: 'Webkit V3',
    //   url: 'https://webkit.azion.app/',
    //   expanded: true
    // }
  },
  viteFinal: async (config) => {
    // Second @vitejs/plugin-vue for monorepo SFCs under packages/webkit (outside Storybook root).
    // Pitfall: never put HTML-like tags (`<a>`, `<template>`, …) in script JSDoc — the second pass
    // re-parses compiled output and throws "Element is missing end tag". See .claude/rules/styling.md.
    config.plugins = config.plugins || []
    config.plugins.push(vue())

    // Dev channel: stories still import from '@aziontech/webkit/*'; redirect to the renamed
    // workspace package '@aziontech/webkit.dev/*' so no story file needs to change.
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@aziontech/webkit': '@aziontech/webkit.dev'
    }

    // Enable dependency pre-bundling for faster rebuilds
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['vue', 'vee-validate'],
      force: false
    }

    // Improve build performance
    config.build = {
      ...config.build,
      sourcemap: false,
      minify: false,
      chunkSizeWarningLimit: 1000
    }

    // Cache filesystem operations
    config.cacheDir = 'node_modules/.vite'

    return config
  }
}

export default config
