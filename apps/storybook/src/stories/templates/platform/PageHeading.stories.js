import Button from '@aziontech/webkit/button'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../_shared/story-source'

const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"
const TAG_IMPORT = "import Tag from '@aziontech/webkit/tag'"

const WORKLOADS_DOCS =
  'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'
const SQL_DOCS = 'https://www.azion.com/en/documentation/products/store/edge-sql/'

const HEADER_CLASS =
  'flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between'
const COPY_CLASS = 'flex min-w-0 flex-col gap-(--spacing-xxs)'
const ACTIONS_CLASS =
  'flex flex-col gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-row md:items-center'

const components = { Button, Tag }

const LIST_PAGE_TEMPLATE = `<header class="${HEADER_CLASS}">
  <div class="${COPY_CLASS}">
    <h1 class="text-balance text-heading-sm text-(--text-default)">Workloads</h1>
    <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
  </div>
  <div class="${ACTIONS_CLASS}">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="large"
      href="${WORKLOADS_DOCS}"
      target="_blank"
    />
    <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="large" />
  </div>
</header>`

const SETTINGS_PAGE_TEMPLATE = `<header class="${HEADER_CLASS}">
  <div class="${COPY_CLASS}">
    <h1 class="text-balance text-heading-xs text-(--text-default)">Settings</h1>
    <p class="text-pretty text-body-sm text-(--text-muted)">Core configuration for this application.</p>
  </div>
</header>`

const WITH_SUFFIX_TEMPLATE = `<header class="${HEADER_CLASS}">
  <div class="${COPY_CLASS}">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 class="text-balance text-heading-sm text-(--text-default)">SQL Database</h1>
      <Tag label="Preview" severity="primary" size="small" />
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">
      Create and manage SQL Database instances accessed by Applications, Functions, and APIs.
    </p>
  </div>
  <div class="${ACTIONS_CLASS}">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="large"
      href="${SQL_DOCS}"
      target="_blank"
    />
    <Button label="Create Database" icon="pi pi-plus" kind="outlined" size="large" />
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
          'The heading that opens a console page: an h1 sized by the page level, a one-line description, and the actions the page owns on the right, starting with a Documentation link to the product docs. First-level lists such as Workloads render it at the medium size with the create action; settings sub-pages such as an application’s Settings tab render it small with no actions. Built from `Button` and `Tag`; below `md` the row stacks and every action spans the full width.'
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
          'The Workloads list heading: medium title, description, the outlined Documentation link and the large Create Workload action.'
      },
      source: { code: toSfc(BUTTON_IMPORT, LIST_PAGE_TEMPLATE) }
    }
  }
}

export const BelowMd = {
  render: () => ({ components, template: LIST_PAGE_TEMPLATE }),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story:
          'The same list heading below the `md` breakpoint: the copy and the actions stack, and each action stretches to the full width.'
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

export const WithSuffix = {
  render: () => ({ components, template: WITH_SUFFIX_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'A title suffix: a `Tag` sits beside the h1 to flag a product in preview.'
      },
      source: { code: toSfc([BUTTON_IMPORT, TAG_IMPORT], WITH_SUFFIX_TEMPLATE) }
    }
  }
}
