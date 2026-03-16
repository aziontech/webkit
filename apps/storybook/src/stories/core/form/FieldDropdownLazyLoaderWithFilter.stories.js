import FieldDropdownLazyLoaderWithFilter from '@aziontech/webkit/field-dropdown-lazy-loader-with-filter';

// Mock service functions for Storybook
const mockService = async ({ pageSize, page, search }) => {
  // Simulate paginated API response
  const allItems = [
    { name: 'Filtered Option 1', id: 'filt1', icon: 'pi pi-check' },
    { name: 'Filtered Option 2', id: 'filt2', icon: 'pi pi-check' },
    { name: 'Filtered Option 3', id: 'filt3', icon: 'pi pi-check' },
    { name: 'Filtered Option 4', id: 'filt4', icon: 'pi pi-check' },
    { name: 'Filtered Option 5', id: 'filt5', icon: 'pi pi-check' }
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
    'filt1': { name: 'Filtered Option 1', id: 'filt1', icon: 'pi pi-check' },
    'filt2': { name: 'Filtered Option 2', id: 'filt2', icon: 'pi pi-check' }
  };
  return items[id];
};

export default {
  title: 'Core/Form/FieldDropdownLazyLoaderWithFilter',
  component: FieldDropdownLazyLoaderWithFilter,
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
    keyToFilter: {
      control: 'text',
      description: 'Key to use for filtering options'
    },
    valuesToFilter: {
      control: 'object',
      description: 'Array of values to filter by'
    },
    showGroup: {
      control: 'boolean',
      description: 'Whether to show grouped options'
    },
    optionGroupLabel: {
      control: 'text',
      description: 'Property name for option group label'
    },
    optionGroupChildren: {
      control: 'text',
      description: 'Property name for option group children'
    },
    defaultGroup: {
      control: 'text',
      description: 'Default group name for ungrouped options'
    }
  }
};

export const Default = {
  args: {
    name: 'field-dropdown-lazy-filter-default',
    label: 'Lazy Dropdown with Filter',
    placeholder: 'Select an option...',
    description: 'Type to filter options, scroll to load more',
    optionLabel: 'name',
    optionValue: 'id',
    service: mockService,
    loadService: mockLoadService
  }
};
