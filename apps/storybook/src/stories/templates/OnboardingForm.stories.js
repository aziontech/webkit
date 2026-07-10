import { ref, watch } from 'vue'

import OnboardingForm from '@aziontech/webkit/onboarding-form'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import OnboardingForm from '@aziontech/webkit/onboarding-form'"

const defaultUsageItems = [
  { value: 'learn', label: 'Learn', ariaLabel: 'Learn usage intent' },
  { value: 'personal', label: 'Personal Project', ariaLabel: 'Personal project usage intent' },
  { value: 'work', label: 'Work', ariaLabel: 'Work usage intent' }
]

/** @type {import('@storybook/vue3').Meta<typeof OnboardingForm>} */
const meta = {
  title: 'Templates/OnboardingForm',
  component: OnboardingForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Post-signup onboarding layout wrapped in a card: plan summary, usage intent grid, full name field, optional expert-session checkbox, primary continue action, and enterprise footer CTA.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title above the form sections.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Your first global deployment is seconds away'" }
      }
    },
    planLabel: {
      control: 'text',
      description: 'Label above the plan summary card.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Plan Selected'" }
      }
    },
    planTitle: {
      control: 'text',
      description: 'Selected plan name in the summary card.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Hobby'" }
      }
    },
    planPrice: {
      control: 'text',
      description: 'Price badge text beside the plan title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Free'" } }
    },
    planDescription: {
      control: 'text',
      description: 'Supporting copy under the plan title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'For professional or commercial workloads.'" }
      }
    },
    changeLabel: {
      control: 'text',
      description: 'Label for the plan change action button.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Change'" }
      }
    },
    usageLabel: {
      control: 'text',
      description: 'Label for the usage intent grid.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'How are you planning to use Azion?'" }
      }
    },
    usageRequired: {
      control: 'boolean',
      description: 'When true, appends a required indicator to the usage label.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    usageValue: {
      control: 'text',
      description: 'Selected usage option (v-model).',
      table: { category: 'props', type: { summary: 'string | number' } }
    },
    usageItems: {
      control: 'object',
      description: 'Options rendered as selectable cards by the usage intent grid.',
      table: {
        category: 'props',
        type: { summary: 'BoxGridSelectionItem[]', required: true }
      }
    },
    fullNameLabel: {
      control: 'text',
      description: 'Label for the full name field.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Your Full Name'" }
      }
    },
    fullNameRequired: {
      control: 'boolean',
      description: 'When true, appends a required indicator to the full name label.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    fullName: {
      control: 'text',
      description: 'Full name value (v-model).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    fullNamePlaceholder: {
      control: 'text',
      description: 'Placeholder for the full name input.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'John Doe'" }
      }
    },
    scheduleLabel: {
      control: 'text',
      description: 'Label for the scheduling checkbox.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Schedule an onboarding session with an Azion expert'" }
      }
    },
    scheduleOnboarding: {
      control: 'boolean',
      description: 'Whether the scheduling checkbox is checked (v-model).',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    continueLabel: {
      control: 'text',
      description: 'Primary submit button label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Continue'" }
      }
    },
    continueDisabled: {
      control: 'boolean',
      description: 'Disables the continue button.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all interactive fields in the template.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    footerPrefix: {
      control: 'text',
      description: 'Footer prompt before the contact link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Have enterprise requirements?'" }
      }
    },
    footerLinkLabel: {
      control: 'text',
      description: 'Footer contact link label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Get in touch'" }
      }
    },
    footerLinkHref: {
      control: 'text',
      description: 'Footer contact link URL.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'#'" } }
    },
    'onUpdate:usageValue': {
      action: 'update:usageValue',
      description: 'Emitted when the usage selection changes (v-model).',
      table: { category: 'events', type: { summary: 'string | number' } }
    },
    'onUpdate:fullName': {
      action: 'update:fullName',
      description: 'Emitted when the full name value changes (v-model).',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:scheduleOnboarding': {
      action: 'update:scheduleOnboarding',
      description: 'Emitted when the scheduling checkbox toggles (v-model).',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onChangeClick: {
      action: 'change-click',
      description: 'Fires when the plan change button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onContinueClick: {
      action: 'continue-click',
      description: 'Fires when the continue button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onFooterLinkClick: {
      action: 'footer-link-click',
      description: 'Fires when the footer contact link is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    plan: {
      control: false,
      description: 'Replaces the built-in plan summary card.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    footer: {
      control: false,
      description: 'Replaces the built-in enterprise footer bar.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    title: 'Your first global deployment is seconds away',
    planLabel: 'Plan Selected',
    planTitle: 'Hobby',
    planPrice: 'Free',
    planDescription: 'For professional or commercial workloads.',
    changeLabel: 'Change',
    usageLabel: 'How are you planning to use Azion?',
    usageRequired: true,
    usageValue: 'personal',
    usageItems: defaultUsageItems,
    fullNameLabel: 'Your Full Name',
    fullNameRequired: true,
    fullName: '',
    fullNamePlaceholder: 'John Doe',
    scheduleLabel: 'Schedule an onboarding session with an Azion expert',
    scheduleOnboarding: true,
    continueLabel: 'Continue',
    continueDisabled: false,
    disabled: false,
    footerPrefix: 'Have enterprise requirements?',
    footerLinkLabel: 'Get in touch',
    footerLinkHref: '#'
  }
}

export default meta

const Template = (args) => ({
  components: { OnboardingForm },
  setup() {
    const usageValue = ref(args.usageValue ?? 'personal')
    const fullName = ref(args.fullName ?? '')
    const scheduleOnboarding = ref(args.scheduleOnboarding ?? true)

    watch(
      () => args.usageValue,
      (next) => {
        usageValue.value = next ?? 'personal'
      }
    )
    watch(
      () => args.fullName,
      (next) => {
        fullName.value = next ?? ''
      }
    )
    watch(
      () => args.scheduleOnboarding,
      (next) => {
        scheduleOnboarding.value = next ?? true
      }
    )

    const onUpdateUsage = (next) => {
      usageValue.value = next
      args['onUpdate:usageValue']?.(next)
    }
    const onUpdateFullName = (next) => {
      fullName.value = next
      args['onUpdate:fullName']?.(next)
    }
    const onUpdateSchedule = (next) => {
      scheduleOnboarding.value = next
      args['onUpdate:scheduleOnboarding']?.(next)
    }

    return {
      args,
      usageValue,
      fullName,
      scheduleOnboarding,
      onUpdateUsage,
      onUpdateFullName,
      onUpdateSchedule
    }
  },
  template: `
    <OnboardingForm
      v-bind="args"
      :usage-value="usageValue"
      :full-name="fullName"
      :schedule-onboarding="scheduleOnboarding"
      @update:usage-value="onUpdateUsage"
      @update:full-name="onUpdateFullName"
      @update:schedule-onboarding="onUpdateSchedule"
    />
  `
})

const DEFAULT_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const usageItems = [',
  "  { value: 'learn', label: 'Learn', ariaLabel: 'Learn usage intent' },",
  "  { value: 'personal', label: 'Personal Project', ariaLabel: 'Personal project usage intent' },",
  "  { value: 'work', label: 'Work', ariaLabel: 'Work usage intent' }",
  ']',
  "const usageValue = ref('personal')",
  "const fullName = ref('')",
  'const scheduleOnboarding = ref(true)'
]

const DEFAULT_MARKUP = `<OnboardingForm
  :usage-items="usageItems"
  v-model:usage-value="usageValue"
  v-model:full-name="fullName"
  v-model:schedule-onboarding="scheduleOnboarding"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof OnboardingForm>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding form matching the post-signup deployment flow.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}
