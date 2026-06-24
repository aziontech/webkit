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
import { ref } from 'vue'

const billingDetailMonthly = 'Billed annually or $25/mo billed monthly.'
const billingDetailEnterprise = 'Billed annually or $250/mo billed monthly.'

const planFeatureItems = [
  { icon: 'pi pi-globe', label: 'Infraestrutura global' },
  { icon: 'pi pi-code', label: 'Funções serverless' },
  { icon: 'pi pi-image', label: 'Image optimization' },
  { icon: 'ai ai-store', label: 'Armazenamento e banco de dados' },
  { icon: 'pi pi-shield', label: 'Mitigação de DDoS e firewall' }
]

const billingOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const planFeaturesSlot = `
  <ul class="m-0 flex w-full list-none flex-col gap-2 p-0">
    <li class="text-label-sm text-[var(--text-muted)] leading-none">
      Todas as funcionalidades disponíveis
    </li>
    <li
      v-for="(feature, index) in planFeatureItems"
      :key="index"
      class="flex items-center gap-[10px]"
    >
      <span
        class="flex size-5 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        <i :class="feature.icon" class="text-[var(--text-default)]" />
      </span>
      <span class="text-label-sm text-[var(--text-default)] leading-none">
        {{ feature.label }}
      </span>
    </li>
  </ul>
`

const changePlanTemplate = `
  <Drawer
    v-bind="args"
    v-model:open="open"
    data-testid="template-change-plan-drawer"
  >
    <DrawerTrigger>
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
          <div
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
              card-style="contained"
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
              card-style="contained"
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
              card-style="contained"
              action-label=""
              data-testid="template-change-plan-drawer__plan-enterprise"
            >
              ${planFeaturesSlot}
              <template #actions>
                <Button label="Contact Sales" kind="outlined" size="large" class="w-full" />
              </template>
            </CardPricing>
          </div>
        </PanelContent>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
`

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

    return {
      args,
      open,
      billingPeriod,
      billingOptions,
      planFeatureItems,
      billingDetailMonthly,
      billingDetailEnterprise
    }
  },
  template: changePlanTemplate
})

export default {
  title: 'Templates/ChangePlanDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Change Plan drawer template. Composes Webkit Drawer with CardPricing plans and a billing period toggle.'
      }
    }
  },
  decorators: [
    () => ({
      template: '<div class="flex min-h-screen w-full items-center justify-center"><story /></div>'
    })
  ],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled',
      table: { defaultValue: { summary: false }, category: 'props' }
    },
    closeable: {
      control: 'boolean',
      description: 'When true, Escape and overlay click close the drawer',
      table: { defaultValue: { summary: true }, category: 'props' }
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Edge the panel slides from',
      table: { defaultValue: { summary: 'right' }, category: 'props' }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Panel max-width preset (`large` = 1024px). Drawer height is always 100% viewport.',
      table: { defaultValue: { summary: 'large' }, category: 'props' }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when open state changes',
      table: { category: 'events' }
    }
  },
  args: {
    defaultOpen: false,
    closeable: true,
    side: 'right',
    size: 'large'
  }
}

export const Default = {
  render: Template
}
