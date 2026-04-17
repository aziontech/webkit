import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { searchIndexIntegration } from './src/integrations/search-index';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, '..', '..');

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({ appEntrypoint: '/src/vue-app-setup' }),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    searchIndexIntegration(),
  ],
  
  // Site configuration
  site: 'https://ds.azion.com',
  
  // Path aliases for clean imports
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@layouts': resolve(__dirname, 'src/layouts'),
        '@lib': resolve(__dirname, 'src/lib'),
        // Alias for icons package to ensure proper resolution from monorepo
        '@aziontech/icons/catalog': resolve(monorepoRoot, 'packages/icons/dist/catalog.json'),
        // SCSS alias: lets primevue-theme.scss import Azion theme partials cleanly
        '@theme-azion': resolve(monorepoRoot, 'packages/theme/src/azion'),
        // Pin webkit transitive deps to ds-docs local copies so Rollup/Vite can
        // resolve them even when webkit source files are bundled directly.
        // webkit's package.json does not declare these as explicit deps, so
        // without these aliases Rollup cannot find them in the webkit directory.
        '@vueuse/core': resolve(__dirname, 'node_modules/@vueuse/core'),
        'primevue': resolve(__dirname, 'node_modules/primevue'),
        'vee-validate': resolve(__dirname, 'node_modules/vee-validate'),
      },
    },
    // Ensure woff2 font files are properly handled
    assetsInclude: ['**/*.woff2'],
    css: {
      preprocessorOptions: {
        scss: {
          // Silence dart-sass deprecation warnings coming from the Azion theme
          // partials (legacy @import syntax and lighten()/darken() color functions).
          // These will need updating when Dart Sass 3.0 drops @import support.
          silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'legacy-js-api'],
        },
      },
    },
  },
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
      // No inline background/color so .docs-code-always-dark CSS can force #171717
      defaultColor: false,
    },
  },
  
  // Output configuration
  output: 'static',
  
  // Build configuration
  build: {
    inlineStylesheets: 'auto',
  },
});
