import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import IconButton from '@aziontech/webkit/icon-button'
import ItemActions from '@aziontech/webkit/item-actions'
import ItemContent from '@aziontech/webkit/item-content'
import ItemDescription from '@aziontech/webkit/item-description'
import ItemFooter from '@aziontech/webkit/item-footer'
import ItemMedia from '@aziontech/webkit/item-media'
import ItemRoot from '@aziontech/webkit/item-root'
import ItemTitle from '@aziontech/webkit/item-title'
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

const DONE_COUNT = 'const doneCount = computed(() => steps.filter((step) => step.done).length)'

const PROGRESS_TAG =
  '<Tag :label="`${doneCount} of ${steps.length}`" severity="secondary" size="small" />'

const card = (expand) => `<CardBox :padded="false">
  <template #header>
    <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
      <h2 class="truncate text-label-md text-(--text-default)">${TITLE}</h2>
      ${PROGRESS_TAG}
    </div>
    <IconButton
      icon="pi pi-window-maximize"
      aria-label="Expand the production checklist"
      kind="outlined"
      size="small"${expand ? '\n      @click="open = true"' : ''}
    />
  </template>

  <template #content>
    <div class="flex flex-col">
      <ItemRoot v-for="step in steps" :key="step.id" as-child size="small">
        <button
          type="button"
          :data-done="step.done || null"
          class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <ItemMedia>
            <i
              :class="step.icon"
              class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
              aria-hidden="true"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <span class="block truncate group-data-done/item:text-(--primary) group-data-done/item:line-through">
                {{ step.title }}
              </span>
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <i v-if="step.done" class="pi pi-check text-body-sm leading-none text-(--primary)" aria-hidden="true" />
            <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
          </ItemActions>
        </button>
      </ItemRoot>
    </div>
  </template>
</CardBox>`

const CARD_TEMPLATE = card(false)

const DRAWER_TEMPLATE = `${card(true)}

<Drawer v-model:open="open" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>${TITLE}</DrawerTitle>
            ${PROGRESS_TAG}
          </div>
          <p class="text-body-sm text-(--text-muted)">${DESCRIPTION}</p>
        </div>
        <DrawerClose />
      </PanelHeader>

      <PanelContent>
        <div class="flex flex-col gap-(--spacing-sm)">
          <div
            v-for="step in steps"
            :key="step.id"
            :data-done="step.done || null"
            class="group/step rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance data-done:border-(--primary) data-done:bg-(--primary-mask) motion-reduce:transition-none"
          >
            <ItemRoot size="medium">
              <ItemMedia>
                <span
                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/step:border-(--primary) group-data-done/step:bg-transparent group-data-done/step:text-(--primary) motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <i :class="step.done ? 'pi pi-check' : step.icon" class="text-body-sm leading-none" />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <span class="group-data-done/step:text-(--primary) group-data-done/step:line-through">
                    {{ step.title }}
                  </span>
                </ItemTitle>
                <ItemDescription>
                  <span class="group-data-done/step:text-(--primary) group-data-done/step:line-through">
                    {{ step.description }}
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemFooter>
                <Tag v-if="step.done" icon="pi pi-check" :label="step.doneNote" severity="secondary" size="medium" />
                <Button v-else :label="step.actionLabel" kind="outlined" size="small" @click="open = false" />
              </ItemFooter>
            </ItemRoot>
          </div>
        </div>
      </PanelContent>

      <PanelFooter class="justify-end">
        <Button label="Done" kind="primary" size="medium" @click="open = false" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const CARD_IMPORTS = [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import ItemRoot from '@aziontech/webkit/item-root'",
  "import ItemActions from '@aziontech/webkit/item-actions'",
  "import ItemContent from '@aziontech/webkit/item-content'",
  "import ItemMedia from '@aziontech/webkit/item-media'",
  "import ItemTitle from '@aziontech/webkit/item-title'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed } from 'vue'",
  '',
  declare('steps', STEPS),
  '',
  DONE_COUNT
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
  "import ItemRoot from '@aziontech/webkit/item-root'",
  "import ItemActions from '@aziontech/webkit/item-actions'",
  "import ItemContent from '@aziontech/webkit/item-content'",
  "import ItemDescription from '@aziontech/webkit/item-description'",
  "import ItemFooter from '@aziontech/webkit/item-footer'",
  "import ItemMedia from '@aziontech/webkit/item-media'",
  "import ItemTitle from '@aziontech/webkit/item-title'",
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
  DONE_COUNT
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
  ItemRoot,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Tag
}

const doneCount = () => computed(() => STEPS.filter((step) => step.done).length)

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
          'The production checklist on a workload overview: a card that names the gates between the generated hostname and production, counts how many are done and lists each as a row, with an expand button that opens the same list as a drawer where every step carries its description and its action. Rendered on the Workload Overview page. Built from `CardBox`, `Item`, `Tag`, `IconButton`, `Drawer`, the `Panel` parts and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Card = {
  render: () => ({
    components,
    setup: () => ({ steps: STEPS, doneCount: doneCount() }),
    template: CARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The card: a title with the done count, an expand button, and one compact row per step, the finished one filled and struck through.'
      },
      source: { code: toSfc(CARD_IMPORTS, CARD_TEMPLATE) }
    }
  }
}

export const DrawerDetail = {
  name: 'Drawer',
  render: () => ({
    components,
    setup: () => ({ open: ref(false), steps: STEPS, doneCount: doneCount() }),
    template: DRAWER_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The expand button opens a right-side drawer with the same progress tag, the checklist description, every step with its description and its action, and a Done footer.'
      },
      source: { code: toSfc(DRAWER_IMPORTS, DRAWER_TEMPLATE) }
    }
  }
}
