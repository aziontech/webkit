import FieldNumber from '@aziontech/webkit/field-number';

export default {
  title: 'Core/Form/FieldNumber',
  component: FieldNumber,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'number',
      description: 'Initial value of the input'
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
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only'
    },
    inputClass: {
      control: 'text',
      description: 'Additional CSS class for the input'
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value'
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value'
    },
    step: {
      control: 'number',
      description: 'Step value for increment/decrement buttons'
    },
    showButtons: {
      control: 'boolean',
      description: 'Shows increment/decrement buttons'
    },
    useGrouping: {
      control: 'boolean',
      description: 'Uses grouping separator (e.g., thousands separator)'
    },
    additionalError: {
      control: 'text',
      description: 'Additional error message to display'
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

export const WithoutButtons = {
  args: {
    name: 'field-number-no-buttons',
    label: 'Number Field (No Buttons)',
    placeholder: 'Type a number...',
    showButtons: false
  }
};

export const WithStep = {
  args: {
    name: 'field-number-step',
    label: 'Number Field with Step',
    placeholder: 'Enter number...',
    step: 5,
    description: 'Increments/decrements by 5'
  }
};

export const WithoutGrouping = {
  args: {
    name: 'field-number-no-grouping',
    label: 'Number Field (No Grouping)',
    placeholder: 'Enter number...',
    useGrouping: false,
    description: 'No thousands separator'
  }
};

export const Readonly = {
  args: {
    name: 'field-number-readonly',
    label: 'Read-only Number Field',
    value: 42,
    readonly: true
  }
};

export const WithError = {
  args: {
    name: 'field-number-error',
    label: 'Number Field with Error',
    placeholder: 'Enter number...',
    additionalError: 'This field has an error'
  }
};
