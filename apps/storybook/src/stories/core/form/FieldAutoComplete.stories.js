import FieldAutoComplete from '@aziontech/webkit/field-auto-complete';

export default {
  title: 'Core/Form/FieldAutoComplete',
  component: FieldAutoComplete,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
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
      description: 'Disables the autocomplete'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only'
    },
    icon: {
      control: 'text',
      description: 'Icon class to display in the input addon (e.g., "pi pi-search")'
    },
    suggestions: {
      control: 'object',
      description: 'Array of suggestions to display'
    },
    onComplete: {
      control: false,
      description: 'Callback function when user types (for loading suggestions)'
    },
    completeOnFocus: {
      control: 'boolean',
      description: 'Whether to show suggestions on focus'
    }
  }
};

const sampleSuggestions = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry'];

const handleComplete = (event) => {
  // In a real app, this would fetch suggestions from an API
  console.log('Search query:', event.query);
};

export const Default = {
  args: {
    name: 'field-autocomplete-default',
    label: 'Autocomplete Field',
    placeholder: 'Type to search...',
    suggestions: sampleSuggestions
  }
};

export const Disabled = {
  args: {
    name: 'field-autocomplete-disabled',
    label: 'Disabled Autocomplete',
    placeholder: 'Cannot edit',
    disabled: true,
    suggestions: sampleSuggestions
  }
};

export const WithDescription = {
  args: {
    name: 'field-autocomplete-desc',
    label: 'Search',
    placeholder: 'Type to search...',
    description: 'Start typing to see suggestions',
    suggestions: sampleSuggestions
  }
};

export const WithIcon = {
  args: {
    name: 'field-autocomplete-icon',
    label: 'Search with Icon',
    placeholder: 'Search...',
    icon: 'pi pi-search',
    suggestions: sampleSuggestions
  }
};

export const Readonly = {
  args: {
    name: 'field-autocomplete-readonly',
    label: 'Read-only Autocomplete',
    value: 'Pre-filled value',
    readonly: true
  }
};

export const WithCompleteOnFocus = {
  args: {
    name: 'field-autocomplete-focus',
    label: 'Show Suggestions on Focus',
    placeholder: 'Click to see suggestions',
    completeOnFocus: true,
    suggestions: sampleSuggestions
  }
};
