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
      description: 'Array of items with {value, icon, description, disabled?, ariaLabel?}'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all selections'
    },
    columns: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Number of grid columns (1-4, default: 3)'
    }
  }
}

const planItems = [
  {
    value: 'hobby',
    icon: 'pi pi-sparkles',
    description: 'For learning and small personal projects.',
    tag: 'Hobby Plan'
  },
  {
    value: 'pro',
    icon: 'pi pi-chart-line',
    description: 'For professional or commercial applications.',
    tag: 'Pro Plan'
  },
  {
    value: 'scale',
    icon: 'pi pi-file-check',
    description: 'For businesses requiring advanced security and compliance.',
    tag: 'Scale Plan'
  }
]

const basicItems = [
  { value: 'option1', icon: 'pi pi-check', description: 'First option description' },
  { value: 'option2', icon: 'pi pi-times', description: 'Second option description' },
  { value: 'option3', icon: 'pi pi-star', description: 'Third option description' }
]

export const PlanSelection = {
  args: {
    modelValue: 'hobby',
    columns: 3,
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
    columns: 3,
    items: basicItems
  }
}

export const WithTwoColumns = {
  args: {
    modelValue: 'option1',
    columns: 2,
    items: [
      { value: 'option1', icon: 'pi pi-desktop', description: 'Desktop application' },
      { value: 'option2', icon: 'pi pi-mobile', description: 'Mobile application' }
    ]
  }
}

export const WithFourColumns = {
  args: {
    modelValue: 'option2',
    columns: 4,
    items: [
      { value: 'option1', icon: 'pi pi-cloud', description: 'Cloud storage' },
      { value: 'option2', icon: 'pi pi-database', description: 'Database service' },
      { value: 'option3', icon: 'pi pi-server', description: 'Server hosting' },
      { value: 'option4', icon: 'pi pi-shield', description: 'Security suite' }
    ]
  }
}

export const Disabled = {
  args: {
    modelValue: 'option1',
    columns: 3,
    items: basicItems,
    disabled: true
  }
}

export const WithDisabledItem = {
  args: {
    modelValue: 'option1',
    columns: 3,
    items: [
      { value: 'option1', icon: 'pi pi-check', description: 'Available option' },
      { value: 'option2', icon: 'pi pi-times', description: 'Unavailable option', disabled: true },
      { value: 'option3', icon: 'pi pi-star', description: 'Available option' }
    ]
  }
}

export const Interactive = {
  args: {
    modelValue: 'hobby',
    columns: 3,
    items: planItems
  },
  render: (args) => ({
    components: { BoxGridSelection, Tag },
    data() {
      return {
        selectedValue: 'hobby'
      }
    },
    methods: {
      handleChange(item) {
        console.log('Selected:', item)
      }
    },
    template: `
      <div class="flex flex-col gap-4">
        <BoxGridSelection 
          v-model="selectedValue" 
          :items="args.items"
          :columns="args.columns"
          @change="handleChange"
        >
          <template #tag="{ item }">
            <Tag 
              :value="item.tag" 
              severity="info" 
              class="font-mono text-xs"
            />
          </template>
        </BoxGridSelection>
        <p class="text-sm text-color-secondary">
          Selected plan: <strong class="text-color">{{ selectedValue }}</strong>
        </p>
      </div>
    `
  })
}

export const WithoutIcons = {
  args: {
    modelValue: 'basic',
    columns: 3,
    items: [
      { value: 'basic', description: 'Basic tier with essential features' },
      { value: 'standard', description: 'Standard tier with more features' },
      { value: 'premium', description: 'Premium tier with all features' }
    ]
  }
}

export const SingleColumn = {
  args: {
    modelValue: 'option1',
    columns: 1,
    items: [
      { value: 'option1', icon: 'pi pi-upload', description: 'Upload files from your computer' },
      { value: 'option2', icon: 'pi pi-cloud-upload', description: 'Import from cloud storage' },
      { value: 'option3', icon: 'pi pi-link', description: 'Import from URL' }
    ]
  }
}
