import CardBox from '@aziontech/webkit/card-box'
import Hint from '@aziontech/webkit/hint'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../_shared/story-source'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const objectLiteral = (item) => {
  const entries = Object.entries(item).map(([key, value]) => `${key}: ${quoted(value)}`)
  const inline = `  { ${entries.join(', ')} }`
  return inline.length <= 100
    ? inline
    : `  {\n${entries.map((entry) => `    ${entry}`).join(',\n')}\n  }`
}

const listLine = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const ANSWERS = [
  { label: 'Name', api: 'name', text: 'my-function' },
  { label: 'Runtime', api: 'runtime', text: 'JavaScript' },
  { label: 'Execution environment', api: 'execution_environment', text: 'application' },
  { label: 'Active', api: 'active', text: 'On' }
]

const CONSUMERS = [
  { by: 'application', path: 'via Function Instance', as: 'via' },
  { by: 'firewall', path: 'via Function Instance', as: 'via' },
  { by: 'function-instance', path: 'function', as: 'id', requires: 'functions' },
  { by: 'release', path: 'dependency', as: 'ver' }
]

const IMPORTS = [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Item from '@aziontech/webkit/item'",
  "import Message from '@aziontech/webkit/message'",
  "import Tag from '@aziontech/webkit/tag'",
  '',
  listLine('answers', ANSWERS),
  listLine('consumers', CONSUMERS)
]

const components = {
  CardBox,
  Hint,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Message,
  Tag
}

const TEMPLATE = `<div class="layout-form-create flex flex-col gap-(--layout-section-gap)">
  <section class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="text-balance text-heading-xxs text-(--text-default)">What gets created</h2>
      <Hint text="Every value below is posted as the property named beside it." />
    </div>
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item v-for="answer in answers" :key="answer.api">
            <Item.Content>
              <Item.Title>{{ answer.label }}</Item.Title>
              <Item.Description>{{ answer.api }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <span class="max-w-(--container-3xs) truncate text-label-sm text-(--text-default)">{{ answer.text }}</span>
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </section>

  <section class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="text-balance text-heading-xxs text-(--text-default)">Where it runs</h2>
      <Hint text="A Rules Engine rule calls it, on the application it is instanced on." />
    </div>
    <CardBox :padded="false">
      <template #content>
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
          <Message severity="success" size="small" label="Runs on my-application." />
        </div>
      </template>
    </CardBox>
  </section>

  <section class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="text-balance text-heading-xxs text-(--text-default)">What can reference it</h2>
      <Hint text="Read off the v6 dependency matrix: every consumer of this resource, and the field or rule that carries the reference." />
    </div>
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item v-for="row in consumers" :key="row.by + row.path">
            <Item.Content>
              <Item.Title>{{ row.by }}</Item.Title>
              <Item.Description>{{ row.path }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Tag v-if="row.requires" :label="'modules.' + row.requires" severity="warning" size="small" />
              <Tag :label="row.as" size="small" />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </section>
</div>`

const meta = {
  title: 'Templates/Platform/Creation/ReviewStep',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The last step of a stepped create flow, read back before Create: a band listing every field and the API property it posts as, a band stating where the resource runs as a single Message, and a band of the resources that can reference it with the field each one carries. Create Function and the generic resource wizard render it as their Review step. Built from `CardBox`, `Item`, `Hint`, `Message` and `Tag`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ answers: ANSWERS, consumers: CONSUMERS }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A function about to be created: four posted properties, a success Message naming the application it runs on, and the four consumers that can reference it, one of them gated by a module.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
