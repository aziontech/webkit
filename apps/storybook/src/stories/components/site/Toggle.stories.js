import Toggle from '@aziontech/webkit/site/toggle'

export default {
  title: 'Components/Site/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'radio',
      options: ['main', 'alternative'],
      description: 'Currently selected option'
    },
    mainLabel: {
      control: 'text',
      description: 'Label for the main option'
    },
    alternativeLabel: {
      control: 'text',
      description: 'Label for the alternative option'
    },
    description: {
      control: 'text',
      description: 'Optional description text below the toggle'
    }
  }
}

export const Default = {
  args: {
    modelValue: 'main',
    mainLabel: 'monthly',
    alternativeLabel: 'yearly'
  }
}

export const WithDescription = {
  args: {
    modelValue: 'main',
    mainLabel: 'monthly',
    alternativeLabel: 'yearly',
    description: 'Save up to 15% with yearly billing'
  }
}

export const AlternativeSelected = {
  args: {
    modelValue: 'alternative',
    mainLabel: 'monthly',
    alternativeLabel: 'yearly'
  }
}

export const CustomLabels = {
  args: {
    modelValue: 'main',
    mainLabel: 'basic',
    alternativeLabel: 'pro',
    description: 'Choose your plan type'
  }
}
