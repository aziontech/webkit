import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Tag from '@aziontech/webkit/tag'

export default {
  title: 'Core/BoxGridSelection',
  component: BoxGridSelection,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected item value (supports v-model)'
    },
    items: {
      control: 'object',
      description: 'Array of items with { value, label, icon?, description?, ariaLabel? }'
    }
  }
}

const planItems = [
  {
    value: 'hobby',
    icon: 'pi pi-sparkles',
    label: 'Hobby',
    description: 'For learning and small personal projects.',
    ariaLabel: 'Hobby plan',
    tag: 'Hobby Plan'
  },
  {
    value: 'pro',
    icon: 'pi pi-chart-line',
    label: 'Pro',
    description: 'For professional or commercial applications.',
    ariaLabel: 'Pro plan',
    tag: 'Pro Plan'
  },
  {
    value: 'scale',
    icon: 'pi pi-file-check',
    label: 'Scale',
    description: 'For businesses requiring advanced security and compliance.',
    ariaLabel: 'Scale plan',
    tag: 'Scale Plan'
  }
]

const basicItems = [
  { value: 'option1', icon: 'pi pi-check', label: 'Option One', description: 'First option description' },
  { value: 'option2', icon: 'pi pi-times', label: 'Option Two', description: 'Second option description' },
  { value: 'option3', icon: 'pi pi-star', label: 'Option Three', description: 'Third option description' }
]

export const PlanSelection = {
  args: {
    modelValue: 'hobby',
    items: planItems
  },
  render: (args) => ({
    components: { BoxGridSelection, Tag },
    setup() {
      return { args }
    },
    template: `
      <BoxGridSelection v-bind="args">
        <template #tag="{ item }">
          <Tag 
            :value="item.tag" 
            severity="info" 
            class="font-mono text-xs"
          />
        </template>
      </BoxGridSelection>
    `
  })
}

export const Default = {
  args: {
    modelValue: 'option1',
    items: basicItems
  }
}

export const SignupRoleOptions = {
  args: {
    modelValue: 'Software Developer',
    items: [
      { value: 'Software Developer', label: 'Software Developer', ariaLabel: 'Software Developer role' },
      { value: 'DevOps Engineer', label: 'DevOps Engineer', ariaLabel: 'DevOps Engineer role' },
      { value: 'Infrastructure Analyst', label: 'Infrastructure Analyst', ariaLabel: 'Infrastructure Analyst role' },
      { value: 'Security Specialist', label: 'Security Specialist', ariaLabel: 'Security Specialist role' }
    ]
  }
}

export const WithTagSlot = {
  args: {
    modelValue: 'pro',
    items: planItems
  },
  render: (args) => ({
    components: { BoxGridSelection, Tag },
    setup() {
      return { args }
    },
    template: `
      <BoxGridSelection v-bind="args">
        <template #tag="{ item }">
          <Tag
            :value="item.tag"
            severity="info"
            class="font-mono text-xs"
          />
        </template>
      </BoxGridSelection>
    `
  })
}

export const Interactive = {
  args: {
    modelValue: 'hobby',
    items: planItems
  }
}

export const MinimalLabels = {
  args: {
    items: [
      { value: 'learn', label: 'Learn' },
      { value: 'project', label: 'Personal Project' },
      { value: 'work', label: 'Work' }
    ],
    modelValue: 'learn'
  }
}
