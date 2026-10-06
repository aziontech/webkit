import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import EmptyState from '@aziontech/webkit/empty-state'
import InputGroupRoot from '@aziontech/webkit/input-group-root'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import Skeleton from '@aziontech/webkit/skeleton'

import { each, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import InputGroupRoot from '@aziontech/webkit/input-group-root'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Link from '@aziontech/webkit/link'"
]

const LOADING_IMPORTS = ["import Skeleton from '@aziontech/webkit/skeleton'"]

const components = {
  Button,
  CardBox,
  CopyButton,
  EmptyState,
  InputGroupRoot,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Link,
  Skeleton
}

const WORKLOADS = {
  icon: 'ai ai-workloads',
  headline: 'Deploy your first workload',
  lead: 'Create your first deploy starting from scratch, a template or importing your code.',
  documentation: 'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'
}

const METHODS = [
  {
    title: 'From GitHub',
    description: 'Import a repository and Azion deploys it on every push.',
    icon: 'pi pi-github',
    action: 'Import',
    kind: 'primary'
  },
  {
    title: 'Via CLI',
    description: 'Run azion deploy and ship the branch you are on.',
    icon: 'pi pi-desktop',
    command: 'azion deploy'
  },
  {
    title: 'From scratch',
    description: 'Point a domain at an application you already have.',
    icon: 'pi pi-globe',
    action: 'Create',
    kind: 'outlined'
  }
]

const PROMOS = [
  {
    title: 'Start from a Marketplace template',
    description: 'Deploy a framework starter and the workload that serves it, in one step.',
    marks: ['ai-cor ai-next', 'ai-cor ai-react', 'ai-cor ai-vue', 'ai-cor ai-angular'],
    navigates: true
  },
  {
    title: 'Set up Azion with your agent',
    description: 'Give your editor a prompt that teaches it to build and deploy here.',
    marks: ['pi pi-sparkles', 'pi pi-code', 'pi pi-microchip-ai', 'pi pi-bolt'],
    navigates: false
  }
]

const methodActions = (method) =>
  method.command
    ? `<Item.Actions class="basis-full justify-end md:basis-auto md:max-w-(--container-3xs) md:flex-1">
  <InputGroupRoot>
    <InputText model-value="${method.command}" size="large" aria-label="${method.title} command" readonly />
    <CopyButton value="${method.command}" aria-label="Copy the ${method.title} command" copied-label="Command copied" />
  </InputGroupRoot>
</Item.Actions>`
    : `<Item.Actions>
  <Button label="${method.action}" kind="${method.kind}" size="medium" />
</Item.Actions>`

const method = (entry) => `<Item>
  <Item.Media kind="icon">
    <i class="${entry.icon}" aria-hidden="true" />
  </Item.Media>
  <Item.Content>
    <Item.Title>${entry.title}</Item.Title>
    <Item.Description>${entry.description}</Item.Description>
  </Item.Content>
${indent(methodActions(entry))}
</Item>`

const mark = (icon) => `<span
  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
>
  <i class="${icon}" aria-hidden="true" />
</span>`

const externalGlyph = `
      <i
        class="pi pi-external-link absolute right-(--spacing-md) top-(--spacing-md) text-(--text-muted) transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:text-(--text-default)"
        aria-hidden="true"
      />`

const promo = (entry) => `<CardBox :padded="false">
  <template #content>
    <button
      type="button"
      class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-left transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <span
        class="flex items-center [&>*+*]:-ml-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ml-1.5 group-focus-visible:[&>*+*]:-ml-1.5 motion-reduce:[&>*+*]:transition-none"
        aria-hidden="true"
      >
${each(entry.marks, mark, 4)}
      </span>
      <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <span class="text-heading-xxs text-(--text-default)">${entry.title}</span>
        <span class="text-pretty text-body-sm text-(--text-muted)">${entry.description}</span>
      </span>${entry.navigates ? externalGlyph : ''}
    </button>
  </template>
</CardBox>`

const DEFAULT_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg)">
  <CardBox :padded="false">
    <template #content>
      <EmptyState
        icon="${WORKLOADS.icon}"
        title="${WORKLOADS.headline}"
        description="${WORKLOADS.lead}"
      >
        <template #actions>
          <Link label="Documentation" href="${WORKLOADS.documentation}" target="_blank" />
        </template>
      </EmptyState>

      <div class="border-t border-(--border-muted)">
        <Item.List>
${each(METHODS, method, 5)}
        </Item.List>
      </div>
    </template>
  </CardBox>

  <div class="grid gap-(--spacing-lg) md:grid-cols-2">
${each(PROMOS, promo, 2)}
  </div>
</div>`

const LOADING_TEMPLATE = `<div class="flex flex-col gap-(--spacing-md)">
  <Skeleton height="23rem" />
  <Skeleton height="7rem" />
</div>`

const meta = {
  title: 'Templates/Platform/States/ProductFirstUse',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The block a product list renders before the account owns any of that resource: a flush CardBox holding an EmptyState (the product icon, headline, lead and a Documentation link) over an Item.List of the ways to create the first one, with two wide promo cards below it for Marketplace templates and agent onboarding. The console renders it on Workloads, Applications, Functions and every other product list that is still empty. Built from CardBox, EmptyState, Item, Button, InputGroup, InputText, CopyButton and Link.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads entry: import from GitHub, the azion deploy command with its copy button, or start from scratch, with the template and agent promos below.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => ({ components, template: LOADING_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'While the tenancy reloads, the console holds the block’s footprint with two Skeleton bands.'
      },
      source: { code: toSfc(LOADING_IMPORTS, LOADING_TEMPLATE) }
    }
  }
}
