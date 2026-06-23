import { ref } from 'vue'

import OnboardingForm from '@aziontech/webkit/templates/onboarding-form'

/** @type {import('@storybook/vue3').Meta<typeof OnboardingForm>} */
const meta = {
  title: 'Templates/Onboarding Form',
  component: OnboardingForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Post-signup onboarding layout with plan summary, usage intent grid, full name, scheduling checkbox, continue action, and enterprise footer CTA.'
      }
    }
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'Page title above the form sections.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    planLabel: {
      control: 'text',
      description: 'Label above the plan summary card.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    planTitle: {
      control: 'text',
      description: 'Selected plan name in the summary card.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    planPrice: {
      control: 'text',
      description: 'Price badge text beside the plan title.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    planDescription: {
      control: 'text',
      description: 'Supporting copy under the plan title.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    changeLabel: {
      control: 'text',
      description: 'Label for the plan change action button.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    usageLabel: {
      control: 'text',
      description: 'Label for the usage intent grid.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    usageRequired: {
      control: 'boolean',
      description: 'When true, appends a required indicator to the usage label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    usageValue: {
      control: 'text',
      description: 'Selected usage option (v-model).',
      table: { type: { summary: 'string | number' }, category: 'props' }
    },
    usageItems: {
      control: 'object',
      description: 'Options for BoxGridSelection.',
      table: { type: { summary: 'BoxGridSelectionItem[]' }, category: 'props' }
    },
    fullNameLabel: {
      control: 'text',
      description: 'Label for the full name field.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    fullNameRequired: {
      control: 'boolean',
      description: 'When true, appends a required indicator to the full name label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    fullName: {
      control: 'text',
      description: 'Full name value (v-model).',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    fullNamePlaceholder: {
      control: 'text',
      description: 'Placeholder for the full name input.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    scheduleLabel: {
      control: 'text',
      description: 'Label for the scheduling checkbox.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    scheduleOnboarding: {
      control: 'boolean',
      description: 'Whether the scheduling checkbox is checked (v-model).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    continueLabel: {
      control: 'text',
      description: 'Primary submit button label.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    continueDisabled: {
      control: 'boolean',
      description: 'Disables the continue button.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all interactive fields in the template.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    footerPrefix: {
      control: 'text',
      description: 'Footer prompt before the contact link.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    footerLinkLabel: {
      control: 'text',
      description: 'Footer contact link label.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    footerLinkHref: {
      control: 'text',
      description: 'Footer contact link URL.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    'onUpdate:usageValue': {
      action: 'update:usageValue',
      description: 'v-model for usage selection.',
      table: { type: { summary: 'string | number' }, category: 'events' }
    },
    'onUpdate:fullName': {
      action: 'update:fullName',
      description: 'v-model for full name.',
      table: { type: { summary: 'string' }, category: 'events' }
    },
    'onUpdate:scheduleOnboarding': {
      action: 'update:scheduleOnboarding',
      description: 'v-model for scheduling checkbox.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    },
    onChangeClick: {
      action: 'change-click',
      description: 'Fires when the plan change button is activated.',
      table: { type: { summary: 'MouseEvent' }, category: 'events' }
    },
    onContinueClick: {
      action: 'continue-click',
      description: 'Fires when the continue button is activated.',
      table: { type: { summary: 'MouseEvent' }, category: 'events' }
    },
    onFooterLinkClick: {
      action: 'footer-link-click',
      description: 'Fires when the footer contact link is activated.',
      table: { type: { summary: 'MouseEvent' }, category: 'events' }
    },
    plan: {
      control: false,
      description: 'Replaces the built-in plan summary card.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    footer: {
      control: false,
      description: 'Replaces the built-in enterprise footer bar.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  }
}

export default meta

const defaultUsageItems = [
  { value: 'learn', label: 'Learn', ariaLabel: 'Learn usage intent' },
  { value: 'personal', label: 'Personal Project', ariaLabel: 'Personal project usage intent' },
  { value: 'work', label: 'Work', ariaLabel: 'Work usage intent' }
]

const Template = (args) => ({
  components: { OnboardingForm },
  setup() {
    const usageValue = ref(args.usageValue ?? 'personal')
    const fullName = ref(args.fullName ?? '')
    const scheduleOnboarding = ref(args.scheduleOnboarding ?? true)

    return { args, usageValue, fullName, scheduleOnboarding }
  },
  template: `
    <OnboardingForm
      v-bind="args"
      v-model:usage-value="usageValue"
      v-model:full-name="fullName"
      v-model:schedule-onboarding="scheduleOnboarding"
    />
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof OnboardingForm>} */
export const Default = {
  args: {
    usageValue: 'personal',
    usageItems: defaultUsageItems,
    fullName: '',
    scheduleOnboarding: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding form matching the post-signup deployment flow.'
      }
    }
  }
}
