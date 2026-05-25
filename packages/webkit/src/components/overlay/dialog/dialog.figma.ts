import figma from '@figma/code-connect/html'

import Dialog from './dialog.vue'

/**
 * Figma Webkit Panel (482:935) — composed as Dialog with Panel regions.
 */
figma.connect(
  Dialog,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=482-935',
  {
    props: {
      closeable: figma.boolean('Closeable'),
      size: figma.enum('Size', {
        Small: 'small',
        Medium: 'medium',
        Large: 'large'
      })
    },
    example: () => `
<Dialog v-model:open="open" closeable>
  <DialogTrigger><Button label="Open" /></DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogClose />
      </PanelHeader>
      <PanelContent />
      <PanelFooter />
    </DialogContent>
  </DialogPortal>
</Dialog>
  `
  }
)
