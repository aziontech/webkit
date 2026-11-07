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
import {
  AGENT_LOGOS,
  AGENT_MARK_IMPORTS,
  AGENT_MARKS,
  AGENT_MARKS_LINES,
  AGENT_PROMO,
  iconFrame,
  promoCard
} from './_shell-markup'

const IMPORTS = [
  ...AGENT_MARK_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import InputGroupRoot from '@aziontech/webkit/input-group-root'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Link from '@aziontech/webkit/link'",
  '',
  ...AGENT_MARKS_LINES
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
    icon: 'ai ai-github',
    action: 'Import',
    kind: 'primary'
  },
  {
    title: 'Via CLI',
    description: 'Run azion deploy and ship the branch you are on.',
    icon: 'ai ai-azion-cli',
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

const CATALOG = {
  title: 'Start from a Marketplace template',
  description: 'Deploy a framework starter and the workload that serves it, in one step.',
  logos: ['ai-cor ai-next', 'ai-cor ai-react', 'ai-cor ai-vue', 'ai-cor ai-svelte']
}

const methodActions = (method) =>
  method.command
    ? `<Item.Actions class="basis-full justify-end md:basis-auto md:max-w-(--container-3xs) md:flex-1">
  <InputGroupRoot class="w-full">
    <InputText
      model-value="${method.command}"
      size="large"
      class="min-w-0 flex-1 [&_input]:text-label-code-sm"
      aria-label="${method.title} command"
      readonly
    />
    <CopyButton value="${method.command}" aria-label="Copy the ${method.title} command" copied-label="Command copied" />
  </InputGroupRoot>
</Item.Actions>`
    : `<Item.Actions>
  <Button label="${method.action}" kind="${method.kind}" size="medium" />
</Item.Actions>`

const method = (entry) => `<Item>
  <Item.Media>
${indent(iconFrame(entry.icon), 2)}
  </Item.Media>
  <Item.Content>
    <Item.Title>${entry.title}</Item.Title>
    <Item.Description>${entry.description}</Item.Description>
  </Item.Content>
${indent(methodActions(entry))}
</Item>`

const DEFAULT_TEMPLATE = `<div class="flex flex-col items-start gap-(--spacing-lg)">
  <CardBox :padded="false" class="w-full">
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

      <Item.List class="border-t border-(--border-muted)">
${each(METHODS, method, 4)}
      </Item.List>
    </template>
  </CardBox>

  <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
${indent(promoCard({ ...CATALOG, logos: CATALOG.logos.map(iconFrame).join('\n'), navigates: true }), 2)}

${indent(promoCard({ ...AGENT_PROMO, logos: AGENT_LOGOS }), 2)}
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
          'The block a product list renders before the account owns any of that resource, as the console’s ProductFirstUse renders it: a flush CardBox holding an EmptyState (the product figure, headline, lead and a Documentation link) over an Item.List of the ways to create the first one, each led by a bordered icon frame, with the promo cards below it: Marketplace templates (only for products that have a template catalog: Functions, Applications, Workloads, Deployments and Firewall) and agent onboarding, whose frames carry the Claude, Codex, Gemini and Cursor marks from the webkit assets. The console draws a LineFigure in the EmptyState’s icon slot; LineFigure is a sample-only prototype that webkit does not export, so this template shows the product icon the EmptyState falls back to. The console renders it on Workloads, Applications, Functions and every other product list that is still empty, and the /empty-states lab page lays every product’s version side by side. Built from CardBox, EmptyState, Item, Button, InputGroup, InputText, CopyButton and Link.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: () => ({ agentMarks: AGENT_MARKS }), template: DEFAULT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads entry: import from GitHub (the primary action), the azion deploy command with its copy button, or start from scratch, with the Marketplace template promo (Next.js, React, Vue and Svelte starters) and the agent promo below.'
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
