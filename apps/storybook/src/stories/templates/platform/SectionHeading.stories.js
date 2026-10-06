import Button from '@aziontech/webkit/button'
import CopyButton from '@aziontech/webkit/copy-button'
import Link from '@aziontech/webkit/link'

import { toSfc } from '../../_shared/story-source'

const COPY_BUTTON_IMPORT = "import CopyButton from '@aziontech/webkit/copy-button'"
const DOCS = 'https://www.azion.com/en/documentation/'

const anchorUrlFor = (id) => `${globalThis.location.href.split('#')[0]}#${id}`

const anchorLine = (id) => `const anchorUrl = globalThis.location.href.split('#')[0] + '#${id}'`

const components = { Button, CopyButton, Link }

const heading = ({
  id,
  title,
  description,
  actions
}) => `<header class="group/heading flex flex-col">
  <div class="flex flex-col gap-(--spacing-md) px-(--spacing-xs) md:flex-row md:items-start md:justify-between">
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
        <h2 id="${id}" class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)">
          ${title}
        </h2>
        <span class="shrink-0 opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none">
          <CopyButton
            :value="anchorUrl"
            kind="transparent"
            size="small"
            aria-label="Copy link to the ${title} section"
            copied-label="Link copied"
          />
        </span>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">${description}</p>
    </div>
    <div class="flex w-full flex-wrap items-center gap-(--spacing-xs) md:w-auto md:shrink-0 md:flex-nowrap">
      ${actions}
    </div>
  </div>
</header>`

const DEFAULT_ID = 'payment-information'
const DEFAULT_TEMPLATE = heading({
  id: DEFAULT_ID,
  title: 'Payment information',
  description: 'Where invoices are sent, and whether the plan renews on its own.',
  actions: `<Link label="Documentation" size="small" href="${DOCS}" target="_blank" />`
})

const WITH_ACTIONS_ID = 'payment-methods'
const WITH_ACTIONS_TEMPLATE = heading({
  id: WITH_ACTIONS_ID,
  title: 'Payment methods',
  description: 'Every card on the account. Invoices are charged to the default one.',
  actions: '<Button label="Add payment method" kind="outlined" size="medium" icon="pi pi-plus" />'
})

const meta = {
  title: 'Templates/Platform/Page/SectionHeading',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The heading of one band inside a page: an h2 with a one-line description, a copy-link affordance that appears when the heading is hovered or focused, and the band’s own actions or documentation link on the right. Billing renders one above each of its cards and tables, and an application’s Get started block opens with one. Built from `CopyButton`, `Link` and `Button`; below `md` the actions drop under the copy.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ anchorUrl: anchorUrlFor(DEFAULT_ID) }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Title, description, the hover-revealed copy-link button and a Documentation link on the right.'
      },
      source: {
        code: toSfc(
          [
            COPY_BUTTON_IMPORT,
            "import Link from '@aziontech/webkit/link'",
            '',
            anchorLine(DEFAULT_ID)
          ],
          DEFAULT_TEMPLATE
        )
      }
    }
  }
}

export const WithActions = {
  render: () => ({
    components,
    setup: () => ({ anchorUrl: anchorUrlFor(WITH_ACTIONS_ID) }),
    template: WITH_ACTIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'The Billing payment-methods heading, with the medium add action on the right.'
      },
      source: {
        code: toSfc(
          [
            "import Button from '@aziontech/webkit/button'",
            COPY_BUTTON_IMPORT,
            '',
            anchorLine(WITH_ACTIONS_ID)
          ],
          WITH_ACTIONS_TEMPLATE
        )
      }
    }
  }
}
