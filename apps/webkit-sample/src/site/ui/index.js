// site/ui — the marketing site's own UI kit.
//
// Everything the Site pages compose their bands out of, in one place. Half of the
// list is owned here; the other half (the brand marks, the claim pills, the client
// logos, the hero banners) is ALSO used by the console's signed-out screens and by
// the Hub, so it lives in `@shared/ui/*` and is re-exported below. This barrel is
// the Site's surface either way — a page imports from here and does not have to
// know which of the two a part happens to live in.
//
//   AgentMark     one AI coding agent's brand mark (Claude, Cursor, Windsurf,
//                 Codex, OpenCode), inline and theme-following
//   AiAgentsScene the "agents on the platform" artwork — webkit Illustration
//                 parts composed around those marks
//   banners/      the hero backdrops, selected by name through BannerContainer's
//                 `banner` prop (see ./banners/index.js to add one)
//   ClaimChips    the Network argument's soft-accent claim pills, over the one
//                 shared claim list (NETWORK_CLAIMS, ./claims.js)
//   clients/      the client marks for the trust strip, each tagged with the
//                 artwork (color / light / dark) that drives its theme handling
//   ClientMark    one client logo, placed correctly on both themes
//   ConsoleApplicationScene
//                 the console's Application detail page, drawn — the art half of the
//                 Console band, playing one tab of it at a time
//   FrameworkStackScene
//                 "your app, shipped from the framework you already use" — webkit
//                 Illustration parts around the icon library's coloured framework marks
//   FunctionsHeroCanvas
//                 the Functions hero's art half: the pixel globe, the sample's own code
//                 across it, and the runtime's Web APIs under it
//   NavColumn     one column of product links — overline heading over a rule, then
//                 its NavItems (Figma: Azion.com › Column)
//   NavItem       one product link row — registration-framed glyph, name, and one
//                 line of what it does (Figma: Azion.com › NavigationItem)
//   RuntimeApiCloud
//                 those Web APIs as a field of Content Pills, a few lit at a time
//
// The framed layout set the pages are built from — FrameBox, SectionGap,
// SectionTitle and HeroTitle — graduated to the design system and now comes from
// @aziontech/webkit/{frame-box,section-gap,section-title,hero-title}.
//
// These are Site components, not design-system ones: anything reusable across
// products belongs in @aziontech/webkit instead. The page-composition rules they
// follow are documented in .claude/docs/CONTAINERS.md.
export { default as AiAgentsScene } from './AiAgentsScene.vue'
export { default as ConsoleApplicationScene } from './ConsoleApplicationScene.vue'
export { default as FrameworkStackScene } from './FrameworkStackScene.vue'
export { default as FunctionsHeroCanvas } from './FunctionsHeroCanvas.vue'
export { default as NavColumn } from './NavColumn.vue'
export { default as NavItem } from './NavItem.vue'
export { default as RuntimeApiCloud } from './RuntimeApiCloud.vue'
export { BANNER_NAMES, BANNERS } from '@shared/ui/banners/index.js'
export { default as AgentMark } from '@shared/ui/brand/AgentMark.vue'
export { default as ClaimChips } from '@shared/ui/brand/ClaimChips.vue'
export { NETWORK_CLAIMS } from '@shared/ui/brand/claims.js'
export { default as ClientMark } from '@shared/ui/brand/ClientMark.vue'
export { CLIENTS } from '@shared/ui/brand/clients/index.js'
