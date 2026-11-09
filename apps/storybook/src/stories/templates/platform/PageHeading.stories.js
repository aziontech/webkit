import Button from '@aziontech/webkit/button'

import { toSfc } from '../../_shared/story-source'

const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"

const WORKLOADS_DOCS =
  'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'

const HEADER_CLASS =
  'flex flex-wrap items-start justify-between gap-(--spacing-md)'
const COPY_CLASS = 'flex min-w-0 grow flex-col gap-(--spacing-xxs)'
const TITLE_CLASS =
  'text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg'
const ACTIONS_CLASS =
  'flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full'

const components = { Button }

const LIST_PAGE_TEMPLATE = `<header class="${HEADER_CLASS}">
  <div class="${COPY_CLASS}">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 data-size="medium" class="${TITLE_CLASS}">Workloads</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
  </div>
  <div class="${ACTIONS_CLASS}">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="medium"
      href="${WORKLOADS_DOCS}"
      target="_blank"
      class="w-full md:w-auto"
    />
    <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />
  </div>
</header>`

const SETTINGS_PAGE_TEMPLATE = `<header class="${HEADER_CLASS}">
  <div class="${COPY_CLASS}">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 data-size="small" class="${TITLE_CLASS}">Settings</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">Core configuration for this application.</p>
  </div>
</header>`

const meta = {
  title: 'Templates/Platform/Page/PageHeading',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The heading that opens a console page, as the console’s PageHeading renders it: an h1 whose `data-size` picks the heading token by page level, a one-line description, and the actions the page owns on the right, the Documentation link first and the create action on the outer edge, both outlined `Button`s at the medium size. First-level lists such as Workloads, Applications, SQL Database and the module overviews render it at the medium size; detail tabs and settings sub-pages such as an application’s Settings tab render it small; the creation center’s headline is the only large one. Built from `Button`. When the row runs out of room, the actions move below the copy together instead of squeezing the description; on a phone they stack, each at full width.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ListPage = {
  render: () => ({ components, template: LIST_PAGE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads list heading: medium title, description, the outlined Documentation link and the outlined Create Workload action, both medium.'
      },
      source: { code: toSfc(BUTTON_IMPORT, LIST_PAGE_TEMPLATE) }
    }
  }
}

export const Narrow = {
  render: () => ({ components, template: LIST_PAGE_TEMPLATE }),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story:
          'The same list heading on a phone: the description wraps, and the actions stack below the copy, each at full width.'
      },
      source: { code: toSfc(BUTTON_IMPORT, LIST_PAGE_TEMPLATE) }
    }
  }
}

export const SettingsPage = {
  render: () => ({ components, template: SETTINGS_PAGE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'A settings sub-page heading: small title and description, no actions.'
      },
      source: { code: toSfc([], SETTINGS_PAGE_TEMPLATE) }
    }
  }
}

