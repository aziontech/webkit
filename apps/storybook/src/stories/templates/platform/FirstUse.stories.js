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

const RESOURCE = {
  icon: 'pi pi-box',
  headline: 'Create your first resource',
  lead: 'Start from scratch, from a template or by importing your code.',
  documentation: 'https://example.com/docs/resources'
}

const METHODS = [
  {
    title: 'From GitHub',
    description: 'Import a repository and deploy it on every push.',
    icon: 'ai ai-github',
    action: 'Import',
    kind: 'primary'
  },
  {
    title: 'Via CLI',
    description: 'Run platform deploy and ship the branch you are on.',
    icon: 'pi pi-code',
    command: 'platform deploy'
  },
  {
    title: 'From scratch',
    description: 'Point a domain at a service you already run.',
    icon: 'pi pi-globe',
    action: 'Create',
    kind: 'outlined'
  }
]

const CATALOG = {
  title: 'Start from a Catalog template',
  description: 'Deploy a framework starter and the resource that serves it, in one step.',
  logos: ['ai-cor ai-next', 'ai-cor ai-react', 'ai-cor ai-vue', 'ai-cor ai-svelte']
}

const methodActions = (method) =>
  method.command
    ? `<div class="flex basis-full md:basis-auto md:max-w-(--container-3xs) md:flex-1 justify-end"><Item.Actions class="w-full">
  <InputGroupRoot class="w-full">
    <div class="flex min-w-0 flex-1">
      <InputText
        model-value="${method.command}"
        size="large"
        class="w-full"
        aria-label="${method.title} command"
        readonly
      />
    </div>
    <CopyButton value="${method.command}" aria-label="Copy the ${method.title} command" copied-label="Command copied" />
  </InputGroupRoot>
</Item.Actions></div>`
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
        icon="${RESOURCE.icon}"
        title="${RESOURCE.headline}"
        description="${RESOURCE.lead}"
      >
        <template #actions>
          <Link label="Documentation" href="${RESOURCE.documentation}" target="_blank" />
        </template>
      </EmptyState>

      <div class="border-t border-(--border-muted)">
        <Item.List>
  ${each(METHODS, method, 4)}
        </Item.List>
      </div>
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
  title: 'Templates/Platform/States/FirstUse',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The block a first-level list renders before the account owns any resource of that kind: a flush CardBox holding an EmptyState (the resource glyph, headline, lead and a Documentation link) over an Item.List of the ways to create the first one, each led by a bordered icon frame, with the promo cards below it: Catalog templates (only for resource kinds that have a template catalog) and agent onboarding, whose frames carry the Claude, Codex, Gemini and Cursor marks from the webkit assets. The EmptyState’s icon slot shows the resource glyph; an app may draw a richer figure there. Every list that is still empty renders it with its own nouns, methods and promos. Built from CardBox, EmptyState, Item, Button, InputGroup, InputText, CopyButton and Link.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'empty state',
        'empty list',
        'first use',
        'no resources yet',
        'create first resource',
        'product empty state',
        'zero state',
        'estado vazio',
        'lista vazia',
        'primeiro uso'
      ],
      skills: ['webkit-ui-states', 'webkit-microcopy']
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ agentMarks: AGENT_MARKS }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The resource entry: import from GitHub (the primary action), the platform deploy command with its copy button, or start from scratch, with the Catalog template promo (Next.js, React, Vue and Svelte starters) and the agent promo below.'
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
          'While the account reloads, the page holds the block’s footprint with two Skeleton bands.'
      },
      source: { code: toSfc(LOADING_IMPORTS, LOADING_TEMPLATE) }
    }
  }
}
