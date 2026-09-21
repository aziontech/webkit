import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import GlobalHeader from '@aziontech/webkit/global-header'
import Default from '@aziontech/webkit/svg/azion/default'

import { toSfc } from '../_shared/story-source'

const steps = [
  {
    title: 'Start by creating your first Deploy',
    description: 'Deploy your workload and start delivering content through the Azion Network.'
  },
  {
    title: 'Protect your Workload',
    description: 'Enable security features to safeguard your workloads, users, and data.'
  },
  {
    title: 'Observe your Metrics',
    description:
      'Track metrics, analyze traffic in real-time, and gain insights to optimize and protect your applications.'
  }
]

const STEPS_CONST = `const steps = [
  {
    title: 'Start by creating your first Deploy',
    description: 'Deploy your workload and start delivering content through the Azion Network.'
  },
  {
    title: 'Protect your Workload',
    description: 'Enable security features to safeguard your workloads, users, and data.'
  },
  {
    title: 'Observe your Metrics',
    description: 'Track metrics, analyze traffic in real-time, and gain insights to optimize and protect your applications.'
  }
]`

const IMPORT = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import Default from '@aziontech/webkit/svg/azion/default'",
  '',
  STEPS_CONST
]

const PAGE_TEMPLATE = `<div class="flex min-h-full w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader>
    <GlobalHeader.Left>
      <GlobalHeader.Brand>
        <Default aria-label="Azion" />
      </GlobalHeader.Brand>
    </GlobalHeader.Left>
  </GlobalHeader>

  <main class="flex flex-1 flex-col items-center justify-center px-(--spacing-xxl) py-(--spacing-xxl)">
    <CardBox class="w-full max-w-[512px]" :padded="false">
      <template #header>
        <div class="flex w-full flex-col items-center gap-(--spacing-xs) px-(--spacing-xl) py-(--spacing-md) text-center">
          <span class="inline-flex size-8 items-center justify-center">
            <i class="pi pi-check text-heading-sm leading-none text-(--success)" aria-hidden="true" />
          </span>
          <div class="flex w-full max-w-[360px] flex-col gap-(--spacing-xxs) [word-break:break-word]">
            <h1 class="text-heading-sm text-(--text-default)">Your Pro Plan is now Active</h1>
            <p class="text-body-xs text-(--text-muted)">A receipt has been sent to your email for your records.</p>
          </div>
        </div>
      </template>

      <template #content>
        <div class="flex w-full flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-xl)">
          <p class="w-full text-button-md text-(--text-muted) [word-break:break-word]">Next Steps</p>
          <ol class="flex w-full list-none flex-col gap-(--spacing-md) p-0">
            <li
              v-for="(step, index) in steps"
              :key="index"
              class="flex w-full items-start justify-between gap-(--spacing-sm)"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-button) bg-(--bg-hover) px-(--spacing-xs) text-button-md text-(--text-default)"
                aria-hidden="true"
              >
                {{ index + 1 }}
              </div>
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) [word-break:break-word]">
                <p class="text-body-sm text-(--text-default)">{{ step.title }}</p>
                <p class="text-body-xs text-(--text-muted)">{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </template>

      <template #footer>
        <Button label="Start deploying" kind="primary" size="medium" class="w-full" />
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
  'GlobalHeader.Brand': GlobalHeader.Brand
}

/** @type {import('@storybook/vue3').Meta<typeof CardBox>} */
const meta = {
  title: 'Templates/PlanSuccess',
  component: CardBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Full-page post-checkout success screen for the Azion Plans flow, composed from `GlobalHeader`, `CardBox` and `Button`: a global header with the brand, a centered card with the activation message, numbered next steps, and a primary deploy CTA.'
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
  render: () => ({ components, setup: () => ({ steps }), template: PAGE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story: 'Plan activation success screen as shown at the end of the Azion Plans checkout flow.'
      },
      source: { code: toSfc(IMPORT, PAGE_TEMPLATE) }
    }
  }
}
