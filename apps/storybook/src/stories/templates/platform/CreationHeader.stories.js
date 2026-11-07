import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'

import { toSfc } from '../../_shared/story-source'
import { creationHeader, declare, HEADER_IMPORTS, headerComponents } from './_create-markup'

const components = headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton })

const story = ({ breadcrumb, backLabel, description }) => {
  const template = creationHeader({ backLabel, crumbs: breadcrumb.length > 0 })
  const imports = breadcrumb.length
    ? [...HEADER_IMPORTS, '', declare('breadcrumb', breadcrumb)]
    : HEADER_IMPORTS.filter(
        (line) => !line.includes('breadcrumb') && (backLabel || !line.includes('icon-button'))
      )
  return {
    render: () => ({
      components,
      setup: () => ({ breadcrumb }),
      template
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: { code: toSfc(imports, template) }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Creation/CreationHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The focused-flow header that replaces the console shell on every create page: a back IconButton, the Azion Brand linking home and the Breadcrumb on the left, the signed-in Avatar on the right, and no sidebar. Create Zone, Create Database, Create Purge, Create Team, Create Organization, the ten generated `<module>/new` pages, Create Function, Create Workload, Create Application, the Creation Center, Deploy Template and Drop all render it. The wizards drop the back control and the crumb once they reach the provisioning and success screens. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb` and `Avatar`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story({
  breadcrumb: [{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Create Zone' }],
  backLabel: 'Back to Edge DNS',
  description:
    'The Create Zone header: back to Edge DNS, the brand, a two-level crumb ending on the unlinked current page, and the account avatar.'
})

export const CreationCenter = story({
  breadcrumb: [{ label: 'Creation Center', current: true }],
  backLabel: 'Back to Home',
  description:
    'The Creation Center header at `/create`: the back control returns Home and the crumb is the single current page.'
})

export const Terminal = story({
  breadcrumb: [],
  backLabel: '',
  description:
    'Create Workload and Create Application once the last step is submitted: the provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.'
})
