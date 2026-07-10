import Button from '@aziontech/webkit/button'
import CardPricing from '@aziontech/webkit/card-pricing'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref, watch } from 'vue'

import { toSfc } from '../_shared/story-source'

const billingDetailMonthly = 'Billed annually or $25/mo billed monthly.'
const billingDetailEnterprise = 'Billed annually or $250/mo billed monthly.'

const billingOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const planFeatureItems = [
  { icon: 'pi pi-globe', label: 'Infraestrutura global' },
  { icon: 'pi pi-code', label: 'Funções serverless' },
  { icon: 'pi pi-image', label: 'Image optimization' },
  { icon: 'ai ai-store', label: 'Armazenamento e banco de dados' },
  { icon: 'pi pi-shield', label: 'Mitigação de DDoS e firewall' }
]

// Shared markup fragments — used by BOTH the render template and the "Show code"
// snippet so the canvas and the snippet can never drift.
const planFeaturesSlot = `<ul class="m-0 flex w-full list-none flex-col gap-2 p-0">
  <li class="text-label-sm text-[var(--text-muted)] leading-none">
    Todas as funcionalidades disponíveis
  </li>
  <li
    v-for="(feature, index) in planFeatureItems"
    :key="index"
    class="flex items-center gap-[10px]"
  >
    <span class="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
      <i :class="feature.icon" class="text-[var(--text-default)]" />
    </span>
    <span class="text-label-sm text-[var(--text-default)] leading-none">
      {{ feature.label }}
    </span>
  </li>
</ul>`

const plansMarkup = `<div
  class="flex w-full min-w-0 flex-col items-stretch justify-center gap-[var(--spacing-6)] lg:flex-row"
  data-testid="template-change-plan-drawer__plans"
>
  <CardPricing
    class="!w-full min-w-0 flex-1 max-w-none"
    plan-title="Hobby"
    description="The perfect starting place"
    value="Free"
    :show-prefix="false"
    :show-suffix="false"
    :pricing-details="billingDetailMonthly"
    slot-position="middle"
    kind="contained"
    action-label=""
    data-testid="template-change-plan-drawer__plan-hobby"
  >
    ${planFeaturesSlot}
    <template #actions>
      <Button label="Downgrade" kind="outlined" size="large" class="w-full" />
    </template>
  </CardPricing>
  <CardPricing
    class="!w-full min-w-0 flex-1 max-w-none"
    plan-title="Pro"
    :description="billingDetailMonthly"
    value="20"
    prefix="$"
    suffix="per month"
    :pricing-details="billingDetailMonthly"
    :show-tag="true"
    tag-label="Current plan"
    slot-position="middle"
    kind="contained"
    action-label=""
    data-testid="template-change-plan-drawer__plan-pro"
  >
    ${planFeaturesSlot}
    <template #actions>
      <Button label="Upgrade to Yearly" kind="primary" size="large" class="w-full" />
    </template>
  </CardPricing>
  <CardPricing
    class="!w-full min-w-0 flex-1 max-w-none"
    plan-title="Enterprise"
    description="Suporte avançado e serviços contínuos."
    value="Custom"
    :show-prefix="false"
    :show-suffix="false"
    :pricing-details="billingDetailEnterprise"
    slot-position="middle"
    kind="contained"
    action-label=""
    data-testid="template-change-plan-drawer__plan-enterprise"
  >
    ${planFeaturesSlot}
    <template #actions>
      <Button label="Contact Sales" kind="outlined" size="large" class="w-full" />
    </template>
  </CardPricing>
</div>`

const drawerInner = `  <DrawerTrigger>
    <Button label="Change plan" kind="primary" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Change Plan</DrawerTitle>
        <DrawerClose />
      </PanelHeader>
      <PanelContent class="flex flex-col items-center gap-[var(--spacing-6)]">
        <SegmentedButton
          v-model="billingPeriod"
          :options="billingOptions"
          ariaLabel="Billing period"
        />
        ${plansMarkup}
      </PanelContent>
    </DrawerContent>
  </DrawerPortal>`

// Canvas: Controls drive the Drawer props via `v-bind="args"`; `open` is held
// locally so the trigger/overlay/close all work and `update:open` is logged.
const changePlanTemplate = `<Drawer
  v-bind="args"
  :open="open"
  data-testid="template-change-plan-drawer"
  @update:open="onOpenUpdate"
>
${drawerInner}
</Drawer>`

// Snippet: identical composition with concrete props (no v-bind="args") and
// idiomatic `v-model:open`, so the panel is copy-paste-runnable as-is.
const SNIPPET_SCRIPT = `import Button from '@aziontech/webkit/button'
import CardPricing from '@aziontech/webkit/card-pricing'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref } from 'vue'

const open = ref(false)
const billingPeriod = ref('yearly')

const billingDetailMonthly = 'Billed annually or $25/mo billed monthly.'
const billingDetailEnterprise = 'Billed annually or $250/mo billed monthly.'

const billingOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const planFeatureItems = [
  { icon: 'pi pi-globe', label: 'Infraestrutura global' },
  { icon: 'pi pi-code', label: 'Funções serverless' },
  { icon: 'pi pi-image', label: 'Image optimization' },
  { icon: 'ai ai-store', label: 'Armazenamento e banco de dados' },
  { icon: 'pi pi-shield', label: 'Mitigação de DDoS e firewall' }
]`

const SNIPPET_BODY = `<Drawer
  side="right"
  size="large"
  v-model:open="open"
  data-testid="template-change-plan-drawer"
>
${drawerInner}
</Drawer>`

/** @type {import('@storybook/vue3').Meta<typeof Drawer>} */
const meta = {
  title: 'Templates/ChangePlanDrawer',
  component: Drawer,
  subcomponents: {
    DrawerTrigger,
    DrawerPortal,
    DrawerOverlay,
    DrawerContent,
    DrawerTitle,
    DrawerClose,
    PanelHeader,
    PanelContent,
    SegmentedButton,
    CardPricing,
    Button
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
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
          'Change Plan drawer template. Composes the Webkit Drawer with three CardPricing plans and a billing-period toggle so users can compare and switch plans without leaving the page.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the drawer is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    dismissible: {
      control: 'boolean',
      description: 'When true, overlay click and Escape close the drawer.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Edge the drawer panel slides from.',
      table: {
        category: 'props',
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Panel max-width preset (`small` 384px, `medium` 672px, `large` 1024px). Height is always 100% viewport.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the open state changes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    defaultOpen: false,
    dismissible: true,
    side: 'right',
    size: 'large'
  }
}

export default meta

const Template = (args) => ({
  components: {
    Drawer,
    DrawerTrigger,
    DrawerPortal,
    DrawerOverlay,
    DrawerContent,
    DrawerTitle,
    DrawerClose,
    PanelHeader,
    PanelContent,
    Button,
    SegmentedButton,
    CardPricing
  },
  setup() {
    const open = ref(args.defaultOpen ?? false)
    const billingPeriod = ref('yearly')

    watch(
      () => args.defaultOpen,
      (next) => {
        open.value = next ?? false
      }
    )

    const onOpenUpdate = (next) => {
      open.value = next
      args['onUpdate:open']?.(next)
    }

    return {
      args,
      open,
      onOpenUpdate,
      billingPeriod,
      billingOptions,
      planFeatureItems,
      billingDetailMonthly,
      billingDetailEnterprise
    }
  },
  template: changePlanTemplate
})

/** @type {import('@storybook/vue3').StoryObj<typeof Drawer>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Drawer triggered by a “Change plan” button. Opening reveals a billing-period toggle above the Hobby, Pro, and Enterprise plans, each with a shared feature list and its own action.'
      },
      source: { code: toSfc(SNIPPET_SCRIPT, SNIPPET_BODY) }
    }
  }
}
