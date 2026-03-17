import FieldDropdownMultiSelectLazyLoader from '@aziontech/webkit/field-dropdown-multi-select-lazy-loader';

// Mock service functions for Storybook
const mockService = async ({ pageSize, page, search }) => {
  // Simulate paginated API response
  const allItems = [
    { name: 'Multi Option 1', id: 'multi1' },
    { name: 'Multi Option 2', id: 'multi2' },
    { name: 'Multi Option 3', id: 'multi3' },
    { name: 'Multi Option 4', id: 'multi4' },
    { name: 'Multi Option 5', id: 'multi5' }
  ];
  
  const start = (page - 1) * pageSize;
  const filtered = search 
    ? allItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    : allItems;
  
  return {
    count: filtered.length,
    body: filtered.slice(start, start + pageSize)
  };
};

const mockLoadService = async ({ id }) => {
  // Simulate loading items by IDs
  const items = {
    'multi1': { name: 'Multi Option 1', id: 'multi1' },
    'multi2': { name: 'Multi Option 2', id: 'multi2' }
  };
  return items[id];
};

export default {
  title: 'Core/Form/FieldDropdownMultiSelectLazyLoader',
  component: FieldDropdownMultiSelectLazyLoader,
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
    optionLabel: {
      control: 'text',
      description: 'Property name to use for option label'
    },
    optionValue: {
      control: 'text',
      description: 'Property name to use for option value'
    },
    moreOptions: {
      control: 'object',
      description: 'Array of additional field keys to include from API response'
    },
    optionDisabled: {
      control: 'text',
      description: 'Property name or function to determine disabled options'
    },
    service: {
      control: false,
      description: 'Async function for fetching paginated options (required)'
    },
    loadService: {
      control: false,
      description: 'Async function for loading selected values (required)'
    },
    enableWorkaroundLabelToDisabledOptions: {
      control: 'boolean',
      description: 'Enables workaround for labeling disabled options'
    },
    enableClearOption: {
      control: 'boolean',
      description: 'Shows clear button to reset selection'
    },
    disableEmitFirstRender: {
      control: 'boolean',
      description: 'Disables emitting events on first render'
    },
    validationRules: {
      control: 'object',
      description: 'Validation rules for the field'
    }
  }
};

export const Default = {
  args: {
    name: 'field-dropdown-multiselect-lazy-default',
    label: 'Multi-Select Lazy Loading Dropdown',
    placeholder: 'Select options...',
    description: 'Select multiple options, loaded on demand',
    optionLabel: 'name',
    optionValue: 'id',
    service: mockService,
    loadService: mockLoadService
  }
};
