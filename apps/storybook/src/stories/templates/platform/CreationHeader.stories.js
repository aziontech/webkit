import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'

import { toSfc } from '../../_shared/story-source'

const BREADCRUMB = [{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Create Zone' }]

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  '',
  'const breadcrumb = [',
  "  { label: 'Edge DNS', href: '/edge-dns' },",
  "  { label: 'Create Zone' }",
  ']'
]

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  IconButton
}

const TEMPLATE = `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
    <IconButton icon="pi pi-chevron-left" aria-label="Back to Edge DNS" kind="outlined" size="small" />
    <GlobalHeader.Brand>
      <a
        href="/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <Breadcrumb :items="breadcrumb" />
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    <button
      type="button"
      aria-label="Account settings"
      class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
    >
      <Avatar label="myemail@azion.com" size="medium" kind="square" />
    </button>
  </GlobalHeader.Right>
</GlobalHeader>`

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
          'The focused-flow header that replaces the console shell on every create, edit and deploy page: a back IconButton, the Azion Brand and the Breadcrumb on the left, the signed-in Avatar on the right, and no sidebar. Create Zone, Create Team, Create Function and the application wizard all render it above their form. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb` and `Avatar`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ breadcrumb: BREADCRUMB }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Create Zone header: back to Edge DNS, the brand, a two-level crumb ending on the unlinked current page, and the account avatar.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
