import figma from '@figma/code-connect/html'

import PlanSuccess from './plan-success.vue'

/**
 * Azion Plans success screen (833:23321) — activation message, next steps, deploy CTA.
 */
figma.connect(
  PlanSuccess,
  'https://www.figma.com/design/eeX71MMNcfqKHoXWemUacK/-UXE-7875--Azion-Plans?node-id=833-23321',
  {
    props: {
      title: figma.string('Title'),
      description: figma.string('Description'),
      actionLabel: figma.string('Action label')
    },
    example: ({ title, description, actionLabel }) => {
      const titleProp = title ? ` title="${title}"` : ''
      const descriptionProp = description ? ` description="${description}"` : ''
      const actionProp = actionLabel ? ` action-label="${actionLabel}"` : ''
      return `<PlanSuccess${titleProp}${descriptionProp}${actionProp} :steps="steps" />`
    }
  }
)
