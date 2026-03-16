import vue from '@vitejs/plugin-vue';

/** @type {import('@storybook/vue3-vite').StorybookConfig} */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    // '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/addon-docs',

    '@storybook/addon-links',
    '@storybook/addon-docs',
    // '@chromatic-com/storybook',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  viteFinal: async (config) => {
    // Add Vue plugin to handle .vue SFC files from @aziontech/webkit
    config.plugins = config.plugins || [];
    config.plugins.push(vue());
    
    return config;
  }
};

export default config;

