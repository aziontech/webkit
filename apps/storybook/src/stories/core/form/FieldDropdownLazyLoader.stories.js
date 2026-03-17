import FieldDropdownLazyLoader from '@aziontech/webkit/field-dropdown-lazy-loader';

// Mock service functions for Storybook
const mockService = async ({ pageSize, page, search }) => {
  // Simulate paginated API response
  const allItems = [
    { name: 'Option 1', id: 'opt1' },
    { name: 'Option 2', id: 'opt2' },
    { name: 'Option 3', id: 'opt3' },
    { name: 'Option 4', id: 'opt4' },
    { name: 'Option 5', id: 'opt5' }
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
    'opt1': { name: 'Option 1', id: 'opt1' },
    'opt2': { name: 'Option 2', id: 'opt2' }
  };
  return items[id];
};

export default {
  title: 'Core/Form/FieldDropdownLazyLoader',
  component: FieldDropdownLazyLoader,
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
    optionGroupLabel: {
      control: 'text',
      description: 'Property name for option group label'
    },
    optionGroupChildren: {
      control: 'text',
      description: 'Property name for option group children'
    },
    defaultPosition: {
      control: 'number',
      description: 'Default position index for grouped data'
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show an icon for selected option'
    },
    iconColor: {
      control: 'object',
      description: 'Object mapping icon names to colors'
    }
  }
};

export const Default = {
  args: {
    name: 'field-dropdown-lazy-default',
    label: 'Lazy Loading Dropdown',
    placeholder: 'Select an option...',
    description: 'Options are loaded on demand as you scroll',
    optionLabel: 'name',
    optionValue: 'id',
    service: mockService,
    loadService: mockLoadService
  }
};
