import figma from '@figma/code-connect/html'

import CardBox from './card-box.vue'

/**
 * Figma Webkit CardBox (562:6473) — header, content, and footer regions.
 */
figma.connect(
  CardBox,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6473',
  {
    props: {
      title: figma.string('Title')
    },
    example: ({ title }) => {
      const titleProp = title ? ` title="${title}"` : ''
      return `<CardBox${titleProp}>
  <template #content><!-- body --></template>
  <template #footer><!-- actions --></template>
</CardBox>`
    }
  }
)
