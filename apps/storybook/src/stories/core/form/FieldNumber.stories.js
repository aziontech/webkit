import FieldNumber from '@aziontech/webkit/field-number';

export default {
  title: 'Core/Form/FieldNumber',
  component: FieldNumber,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value'
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value'
    }
  }
};

export const Default = {
  args: {
    name: 'field-number-default',
    label: 'Number Field',
    placeholder: 'Enter number...'
  }
};

export const Disabled = {
  args: {
    name: 'field-number-disabled',
    label: 'Disabled Number Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithMinMax = {
  args: {
    name: 'field-number-minmax',
    label: 'Number Field with Range',
    placeholder: 'Enter number...',
    description: 'Value must be between 1 and 100',
    min: 1,
    max: 100
  }
};
