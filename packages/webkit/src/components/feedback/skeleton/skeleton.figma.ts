import figma, { html } from '@figma/code-connect/html'

const FIGMA_NODE =
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-881&m=dev'

figma.connect(FIGMA_NODE, {
  label: 'Skeleton',
  imports: ['import Skeleton from "@aziontech/webkit/feedback/skeleton"'],
  props: {
    kind: figma.enum('Shape', {
      Rectangle: 'shape',
      Text: 'shape',
      Circle: 'circular'
    })
  },
  example: ({ kind }) => html` <skeleton kind=${kind} /> `
})
