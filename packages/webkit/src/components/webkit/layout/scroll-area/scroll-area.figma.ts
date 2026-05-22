import figma from '@figma/code-connect/html'

import ScrollArea from './scroll-area.vue'

/**
 * Native scroll container for overflow content (sidebar groups, panels, long copy).
 * TODO: tokenizar — bind to Figma ScrollArea frame when published in Webkit library.
 */
figma.connect(ScrollArea, 'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit', {
  example: () => `
<ScrollArea class="h-[200px] max-w-[var(--container-md)] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-4)] text-body-sm">
  Long content that overflows the fixed height scrolls here with a thin themed scrollbar.
</ScrollArea>
  `
})
