import FieldDropdownLazyLoaderDynamic from '@aziontech/webkit/field-dropdown-lazy-loader-dynamic';

// Mock service functions for Storybook
const mockService = async ({ pageSize, page, search }) => {
  // Simulate paginated API response
  const allItems = [
    { name: 'Dynamic Option 1', id: 'dyn1' },
    { name: 'Dynamic Option 2', id: 'dyn2' },
    { name: 'Dynamic Option 3', id: 'dyn3' },
    { name: 'Dynamic Option 4', id: 'dyn4' },
    { name: 'Dynamic Option 5', id: 'dyn5' }
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
  // Simulate loading a single item by ID
  const items = {
    'dyn1': { name: 'Dynamic Option 1', id: 'dyn1' },
    'dyn2': { name: 'Dynamic Option 2', id: 'dyn2' }
  };
  return items[id];
};

export default {
  title: 'Core/Form/FieldDropdownLazyLoaderDynamic',
  component: FieldDropdownLazyLoaderDynamic,
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
      description: 'Async function for loading selected value (required)'
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
    initalData: {
      control: 'object',
      description: 'Initial data array for the dropdown'
    }
  }
};

export const Default = {
  args: {
    name: 'field-dropdown-lazy-dynamic-default',
    label: 'Dynamic Lazy Loading Dropdown',
    placeholder: 'Select an option...',
    description: 'Options are loaded dynamically based on context',
    optionLabel: 'name',
    optionValue: 'id',
    service: mockService,
    loadService: mockLoadService,
    initalData: []
  }
};
