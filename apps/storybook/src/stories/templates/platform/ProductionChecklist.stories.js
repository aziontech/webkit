import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import IconButton from '@aziontech/webkit/icon-button'
import Item from '@aziontech/webkit/item'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Tag from '@aziontech/webkit/tag'
import { computed, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const text = (value) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  if (typeof value === 'string') return text(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    return `[\n${value.map((item) => `${pad}${literal(item, depth + 1)}`).join(',\n')}\n${close}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (inline.length <= 88) return inline
  return `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}}`
}

const declare = (name, value) => `const ${name} = ${literal(value)}`

const TITLE = 'Ship to production'

const DESCRIPTION =
  'The create put this workload live on a generated hostname. These are the gates between that and production.'

const STEPS = [
  {
    id: 'domain',
    icon: 'pi pi-globe',
    title: 'Add a custom domain',
    description:
      'Serve this workload on a domain of your own, with a free HTTPS certificate, instead of the generated Azion hostname.',
    actionLabel: 'Add Domain',
    done: true,
    doneNote: 'Serving shop.example.com.'
  },
  {
    id: 'firewall',
    icon: 'pi pi-shield',
    title: 'Enable firewall protection',
    description:
      'Bind a firewall so requests are inspected before they reach the application. Rate limiting, WAF rules, and network lists.',
    actionLabel: 'Bind Firewall',
    done: false,
    doneNote: ''
  },
  {
    id: 'customPage',
    icon: 'pi pi-file',
    title: 'Set custom error pages',
    description: "Answer 4xx and 5xx with your own page instead of Azion's default response.",
    actionLabel: 'Bind Custom Page',
    done: false,
    doneNote: ''
  }
]

const COMPLETE_STEPS = STEPS.map((step) => ({
  ...step,
  done: true,
  doneNote: {
    domain: 'Serving shop.example.com.',
    firewall: 'Protected by edgeflow-production.',
    customPage: 'Serving Branded 404.'
  }[step.id]
}))

const COUNTS = [
  'const doneCount = computed(() => steps.filter((step) => step.done).length)',
  'const complete = computed(() => steps.length > 0 && doneCount.value === steps.length)'
]

const PROGRESS_TAG = `<Tag
  :label="complete ? 'Ready for production' : \`\${doneCount} of \${steps.length}\`"
  :severity="complete ? 'success' : 'secondary'"
  size="small"
  class="shrink-0"
/>`

const pad = (text, depth) =>
  text
    .split('\n')
    .map((line) => (line ? '  '.repeat(depth) + line : line))
    .join('\n')

const card = (expand) => `<CardBox
  :padded="false"
  :data-complete="complete || null"
  class="data-complete:[&>header]:border-b-0"
>
  <template #header>
    <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
      <h2 class="truncate text-label-md text-(--text-default)">${TITLE}</h2>

${pad(PROGRESS_TAG, 3)}
    </div>

    <IconButton
      icon="pi pi-window-maximize"
      aria-label="Expand the production checklist"
      kind="outlined"
      size="small"
      class="shrink-0"${expand ? '\n      @click="open = true"' : ''}
    />
  </template>

  <template #content>
    <div v-if="!complete" class="flex flex-col">
      <Item
        v-for="step in steps"
        :key="\`\${step.id}:\${step.done ? 'done' : 'todo'}\`"
        as-child
        size="small"
      >
        <button
          type="button"
          :data-done="step.done || null"
          class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <Item.Media>
            <i
              :class="step.icon"
              class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
              aria-hidden="true"
            />
          </Item.Media>

          <Item.Content>
            <Item.Title class="truncate group-data-done/item:text-(--primary) group-data-done/item:line-through">
              {{ step.title }}
            </Item.Title>
          </Item.Content>

          <Item.Actions>
            <i v-if="step.done" class="pi pi-check text-body-sm leading-none text-(--primary)" aria-hidden="true" />
            <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
          </Item.Actions>
        </button>
      </Item>
    </div>
  </template>
</CardBox>`

const DRAWER = `<Drawer v-model:open="open" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>${TITLE}</DrawerTitle>
${pad(PROGRESS_TAG, 6)}
          </div>
          <p class="text-body-sm text-(--text-muted)">
            ${DESCRIPTION}
          </p>
        </div>
        <DrawerClose />
      </PanelHeader>

      <PanelContent>
        <div class="flex flex-col gap-(--spacing-sm)">
          <Item
            v-for="step in steps"
            :key="\`\${step.id}:\${step.done ? 'done' : 'todo'}\`"
            size="medium"
            :data-done="step.done || null"
            class="rounded-(--shape-card) border-(--border-muted) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance data-done:border-(--primary) data-done:bg-(--primary-mask) motion-reduce:transition-none"
          >
            <Item.Media>
              <span
                class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                aria-hidden="true"
              >
                <i :class="step.done ? 'pi pi-check' : step.icon" class="text-body-sm leading-none" />
              </span>
            </Item.Media>

            <Item.Content>
              <Item.Title class="group-data-done/item:text-(--primary) group-data-done/item:line-through">
                {{ step.title }}
              </Item.Title>
              <Item.Description class="group-data-done/item:text-(--primary) group-data-done/item:line-through">
                {{ step.description }}
              </Item.Description>
            </Item.Content>

            <Item.Footer>
              <Tag
                v-if="step.done"
                icon="pi pi-check"
                :label="step.doneNote || 'Done'"
                severity="secondary"
                size="medium"
              />
              <Button
                v-else
                :label="step.actionLabel || step.title"
                kind="outlined"
                size="small"
                @click="open = false"
              />
            </Item.Footer>
          </Item>
        </div>
      </PanelContent>

      <PanelFooter class="justify-end">
        <Button label="Done" kind="primary" size="medium" @click="open = false" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const CARD_TEMPLATE = card(false)

const DRAWER_TEMPLATE = `${card(true)}

${DRAWER}`

const CARD_IMPORTS = (steps) => [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Item from '@aziontech/webkit/item'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed } from 'vue'",
  '',
  declare('steps', steps),
  '',
  ...COUNTS
]

const DRAWER_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Item from '@aziontech/webkit/item'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed, ref } from 'vue'",
  '',
  'const open = ref(false)',
  '',
  declare('steps', STEPS),
  '',
  ...COUNTS
]

const components = {
  Button,
  CardBox,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  IconButton,
  Item,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  'Item.Footer': Item.Footer,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Tag
}

const counts = (steps) => {
  const doneCount = computed(() => steps.filter((step) => step.done).length)
  const complete = computed(() => steps.length > 0 && doneCount.value === steps.length)
  return { doneCount, complete }
}

const meta = {
  title: 'Templates/Platform/Detail/ProductionChecklist',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The production checklist on a workload overview (ProductionChecklist and ProductionChecklistDrawer): a card that names the gates between the generated hostname and production, counts how many are done and lists each as a row, with an expand button that opens the same list as a drawer where every step carries its description and its action. Once every gate is done the card collapses to its title with a Ready for production Tag. Rendered on the Workload Overview tab (WorkloadDetail, `/workloads/:id`). Built from `CardBox`, `Item`, `Tag`, `IconButton`, `Drawer`, the `Panel` parts and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Card = {
  render: () => ({
    components,
    setup: () => ({ steps: STEPS, ...counts(STEPS) }),
    template: CARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The card with one gate done: the done count Tag, the expand button, and one compact row per step, the finished one filled and struck through.'
      },
      source: { code: toSfc(CARD_IMPORTS(STEPS), CARD_TEMPLATE) }
    }
  }
}

export const Complete = {
  render: () => ({
    components,
    setup: () => ({ steps: COMPLETE_STEPS, ...counts(COMPLETE_STEPS) }),
    template: CARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Every gate done: the Tag turns into a success Ready for production, the rows are gone and the header loses its bottom border, so the card closes down to its title and the expand button.'
      },
      source: { code: toSfc(CARD_IMPORTS(COMPLETE_STEPS), CARD_TEMPLATE) }
    }
  }
}

export const DrawerDetail = {
  name: 'Drawer',
  render: () => ({
    components,
    setup: () => ({ open: ref(false), steps: STEPS, ...counts(STEPS) }),
    template: DRAWER_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The expand button opens a right-side drawer with the same progress Tag, the checklist description, every step with its description, and either its action or, once done, a Tag with what it now serves, over a Done footer.'
      },
      source: { code: toSfc(DRAWER_IMPORTS, DRAWER_TEMPLATE) }
    }
  }
}
