import SegmentedButton from '@aziontech/webkit/segmented-button'

export default {
  title: 'Core/SegmentedButton',
  component: SegmentedButton,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected option'
    },
    options: {
      control: 'object',
      description: 'Array of segmented options with { label, value, disabled? }'
    }
  }
}

export const Default = {
  args: {
    modelValue: 'yearly',
    options: [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' }
    ]
  }
}

export const MonthlySelected = {
  args: {
    modelValue: 'monthly',
    options: [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' }
    ]
  }
}

export const ThreeOptions = {
  args: {
    modelValue: 'standard',
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Standard', value: 'standard' },
      { label: 'Premium', value: 'premium' }
    ]
  }
}

export const WithDisabledOption = {
  args: {
    modelValue: 'monthly',
    options: [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly', disabled: true }
    ]
  }
}
