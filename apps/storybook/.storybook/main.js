import vue from '@vitejs/plugin-vue';

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
    disableTelemetry: true,
  },
  refs: {
    'marketing-components': {
      title: 'Marketing Components',
      url: 'https://s07fylnjym.map.azionedge.net/',
      expanded: true
    },
    // 'platform-components': {
    //   title: 'Platform Components',
    //   url: 'https://storybook-console.azion.app/',
    //   expanded: true
    // },
    'platform-components': {
      title: 'Platform Components',
      url: 'http://localhost:6007/',
      expanded: true
    }
  },
  viteFinal: async (config) => {
    // Add Vue plugin to handle .vue SFC files from @aziontech/webkit
    config.plugins = config.plugins || [];
    config.plugins.push(vue());

    // Enable dependency pre-bundling for faster rebuilds
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        'vue',
        'primevue/config',
        'primevue/tooltip',
        'vee-validate'
      ],
      force: false
    };

    // Improve build performance
    config.build = {
      ...config.build,
      sourcemap: false,
      minify: false,
      chunkSizeWarningLimit: 1000
    };

    // Cache filesystem operations
    config.cacheDir = 'node_modules/.vite';

    return config;
  }
};

export default config;

