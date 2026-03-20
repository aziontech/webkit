import FieldDropdown from '@aziontech/webkit/field-dropdown';

export default {
  title: 'Core/Form/FieldDropdown',
  component: FieldDropdown,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Initial value of the dropdown'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the dropdown'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the dropdown'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown'
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
    optionGroupLabel: {
      control: 'text',
      description: 'Property name for option group label'
    },
    optionGroupChildren: {
      control: 'text',
      description: 'Property name for option group children'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading indicator'
    },
    filter: {
      control: 'boolean',
      description: 'Enables filtering of options'
    },
    editable: {
      control: 'boolean',
      description: 'Allows custom input value'
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no options available'
    },
    emptyFilterMessage: {
      control: 'text',
      description: 'Message to display when filter has no results'
    },
    additionalError: {
      control: 'text',
      description: 'Additional error message to display'
    },
    enableWorkaroundLabelToDisabledOptions: {
      control: 'boolean',
      description: 'Enables workaround for labeling disabled options'
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
    name: 'field-dropdown-default',
    label: 'Dropdown Field',
    placeholder: 'Select an option...',
    options: sampleOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-disabled',
    label: 'Disabled Dropdown',
    placeholder: 'Cannot select',
    disabled: true,
    options: sampleOptions
  }
};

export const WithDescription = {
  args: {
    name: 'field-dropdown-desc',
    label: 'Dropdown with Description',
    placeholder: 'Select an option...',
    description: 'Choose one option from the dropdown list',
    options: sampleOptions
  }
};

export const WithPreselectedValue = {
  args: {
    name: 'field-dropdown-preselected',
    label: 'Preselected Dropdown',
    value: 'option2',
    options: sampleOptions
  }
};

export const WithFilter = {
  args: {
    name: 'field-dropdown-filter',
    label: 'Filterable Dropdown',
    placeholder: 'Type to filter...',
    filter: true,
    options: sampleOptions
  }
};

export const Loading = {
  args: {
    name: 'field-dropdown-loading',
    label: 'Loading Dropdown',
    placeholder: 'Loading options...',
    loading: true,
    options: []
  }
};

export const WithError = {
  args: {
    name: 'field-dropdown-error',
    label: 'Dropdown with Error',
    placeholder: 'Select an option...',
    additionalError: 'This field has an error',
    options: sampleOptions
  }
};
