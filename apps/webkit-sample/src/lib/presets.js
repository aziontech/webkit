// Framework preset → colored glyph (ai-cor ai-<icon>) + human label.
//
// The preset is what the repo's azion.config declares (build.preset) and what
// azion.json echoes back — so the framework icon on a row IS the app's build
// preset. Colored glyphs shipped by @aziontech/icons: vue react next angular
// nuxt astro svelte.
//
// Shared because the Applications list and an application's Build tab must never
// disagree about how a preset is spelled or which glyph it wears.
export const presetMeta = {
  vue: { label: "Vue", icon: "ai-vue" },
  react: { label: "React", icon: "ai-react" },
  next: { label: "Next.js", icon: "ai-next" },
  angular: { label: "Angular", icon: "ai-angular" },
  nuxt: { label: "Nuxt", icon: "ai-nuxt" },
  astro: { label: "Astro", icon: "ai-astro" },
  svelte: { label: "Svelte", icon: "ai-svelte" },
};

// An unknown preset falls back to its raw key (readable) and no glyph (rather
// than a broken icon class).
export const presetLabel = (preset) => presetMeta[preset]?.label ?? preset;
export const presetIcon = (preset) => presetMeta[preset]?.icon ?? "";
