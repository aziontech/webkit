import FieldMultiSelect from '@aziontech/webkit/field-multi-select';

export default {
  title: 'Core/Form/FieldMultiSelect',
  component: FieldMultiSelect,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'object',
      description: 'Initial selected values as an array'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the multi-select'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no options are selected'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the multi-select'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the multi-select'
    },
    options: {
      control: 'object',
      description: 'Array of options to display'
    },
    optionLabel: {
      control: 'text',
      description: 'Property name to use for option label'
    },
    optionValue: {
      control: 'text',
      description: 'Property name to use for option value'
    },
    optionDisabled: {
      control: 'text',
      description: 'Property name or function to determine disabled options'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading indicator'
    },
    filter: {
      control: 'boolean',
      description: 'Enables filtering of options'
    },
    pt: {
      control: 'object',
      description: 'Pass-through styles for PrimeVue components'
    }
  }
};

const sampleOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' }
];

export const Default = {
  args: {
    name: 'field-multiselect-default',
    label: 'Multi-Select Field',
    placeholder: 'Select options...',
    options: sampleOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-multiselect-disabled',
    label: 'Disabled Multi-Select',
    placeholder: 'Cannot select',
    disabled: true,
    options: sampleOptions
  }
};

export const WithDescription = {
  args: {
    name: 'field-multiselect-desc',
    label: 'Multi-Select with Description',
    placeholder: 'Select options...',
    description: 'Select multiple options from the list',
    options: sampleOptions
  }
};

export const WithFilter = {
  args: {
    name: 'field-multiselect-filter',
    label: 'Filterable Multi-Select',
    placeholder: 'Type to filter...',
    filter: true,
    options: sampleOptions
  }
};

export const Loading = {
  args: {
    name: 'field-multiselect-loading',
    label: 'Loading Multi-Select',
    placeholder: 'Loading...',
    loading: true,
    options: []
  }
};

export const WithPreselectedValues = {
  args: {
    name: 'field-multiselect-preselected',
    label: 'Pre-selected Multi-Select',
    value: ['option1', 'option3'],
    options: sampleOptions
  }
};
