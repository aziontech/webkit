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
    // @vitejs/plugin-vue compiles the monorepo SFCs under packages/webkit (the framework only
    // ships template-compilation, not the vue plugin). It MUST run before Storybook's docgen
    // plugin: docgen appends `_sfc_main.__docgenInfo = …`, which only survives if the SFC has
    // already compiled to JS. Pushed after docgen, the append lands in raw SFC source and the
    // compiler discards it — leaving every subcomponent prop tab in autodocs empty.
    // Pitfall: never put HTML-like tags (`<a>`, `<template>`, …) in script JSDoc — docgen
    // re-parses the SFC and throws "Element is missing end tag". See .claude/rules/styling.md.
    config.plugins = config.plugins || []
    const docgenIdx = config.plugins.findIndex(
      (p) => p && (p.name === 'storybook:vue-docgen-plugin' || p.name === 'storybook:vue-component-meta-plugin')
    )
    if (docgenIdx === -1) {
      config.plugins.push(vue())
    } else {
      config.plugins.splice(docgenIdx, 0, vue())
    }

    // The workspace package is @aziontech/webkit again (the .dev dev-channel rename was
    // reverted when the toolkit was folded in) — stories import '@aziontech/webkit/*'
    // and resolve directly; no alias needed.
    config.resolve = config.resolve || {}

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
