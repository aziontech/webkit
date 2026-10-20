export const presetMeta = {
  angular: { label: 'Angular', icon: 'ai-cor ai-angular' },
  astro: { label: 'Astro', icon: 'ai-cor ai-astro' },
  docusaurus: { label: 'Docusaurus', icon: 'ai ai-docusaurus' },
  eleventy: { label: 'Eleventy', icon: 'ai ai-eleventy' },
  emscripten: { label: 'Emscripten', icon: 'pi pi-microchip' },
  gatsby: { label: 'Gatsby', icon: 'ai ai-gatsby' },
  hexo: { label: 'Hexo', icon: 'ai ai-hexo' },
  html: { label: 'HTML', icon: 'ai-cor ai-html' },
  hugo: { label: 'Hugo', icon: 'ai ai-hugo' },
  javascript: { label: 'JavaScript', icon: 'ai-cor ai-js' },
  jekyll: { label: 'Jekyll', icon: 'ai ai-jekyll' },
  next: { label: 'Next.js', icon: 'ai-cor ai-next' },
  nitro: { label: 'Nitro', icon: 'pi pi-server' },
  nuxt: { label: 'Nuxt', icon: 'ai-cor ai-nuxt' },
  opennextjs: { label: 'OpenNext', icon: 'ai-cor ai-next' },
  preact: { label: 'Preact', icon: 'ai ai-preact' },
  qwik: { label: 'Qwik', icon: 'ai ai-qwik' },
  react: { label: 'React', icon: 'ai-cor ai-react' },
  rustwasm: { label: 'Rust + WASM', icon: 'pi pi-microchip' },
  stencil: { label: 'Stencil', icon: 'pi pi-code' },
  svelte: { label: 'Svelte', icon: 'ai-cor ai-svelte' },
  typescript: { label: 'TypeScript', icon: 'ai-cor ai-ts' },
  vitepress: { label: 'VitePress', icon: 'ai ai-vitepress' },
  vue: { label: 'Vue', icon: 'ai-cor ai-vue' },
  vuepress: { label: 'VuePress', icon: 'ai ai-vuepress' }
}

export const presetLabel = (preset) => presetMeta[preset]?.label ?? preset
export const presetIcon = (preset) => presetMeta[preset]?.icon ?? ''
