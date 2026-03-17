import FieldText from '@aziontech/webkit/field-text';

export default {
  title: 'Core/Form/FieldText',
  component: FieldText,
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
      description: 'Disables the input field'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only'
    },
    sensitive: {
      control: 'boolean',
      description: 'Marks the field as containing sensitive data'
    },
    aditionalError: {
      control: 'text',
      description: 'Additional error message to display'
    },
    value: {
      control: 'text',
      description: 'Initial value of the input'
    }
  }
};

// Default story
export const Default = {
  args: {
    name: 'field-text-default',
    label: 'Text Field',
    placeholder: 'Enter text...',
    description: 'Helper text goes here'
  }
};

// Disabled state
export const Disabled = {
  args: {
    name: 'field-text-disabled',
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

// With error
export const WithError = {
  args: {
    name: 'field-text-error',
    label: 'Field with Error',
    placeholder: 'Enter text...',
    aditionalError: 'This field has an error'
  }
};

// Read-only
export const ReadOnly = {
  args: {
    name: 'field-text-readonly',
    label: 'Read-Only Field',
    value: 'This value cannot be changed',
    readonly: true
  }
};

// Sensitive field
export const Sensitive = {
  args: {
    name: 'field-text-sensitive',
    label: 'Sensitive Field',
    placeholder: 'Enter sensitive data...',
    sensitive: true,
    description: 'This field contains sensitive information'
  }
};

// Without label
export const WithoutLabel = {
  args: {
    name: 'field-text-no-label',
    placeholder: 'No label, just placeholder'
  }
};

// With long description
export const WithLongDescription = {
  args: {
    name: 'field-text-long-desc',
    label: 'Field with Long Description',
    placeholder: 'Enter text...',
    description: 'This is a longer description that provides more context about what the user should enter in this field. It can span multiple lines if needed.'
  }
};
