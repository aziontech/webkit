import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import GlobalHeader from '@aziontech/webkit/global-header'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import LogView from '@aziontech/webkit/log-view'
import LogViewContent from '@aziontech/webkit/log-view-content'
import LogViewHeader from '@aziontech/webkit/log-view-header'
import Default from '@aziontech/webkit/svg/azion/default'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../_shared/story-source.js'
import { completeDeployLog } from '../components/code/log-view/complete-deploy-log.js'

const steps = [
  {
    title: 'Customize Domain',
    description: 'Associate a custom domain and subdomains to Azion to handle user access.',
    icon: 'ai ai-domains'
  },
  {
    title: 'Point Traffic',
    description:
      'Redirect the traffic of a domain to Azion and take advantage of the distributed network.',
    icon: 'ai ai-network-lists'
  },
  {
    title: 'View Analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    icon: 'ai ai-real-time-metrics'
  }
]

const IMPORT = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import Item from '@aziontech/webkit/item'",
  "import Link from '@aziontech/webkit/link'",
  "import LogView from '@aziontech/webkit/log-view'",
  "import LogViewContent from '@aziontech/webkit/log-view-content'",
  "import LogViewHeader from '@aziontech/webkit/log-view-header'",
  "import Default from '@aziontech/webkit/svg/azion/default'",
  "import Tag from '@aziontech/webkit/tag'",
  '',
  'const steps = [',
  "  { title: 'Customize Domain', description: 'Associate a custom domain to handle user access.', icon: 'ai ai-domains' },",
  "  { title: 'Point Traffic', description: 'Redirect traffic to Azion and use the distributed network.', icon: 'ai ai-network-lists' },",
  "  { title: 'View Analytics', description: 'Gain insights into performance, availability, and security.', icon: 'ai ai-real-time-metrics' }",
  ']',
  'const lines = [',
  "  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },",
  "  { id: '2', time: '13:49:10', type: 'success', message: 'Deploy finalized successfully!' }",
  ']'
]

const PAGE_TEMPLATE = `<div class="flex min-h-full w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader>
    <GlobalHeader.Left>
      <GlobalHeader.Brand>
        <Default aria-label="Azion" />
      </GlobalHeader.Brand>
    </GlobalHeader.Left>
  </GlobalHeader>

  <main class="flex flex-1 flex-col items-center px-(--spacing-xxl) py-(--spacing-xxl)">
    <CardBox class="w-full max-w-[768px]" :padded="false">
      <template #header>
        <div class="flex w-full items-start justify-between gap-(--spacing-md)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <h1 class="text-heading-sm text-(--text-default) [word-break:break-word]">Congratulations!</h1>
            <div class="flex flex-wrap items-center gap-(--spacing-xs)">
              <p class="whitespace-nowrap text-body-sm text-(--text-muted)">You just deployed a new application into</p>
              <Tag label="mygithub-scope" severity="secondary" icon="pi pi-github" />
            </div>
          </div>
          <Link label="Visit" href="https://example.com" target="_blank" />
        </div>
      </template>

      <template #content>
        <div class="flex w-full flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
          <h2 class="w-full text-heading-xs text-(--text-default) [word-break:break-word]">myappname</h2>
          <LogView :lines="lines" class="h-[263px] min-h-[263px]">
            <LogViewHeader />
            <LogViewContent />
          </LogView>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full flex-col gap-(--spacing-md) px-(--spacing-lg) pb-(--spacing-sm) pt-(--spacing-md)">
          <div class="flex w-full flex-col gap-(--spacing-md)">
            <p class="w-full text-label-sm text-(--text-default) [word-break:break-word]">Next Steps</p>
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Item v-for="(step, index) in steps" :key="index" size="medium" as-child>
                <button
                  type="button"
                  class="cursor-pointer border-0 bg-transparent text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <Item.Media
                    media-kind="icon"
                    class="relative z-1 size-10! shrink-0 translate-y-0! self-center border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i :class="step.icon" class="inline-flex size-5 items-center justify-center leading-none" aria-hidden="true" />
                  </Item.Media>
                  <Item.Content class="relative z-1">
                    <Item.Title>{{ step.title }}</Item.Title>
                    <Item.Description>{{ step.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="relative z-1">
                    <i class="pi pi-chevron-right size-6 shrink-0 leading-none text-(--text-default)" aria-hidden="true" />
                  </Item.Actions>
                </button>
              </Item>
            </div>
          </div>

          <Button label="Manage" kind="secondary" size="large" class="w-full" />
        </div>
      </template>
    </CardBox>
  </main>
</div>`

// Dot-notation sub-tags are registered by their exact name so Storybook's
// runtime-compiled string template resolves them; a real SFC resolves them off
// the imported compound root.
const components = {
  Button,
  CardBox,
  Default,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  Item,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Link,
  LogView,
  LogViewContent,
  LogViewHeader,
  Tag
}

/** @type {import('@storybook/vue3').Meta<typeof CardBox>} */
const meta = {
  title: 'Templates/DeploySuccess',
  component: CardBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Post-deploy success screen composed from `GlobalHeader`, `CardBox`, `Tag`, `Link`, `LogView`, `Item` and `Button`: a global header with the brand, a centered card with a congratulations message, scope tag, visit link, the embedded build log, an icon next-steps list, and a "Manage" CTA.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const DefaultPage = {
  name: 'Default',
  render: () => ({
    components,
    setup: () => ({ lines: completeDeployLog, steps }),
    template: PAGE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Post-deploy success screen with the full build log, three next-step rows and the manage action.'
      },
      source: { code: toSfc(IMPORT, PAGE_TEMPLATE) }
    }
  }
}
