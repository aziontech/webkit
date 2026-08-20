// Build preset → mark + human label.
//
// The preset is what the repo's azion.config declares (build.preset) and what
// azion.json echoes back — so the framework icon on a row IS the app's build preset.
//
// THE KEYS ARE THE PLATFORM'S OWN PRESET NAMES, all 25 of them: the set
// `@aziontech/presets` exports is what a build actually accepts, so a console that knows
// fewer of them renders a blank where an application has a perfectly valid preset. The
// framework catalog (../data/frameworks.js) is keyed by the same names for the same
// reason — one preset, one mark, wherever it appears.
//
// ── `icon` IS THE WHOLE CLASS, NOT A NAME ──
//
// It used to be the bare glyph name (`ai-vue`) and every caller prefixed `ai-cor `, which
// silently limited this map to the 12 COLORED marks: `ai-cor` is a background-image class
// (packages/icons/dist/azionicons-color.css) and a font glyph like `ai-hugo` under it
// paints an empty 1em box — no error, no missing-icon glyph, just a hole in the row. So
// the map carries the full class and the caller binds it as-is: `ai-cor ai-*` for a
// colored mark, `ai ai-*` for a font one.
//
// Six presets have no mark in @aziontech/icons yet — emscripten, html, nitro, rustwasm,
// stencil, and opennextjs (which borrows Next's, since it IS Next.js). They carry a
// neutral `pi` glyph rather than nothing; adding the real logos is a `/include-icons` run
// on the icons package, and this map is the one place that then changes.
//
// Shared because the Applications list, an application's Build tab and the variables
// drawer must never disagree about how a preset is spelled or which mark it wears.
export const presetMeta = {
  angular: { label: 'Angular', icon: 'ai-cor ai-angular' },
  astro: { label: 'Astro', icon: 'ai-cor ai-astro' },
  docusaurus: { label: 'Docusaurus', icon: 'ai ai-docusaurus' },
  eleventy: { label: 'Eleventy', icon: 'ai ai-eleventy' },
  emscripten: { label: 'Emscripten', icon: 'pi pi-microchip' },
  gatsby: { label: 'Gatsby', icon: 'ai ai-gatsby' },
  hexo: { label: 'Hexo', icon: 'ai ai-hexo' },
  html: { label: 'HTML', icon: 'pi pi-code' },
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

// An unknown preset falls back to its raw key (readable) and no glyph (rather
// than a broken icon class).
export const presetLabel = (preset) => presetMeta[preset]?.label ?? preset
export const presetIcon = (preset) => presetMeta[preset]?.icon ?? ''
