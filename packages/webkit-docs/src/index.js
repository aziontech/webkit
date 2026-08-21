// The Azion documentation layer.
//
// Two halves that meet in one MDX file: `DocProse` styles everything an author
// writes as prose, and the components below are what they reach for when prose
// is not enough. `DocMarkdown` is the bridge — it parses the MDX subset and
// renders both halves together.

export { default as DocAccordionGroup } from './components/doc-accordion-group.vue'
export { default as DocAccordionItem } from './components/doc-accordion-item.vue'
export { default as DocCallout } from './components/doc-callout.vue'
export { default as DocCard } from './components/doc-card.vue'
export { default as DocCardGroup } from './components/doc-card-group.vue'
export { default as DocCodeGroup } from './components/doc-code-group.vue'
export { default as DocCta } from './components/doc-cta.vue'
export { default as DocFrame } from './components/doc-frame.vue'
export { default as DocHeading } from './components/doc-heading.vue'
export { default as DocItem } from './components/doc-item.vue'
export { default as DocItemGroup } from './components/doc-item-group.vue'
export { default as DocMarkdown } from './components/doc-markdown.vue'
export { default as DocOnThisPage } from './components/doc-on-this-page.vue'
export { default as DocPage } from './components/doc-page.vue'
export { default as DocPageHeader } from './components/doc-page-header.vue'
export { default as DocPagination } from './components/doc-pagination.vue'
export { default as DocPrompt } from './components/doc-prompt.vue'
export { default as DocProse } from './components/doc-prose.vue'
export { default as DocShell } from './components/doc-shell.vue'
export { default as DocSidebar } from './components/doc-sidebar.vue'
export { default as DocStep } from './components/doc-step.vue'
export { default as DocSteps } from './components/doc-steps.vue'
export { default as DocTab } from './components/doc-tab.vue'
export { default as DocTabs } from './components/doc-tabs.vue'
export { default as DocTooltip } from './components/doc-tooltip.vue'
export { default as DocUpdate } from './components/doc-update.vue'
export {
  collectHeadings,
  COMPONENT_TAGS,
  INLINE_COMPONENT_TAGS,
  parseMdx,
  slugify
} from './lib/mdx'
