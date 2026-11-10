import { CREATION_HEADER_COMPONENTS, CREATION_HEADER_IMPORTS, creationHeader } from '../../_shared/headers'
import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from '../platform/_create-markup'

const story = ({ breadcrumb, backLabel, description }) => {
  const template = `<div class="w-full bg-(--bg-canvas)">
${indent(creationHeader({ backLabel, crumbs: breadcrumb.length ? 'breadcrumb' : '' }))}
</div>`
  const imports = CREATION_HEADER_IMPORTS.filter(
    (line) =>
      (breadcrumb.length || !line.includes('/breadcrumb')) &&
      (backLabel || !line.includes('/icon-button'))
  )
  return {
    render: () => ({
      components: CREATION_HEADER_COMPONENTS,
      setup: () => ({ breadcrumb }),
      template
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: {
          code: toSfc(breadcrumb.length ? [...imports, '', declare('breadcrumb', breadcrumb)] : imports, template)
        }
      }
    }
  }
}

const meta = {
  title: 'Templates/Headers/CreationHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'The console bar for the focused creation shell: create, edit and deploy flows that run without the navigation rail. A `GlobalHeader` in its default `content` placement, spanning the whole window. Start: a small back button, the brand and the breadcrumb of where the flow lives. End: the account avatar alone, so the signed-in user stays visible. The bar carries no search, Create or Agent: the flow is the one thing on screen. Every one-screen create page (SinglePageCreate), every stepped one (MultipageCreate), the creation wizards (SourceWizard, ProvisionWizard), the deploy flows and the CreateHub render it. The back button returns to the list the flow started from; the wizards drop it and the crumb once they reach the provisioning and success screens. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Avatar` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story({
  breadcrumb: [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }],
  backLabel: 'Back to Resources',
  description:
    'The header of a create page: back to the resource list, the brand, a two-level crumb ending on the unlinked current page, and the account avatar.'
})

export const CreateHub = story({
  breadcrumb: [{ label: 'Creation Center', current: true }],
  backLabel: 'Back to Home',
  description:
    'The Creation Center header: the back control returns Home and the crumb is the single current page.'
})

export const Terminal = story({
  breadcrumb: [],
  backLabel: '',
  description:
    'A creation wizard once the last step is submitted: the provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.'
})
