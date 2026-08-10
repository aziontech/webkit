// site/ui — the marketing site's own UI kit.
//
// Everything the Site pages compose their bands out of, in one place:
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
//   HeroTitle     a hero band's copy block — eyebrow → h1 → description → actions
//   SectionTitle  a section's framed, centered header row (h2)
//   FrameBox      the registration frame — a bordered box with a small square set
//                 inside each corner
//   SectionGap    that frame used empty, as the air between two sections (it owns
//                 the page's vertical rhythm)
//
// These are Site components, not design-system ones: anything reusable across
// products belongs in @aziontech/webkit instead. The page-composition rules they
// follow are documented in .claude/docs/CONTAINERS.md.
export { default as AgentMark } from './AgentMark.vue'
export { default as AiAgentsScene } from './AiAgentsScene.vue'
export { BANNER_NAMES, BANNERS } from './banners/index.js'
export { default as ClaimChips } from './ClaimChips.vue'
export { NETWORK_CLAIMS } from './claims.js'
export { default as ClientMark } from './ClientMark.vue'
export { CLIENTS } from './clients/index.js'
export { default as FrameBox } from './FrameBox.vue'
export { default as HeroTitle } from './HeroTitle.vue'
export { default as SectionGap } from './SectionGap.vue'
export { default as SectionTitle } from './SectionTitle.vue'
